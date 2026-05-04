'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getBods() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from('bod').select('*').order('name')
  return data ?? []
}

export async function createBod(name: string, title: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('bod').insert({ name, title })
  revalidatePath('/system-config/master-data')
  return { error: error?.message }
}

export async function deleteBod(id: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('bod').delete().eq('id', id)
  revalidatePath('/system-config/master-data')
  return { error: error?.message }
}

export async function getHolidays() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from('national_holidays').select('*').order('date')
  return data ?? []
}

export async function createHoliday(name: string, date: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('national_holidays').insert({ name, date })
  revalidatePath('/system-config/master-data')
  return { error: error?.message }
}

export async function deleteHoliday(id: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('national_holidays').delete().eq('id', id)
  revalidatePath('/system-config/master-data')
  return { error: error?.message }
}