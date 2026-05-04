import { getEvents, getBods } from './actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { EventPageClient } from './components/event-page-client'

export default async function EventsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  const [{ data: events }, bods] = await Promise.all([
    getEvents(),
    getBods(),
  ])

  return (
    <EventPageClient
      initialEvents={events}
      bods={bods}
      userRole={profile?.role ?? 'view_only'}
    />
  )
}