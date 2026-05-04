'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

type ConflictEvent = {
  id: string
  title: string
  start_time: string | null
  end_time: string | null
}

type Props = {
  open: boolean
  conflicts: ConflictEvent[]
  onCancel: () => void
  onForceSubmit: () => void
  loading?: boolean
}

export function ConflictDialog({ open, conflicts, onCancel, onForceSubmit, loading }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Terdeteksi Bentrok Jadwal
          </DialogTitle>
          <DialogDescription>
            Tanggal yang dipilih sudah memiliki event terjadwal:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 my-2">
          {conflicts.map((c) => (
            <div key={c.id} className="border rounded-lg p-3 text-sm">
              <p className="font-medium">{c.title}</p>
              {c.start_time && (
                <p className="text-muted-foreground text-xs mt-1">
                  {c.start_time} {c.end_time ? `— ${c.end_time}` : ''}
                </p>
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onForceSubmit} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Tetap Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}