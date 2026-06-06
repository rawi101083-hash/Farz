import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpcooectdwokmvbgttsf.supabase.co';
const supabaseKey = 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking latest applicants...");
    const { data, error } = await supabase.from('applicants').select('full_name, custom_answers, created_at').order('created_at', { ascending: false }).limit(1);
    if (error) console.error("Error fetching applicants:", error);
    else console.log("Latest Applicant Data:", JSON.stringify(data, null, 2));

    console.log("\nChecking recent files in cv_uploads...");
    const { data: files, error: err2 } = await supabase.storage.from('cv_uploads').list('', { limit: 5, sortBy: { column: 'created_at', order: 'desc' } });
    if (err2) console.error("Error fetching files:", err2);
    else {
        // filter out empty folders if any
        const validFiles = files.filter(f => f.name !== '.emptyFolderPlaceholder');
        console.log("Recent Files Uploaded:", validFiles.map(f => f.name));
    }
}
check();
