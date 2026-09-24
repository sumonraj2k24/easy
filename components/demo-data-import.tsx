'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DemoDataImport() {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const importData = async () => {
    setBusy(true)
    setMessage('')
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setMessage('অ্যাডমিন হিসেবে লগইন করুন')
      setBusy(false)
      return
    }
    const response = await fetch('/api/demo-data', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const result = await response.json().catch(() => null)
    setMessage(response.ok ? `${result?.imported ?? 0}টি ডেমো কোর্স ইমপোর্ট হয়েছে` : result?.error ?? 'ডেমো ডেটা ইমপোর্ট করা যায়নি')
    setBusy(false)
    if (response.ok) window.setTimeout(() => window.location.reload(), 700)
  }

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={importData} disabled={busy} className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-700 disabled:cursor-wait disabled:opacity-60">
        {busy ? 'ইমপোর্ট হচ্ছে...' : 'ডেমো ডেটা ইমপোর্ট'}
      </button>
      {message && <span role="status" className="max-w-48 text-xs text-slate-500">{message}</span>}
    </div>
  )
}
