import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardContent from './dashboard-content'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/dashboard')
  const { data: profile } = await supabase.from('profiles').select('role, full_name, avatar_url, is_blocked, is_instructor').eq('id', user.id).maybeSingle()
  if (profile?.is_blocked) redirect('/auth/login?blocked=1')
  if (!profile || !['admin', 'instructor'].includes(profile.role)) redirect('/student')
  return <DashboardContent />
}
