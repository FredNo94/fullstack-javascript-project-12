import './App.css'
import { Link, Outlet } from 'react-router-dom'

function App() {
  return (
    <>
    <header>
      <Link to="/">Hexlet Chat</Link>
    </header>
    <main>
      <Outlet/>
    </main>
    </>
  )
}

export default App
