import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class ProcessMonitor {
  async getProcesses() {
    try {
      const { stdout } = await execAsync('ps aux')
      return this.parseProcessOutput(stdout)
    } catch (error) {
      console.error('Error getting processes:', error)
      throw error
    }
  }

  async killProcess(pid: string) {
    try {
      await execAsync(`kill ${pid}`)
    } catch (error) {
      console.error(`Error killing process ${pid}:`, error)
      throw error
    }
  }

  private parseProcessOutput(output: string) {
    const lines = output.split('\n')
    // ヘッダー行をスキップ
    const processes = lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const [
          user, pid, cpu, memory, vsz, rss, tty, stat, start, time, ...command
        ] = line.split(/\s+/)
        
        return {
          user,
          pid,
          cpu: parseFloat(cpu).toFixed(1),
          memory: parseFloat(memory).toFixed(1),
          status: stat,
          name: command.join(' ')
        }
      })

    return processes
  }
}

export const processMonitor = new ProcessMonitor()

