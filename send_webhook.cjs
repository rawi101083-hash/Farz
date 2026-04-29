const fs = require('fs');

const webhookUrl = "http://localhost:5678/webhook/99f8e113-a203-45a0-82fb-46861f964ce1";

const profiles = JSON.parse(fs.readFileSync('test_profiles.json', 'utf8'));

const sendProfiles = async () => {
  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i];
    
    const payload = {
      applicant_name: profile.name,
      cv_text: `الاسم: ${profile.name}\nالبريد: ${profile.email}\nرقم الجوال: ${profile.phone}\nالمهارات: ${profile.skills.join(', ')}\nالخبرة: ${profile.experience} سنوات\n`,
      jobTitle: "الوظيفة المختبرة (من سكريبت)",
      minEducation: "بكالوريوس",
      minExperience: "سنتين",
      responsibilities: "اختبار النظام والتأكد من توافق السير الذاتية",
      roleDescription: "نبحث عن مرشحين لتجربة نظام الفرز",
      textQualifications: "معرفة في استخدام الأنظمة",
      targetMajors: ["هندسة", "إدارة", "تقنية"],
      targetSkills: ["React", "Python", "Management"],
      requiredLanguages: ["العربية", "الإنجليزية"],
      applicantTextAnswers: `السؤال: هل تقبل العمل عن بعد؟\nالإجابة: ${profile.customAnswers["هل تقبل العمل عن بعد؟"]}`,
      aiCustomPrompts: "يرجى تقييم هذه السيرة الذاتية بناءً على المعطيات",
      // Extra fields just in case they are mapped in n8n
      job_id: "gd8clzn08",
      applicantEmail: profile.email,
      applicantPhone: profile.phone,
      applicantSource: profile.source,
      applicantResumeUrl: profile.resumeUrl
    };

    try {
      console.log(`Sending profile ${i+1}: ${profile.name}...`);
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        console.log(`✅ Success for ${profile.name}`);
      } else {
        console.log(`❌ Failed for ${profile.name}: ${response.status} ${response.statusText}`);
      }
    } catch (e) {
      console.error(`❌ Error for ${profile.name}:`, e.message);
    }
    
    // Wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

sendProfiles();
