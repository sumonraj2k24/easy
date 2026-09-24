'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, LogOut, PlayCircle, BookOpen, UserRound, ArrowRight } from 'lucide-react'

type Lesson = { id: string; title: string; video_url: string; order_index: number }
type Module = { id: string; title: string; order_index: number; lessons: Lesson[] }
type Course = { id: string; title: string; description: string; image_url: string | null; syllabus_url?: string | null; live_class_title?: string | null; live_class_date?: string | null; live_class_time?: string | null; live_class_url?: string | null; live_recording_url?: string | null }

const fallback: Module[] = [{ id: 'intro', title: 'কোর্সের ভিডিও লেসন', order_index: 0, lessons: [
  { id: '1', title: 'পার্ট ১: কোর্সের পরিচিতি', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order_index: 1 },
  { id: '2', title: 'পার্ট ২: টুলস সেটআপ', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order_index: 2 },
  { id: '3', title: 'পার্ট ৩: প্র্যাকটিক্যাল কাজ', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order_index: 3 },
] }]

function embedUrl(url: string) {
  if (url.includes('youtube.com/embed/')) return url
  const match = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}

export default function StudentContent({ initialModules = fallback, courseId, userId: _userId, email = '', fullName = '', avatarUrl = '', courses = [] }: { initialModules?: Module[]; courseId?: string; userId?: string; email?: string; fullName?: string; avatarUrl?: string; courses?: Course[] }) {
  const router = useRouter()
  const [modules, setModules] = useState(initialModules)
  const [selected, setSelected] = useState(initialModules[0]?.lessons[0])
  const [completed, setCompleted] = useState<string[]>([])
  const [loggingOut, setLoggingOut] = useState(false)
  const displayName = fullName || email.split('@')[0] || 'শিক্ষার্থী'
  const initials = displayName.slice(0, 2).toUpperCase()
  const total = useMemo(() => modules.reduce((sum, module) => sum + module.lessons.length, 0), [modules])
  const progress = total ? Math.round((completed.length / total) * 100) : 0

  async function logout() {
    setLoggingOut(true)
    await createClient().auth.signOut()
    router.replace('/auth/login')
    router.refresh()
  }

  return <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <a href="/" className="flex items-center gap-3" aria-label="EasySkillBD home">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-600 text-lg font-black text-white">E</span>
          <span><strong className="block text-lg font-black tracking-tight">EasySkillBD</strong><span className="text-xs text-slate-500">আপনার শেখার সঙ্গী</span></span>
        </a>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block"><p className="text-sm font-bold">{displayName}</p><p className="text-xs text-slate-500">স্টুডেন্ট</p></div>
          {avatarUrl ? <img src={avatarUrl} alt={`${displayName}-এর প্রোফাইল`} className="size-10 rounded-full object-cover ring-2 ring-emerald-100" /> : <span className="grid size-10 place-items-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">{initials}</span>}
          <button type="button" onClick={logout} disabled={loggingOut} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-60"><LogOut data-icon="inline-start" />{loggingOut ? 'বের হচ্ছেন...' : 'লগআউট'}</button>
        </div>
      </div>
    </header>

    <div className="mx-auto max-w-7xl px-5 py-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="mb-2 text-sm font-semibold text-emerald-100">স্বাগতম, {displayName}</p><h1 className="max-w-xl text-3xl font-black tracking-tight sm:text-4xl">আজও কিছু নতুন শিখে ফেলুন</h1><p className="mt-3 max-w-lg text-sm leading-6 text-emerald-50">আপনার কোর্স, শেখার অগ্রগতি এবং গুরুত্বপূর্ণ রিসোর্স এক জায়গায়।</p></div><div className="flex items-center gap-3 rounded-2xl bg-white/15 p-4 backdrop-blur"><BookOpen /><div><p className="text-2xl font-black">{courses.length}</p><p className="text-xs text-emerald-50">আমার কোর্স</p></div></div></div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">এনরোল করা কোর্স</p><p className="mt-2 text-3xl font-black text-slate-900">{courses.length}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">মোট লেসন</p><p className="mt-2 text-3xl font-black text-slate-900">{total}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">বর্তমান অগ্রগতি</p><p className="mt-2 text-3xl font-black text-emerald-600">{progress}%</p></div></section>

      <section className="mt-8"><div className="mb-4 flex items-end justify-between"><div><p className="text-sm font-semibold text-emerald-600">Learning library</p><h2 className="mt-1 text-2xl font-black">আমার কোর্সসমূহ</h2></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">{courses.length}টি কোর্স</span></div>{courses.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{courses.map((course) => <article key={course.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-[16/9] bg-emerald-50">{course.image_url ? <img src={course.image_url} alt={course.title} className="size-full object-cover" /> : <div className="grid size-full place-items-center text-emerald-300"><BookOpen className="size-12" /></div>}<span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-700">চলমান</span></div><div className="p-5"><h3 className="line-clamp-2 text-lg font-black">{course.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{course.description || 'আপনার শেখার যাত্রা শুরু করুন।'}</p><div className="mt-5 flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">আপনার কোর্স</span><a href={courseId === course.id ? '#lesson-player' : `/student?course=${course.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700">শুরু করুন <ArrowRight /></a></div></div></article>)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><UserRound className="mx-auto text-slate-300" /><h3 className="mt-3 font-black">এখনো কোনো কোর্স নেই</h3><p className="mt-1 text-sm text-slate-500">অ্যাডমিন আপনাকে কোর্সে যুক্ত করলে এখানে দেখতে পাবেন।</p></div>}</section>

      <section id="lesson-player" className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"><div><div className="overflow-hidden rounded-3xl bg-slate-950 shadow-xl"><div className="aspect-video bg-black">{selected?.video_url ? <iframe key={selected.id} src={embedUrl(selected.video_url)} title={selected.title} className="size-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <div className="grid size-full place-items-center text-slate-400">ভিডিও নির্বাচন করুন</div>}</div><div className="p-6 text-white"><p className="text-sm font-semibold text-emerald-300">এখন চলছে</p><h2 className="mt-2 text-2xl font-black">{selected?.title ?? 'কোর্সের ভিডিও'}</h2><button type="button" onClick={() => selected && setCompleted((items) => items.includes(selected.id) ? items : [...items, selected.id])} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-400"><CheckCircle2 />{selected && completed.includes(selected.id) ? 'সম্পন্ন হয়েছে' : 'লেসন সম্পন্ন হিসেবে চিহ্নিত করুন'}</button></div></div></div><aside className="rounded-3xl border border-slate-200 bg-white p-5"><div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Course content</p><h2 className="mt-1 text-lg font-black">লেসন তালিকা</h2></div><span className="text-sm font-bold text-slate-500">{completed.length}/{total}</span></div><div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} /></div><div className="flex flex-col gap-2">{modules.flatMap((module) => module.lessons).map((lesson, index) => <button type="button" key={lesson.id} onClick={() => setSelected(lesson)} className={`flex items-center gap-3 rounded-xl p-3 text-left transition ${selected?.id === lesson.id ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50'}`}><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-black">{completed.includes(lesson.id) ? <CheckCircle2 className="text-emerald-600" /> : index + 1}</span><span className="min-w-0 flex-1 text-sm font-bold">{lesson.title}</span><PlayCircle className="shrink-0 text-slate-400" /></button>)}</div></aside></section>
    </div>
  </main>
}
