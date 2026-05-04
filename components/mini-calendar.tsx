'use client'

import { Badge } from '@/components/ui/badge'

type Event = {
  id: string
  title: string
  date: string
  status: string
}

export function MiniCalendar({ events }: { events: Event[] }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const eventsByDate: Record<number, Event[]> = {}
  events.forEach((e) => {
    const day = new Date(e.date).getDate()
    if (!eventsByDate[day]) eventsByDate[day] = []
    eventsByDate[day].push(e)
  })

  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  )

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {days.map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => (
          <div
            key={i}
            className={`
              relative flex flex-col items-center py-1 rounded-md text-xs
              ${day === today.getDate() ? 'bg-primary text-primary-foreground font-bold' : ''}
              ${!day ? 'opacity-0 pointer-events-none' : ''}
            `}
          >
            {day && <span>{day}</span>}
            {day && eventsByDate[day] && (
              <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                {eventsByDate[day].slice(0, 2).map((_, idx) => (
                  <div key={idx} className="w-1 h-1 rounded-full bg-blue-500" />
                ))}
                {eventsByDate[day].length > 2 && (
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend events bulan ini */}
      {events.length > 0 && (
        <div className="mt-4 space-y-1 border-t pt-3">
          {events.slice(0, 4).map((e) => (
            <div key={e.id} className="flex items-center gap-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              <span className="truncate text-muted-foreground">
                {new Date(e.date).getDate()} —{' '}
              </span>
              <span className="truncate">{e.title}</span>
            </div>
          ))}
          {events.length > 4 && (
            <p className="text-xs text-muted-foreground">+{events.length - 4} event lainnya</p>
          )}
        </div>
      )}
    </div>
  )
}