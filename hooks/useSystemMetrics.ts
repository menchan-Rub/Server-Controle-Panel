"use client"

import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { fetchSystemMetrics } from '@/lib/api'

export function useSystemMetrics() {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0
  })

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')

    // 初期データの取得
    fetchSystemMetrics().then(setMetrics)

    // リアルタイム更新
    socket.on('system-metrics', (newMetrics) => {
      setMetrics(newMetrics)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return metrics
}

