import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { NotionAPI } from 'notion-client'
import { NotionRenderer, PageHeader } from 'react-notion-x'
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'
import altText from '@/data/altText'

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

function normalizeImageUrl(src) {
  // Remove query string but keep percent encoding to match keys exactly
  return src.split('?')[0]
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
    // Breadcrumb fix...
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
    // Callout clickable divs...
    const calloutDivs = document.querySelectorAll('.notion-callout-text')
    calloutDivs.forEach((div) => {
      const link = div.querySelector('a.notion-link')
      if (link && link.href) {
        const href = link.href
        const clickHandler = (e) => {
          if (e.target.tagName !== 'A') {
            if (href.startsWith('mailto:')) window.location.href = href
            else window.open(href, '_blank', 'noopener,noreferrer')
          }
        }
        div.style.cursor = 'pointer'
        div.addEventListener('click', clickHandler)
        div._clickHandler = clickHandler
      }
    })
    return () => {
      const calloutDivs = document.querySelectorAll('.notion-callout-text')
      calloutDivs.forEach(div => {
        if (div._clickHandler) {
          div.removeEventListener('click', div._clickHandler)
          delete div._clickHandler
        }
      })
    }
  }, [])

  return (
    <div className="site-container">
      <NotionRenderer
        recordMap={recordMap}
        fullPage
        darkMode={false}
        mapPageUrl={(id) => {
          const cleanId = id.replace(/-/g, '')
          const slug = pageIdToSlug[cleanId]
          return slug ? `/${slug}` : '/'
        }}
        mapImageUrl={(url) => {
          // Normalize URL to base without query params, keep %3A encoding
          return normalizeImageUrl(url)
        }}
        components={{
          Code,
          Collection,
          Equation,
          Pdf,
          Modal,
          Image: (props) => {
            // React Notion X passes normalized src here already via mapImageUrl
            const alt = altText[props.src] ?? props.alt ?? ''
            return <img {...props} alt={alt} />
          },
          PageHeader: (props) => {
            const coverSrc = normalizeImageUrl(props.cover)
            const alt = altText[coverSrc] ?? 'Page cover'
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
          },
        }}
      />
      <footer className="site-footer">©{new Date().getFullYear()} Jacob Knopf</footer>
    </div>
  )
}
