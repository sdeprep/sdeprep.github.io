import './App.css';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import ProfileButton from './components/ProfileButton';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import Toast from './components/Toast';

function App() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [toast, setToast] = useState({ message: '', isVisible: false });

  const originalDefaultValue = `"""
Given an array of integers nums and an integer target,
return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution,
and you may not use the same element twice.
You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
"""

def twoSum(nums, target):
    pass # Your code here`;

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
  };

  const hideToast = () => {
    setToast({ message: '', isVisible: false });
  };

  // Detect OS for keyboard shortcuts
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

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
  }, [isMac, showShortcuts]);

  return (
    <div className="app">
      <Sidebar position="left" />
      <Sidebar position="bottom" />
      <Sidebar position="right" />

      {/* Profile button in top right */}
      <ProfileButton />

      {/* Main code editor */}
      <CodeEditor defaultValue={originalDefaultValue} />

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Toast notifications */}
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={hideToast} />
    </div>
  );
}

export default App;
