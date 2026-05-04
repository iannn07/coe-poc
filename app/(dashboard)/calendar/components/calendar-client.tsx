'use client'

import { useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { MapPin, Clock, Users, CalendarDays } from 'lucide-react'

type Event = {
  id: string
  title: string
  date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  notes: string | null
  status: string
  event_bod: { bod: { name: string } | null }[]
}

type Holiday = {
  id: string
  name: string
  date: string
}

type Props = {
  events: Event[]
  holidays: Holiday[]
}

export function CalendarClient({ events, holidays }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Convert events ke FullCalendar format
  const calendarEvents = [
    // Events
    ...events.map((e) => ({
      id: e.id,
      title: e.title,
      start: e.start_time ? `${e.date}T${e.start_time}` : e.date,
      end: e.end_time ? `${e.date}T${e.end_time}` : undefined,
      backgroundColor: e.status === 'approved' ? '#3b82f6' : '#94a3b8',
      borderColor: e.status === 'approved' ? '#2563eb' : '#64748b',
      textColor: '#ffffff',
      extendedProps: { type: 'event', data: e },
    })),

    // Hari libur nasional
    ...holidays.map((h) => ({
      id: h.id,
      title: h.name,
      start: h.date,
      allDay: true,
      backgroundColor: '#ef4444',
      borderColor: '#dc2626',
      textColor: '#ffffff',
      extendedProps: { type: 'holiday' },
    })),
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleEventClick(info: any) {
    const { type, data } = info.event.extendedProps
    if (type === 'event') {
      setSelectedEvent(data)
    }
  }

  return (
    <>
      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-500" />
          <span className="text-sm text-muted-foreground">Event (Approved)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-slate-400" />
          <span className="text-sm text-muted-foreground">Event (Need Review)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          <span className="text-sm text-muted-foreground">Hari Libur Nasional</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek',
            }}
            events={calendarEvents}
            eventClick={handleEventClick}
            height="auto"
            locale="id"
            buttonText={{
              today: 'Hari Ini',
              month: 'Bulan',
              week: 'Minggu',
            }}
          />
        </CardContent>
      </Card>

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(v) => !v && setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={selectedEvent.status === 'approved' ? 'default' : 'secondary'}>
                  {selectedEvent.status === 'approved' ? 'Approved' : 'Need Review'}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="w-4 h-4 shrink-0" />
                  <span>
                    {new Date(selectedEvent.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {selectedEvent.start_time && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>
                      {selectedEvent.start_time}
                      {selectedEvent.end_time && ` — ${selectedEvent.end_time}`}
                    </span>
                  </div>
                )}

                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}

                {selectedEvent.event_bod.length > 0 && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      {selectedEvent.event_bod.map((b) => b.bod?.name).join(', ')}
                    </span>
                  </div>
                )}

                {selectedEvent.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-muted-foreground">{selectedEvent.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}