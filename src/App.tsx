import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './App.css'

type Theme = {
  id: string
  name: string
  genre: string
  gif: string
  accent: string
  glow: string
  blurb: string
}

type WeatherState = {
  status: 'loading' | 'ready' | 'error'
  location: string
  temperature: string
  description: string
  windSpeed: string
}

const themes: Theme[] = [
  {
    id: 'lofi-rain',
    name: 'Lofi Rain',
    genre: 'Chillhop',
    gif: 'https://media.giphy.com/media/3ohs7KViF6rA4aan5u/giphy.gif',
    accent: '#8df0ff',
    glow: 'rgba(141, 240, 255, 0.35)',
    blurb: 'Soft neon reflections and rainy-window energy for writing, coding, and unwinding.',
  },
  {
    id: 'synth-drive',
    name: 'Synth Drive',
    genre: 'Synthwave',
    gif: 'https://media.giphy.com/media/l41YtZOb9EUABnuqA/giphy.gif',
    accent: '#ff7bd5',
    glow: 'rgba(255, 123, 213, 0.35)',
    blurb: 'A midnight highway with bright horizon lines and cassette-era momentum.',
  },
  {
    id: 'cosmic-drift',
    name: 'Cosmic Drift',
    genre: 'Spacewave',
    gif: 'https://media.giphy.com/media/xTiTnxpQ3ghPiB2Hp6/giphy.gif',
    accent: '#a78bfa',
    glow: 'rgba(167, 139, 250, 0.35)',
    blurb: 'Float through a star-lit lounge that makes the CRT feel like a ship window.',
  },
  {
    id: 'night-jazz',
    name: 'Night Jazz',
    genre: 'Jazzhop',
    gif: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
    accent: '#f9c74f',
    glow: 'rgba(249, 199, 79, 0.35)',
    blurb: 'Warm city lights, late-night brass, and an after-hours record-store mood.',
  },
  {
    id: 'vapor-lounge',
    name: 'Vapor Lounge',
    genre: 'Vaporwave',
    gif: 'https://media.giphy.com/media/3o7aCTfyhYawdOXcFW/giphy.gif',
    accent: '#ff9ff3',
    glow: 'rgba(255, 159, 243, 0.35)',
    blurb: 'Pastel glow, dreamy loops, and just enough glitch to feel comfortably unreal.',
  },
  {
    id: 'forest-cassette',
    name: 'Forest Cassette',
    genre: 'Acoustic Lofi',
    gif: 'https://media.giphy.com/media/26BRQTezZrKak4BeE/giphy.gif',
    accent: '#7dd3a7',
    glow: 'rgba(125, 211, 167, 0.35)',
    blurb: 'Cabin-window calm with mossy greens and campfire-tape warmth.',
  },
  {
    id: 'arcade-night',
    name: 'Arcade Night',
    genre: 'Chiptune',
    gif: 'https://media.giphy.com/media/13gvXfEVlxQjDO/giphy.gif',
    accent: '#f72585',
    glow: 'rgba(247, 37, 133, 0.35)',
    blurb: 'Blinking cabinets, score-chasing color, and a playful retro pulse.',
  },
  {
    id: 'ocean-tape',
    name: 'Ocean Tape',
    genre: 'Ambient',
    gif: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
    accent: '#4cc9f0',
    glow: 'rgba(76, 201, 240, 0.35)',
    blurb: 'Slow waves and moonlit blue tones for a quiet, restorative desktop space.',
  },
  {
    id: 'anime-window',
    name: 'Anime Window',
    genre: 'Future Garage',
    gif: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
    accent: '#c4b5fd',
    glow: 'rgba(196, 181, 253, 0.35)',
    blurb: 'A moving city backdrop that feels like studying beside a train-line apartment window.',
  },
  {
    id: 'sunrise-static',
    name: 'Sunrise Static',
    genre: 'Downtempo',
    gif: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    accent: '#fb7185',
    glow: 'rgba(251, 113, 133, 0.35)',
    blurb: 'A soft dawn palette with enough motion to keep the set feeling alive.',
  },
  {
    id: 'medieval-castle',
    name: 'Medieval Castle',
    genre: 'Dark Folklore',
    gif: 'https://images.unsplash.com/photo-1520637836862-4d197d17c50a?auto=format&fit=crop&w=1800&q=85',
    accent: '#e7c27d',
    glow: 'rgba(231, 194, 125, 0.3)',
    blurb: 'Stone walls, candlelight, and a quiet watch over the hills.',
  },
  {
    id: 'forest-rain',
    name: 'Forest Rain',
    genre: 'Rainy Ambient',
    gif: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=85',
    accent: '#a8d5ba',
    glow: 'rgba(168, 213, 186, 0.3)',
    blurb: 'Wet leaves, deep green silence, and rain threading through the canopy.',
  },
  {
    id: 'woodland-cabin',
    name: 'Woodland Cabin',
    genre: 'Fireside Folk',
    gif: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1800&q=85',
    accent: '#f1b36a',
    glow: 'rgba(241, 179, 106, 0.3)',
    blurb: 'A warm lamp, old timber, and nowhere else you need to be tonight.',
  },
  {
    id: 'cozy-reading-room',
    name: 'Cozy Reading Room',
    genre: 'Quiet Evening',
    gif: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=85',
    accent: '#f3c892',
    glow: 'rgba(243, 200, 146, 0.3)',
    blurb: 'Soft lamplight and a well-loved room for slow pages and softer hours.',
  },
]

