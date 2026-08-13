-- VIT STARS Admin & Student Shared Schema
-- Execute this in your Supabase SQL Editor

-- 1. Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    register_number VARCHAR(20) UNIQUE NOT NULL,
    stars_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    program VARCHAR(100) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    academic_year INTEGER NOT NULL,
    current_semester INTEGER NOT NULL,
    cgpa NUMERIC(4,2) DEFAULT 0.0,
    attendance_percentage NUMERIC(5,2) DEFAULT 0.0,
    active_arrears INTEGER DEFAULT 0,
    hostel_block VARCHAR(50),
    room_number VARCHAR(20),
    risk_level VARCHAR(20) DEFAULT 'GOOD', -- GOOD, WATCH, HIGH, CRITICAL
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow authenticated read access" ON public.students FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow anon read access" ON public.students FOR SELECT TO anon USING (true);
CREATE POLICY "Allow all access to service role" ON public.students FOR ALL TO service_role USING (true);

-- 2. Leave Requests
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    admin_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read" ON public.leave_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow anon read access" ON public.leave_requests FOR SELECT TO anon USING (true);

-- 3. Outing Requests
CREATE TABLE IF NOT EXISTS public.outing_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    outing_date DATE NOT NULL,
    out_time TIME NOT NULL,
    in_time TIME NOT NULL,
    purpose TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    admin_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.outing_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read" ON public.outing_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow anon read access" ON public.outing_requests FOR SELECT TO anon USING (true);

-- 4. Alerts (Action Required)
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read" ON public.alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow anon read access" ON public.alerts FOR SELECT TO anon USING (true);

-- Disable RLS for inserts/updates from Anon for testing seeding.
-- IN PRODUCTION, remove these and use Service Role Key for seeding.
CREATE POLICY "Allow anon all access" ON public.students FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all access" ON public.leave_requests FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all access" ON public.outing_requests FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all access" ON public.alerts FOR ALL TO anon USING (true);

-- 5. Forms Module
CREATE TABLE IF NOT EXISTS public.forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    academic_year INTEGER,
    semester INTEGER,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, SCHEDULED, PUBLISHED, ACTIVE, CLOSED, ARCHIVED
    is_mandatory BOOLEAN DEFAULT false,
    block_portal BOOLEAN DEFAULT true,
    allow_late_submission BOOLEAN DEFAULT false,
    allow_resubmission BOOLEAN DEFAULT false,
    allow_correction BOOLEAN DEFAULT false,
    allow_student_exemption BOOLEAN DEFAULT false,
    allow_attendance_update_in_opening BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.form_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.form_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.form_sections(id) ON DELETE CASCADE,
    field_key VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    field_type VARCHAR(50) NOT NULL, -- TEXT, NUMBER, PERCENTAGE, DATE, DROPDOWN, RADIO, CHECKBOX, TEXTAREA, FILE_UPLOAD, COURSE_REPEATER, ACADEMIC_DATA, CONFIRMATION
    is_required BOOLEAN DEFAULT false,
    is_read_only BOOLEAN DEFAULT false,
    is_editable BOOLEAN DEFAULT true,
    default_value TEXT,
    placeholder TEXT,
    validation_rules JSONB,
    minimum_value NUMERIC,
    maximum_value NUMERIC,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.form_field_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id UUID REFERENCES public.form_fields(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.form_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN DEFAULT false,
    assignment_status VARCHAR(50) DEFAULT 'NOT_STARTED', -- NOT_STARTED, IN_PROGRESS, SUBMITTED, UNDER_REVIEW, APPROVED, NEEDS_CORRECTION, REJECTED, EXPIRED
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_exempted BOOLEAN DEFAULT false,
    exemption_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(form_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.form_assignments(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'SUBMITTED', -- SUBMITTED, UNDER_REVIEW, APPROVED, NEEDS_CORRECTION, REJECTED
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_id UUID REFERENCES auth.users(id),
    reviewer_remarks TEXT,
    is_late BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.form_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.form_submissions(id) ON DELETE CASCADE,
    field_id UUID REFERENCES public.form_fields(id) ON DELETE CASCADE,
    answer_text TEXT,
    answer_number NUMERIC,
    answer_boolean BOOLEAN,
    answer_date DATE,
    answer_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.form_exemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    admin_id UUID REFERENCES auth.users(id),
    exempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_field_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_exemptions ENABLE ROW LEVEL SECURITY;

-- Allow anon all access for local development & seeding
CREATE POLICY "Allow anon all access" ON public.forms FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all access" ON public.form_sections FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all access" ON public.form_fields FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all access" ON public.form_field_options FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all access" ON public.form_assignments FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all access" ON public.form_submissions FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all access" ON public.form_answers FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all access" ON public.form_exemptions FOR ALL TO anon USING (true);
