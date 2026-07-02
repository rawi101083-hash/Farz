import json
import sys
import os

sys.path.append(os.path.join(os.getcwd(), 'backend', 'cv_processor_service'))
from services.ai_evaluator import build_job_context

with open('job_debug_new.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)
    if isinstance(jobs, list) and len(jobs) > 0:
        job_data = jobs[0]
    else:
        job_data = jobs

try:
    prompt = build_job_context(job_data)
    with open('shaghala_prompt_fixed.txt', 'w', encoding='utf-8') as out:
        out.write(prompt)
    print("Done")
except Exception as e:
    print(f"Error: {e}")
