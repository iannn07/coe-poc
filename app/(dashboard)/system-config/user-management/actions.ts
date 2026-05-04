'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
  revalidatePath('/system-config/user-management')
  return { error: error?.message }
}

export async function deleteUser(userId: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)
  revalidatePath('/system-config/user-management')
  return { error: error?.message }
}