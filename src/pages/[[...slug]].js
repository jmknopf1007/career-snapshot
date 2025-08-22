import React, { useEffect, useState } from 'react'
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

// Custom Toggle component
function CustomToggle({ block, children }) {
  const [open, setOpen] = useState(false)
  const toggleOpen = (e) => {
    e.stopPropagation() // prevent parent click issues
    setOpen(!open)
  }

  return (
    <div className="notion-toggle">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Clickable arrow + date */}
        <div className="toggle-header" onClick={toggleOpen}>
          <span
            className="notion-toggle-arrow"
            style={{
              display: 'inline-block',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
          >
            ▶
          </span>
          <span>{block.dateRange}</span>
        </div>
        {/* Job title outside clickable area */}
        <span className="job-title">{block.jobTitle}</span>
      </div>
      {/* Toggle content (bullets) */}
      {open && (
        <div style={{ display: 'block', marginLeft: '1.75em', marginTop: '0.25rem' }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function Page({ recordMap }) {
  useEffect(() => {
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
          Toggle: CustomToggle
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
