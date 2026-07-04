import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  // 1. Fetch the multi-role campaign (Job Number 10099)
  const { data: job, error } = await supabase.from('jobs').select('*').eq('job_number', 10099).single();
  if (error) {
    console.error("Error fetching job:", error);
    return;
  }

  // 2. Select the first role "خبير في تحليل بيانات الأحلام"
  const activeRole = job.roles && job.roles.length > 0 ? job.roles[0] : null;

  if (!activeRole) {
    console.log("No roles found in this campaign!");
    return;
  }

  console.log(`✅ Selected Role: ${activeRole.title}`);

  // 3. This is exactly how the Frontend (JobApplication.tsx) builds the job_context
  const sourceRole = activeRole; 
  const isAiOverridden = sourceRole?.aiOverrideFields != null && Object.keys(sourceRole.aiOverrideFields).length > 0;
  const overrideFields = sourceRole?.aiOverrideFields || {};

  const job_context = {
    jobTitle: sourceRole?.title || "",
    minEducation: sourceRole?.qualification === "لا يشترط مؤهل" ? "لا يشترط" : (sourceRole?.qualification ?? "لا يشترط"),
    minExperience: sourceRole?.experience === "لا يشترط خبرة" ? "لا يشترط" : (sourceRole?.experience ?? "لا يشترط"),
    responsibilities: isAiOverridden && overrideFields.responsibilities ? overrideFields.responsibilities : (sourceRole?.responsibilities ?? ""),
    roleDescription: isAiOverridden && overrideFields.roleSummary ? overrideFields.roleSummary : (sourceRole?.description ?? ""),
    textQualifications: isAiOverridden && overrideFields.qualifications ? overrideFields.qualifications : (sourceRole?.qualifications ?? ""),
    targetMajors: isAiOverridden && overrideFields.targetMajors && overrideFields.targetMajors.length > 0 ? overrideFields.targetMajors : (sourceRole?.targetMajors ?? []),
    targetSkills: isAiOverridden && overrideFields.targetSkills && overrideFields.targetSkills.length > 0 ? overrideFields.targetSkills : (sourceRole?.targetSkills ?? []),
    requiredLanguages: isAiOverridden && overrideFields.languages && overrideFields.languages.length > 0 ? overrideFields.languages : (sourceRole?.requiredLanguages ?? []),
    aiCustomPrompts: [
      "قاعدة صارمة: يمنع منعاً باتاً استبعاد المرشح أو تعيين حالته كمرفوض بمجرد حصوله على نسبة منخفضة. يجب أن يبقى المتقدم في قائمة قيد الإجراء مهما كانت نسبته حتى لو كانت 0.",
      sourceRole?.aiInstructions ?? ""
    ].filter(Boolean).join("\n\n")
  };

  // 4. Output the result clearly so the user can verify
  const output = {
    "Message": "هذه هي البيانات التي يتم إرسالها للذكاء الاصطناعي (Claude) حرفياً عند تقديم شخص على الشاغر الأول",
    "Role_Title_Applied_For": activeRole.title,
    "Payload_Sent_To_AI": job_context
  };

  fs.writeFileSync('AI_PAYLOAD_DEBUG.json', JSON.stringify(output, null, 2), 'utf8');
  console.log("✅ The EXACT payload sent to the AI has been saved to 'AI_PAYLOAD_DEBUG.json'. Open it to verify.");
}

run();
