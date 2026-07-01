import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.json({
    user: process.env.BASIC_AUTH_USER ?? 'NOT SET',
    password: process.env.BASIC_AUTH_PASSWORD ? 'SET' : 'NOT SET',
  })
}

export const config = {
  matcher: '/:path*',
}

