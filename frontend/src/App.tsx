import './App.css';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import Toast from './components/Toast';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { QuestionProvider } from './contexts/QuestionContext';

function AppContent() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [toast, setToast] = useState({ message: '', isVisible: false });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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

  // Initialize Speech Recognition
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
        setIsListening(true);
        setIsSpeaking(false);
        showTranscriptToast('Listening...');
      };

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        let hasNewSpeech = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            hasNewSpeech = true;
          } else {
            interimTranscript += transcript;
            hasNewSpeech = true;
          }
        }

        // Update speaking state based on speech activity
        if (hasNewSpeech && (finalTranscript || interimTranscript)) {
          setIsSpeaking(true);
          // Reset speaking state after a short delay if no new speech
          setTimeout(() => setIsSpeaking(false), 1000);
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
        setIsListening(false);
        setIsSpeaking(false);
        hideTranscriptToast();
        showToast(`❌ Speech recognition error: ${event.error}`);
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        setIsSpeaking(false);
        hideTranscriptToast();
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech Recognition not supported in this browser');
    }
  }, []);

  const toggleMicrophone = () => {
    if (!recognition) {
      showToast('❌ Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        showToast('❌ Error starting speech recognition');
      }
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
      <Sidebar position="left" data-sidebar />
      {/* <Sidebar position="bottom" /> */}
      <Sidebar position="right" onShowShortcuts={handleShowShortcuts} data-sidebar />

      {/* Main code editor */}
      <CodeEditor isListening={isListening} isSpeaking={isSpeaking} />

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
