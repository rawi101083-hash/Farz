const fs = require('fs');

const path = 'src/components/JobApplication.tsx';
let content = fs.readFileSync(path, 'utf8');

const newLogic = `    // Asynchronous background task for PDF OCR and AI webhook
    const processAndSubmitBackground = async () => {
      let cv_file_url = "";
      let applicant_db_id = "";
      const cvFile = submitData.resume || submitData.cv || (formRef.current?.querySelector('input[type="file"]') as HTMLInputElement)?.files?.[0];

      try {
        if (cvFile && cvFile instanceof File) {
          // 1. Upload CV to Supabase Storage
          const fileExt = cvFile.name.split('.').pop() || "pdf";
          const fileName = \`\${Date.now()}_applicant.\${fileExt}\`;
          const filePath = \`\${job?.id || 'general'}/\${fileName}\`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("cv_uploads")
            .upload(filePath, cvFile);

          if (!uploadError && uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from("cv_uploads")
              .getPublicUrl(uploadData.path);
            cv_file_url = publicUrlData.publicUrl;
          } else {
            console.error("Storage upload error:", uploadError);
          }
        }
      } catch (err) {
        console.error("Failed to upload CV:", err);
      }

      let skipWebhook = false;
      if (job?.company_id) {
        try {
          const { data: companyData } = await supabase.from('companies').select('subscription_plan, cvs_processed_count').eq('id', job.company_id).single();
          if (companyData) {
            const companyPlan = companyData.subscription_plan || 'free';
            const cvsCount = companyData.cvs_processed_count || 0;
            let limit = 0;
            if (companyPlan === 'free') limit = 50;
            else if (companyPlan === 'one-time') limit = 500;
            else if (companyPlan === 'growth') limit = 1000;
            else if (companyPlan === 'business') limit = 5000;
            else if (companyPlan === 'enterprise') limit = 15000;
            
            if (limit > 0 && cvsCount >= limit) {
              skipWebhook = true;
            } else if (limit === 0) {
              skipWebhook = true;
            }
          }
        } catch (e) {
          console.error("Error fetching company limits:", e);
        }
      }

      // 3. Save to database FIRST
      try {
        const { data: dbData, error: dbError } = await supabase
          .from("applicants")
          .insert([{
            job_id: job?.id || null,
            full_name: (submitData.fullName || submitData.name || submitData.firstName || "متقدم").toString(),
            email: (submitData.email || "").toString(),
            phone: (submitData.phone || "").toString(),
            cv_file_url: cv_file_url || null,
            status: isAutoRejected ? "مرفوض" : (skipWebhook ? "قيد الانتظار" : "قيد الإجراء"),
            decision: isAutoRejected ? "rejected" : "pending",
            rejection_reason: isAutoRejected ? "لم يجتز أسئلة الفلترة المسبقة" : null,
            custom_answers: customAnswers
          }])
          .select("id")
          .single();

        if (!dbError && dbData) {
          applicant_db_id = dbData.id;
        } else {
          console.error("DB insert error:", dbError);
        }
      } catch (err) {
        console.error("DB insert catch error:", err);
      }

      if (isAutoRejected) {
        console.log("Knockout Question failed: Applicant Auto-Rejected. Appended skipAI=true to avoid API costs.");
        return;
      }

      if (skipWebhook) {
        console.log("Company limit reached. Webhook skipped and applicant set to pending.");
        return;
      }

      const n8nPayload = {
        availability: submitData.availability || "",
        applicant_db_id: applicant_db_id,
        applicant_name: (submitData.fullName || submitData.name || submitData.firstName || "متقدم").toString(),
        applicant_email: (submitData.email || "").toString(),
        applicant_phone: (submitData.phone || "").toString(),
        job_id: job?.id || "",
        role_id: activeRole?.id || "",
        cv_file_url: cv_file_url || "",
        jobTitle: activeRole?.title || job?.title || "",
        minEducation: (activeRole?.qualification ?? job?.qualification) === "لا يشترط مؤهل" ? "لا يشترط" : (activeRole?.qualification ?? job?.qualification ?? "لا يشترط"),
        minExperience: (activeRole?.experience ?? job?.experience) === "لا يشترط خبرة" ? "لا يشترط" : (activeRole?.experience ?? job?.experience ?? "لا يشترط"),
        responsibilities: activeRole?.responsibilities ?? job?.responsibilities ?? "",
        roleDescription: activeRole?.description ?? job?.description ?? "",
        textQualifications: activeRole?.qualifications ?? job?.qualifications ?? "",
        targetMajors: activeRole?.targetMajors ?? job?.targetMajors ?? [],
        targetSkills: activeRole?.targetSkills ?? job?.targetSkills ?? [],
        requiredLanguages: activeRole?.requiredLanguages ?? job?.requiredLanguages ?? [],
        aiCustomPrompts: [
          "قاعدة صارمة جداً: مهمتك هي التقييم وإعطاء نسبة مئوية للمطابقة (من 1 إلى 100) والترتيب فقط. يمنع منعاً باتاً استبعاد المرشح أو تعيين حالته كمرفوض (Rejected) بمجرد حصوله على نسبة منخفضة. يجب أن يبقى المتقدم في قائمة قيد الإجراء مهما كانت نسبته حتى لو كانت 0. الاستبعاد الآلي يحدث حصرياً في حال رسوب المتقدم في أسئلة الفلترة المسبقة المحددة من الموارد البشرية فقط.",
          activeRole?.aiInstructions ?? job?.aiInstructions ?? ""
        ].filter(Boolean).join("\\n\\n")
      };

      try {
        await fetch(
          "http://localhost:5678/webhook/99f8e113-a203-45a0-82fb-46861f964ce1",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(n8nPayload)
          }
        );
        
        // Increment cvs count if successful
        if (job?.company_id) {
          await supabase.rpc('increment_cv_count', { comp_id: job.company_id }).catch(() => {});
        }
      } catch (error) {
        console.error("Webhook error:", error);
      }
    };

    if (isAutoRejected) {
      console.log("Skipping n8n AI webhook and writing auto-reject to DB directly.");
    } else {
      // Fire and forget (Background processing)
      processAndSubmitBackground().catch(console.error);
    }`;

let replaced = false;

// Regex to replace the whole block up to setFormStep
const regex = /\/\/\s*Asynchronous background task for PDF OCR and AI webhook[\s\S]*?(?=\n\s*\/\/\s*UX:\s*Instant feedback)/;

if (regex.test(content)) {
    content = content.replace(regex, newLogic + "\n");
    replaced = true;
} else {
  // Try alternative regex
  const altRegex = /\/\/\s*Asynchronous background task for PDF OCR and AI webhook[\s\S]*?(?=\/\/\s*UX:\s*Instant feedback)/;
  if (altRegex.test(content)) {
      content = content.replace(altRegex, newLogic + "\n    ");
      replaced = true;
  }
}

if (replaced) {
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully updated processAndSubmitBackground");
} else {
    console.log("Failed to find TargetContent block.");
}
