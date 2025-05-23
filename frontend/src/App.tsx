import './App.css';
import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import Toast from './components/Toast';
import WaterRipples from './components/WaterRipples';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { QuestionProvider } from './contexts/QuestionContext';

function AppContent() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [toast, setToast] = useState({ message: '', isVisible: false });
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // Direct audio level value
  const [transcriptToast, setTranscriptToast] = useState({ message: '', isVisible: false });
  const { isDarkMode } = useTheme();

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

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
  };

  const hideToast = () => {
    setToast({ message: '', isVisible: false });
  };

  const showTranscriptToast = (message: string) => {
    setTranscriptToast({ message, isVisible: true });
  };

  const hideTranscriptToast = () => {
    setTranscriptToast({ message: '', isVisible: false });
  };

  const handleShowShortcuts = () => {
    setShowShortcuts(true);
  };

  // Audio level capture using Web Audio API
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const isListeningRef = useRef(false);

  // Speech Recognition for transcript toast
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        console.log('Speech recognition started');
        showTranscriptToast('Listening...');
      };

      recognitionInstance.onresult = (event: any) => {
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
        if (currentTranscript) {
          showTranscriptToast(currentTranscript);
        }

        // Check for stop command
        if (finalTranscript.toLowerCase().includes('stop listening') ||
          finalTranscript.toLowerCase().includes('stop recording')) {
          recognitionInstance.stop();
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        hideTranscriptToast();
        showToast(`❌ Speech recognition error: ${event.error}`);
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        hideTranscriptToast();
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech Recognition not supported in this browser');
    }
  }, []);

  const startAudioCapture = async () => {
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
      setAnalyser(analyserNode);
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

          // Debug logging (remove in production)
          if (logLevel > 0.1) {
            console.log(`Audio Level: ${logLevel.toFixed(3)}, RMS: ${rms.toFixed(3)}, Normalized: ${normalizedLevel.toFixed(3)}`);
          }

          setAudioLevel(logLevel);

          requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();

    } catch (error) {
      console.error('Error accessing microphone:', error);
      showToast('❌ Error accessing microphone');
    }
  };

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
    setAnalyser(null);
    setIsListening(false);
    setAudioLevel(0);
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
      toggleMicrophone();
    }
  };

  // Detect OS for appropriate keyboard symbols and display
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const userAgent = navigator.userAgent;
  let osName = 'Unknown OS';
  if (userAgent.indexOf("Mac") != -1) osName = "macOS";
  else if (userAgent.indexOf("Win") != -1) osName = "Windows";
  else if (userAgent.indexOf("Linux") != -1) osName = "Linux";
  else if (userAgent.indexOf("Android") != -1) osName = "Android";
  else if (userAgent.indexOf("like Mac") != -1) osName = "iOS"; // iPad, iPhone

  console.log(`Detected OS: ${osName}`);

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

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMac, showShortcuts]); // Added isMac dependency back for keyboard shortcuts

  // Apply Solarized background to entire application
  const appStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? solarized.base03 : solarized.base3,
    color: isDarkMode ? solarized.base0 : solarized.base00,
    minHeight: '100vh',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };

  return (
    <div className={`app`} style={appStyle} onClick={handleAppClick}>
      {/* Water ripple effects layer */}
      <WaterRipples audioLevel={audioLevel} isListening={isListening} />

      <Sidebar position="left" data-sidebar />
      {/* <Sidebar position="bottom" /> */}
      <Sidebar position="right" onShowShortcuts={handleShowShortcuts} data-sidebar />

      {/* Main code editor */}
      <CodeEditor isListening={isListening} audioLevel={audioLevel} />

      {/* Transcript Toast (positioned over code editor) */}
      {transcriptToast.isVisible && (
        <div data-toast style={{
          position: 'fixed',
          bottom: '140px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 90,
          backgroundColor: isDarkMode ? solarized.base02 : solarized.base2,
          color: isDarkMode ? solarized.base0 : solarized.base00,
          padding: '16px 24px',
          borderRadius: '12px',
          border: 'none',
          boxShadow: isDarkMode
            ? '0 12px 24px rgba(0, 0, 0, 0.25), 0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)'
            : '0 12px 24px rgba(0, 0, 0, 0.12), 0 6px 12px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.05)',
          maxWidth: '400px',
          textAlign: 'center',
          animation: isListening ? 'pulse 1.5s infinite' : 'none',
          fontSize: '14px',
          fontWeight: '500',
        }}>
          {transcriptToast.message}
        </div>
      )}

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} data-modal />

      {/* Toast notifications */}
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={hideToast} data-toast />

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.8; transform: translateX(-50%) scale(1.02); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
      `}</style>
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
