import './App.css'
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';

function App() {
  return (
    <div className="app">
      <Sidebar position="left" />
      <Sidebar position="bottom" />
      <Sidebar position="right" />
      <CodeEditor />
    </div>
  )
}

export default App
