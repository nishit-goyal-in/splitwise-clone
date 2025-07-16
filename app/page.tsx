'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [name, setName] = useState('')
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(prev => {
        const newSparkle = {
          id: Date.now(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight
        }
        return [...prev.slice(-4), newSparkle]
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber || !name) return

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, name }),
    })

    if (response.ok) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{ left: sparkle.x, top: sparkle.y }}
        />
      ))}
      
      <div className="w-full max-w-md relative z-10">
        <div className="neo-card-lg p-8">
          <h1 className="text-4xl md:text-5xl font-black text-center mb-2 uppercase">Splitwise</h1>
          <p className="text-center text-lg mb-8 font-medium">Split expenses with friends</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold uppercase mb-2">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-bold uppercase mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            
            <button type="submit" className="neo-btn w-full wiggle">
              Get Started →
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}