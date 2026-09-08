import { useEffect, useMemo, useState } from 'react'
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
]

const dailyMessages = [
  'Small progress is still progress. Let the room do the heavy lifting.',
  'Keep something cozy nearby and give yourself enough time to wander.',
  'Tonight is for low pressure and clear momentum.',
  'A good dashboard should feel like a place, not a page.',
  'Let the static settle, then make the next simple move.',
  'Stay soft, stay curious, keep building.',
  'The best routines are the ones you actually want to return to.',
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

function getDailyMessageIndex(date: Date) {
  const yearStart = new Date(date.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((date.getTime() - yearStart.getTime()) / 86_400_000)
  return dayOfYear % dailyMessages.length
}

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
  const [themeId, setThemeId] = useState(() => localStorage.getItem('crt-theme') ?? themes[0].id)
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
  const dailyMessage = dailyMessages[getDailyMessageIndex(now)]

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('crt-theme', activeTheme.id)
  }, [activeTheme.id])

  useEffect(() => {
    let cancelled = false

    const loadWeather = async (latitude: number, longitude: number) => {
      try {
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`,
        )
        const reverseResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`,
        )

        if (!weatherResponse.ok || !reverseResponse.ok) {
          throw new Error('Weather lookup failed.')
        }

        const weatherData = await weatherResponse.json()
        const reverseData = await reverseResponse.json()
        const result = reverseData.results?.[0]
        const weatherCode = weatherData.current?.weather_code as number | undefined

        if (!cancelled) {
          setWeather({
            status: 'ready',
            location: result
              ? `${result.name}${result.admin1 ? `, ${result.admin1}` : ''}`
              : 'Your area',
            temperature:
              typeof weatherData.current?.temperature_2m === 'number'
                ? `${Math.round(weatherData.current.temperature_2m)}°${weatherData.current_units?.temperature_2m ?? 'C'}`
                : '--',
            description: weatherCodeMap[weatherCode ?? -1] ?? 'Current conditions',
            windSpeed:
              typeof weatherData.current?.wind_speed_10m === 'number'
                ? `${Math.round(weatherData.current.wind_speed_10m)} ${weatherData.current_units?.wind_speed_10m ?? 'km/h'}`
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
  } as CSSProperties

  return (
    <main className="app" style={themeStyle}>
      <div className="scanlines" aria-hidden="true" />

      <header className="status-bar">
        <p>CRT Retreat</p>
        <span>{activeTheme.genre} mode</span>
      </header>

      <section className="room">
        <aside className="panel info-panel">
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

        <section className="panel hero-panel">
          <p className="eyebrow">Theme {themes.findIndex((theme) => theme.id === activeTheme.id) + 1} of {themes.length}</p>
          <h2>{activeTheme.name}</h2>
          <p className="hero-copy">{activeTheme.blurb}</p>

          <div className="message-card">
            <span className="message-label">Daily message</span>
            <p>{dailyMessage}</p>
          </div>

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

        <aside className="panel player-panel">
          <p className="eyebrow">Lofi player</p>
          <div className="player-frame">
            <iframe
              src="https://www.youtube.com/embed/jfKfPfyJRdk?si=4eP8ruFrJ1RBr6Cx"
              title="Lofi music player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p className="supporting-copy">Use the player controls to keep the room sounding alive.</p>
        </aside>
      </section>

      <section className="theme-dock" aria-label="Theme selector">
        {themes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className={theme.id === activeTheme.id ? 'theme-card active' : 'theme-card'}
            onClick={() => setThemeId(theme.id)}
            aria-pressed={theme.id === activeTheme.id}
            style={{ '--card-gif': `url("${theme.gif}")` } as CSSProperties}
          >
            <span>{theme.name}</span>
            <small>{theme.genre}</small>
          </button>
        ))}
      </section>
    </main>
  )
}

export default App
