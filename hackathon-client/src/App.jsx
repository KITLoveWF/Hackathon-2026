import { useState, useEffect } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [healthStatus, setHealthStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkHealth()
  }, [])

  const checkHealth = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:3000/hackathon/healthcheck')
      setHealthStatus(response.data)
    } catch (error) {
      console.error('Health check failed:', error)
      setHealthStatus({ status: 'error', error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={checkHealth} disabled={loading}>
          {loading ? 'Checking...' : 'Health Check'}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        {healthStatus && (
          <div>
            <h3>Health Status:</h3>
            <pre>{JSON.stringify(healthStatus, null, 2)}</pre>
          </div>
        )}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
