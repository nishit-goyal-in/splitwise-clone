import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Simple in-memory storage for demo
const expensesData = new Map<string, any[]>()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const groupId = searchParams.get('groupId')

  if (!groupId) {
    return NextResponse.json({ error: 'Group ID required' }, { status: 400 })
  }

  const expenses = expensesData.get(groupId) || []
  return NextResponse.json({ expenses })
}

export async function POST(request: Request) {
  const cookieStore = cookies()
  const userPhone = cookieStore.get('userPhone')

  if (!userPhone) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const expense = await request.json()

  if (!expense.groupId || !expense.description || !expense.amount || !expense.paidBy || !expense.splitBetween) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const newExpense = {
    ...expense,
    id: Date.now().toString(),
    date: new Date().toISOString()
  }

  // Store expense
  const groupExpenses = expensesData.get(expense.groupId) || []
  expensesData.set(expense.groupId, [...groupExpenses, newExpense])

  return NextResponse.json({ success: true, expense: newExpense })
}