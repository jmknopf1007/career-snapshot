import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Simplified viewport for mobile zoom fix */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Disable auto phone/date/address/email detection on iOS Safari */}
        <meta name="format-detection" content="telephone=no,date=no,address=no,email=no" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}







