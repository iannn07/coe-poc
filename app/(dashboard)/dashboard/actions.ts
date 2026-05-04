import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getDashboardData() {
  const supabase = await createSupabaseServerClient()

  const [
    { count: totalEvents },
    { data: conflictEvents },
    { data: recentActivity },
    { data: currentMonthEvents },
  ] = await Promise.all([
    // Total semua event
    supabase.from('events').select('*', { count: 'exact', head: true }),

    // Total event bentrok
    supabase.from('event_conflicts').select('id'),

    // Aktivitas terbaru (5 terakhir)
    supabase
      .from('events')
      .select('id, title, status, updated_at, created_by, profiles(full_name)')
      .order('updated_at', { ascending: false })
      .limit(5),

    // Event bulan berjalan
    supabase
      .from('events')
      .select('id, title, date, start_time, end_time, status')
      .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
      .lte('date', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0])
      .order('date', { ascending: true }),
  ])

  // Total event per BOD
  const { data: eventPerBod } = await supabase
    .from('event_bod')
    .select('bod_id, bod(name)')

  const bodCount: Record<string, { name: string; count: number }> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventPerBod?.forEach((e: any) => {
    const id = e.bod_id
    if (!bodCount[id]) bodCount[id] = { name: e.bod?.name ?? '-', count: 0 }
    bodCount[id].count++
  })

  return {
    totalEvents: totalEvents ?? 0,
    totalConflicts: conflictEvents?.length ?? 0,
    recentActivity: recentActivity ?? [],
    currentMonthEvents: currentMonthEvents ?? [],
    eventPerBod: Object.values(bodCount),
  }
}