const weatherCodeMap: Record<number, string> = {
  0: 'Clear skies',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Icy fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Heavy showers',
  82: 'Intense showers',
  95: 'Thunderstorm',
}

const geolocationSupported =
  typeof navigator !== 'undefined' && 'geolocation' in navigator

const minSafeMargin = 24
const maxSafeMargin = 120
const safeMarginStep = 4

function formatNow(date: Date) {
  return {
    time: new Intl.DateTimeFormat([], {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date),
    date: new Intl.DateTimeFormat([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(date),
  }
}

function App() {
  const appRef = useRef<HTMLElement>(null)
  const [themeId, setThemeId] = useState(() => localStorage.getItem('crt-theme') ?? themes[0].id)
  const [safeMargin, setSafeMargin] = useState(() => Number(localStorage.getItem('crt-safe-margin')) || 48)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const [weather, setWeather] = useState<WeatherState>(() =>
    geolocationSupported
      ? {
          status: 'loading',
          location: 'Locating you…',
          temperature: '--',
          description: 'Waiting for browser location permission.',
          windSpeed: '--',
        }
      : {
          status: 'error',
          location: 'Weather unavailable',
          temperature: '--',
          description: 'This browser does not support location-based weather.',
          windSpeed: '--',
        },
  )

  const activeTheme = useMemo(
    () => themes.find((theme) => theme.id === themeId) ?? themes[0],
    [themeId],
  )
  const today = formatNow(now)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('crt-theme', activeTheme.id)
  }, [activeTheme.id])

  useEffect(() => {
    localStorage.setItem('crt-safe-margin', String(safeMargin))
  }, [safeMargin])

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === appRef.current)
    }

    document.addEventListener('fullscreenchange', updateFullscreenState)
    return () => document.removeEventListener('fullscreenchange', updateFullscreenState)
  }, [])

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }

    await appRef.current?.requestFullscreen()
  }

  useEffect(() => {
    let cancelled = false

    const loadWeather = async (latitude: number, longitude: number) => {
      try {
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`,
        )

        if (!weatherResponse.ok) {
          throw new Error('Weather lookup failed.')
        }

        const weatherData = await weatherResponse.json()
        let location = 'Nearby'

        try {
          const locationResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          )
          const locationData = (await locationResponse.json()) as {
            city?: string
            locality?: string
          }
          location = locationData.city ?? locationData.locality ?? location
        } catch {
          // Weather remains useful even if the town lookup is unavailable.
        }

        const weatherCode = weatherData.current?.weather_code as number | undefined

        if (!cancelled) {
          setWeather({
            status: 'ready',
            location,
            temperature:
              typeof weatherData.current?.temperature_2m === 'number'
                ? `${Math.round(weatherData.current.temperature_2m)}°${weatherData.current_units?.temperature_2m ?? 'F'}`
                : '--',
            description: weatherCodeMap[weatherCode ?? -1] ?? 'Current conditions',
            windSpeed:
              typeof weatherData.current?.wind_speed_10m === 'number'
                ? `${Math.round(weatherData.current.wind_speed_10m)} ${weatherData.current_units?.wind_speed_10m ?? 'mph'}`
                : '--',
          })
        }
      } catch {
        if (!cancelled) {
          setWeather({
            status: 'error',
            location: 'Weather unavailable',
            temperature: '--',
            description: 'Open-Meteo could not return local conditions right now.',
            windSpeed: '--',
          })
        }
      }
    }

    if (!geolocationSupported) {
      return () => {
        cancelled = true
      }
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        void loadWeather(coords.latitude, coords.longitude)
      },
      () => {
        if (!cancelled) {
          setWeather({
            status: 'error',
            location: 'Location needed',
            temperature: '--',
            description: 'Enable browser location access to show nearby weather.',
            windSpeed: '--',
          })
        }
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 900_000 },
    )

    return () => {
      cancelled = true
    }
  }, [])

  const themeStyle = {
    '--theme-accent': activeTheme.accent,
    '--theme-glow': activeTheme.glow,
    '--theme-gif': `url("${activeTheme.gif}")`,
    '--safe-margin': `${safeMargin}px`,
  } as CSSProperties

  return (
    <main ref={appRef} className={isFullscreen ? 'app is-fullscreen' : 'app'} style={themeStyle}>
      <div className="scanlines" aria-hidden="true" />

      <header className="status-bar">
        <p>CRT Retreat</p>
        <div className="status-controls">
          <label className="margin-control">
            <span>Screen margin</span>
            <span className="margin-stepper">
              <button
                type="button"
                onClick={() => setSafeMargin((margin) => Math.max(minSafeMargin, margin - safeMarginStep))}
                disabled={safeMargin <= minSafeMargin}
                aria-label="Decrease screen margin"
              >
                −
              </button>
            <output>{safeMargin}px</output>
              <button
                type="button"
                onClick={() => setSafeMargin((margin) => Math.min(maxSafeMargin, margin + safeMarginStep))}
                disabled={safeMargin >= maxSafeMargin}
                aria-label="Increase screen margin"
              >
                +
              </button>
            </span>
          </label>
          <button
            className="fullscreen-toggle"
            type="button"
            onClick={() => void toggleFullscreen()}
            aria-label="Enter fullscreen theme view"
            title="Fullscreen theme view"
          >
            ⛶
          </button>
        </div>
      </header>

      <section className="room">
        <aside className="info-panel">
          <p className="eyebrow">Local time</p>
          <h1>{today.time}</h1>
          <p className="supporting-copy">{today.date}</p>

          <div className="divider" />

          <p className="eyebrow">Weather nearby</p>
          <div className="weather-readout">
            <strong>{weather.location}</strong>
            <span>{weather.temperature}</span>
          </div>
          <p className="supporting-copy">{weather.description}</p>
          <p className="supporting-copy">Wind: {weather.windSpeed}</p>
          {weather.status === 'loading' ? (
            <p className="supporting-copy">Checking your browser location…</p>
          ) : null}
        </aside>

        <section className="hero-panel">
          <p className="eyebrow">{activeTheme.genre}</p>
          <p className="hero-copy">{activeTheme.blurb}</p>

          <a
            className="letter-link"
            href="https://www.cnn.com/world"
            target="_blank"
            rel="noreferrer"
          >
            <span className="letter-icon" aria-hidden="true">
              ✉
            </span>
            <span>
              <strong>Open the world news letter</strong>
              <small>CNN World in a new tab</small>
            </span>
          </a>
        </section>

        <aside className="player-panel">
          <p className="eyebrow">Lofi player</p>
          <div className="player-frame">
            <iframe
              src="https://www.youtube.com/embed/jfKfPfyJRdk"
              title="Lofi Girl YouTube live stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p className="supporting-copy">Use the player controls to keep the room sounding alive.</p>
        </aside>
      </section>

      <section className="theme-picker" aria-label="Theme selector">
        <label htmlFor="theme-select">Atmosphere</label>
        <select
          id="theme-select"
          value={activeTheme.id}
          onChange={(event) => setThemeId(event.target.value)}
        >
          {themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name} · {theme.genre}
            </option>
          ))}
        </select>
      </section>
    </main>
  )
}

export default App
