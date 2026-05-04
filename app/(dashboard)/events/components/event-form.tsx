'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ConflictDialog } from './conflict-dialog'
import { checkConflict, createEvent, updateEvent } from '../actions'

type Bod = { id: string; name: string; title: string | null }

type EventData = {
  id?: string
  title: string
  date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  notes: string | null
  event_bod?: { bod_id: string }[]
}

type Props = {
  bods: Bod[]
  event?: EventData
  onSuccess: () => void
  onCancel: () => void
}

export function EventForm({ bods, event, onSuccess, onCancel }: Props) {
  const isEdit = !!event?.id

  const [title, setTitle] = useState(event?.title ?? '')
  const [date, setDate] = useState(event?.date ?? '')
  const [startTime, setStartTime] = useState(event?.start_time ?? '')
  const [endTime, setEndTime] = useState(event?.end_time ?? '')
  const [location, setLocation] = useState(event?.location ?? '')
  const [notes, setNotes] = useState(event?.notes ?? '')
  const [selectedBods, setSelectedBods] = useState<string[]>(
    event?.event_bod?.map((b) => b.bod_id) ?? []
  )
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [conflicts, setConflicts] = useState<any[]>([])
  const [showConflict, setShowConflict] = useState(false)

  function toggleBod(id: string) {
    setSelectedBods((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    )
  }

  async function handleSubmit() {
    if (!title || !date) return

    setLoading(true)

    if (isEdit) {
      await updateEvent(event!.id!, { title, date, start_time: startTime, end_time: endTime, location, notes, bod_ids: selectedBods })
      onSuccess()
      setLoading(false)
      return
    }

    // Cek conflict dulu untuk new event
    const existingEvents = await checkConflict(date)
    if (existingEvents.length > 0) {
      setConflicts(existingEvents)
      setShowConflict(true)
      setLoading(false)
      return
    }

    await createEvent({ title, date, start_time: startTime, end_time: endTime, location, notes, bod_ids: selectedBods })
    onSuccess()
    setLoading(false)
  }

  async function handleForceSubmit() {
    setLoading(true)
    await createEvent({ title, date, start_time: startTime, end_time: endTime, location, notes, bod_ids: selectedBods, force: true })
    setShowConflict(false)
    onSuccess()
    setLoading(false)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Judul Event *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nama acara" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tanggal *</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Lokasi</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lokasi acara" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Waktu Mulai</Label>
            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Waktu Selesai</Label>
            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan tambahan..." rows={3} />
        </div>

        <div className="space-y-2">
          <Label>Invitation Attendance (BOD)</Label>
          <div className="grid grid-cols-2 gap-2 border rounded-lg p-3">
            {bods.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-2">Belum ada data BOD</p>
            )}
            {bods.map((bod) => (
              <div key={bod.id} className="flex items-center gap-2">
                <Checkbox
                  id={bod.id}
                  checked={selectedBods.includes(bod.id)}
                  onCheckedChange={() => toggleBod(bod.id)}
                />
                <label htmlFor={bod.id} className="text-sm cursor-pointer">
                  {bod.name}
                  {bod.title && <span className="text-muted-foreground"> · {bod.title}</span>}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>Batal</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Menyimpan...' : isEdit ? 'Save' : 'Submit'}
          </Button>
        </div>
      </div>

      <ConflictDialog
        open={showConflict}
        conflicts={conflicts}
        onCancel={() => { setShowConflict(false); setLoading(false) }}
        onForceSubmit={handleForceSubmit}
        loading={loading}
      />
    </>
  )
}