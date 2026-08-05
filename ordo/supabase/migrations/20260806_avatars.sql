-- ORDO optional profile avatars. Run in Supabase SQL Editor.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar upload only to own folder"
on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Avatar update only in own folder"
on storage.objects for update to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Public avatar viewing"
on storage.objects for select to public
using (bucket_id = 'avatars');
