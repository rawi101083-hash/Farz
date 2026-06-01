import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('backend/cv_processor_service/.env')

url = os.environ.get('SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_KEY')
supabase = create_client(url, key)

print("Checking applicants columns...")
res_app = supabase.table('applicants').select('*').limit(1).execute()
if res_app.data:
    print(res_app.data[0].keys())

print("Testing if deduct_voice_credit exists by trying to call it with a dummy uuid...")
try:
    res = supabase.rpc("deduct_voice_credit", {"p_company_id": "00000000-0000-0000-0000-000000000000"}).execute()
    print("deduct_voice_credit EXISTS and returned:", res.data)
except Exception as e:
    print("deduct_voice_credit error:", str(e))

print("Testing if deduct_interview_credit exists...")
try:
    res = supabase.rpc("deduct_interview_credit", {"p_company_id": "00000000-0000-0000-0000-000000000000"}).execute()
    print("deduct_interview_credit EXISTS and returned:", res.data)
except Exception as e:
    print("deduct_interview_credit error:", str(e))
