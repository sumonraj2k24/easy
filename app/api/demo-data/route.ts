import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const demoCourses = [
  {
    title: 'কমপ্লিট ওয়েব ডেভেলপমেন্ট',
    category: 'ওয়েব ডেভেলপমেন্ট',
    instructor: 'মো. রাকিব হাসান',
    lessons: 42,
    price: 4990,
    discount: 2490,
    description: 'HTML, CSS, JavaScript এবং বাস্তব প্রজেক্ট শিখুন।',
    published: true,
  },
  {
    title: 'প্রফেশনাল গ্রাফিক্স ডিজাইন',
    category: 'গ্রাফিক্স ডিজাইন',
    instructor: 'সাদিয়া আফরোজ',
    lessons: 28,
    price: 3990,
    discount: 1990,
    description: 'Photoshop, Illustrator ও ব্র্যান্ডিংয়ের পূর্ণাঙ্গ কোর্স।',
    published: true,
  },
  {
    title: 'ডিজিটাল মার্কেটিং মাস্টারি',
    category: 'ডিজিটাল মার্কেটিং',
    instructor: 'তানভীর আহমেদ',
    lessons: 36,
    price: 4590,
    discount: 2290,
    description: 'ডিজিটাল মার্কেটিংয়ের বাস্তব কৌশল ও ক্যাম্পেইন শিখুন।',
    published: true,
  },
]

export async function POST(request: Request) {
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY
  const authorization = request.headers.get('authorization')

  if (!url || !serviceKey || !anonKey || !authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Demo import is unavailable.' }, { status: 503 })
  }

  const token = authorization.slice('Bearer '.length)
  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: { user }, error: userError } = await authClient.auth.getUser(token)
  if (userError || !user || user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access is required.' }, { status: 403 })
  }

  const adminClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  for (const course of demoCourses) {
    const { data: existing, error: lookupError } = await adminClient.from('courses').select('id').eq('title', course.title).maybeSingle()
    if (lookupError) {
      return NextResponse.json({ error: 'Could not check demo courses.' }, { status: 500 })
    }
    const result = existing?.id
      ? await adminClient.from('courses').update(course).eq('id', existing.id)
      : await adminClient.from('courses').insert(course)
    if (result.error) {
      return NextResponse.json({ error: 'Could not import demo courses.' }, { status: 500 })
    }
  }

  const { data: settings } = await adminClient.from('site_settings').select('id').limit(1).maybeSingle()
  const settingsPayload = {
    name: 'EasySkillBD',
    announcement: 'নতুন ব্যাচে ভর্তি চলছে — আজই এনরোল করুন',
    support_email: 'info.easyskill@gmail.com',
    whatsapp: '8801715710019',
    address: 'Ghatail-1980, Tangail, Dhaka, Bangladesh',
    footer_text: 'নিজের গতিতে শিখুন, নিজের ভবিষ্যৎ তৈরি করুন।',
    primary_color: '#10b981',
    meta_title: 'EasySkillBD — নিজের গতিতে শিখুন',
    meta_description: 'দেশের সেরা মেন্টরদের সাথে নতুন স্কিল শিখুন।',
  }
  const settingsResult = settings?.id
    ? await adminClient.from('site_settings').update(settingsPayload).eq('id', settings.id)
    : await adminClient.from('site_settings').insert(settingsPayload)

  if (settingsResult.error) {
    return NextResponse.json({ error: 'Courses imported, but site settings could not be imported.' }, { status: 500 })
  }

  return NextResponse.json({ imported: demoCourses.length })
}
