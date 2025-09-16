// app/driver/dashboard/page.js
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DriverDashboardClient from './DriverDashboardClient'

export default async function DriverDashboard() {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/driver/login')

  // Fetch driver profile
  const { data: driverProfile } = await supabase
    .from('driver_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!driverProfile) {
    redirect('/driver/login?error=Driver profile not found')
  }

  return <DriverDashboardClient driver={driverProfile} />
}