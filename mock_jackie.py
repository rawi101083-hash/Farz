import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('backend/cv_processor_service/.env')

url = os.environ.get('SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_KEY')
supabase = create_client(url, key)

print("=== MOCKING INTERVIEW FOR JACKIE CHAN ===")

try:
    res = supabase.table('applicants').select('id, full_name').ilike('full_name', '%جاكي شان%').execute()
    if res.data:
        applicant_id = res.data[0]['id']
        
        # Update the database to mock completion
        update_res = supabase.table('applicants').update({
            'is_interview_completed': True,
            'interview_transcript': 'الذكاء الاصطناعي: مرحباً جاكي شان، حدثنا عن خبرتك في الفنون القتالية والبرمجة؟\nجاكي شان: أنا خبير في لغة بايثون ومحترف في الكونغ فو، يمكنني القضاء على البق (Bugs) بضربة واحدة!\nالذكاء الاصطناعي: مذهل! هل يمكنك العمل تحت الضغط؟\nجاكي شان: بالتأكيد، لقد صورت أكثر من 100 فيلم بدون دوبلير.',
            'voice_eval': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            'interview_summary': 'أظهر المتقدم جاكي شان مهارات تواصل ممتازة وثقة عالية بالنفس. يتمتع بخبرة فريدة تدمج بين البرمجة والفنون القتالية، مما يجعله مرشحاً استثنائياً للعمل تحت الضغط وإدارة المشاريع المعقدة.',
            'interview_score': 9
        }).eq('id', applicant_id).execute()
        
        print("Updated applicant:", res.data[0]['full_name'])
        print("Successfully updated DB.")
    else:
        print("Could not find applicant named 'جاكي شان'.")
except Exception as e:
    print("Error:", str(e))
