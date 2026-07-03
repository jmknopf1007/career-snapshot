import { useEffect, useState } from 'react'
import Image from 'next/image'

const text =
  "My site is currently being updated.\n\nPlease check back soon."

const footer = "Thanks for stopping by!"

export default function Maintenance() {
  const [displayedText, setDisplayedText] = useState('')
  const [footerText, setFooterText] = useState('')
  const [showCat, setShowCat] = useState(false)

  useEffect(() => {
    let index = 0

    const typingInterval = setInterval(() => {
      setDisplayedText(text.slice(0, index))
      index++

      if (index > text.length) {
        clearInterval(typingInterval)

        setTimeout(() => {
          setShowCat(true)

          let footerIndex = 0

          const footerInterval = setInterval(() => {
            setFooterText(footer.slice(0, footerIndex))
            footerIndex++

            if (footerIndex > footer.length) {
              clearInterval(footerInterval)
            }
          }, 35)
        }, 600)
      }
    }, 45)

    return () => clearInterval(typingInterval)
  }, [])

  const footerFinished = footerText.length >= footer.length

  return (
    <>
      <main className="container">
        <h1>Jacob Knopf: Career Snapshot</h1>

        <p className="typing">
          {displayedText}
          {!showCat && <span className="cursor">▋</span>}
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
            {footerText}
            {showCat && <span className="cursor">▋</span>}
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

          background: #1A1008;
          color: #FFFFF0;

          font-family: Inter, system-ui, sans-serif;
        }

        h1 {
          font-size: clamp(2rem, 4.5vw, 3.5rem);
          margin-bottom: 2rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #FFFFF0;
        }

        .typing {
          white-space: pre-line;
          font-size: 1.25rem;
          line-height: 1.8;
          max-width: 650px;
          color: #FFFFF0;
          min-height: 120px;
        }

        .cursor {
          animation: blink 1s steps(2, start) infinite;
        }

        .catContainer {
          margin-top: 5rem;
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
          margin-top: 2rem;
          margin-bottom: 2rem;
          white-space: pre-line;
          font-size: 1.25rem;
          line-height: 1.8;
          color: #FFFFF0;
          min-height: 40px;
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
