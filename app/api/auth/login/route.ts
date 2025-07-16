import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { phoneNumber, name } = await request.json()

  if (!phoneNumber || !name) {
    return NextResponse.json({ error: 'Phone number and name required' }, { status: 400 })
  }

  // Store user data in cookies
  const cookieStore = await cookies()
  cookieStore.set('userPhone', phoneNumber, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
  
  cookieStore.set('userName', name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return NextResponse.json({ success: true, user: { phoneNumber, name } })
}