import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentContent from './student-content'

export default async function StudentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/student')
  const { data: profile } = await supabase.from('profiles').select('role, full_name, avatar_url, is_blocked').eq('id', user.id).maybeSingle()
  if (profile?.is_blocked) redirect('/auth/login?blocked=1')
  const { data: enrollments } = await supabase.from('enrollments').select('course_id').eq('user_id', user.id).eq('status', 'active')
  const courseIds = enrollments?.map((item) => item.course_id) ?? []
  const { data: courses } = courseIds.length ? await supabase.from('courses').select('id, title, description, image_url, syllabus_url, live_class_title, live_class_date, live_class_time, live_class_url, live_recording_url').in('id', courseIds) : { data: [] }
  return <StudentContent userId={user.id} email={user.email ?? ''} fullName={profile?.full_name ?? ''} avatarUrl={profile?.avatar_url ?? ''} courses={courses ?? []} />
}
