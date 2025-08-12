import '@/styles/globals.css'
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useRouter } from 'next/router'  // <-- import useRouter

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    function setVhProperty() {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setVhProperty()

    window.addEventListener('resize', setVhProperty)
    window.addEventListener('scroll', setVhProperty)

    return () => {
      window.removeEventListener('resize', setVhProperty)
      window.removeEventListener('scroll', setVhProperty)
    }
  }, [])

  useEffect(() => {
    // Add or remove 'home' class on body based on current path
    if (typeof window !== 'undefined') {
      if (router.pathname === '/') {
        document.body.classList.add('home')
      } else {
        document.body.classList.remove('home')
      }
    }
  }, [router.pathname])

  return <Component {...pageProps} />
}






