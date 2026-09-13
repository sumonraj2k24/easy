'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent) { event.preventDefault(); if (event.nativeEvent instanceof SubmitEvent && (event.nativeEvent as SubmitEvent).submitter) {} setLoading(true); setError(''); const { error: signInError } = await createClient().auth.signInWithPassword({ email, password }); setLoading(false); if (signInError) { setError(signInError.message.toLowerCase().includes('confirm') ? 'ইমেইল কনফার্ম করুন' : 'ইমেইল বা পাসওয়ার্ড সঠিক নয়'); return }; window.location.href = '/dashboard' }
  return <AuthShell title="লগইন করুন" subtitle="আপনার EasySkillBD অ্যাকাউন্টে প্রবেশ করুন"><form onSubmit={submit} className="flex flex-col gap-4"><label className="text-sm font-bold">ইমেইল<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label><label className="text-sm font-bold">পাসওয়ার্ড<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label><div className="text-right"><a href="/auth/forgot-password" className="text-xs font-semibold text-emerald-700">পাসওয়ার্ড ভুলে গেছেন?</a></div>{error && <p className="text-sm font-semibold text-rose-600">{error}</p>}<button disabled={loading} className="rounded-xl bg-emerald-600 py-3 font-bold text-white">{loading ? 'অপেক্ষা করুন...' : 'লগইন'}</button><a href="/auth/sign-up" className="text-center text-sm font-semibold text-emerald-700">নতুন অ্যাকাউন্ট তৈরি করুন</a></form></AuthShell>
}
function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <main className="grid min-h-screen place-items-center bg-slate-50 p-5"><section className="w-full max-w-md rounded-3xl border bg-white p-7 shadow-xl"><a href="/" className="inline-flex h-12 w-[186px] items-center" aria-label="EasySkillBD হোম"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/155x40-ICX8Yasl9AeWQHpBCtRD62Ll403Xlf.png" alt="EasySkillBD logo" width={155} height={40} className="h-10 w-[155px] object-contain object-left" /></a><h1 className="mt-8 text-3xl font-extrabold">{title}</h1><p className="mt-2 text-sm text-slate-500">{subtitle}</p><div className="mt-7">{children}</div></section></main> }
