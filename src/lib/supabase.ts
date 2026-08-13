import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oteijgwivctlznzdysqo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZWlqZ3dpdmN0bHpuemR5c3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzUxMTcsImV4cCI6MjEwMTk1MTExN30.6M3Q8TQWWQU2aaEtH0MQis64Nhv7SSzJQc6Uowy048Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
