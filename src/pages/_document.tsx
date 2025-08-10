import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Simplified viewport, removed user-scalable=no to avoid Safari zoom issues */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Keep this for iOS Safari to disable auto phone, date, etc detection */}
        <meta name="format-detection" content="telephone=no,date=no,address=no,email=no" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}






