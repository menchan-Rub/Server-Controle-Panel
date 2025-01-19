import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { systemMonitor } from './monitors/system'
import { processMonitor } from './monitors/process'
import { serviceMonitor } from './monitors/service'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

app.use(cors())
app.use(express.json())

// システムメトリクスAPI
app.get('/api/system/metrics', async (req, res) => {
  try {
    const metrics = await systemMonitor.getMetrics()
    res.json(metrics)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get system metrics' })
  }
})

// プロセス管理API
app.get('/api/process/list', async (req, res) => {
  try {
    const processes = await processMonitor.getProcesses()
    res.json(processes)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get process list' })
  }
})

app.post('/api/process/kill/:pid', async (req, res) => {
  try {
    const { pid } = req.params
    await processMonitor.killProcess(pid)
    res.json({ message: 'Process killed successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to kill process' })
  }
})

// サービス管理API
app.get('/api/services', async (req, res) => {
  try {
    const services = await serviceMonitor.getServices()
    res.json(services)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get services' })
  }
})

app.post('/api/services/:name/restart', async (req, res) => {
  try {
    const { name } = req.params
    await serviceMonitor.restartService(name)
    res.json({ message: 'Service restarted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to restart service' })
  }
})

// WebSocketによるリアルタイムモニタリング
io.on('connection', (socket) => {
  console.log('Client connected')

  // システムメトリクスの定期送信
  const metricsInterval = setInterval(async () => {
    const metrics = await systemMonitor.getMetrics()
    socket.emit('system-metrics', metrics)
  }, 1000)

  // プロセス情報の定期送信
  const processInterval = setInterval(async () => {
    const processes = await processMonitor.getProcesses()
    socket.emit('process-update', processes)
  }, 5000)

  socket.on('disconnect', () => {
    clearInterval(metricsInterval)
    clearInterval(processInterval)
    console.log('Client disconnected')
  })
})

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

