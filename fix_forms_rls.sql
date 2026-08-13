-- Fix RLS policies for forms module
-- Run this in your Supabase SQL Editor

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Allow anon all access" ON public.forms;
DROP POLICY IF EXISTS "Allow anon all access" ON public.form_sections;
DROP POLICY IF EXISTS "Allow anon all access" ON public.form_fields;
DROP POLICY IF EXISTS "Allow anon all access" ON public.form_assignments;

DROP POLICY IF EXISTS "Allow authenticated all access" ON public.forms;
DROP POLICY IF EXISTS "Allow authenticated all access" ON public.form_sections;
DROP POLICY IF EXISTS "Allow authenticated all access" ON public.form_fields;
DROP POLICY IF EXISTS "Allow authenticated all access" ON public.form_assignments;

-- Enable RLS (in case it wasn't)
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated all access" ON public.forms FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated all access" ON public.form_sections FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated all access" ON public.form_fields FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated all access" ON public.form_assignments FOR ALL TO authenticated USING (true);

-- Create policies for anon users (for testing/development)
CREATE POLICY "Allow anon all access" ON public.forms FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all access" ON public.form_sections FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all access" ON public.form_fields FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all access" ON public.form_assignments FOR ALL TO anon USING (true);
