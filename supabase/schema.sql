-- Run this file once in the Supabase SQL Editor.
-- Then create the administrator in Authentication > Users and add that user's
-- UUID to public.document_admins. Never put an admin password in this file.

create table if not exists public.document_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('library', 'cybersecurity', 'entrepreneurship', 'courses')),
  category text not null,
  title text not null check (char_length(title) between 1 and 180),
  description text not null default '' check (char_length(description) <= 1200),
  storage_path text not null unique,
  file_name text not null,
  file_size bigint not null check (file_size > 0 and file_size <= 31457280),
  content_type text not null,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now()
);

alter table public.document_admins enable row level security;
alter table public.documents enable row level security;

grant select on public.document_admins to authenticated;
grant select on public.documents to anon, authenticated;
grant insert, delete on public.documents to authenticated;

create or replace function public.is_document_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.document_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_document_admin() from public;
grant execute on function public.is_document_admin() to authenticated;

drop policy if exists "Admins can read their own admin record" on public.document_admins;
create policy "Admins can read their own admin record"
  on public.document_admins for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Documents are readable by everyone" on public.documents;
create policy "Documents are readable by everyone"
  on public.documents for select
  to anon, authenticated
  using (true);

drop policy if exists "Only document admins can add documents" on public.documents;
create policy "Only document admins can add documents"
  on public.documents for insert
  to authenticated
  with check (
    (select public.is_document_admin())
    and created_by = (select auth.uid())
  );

drop policy if exists "Only document admins can delete documents" on public.documents;
create policy "Only document admins can delete documents"
  on public.documents for delete
  to authenticated
  using ((select public.is_document_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sdbsn-documents',
  'sdbsn-documents',
  true,
  31457280,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-zip-compressed'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read shared documents" on storage.objects;
create policy "Public can read shared documents"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'sdbsn-documents');

drop policy if exists "Admins can upload shared documents" on storage.objects;
create policy "Admins can upload shared documents"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'sdbsn-documents'
    and (select public.is_document_admin())
  );

drop policy if exists "Admins can delete shared documents" on storage.objects;
create policy "Admins can delete shared documents"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'sdbsn-documents'
    and (select public.is_document_admin())
  );

-- After creating the administrator in Supabase Authentication > Users,
-- add their UUID from that page:
-- insert into public.document_admins (user_id) values ('ADMIN_USER_UUID');
