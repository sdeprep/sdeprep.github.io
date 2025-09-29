import './App.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import WelcomeModal from './components/WelcomeModal';
import VoiceStatusIndicator from './components/VoiceStatusIndicator';
import Toast from './components/Toast';
import TranscriptionToast from './components/TranscriptionToast';
import WaterRipples from './components/WaterRipples';
import BackgroundInteractionGuide from './components/BackgroundInteractionGuide';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { QuestionProvider } from './contexts/QuestionContext';
import { detectWakeWords } from './utils/speechUtils';

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

function AppContent() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    // Show welcome modal for first-time visitors
    return !localStorage.getItem('hasVisited');
  });
  const [toast, setToast] = useState({ message: '', isVisible: false });
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // Direct audio level value
  const [transcriptionMessage, setTranscriptionMessage] = useState('');
  const [showTranscription, setShowTranscription] = useState(false);
  const [isAwakeMode, setIsAwakeMode] = useState(false); // Sleep mode by default
  const [isPaused, setIsPaused] = useState(false); // Pause state for awake mode
  const { isDarkMode, visualEffectsEnabled } = useTheme();

  // Use refs to avoid stale closure issues in speech recognition handlers
  const isAwakeModeRef = useRef(isAwakeMode);
  const isPausedRef = useRef(isPaused);

  // Keep refs in sync with state
  useEffect(() => {
    isAwakeModeRef.current = isAwakeMode;
  }, [isAwakeMode]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Solarized color palette
  const solarized = {
    base03: '#002b36', // darkest background
    base02: '#073642', // dark background highlights
    base01: '#586e75', // comments, secondary content  
    base00: '#657b83', // primary content
    base0: '#839496',  // body text
    base1: '#93a1a1',  // optional emphasized content
    base2: '#eee8d5',  // background highlights
    base3: '#fdf6e3',  // lightest background
  };

  const showToast = useCallback((message: string) => {
    setToast({ message, isVisible: true });
  }, []);

  const hideToast = () => {
    setToast({ message: '', isVisible: false });
  };

  const hideTranscriptToast = useCallback(() => {
    setShowTranscription(false);
  }, []);

  const showTranscriptToast = useCallback((message: string, duration?: number) => {
    setTranscriptionMessage(message);
    setShowTranscription(true);

    // For persistent messages (duration 0), don't auto-hide
    // For other messages, auto-hide after duration only if not showing "Listening..."
    if (duration !== 0 && message !== 'Listening...') {
      setTimeout(() => {
        hideTranscriptToast();
      }, duration || 3000); // Default 3 seconds
    }
  }, [hideTranscriptToast]);

  const handleShowShortcuts = () => {
    setShowShortcuts(true);
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasVisited', 'true');
  };

  // Audio level capture using Web Audio API
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const isListeningRef = useRef(false);

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

          // Audio level monitoring (debug logging removed for cleaner console)

          setAudioLevel(logLevel);

          requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();

    } catch (error) {
      console.error('Error accessing microphone:', error);
      showToast('❌ Error accessing microphone');
    }
  }, [recognition, showToast, setAudioLevel, setIsListening, setStream, setAudioContext]);

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
  }, [SpeechRecognition, showTranscriptToast, hideTranscriptToast, setTranscriptionMessage, setIsPaused, setIsAwakeMode, showToast]);

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

  // Handle click outside functionality
  const handleAppClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    // Check if click is outside sidebars and code editor
    const isInsideSidebar = target.closest('[data-sidebar]');
    const isInsideCodeEditor = target.closest('.code-editor-container');
    const isInsideModal = target.closest('[data-modal]');
    const isInsideToast = target.closest('[data-toast]');

    if (!isInsideSidebar && !isInsideCodeEditor && !isInsideModal && !isInsideToast) {
      // In sleep mode, clicking activates awake mode
      if (!isAwakeMode) {
        setIsAwakeMode(true);
        if (!isListening) {
          startAudioCapture();
        }
      } else {
        // In awake mode, clicking toggles microphone
        toggleMicrophone();
      }
    }
  };

  // Detect OS for appropriate keyboard symbols and display
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  // Log OS detection only once on component mount
  useEffect(() => {
    const userAgent = navigator.userAgent;
    let osName = 'Unknown OS';
    if (userAgent.indexOf("Mac") != -1) osName = "macOS";
    else if (userAgent.indexOf("Win") != -1) osName = "Windows";
    else if (userAgent.indexOf("Linux") != -1) osName = "Linux";
    else if (userAgent.indexOf("Android") != -1) osName = "Android";
    else if (userAgent.indexOf("like Mac") != -1) osName = "iOS"; // iPad, iPhone

    console.log(`Detected OS: ${osName}`);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      // Cmd/Ctrl + / - Toggle keyboard shortcuts
      if (cmdOrCtrl && event.key === '/') {
        event.preventDefault();
        setShowShortcuts(!showShortcuts);
      }

      // Cmd/Ctrl + Enter - Run code
      if (cmdOrCtrl && event.key === 'Enter') {
        event.preventDefault();
        showToast('🚀 Code execution triggered!');
      }

      // Cmd/Ctrl + D - Select word
      if (cmdOrCtrl && event.key === 'd') {
        event.preventDefault();
        showToast('📝 Word selected');
      }

      // Alt + Arrow Up - Move line up
      if (event.altKey && event.key === 'ArrowUp') {
        event.preventDefault();
        showToast('⬆️ Line moved up');
      }

      // Alt + Arrow Down - Move line down
      if (event.altKey && event.key === 'ArrowDown') {
        event.preventDefault();
        showToast('⬇️ Line moved down');
      }

      // Escape - Close modal
      if (event.key === 'Escape') {
        setShowShortcuts(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMac, showShortcuts, showToast]);

  // Apply Solarized background to entire application
  const appStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? solarized.base03 : solarized.base3,
    color: isDarkMode ? solarized.base0 : solarized.base00,
    minHeight: '100vh',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };

  return (
    <div className={`app`} style={appStyle} onClick={handleAppClick}>
      {/* Background interaction guide layer - only show when voice is active */}
      {visualEffectsEnabled && isAwakeMode && <BackgroundInteractionGuide audioLevel={audioLevel} isListening={isListening} />}

      {/* Water ripple effects layer - only show when voice is active and audio detected */}
      {visualEffectsEnabled && isAwakeMode && audioLevel > 0.1 && <WaterRipples audioLevel={audioLevel} isListening={isListening} />}

      <Sidebar position="left" data-sidebar />
      {/* <Sidebar position="bottom" /> */}
      <Sidebar position="right" onShowShortcuts={handleShowShortcuts} data-sidebar />

      {/* Voice status indicator */}
      <VoiceStatusIndicator
        isListening={isListening}
        isAwakeMode={isAwakeMode}
        isPaused={isPaused}
        audioLevel={audioLevel}
      />

      {/* Main code editor */}
      <CodeEditor isListening={isListening} audioLevel={audioLevel} />

      {/* Transcription Toast (positioned over code editor) */}
      <TranscriptionToast
        isVisible={showTranscription}
        message={transcriptionMessage}
        isListening={isListening}
      />

      {/* Welcome modal for first-time visitors */}
      <WelcomeModal isOpen={showWelcome} onClose={handleCloseWelcome} />

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} data-modal />

      {/* Toast notifications */}
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={hideToast} data-toast />

      {/* Subtle creator credit */}
      <div
        style={{
          position: 'fixed',
          bottom: '12px',
          left: '12px',
          fontSize: '11px',
          color: isDarkMode ? solarized.base01 : solarized.base1,
          zIndex: 50,
          opacity: 0.7,
          transition: 'opacity 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.7';
        }}
      >
        <a
          href="https://aviralgarg.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'inherit',
            textDecoration: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          aviralgarg.com
        </a>
      </div>

    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QuestionProvider>
        <AppContent />
      </QuestionProvider>
    </ThemeProvider>
  );
}

export default App;
