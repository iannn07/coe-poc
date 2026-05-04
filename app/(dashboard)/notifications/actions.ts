'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { sent: [], received: [] }

  const [{ data: sent }, { data: received }] = await Promise.all([
    supabase
      .from('notifications')
      .select(`
        *,
        receiver:profiles!notifications_receiver_id_fkey(full_name, email),
        events(title, date)
      `)
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false }),

    supabase
      .from('notifications')
      .select(`
        *,
        sender:profiles!notifications_sender_id_fkey(full_name, email),
        events(title, date)
      `)
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  return { sent: sent ?? [], received: received ?? [] }
}

export async function markAsRead(notificationId: string) {
  const supabase = await createSupabaseServerClient()

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)

  revalidatePath('/notifications')
}