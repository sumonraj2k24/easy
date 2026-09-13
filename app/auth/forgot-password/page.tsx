'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })
    setLoading(false)
    setMessage(error ? 'রিকভারি ইমেইল পাঠানো যায়নি। ইমেইলটি যাচাই করে আবার চেষ্টা করুন।' : 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।')
  }

  return <main className="grid min-h-screen place-items-center bg-slate-50 p-5"><section className="w-full max-w-md rounded-3xl border bg-white p-7 shadow-xl"><a href="/" className="inline-flex h-12 w-[186px] items-center" aria-label="EasySkillBD হোম"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/155x40-ICX8Yasl9AeWQHpBCtRD62Ll403Xlf.png" alt="EasySkillBD logo" width={155} height={40} className="h-10 w-[155px] object-contain object-left" /></a><h1 className="mt-8 text-3xl font-extrabold">পাসওয়ার্ড রিসেট</h1><p className="mt-2 text-sm text-slate-500">আপনার অ্যাকাউন্টের ইমেইল দিন।</p><form onSubmit={submit} className="mt-7 flex flex-col gap-4"><label className="text-sm font-bold">ইমেইল<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label>{message && <p role="status" className="text-sm font-semibold text-slate-600">{message}</p>}<button disabled={loading} className="rounded-xl bg-emerald-600 py-3 font-bold text-white">{loading ? 'অপেক্ষা করুন...' : 'রিসেট লিংক পাঠান'}</button><a href="/auth/login" className="text-center text-sm font-semibold text-emerald-700">লগইনে ফিরে যান</a></form></section></main>
}
