import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Canonical responsive viewport for iOS/Android.
            NOTE: we intentionally DO NOT force maximum-scale=1 here.
            That prevents accessibility and doesn't solve this specific problem. */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
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










