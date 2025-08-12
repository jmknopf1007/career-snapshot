import '@/styles/globals.css'
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const setVhProperty = () => {
      // Use innerHeight for accurate mobile viewport height
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    // Initial set
    setVhProperty()

    // Update on resize & orientation change
    window.addEventListener('resize', setVhProperty)
    window.addEventListener('orientationchange', setVhProperty)
    window.addEventListener('pageshow', setVhProperty)

    return () => {
      window.removeEventListener('resize', setVhProperty)
      window.removeEventListener('orientationchange', setVhProperty)
      window.removeEventListener('pageshow', setVhProperty)
    }
  }, [])

  return <Component {...pageProps} />
}






