'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Trash2 } from 'lucide-react'
import { createHoliday, deleteHoliday } from '../actions'

type Holiday = { id: string; name: string; date: string }

export function HolidayTable({ initialHolidays }: { initialHolidays: Holiday[] }) {
  const [holidays, setHolidays] = useState(initialHolidays)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function handleCreate() {
    if (!name || !date) return
    setLoading(true)
    const { error } = await createHoliday(name, date)
    if (!error) {
      setHolidays([...holidays, { id: crypto.randomUUID(), name, date }])
      setName('')
      setDate('')
    }
    setLoading(false)
  }

  async function handleDelete() {
    if (!deleteId) return
    await deleteHoliday(deleteId)
    setHolidays(holidays.filter((h) => h.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nama hari libur"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-[200px]"
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="max-w-[180px]"
          />
          <Button onClick={handleCreate} disabled={loading || !name || !date}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {holidays.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Belum ada data hari libur
                </TableCell>
              </TableRow>
            )}
            {holidays.map((h) => (
              <TableRow key={h.id}>
                <TableCell className="font-medium">{h.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(h.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(h.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus hari libur?</AlertDialogTitle>
            <AlertDialogDescription>
              Data hari libur ini akan dihapus permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}