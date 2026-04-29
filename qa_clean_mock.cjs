const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `    if (file) {
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
        expectedSalary: "6000 - 8000",
        knockoutAnswers: {} as Record<string, string>,
      });
      setIsParsing(false);
      setIsParsed(true);
    }, 1500);`;

const replaceStr = `    if (file) {
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
    reader.readAsArrayBuffer(file);`;

if(c.includes('fullName: "عبدالله محمد"')) {
   c = c.replace(targetStr, replaceStr);
   fs.writeFileSync('src/App.tsx', c);
   console.log("Mock data removed, PDF extraction and file persistence restored!");
} else {
   console.log("Target not found!");
}
