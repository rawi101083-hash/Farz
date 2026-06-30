import { createClient } from '@supabase/supabase-js'; 
const supabase = createClient('https://zpcooectdwokmvbgttsf.supabase.co', 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH'); 
supabase.from('jobs').update({ start_date: '2025-01-01' }).eq('id', 'afec65b5-22a4-4a3b-8bb0-ca2e7f5d284a').then(({data, error}) => { console.log('ERROR:', error, 'DATA:', data); });
