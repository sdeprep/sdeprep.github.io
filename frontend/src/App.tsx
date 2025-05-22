import './App.css'
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="app">
      <h1>Frontend</h1>
      <Sidebar position="left" />
      <Sidebar position="bottom" />
      <Sidebar position="right" />
    </div>
  )
}

export default App
