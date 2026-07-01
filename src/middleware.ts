import { NextRequest, NextResponse } from 'next/server'

function decodeBasicAuth(authHeader: string) {
  const base64 = authHeader.split(' ')[1]
  const binary = atob(base64)

  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function middleware(request: NextRequest) {
  const auth = request.headers.get('authorization')

  if (auth?.startsWith('Basic ')) {
    try {
      const decoded = decodeBasicAuth(auth)
      const [user, password] = decoded.split(':')

      const validUser = process.env.BASIC_AUTH_USER
      const validPass = process.env.BASIC_AUTH_PASSWORD

      if (user === validUser && password === validPass) {
        return NextResponse.next()
      }
    } catch (e) {
      // ignore and fall through to 401
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="jacobknopf.com"',
    },
  })
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
}
