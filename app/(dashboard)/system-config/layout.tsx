import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SystemConfigNav } from './components/system-config-nav'

export default async function SystemConfigLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'super_admin') redirect('/dashboard')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">System Configuration</h1>
        <p className="text-muted-foreground mt-1">Kelola konfigurasi sistem</p>
      </div>
      <SystemConfigNav />
      {children}
    </div>
  )
}