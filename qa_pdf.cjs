const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add imports to the top
const importsInject = `import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;`;
c = c.replace(/import React, { useState, useEffect, useRef } from "react";/, importsInject);

// 2. Add extractedCvText state to ApplicantForm
const formStateInject = `  const [formDataState, setFormDataState] = useState({`;
const formStateReplacement = `  const [extractedCvText, setExtractedCvText] = useState("");
  const [formDataState, setFormDataState] = useState({`;
c = c.replace(formStateInject, formStateReplacement);

// 3. Update handleFileUpload with real PDF parsing
const fileUploadTarget = `    if (file) {
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
    setTimeout(() => {`;

const fileUploadReplacement = `    if (file) {
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
      
      if (fileExt === 'pdf') {
        setIsParsing(true);
        file.arrayBuffer().then(async (arrayBuffer) => {
          try {
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            let fullText = "";
            for(let i=1; i<=pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              fullText += textContent.items.map((item: any) => item.str).join(' ') + "\\n";
            }
            setExtractedCvText(fullText.substring(0, 15000));
          } catch(err) {
            console.error("PDF Parsing error:", err);
          }
          finishParsing();
        }).catch(finishParsing);
      } else {
        setIsParsing(true);
        setTimeout(finishParsing, 1500);
      }
    } else {
      return;
    }

    const finishParsing = () => {`;

c = c.replace(fileUploadTarget, fileUploadReplacement);

const finishParsingEndTarget = `      setIsParsing(false);
      setIsParsed(true);
    }, 1500);`;
const finishParsingEndReplacement = `      setIsParsing(false);
      setIsParsed(true);
    };`;
c = c.replace(finishParsingEndTarget, finishParsingEndReplacement);

// 4. Transform ApplicantForm submitFinalForm to JSON and Background Webhook logic
// (Currently we just replace the body of submitFinalForm logic concerning webhook)

let submitFinalFormStart = c.indexOf('const submitFinalForm = async () => {');
if (submitFinalFormStart !== -1) {
    // We will find the end of `if (isAutoRejected)` block and the try/catch block
    // Wait, the webhook code is near the end. Let's find: `let isAutoRejected = false;`
}

fs.writeFileSync('src/App.tmp.tsx', c);
console.log("Written temp file");
