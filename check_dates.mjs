import { createClient } from '@supabase/supabase-js'; 
const supabase = createClient('https://zpcooectdwokmvbgttsf.supabase.co', 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH'); 
supabase.from('jobs').select('startDate, endDate').limit(1).then(({data, error}) => { console.log('ERROR:', error, 'DATA:', data); });
