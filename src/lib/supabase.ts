import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing in .env file');
}

if (supabaseAnonKey && !supabaseAnonKey.trim().startsWith('eyJ')) {
    console.error('CRITICAL: The Supabase Anon Key provided does not look like a valid JWT. It should start with "eyJ".');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
