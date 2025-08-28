import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { NotionAPI } from 'notion-client'
import { NotionRenderer, PageHeader } from 'react-notion-x'
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'
import altText from '@/data/altText'  // <-- import alt text mapping
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
// Helper to strip query strings from Notion image URLs
function normalizeImageUrl(src) {
  return src.split('?')[0] // take only the base path
}

// New clickable div wrapper for callout links
function CalloutLink({ href, children, icon }) {
  const handleClick = (e) => {
    // Only open link if click is NOT on a link inside
    if (e.target.tagName !== 'A') {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
  }
  return (
    <div
      className="notion-callout-text"
      style={{ cursor: 'pointer' }}
      onClick={handleClick}
    >
      {icon} {children}
    </div>
  )
}

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
          // Override images to inject alt text
          Image: (props) => {
            const baseSrc = normalizeImageUrl(props.src)
            const alt = altText[baseSrc] || props.alt || ''
            return <img {...props} alt={alt} />
          },
          // Override page header to handle cover image alt text
          PageHeader: (props) => {
            const coverSrc = normalizeImageUrl(props.cover)
            const alt = altText[coverSrc] || 'Page cover'
            return (
              <PageHeader
                {...props}
                cover={
                  props.cover ? (
                    <img
                      src={props.cover}
                      alt={alt}
                      style={{
                        display: 'block',
                        objectFit: 'cover',
                        borderRadius: 0,
                        width: '100%',
                        height: '30vh',
                        maxHeight: 280,
                        opacity: 1,
                        objectPosition: 'center 50%'
                      }}
                    />
                  ) : null
                }
              />
            )
          }
        }}
        mapPageUrl={(id) => {
          const cleanId = id.replace(/-/g, '')
          const slug = pageIdToSlug[cleanId]
          return slug ? `/${slug}` : '/'
        }}
      />

      {/* Example usage for your social links callout block */}
      <CalloutLink href="https://www.linkedin.com/in/jacob-knopf" icon="🔗">
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="notion-link"
          href="https://www.linkedin.com/in/jacob-knopf"
        >
          My LinkedIn Page
        </a>
      </CalloutLink>
      <CalloutLink href="mailto:jmknopf1007@gmail.com" icon="📧">
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="notion-link"
          href="mailto:jmknopf1007@gmail.com"
        >
          My Gmail Address
        </a>
      </CalloutLink>
      <CalloutLink href="https://jmknopf1007.medium.com" icon="✍️">
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="notion-link"
          href="https://jmknopf1007.medium.com"
        >
          My Medium Blog
        </a>
      </CalloutLink>

      <footer className="site-footer">©{new Date().getFullYear()} Jacob Knopf</footer>
    </div>
  )
}
