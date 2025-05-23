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
  const [osName, setOsName] = useState('Detecting OS...');

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Mac") != -1) setOsName("macOS");
    else if (userAgent.indexOf("Win") != -1) setOsName("Windows");
    else if (userAgent.indexOf("Linux") != -1) setOsName("Linux");
    else if (userAgent.indexOf("Android") != -1) setOsName("Android");
    else if (userAgent.indexOf("like Mac") != -1) setOsName("iOS"); // iPad, iPhone
    else setOsName("Unknown OS");

    const handleKeyDown = (event: KeyboardEvent) => {
      const cmdOrCtrl = userAgent.indexOf("Mac") != -1 ? event.metaKey : event.ctrlKey;

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

      // Cmd/Ctrl + S - Save file
      if (cmdOrCtrl && event.key === 's') {
        event.preventDefault();
        showToast('💾 File saved!');
      }

      // Cmd/Ctrl + Z - Undo
      if (cmdOrCtrl && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        showToast('↶ Undo action');
      }

      // Cmd/Ctrl + Shift + Z - Redo
      if (cmdOrCtrl && event.key === 'z' && event.shiftKey) {
        event.preventDefault();
        showToast('↷ Redo action');
      }

      // Cmd/Ctrl + F - Find
      if (cmdOrCtrl && event.key === 'f') {
        event.preventDefault();
        showToast('🔍 Find dialog opened');
      }

      // Cmd/Ctrl + G - Find next
      if (cmdOrCtrl && event.key === 'g' && !event.shiftKey) {
        event.preventDefault();
        showToast('⬇️ Find next');
      }

      // Cmd/Ctrl + Shift + G - Find previous
      if (cmdOrCtrl && event.key === 'g' && event.shiftKey) {
        event.preventDefault();
        showToast('⬆️ Find previous');
      }

      // Cmd/Ctrl + H - Replace
      if (cmdOrCtrl && event.key === 'h') {
        event.preventDefault();
        showToast('🔄 Replace dialog opened');
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
  }, [showShortcuts]); // Added showShortcuts dependency

  // Apply Solarized background to entire application
  const appStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? solarized.base03 : solarized.base3,
    color: isDarkMode ? solarized.base0 : solarized.base00,
    minHeight: '100vh',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };

  const osHeadingStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '24px',
    margin: '20px auto 10px auto', // Adjust margins to fit above editor
    color: isDarkMode ? solarized.base0 : solarized.base00,
  };

  return (
    <div className={`app`} style={appStyle}>
      <Sidebar position="left" />
      {/* <Sidebar position="bottom" /> */}
      <Sidebar position="right" onShowShortcuts={handleShowShortcuts} />

      {/* OS Heading */}
      <h1 style={osHeadingStyle}>{osName}</h1>

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
