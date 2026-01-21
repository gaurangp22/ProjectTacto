-- Run this in your Supabase SQL Editor to allow public form submissions

-- Enable RLS (if not already enabled)
alter table waitlist enable row level security;

-- Create policy to allow public inserts
create policy "Enable insert for anon users"
on waitlist
for insert
to anon
with check (true);
