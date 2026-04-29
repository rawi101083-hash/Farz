const fs = require('fs');

let content = fs.readFileSync('src/components/JobApplication.tsx', 'utf-8');

// 1. Add pdfjs import at the top
if (!content.includes('import * as pdfjsLib')) {
  // Find last import
  const lastImportIdx = content.lastIndexOf('import ');
  const insertIdx = content.indexOf('\\n', lastImportIdx) + 1;
  const importString = `import * as pdfjsLib from "pdfjs-dist";\\npdfjsLib.GlobalWorkerOptions.workerSrc = \`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/\${pdfjsLib.version}/pdf.worker.min.mjs\`;\\n`;
  content = content.substring(0, insertIdx) + importString + content.substring(insertIdx);
}

// 2. We need to identify where to inject the PDF parsing in handleFinalSubmit.
// Current logic:
/*
    const n8nPayload = {
      applicant_name: (submitData.fullName || submitData.name || "متقدم").toString(),
      cv_file_url: "رابط_ملف_الـ_PDF_الخاص_بالسيرة_الذاتية_mock.pdf",
      ...
*/

// Let's replace the whole n8nPayload construction and fetch to enable async PDF reading.
const regexFind = /    const n8nPayload = \{[\s\S]*?console.log\("Skipping n8n AI webhook and writing auto-reject to DB directly."\);\n      \}\n    \} catch \(error\) \{\n      console.error\("Webhook error:", error\);\n    \}\n    setTimeout\(\(\) => \{\n      setFormStep\("success"\);\n    \}, 1500\);/m;

const replacement = `    // Asynchronous background task for PDF OCR and AI webhook
    const processAndSubmitBackground = async () => {
      if (isAutoRejected) return;

      let cv_text = "";
      try {
        const cvFile = submitData.resume || submitData.cv || (formRef.current?.querySelector('input[type="file"]') as HTMLInputElement)?.files?.[0];
        if (cvFile && cvFile instanceof File && cvFile.type === "application/pdf") {
          const arrayBuffer = await cvFile.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            cv_text += textContent.items.map((item: any) => item.str).join(" ") + "\\n";
          }
          if (cv_text.length > 15000) {
            cv_text = cv_text.substring(0, 15000); // 15k limit protection
          }
        }
      } catch (err) {
        console.error("Failed to parse PDF:", err);
      }

      const n8nPayload = {
        applicant_name: (submitData.fullName || submitData.name || "متقدم").toString(),
        cv_text: cv_text,
        jobTitle: activeRole?.title || job?.title || "",
        minEducation: (activeRole?.qualification ?? job?.qualification) === "لا يشترط مؤهل" ? "لا يشترط" : (activeRole?.qualification ?? job?.qualification ?? "لا يشترط"),
        minExperience: (activeRole?.experience ?? job?.experience) === "لا يشترط خبرة" ? "لا يشترط" : (activeRole?.experience ?? job?.experience ?? "لا يشترط"),
        responsibilities: activeRole?.responsibilities ?? job?.responsibilities ?? "",
        roleDescription: activeRole?.description ?? job?.description ?? "",
        textQualifications: activeRole?.qualifications ?? job?.qualifications ?? "",
        targetMajors: activeRole?.targetMajors ?? job?.targetMajors ?? [],
        targetSkills: activeRole?.targetSkills ?? job?.targetSkills ?? [],
        requiredLanguages: activeRole?.requiredLanguages ?? job?.requiredLanguages ?? [],
        applicantTextAnswers: customAnswers.map((a: any) => \`\${a.question}: \${a.answer}\`).join("\\n") || "",
        aiCustomPrompts: activeRole?.aiInstructions ?? job?.aiInstructions ?? ""
      };

      try {
        await fetch(
          "https://circular-struggle-ethical-membership.trycloudflare.com/webhook-test/2489027f-d077-4af4-9d3d-fc0dd9f38953",
          { 
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(n8nPayload) 
          }
        );
      } catch (error) {
        console.error("Webhook error:", error);
      } finally {
        // Memory leak protection - clean up heavily
        cv_text = "";
        n8nPayload.cv_text = "";
        // Let GC handle the rest
      }
    };

    if (isAutoRejected) {
      console.log("Skipping n8n AI webhook and writing auto-reject to DB directly.");
    } else {
      // Fire and forget (Background processing)
      processAndSubmitBackground().catch(console.error);
    }

    // UX: Instant feedback, Zero blocking
    setFormStep("success");
`;

if (content.match(regexFind)) {
  content = content.replace(regexFind, replacement);
  fs.writeFileSync('src/components/JobApplication.tsx', content);
  console.log("JobApplication updated with OCR and background processing!");
} else {
  console.log("Regex not found in JobApplication.tsx");
}
