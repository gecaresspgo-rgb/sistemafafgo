import { createClient } from '@supabase/supabase-js';
var supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
var supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or anon key is not set');
}
export var supabase = createClient(supabaseUrl, supabaseAnonKey);
