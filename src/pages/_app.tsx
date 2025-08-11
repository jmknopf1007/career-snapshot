import '@/styles/globals.css'
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    function setVhProperty() {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    
    // More aggressive Safari text size fix
    function fixSafariTextSize() {
      if (typeof window !== 'undefined') {
        const isSafari = /Safari/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent)
        
        if (isSafari) {
          // Set CSS custom properties that we can use in CSS
          document.documentElement.style.setProperty('--is-safari-mobile', '1')
          
          // Force all elements to use consistent sizing
          const style = document.createElement('style')
          style.textContent = `
            html, body {
              -webkit-text-size-adjust: none !important;
              text-size-adjust: none !important;
              font-size: 16px !important;
            }
            
            .notion-page,
            .notion-page-content,
            .notion-text,
            .notion-title,
            .notion-page-title,
            h1, h2, h3, h4, h5, h6,
            p, span, div, a {
              -webkit-text-size-adjust: none !important;
              text-size-adjust: none !important;
            }
            
            /* Force consistent line heights */
            .notion-page-content {
              line-height: 1.5 !important;
            }
            
            /* Ensure proper viewport width */
            .site-container {
              width: 100vw !important;
              max-width: 100vw !important;
              min-width: 320px !important;
            }
          `
          document.head.appendChild(style)
          
          // Also try setting the zoom level
          const viewport = document.querySelector('meta[name="viewport"]')
          if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, shrink-to-fit=no')
          }
        }
      }
    }
    
    setVhProperty()
    fixSafariTextSize()
    
    // Run the fix again after a short delay to ensure it applies
    setTimeout(fixSafariTextSize, 100)
    
    window.addEventListener('resize', setVhProperty)
    window.addEventListener('orientationchange', fixSafariTextSize)
    
    return () => {
      window.removeEventListener('resize', setVhProperty)
      window.removeEventListener('orientationchange', fixSafariTextSize)
    }
  }, [])

  return <Component {...pageProps} />
}





