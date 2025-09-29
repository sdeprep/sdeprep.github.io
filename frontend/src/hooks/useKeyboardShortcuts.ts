import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  showToast: (message: string) => void;
}

export const useKeyboardShortcuts = ({
  showShortcuts,
  setShowShortcuts,
  showToast,
}: UseKeyboardShortcutsProps) => {
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
  }, [isMac, showShortcuts, showToast, setShowShortcuts]);

  return { isMac };
};
