import { useEffect, useState } from 'react'

const text =
  "My website is currently being updated.\n\nPlease check back soon!"

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
    }, 45)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <main className="container">
        <h1>Jacob Knopf: Career Snapshot</h1>

        <p className="typing">
          {displayedText}
          <span className="cursor">▋</span>
        </p>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          text-align: center;

          background: #1A1008;
          color: #FFFFF0;

          font-family: Inter, system-ui, sans-serif;
        }

        h1 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          margin-bottom: 2rem;
          font-weight: 700;
          letter-spacing: -0.03em;
        }

        .typing {
          white-space: pre-line;
          font-size: 1.25rem;
          line-height: 1.8;
          max-width: 650px;
          color: #FFFFF0;
        }

        .cursor {
          animation: blink 1s steps(2, start) infinite;
        }

        @keyframes blink {
          to {
            visibility: hidden;
          }
        }
      `}</style>
    </>
  )
}
