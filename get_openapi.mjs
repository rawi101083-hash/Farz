import fetch from 'node-fetch'; // Or just use built-in fetch if Node >= 18

async function run() {
  const url = 'https://zpcooectdwokmvbgttsf.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwY29vZWN0ZHdva212Ymd0dHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQyMDk3ODMsImV4cCI6MjAyMDA4NTc4M30.xxx';
  // We can use the service_role key to be sure
  const service_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwY29vZWN0ZHdva212Ymd0dHNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcxODI2OSwiZXhwIjoyMDkyMjk0MjY5fQ.Z_MzKzusjzEFLMW4K3E6z3WZSz6mR-qUn_xamEbwk2k';
  
  const res = await fetch('https://zpcooectdwokmvbgttsf.supabase.co/rest/v1/?apikey=' + service_key);
  const json = await res.json();
  
  const companies = json.definitions.companies;
  console.log("Companies Schema:", JSON.stringify(companies, null, 2));
  
  // Also list all RPCs (functions)
  console.log("RPCs available:");
  for (const path in json.paths) {
    if (path.startsWith('/rpc/')) {
      console.log(path);
    }
  }
}
run();
