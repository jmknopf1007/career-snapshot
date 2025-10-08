import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { NotionAPI } from 'notion-client'
import { NotionRenderer, PageHeader } from 'react-notion-x'
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

// Dynamic imports
const Code = dynamic(() =>
  import('react-notion-x').then((mod) => mod.Code),
  { ssr: false }
)
const Equation = dynamic(() =>
  import('react-notion-x').then((mod) => mod.Equation),
  { ssr: false }
)
const Pdf = dynamic(() =>
  import('react-notion-x').then((mod) => mod.Pdf),
  { ssr: false }
)
const Modal = dynamic(() =>
  import('react-notion-x').then((mod) => mod.Modal),
  { ssr: false }
)

// Collection & CollectionView
const Collection = dynamic(() =>
  import('react-notion-x').then((mod) => mod.Collection),
  { ssr: false }
)
const CollectionView = dynamic(() =>
  import('react-notion-x').then((mod) => mod.CollectionView),
  { ssr: false }
)
const CollectionViewPage = dynamic(() =>
  import('react-notion-x').then((mod) => mod.CollectionViewPage),
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
  return { props: { recordMap, slug }, revalidate: 60 }
}

export async function getStaticPaths() {
  const paths = Object.keys(slugToPageId).map((slug) => ({
    params: { slug: slug === '' ? [] : slug.split('/') }
  }))
  return { paths, fallback: 'blocking' }
}

export default function Page({ recordMap, slug }) {
  const canonicalUrl = slug ? `https://jacobknopf.com/${slug}` : 'https://jacobknopf.com'

  return (
    <div className="site-container">
      <Head>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
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
          Image: (props) => <img {...props} />,
          PageHeader: (props) =>
            props.cover ? (
              <PageHeader
                {...props}
                cover={
                  <img
                    src={props.cover}
                    alt="Page cover"
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
                }
              />
            ) : (
              <PageHeader {...props} />
            )
        }}
        collectionComponents={{ CollectionView, CollectionViewPage }}
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
