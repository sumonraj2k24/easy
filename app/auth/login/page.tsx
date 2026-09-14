'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState('')
  const demoAccounts = [
    { role: 'Admin', email: 'admin@easyskillbd.com', destination: '/dashboard', style: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
    { role: 'Instructor', email: 'instructor@easyskillbd.com', destination: '/dashboard', style: 'border-blue-200 bg-blue-50 text-blue-800' },
    { role: 'Student', email: 'student@easyskillbd.com', destination: '/student', style: 'border-violet-200 bg-violet-50 text-violet-800' },
  ]
  async function login(emailAddress: string, destination: string, demoRole?: string) {
    setError('')
    if (demoRole) setDemoLoading(demoRole); else setLoading(true)
    const { error: signInError } = await createClient().auth.signInWithPassword({ email: emailAddress, password: demoRole ? 'Demo1234!' : password })
    setLoading(false); setDemoLoading('')
    if (signInError) { setError(signInError.message.toLowerCase().includes('confirm') ? 'ইমেইল কনফার্ম করুন' : 'ডেমো অ্যাকাউন্ট আগে import করুন অথবা ইমেইল/পাসওয়ার্ড যাচাই করুন'); return }
    window.location.href = destination
  }
  async function submit(event: FormEvent) { event.preventDefault(); await login(email, '/dashboard') }
  return <AuthShell title="লগইন করুন" subtitle="আপনার EasySkillBD অ্যাকাউন্টে প্রবেশ করুন"><form onSubmit={submit} className="flex flex-col gap-4"><label className="text-sm font-bold">ইমেইল<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label><label className="text-sm font-bold">পাসওয়ার্ড<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label><div className="text-right"><a href="/auth/forgot-password" className="text-xs font-semibold text-emerald-700">পাসওয়ার্ড ভুলে গেছেন?</a></div>{error && <p className="text-sm font-semibold text-rose-600">{error}</p>}<button disabled={loading || !!demoLoading} className="rounded-xl bg-emerald-600 py-3 font-bold text-white">{loading ? 'অপেক্ষা করুন...' : 'লগইন'}</button><a href="/auth/sign-up" className="text-center text-sm font-semibold text-emerald-700">নতুন অ্যাকাউন্ট তৈরি করুন</a></form><div className="my-6 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />ডেমো লগইন<span className="h-px flex-1 bg-slate-200" /></div><div className="grid gap-2">{demoAccounts.map((account) => <button key={account.role} type="button" disabled={loading || !!demoLoading} onClick={() => login(account.email, account.destination, account.role)} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-bold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 ${account.style}`}><span>{account.role}</span><span className="text-xs font-medium">{demoLoading === account.role ? 'লগইন হচ্ছে...' : account.email}</span></button>)}</div><p className="mt-3 text-center text-xs text-slate-400">ডেমো পাসওয়ার্ড: Demo1234!</p></AuthShell>
}
function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <main className="grid min-h-screen place-items-center bg-slate-50 p-5"><section className="w-full max-w-md rounded-3xl border bg-white p-7 shadow-xl"><a href="/" className="inline-flex h-12 w-[186px] items-center" aria-label="EasySkillBD হোম"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/155x40-ICX8Yasl9AeWQHpBCtRD62Ll403Xlf.png" alt="EasySkillBD logo" width={155} height={40} className="h-10 w-[155px] object-contain object-left" /></a><h1 className="mt-8 text-3xl font-extrabold">{title}</h1><p className="mt-2 text-sm text-slate-500">{subtitle}</p><div className="mt-7">{children}</div></section></main> }
