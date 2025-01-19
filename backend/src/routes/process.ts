import express from 'express'
import { exec } from 'child_process'
import { promisify } from 'util'
import { authenticateToken } from '../middleware/auth'

const execAsync = promisify(exec)
const router = express.Router()

router.get('/list', authenticateToken, async (req, res) => {
  try {
    const { stdout } = await execAsync('ps aux')
    const processes = stdout.split('\n')
      .slice(1)
      .filter(Boolean)
      .map(process => {
        const [user, pid, cpu, mem, vsz, rss, tty, stat, start, time, command] = 
          process.split(/\s+/).filter(Boolean)
        return { user, pid, cpu, mem, vsz, rss, tty, stat, start, time, command }
      })
    res.json(processes)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get process list' })
  }
})

router.post('/kill/:pid', authenticateToken, async (req, res) => {
  try {
    const { pid } = req.params
    await execAsync(`kill ${pid}`)
    res.json({ message: `Process ${pid} killed` })
  } catch (error) {
    res.status(500).json({ error: 'Failed to kill process' })
  }
})

router.post('/nice/:pid', authenticateToken, async (req, res) => {
  try {
    const { pid } = req.params
    const { nice } = req.body
    await execAsync(`renice ${nice} ${pid}`)
    res.json({ message: `Process ${pid} nice value changed to ${nice}` })
  } catch (error) {
    res.status(500).json({ error: 'Failed to change process priority' })
  }
})

export const processRouter = router

