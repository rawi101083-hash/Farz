import json

def build_job_context(job_data: dict) -> str:
    job_context = "=== تعليمات النظام الصارمة للذكاء الاصطناعي ===\n"
    job_context += "مهمتك هي تقييم هذا المتقدم وإعطائه نسبة مئوية للمطابقة بناءً على سيرته الذاتية. المتقدم اجتاز الفرز الآلي المسبق بنجاح. لذلك يمنع منعاً باتاً استبعاده أو رفضه. "
    job_context += "في حال كانت المعايير الإضافية (مثل المهام أو المهارات) فارغة أو غير محددة من قبل العميل، قم بتقييم المتقدم بناءً على المعايير العالمية وأفضل الممارسات المتعارف عليها مهنياً لهذا المسمى الوظيفي. "
    job_context += "قم بإعطائه تقييماً دقيقاً فقط بناءً على المعايير التالية.\n\n"

    job_context += "=== بيانات الوظيفة الأساسية (للمطابقة والتقييم) ===\n"
    job_title = job_data.get("jobTitle") or job_data.get("title") or "غير محدد"
    min_edu = job_data.get("minEducation") or job_data.get("qualification") or "لا يشترط مؤهل"
    min_exp = job_data.get("minExperience") or job_data.get("experience") or job_data.get("experience_level") or "لا يشترط خبرة"

    job_context += f"- المسمى الوظيفي: {job_title}\n"
    job_context += f"- المؤهل المستهدف: {min_edu}\n"
    job_context += f"- الخبرة المستهدفة: {min_exp}\n\n"

    optional_section = ""
    ai_override = job_data.get("aiOverrideFields") or job_data.get("ai_override_fields")

    responsibilities = ai_override.get("responsibilities") if ai_override is not None else job_data.get("responsibilities")
    if isinstance(responsibilities, str) and responsibilities.strip() != "":
        optional_section += f"- المهام والمسؤوليات:\n{responsibilities}\n\n"
        
    role_description = ai_override.get("roleSummary") if ai_override is not None else (job_data.get("roleDescription") or job_data.get("roleSummary") or job_data.get("description"))
    if isinstance(role_description, str) and role_description.strip() != "":
        optional_section += f"- نبذة عن الدور:\n{role_description}\n\n"
        
    text_qualifications = ai_override.get("qualifications") if ai_override is not None else (job_data.get("textQualifications") or job_data.get("qualifications") or job_data.get("qualifications_details"))
    if isinstance(text_qualifications, str) and text_qualifications.strip() != "":
        optional_section += f"- المؤهلات والمتطلبات الإضافية:\n{text_qualifications}\n\n"
        
    target_majors = ai_override.get("targetMajors") if ai_override is not None else (job_data.get("targetMajors") or job_data.get("target_majors"))
    if isinstance(target_majors, list) and len(target_majors) > 0:
        optional_section += f"- التخصصات المستهدفة: {'، '.join(target_majors)}\n"
        
    target_skills = ai_override.get("targetSkills") if ai_override is not None else (job_data.get("targetSkills") or job_data.get("skills") or job_data.get("target_skills"))
    if isinstance(target_skills, list) and len(target_skills) > 0:
        optional_section += f"- المهارات المستهدفة: {'، '.join(target_skills)}\n"
        
    required_languages = ai_override.get("languages") if ai_override is not None else (job_data.get("requiredLanguages") or job_data.get("languages") or job_data.get("required_languages"))
    if isinstance(required_languages, list) and len(required_languages) > 0:
        optional_section += f"- اللغات المطلوبة: {'، '.join(required_languages)}\n"
        
    ai_instructions = job_data.get("aiCustomPrompts") or job_data.get("aiInstructions") or job_data.get("ai_instructions")
    if isinstance(ai_instructions, str) and ai_instructions.strip() != "":
        optional_section += f"\n🚨 توجيهات إضافية من محرك الفرز (استخدمها لرفع أو خفض نسبة المطابقة وليس للاستبعاد):\n{ai_instructions}\n\n"

    if optional_section != "":
        job_context += "=== معايير التفضيل والمهارات (لرفع أو خفض الدرجة) ===\n" + optional_section

    return job_context


with open('latest_job_full_debug.json', 'r', encoding='utf-8') as f:
    job_data = json.load(f)

with open('output_context.txt', 'w', encoding='utf-8') as out:
    out.write(build_job_context(job_data))
