'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

export default function VisitorCounter({ showDetails = false }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    // Generate or retrieve session ID
    let sid = sessionStorage.getItem('visitorSessionId')
    if (!sid) {
      sid = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('visitorSessionId', sid)
    }
    setSessionId(sid)
  }, [])

  useEffect(() => {
    if (!sessionId) return

    async function recordVisit() {
      try {
        // Check if already recorded in this browser session
        const hasRecorded = sessionStorage.getItem('visitRecorded')
        
        if (!hasRecorded) {
          // Record the visit
          const response = await fetch('/api/visitor-stats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId }),
          })
          
          if (response.ok) {
            const data = await response.json()
            setStats(data)
            sessionStorage.setItem('visitRecorded', 'true')
          }
        } else {
          // Just get stats without recording
          const response = await fetch('/api/visitor-stats')
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error with visitor stats:', error)
      } finally {
        setLoading(false)
      }
    }

    recordVisit()
  }, [sessionId])

  if (loading || !stats) {
    return null
  }

  if (showDetails) {
    return (
      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>Total Pengunjung: <strong className="text-foreground">{stats.totalVisits.toLocaleString()}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>Hari Ini: <strong className="text-foreground">{stats.todayVisits.toLocaleString()}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>Unique Visitors: <strong className="text-foreground">{stats.uniqueVisitors.toLocaleString()}</strong></span>
        </div>
      </div>
    )
  }

  // Simple counter view
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      <span>
        Pengunjung: <strong className="text-foreground">{stats.totalVisits.toLocaleString()}</strong>
      </span>
    </div>
  )
}