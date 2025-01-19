const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function fetchSystemMetrics() {
  const response = await fetch(`${API_BASE_URL}/api/system/metrics`)
  if (!response.ok) throw new Error('Failed to fetch system metrics')
  return response.json()
}

export async function fetchProcesses() {
  const response = await fetch(`${API_BASE_URL}/api/process/list`)
  if (!response.ok) throw new Error('Failed to fetch processes')
  return response.json()
}

export async function killProcess(pid: string) {
  const response = await fetch(`${API_BASE_URL}/api/process/kill/${pid}`, {
    method: 'POST'
  })
  if (!response.ok) throw new Error('Failed to kill process')
  return response.json()
}

export async function fetchServices() {
  const response = await fetch(`${API_BASE_URL}/api/services`)
  if (!response.ok) throw new Error('Failed to fetch services')
  return response.json()
}

export async function restartService(name: string) {
  const response = await fetch(`${API_BASE_URL}/api/services/${name}/restart`, {
    method: 'POST'
  })
  if (!response.ok) throw new Error('Failed to restart service')
  return response.json()
}

