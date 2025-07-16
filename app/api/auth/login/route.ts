import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { store } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { phoneNumber, name } = await request.json()

  if (!phoneNumber || !name) {
    return NextResponse.json({ error: 'Phone number and name required' }, { status: 400 })
  }

  // Create or get user
  let user = store.getUser(phoneNumber)
  if (!user) {
    user = store.createUser(phoneNumber, name)
  }
  
  // Set a cookie with the user session
  const cookieStore = await cookies()
  cookieStore.set('userPhone', phoneNumber, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return NextResponse.json({ success: true, user })
}