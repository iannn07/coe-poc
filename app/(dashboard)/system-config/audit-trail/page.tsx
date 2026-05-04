import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const actionColor: Record<string, 'default' | 'secondary' | 'destructive'> = {
  create: 'default',
  update: 'secondary',
  delete: 'destructive',
}

export default async function AuditTrailPage() {
  const supabase = await createSupabaseServerClient()
  const { data: logs } = await supabase
    .from('audit_trail')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Audit Trail</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Aksi</TableHead>
              <TableHead>Modul</TableHead>
              <TableHead>Keterangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(logs ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Belum ada log
                </TableCell>
              </TableRow>
            )}
            {/* eslint-disable @typescript-eslint/no-explicit-any */
            (logs ?? []).map((log: any) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(log.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell className="text-sm">
                  {/* eslint-disable @typescript-eslint/no-explicit-any */
                  (log.profiles as any)?.full_name ?? (log.profiles as any)?.email ?? '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={actionColor[log.action] ?? 'secondary'}>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{log.module}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {log.description ?? '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}