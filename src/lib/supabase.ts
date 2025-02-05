import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ylbsumyctdjhewcnzyio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsYnN1bXljdGRqaGV3Y256eWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NzI4NjIsImV4cCI6MjA1NDM0ODg2Mn0.RjRj0obITVZzFmEkkBinAiJaxpRiXn7DR84RTFU3GNs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);