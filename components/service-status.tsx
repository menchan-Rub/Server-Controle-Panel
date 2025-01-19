import { Check, XCircle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Service {
  name: string
  status: "running" | "stopped"
  uptime: string
}

interface ServiceStatusProps {
  services: Service[]
  className?: string
}

export function ServiceStatus({ services, className }: ServiceStatusProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>サービスステータス</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {service.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  稼働時間: {service.uptime}
                </p>
              </div>
              <div className={cn(
                "flex items-center",
                service.status === "running" ? "text-green-500" : "text-red-500"
              )}>
                {service.status === "running" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

