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
    
    // Additional Safari text size fix
    function fixSafariTextSize() {
      if (typeof window !== 'undefined' && /Safari/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent)) {
        document.documentElement.style.setProperty('-webkit-text-size-adjust', 'none', 'important')
        document.body.style.setProperty('-webkit-text-size-adjust', 'none', 'important')
        document.body.style.setProperty('font-size', '16px', 'important')
      }
    }
    
    setVhProperty()
    fixSafariTextSize()
    
    window.addEventListener('resize', setVhProperty)
    return () => window.removeEventListener('resize', setVhProperty)
  }, [])

  return <Component {...pageProps} />
}




