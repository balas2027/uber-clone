// src/app/logout/actions.js
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()  // this will now clear cookies properly
  redirect('/login')
}
