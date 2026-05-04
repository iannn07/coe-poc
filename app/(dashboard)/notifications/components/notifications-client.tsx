'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NotificationItem } from './notification-item'
import { Badge } from '@/components/ui/badge'

type Notification = {
  id: string
  message: string
  is_read: boolean
  created_at: string
  events: { title: string; date: string } | null
  sender?: { full_name: string; email: string } | null
  receiver?: { full_name: string; email: string } | null
}

type Props = {
  sent: Notification[]
  received: Notification[]
}

export function NotificationsClient({ sent, received }: Props) {
  const unreadCount = received.filter((n) => !n.is_read).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-muted-foreground mt-1">Pusat informasi dan komunikasi</p>
      </div>

      <Tabs defaultValue="received">
        <TabsList>
          <TabsTrigger value="received" className="flex items-center gap-2">
            Receive
            {unreadCount > 0 && (
              <Badge variant="default" className="text-xs px-1.5 py-0 h-5">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-4 space-y-3">
          {received.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">
              Tidak ada notifikasi masuk
            </p>
          )}
          {received.map((n) => (
            <NotificationItem key={n.id} notification={n} type="received" />
          ))}
        </TabsContent>

        <TabsContent value="sent" className="mt-4 space-y-3">
          {sent.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">
              Belum ada notifikasi terkirim
            </p>
          )}
          {sent.map((n) => (
            <NotificationItem key={n.id} notification={n} type="sent" />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}