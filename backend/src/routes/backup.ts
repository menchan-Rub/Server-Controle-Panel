import express from 'express'
import { exec } from 'child_process'
import { promisify } from 'util'
import { authenticateToken } from '../middleware/auth'
import { PrismaClient } from '@prisma/client'

const execAsync = promisify(exec)
const prisma = new PrismaClient()
const router = express.Router()

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name, type } = req.body
    const timestamp = new Date().toISOString()
    const backupPath = `/backups/${name}-${timestamp}.tar.gz`

    // バックアップの作成
    await execAsync(`tar -czf ${backupPath} /data`)

    // データベースに記録
    await prisma.backup.create({
      data: {
        name,
        path: backupPath,
        type,
        createdAt: new Date()
      }
    })

    res.json({ message: 'Backup created successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create backup' })
  }
})

router.get('/list', authenticateToken, async (req, res) => {
  try {
    const backups = await prisma.backup.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(backups)
  } catch (error) {
    res.status(500).json({ error: 'Failed to list backups' })
  }
})

router.post('/restore/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const backup = await prisma.backup.findUnique({ where: { id: parseInt(id) } })

    if (!backup) {
      return res.status(404).json({ error: 'Backup not found' })
    }

    // バックアップからの復元
    await execAsync(`tar -xzf ${backup.path} -C /`)

    res.json({ message: 'Backup restored successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore backup' })
  }
})

export const backupRouter = router

