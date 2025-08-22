import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { NotionAPI } from 'notion-client'
import { NotionRenderer } from 'react-notion-x'
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

// Dynamic imports for notion components
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

// === Custom Image renderer to use Notion's Alt Text ===
const CustomImage = ({ block, ...rest }) => {
  // Grab alt text from Notion's "Alt text" field
  const altText =
    block?.format?.block_alt_text ||
    block?.properties?.caption?.[0]?.[0] ||
    'Image'

  return (
    <img
      src={block?.format?.display_source}
      alt={altText}
      loading="lazy"
      decoding="async"
      style={{
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '4px'
      }}
      {...rest}
    />
  )
}

const slugToPageId = {
  '': '23b7fc8ef6c28048bc7be30a5325495c',
  'case-study/citizens-league': '23b7fc8ef6c2804082e1dc42ecb35399',
  'case-study/stenovate': '23d7fc8ef6c2800b8e9deaebec871c7b',
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
  useEffect(() => {
    // Only run this fix on homepage (one breadcrumb, no <a>)
    const breadcrumbs = document.querySelectorAll('.notion-nav-header .breadcrumb')
    if (breadcrumbs.length === 1) {
      const activeBreadcrumb = breadcrumbs[0]
      if (activeBreadcrumb && !activeBreadcrumb.closest('a')) {
        const title = activeBreadcrumb.querySelector('.title')
        if (title) {
          const link = document.createElement('a')
          link.className = activeBreadcrumb.className.replace('active', '').trim()
          link.href = '/'
          link.appendChild(title.cloneNode(true))
          activeBreadcrumb.replaceWith(link)
        }
      }
    }
  }, [])

  return (
    <div className="site-container">
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
          image: CustomImage // ✅ our custom renderer
        }}
        mapPageUrl={(id) => {
          const cleanId = id.replace(/-/g, '')
          const slug = pageIdToSlug[cleanId]
          return slug ? `/${slug}` : '/'
        }}
      />
      <footer className="site-footer">©{new Date().getFullYear()} Jacob Knopf</footer>
    </div>
  )
}
