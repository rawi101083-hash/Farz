import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://zpcooectdwokmvbgttsf.supabase.co', 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH');
async function run() {
  const { data, error } = await supabase.from('companies').select('*');
  const cr = data[0].commercial_registration;
  console.log("DB CR:", cr, "Length:", cr.length);
  for(let i=0; i<cr.length; i++) console.log(cr.charCodeAt(i));
  
  const payloadCR = '7052842361';
  console.log("Payload CR:", payloadCR, "Length:", payloadCR.length);
  for(let i=0; i<payloadCR.length; i++) console.log(payloadCR.charCodeAt(i));
  
  console.log("Is equal:", cr === payloadCR);
}
run();
