import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5062'

function App() {
  const [apiInfo, setApiInfo] = useState(null)
  const [weather, setWeather] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [infoRes, weatherRes] = await Promise.all([
        fetch(`${API_URL}/api/info`),
        fetch(`${API_URL}/api/weatherforecast`)
      ])

      if (!infoRes.ok || !weatherRes.ok) {
        throw new Error('Failed to fetch data from API')
      }

      const info = await infoRes.json()
      const weatherData = await weatherRes.json()

      setApiInfo(info)
      setWeather(weatherData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo-icon">⚡</div>
            <h1>Azure CI/CD Test App</h1>
          </div>
          <p className="tagline">.NET 8 + React • Ready for Deployment</p>
        </div>
      </header>

      <main className="main-content">
        {/* API Status Card */}
        <section className="card status-card">
          <div className="card-header">
            <span className="card-icon">🔌</span>
            <h2>API Status</h2>
          </div>
          <div className="card-body">
            {loading && <div className="loader"></div>}
            {error && (
              <div className="error-message">
                <span>❌</span>
                <p>{error}</p>
                <button onClick={fetchData} className="retry-btn">Retry</button>
              </div>
            )}
            {apiInfo && !loading && (
              <div className="api-info">
                <div className="status-indicator online">
                  <span className="dot"></span>
                  Online
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Name</span>
                    <span className="value">{apiInfo.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Version</span>
                    <span className="value">{apiInfo.version}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Environment</span>
                    <span className="value env-badge">{apiInfo.environment}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Weather Forecast Card */}
        <section className="card weather-card">
          <div className="card-header">
            <span className="card-icon">🌤️</span>
            <h2>Weather Forecast</h2>
          </div>
          <div className="card-body">
            {loading && <div className="loader"></div>}
            {!loading && weather.length > 0 && (
              <div className="weather-grid">
                {weather.map((day, index) => (
                  <div key={index} className="weather-item">
                    <div className="weather-date">{day.date}</div>
                    <div className="weather-temp">
                      <span className="temp-c">{day.temperatureC}°C</span>
                      <span className="temp-f">{day.temperatureF}°F</span>
                    </div>
                    <div className="weather-summary">{day.summary}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Deployment Info */}
        <section className="card deployment-card">
          <div className="card-header">
            <span className="card-icon">🚀</span>
            <h2>Deployment Info</h2>
          </div>
          <div className="card-body">
            <div className="deployment-info">
              <div className="tech-stack">
                <h3>Tech Stack</h3>
                <div className="tech-badges">
                  <span className="tech-badge dotnet">.NET 8</span>
                  <span className="tech-badge react">React</span>
                  <span className="tech-badge vite">Vite</span>
                  <span className="tech-badge azure">Azure</span>
                </div>
              </div>
              <div className="endpoints">
                <h3>Available Endpoints</h3>
                <ul>
                  <li><code>GET /health</code> - Health check</li>
                  <li><code>GET /api/info</code> - API information</li>
                  <li><code>GET /api/weatherforecast</code> - Weather data</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Built for Azure CI/CD Testing • {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
