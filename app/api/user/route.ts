import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { store } from '@/lib/store'

export async function GET() {
  const cookieStore = cookies()
  const userPhone = cookieStore.get('userPhone')

  if (!userPhone) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const user = store.getUser(userPhone.value)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const groups = store.getGroupsForUser(userPhone.value)

  return NextResponse.json({ user, groups })
}