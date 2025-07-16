'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sparkles from '@/components/Sparkles'

interface User {
  phoneNumber: string
  name: string
}

interface Group {
  id: string
  name: string
  members: User[]
}

interface Expense {
  id: string
  groupId: string
  description: string
  amount: number
  paidBy: string
  splitBetween: string[]
  date: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    const response = await fetch('/api/user')
    if (response.ok) {
      const data = await response.json()
      setUser(data.user)
      setGroups(data.groups)
    } else {
      router.push('/')
    }
  }

  const handleCreateGroup = async (groupName: string, memberPhones: string[]) => {
    const response = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: groupName, memberPhones }),
    })
    
    if (response.ok) {
      fetchUserData()
      setShowCreateGroup(false)
    }
  }

  const handleAddExpense = async (expense: Omit<Expense, 'id' | 'date'>) => {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    })
    
    if (response.ok) {
      fetchGroupExpenses(expense.groupId)
      setShowAddExpense(false)
    }
  }

  const fetchGroupExpenses = async (groupId: string) => {
    const response = await fetch(`/api/expenses?groupId=${groupId}`)
    if (response.ok) {
      const data = await response.json()
      setExpenses(data.expenses)
    }
  }

  const selectGroup = (group: Group) => {
    setSelectedGroup(group)
    fetchGroupExpenses(group.id)
  }

  return (
    <div className="min-h-screen p-4 pb-20 relative overflow-hidden">
      <Sparkles />
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black uppercase">Hey {user?.name}!</h1>
          <p className="text-lg font-bold mt-2">Manage your shared expenses</p>
        </header>

        {!selectedGroup ? (
          <>
            <div className="mb-6">
              <button onClick={() => setShowCreateGroup(true)} className="neo-btn">
                + Create New Group
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {groups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => selectGroup(group)}
                  className="neo-card p-6 cursor-pointer hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <h3 className="text-xl font-black uppercase mb-2">{group.name}</h3>
                  <p className="font-bold">{group.members.length} members</p>
                  <div className="mt-3 text-sm">
                    {group.members.map((member, idx) => (
                      <span key={member.phoneNumber}>
                        {member.name}
                        {idx < group.members.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {groups.length === 0 && (
              <div className="neo-card p-8 text-center">
                <p className="text-xl font-bold mb-4">No groups yet!</p>
                <p>Create a group to start splitting expenses with friends.</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap gap-4">
              <button onClick={() => setSelectedGroup(null)} className="neo-btn-secondary">
                ← Back to Groups
              </button>
              <button onClick={() => setShowAddExpense(true)} className="neo-btn-accent">
                + Add Expense
              </button>
            </div>

            <div className="neo-card-lg p-6 mb-6">
              <h2 className="text-2xl font-black uppercase mb-4">{selectedGroup.name}</h2>
              <BalanceSummary group={selectedGroup} expenses={expenses} currentUser={user!} />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-black uppercase">Expenses</h3>
              {expenses.map((expense) => {
                const payer = selectedGroup.members.find(m => m.phoneNumber === expense.paidBy)
                return (
                  <div key={expense.id} className="neo-card p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black">{expense.description}</p>
                        <p className="text-sm font-bold mt-1">
                          Paid by {payer?.name} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm mt-1">
                          Split between {expense.splitBetween.length} people
                        </p>
                      </div>
                      <p className="text-xl font-black">₹{expense.amount}</p>
                    </div>
                  </div>
                )
              })}
              {expenses.length === 0 && (
                <div className="neo-card p-6 text-center">
                  <p>No expenses yet. Add your first expense!</p>
                </div>
              )}
            </div>
          </>
        )}

        {showCreateGroup && (
          <CreateGroupModal 
            onClose={() => setShowCreateGroup(false)}
            onCreate={handleCreateGroup}
            currentUser={user!}
          />
        )}

        {showAddExpense && selectedGroup && (
          <AddExpenseModal
            group={selectedGroup}
            onClose={() => setShowAddExpense(false)}
            onAdd={handleAddExpense}
          />
        )}
      </div>
    </div>
  )
}

function BalanceSummary({ group, expenses, currentUser }: { group: Group, expenses: Expense[], currentUser: User }) {
  const balances = new Map<string, number>()
  
  expenses.forEach(expense => {
    const perPersonAmount = expense.amount / expense.splitBetween.length
    
    if (expense.paidBy === currentUser.phoneNumber) {
      expense.splitBetween.forEach(phone => {
        if (phone !== currentUser.phoneNumber) {
          balances.set(phone, (balances.get(phone) || 0) + perPersonAmount)
        }
      })
    } else if (expense.splitBetween.includes(currentUser.phoneNumber)) {
      balances.set(expense.paidBy, (balances.get(expense.paidBy) || 0) - perPersonAmount)
    }
  })

  const totalOwed = Array.from(balances.values()).filter(v => v > 0).reduce((a, b) => a + b, 0)
  const totalOwe = Math.abs(Array.from(balances.values()).filter(v => v < 0).reduce((a, b) => a + b, 0))

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-[#25D366] border-[4px] border-black rounded-[20px]" style={{boxShadow: '4px 4px 0px #000000'}}>
        <p className="font-bold uppercase text-sm">You are owed</p>
        <p className="text-2xl font-black">₹{totalOwed.toFixed(2)}</p>
      </div>
      <div className="p-4 bg-[#FF7A00] border-[4px] border-black rounded-[20px]" style={{boxShadow: '4px 4px 0px #000000'}}>
        <p className="font-bold uppercase text-sm">You owe</p>
        <p className="text-2xl font-black">₹{totalOwe.toFixed(2)}</p>
      </div>
    </div>
  )
}

function CreateGroupModal({ onClose, onCreate, currentUser }: { onClose: () => void, onCreate: (name: string, phones: string[]) => void, currentUser: User }) {
  const [groupName, setGroupName] = useState('')
  const [memberInputs, setMemberInputs] = useState([''])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validPhones = memberInputs.filter(p => p.trim())
    onCreate(groupName, [...validPhones, currentUser.phoneNumber])
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="neo-card-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-black uppercase mb-4">Create Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-black uppercase mb-2">Group Name</label>
            <input
              type="text"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Weekend Trip"
            />
          </div>
          
          <div>
            <label className="block text-sm font-black uppercase mb-2">Add Members (Phone Numbers)</label>
            {memberInputs.map((phone, index) => (
              <div key={index} className="mb-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const newInputs = [...memberInputs]
                    newInputs[index] = e.target.value
                    setMemberInputs(newInputs)
                  }}
                  placeholder="+91 98765 43210"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setMemberInputs([...memberInputs, ''])}
              className="neo-btn-secondary text-sm mt-2"
            >
              + Add Another
            </button>
          </div>
          
          <div className="flex gap-2">
            <button type="submit" className="neo-btn flex-1">Create</button>
            <button type="button" onClick={onClose} className="neo-btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddExpenseModal({ group, onClose, onAdd }: { group: Group, onClose: () => void, onAdd: (expense: any) => void }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(group.members[0].phoneNumber)
  const [splitBetween, setSplitBetween] = useState(group.members.map(m => m.phoneNumber))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      groupId: group.id,
      description,
      amount: parseFloat(amount),
      paidBy,
      splitBetween
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="neo-card-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-black uppercase mb-4">Add Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-black uppercase mb-2">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dinner at restaurant"
            />
          </div>
          
          <div>
            <label className="block text-sm font-black uppercase mb-2">Amount (₹)</label>
            <input
              type="number"
              required
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-black uppercase mb-2">Paid By</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-4 py-3 border-[4px] border-black bg-white font-medium rounded-[20px]"
            >
              {group.members.map(member => (
                <option key={member.phoneNumber} value={member.phoneNumber}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-black uppercase mb-2">Split Between</label>
            {group.members.map(member => (
              <label key={member.phoneNumber} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={splitBetween.includes(member.phoneNumber)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSplitBetween([...splitBetween, member.phoneNumber])
                    } else {
                      setSplitBetween(splitBetween.filter(p => p !== member.phoneNumber))
                    }
                  }}
                  className="w-5 h-5"
                />
                <span className="font-bold">{member.name}</span>
              </label>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button type="submit" className="neo-btn flex-1">Add</button>
            <button type="button" onClick={onClose} className="neo-btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}