import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('backend/cv_processor_service/.env')

url = os.environ.get('SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_KEY')
supabase = create_client(url, key)

print("=== DATABASE VERIFICATION REPORT ===")

# 1. Check applicants columns
try:
    res = supabase.table('applicants').select('*').limit(1).execute()
    if res.data:
        columns = res.data[0].keys()
        print("1. Column 'is_interview_completed':", "YES" if "is_interview_completed" in columns else "NO")
        print("2. Column 'interview_transcript':", "YES" if "interview_transcript" in columns else "NO")
        print("3. Column 'voice_eval':", "YES" if "voice_eval" in columns else "NO")
        print("4. Column 'interview_questions':", "YES" if "interview_questions" in columns else "NO")
    else:
        print("Table 'applicants' exists but is empty. Could not read columns.")
except Exception as e:
    print("Error reading 'applicants' table:", str(e))

print("-" * 30)

# 2. Check RPC
try:
    # We call it with a fake UUID. If it exists, it returns False. If it doesn't exist, it throws an exception.
    res = supabase.rpc("deduct_interview_credit", {"p_company_id": "00000000-0000-0000-0000-000000000000"}).execute()
    print("5. RPC 'deduct_interview_credit' exists in Database:", "YES")
except Exception as e:
    print("5. RPC 'deduct_interview_credit' exists in Database:", "NO", "Error:", str(e))
