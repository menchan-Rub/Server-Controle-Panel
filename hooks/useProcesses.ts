"use client"

import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { fetchProcesses, killProcess } from '@/lib/api'

export function useProcesses() {
  const [processes, setProcesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')

    const loadProcesses = async () => {
      try {
        const data = await fetchProcesses()
        setProcesses(data)
        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    }

    loadProcesses()

    socket.on('process-update', (newProcesses) => {
      setProcesses(newProcesses)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleKillProcess = async (pid: string) => {
    try {
      await killProcess(pid)
      const updatedProcesses = await fetchProcesses()
      setProcesses(updatedProcesses)
    } catch (err) {
      setError(err as Error)
    }
  }

  return { processes, loading, error, killProcess: handleKillProcess }
}

