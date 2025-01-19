import Docker from 'dockerode'

export class DockerMonitor {
  private docker: Docker

  constructor() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' })
  }

  async getContainers() {
    const containers = await this.docker.listContainers({ all: true })
    return containers.map(container => ({
      id: container.Id,
      name: container.Names[0].replace(/^\//, ''),
      image: container.Image,
      state: container.State,
      status: container.Status
    }))
  }

  async getContainerStats(containerId: string) {
    const container = this.docker.getContainer(containerId)
    const stats = await container.stats({ stream: false })
    return stats
  }

  async startContainer(containerId: string) {
    const container = this.docker.getContainer(containerId)
    await container.start()
  }

  async stopContainer(containerId: string) {
    const container = this.docker.getContainer(containerId)
    await container.stop()
  }

  async restartContainer(containerId: string) {
    const container = this.docker.getContainer(containerId)
    await container.restart()
  }
}

export const dockerMonitor = new DockerMonitor()

