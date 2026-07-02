import json
import sys
import os

sys.path.append(os.path.join(os.getcwd(), 'backend', 'cv_processor_service'))
from services.ai_evaluator import build_job_context

with open('chris_debug.json', 'r', encoding='utf-8') as f:
    job_data = json.load(f)

try:
    prompt = build_job_context(job_data)
    with open('chris_prompt.txt', 'w', encoding='utf-8') as out:
        out.write(prompt)
    print("Done generating prompt for Chris")
except Exception as e:
    print(f"Error: {e}")
