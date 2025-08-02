import React from 'react'
import dynamic from 'next/dynamic'
import { NotionAPI } from 'notion-client'
import { NotionRenderer } from 'react-notion-x'

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

// Slug to Page ID mapping
const slugToPageId = {
  '': '23b7fc8ef6c28048bc7be30a5325495c',
  'case-study/stenovate': '23d7fc8ef6c2800b8e9deaebec871c7b',
  'case-study/policy-bytes': '23b7fc8ef6c2804082e1dc42ecb35399',
  'case-study/aurelius': '23b7fc8ef6c28016b2b5fdc0d5d2222e',
}

// Reverse map for clean URLs
const pageIdToSlug = Object.entries(slugToPageId).reduce((acc, [slug, id]) => {
  acc[id.replace(/-/g, '')] = slug
  return acc
}, {})

// ✅ Custom pageIcon override — matches keywords in callout text
const CustomPageIcon = ({ block }) => {
  const icon = block?.value?.format?.page_icon
  const title = block?.properties?.title?.[0]?.[0]?.toLowerCase() || ''

  // 1. If the title includes a known keyword, override with a local icon
  const keywords = ['gmail', 'linkedin', 'medium']
  const keyword = keywords.find((key) => title.includes(key))

  if (keyword) {
    return (
      <img
        className="notion-page-icon"
        src={`/icons/${keyword}.png`}
        alt={keyword}
        loading="lazy"
        decoding="async"
        style={{ width: '1.5em', height: '1.5em', objectFit: 'contain' }}
      />
    )
  }

  // 2. If icon is a URL (Notion-hosted or external), render it
  if (typeof icon === 'string' && icon.startsWith('http')) {
    return (
      <img
        className="notion-page-icon"
        src={icon}
        alt="icon"
        loading="lazy"
        decoding="async"
        style={{ width: '1.5em', height: '1.5em', objectFit: 'contain' }}
      />
    )
  }

  // 3. Fallback to emoji
  if (typeof icon === 'string') {
    return (
      <span className="notion-page-icon" role="img" aria-label="icon">
        {icon}
      </span>
    )
  }

  return null
}

// Inline page link renderer
const CustomPageLink = ({ href, children, ...props }) => (
  <a href={href} {...props}>
    <span className="notion-page-icon-inline">
      <CustomPageIcon block={props.block} />
    </span>
    {children}
  </a>
)

// Fetch Notion content
export async function getStaticProps({ params }) {
  const slugArray = params?.slug || []
  const slug = slugArray.join('/')
  const pageId = slugToPageId[slug]

  if (!pageId) {
    return { notFound: true }
  }

  const notion = new NotionAPI()
  const recordMap = await notion.getPage(pageId)

  return {
    props: {
      recordMap,
    },
    revalidate: 60,
  }
}

// Generate static paths
export async function getStaticPaths() {
  const paths = Object.keys(slugToPageId).map((slug) => ({
    params: { slug: slug === '' ? [] : slug.split('/') },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}

// Render Notion content
export default function Page({ recordMap }) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={true}
      darkMode={false}
      components={{
        Code,
        Collection,
        Equation,
        Pdf,
        Modal,
        pageIcon: CustomPageIcon,
        pageLink: CustomPageLink,
      }}
      mapPageUrl={(id) => {
        const cleanId = id.replace(/-/g, '')
        const slug = pageIdToSlug[cleanId]
        return slug ? `/${slug}` : '/'
      }}
    />
  )
}

