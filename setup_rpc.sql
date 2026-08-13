CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.create_student_user(
  p_regno TEXT,
  p_password TEXT
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
BEGIN
  v_email := lower(p_regno) || '@vitstars.edu';

  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    RAISE EXCEPTION 'A student with this Register Number already exists.';
  END IF;

  -- Generate a secure random UUID for the new user
  v_user_id := gen_random_uuid();
  
  -- Insert into Supabase's private auth.users table
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    phone_change,
    phone_change_token,
    email_change_token_current,
    reauthentication_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    v_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "student"}',
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_user_id,
    v_user_id::text,
    format('{"sub": "%s", "email": "%s"}', v_user_id::text, v_email)::jsonb,
    'email',
    now(),
    now(),
    now()
  );

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.delete_student_user(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_profile_id UUID;
BEGIN
  -- Get the profile_id (auth user id) before deleting the student record
  SELECT profile_id INTO v_profile_id FROM public.students WHERE id = p_user_id;

  -- Delete from public.students explicitly in case it's mock data without an auth.users record
  DELETE FROM public.students WHERE id = p_user_id;
  
  -- Delete the user from auth.users (cascades to public.profiles and auth identities)
  IF v_profile_id IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = v_profile_id;
  ELSE
    -- If no profile_id found in students, maybe p_user_id WAS the profile_id (fallback)
    DELETE FROM auth.users WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
