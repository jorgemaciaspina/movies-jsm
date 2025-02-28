import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1> Encuentra tu <span className="text-gradient">película</span> favorita sin complicaciones</h1>
        </header>

        <p>Buscar</p>
      </div>
    </main>
  )
}

export default App
