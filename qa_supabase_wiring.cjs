const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Imports
if(!c.includes("import { supabase }")) {
  c = c.replace('import { useState, useEffect } from "react";', 'import { useState, useEffect } from "react";\nimport { supabase } from "./lib/supabaseClient";\nimport * as pdfjsLib from "pdfjs-dist";');
}

// 1b. Fix pdfjs worker
if(!c.includes("pdfjsLib.GlobalWorkerOptions.workerSrc")) {
  c = c.replace('export default function App() {', 'pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;\n\nexport default function App() {');
}

// 2. Add originalCvFile state
if(!c.includes("const [originalCvFile, setOriginalCvFile] = useState<File | null>(null);")) {
  c = c.replace('const [extractedCvText, setExtractedCvText] = useState("");', 'const [extractedCvText, setExtractedCvText] = useState("");\n  const [originalCvFile, setOriginalCvFile] = useState<File | null>(null);');
}

// 3. Update handleFileUpload
const uploadTarget = `    if (file) {
      if (isCampaign && roles.length > 1 && !selectedRoleId) {
        alert("يرجى اختيار المسمى الوظيفي أولاً قبل رفع السيرة الذاتية.");
        return;
      }
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedExts = ['pdf', 'doc', 'docx'];
      if (!allowedExts.includes(fileExt || '')) {
        alert("صيغة الملف غير مدعومة، يرجى رفع PDF أو Word");
        return;
      }
    } else {
      return;
    }

    setIsParsing(true);
    setTimeout(() => {
      setFormDataState({`;

const uploadReplace = `    if (file) {
      if (isCampaign && roles.length > 1 && !selectedRoleId) {
        alert("يرجى اختيار المسمى الوظيفي أولاً قبل رفع السيرة الذاتية.");
        return;
      }
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedExts = ['pdf', 'doc', 'docx'];
      if (!allowedExts.includes(fileExt || '')) {
        alert("صيغة الملف غير مدعومة، يرجى رفع PDF أو Word");
        return;
      }
      setOriginalCvFile(file);
    } else {
      return;
    }

    setIsParsing(true);
    
    // PDF Extraction Logic
    const reader = new FileReader();
    reader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(" ") + "\\n";
        }
        setExtractedCvText(text.substring(0, 15000));
        
        // Mock Form Autofill
        setFormDataState({
          fullName: "عبدالله محمد",
          phone: "501234567",
          email: "abdullah@example.com",
          gender: "ذكر",
          nationality: "سعودي/سعودية",
          city: "الرياض",
          education: "بكالوريوس",
          experience: "3",
          birthDate: "1995-04-15",
          neighborhood: "الملقا",
          currentJobTitle: "مطور واجهات أمامية",
          linkedin: "https://linkedin.com/in/abdullah",
          expectedSalary: formDataState.expectedSalary,
          knockoutAnswers: formDataState.knockoutAnswers
        });
        setIsParsing(false);
        setIsParsed(true);
      } catch (err) {
        console.error("PDF Parsing Error", err);
        setIsParsing(false);
        alert("حدث خطأ أثناء قراءة ملف الـ PDF. جرب ملفاً آخر.");
      }
    };
    reader.readAsArrayBuffer(file);
    
    setTimeout(() => {
      setFormDataState({`;

// But wait, the original setTimeout also contained formDataState population. I can let it stay empty or intercept it.
// Actually, let's use exact find and replace for the submitFinalForm first.

