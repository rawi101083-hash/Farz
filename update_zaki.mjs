import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpcooectdwokmvbgttsf.supabase.co';
const supabaseKey = 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: applicant, error: fetchErr } = await supabase
    .from('applicants')
    .select('id, full_name, job_id')
    .like('full_name', '%زكي%')
    .limit(1)
    .single();

  if (fetchErr || !applicant) {
    console.error("Could not find Zaki Barnawi.");
    return;
  }

  console.log("Found applicant:", applicant.id, applicant.full_name, "Job ID:", applicant.job_id);

  // 1. Update the Job to have knockout questions so they appear in ApplicantDetails
  const jobUpdates = {
    knockoutQuestions: [
      { text: "هل تملك رخصة قيادة سارية؟" },
      { text: "هل أنت مستعد للانتقال لمدينة الرياض؟" }
    ]
  };

  await supabase
    .from('jobs')
    .update(jobUpdates)
    .eq('id', applicant.job_id);
    
  console.log("Updated Job with knockout questions.");

  // 2. Update the Applicant with full dummy data
  const updates = {
    top_percentile: 5,
    ai_justification: "المتقدم يمتلك خبرة ممتازة في إدارة العمليات ومهارات التواصل تتطابق بشكل كبير مع متطلبات الوظيفة. أثبت قدرة عالية على التعامل مع المشاريع المعقدة.",
    red_flags: [
      "تغيير الوظائف 3 مرات خلال السنتين الماضيتين (Job Hopping).",
      "الراتب المتوقع أعلى بنسبة 15% من ميزانية الوظيفة المتاحة."
    ],
    top_strengths: [
      { strength: "خبرة قيادية قوية", evidence: "أدار فريقاً مكوناً من 15 شخصاً وحقق زيادة في المبيعات بنسبة 20%، كما هو مذكور في آخر دور وظيفي له." },
      { strength: "مهارات تواصل ممتازة", evidence: "قدم عروضاً تقديمية أمام الإدارة العليا بانتظام وتولى تدريب الموظفين الجدد." }
    ],
    interview_questions: [
      { question: "لاحظنا تغييرك لوظيفتك 3 مرات خلال السنتين الماضيتين، ما هي الأسباب وراء ذلك؟", reason: "للتحقق من استقرار الموظف وولائه الوظيفي (تغطية فجوة الانتقال السريع)." },
      { question: "بما أنك أدرت فريقاً من 15 شخصاً، اذكر لنا موقفاً كان فيه أداء الفريق سيئاً وكيف تعاملت معه؟", reason: "لتقييم المهارات القيادية الحقيقية والقدرة على إدارة الأزمات." }
    ],
    attachments: [
      { name: "صورة الهوية الوطنية", type: "image", url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop" },
      { name: "شهادة البكالوريوس (PDF)", type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { name: "مقطع فيديو تعريفي قصير", type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
    ],
    custom_answers: [
      // Knockout answers matching the job's knockout questions
      { question: "هل تملك رخصة قيادة سارية؟", answer: "نعم، رخصة قيادة سعودية سارية المفعول.", isKnockout: true },
      { question: "هل أنت مستعد للانتقال لمدينة الرياض؟", answer: "لا، أفضل العمل عن بعد أو في مدينة جدة حالياً.", isKnockout: true },
      // Regular answers
      { question: "لماذا ترغب بالانضمام لشركتنا؟", answer: "أرى أن شركتكم توفر بيئة عمل ممتازة للنمو والتطور المهني، وأعتقد أن مهاراتي تتناسب مع رؤيتكم.", isKnockout: false },
      { question: "ما هو أكبر إنجاز مهني لك؟", answer: "زيادة مبيعات القسم بنسبة 35% خلال الربع الأول من العام الماضي.", isKnockout: false }
    ],
    match_percentage: 88,
    decision: 'interview',
    skills_match: 95,
    experience_match: 85,
    education_match: 100
  };

  const { data, error } = await supabase
    .from('applicants')
    .update(updates)
    .eq('id', applicant.id);

  if (error) {
    console.error("Update failed:", error);
  } else {
    console.log("Successfully updated Zaki Barnawi with full dummy data!");
  }
}

run();
