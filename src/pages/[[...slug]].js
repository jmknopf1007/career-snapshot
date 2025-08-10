import React from 'react'
import Head from 'next/head'
// ... your imports as before

export default function Page({ recordMap }) {
  return (
    <>
      <Head>{/* Add any page-specific meta here, but no viewport tag! */}</Head>
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
          }}
          mapPageUrl={(id) => {
            const cleanId = id.replace(/-/g, '')
            const slug = pageIdToSlug[cleanId]
            return slug ? `/${slug}` : '/'
          }}
        />
        <footer className="site-footer">
          ©{new Date().getFullYear()} Jacob Knopf
        </footer>
      </div>
    </>
  )
}
