const testWebhook = async () => {
    const webhookUrl = "https://circular-struggle-ethical-membership.trycloudflare.com/webhook-test/2489027f-d077-4af4-9d3d-fc0dd9f38953";

    const basePayload = {
      jobTitle: "مهندس برمجيات أول",
      minEducation: "بكالوريوس أمن سيبراني",
      minExperience: "3 سنوات",
      responsibilities: "تطوير وصيانة النظم الأمنية وتقييم الثغرات وتحديث البنى التحتية للمنصة.",
      roleDescription: "نبحث عن مهندس متمرس لحماية البنية التحتية لدينا.",
      textQualifications: "معرفة متقدمة في الاختراق الأخلاقي والشبكات.",
      targetMajors: ["أمن سيبراني", "علوم حاسب", "هندسة برمجيات"],
      targetSkills: ["Python", "Penetration Testing", "AWS Security", "React"],
      requiredLanguages: ["العربية (لغة أم)", "الإنجليزية (متقدم)"],
      applicantTextAnswers: "السؤال: ما هي أصعب مشكلة واجهتها؟\\nالإجابة: اكتشاف ثغرة في خوادم الشركة وسدها خلال ١٢ ساعة.",
      aiCustomPrompts: "ركز على تقييم مستوى الجدية والمشاريع المنفذة."
    };

    const applicants = [
        { name: "خالد المحمد", cv: "خبرة 4 سنوات في أمن المعلومات في القطاع البنكي. أتقن بايثون واستخدام أدوات الاختراق المتقدمة مثل Metasploit. عملت كمدير مشاريع أمنية لعدة تطبيقات." },
        { name: "أحمد العتيبي", cv: "بناء واجهات باستخدام React بخبرة 2 سنة. لغة إنجليزية متوسطة. حاصل على رخصة القيادة. لم أعمل في أمن المعلومات من قبل لكن مهتم." },
        { name: "سارة السليمان", cv: "أخصائية أمن شبكات مع 5 سنوات خبرة في AWS Security وشهادة دبلوم في هندسة الشبكات من جامعة حكومية. ساعدت في تأمين بنية تحتية لعدة شركات." },
        { name: "فيصل الحربي", cv: "متخرج حديث بتقدير ممتاز من كلية علوم الحاسب. مهتم بالذكاء الاصطناعي وبناء الروبوتات. متحدث لبق بالإنجليزية." },
        { name: "نورة يوسف", cv: "خبرة 10 سنوات كمديرة قسم البنية التحتية والأمان (Cybersecurity Manager) في شركة اتصالات. أتقن Penetration Testing، وأحمل شهادات CISSP و CEH." }
    ];

    for (let i = 0; i < applicants.length; i++) {
        const payload = {
            ...basePayload,
            applicant_name: applicants[i].name,
            cv_text: applicants[i].cv
        };
        
        try {
            console.log(\`Sending request \${i + 1} for \${applicants[i].name}...\`);
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            
            console.log(\`Response \${i + 1}: \${response.status} \${response.statusText}\`);
        } catch (err) {
            console.error(\`Error on request \${i + 1}:\`, err.message);
        }
    }
};

testWebhook();
