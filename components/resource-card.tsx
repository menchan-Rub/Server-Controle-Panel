import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ResourceCardProps {
  title: string
  value: number
  unit: string
  icon: React.ReactNode
}

export function ResourceCard({ title, value, unit, icon }: ResourceCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}{unit}</div>
        <Progress value={value} className="mt-2" />
      </CardContent>
    </Card>
  )
}

