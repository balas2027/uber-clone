'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://uberclone-balas.vercel.app/'

// Email/password login
export async function login(formData) {
  const supabase = await createClient()
  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) {
    redirect('/login?error=Email and password are required')
  }

  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/profile')
}

// Email/password signup
export async function signup(formData) {
  const supabase = await createClient()
  const email = formData.get('email')
  const password = formData.get('password')
  const username = formData.get('username')

  if (!email || !password) {
    redirect('/login?error=Email and password are required')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username || email.split('@')[0],
      },
    },
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Create profile record
  if (data.user) {
    await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          username: username || email.split('@')[0],
          email: email,
        }
      ])
  }

  redirect('/login?message=Check your email to confirm your account')
}

// Google OAuth login
export async function loginWithGoogle() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${SITE_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data.url) {
    redirect(data.url)
  }
}
