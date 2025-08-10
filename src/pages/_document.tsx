import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Viewport meta with viewport-fit=cover for iOS safe area and disable zoom */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        {/* Disable automatic detection of phone, date, etc */}
        <meta name="format-detection" content="telephone=no,date=no,address=no,email=no" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}










