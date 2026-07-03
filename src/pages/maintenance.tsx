import { useEffect, useState } from 'react'
import Image from 'next/image'

const text =
  "My site is currently being updated.\n\nPlease check back soon!"

export default function Maintenance() {
  const [displayedText, setDisplayedText] = useState('')
  const [showCat, setShowCat] = useState(false)

  useEffect(() => {
    let index = 0

    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index))
      index++

      if (index > text.length) {
        clearInterval(interval)

        // Wait a moment after typing finishes before revealing the cat
        setTimeout(() => {
          setShowCat(true)
        }, 600)
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

        <div className={`catContainer ${showCat ? 'visible' : ''}`}>
          <Image
            src="/CatTailDancing.gif"
            alt="Animated cat"
            width={180}
            height={180}
            priority
            unoptimized
          />

          <p className="thanks">
            Thanks for stopping by! 🤎
          </p>
        </div>
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

          background: #1a1008;
          color: #fffff0;

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
          color: #fffff0;
        }

        .cursor {
          animation: blink 1s steps(2, start) infinite;
        }

        .catContainer {
          margin-top: 4rem;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.8s ease, transform 0.8s ease;
          pointer-events: none;
        }

        .catContainer.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .thanks {
          margin-top: 1.5rem;
          font-size: 1rem;
          color: #c7a36a;
          letter-spacing: 0.02em;
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
