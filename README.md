# EasySkillBD Supabase Setup

## 1) Create project
- https://supabase.com/dashboard → New Project

## 2) Run schema (1-click demo import)
**You need this once — your current project `slqelvloeolwoukdezrl` has NO tables yet (verified via API: `PGRST205 Could not find table`)**

- Dashboard → **SQL Editor** → New Query → paste **`supabase/demo-import.sql`** ( = schema + demo seed + realtime ) → Run
  - Or run separately: first `supabase/schema.sql`, then `supabase/seed-demo-users.sql`
- Verify tables: `profiles`, `site_settings`, `courses`, `modules`, `lessons`, `enrollments`, `payment_requests`, `site_visits`, `presence_sessions`, `lesson_progress`
- Storage bucket `course-media` should be public.
- Realtime is auto-enabled for `courses` + `site_settings` → **dashboard delete → homepage auto-updates without refresh** (see §7).

Quick verify locally after import:
```bash
node scripts/verify-supabase.mjs
# should show ✅ for all tables instead of PGRST205
```

## 3) Env vars (Vercel or local)
Create `.env.local` from `.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon key> # same as anon, needed for proxy
NEXT_PUBLIC_SITE_URL=https://easyskillbd.com
SUPABASE_SERVICE_ROLE_KEY=<service_role> # only for scripts/create-demo-users.mjs
```

## 4) Auth
- Supabase Auth → Providers → Email enabled
- Site URL & Redirect URLs: add `http://localhost:3000/auth/callback` and `https://yourdomain/auth/callback`

## 5) Demo users — choose one method

### Method A — JS (recommended, uses service_role)
```bash
# set in .env.local first
SUPABASE_SERVICE_ROLE_KEY=eyJ...
node scripts/create-demo-users.mjs
```
Creates 3 accounts with `email_confirm=true` and correct roles + demo enrollments/payments.

### Method B — Pure SQL (no service key needed)
- SQL Editor → paste `supabase/seed-demo-users.sql` → Run
- If Supabase Cloud blocks `auth.users` writes, use Method A or the quick fix below.

### Method C — Manual sign-up + quick fix
1. Go to `/auth/sign-up` and create each account manually.
2. Then run:
```sql
update public.profiles set role='admin', is_instructor=true where email='admin@easyskillbd.com';
update public.profiles set role='instructor', is_instructor=true where email='instructor@easyskillbd.com';
update public.profiles set role='student' where email='student@easyskillbd.com';
insert into public.enrollments (user_id, course_id)
select (select id from public.profiles where email='student@easyskillbd.com'), id from public.courses limit 1
on conflict do nothing;
```

## 6) Demo credentials (password for all: `Demo1234!`)
| Role | Email | Password | Access |
|---|---|---|---|
| Admin | `admin@easyskillbd.com` | `Demo1234!` | `/dashboard` (courses, payments, students, settings) |
| Instructor | `instructor@easyskillbd.com` | `Demo1234!` | `/dashboard` (same as admin via `is_admin()` helper) |
| Student | `student@easyskillbd.com` | `Demo1234!` | `/student` (enrolled courses + lessons + syllabus/Zoom) |

- Student is pre-enrolled in course #1, has one approved and one pending bKash payment to test admin approval → enrollment trigger.
- Instructor/Admin can approve pending at `/dashboard` → `payment_requests.status='approved'` triggers enrollment.

## 7) Test flow — Dashboard controls Homepage (realtime)
1. **Homepage is 100% dashboard-controlled** - `app/page.tsx` fetches `courses where published=true` from Supabase + subscribes to `postgres_changes` realtime.
   - `supabase/demo-import.sql` enables `supabase_realtime` publication for `courses` & `site_settings`.
   - **Delete test:** `/dashboard` → Course Management → Delete (🗑️) → homepage instantly removes card (no refresh needed). Empty state shows “কোনো কোর্স পাওয়া যায়নি”.
   - Same for create/update and for branding: Header/Footer/Announcement auto-syncs.
2. Add to cart → bKash checkout → creates `payment_requests` rows
3. Admin at `/dashboard` → Payment Approval → Approve → trigger creates `enrollments`
4. Student at `/student` sees enrolled courses + modules/lessons + syllabus/Zoom links

## 8) Storage
- Uploads for syllabus PDFs and branding go to `course-media` bucket
- Policies allow authenticated upload, public read, admin delete

## 9) Verify
```sql
select email, role, is_instructor, is_blocked from public.profiles where email like '%@easyskillbd.com';
select * from public.enrollments;
select student_name, transaction_id, status, amount from public.payment_requests;
```

## 10) Troubleshooting
- `course not saved` → check RLS: user must have `profiles.role='admin'` or `'instructor'`
- `upload failed` → check bucket `course-media` exists and is public
- `enrollment not created` → payment_requests trigger only fires when `user_id` not null; guest payments require manual enrollment
