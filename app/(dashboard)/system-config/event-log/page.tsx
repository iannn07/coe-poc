import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function EventLogPage() {
  const supabase = await createSupabaseServerClient()
  const { data: logs } = await supabase
    .from('event_logs')
    .select(`
      *,
      events(title),
      profiles:changed_by(full_name, email)
    `)
    .order('changed_at', { ascending: false })
    .limit(100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Event Log</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Diubah oleh</TableHead>
              <TableHead>Field</TableHead>
              <TableHead>Nilai Lama</TableHead>
              <TableHead>Nilai Baru</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(logs ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Belum ada log perubahan event
                </TableCell>
              </TableRow>
            )}
            {/* eslint-disable @typescript-eslint/no-explicit-any */
            (logs ?? []).map((log: any) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(log.changed_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {log.events?.title ?? '-'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {log.profiles?.full_name ?? log.profiles?.email ?? '-'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {log.field_changed ?? '-'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[120px] truncate">
                  {log.old_value ?? '-'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[120px] truncate">
                  {log.new_value ?? '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}