'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MapPin, Clock, Users, Pencil } from 'lucide-react'
import { EventForm } from './event-form'

type Bod = { id: string; name: string; title: string | null }

type Event = {
  id: string
  title: string
  date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  notes: string | null
  status: string
  profiles: { full_name: string } | null
  event_bod: { bod_id: string; bod: { name: string } | null }[]
}

type Props = {
  events: Event[]
  bods: Bod[]
  userRole: string
  onRefresh: () => void
}

export function EventList({ events, bods, userRole, onRefresh }: Props) {
  const [editEvent, setEditEvent] = useState<Event | null>(null)

  const canEdit = userRole === 'cms' || userRole === 'super_admin'

  // Group by date
  const grouped: Record<string, Event[]> = {}
  events.forEach((e) => {
    if (!grouped[e.date]) grouped[e.date] = []
    grouped[e.date].push(e)
  })

  return (
    <>
      <div className="space-y-6">
        {Object.keys(grouped).length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-12">
            Tidak ada event pada bulan ini
          </p>
        )}
        {Object.entries(grouped).map(([date, dayEvents]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-sm font-medium text-muted-foreground">
                {new Date(date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-2">
              {dayEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge variant={event.status === 'approved' ? 'default' : 'secondary'}>
                          {event.status === 'approved' ? 'Approved' : 'Need Review'}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        {event.start_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {event.start_time}
                            {event.end_time && ` — ${event.end_time}`}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {event.location}
                          </span>
                        )}
                        {event.event_bod.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {event.event_bod.map((b) => b.bod?.name).join(', ')}
                          </span>
                        )}
                      </div>

                      {event.notes && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{event.notes}</p>
                      )}
                    </div>

                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => setEditEvent(event)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editEvent} onOpenChange={(v) => !v && setEditEvent(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {editEvent && (
            <EventForm
              bods={bods}
              event={editEvent}
              onSuccess={() => { setEditEvent(null); onRefresh() }}
              onCancel={() => setEditEvent(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}