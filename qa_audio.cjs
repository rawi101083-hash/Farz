const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

const tStart = c.indexOf('// Real Supabase Flow');
const tEnd = c.indexOf('// Async dispatch to webhook');

const originalBlock = c.substring(tStart, tEnd);

const newBlock = `// Real Supabase Flow
    const processSubmission = async () => {
      try {
        let cvFileUrl = "";
        let audioEvalUrl = "";

        if (originalCvFile) {
          const fileExt = originalCvFile.name.split('.').pop();
          const fileName = \`\${activeTargetRole?.id || 'general'}/\${Date.now()}_applicant.\${fileExt}\`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('cv_uploads')
            .upload(fileName, originalCvFile);
            
          if (uploadError) {
             console.error("Supabase Storage Upload Error (CV):", uploadError);
             alert("حدث خطأ أثناء رفع ملف السيرة الذاتية.");
             setIsSubmitting(false);
             return;
          }
          
          const { data: publicUrlData } = supabase.storage
            .from('cv_uploads')
            .getPublicUrl(fileName);
            
          cvFileUrl = publicUrlData.publicUrl;
        }

        if (!isVoiceSkipped && audioBlob) {
          const audioName = \`\${activeTargetRole?.id || 'general'}/\${Date.now()}_audio.webm\`;
          
          const { error: audioUploadError } = await supabase.storage
            .from('cv_uploads') // Reuse the same storage bucket for simplicity
            .upload(audioName, audioBlob, { contentType: 'audio/webm' });
            
          if (audioUploadError) {
             console.error("Supabase Audio Upload Error:", audioUploadError);
             // We won't block the whole submission for audio, but we'd log it.
          } else {
             const { data: audioUrlData } = supabase.storage
               .from('cv_uploads')
               .getPublicUrl(audioName);
             audioEvalUrl = audioUrlData.publicUrl;
          }
        }

        // Insert into applicants DB
        const { data: insertedDbApplicant, error: dbError } = await supabase
          .from('applicants')
          .insert([{
             job_id: activeTargetRole?.id || 'unknown',
             full_name: submitData.fullName || "متقدم جديد",
             email: submitData.email || "applicant@example.com",
             phone: submitData.phone || "0500000000",
             cv_file_url: cvFileUrl,
             voice_eval_url: audioEvalUrl
          }])
          .select()
          .single();

        if (dbError) {
          console.error("Supabase DB Insert Error:", dbError);
          alert("تعذر حفظ الطلب في قاعدة البيانات.");
          setIsSubmitting(false);
          return;
        }

        setFormStep("success");
        setIsSubmitting(false);

        // Memory Leak Protection
        const cvTextBuffer = extractedCvText;
        setExtractedCvText("");

        `;

c = c.slice(0, tStart) + newBlock + c.slice(tEnd);

fs.writeFileSync('src/App.tsx', c);
console.log("Audio processSubmission successfully applied!");
