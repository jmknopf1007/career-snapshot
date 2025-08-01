import React from 'react'
import dynamic from 'next/dynamic'
import { NotionAPI } from 'notion-client'
import { NotionRenderer } from 'react-notion-x'

import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

const Code = dynamic(() => import('react-notion-x/build/third-party/code').then(m => m.Code))
const Collection = dynamic(() => import('react-notion-x/build/third-party/collection').then(m => m.Collection))
const Equation = dynamic(() => import('react-notion-x/build/third-party/equation').then(m => m.Equation))
const Pdf = dynamic(() => import('react-notion-x/build/third-party/pdf').then(m => m.Pdf), { ssr: false })
const Modal = dynamic(() => import('react-notion-x/build/third-party/modal').then(m => m.Modal), { ssr: false })

export async function getStaticProps({ params }) {
  const slug = params?.slug?.join('/') || ''
  const notion = new NotionAPI()

  // Map URL slugs to Notion Page IDs
  const slugToPageId = {
    '': '23b7fc8ef6c28048bc7be30a5325495c',   // homepage
    'case-study/stenovate': '23d7fc8ef6c2800b8e9deaebec871c7b',   // subpages
    'case-study/policy-bytes': '23b7fc8ef6c2804082e1dc42ecb35399',
    'case-study/aurelius': '23b7fc8ef6c28016b2b5fdc0d5d2222e',
  }

  const pageId = slugToPageId[slug]

  if (!pageId) {
    return {
      notFound: true
    }
  }

  const recordMap = await notion.getPage(pageId)

  return {
    props: {
      recordMap
    },
    revalidate: 60 // Rebuild every 60s (ISR)
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {
  const slugArray = params.slug || [];
  const slug = slugArray.join('/');

  const pageId = slugToPageId[slug];

  if (!pageId) {
    return {
      notFound: true,
    };
  }

  // fetch data and return props
}

export default function Page({ recordMap }) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={true}
      darkMode={false}
      components={{ Code, Collection, Equation, Pdf, Modal }}
    />
  )
}
