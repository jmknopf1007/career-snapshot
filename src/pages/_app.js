// src/pages/_app.js

// Core styles for react-notion-x
import 'react-notion-x/src/styles.css'

// Syntax highlighting
import 'prismjs/themes/prism-tomorrow.css' // or another prism theme if you prefer

// Math equations (KaTeX)
import 'katex/dist/katex.min.css'

import '../styles/globals.css' // your own styles, if any

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
