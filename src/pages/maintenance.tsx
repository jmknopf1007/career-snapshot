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

  return (
    <>
      <main className="container">
        <h1>Jacob Knopf: Career Snapshot</h1>

        <p className="typing">
          {displayedText}
          {!showCat && <span className="cursor">▋</span>}
        </p>

        <div className={`catContainer ${showCat ? 'visible' : ''}`}>
          <div className="cat">
            <Image
              src="/CatTailDancingTransparent.gif"
              alt="Animated cat"
              width={220}
              height={220}
              priority
              unoptimized
            />
          </div>

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
          background: #2D2926;
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
          margin-top: 2.5rem;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.8s ease, transform 0.8s ease;
          pointer-events: none;
        }

        .catContainer.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .cat {
          animation: float 3s ease-in-out infinite;
        }

        .thanks {
          margin-top: 2.5rem;
          margin-bottom: 0;
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </>
  )
}
