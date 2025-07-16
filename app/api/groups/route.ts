import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Simple in-memory storage for demo
const groupsData = new Map<string, any>()
const userGroups = new Map<string, string[]>()

export async function POST(request: Request) {
  const cookieStore = cookies()
  const userPhone = cookieStore.get('userPhone')
  const userName = cookieStore.get('userName')

  if (!userPhone) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { name, memberPhones } = await request.json()

  if (!name || !memberPhones || memberPhones.length === 0) {
    return NextResponse.json({ error: 'Name and members required' }, { status: 400 })
  }

  // Create members array
  const members = memberPhones.map((phone: string) => ({
    phoneNumber: phone,
    name: phone === userPhone.value ? userName?.value : phone
  }))

  const group = {
    id: Date.now().toString(),
    name,
    members,
    createdBy: userPhone.value,
    createdAt: new Date().toISOString()
  }

  // Store group
  groupsData.set(group.id, group)

  // Store user-group associations
  memberPhones.forEach((phone: string) => {
    const currentGroups = userGroups.get(phone) || []
    userGroups.set(phone, [...currentGroups, group.id])
  })

  return NextResponse.json({ success: true, group })
}

export async function GET() {
  const cookieStore = cookies()
  const userPhone = cookieStore.get('userPhone')

  if (!userPhone) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const userGroupIds = userGroups.get(userPhone.value) || []
  const groups = userGroupIds.map(id => groupsData.get(id)).filter(Boolean)

  return NextResponse.json({ groups })
}