import { useState, useEffect, useRef, useCallback } from 'react';
import { detectWakeWords } from '../utils/speechUtils';

// TypeScript interfaces for Speech Recognition API
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface UseAudioSpeechRecognitionProps {
  showToast: (message: string) => void;
}

export const useAudioSpeechRecognition = ({
  showToast,
}: UseAudioSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isAwakeMode, setIsAwakeMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);
  const [transcriptionMessage, setTranscriptionMessage] = useState('');

  // Use refs to avoid stale closure issues in speech recognition handlers
  const isAwakeModeRef = useRef(isAwakeMode);
  const isPausedRef = useRef(isPaused);
  const isListeningRef = useRef(false);

  const showTranscriptToast = useCallback((message: string, duration?: number) => {
    setTranscriptionMessage(message);
    setShowTranscription(true);

    // For persistent messages (duration 0), don't auto-hide
    // For other messages, auto-hide after duration only if not showing "Listening..."
    if (duration !== 0 && message !== 'Listening...') {
      setTimeout(() => {
        setShowTranscription(false);
      }, duration || 3000); // Default 3 seconds
    }
  }, []);

  const hideTranscriptToast = useCallback(() => {
    setShowTranscription(false);
  }, []);

  // Keep refs in sync with state
  useEffect(() => {
    isAwakeModeRef.current = isAwakeMode;
  }, [isAwakeMode]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Audio level capture using Web Audio API
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Speech Recognition for transcript toast
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const startAudioCapture = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(mediaStream);
      const analyserNode = context.createAnalyser();

      // Configure for better audio level detection
      analyserNode.fftSize = 1024; // Increased for better resolution
      analyserNode.smoothingTimeConstant = 0.8; // Smoother transitions
      analyserNode.minDecibels = -90;
      analyserNode.maxDecibels = -10;

      source.connect(analyserNode);

      setStream(mediaStream);
      setAudioContext(context);
      setIsListening(true);
      isListeningRef.current = true;

      // Start speech recognition alongside audio level monitoring
      if (recognition) {
        try {
          recognition.start();
        } catch (error) {
          console.error('Error starting speech recognition:', error);
        }
      }

      // Start monitoring audio levels - Using time domain data for waveform-like visualization
      const dataArray = new Uint8Array(analyserNode.fftSize);
      const updateAudioLevel = () => {
        if (analyserNode && isListeningRef.current) {
          // Get time domain data (actual waveform amplitude)
          analyserNode.getByteTimeDomainData(dataArray);

          // Calculate RMS (Root Mean Square) for more accurate amplitude
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const sample = (dataArray[i] - 128) / 128; // Convert to -1 to 1 range
            sum += sample * sample;
          }
          const rms = Math.sqrt(sum / dataArray.length);

          // Apply sensitivity scaling and smoothing
          const sensitivity = 3; // Increased sensitivity
          const normalizedLevel = Math.min(rms * sensitivity, 1);

          // Apply logarithmic scaling for more natural response
          const logLevel = normalizedLevel > 0 ? Math.log10(normalizedLevel * 9 + 1) : 0;

          setAudioLevel(logLevel);
          requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();

    } catch (error) {
      console.error('Error accessing microphone:', error);
      showToast('❌ Error accessing microphone');
    }
  }, [recognition, showToast]);

  useEffect(() => {
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        console.log('Speech recognition started - isAwakeMode:', isAwakeMode);
        if (isAwakeMode) {
          showTranscriptToast('Listening...', 0); // Duration 0 means don't auto-hide
        }
      };

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;

        if (isAwakeModeRef.current) {
          // Awake mode: show all transcripts and handle commands
          console.log('Awake mode - processing speech:', currentTranscript);
          if (!isPausedRef.current) {
            if (currentTranscript && currentTranscript.trim()) {
              // Show actual speech transcription
              setTranscriptionMessage(currentTranscript);
              setShowTranscription(true);
            } else {
              // No speech detected, show listening prompt
              setTranscriptionMessage('Listening...');
              setShowTranscription(true);
            }
          }

          // Check for commands in awake mode (but don't overwrite transcription)
          if (finalTranscript) {
            const command = detectWakeWords(finalTranscript);
            if (command) {
              if (command.action === 'pause') {
                setIsPaused(true);
                setTranscriptionMessage('Paused - say "resume listening" or "let\'s go" to continue');
                setShowTranscription(true);
              } else if (command.action === 'resume' || command.action === 'wake_up') {
                setIsPaused(false);
                // Don't immediately overwrite with "Listening..." - let speech detection handle it
              }
            }
          }

          // Legacy stop commands that return to sleep mode
          if (finalTranscript.toLowerCase().includes('stop recording') ||
            finalTranscript.toLowerCase().includes('go to sleep')) {
            setIsAwakeMode(false); // Return to sleep mode
            setIsPaused(false);
            recognitionInstance.stop();
          }
        } else {
          // Sleep mode: only listen for wake words
          if (finalTranscript) {
            const wakeWord = detectWakeWords(finalTranscript);
            if (wakeWord && wakeWord.action === 'wake_up') {
              console.log('Wake word detected:', wakeWord.phrase);
              setIsAwakeMode(true);
              setTranscriptionMessage('Listening...');
              setShowTranscription(true);
            }
          }
        }
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);

        // Only hide transcription toast for serious errors, not for expected ones like "aborted"
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          hideTranscriptToast();
          showToast(`❌ Speech recognition error: ${event.error}`);
        }
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');

        // Only hide transcription toast if we're not in awake mode
        if (!isAwakeModeRef.current) {
          hideTranscriptToast();
        }

        // Restart recognition if listening (both sleep and awake modes)
        if (isListening) {
          setTimeout(() => {
            try {
              recognitionInstance.start();
            } catch (error) {
              console.error('Error restarting speech recognition:', error);
            }
          }, 100);
        }
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech Recognition not supported in this browser');
    }
  }, [SpeechRecognition, showTranscriptToast, hideTranscriptToast, setTranscriptionMessage, showToast, isAwakeMode]);

  // Auto-start speech recognition on page load (sleep mode)
  useEffect(() => {
    const autoStartRecognition = async () => {
      try {
        console.log('Auto-starting speech recognition in sleep mode...');
        // Request microphone permission and start audio capture
        await startAudioCapture();
      } catch (error) {
        console.error('Failed to auto-start speech recognition:', error);
        showToast('⚠️ Please allow microphone access for voice commands');
      }
    };

    // Only auto-start if recognition is available
    if (recognition) {
      const timer = setTimeout(autoStartRecognition, 500);
      return () => clearTimeout(timer);
    }
  }, [recognition, startAudioCapture, showToast]);

  const stopAudioCapture = () => {
    isListeningRef.current = false;

    // Stop speech recognition
    if (recognition) {
      recognition.stop();
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
      audioContext.close();
    }
    setStream(null);
    setAudioContext(null);
    setIsListening(false);
    setAudioLevel(0);

    // Return to sleep mode when manually stopping
    if (isAwakeMode) {
      setIsAwakeMode(false);
    }
  };

  const toggleMicrophone = () => {
    if (isListening) {
      stopAudioCapture();
    } else {
      startAudioCapture();
    }
  };

  return {
    isListening,
    audioLevel,
    isAwakeMode,
    isPaused,
    showTranscription,
    transcriptionMessage,
    startAudioCapture,
    stopAudioCapture,
    toggleMicrophone,
    setIsAwakeMode,
  };
};
