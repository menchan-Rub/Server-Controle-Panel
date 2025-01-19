import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class NetworkMonitor {
  async getStats() {
    const interfaces = await this.getInterfaces()
    const connections = await this.getConnections()
    const bandwidth = await this.getBandwidth()

    return {
      interfaces,
      connections,
      bandwidth
    }
  }

  private async getInterfaces() {
    const { stdout } = await execAsync("ip -j addr")
    return JSON.parse(stdout)
  }

  private async getConnections() {
    const { stdout } = await execAsync("ss -tuln")
    return stdout
  }

  private async getBandwidth() {
    const { stdout } = await execAsync("vnstat --json")
    return JSON.parse(stdout)
  }

  async getFirewallRules() {
    const { stdout } = await execAsync("iptables -L -n")
    return stdout
  }

  async addFirewallRule(rule: string) {
    await execAsync(`iptables ${rule}`)
  }
}

export const networkMonitor = new NetworkMonitor()

