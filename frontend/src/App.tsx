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

  const handleMicrophoneToggle = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      hideTranscriptToast();
    } else {
      // Start listening
      setIsListening(true);
      showTranscriptToast('Listening...');

      // Simulate speech recognition (placeholder for now)
      setTimeout(() => {
        showTranscriptToast('This is a simulated transcript from microphone input');
      }, 2000);
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

  const micButtonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
    backgroundColor: isListening ? '#cb4b16' : (isDarkMode ? solarized.base02 : solarized.base2),
    border: `2px solid ${isDarkMode ? solarized.base01 : solarized.base1}`,
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: isListening ? '0 0 20px rgba(203, 75, 22, 0.5)' : `0 4px 8px rgba(0,0,0,0.2)`,
    animation: isListening ? 'pulse 1.5s infinite' : 'none',
  };

  return (
    <div className={`app`} style={appStyle}>
      <Sidebar position="left" />
      {/* <Sidebar position="bottom" /> */}
      <Sidebar position="right" onShowShortcuts={handleShowShortcuts} />

      {/* Main code editor */}
      <CodeEditor isListening={isListening} />

      {/* Microphone Button */}
      <button style={micButtonStyle} onClick={handleMicrophoneToggle}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? solarized.base0 : solarized.base00} strokeWidth="2">
          <path d="M12 1C10.34 1 9 2.34 9 4v4c0 1.66 1.34 3 3 3s3-1.34 3-3V4c0-1.66-1.34-3-3-3z" />
          <path d="M19 10v2c0 3.87-3.13 7-7 7s-7-3.13-7-7v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>

      {/* Transcript Toast (positioned over code editor) */}
      {transcriptToast.isVisible && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 90,
          backgroundColor: isDarkMode ? solarized.base02 : solarized.base2,
          color: isDarkMode ? solarized.base0 : solarized.base00,
          padding: '12px 20px',
          borderRadius: '8px',
          border: `1px solid ${isDarkMode ? solarized.base01 : solarized.base1}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          maxWidth: '400px',
          textAlign: 'center',
        }}>
          {transcriptToast.message}
        </div>
      )}

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Toast notifications */}
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={hideToast} />

      <style>{`
        @keyframes pulse {
          0% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.05); }
          100% { transform: translateX(-50%) scale(1); }
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
