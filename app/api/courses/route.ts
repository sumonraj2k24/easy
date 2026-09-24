import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const serviceClient = () => createServiceClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function requireManager() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'অনুমতি নেই' }, { status: 401 }) }
  const { data: profile } = await supabase.from('profiles').select('role, is_blocked').eq('id', user.id).maybeSingle()
  const role = profile?.role ?? user.app_metadata?.role
  if (profile?.is_blocked || !['admin', 'instructor'].includes(role)) return { error: NextResponse.json({ error: 'কোর্স পরিচালনার অনুমতি নেই' }, { status: 403 }) }
  return { supabase: createServiceClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!) }
}

export async function GET() {
  const result = await requireManager()
  if ('error' in result) return result.error
  const { data, error } = await result.supabase.from('courses').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ courses: data ?? [] })
}

export async function POST(request: Request) {
  const result = await requireManager()
  if ('error' in result) return result.error
  const body = await request.json()
  const payload = { title: String(body.title ?? '').trim(), price: Number(body.price), discount: Number(body.discount), description: String(body.description ?? ''), youtube_url: String(body.youtubeUrl ?? ''), thumbnail_url: String(body.thumbnailUrl ?? ''), syllabus_url: String(body.syllabusUrl ?? ''), live_class_title: String(body.liveClassTitle ?? ''), live_class_date: body.liveClassDate || null, live_class_time: String(body.liveClassTime ?? ''), live_class_url: String(body.liveClassUrl ?? ''), live_recording_url: String(body.liveRecordingUrl ?? ''), published: body.published !== false }
  if (!payload.title || !Number.isFinite(payload.discount) || payload.discount <= 0) return NextResponse.json({ error: 'কোর্সের নাম ও সঠিক মূল্য দিন' }, { status: 400 })
  const { data, error } = await result.supabase.from('courses').insert(payload).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ course: data }, { status: 201 })
}

export async function PUT(request: Request) {
  const result = await requireManager()
  if ('error' in result) return result.error
  const body = await request.json()
  const id = Number(body.id)
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'সঠিক কোর্স নির্বাচন করুন' }, { status: 400 })
  const { id: _id, ...rest } = body
  const payload = { title: String(rest.title ?? '').trim(), price: Number(rest.price), discount: Number(rest.discount), description: String(rest.description ?? ''), youtube_url: String(rest.youtubeUrl ?? ''), thumbnail_url: String(rest.thumbnailUrl ?? ''), syllabus_url: String(rest.syllabusUrl ?? ''), live_class_title: String(rest.liveClassTitle ?? ''), live_class_date: rest.liveClassDate || null, live_class_time: String(rest.liveClassTime ?? ''), live_class_url: String(rest.liveClassUrl ?? ''), live_recording_url: String(rest.liveRecordingUrl ?? ''), published: rest.published !== false }
  const { data, error } = await result.supabase.from('courses').update(payload).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ course: data })
}

export async function DELETE(request: Request) {
  const result = await requireManager()
  if ('error' in result) return result.error
  const id = Number(new URL(request.url).searchParams.get('id'))
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'সঠিক কোর্স নির্বাচন করুন' }, { status: 400 })
  const { error } = await result.supabase.from('courses').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
