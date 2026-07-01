import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const auth = request.headers.get('authorization')

  if (auth?.startsWith('Basic ')) {
    const encoded = auth.split(' ')[1]
    const decoded = atob(encoded)
    const [user, password] = decoded.split(':')

    if (
      user === process.env.BASIC_AUTH_USER &&
      password === process.env.BASIC_AUTH_PASSWORD
    ) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Jacob Knopf Portfolio"',
    },
  })
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?|ttf|eot)$).*)',
  ],
}
