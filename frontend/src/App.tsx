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

  const handleShowShortcuts = () => {
    setShowShortcuts(true);
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
    <div className={`app`} style={appStyle}>
      <Sidebar position="left" />
      {/* <Sidebar position="bottom" /> */}
      <Sidebar position="right" onShowShortcuts={handleShowShortcuts} />

      {/* Main code editor */}
      <CodeEditor />

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Toast notifications */}
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={hideToast} />
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
