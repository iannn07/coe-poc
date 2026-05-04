'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createSupabaseClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Button variant="outline" onClick={handleLogout} className="w-full">
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  )
}