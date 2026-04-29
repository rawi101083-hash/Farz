import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://uivnclpmsvjqqnukrtct.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || "..."; 

// Since we cannot read VITE vars from node easily without setup, I'll extract it from src/lib/supabaseClient.ts.
