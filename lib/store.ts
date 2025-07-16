interface User {
  phoneNumber: string
  name: string
}

interface Group {
  id: string
  name: string
  members: User[]
  createdBy: string
  createdAt: string
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

class Store {
  private users: Map<string, User> = new Map()
  private groups: Map<string, Group> = new Map()
  private expenses: Map<string, Expense> = new Map()

  getUser(phoneNumber: string): User | undefined {
    return this.users.get(phoneNumber)
  }

  createUser(phoneNumber: string, name: string): User {
    const user: User = { phoneNumber, name }
    this.users.set(phoneNumber, user)
    return user
  }

  createGroup(name: string, createdBy: string, members: User[]): Group {
    const group: Group = {
      id: Date.now().toString(),
      name,
      members,
      createdBy,
      createdAt: new Date().toISOString()
    }
    this.groups.set(group.id, group)
    return group
  }

  getGroupsForUser(phoneNumber: string): Group[] {
    return Array.from(this.groups.values()).filter(group => 
      group.members.some(member => member.phoneNumber === phoneNumber)
    )
  }

  addExpense(expense: Omit<Expense, 'id'>): Expense {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString()
    }
    this.expenses.set(newExpense.id, newExpense)
    return newExpense
  }

  getExpensesForGroup(groupId: string): Expense[] {
    return Array.from(this.expenses.values()).filter(expense => 
      expense.groupId === groupId
    )
  }

  calculateBalances(groupId: string): Map<string, Map<string, number>> {
    const expenses = this.getExpensesForGroup(groupId)
    const balances = new Map<string, Map<string, number>>()

    expenses.forEach(expense => {
      const perPersonAmount = expense.amount / expense.splitBetween.length

      expense.splitBetween.forEach(person => {
        if (person !== expense.paidBy) {
          if (!balances.has(person)) {
            balances.set(person, new Map())
          }
          const personBalances = balances.get(person)!
          const currentOwed = personBalances.get(expense.paidBy) || 0
          personBalances.set(expense.paidBy, currentOwed + perPersonAmount)
        }
      })
    })

    return balances
  }
}

export const store = new Store()
export type { User, Group, Expense }