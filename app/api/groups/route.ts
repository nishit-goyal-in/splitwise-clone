import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { store } from '@/lib/store'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const userPhone = cookieStore.get('userPhone')

  if (!userPhone) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { name, memberPhones } = await request.json()

  if (!name || !memberPhones || memberPhones.length === 0) {
    return NextResponse.json({ error: 'Name and members required' }, { status: 400 })
  }

  // Get all member users (create if they don't exist)
  const members = memberPhones.map((phone: string) => {
    let user = store.getUser(phone)
    if (!user) {
      // Create placeholder user with phone number as name
      user = store.createUser(phone, phone)
    }
    return user
  })

  const group = store.createGroup(name, userPhone.value, members)

  return NextResponse.json({ success: true, group })
}