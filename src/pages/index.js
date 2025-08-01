import React from 'react'
import dynamic from 'next/dynamic'
import { NotionAPI } from 'notion-client'

// Required styles
import 'react-notion-x/src/styles.css'
import 'katex/dist/katex.min.css'

// Lazy-load heavy components
const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(m => m.Code)
)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(m => m.Collection)
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then(m => m.Equation)
)
const Pdf = dynamic(() =>
  import('react-notion-x/build/third-party/pdf').then(m => m.Pdf),
  { ssr: false }
)
const Modal = dynamic(() =>
  import('react-notion-x/build/third-party/modal').then(m => m.Modal),
  { ssr: false }
)

import { NotionRenderer } from 'react-notion-x'

export async function getStaticProps() {
  const notion = new NotionAPI()
  const recordMap = await notion.getPage('23b7fc8ef6c28048bc7be30a5325495c')

  return {
    props: {
      recordMap
    },
    revalidate: 60 // ISR: Rebuild every 60s
  }
}

export default function Resume({ recordMap }) {
  return (
    <div className="notion-container">
      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={false}
        components={{
          Code,
          Collection,
          Equation,
          Pdf,
          Modal
        }}
      />
    </div>
  )
}