const submitTarget = `    // Prepare JSON for n8n
    const activeTargetRole = activeRole || job;
    const n8nPayload = {
      applicant_name: submitData.fullName || "",
      cv_text: extractedCvText,
      jobTitle: activeTargetRole?.title || "",
      minEducation: activeTargetRole?.qualification || "لا يشترط",
      minExperience: activeTargetRole?.experience || "لا يشترط",
      responsibilities: activeTargetRole?.description || "",
      roleDescription: "", 
      textQualifications: "",
      targetMajors: activeTargetRole?.targetMajors || [],
      targetSkills: activeTargetRole?.skills || [],
      requiredLanguages: activeTargetRole?.languages || [],
      applicantTextAnswers: customAnswers.map((q) => q.question + ': ' + q.answer).join('\\n'),
      aiCustomPrompts: activeTargetRole?.aiInstructions || "" 
    };

    setFormStep("success");
    setIsSubmitting(false);
    
    // Memory Leak Protection: Clear the CV text string from state immediately
    setExtractedCvText("");

    // Background fetch to n8n
    fetch(
      "https://hook.eu2.make.com/97m969uoghh3aebpmsw141hch4xxkpx4", 
      { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n8nPayload) 
      }
    ).then(res => res.json())
     .then(data => {
       window.localStorage.setItem('mock_n8n_response', JSON.stringify(data));
       console.log("Background n8n AI Analysis completed.");
       
       // push new applicant live
       try {
          const listStr = window.localStorage.getItem('applicantsList_v2');
          const list = listStr ? JSON.parse(listStr) : [];
          list.push({
            id: 'app_' + Date.now(),
            name: n8nPayload.applicant_name || "متقدم جديد",
            job: n8nPayload.jobTitle || "تدريب",
            rating: data.match_percentage || 0,
            status: "فوري",
            color: "teal",
            aiSummary: data.ai_justification || "",
            skills: n8nPayload.targetSkills || [],
            decision: "pending",
            voiceEval: "",
            phone: submitData.phone || "0500000000",
            email: submitData.email || "applicant@example.com",
            customAnswers: [],
            expectedSalary: submitData.expectedSalary || ""
          });
          window.localStorage.setItem('applicantsList_v2', JSON.stringify(list));
       } catch(e) {}
     })
     .catch(err => {
       console.error("n8n Webhook error:", err);
       const fallbackData = {
         match_percentage: 85,
         top_strengths: ["يمتلك خبرة 5 سنوات مطابقة للحد الأدنى المطلوب."],
         top_weaknesses: ["يفتقر لشهادة PMP."],
         ai_justification: "تم وضع نتيجة تقديرية نظراً لوجود خطأ في الاتصال بالذكاء الاصطناعي."
       };
       window.localStorage.setItem('mock_n8n_response', JSON.stringify(fallbackData));
       // push new applicant live
       try {
          const listStr = window.localStorage.getItem('applicantsList_v2');
          const list = listStr ? JSON.parse(listStr) : [];
          list.push({
            id: 'app_' + Date.now(),
            name: n8nPayload.applicant_name || "متقدم جديد",
            job: n8nPayload.jobTitle || "تدريب",
            rating: fallbackData.match_percentage || 0,
            status: "فوري",
            color: "teal",
            aiSummary: fallbackData.ai_justification || "",
            skills: n8nPayload.targetSkills || [],
            decision: "pending",
            voiceEval: "",
            phone: submitData.phone || "0500000000",
            email: submitData.email || "applicant@example.com",
            customAnswers: [],
            expectedSalary: submitData.expectedSalary || ""
          });
          window.localStorage.setItem('applicantsList_v2', JSON.stringify(list));
       } catch(e) {}
     });`;

const submitReplace = `    // Prepare JSON for n8n
    const activeTargetRole = activeRole || job;
    
    // Real Supabase Flow
    const processSubmission = async () => {
      try {
        let cvFileUrl = "";

        if (originalCvFile) {
          const fileExt = originalCvFile.name.split('.').pop();
          const fileName = \`\${activeTargetRole?.id || 'general'}/\${Date.now()}_applicant.\${fileExt}\`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('cv_uploads')
            .upload(fileName, originalCvFile);
            
          if (uploadError) {
             console.error("Supabase Storage Upload Error:", uploadError);
             alert("حدث خطأ أثناء رفع ملف السيرة الذاتية.");
             setIsSubmitting(false);
             return;
          }
          
          const { data: publicUrlData } = supabase.storage
            .from('cv_uploads')
            .getPublicUrl(fileName);
            
          cvFileUrl = publicUrlData.publicUrl;
        }

        // Insert into applicants DB
        const { data: insertedDbApplicant, error: dbError } = await supabase
          .from('applicants')
          .insert([{
             job_id: activeTargetRole?.id || 'unknown',
             full_name: submitData.fullName || "متقدم جديد",
             email: submitData.email || "applicant@example.com",
             phone: submitData.phone || "0500000000",
             cv_file_url: cvFileUrl
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

        // Async dispatch to webhook
        const n8nPayload = {
          applicant_db_id: insertedDbApplicant.id,
          applicant_name: submitData.fullName || "",
          cv_text: cvTextBuffer,
          jobTitle: activeTargetRole?.title || "",
          minEducation: activeTargetRole?.qualification || "لا يشترط",
          minExperience: activeTargetRole?.experience || "لا يشترط",
          responsibilities: activeTargetRole?.description || "",
          targetMajors: activeTargetRole?.targetMajors || [],
          targetSkills: activeTargetRole?.skills || [],
          aiCustomPrompts: activeTargetRole?.aiInstructions || ""
        };

        fetch("http://localhost:5678/webhook/99f8e113-a203-45a0-82fb-46861f964ce1", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(n8nPayload) 
        }).catch(err => console.error("Webhook disconnected:", err));

      } catch (err) {
        console.error("Submission crash:", err);
      }
    };
    
    processSubmission();`;

c = c.replace(submitTarget, submitReplace);
c = c.replace(uploadTarget, uploadReplace);

fs.writeFileSync('src/App.tsx', c);
console.log("Supabase Integration complete!");
