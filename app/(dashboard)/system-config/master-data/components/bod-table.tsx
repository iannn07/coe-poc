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
import { createBod, deleteBod } from '../actions'

type Bod = { id: string; name: string; title: string | null }

export function BodTable({ initialBods }: { initialBods: Bod[] }) {
  const [bods, setBods] = useState(initialBods)
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function handleCreate() {
    if (!name) return
    setLoading(true)
    const { error } = await createBod(name, title)
    if (!error) {
      setBods([...bods, { id: crypto.randomUUID(), name, title }])
      setName('')
      setTitle('')
    }
    setLoading(false)
  }

  async function handleDelete() {
    if (!deleteId) return
    await deleteBod(deleteId)
    setBods(bods.filter((b) => b.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nama BOD"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-[200px]"
          />
          <Input
            placeholder="Jabatan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="max-w-[200px]"
          />
          <Button onClick={handleCreate} disabled={loading || !name}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {bods.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Belum ada data BOD
                </TableCell>
              </TableRow>
            )}
            {bods.map((bod) => (
              <TableRow key={bod.id}>
                <TableCell className="font-medium">{bod.name}</TableCell>
                <TableCell className="text-muted-foreground">{bod.title ?? '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(bod.id)}
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
            <AlertDialogTitle>Hapus BOD?</AlertDialogTitle>
            <AlertDialogDescription>
              Data BOD ini akan dihapus permanen dari sistem.
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