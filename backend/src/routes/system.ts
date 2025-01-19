import express from 'express'
import { systemMonitor } from '../monitors/system'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

router.get('/metrics', authenticateToken, async (req, res) => {
  try {
    const metrics = await systemMonitor.getMetrics()
    res.json(metrics)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get system metrics' })
  }
})

router.post('/shutdown', authenticateToken, async (req, res) => {
  try {
    // システムシャットダウンの実装
    // 注意: 適切な権限チェックが必要
    res.json({ message: 'System shutdown initiated' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to shutdown system' })
  }
})

router.post('/restart', authenticateToken, async (req, res) => {
  try {
    // システム再起動の実装
    res.json({ message: 'System restart initiated' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to restart system' })
  }
})

export const systemRouter = router

