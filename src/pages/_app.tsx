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

    setVhProperty()

    // Listen to resize and scroll events to update --vh to fix phantom scroll on Chrome mobile
    window.addEventListener('resize', setVhProperty)
    window.addEventListener('scroll', setVhProperty)

    return () => {
      window.removeEventListener('resize', setVhProperty)
      window.removeEventListener('scroll', setVhProperty)
    }
  }, [])

  return <Component {...pageProps} />
}





