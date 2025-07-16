import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const userPhone = cookieStore.get('userPhone')
  const userName = cookieStore.get('userName')

  if (!userPhone || !userName) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const user = {
    phoneNumber: userPhone.value,
    name: userName.value
  }

  // For now, return empty groups array
  // In a real app, this would fetch from a database
  const groups: any[] = []

  return NextResponse.json({ user, groups })
}