import { exec } from 'child_process'
import { promisify } from 'util'
import os from 'os'
import fs from 'fs'

const execAsync = promisify(exec)

export class SystemMonitor {
  async getMetrics() {
    const [cpu, memory, disk, load] = await Promise.all([
      this.getCPUUsage(),
      this.getMemoryUsage(),
      this.getDiskUsage(),
      this.getLoadAverage()
    ])

    return {
      cpu,
      memory,
      disk,
      load,
      uptime: os.uptime()
    }
  }

  private async getCPUUsage() {
    const { stdout } = await execAsync("top -bn1 | grep 'Cpu(s)' | awk '{print $2}'")
    return parseFloat(stdout)
  }

  private async getMemoryUsage() {
    const total = os.totalmem()
    const free = os.freemem()
    const used = total - free
    return {
      total,
      used,
      free,
      percentage: (used / total) * 100
    }
  }

  private async getDiskUsage() {
    const { stdout } = await execAsync("df -h / | tail -1 | awk '{print $5}'")
    return parseInt(stdout)
  }

  private getLoadAverage() {
    return os.loadavg()
  }
}

export const systemMonitor = new SystemMonitor()

