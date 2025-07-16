'use client'

import { useEffect, useState } from 'react'

export default function Sparkles() {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])

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
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{ left: sparkle.x, top: sparkle.y }}
        />
      ))}
    </>
  )
}