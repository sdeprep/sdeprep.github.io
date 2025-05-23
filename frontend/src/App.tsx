import './App.css'
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';

function App() {
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

  return (
    <div className="app">
      <Sidebar position="left" />
      <Sidebar position="bottom" />
      <Sidebar position="right" />

      {/* Main code editor */}
      <CodeEditor defaultValue={originalDefaultValue} />
    </div>
  )
}

export default App
