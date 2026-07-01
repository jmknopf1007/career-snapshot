import { useEffect, useState } from 'react'

const text =
  "My website is currently being updated.\nPlease check back soon!"

export default function Maintenance() {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let index = 0

    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index))
      index++

      if (index > text.length) {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        background: '#fff',
      }}
    >
      <h1 style={{ marginBottom: '2rem' }}>Jacob Knopf: Career Snapshot</h1>

      <p
        style={{
          whiteSpace: 'pre-line',
          fontSize: '1.2rem',
          lineHeight: 1.6,
          maxWidth: '600px',
        }}
      >
        {displayedText}
        <span className="cursor">|</span>
      </p>

      <style jsx>{`
        .cursor {
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </main>
  )
}
