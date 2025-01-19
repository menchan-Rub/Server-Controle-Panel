import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class ServiceMonitor {
  async getServices() {
    try {
      const { stdout } = await execAsync('systemctl list-units --type=service --no-pager')
      return this.parseServiceOutput(stdout)
    } catch (error) {
      console.error('Error getting services:', error)
      throw error
    }
  }

  async restartService(name: string) {
    try {
      await execAsync(`systemctl restart ${name}`)
    } catch (error) {
      console.error(`Error restarting service ${name}:`, error)
      throw error
    }
  }

  private parseServiceOutput(output: string) {
    const lines = output.split('\n')
    const services = lines
      .filter(line => line.includes('.service'))
      .map(line => {
        const [unit, load, active, sub, description] = line.split(/\s+/)
        return {
          name: unit.replace('.service', ''),
          status: active === 'active' ? 'running' : 'stopped',
          description
        }
      })

    return services
  }
}

export const serviceMonitor = new ServiceMonitor()

