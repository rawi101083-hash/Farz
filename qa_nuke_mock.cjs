const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

const start = c.indexOf('  const handleFileUpload = (');
const end = c.indexOf('  const handleInputChange = (');

console.log("Start:", start, "End:", end);

if (start === -1 || end === -1) {
  console.log("Could not find boundaries!");
  process.exit(1);
}

const newBlock = `  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent,
  ) => {
    if ("preventDefault" in e) e.preventDefault();
    setIsDragging(false);

    let file: File | null = null;
    if ("dataTransfer" in e) {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) file = e.dataTransfer.files[0];
    } else if ("target" in e && (e.target as HTMLInputElement).files) {
      file = (e.target as HTMLInputElement).files?.[0] || null;
    }

    if (file) {
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
        
        const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}/);
        const phoneMatch = text.match(/(?:\\+?966|0)?5[0-9]{8}/);

        setFormDataState((prev) => ({
          ...prev,
          email: emailMatch ? emailMatch[0] : prev.email,
          phone: phoneMatch ? phoneMatch[0] : prev.phone,
        }));

        setIsParsing(false);
        setIsParsed(true);
      } catch (err) {
        console.error("PDF Parsing Error", err);
        setIsParsing(false);
        setIsParsed(true); 
      }
    };
    reader.readAsArrayBuffer(file);
  };
`;

c = c.slice(0, start) + newBlock + c.slice(end);
fs.writeFileSync('src/App.tsx', c);

console.log("Successfully replaced handleFileUpload natively!");
