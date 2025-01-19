"use client"

import { useState } from "react"
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useProcesses } from "@/hooks/useProcesses"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProcessListProps {
  className?: string
}

export function ProcessList({ className }: ProcessListProps) {
  const { processes, loading, error, killProcess } = useProcesses()
  const [selectedPid, setSelectedPid] = useState<string | null>(null)

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>プロセス一覧</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>プロセス一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              プロセス情報の取得に失敗しました: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>プロセス一覧</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PID</TableHead>
              <TableHead>名前</TableHead>
              <TableHead>CPU %</TableHead>
              <TableHead>メモリ %</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((process: any) => (
              <TableRow key={process.pid}>
                <TableCell>{process.pid}</TableCell>
                <TableCell>{process.name}</TableCell>
                <TableCell>{process.cpu}</TableCell>
                <TableCell>{process.memory}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={selectedPid === process.pid}
                    onClick={async () => {
                      setSelectedPid(process.pid)
                      try {
                        await killProcess(process.pid)
                      } finally {
                        setSelectedPid(null)
                      }
                    }}
                  >
                    {selectedPid === process.pid ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "終了"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

