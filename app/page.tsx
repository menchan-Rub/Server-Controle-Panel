"use client"

import { Activity, Cpu, Database, HardDrive, Network } from 'lucide-react'
import { useSystemMetrics } from "@/hooks/useSystemMetrics"
import { ResourceCard } from "@/components/resource-card"
import { ServiceStatus } from "@/components/service-status"
import { ProcessList } from "@/components/process-list"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const mockServices = [
  { name: "Nginx Webサーバー", status: "running", uptime: "10日 2時間" },
  { name: "PostgreSQLデータベース", status: "running", uptime: "15日 6時間" },
  { name: "Redisキャッシュ", status: "running", uptime: "5日 12時間" },
  { name: "バックアップサービス", status: "stopped", uptime: "0" },
] as const

export default function DashboardPage() {
  const { cpu, memory, disk, network } = useSystemMetrics()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">サーバー管理パネル</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ResourceCard
              title="CPU使用率"
              value={Math.round(cpu)}
              unit="%"
              icon={<Cpu className="h-4 w-4 text-muted-foreground" />}
            />
            <ResourceCard
              title="メモリ使用率"
              value={Math.round(memory)}
              unit="%"
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            />
            <ResourceCard
              title="ディスク使用率"
              value={Math.round(disk)}
              unit="%"
              icon={<HardDrive className="h-4 w-4 text-muted-foreground" />}
            />
            <ResourceCard
              title="ネットワーク"
              value={Math.round(network)}
              unit="Mbps"
              icon={<Network className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <ServiceStatus
              services={mockServices}
              className="col-span-4"
            />
            <ProcessList
              className="col-span-3"
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

