import './App.css'
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import MonacoEditorReference from './components/MonacoEditorReference';

function App() {
  const [showReference, setShowReference] = useState(true); // Show reference by default when admin mode is on
  const [isAdminMode, setIsAdminMode] = useState(true); // Default to admin mode for development

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

  // Show reference page when admin mode is on, main page when admin mode is off
  if (isAdminMode && showReference) {
    return (
      <div className="app">
        <Sidebar position="left" />
        <Sidebar position="bottom" />
        <Sidebar
          position="right"
          isAdminMode={isAdminMode}
          onToggleAdmin={() => setIsAdminMode(!isAdminMode)}
          onShowReference={() => setShowReference(false)}
          showReference={showReference}
        />
        <MonacoEditorReference />
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar position="left" />
      <Sidebar position="bottom" />
      <Sidebar
        position="right"
        isAdminMode={isAdminMode}
        onToggleAdmin={() => setIsAdminMode(!isAdminMode)}
        onShowReference={() => setShowReference(true)}
        showReference={showReference}
      />

      {/* Main code editor */}
      <CodeEditor defaultValue={originalDefaultValue} />
    </div>
  )
}

export default App
