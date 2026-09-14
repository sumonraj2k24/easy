import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const DEMO_PASSWORD = 'Demo1234!'
const DEMO_ACCOUNTS = {
  Admin: { email: 'admin@easyskillbd.com', role: 'admin', full_name: 'Demo Admin', is_instructor: false },
  Instructor: { email: 'instructor@easyskillbd.com', role: 'instructor', full_name: 'Demo Instructor', is_instructor: true },
  Student: { email: 'student@easyskillbd.com', role: 'student', full_name: 'Demo Student', is_instructor: false },
} as const

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { role?: keyof typeof DEMO_ACCOUNTS } | null
  const account = body?.role ? DEMO_ACCOUNTS[body.role] : undefined
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

  if (!account || !serviceKey || !process.env.SUPABASE_URL) {
    return NextResponse.json({ error: 'Demo account setup is unavailable.' }, { status: 400 })
  }

  const supabase = createClient(process.env.SUPABASE_URL, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data: users, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (listError) return NextResponse.json({ error: 'Could not check demo account.' }, { status: 500 })

  let user = users.users.find((candidate) => candidate.email?.toLowerCase() === account.email)
  if (!user) {
    const result = await supabase.auth.admin.createUser({ email: account.email, password: DEMO_PASSWORD, email_confirm: true, user_metadata: { full_name: account.full_name } })
    if (result.error || !result.data.user) return NextResponse.json({ error: 'Could not create demo account.' }, { status: 500 })
    user = result.data.user
  } else {
    const { error } = await supabase.auth.admin.updateUserById(user.id, { password: DEMO_PASSWORD, email_confirm: true, user_metadata: { full_name: account.full_name } })
    if (error) return NextResponse.json({ error: 'Could not refresh demo account.' }, { status: 500 })
  }

  const { error: profileError } = await supabase.from('profiles').upsert({ id: user.id, role: account.role, full_name: account.full_name, is_instructor: account.is_instructor, is_blocked: false }, { onConflict: 'id' })
  if (profileError) return NextResponse.json({ error: 'Could not prepare demo profile.' }, { status: 500 })

  return NextResponse.json({ email: account.email })
}
