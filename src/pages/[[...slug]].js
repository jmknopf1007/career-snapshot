import React from 'react'
import { useRouter } from 'next/router'
import { NotionAPI } from 'notion-client'
import dynamic from 'next/dynamic'
import { NotionRenderer } from 'react-notion-x'
import Head from 'next/head'
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

// Dynamic imports with SSR disabled
const Code = dynamic(
  () => import('react-notion-x/build/third-party/code').then((m) => m.Code),
  { ssr: false }
)
const Collection = dynamic(
  () => import('react-notion-x/build/third-party/collection').then((m) => m.Collection),
  { ssr: false }
)
const CollectionRow = dynamic(
  () => import('react-notion-x/build/third-party/collection').then((m) => m.CollectionRow),
  { ssr: false }
)
const Equation = dynamic(
  () => import('react-notion-x/build/third-party/equation').then((m) => m.Equation),
  { ssr: false }
)
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  { ssr: false }
)
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  { ssr: false }
)

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  const slug = params.slug?.join('/') || ''
  const notion = new NotionAPI()

  const pageMap = {
  '': '23b7fc8ef6c28048bc7be30a5325495c',
  'case-study/citizens-league': '23b7fc8ef6c2804082e1dc42ecb35399',
  'case-study/stenovate': '23d7fc8ef6c2800b8e9deaebec871c7b',
  'case-study/aurelius': '23b7fc8ef6c28016b2b5fdc0d5d2222e'
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
  const router = useRouter()

  if (router.isFallback || !recordMap) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Jacob Knopf: Career Snapshot</title>
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
            Modal
          }}
        />
      </div>
    </>
  )
}
