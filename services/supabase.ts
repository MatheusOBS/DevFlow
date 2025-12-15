import { createClient } from '@supabase/supabase-js';

// Hardcoded for simplicity as requested by user. 
// These are safe to expose (anon key).
const supabaseUrl = 'https://lcktcjalxdiliborsrko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxja3RjamFseGRpbGlib3JzcmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NTE4MzMsImV4cCI6MjA4MTMyNzgzM30.01LyvmabDFceVv76O9ARkUmmoNOuCESMedbO_0zhxrA';

export const supabase = createClient(supabaseUrl, supabaseKey);
