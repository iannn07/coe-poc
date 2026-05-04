'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getCalendarData() {
  const supabase = await createSupabaseServerClient()

  const [
    { data: events },
    { data: holidays },
  ] = await Promise.all([
    supabase
      .from('events')
      .select(`
        *,
        event_bod(bod(name))
      `)
      .order('date', { ascending: true }),

    supabase
      .from('national_holidays')
      .select('*'),
  ])

  return {
    events: events ?? [],
    holidays: holidays ?? [],
  }
}