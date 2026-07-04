import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://zpcooectdwokmvbgttsf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwY29vZWN0ZHdva212Ymd0dHNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcxODI2OSwiZXhwIjoyMDkyMjk0MjY5fQ.Z_MzKzusjzEFLMW4K3E6z3WZSz6mR-qUn_xamEbwk2k');

async function testCompanyUpdate() {
  console.log("Fetching a company to see its columns...");
  const { data: comp, error: fetchErr } = await supabase.from('companies').select('*').limit(1).single();
  if (fetchErr) {
    console.error("Fetch Error:", fetchErr);
    return;
  }
  console.log("Columns in companies table:");
  console.log(Object.keys(comp));
  console.log("Current status:", comp.status);

  // Let's try to update status of a specific company (for example, the first one)
  const id = comp.id;
  const newStatus = comp.status === 'active' ? 'pending' : 'active';
  console.log(`\nTrying to update company ${id} status to '${newStatus}'...`);
  
  const { error: updateErr } = await supabase.from('companies').update({ status: newStatus }).eq('id', id);
  if (updateErr) {
    console.error("Update Error:", updateErr);
  } else {
    console.log("Update successful!");
    // Re-fetch to verify
    const { data: updatedComp } = await supabase.from('companies').select('status').eq('id', id).single();
    console.log("Verified status in DB:", updatedComp.status);
    
    // Revert back
    console.log(`Reverting back to '${comp.status}'...`);
    await supabase.from('companies').update({ status: comp.status }).eq('id', id);
  }
}

testCompanyUpdate();
