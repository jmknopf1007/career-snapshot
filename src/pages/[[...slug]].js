import React from 'react'
import { NotionAPI } from 'notion-client'
import dynamic from 'next/dynamic'
import { NotionRenderer } from 'react-notion-x'
import Head from 'next/head'
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

// Correct dynamic imports for react-notion-x v7+
const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.Collection)
)
const CollectionRow = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.CollectionRow)
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(() =>
  import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  { ssr: false }
)
const Modal = dynamic(() =>
  import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  { ssr: false }
)

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  const slug = params.slug?.[0] || ''
  const notion = new NotionAPI()

  // Replace this with your actual Notion page ID map
  const pageMap = {
    '': 'YOUR-HOME-PAGE-ID',
    'case-study/stenovate': 'YOUR-STENOVATE-PAGE-ID',
    'case-study/other': 'YOUR-OTHER-PAGE-ID'
  }

  const pageId = pageMap[slug] || pageMap['']
  const recordMap = await notion.getPage(pageId)

  return {
    props: {
      recordMap,
      slug
    },
    revalidate: 60
  }
}

export default function NotionPage({ recordMap, slug }) {
  if (!recordMap) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Jacob Knopf — UX Portfolio</title>
        <meta
          name="description"
          content="UX Designer Jacob Knopf – Case Studies, Work Samples, and Contact Info."
        />
      </Head>

      <div className="notion-page-container">
        <NotionRenderer
          recordMap={recordMap}
          fullPage={true}
          darkMode={false}
          components={{
            Code,
            Collection,
            CollectionRow,
            Equation,
            Pdf,
            Modal,
            // your custom renderers, if any:
            // callout, pageIcon, etc.
          }}
        />
      </div>
    </>
  )
}
