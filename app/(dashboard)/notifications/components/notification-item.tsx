'use client'

import { Badge } from '@/components/ui/badge'
import { Bell, CalendarDays } from 'lucide-react'
import { markAsRead } from '../actions'

type Props = {
  notification: {
    id: string
    message: string
    is_read: boolean
    created_at: string
    events: { title: string; date: string } | null
    sender?: { full_name: string; email: string } | null
    receiver?: { full_name: string; email: string } | null
  }
  type: 'sent' | 'received'
}

export function NotificationItem({ notification, type }: Props) {
  async function handleRead() {
    if (!notification.is_read && type === 'received') {
      await markAsRead(notification.id)
    }
  }

  return (
    <div
      onClick={handleRead}
      className={`
        border rounded-lg p-4 transition-colors
        ${!notification.is_read && type === 'received'
          ? 'bg-muted/60 border-primary/30 cursor-pointer hover:bg-muted'
          : 'hover:bg-muted/30'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5
          ${!notification.is_read && type === 'received' ? 'bg-primary/10' : 'bg-muted'}
        `}>
          <Bell className="w-4 h-4 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {type === 'received' && notification.sender && (
              <span className="text-sm font-medium">{notification.sender.full_name}</span>
            )}
            {type === 'sent' && notification.receiver && (
              <span className="text-sm font-medium">Ke: {notification.receiver.full_name}</span>
            )}
            {!notification.is_read && type === 'received' && (
              <Badge variant="default" className="text-xs px-1.5 py-0">Baru</Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>

          {notification.events && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{notification.events.title}</span>
              <span>·</span>
              <span>
                {new Date(notification.events.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-2">
            {new Date(notification.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  )
}