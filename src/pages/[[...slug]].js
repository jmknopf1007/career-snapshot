import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { NotionAPI } from 'notion-client'
import { NotionRenderer, Image as DefaultImage } from 'react-notion-x'

import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

// Dynamic imports
const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.Collection)
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

// --- Alt Text Injection for Images ---
const CustomImage = ({ block, ...props }) => {
  const caption = block?.properties?.caption?.[0]?.[0] || 'Image'
  return <DefaultImage block={block} alt={caption} {...props} />
}

// --- Optional: Post-render cover photo alt fix ---
const useCoverPhotoAltFix = () => {
  useEffect(() => {
    const coverImg = document.querySelector('.notion-page-cover img')
    if (coverImg && !coverImg.alt) {
      coverImg.alt = 'Cover image for this page'
    }
  }, [])
}

// --- Slug-to-ID map ---
const slugToPageId = {
  '': '23b7fc8ef6c28048bc7be30a5325495c',
  'case-study/stenovate': '23d7fc8ef6c2800b8e9deaebec871c7b',
  'case-study/policy-bytes': '23b7fc8ef6c2804082e1dc42ecb35399',
  'case-study/aurelius': '23b7fc8ef6c28016b2b5fdc0d5d2222e'
}

const pageIdToSlug = Object.entries(slugToPageId).reduce((acc, [slug, id]) => {
  acc[id.replace(/-/g, '')] = slug
  return acc
}, {})

export async function getStaticProps({ params }) {
  const slugArray = params?.slug || []
  const slug = slugArray.join('/')
  const pageId = slugToPageId[slug]

  if (!pageId) return { notFound: true }

  const notion = new NotionAPI()
  const recordMap = await notion.getPage(pageId)

  return {
    props: { recordMap },
    revalidate: 60
  }
}

export async function getStaticPaths() {
  const paths = Object.keys(slugToPageId).map((slug) => ({
    params: { slug: slug === '' ? [] : slug.split('/') }
  }))
  return { paths, fallback: 'blocking' }
}

export default function Page({ recordMap }) {
  useCoverPhotoAltFix()

  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage
      darkMode={false}
      components={{
        Code,
        Collection,
        Equation,
        Pdf,
        Modal,
        Image: CustomImage
      }}
      mapPageUrl={(id) => {
        const cleanId = id.replace(/-/g, '')
        const slug = pageIdToSlug[cleanId]
        return slug ? `/${slug}` : '/'
      }}
    />
  )
}
