import express from 'express'
import { exec } from 'child_process'
import { promisify } from 'util'
import { authenticateToken } from '../middleware/auth'

const execAsync = promisify(exec)
const router = express.Router()

router.get('/firewall/rules', authenticateToken, async (req, res) => {
  try {
    const { stdout } = await execAsync('iptables -L -n')
    res.json({ rules: stdout })
  } catch (error) {
    res.status(500).json({ error: 'Failed to get firewall rules' })
  }
})

router.post('/firewall/rule', authenticateToken, async (req, res) => {
  try {
    const { rule } = req.body
    await execAsync(`iptables ${rule}`)
    res.json({ message: 'Firewall rule added successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add firewall rule' })
  }
})

router.post('/ssl/generate', authenticateToken, async (req, res) => {
  try {
    const { domain } = req.body
    // Let's Encrypt証明書の発行
    await execAsync(`certbot certonly --standalone -d ${domain}`)
    res.json({ message: 'SSL certificate generated successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate SSL certificate' })
  }
})

router.get('/ssl/certificates', authenticateToken, async (req, res) => {
  try {
    const { stdout } = await execAsync('certbot certificates')
    res.json({ certificates: stdout })
  } catch (error) {
    res.status(500).json({ error: 'Failed to list SSL certificates' })
  }
})

export const securityRouter = router

