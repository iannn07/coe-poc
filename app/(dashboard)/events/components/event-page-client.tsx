'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { EventList } from './event-list'
import { EventForm } from './event-form'
import { getEvents } from '../actions'

type Bod = { id: string; name: string; title: string | null }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Event = any

type Props = {
  initialEvents: Event[]
  bods: Bod[]
  userRole: string
}

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

export function EventPageClient({ initialEvents, bods, userRole }: Props) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [showNew, setShowNew] = useState(false)

  async function refresh(m = month, y = year) {
    const { data } = await getEvents(m, y)
    setEvents(data)
  }

  function prevMonth() {
    const m = month === 0 ? 11 : month - 1
    const y = month === 0 ? year - 1 : year
    setMonth(m); setYear(y); refresh(m, y)
  }

  function nextMonth() {
    const m = month === 11 ? 0 : month + 1
    const y = month === 11 ? year + 1 : year
    setMonth(m); setYear(y); refresh(m, y)
  }

  const canCreate = ['super_admin', 'cms', 'cf', 'sbu'].includes(userRole)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Event Management</h1>
          <p className="text-muted-foreground mt-1">Kelola jadwal dan agenda</p>
        </div>
        {canCreate && (
          <Button onClick={() => setShowNew(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        )}
      </div>

      {/* Month Navigator */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-medium min-w-[160px] text-center">
          {MONTHS[month]} {year}
        </span>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <EventList
        events={events}
        bods={bods}
        userRole={userRole}
        onRefresh={() => refresh()}
      />

      {/* New Event Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Event</DialogTitle>
          </DialogHeader>
          <EventForm
            bods={bods}
            onSuccess={() => { setShowNew(false); refresh() }}
            onCancel={() => setShowNew(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}