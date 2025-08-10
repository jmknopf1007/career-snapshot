import '@/styles/globals.css'
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // keep --vh for iOS viewport height handling (unchanged)
    function setVhProperty() {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    setVhProperty()
    window.addEventListener('resize', setVhProperty)

    // force Safari to respect text-size-adjust (extra safeguard)
    try {
      document.documentElement.style.setProperty('-webkit-text-size-adjust', '100%')
      document.body.style.setProperty('-webkit-text-size-adjust', '100%')
      // ensure a stable base size
      document.documentElement.style.fontSize = '16px'
    } catch (e) {
      // defensive: if environment blocks setting these, ignore
      // (no need to break the app)
      // eslint-disable-next-line no-console
      console.warn('Could not apply Safari text-size adjustments', e)
    }

    return () => {
      window.removeEventListener('resize', setVhProperty)
    }
  }, [])

  return <Component {...pageProps} />
}



