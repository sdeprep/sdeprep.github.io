import './App.css';
import { useState, useCallback } from 'react';
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
import { useAudioSpeechRecognition } from './hooks/useAudioSpeechRecognition';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';


function AppContent() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    // Show welcome modal for first-time visitors
    return !localStorage.getItem('hasVisited');
  });
  const [toast, setToast] = useState({ message: '', isVisible: false });
  const { isDarkMode, visualEffectsEnabled } = useTheme();

  const showToast = useCallback((message: string) => {
    setToast({ message, isVisible: true });
  }, []);

  const hideToast = () => {
    setToast({ message: '', isVisible: false });
  };

  // Use custom hooks
  const {
    isListening,
    audioLevel,
    isAwakeMode,
    isPaused,
    showTranscription,
    transcriptionMessage,
    startAudioCapture,
    toggleMicrophone,
    setIsAwakeMode,
  } = useAudioSpeechRecognition({
    showToast,
  });

  useKeyboardShortcuts({
    showShortcuts,
    setShowShortcuts,
    showToast,
  });

  const handleShowShortcuts = () => {
    setShowShortcuts(true);
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasVisited', 'true');
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


  return (
    <div className={`app ${isDarkMode ? 'app-solarized-dark' : 'app-solarized-light'}`} onClick={handleAppClick}>
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
      <div className={`creator-credit ${isDarkMode ? 'creator-credit-dark' : 'creator-credit-light'}`}>
        <a
          href="https://aviralgarg.com"
          target="_blank"
          rel="noopener noreferrer"
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
