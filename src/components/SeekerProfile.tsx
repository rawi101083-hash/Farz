import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Phone, MapPin, Upload, Briefcase, GraduationCap, CheckCircle, LogOut, ArrowRight, Shield, ArrowUpCircle, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { SAUDI_CITIES } from '../Shared';
import { countriesList } from '../data/countries';
import { MultiSearchableSelect } from './MultiSearchableSelect';

const LogoIcon = () => (
  <div className="logo-icon w-10 h-10 rounded-[12px] bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center relative shadow-[0_8px_16px_rgba(13,148,136,0.3),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.3)] transition-transform shrink-0">
    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-[12px]" />
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="relative z-10 drop-shadow-sm ml-0.5 mt-0.5">
      <path d="M10 6H6V18H10" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
      <circle cx="14" cy="12" r="3" fill="url(#copperGrd)" />
      <defs>
        <radialGradient id="copperGrd" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(14 12) rotate(90) scale(3)">
          <stop stopColor="#FCD34D" />
          <stop offset="1" stopColor="#92400E" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

const MAJORS_LIST = [
  "هندسة برمجيات", "علوم حاسب", "نظم معلومات", "تقنية معلومات", "أمن سيبراني", "الذكاء الاصطناعي",
  "إدارة أعمال", "محاسبة", "مالية", "تسويق", "موارد بشرية", "قانون", 
  "هندسة صناعية", "هندسة مدنية", "هندسة كهربائية", "هندسة ميكانيكية", "هندسة معمارية", 
  "طب عام", "صيدلة", "تمريض", "طب أسنان", "علاج طبيعي",
  "لغة إنجليزية", "لغة عربية", "إعلام واتصال", "أخرى"
];

const QUALIFICATIONS_LIST = [
  "ثانوية عامة", "دبلوم", "بكالوريوس", "ماجستير", "دكتوراه"
];

const LANGUAGES_LIST = [
  "العربية", "الإنجليزية", "الفرنسية", "الإسبانية", "الأوردو", "الهندية", "البنغالية", "الفلبينية", "أخرى"
];

export default function SeekerProfile() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'login' | 'otp' | 'profile'>('login');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [initialProfile, setInitialProfile] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    birth_date: '',
    city: '',
    nationality: '',
    major: [] as string[],
    qualification: [] as string[],
    languages: [] as string[],
    notice_period: '',
    linkedin_url: '',
    portfolio_url: '',
    cv_file_url: '',
    id_file_url: '',
    license_file_url: '',
    personal_photo_url: '',
    video_url: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setStep('profile');
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setStep('profile');
        setMessage({ type: '', text: '' });
        fetchProfile(session.user.id);
      } else {
        setSession(null);
        setStep('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSendOtp = async () => {
    if (!email) return;
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: { 
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/profile`
        }
      });
      
      if (error) throw error;
      
      setStep('otp');
      setMessage({ type: 'success', text: 'تم إرسال كود الدخول إلى بريدك الإلكتروني' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'حدث خطأ أثناء إرسال الكود' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });
      
      if (error) throw error;
      
      if (data.session) {
        setSession(data.session);
        setStep('profile');
        fetchProfile(data.session.user.id);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'الكود غير صحيح أو منتهي الصلاحية' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('job_seekers')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (data && !error) {
        const fetchedProfile = {
          full_name: data.full_name || '',
          phone: data.phone || '',
          cv_file_url: data.cv_file_url || '',
          id_file_url: data.id_file_url || '',
          license_file_url: data.license_file_url || '',
          personal_photo_url: data.profile_data?.personal_photo_url || '',
          video_url: data.profile_data?.video_url || '',
          birth_date: data.profile_data?.birth_date || '',
          city: data.profile_data?.city || '',
          nationality: data.profile_data?.nationality || '',
          major: Array.isArray(data.profile_data?.major) ? data.profile_data.major : (data.profile_data?.major ? [data.profile_data.major] : []),
          qualification: Array.isArray(data.profile_data?.qualification) ? data.profile_data.qualification : (data.profile_data?.qualification ? [data.profile_data.qualification] : []),
          languages: Array.isArray(data.profile_data?.languages) ? data.profile_data.languages : (data.profile_data?.languages ? [data.profile_data.languages] : []),
          notice_period: data.profile_data?.notice_period || '',
          linkedin_url: data.profile_data?.linkedin_url || '',
          portfolio_url: data.profile_data?.portfolio_url || ''
        };
        setProfile(fetchedProfile);
        setInitialProfile(JSON.stringify(fetchedProfile));
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    if (initialProfile && JSON.stringify(profile) !== initialProfile) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [profile, initialProfile]);

  const handleSaveProfile = async () => {
    if (!session) return;
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const profile_data = {
        birth_date: profile.birth_date,
        city: profile.city,
        nationality: profile.nationality,
        major: profile.major,
        qualification: profile.qualification,
        languages: profile.languages,
        notice_period: profile.notice_period,
        linkedin_url: profile.linkedin_url,
        portfolio_url: profile.portfolio_url,
        personal_photo_url: profile.personal_photo_url,
        video_url: profile.video_url
      };

      const { error } = await supabase
        .from('job_seekers')
        .upsert({
          id: session.user.id,
          user_id: session.user.id,
          full_name: profile.full_name,
          email: session.user.email,
          phone: profile.phone,
          cv_file_url: profile.cv_file_url,
          id_file_url: profile.id_file_url,
          license_file_url: profile.license_file_url,
          profile_data: profile_data,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setInitialProfile(JSON.stringify(profile));
      setHasUnsavedChanges(false);
      setMessage({ type: 'success', text: 'تم حفظ بياناتك بنجاح!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'حدث خطأ أثناء الحفظ' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setSession(null);
      setStep('login');
      setEmail('');
      setOtp('');
    }
  };

  const handleFileUpload = async (type: string) => {
    if (!session) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    
    if (type === 'cv') {
      input.accept = '.pdf,.doc,.docx';
    } else {
      input.accept = 'image/jpeg,image/png,image/jpg,.pdf';
    }
    
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsLoading(true);
      setMessage({ type: '', text: '' });

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${type}_${Date.now()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;

        const { data, error } = await supabase.storage
          .from('cv_uploads')
          .upload(filePath, file);

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from('cv_uploads')
          .getPublicUrl(data.path);

        const url = publicUrlData.publicUrl;

        setProfile(prev => {
          const updated = { ...prev };
          if (type === 'cv') updated.cv_file_url = url;
          if (type === 'photo') updated.personal_photo_url = url;
          if (type === 'id') updated.id_file_url = url;
          if (type === 'license') updated.license_file_url = url;
          return updated;
        });
        
        setMessage({ type: 'success', text: 'تم رفع المرفق بنجاح.' });
      } catch (error: any) {
        console.error('Upload error:', error);
        setMessage({ type: 'error', text: 'حدث خطأ أثناء رفع الملف' });
      } finally {
        setIsLoading(false);
      }
    };
    
    input.click();
  };

  if (step === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8" dir="rtl">
        <div className="max-w-4xl w-full bg-white rounded-[32px] shadow-xl border border-slate-100 relative overflow-hidden flex flex-col md:flex-row">
          
          <button 
            onClick={() => window.history.length > 2 ? window.history.back() : window.location.href = '/'}
            className="absolute top-6 right-6 z-20 w-8 h-8 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full flex items-center justify-center transition-all border border-slate-100 shadow-sm"
            title="العودة"
          >
            <ArrowRight size={16} />
          </button>

          <div className="w-full md:w-1/2 p-8 md:p-12 border-b md:border-b-0 md:border-l border-slate-100 bg-slate-50/50 flex flex-col justify-center">
            <div className="mb-8 pt-6">
              <div className="mb-6 transform scale-125 origin-right">
                <LogoIcon />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 leading-relaxed">
                أنشئ ملفك المهني الموحد مرة واحدة، واختصر طريقك نحو أفضل الفرص الوظيفية
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm text-teal-700 flex items-center justify-center shrink-0">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="pt-1">
                  <h4 className="font-bold text-slate-800 mb-1 text-lg">تقديم بنقرة واحدة</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">قدم على الوظائف الشاغرة فوراً دون تعبئة بياناتك مجدداً.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm text-teal-700 flex items-center justify-center shrink-0">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div className="pt-1">
                  <h4 className="font-bold text-slate-800 mb-1 text-lg">خصوصية وأمان</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">بياناتك وسيرتك الذاتية مشفرة بأعلى معايير الأمان.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col bg-white">
            <div className="flex-1 flex flex-col pt-12 md:pt-16">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {authMode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                </h2>
                <p className="text-slate-500 font-medium text-sm">
                  {authMode === 'login' 
                    ? 'مرحباً بك مجدداً في بوابة المتقدمين' 
                    : 'أدخل بريدك الإلكتروني للبدء وتوثيق حسابك'}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2 mr-1">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      className="block w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-teal-800/20 focus:border-teal-800 transition-all outline-none text-left"
                      dir="ltr"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {message.text && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl text-sm font-bold flex items-start gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                    {message.text}
                  </motion.div>
                )}

                <button
                  onClick={handleSendOtp}
                  disabled={isLoading || !email}
                  className="w-full flex items-center justify-center py-3.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-base shadow-lg shadow-teal-700/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    authMode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2">
              <span className="text-slate-500 text-sm font-medium">
                {authMode === 'login' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
              </span>
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-teal-700 font-bold text-sm hover:text-teal-900 transition-colors"
              >
                {authMode === 'login' ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 dir-rtl" dir="rtl">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
            <button onClick={() => setStep('login')} className="flex items-center text-sm text-gray-500 hover:text-teal-700 mb-6 transition-colors">
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة
            </button>
            
            <h2 className="text-2xl font-bold text-center mb-2">أدخل كود التحقق</h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              تم إرسال كود مكون من 6 أرقام إلى<br />
              <strong className="text-gray-800">{email}</strong>
            </p>

            <div className="space-y-6">
              <input
                type="text"
                className="focus:ring-teal-700 focus:border-teal-700 block w-full sm:text-lg border-gray-300 rounded-md p-4 border text-center tracking-[1em]"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />

              {message.text && (
                <div className={`p-3 rounded-md text-sm ${message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                  {message.text}
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 focus:outline-none disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'جاري التحقق...' : 'تأكيد الدخول'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 dir-rtl" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="bg-[#0F766E] px-6 py-8 sm:px-8 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur">
                <LogoIcon />
              </div>
              <div>
                <h1 className="text-2xl font-bold">الملف الشخصي - منصة فرز</h1>
                <p className="text-white/90 mt-1 text-sm font-medium">أكمل بياناتك مرة واحدة فقط، لتتمكن من التقديم على أي وظيفة بضغطة زر ⚡️</p>
              </div>
            </div>
            <button onClick={handleLogout} className="group relative overflow-hidden bg-white/10 hover:bg-red-500 text-white px-6 py-2.5 rounded-full border border-white/20 backdrop-blur-md flex items-center font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-red-500/30 hover:border-red-400">
              <LogOut className="w-5 h-5 ml-2 transition-transform group-hover:-translate-x-1" />
              تسجيل الخروج
            </button>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* القسم الأساسي */}
            <div>
              <h3 className="text-xl font-bold leading-6 text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 text-teal-700 ml-2" />
                المعلومات الشخصية
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 mr-1">الاسم الثلاثي</label>
                  <input type="text" className="mt-2 block w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-700/10 focus:border-teal-700 outline-none transition-all font-medium sm:text-base"
                    value={profile.full_name} onChange={(e) => setProfile({...profile, full_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 mr-1">رقم الجوال</label>
                  <div className="mt-2 flex items-center bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-4 focus-within:ring-teal-700/10 focus-within:border-teal-700 transition-all overflow-hidden" dir="ltr">
                    <div className="flex items-center justify-center bg-slate-100 px-4 py-4 border-r border-slate-200 gap-2 shrink-0">
                      <span className="text-xl">🇸🇦</span>
                      <span className="font-bold text-slate-700">+966</span>
                    </div>
                    <input type="tel" className="block w-full px-4 py-4 bg-transparent outline-none font-medium sm:text-base tracking-widest text-gray-900"
                      placeholder="5XXXXXXXX" maxLength={10}
                      value={profile.phone.replace(/\D/g, '').startsWith('966') ? profile.phone.replace(/\D/g, '').substring(3) : profile.phone.replace(/\D/g, '')} 
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.startsWith('0') && val.length > 10) val = val.slice(0, 10);
                        if (!val.startsWith('0') && val.length > 9) val = val.slice(0, 9);
                        setProfile({...profile, phone: val ? `+966${val}` : ''});
                      }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 mr-1">المدينة</label>
                  <div className="relative">
                    <select className="mt-2 block w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-700/10 focus:border-teal-700 outline-none transition-all font-medium sm:text-base appearance-none"
                      value={profile.city} onChange={(e) => setProfile({...profile, city: e.target.value})}>
                      <option value="" disabled>اختر المدينة</option>
                      {SAUDI_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none mt-2">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 mr-1">الجنسية</label>
                  <div className="relative">
                    <select className="mt-2 block w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-700/10 focus:border-teal-700 outline-none transition-all font-medium sm:text-base appearance-none"
                      value={profile.nationality} onChange={(e) => setProfile({...profile, nationality: e.target.value})}>
                      <option value="" disabled>اختر الجنسية</option>
                      {countriesList.map(country => <option key={country} value={country}>{country}</option>)}
                    </select>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none mt-2">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 mr-1">تاريخ الميلاد</label>
                  <input type="date" lang="en" dir="ltr" className="mt-2 block w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-700/10 focus:border-teal-700 outline-none transition-all font-medium sm:text-base text-right"
                    value={profile.birth_date} onChange={(e) => setProfile({...profile, birth_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 mr-1">اللغات</label>
                  <MultiSearchableSelect
                    options={LANGUAGES_LIST}
                    value={profile.languages}
                    onChange={(val) => setProfile({...profile, languages: Array.isArray(val) ? val : [val]})}
                    multiple={true}
                    allowCustom={true}
                    placeholder="ابحث أو اختر اللغات..."
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold leading-6 text-gray-900 mb-6 flex items-center">
                <Briefcase className="w-5 h-5 text-teal-700 ml-2" />
                المعلومات المهنية
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 mr-1">المؤهل التعليمي</label>
                  <div className="relative">
                    <select className="mt-2 block w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-700/10 focus:border-teal-700 outline-none transition-all font-medium sm:text-base appearance-none"
                      value={profile.qualification[0] || ''} onChange={(e) => setProfile({...profile, qualification: [e.target.value]})}>
                      <option value="" disabled>اختر المؤهل التعليمي</option>
                      {QUALIFICATIONS_LIST.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none mt-2">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 mr-1">التخصص الجامعي</label>
                  <MultiSearchableSelect
                    options={MAJORS_LIST}
                    value={profile.major[0] || ""}
                    onChange={(val) => setProfile({...profile, major: Array.isArray(val) ? val : [val]})}
                    multiple={false}
                    allowCustom={true}
                    placeholder="ابحث أو اكتب التخصص..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 mr-1">فترة الانضمام</label>
                  <div className="relative">
                    <select className="mt-2 block w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-700/10 focus:border-teal-700 outline-none transition-all font-medium sm:text-base appearance-none"
                      value={profile.notice_period} onChange={(e) => setProfile({...profile, notice_period: e.target.value})}>
                      <option value="" disabled>اختر المدة</option>
                      {["فوري", "أسبوع", "أسبوعين", "شهر", "أكثر من شهر"].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none mt-2">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 mr-1">رابط لينكد إن</label>
                  <input type="url" dir="ltr" className="mt-2 block w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-700/10 focus:border-teal-700 outline-none transition-all font-medium sm:text-base"
                    value={profile.linkedin_url} onChange={(e) => setProfile({...profile, linkedin_url: e.target.value})} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2 mr-1">رابط معرض الأعمال</label>
                  <input type="url" dir="ltr" className="mt-2 block w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-700/10 focus:border-teal-700 outline-none transition-all font-medium sm:text-base"
                    value={profile.portfolio_url} onChange={(e) => setProfile({...profile, portfolio_url: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold leading-6 text-gray-900 mb-6 flex items-center">
                <Upload className="w-5 h-5 text-teal-700 ml-2" />
                المرفقات الرسمية
              </h3>
              <div className="flex flex-wrap gap-6">
                <div onClick={() => handleFileUpload('cv')} className="flex-1 min-w-[200px] border-2 border-dashed border-gray-300 p-8 rounded-2xl flex flex-col items-center justify-center hover:bg-gray-50 hover:border-teal-500 transition-all group relative cursor-pointer">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-50 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  </div>
                  <span className="font-bold text-gray-700 mb-1 group-hover:text-teal-700 transition-colors">السيرة الذاتية</span>
                  {profile.cv_file_url ? (
                    <a href={profile.cv_file_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs text-teal-600 hover:text-teal-800 underline font-bold mt-1 z-10 relative bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 hover:bg-teal-100 transition-colors">عرض الملف الحالي</a>
                  ) : (
                    <span className="text-xs text-gray-400">PDF, DOCX</span>
                  )}
                  {profile.cv_file_url && <span className="absolute top-4 left-4 text-green-500"><CheckCircle size={20}/></span>}
                </div>
                <div onClick={() => handleFileUpload('photo')} className="flex-1 min-w-[200px] border-2 border-dashed border-gray-300 p-8 rounded-2xl flex flex-col items-center justify-center hover:bg-gray-50 hover:border-teal-500 transition-all group relative cursor-pointer">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-50 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  </div>
                  <span className="font-bold text-gray-700 mb-1 group-hover:text-teal-700 transition-colors">صورة شخصية</span>
                  {profile.personal_photo_url ? (
                    <a href={profile.personal_photo_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs text-teal-600 hover:text-teal-800 underline font-bold mt-1 z-10 relative bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 hover:bg-teal-100 transition-colors">عرض الصورة</a>
                  ) : (
                    <span className="text-xs text-gray-400">JPG, PNG</span>
                  )}
                  {profile.personal_photo_url && <span className="absolute top-4 left-4 text-green-500"><CheckCircle size={20}/></span>}
                </div>
                <div onClick={() => handleFileUpload('id')} className="flex-1 min-w-[200px] border-2 border-dashed border-gray-300 p-8 rounded-2xl flex flex-col items-center justify-center hover:bg-gray-50 hover:border-teal-500 transition-all group relative cursor-pointer">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-50 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  </div>
                  <span className="font-bold text-gray-700 mb-1 group-hover:text-teal-700 transition-colors">صورة الهوية</span>
                  {profile.id_file_url ? (
                    <a href={profile.id_file_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs text-teal-600 hover:text-teal-800 underline font-bold mt-1 z-10 relative bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 hover:bg-teal-100 transition-colors">عرض الملف</a>
                  ) : (
                    <span className="text-xs text-gray-400">JPG, PNG, PDF</span>
                  )}
                  {profile.id_file_url && <span className="absolute top-4 left-4 text-green-500"><CheckCircle size={20}/></span>}
                </div>
                <div onClick={() => handleFileUpload('license')} className="flex-1 min-w-[200px] border-2 border-dashed border-gray-300 p-8 rounded-2xl flex flex-col items-center justify-center hover:bg-gray-50 hover:border-teal-500 transition-all group relative cursor-pointer">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-50 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  </div>
                  <span className="font-bold text-gray-700 mb-1 group-hover:text-teal-700 transition-colors">رخصة القيادة</span>
                  {profile.license_file_url ? (
                    <a href={profile.license_file_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs text-teal-600 hover:text-teal-800 underline font-bold mt-1 z-10 relative bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 hover:bg-teal-100 transition-colors">عرض الملف</a>
                  ) : (
                    <span className="text-xs text-gray-400">JPG, PNG, PDF</span>
                  )}
                  {profile.license_file_url && <span className="absolute top-4 left-4 text-green-500"><CheckCircle size={20}/></span>}
                </div>
              </div>
            </div>

            {hasUnsavedChanges && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 flex items-start gap-3">
                <span className="text-xl">💡</span>
                <p className="font-medium text-sm leading-relaxed pt-0.5">
                  لديك تعديلات غير محفوظة. لا تنسى الضغط على <span className="font-bold">"حفظ التغييرات"</span> بالأسفل لاعتمادها.
                </p>
              </div>
            )}

            {message.text && !(hasUnsavedChanges && message.text === 'تم حفظ بياناتك بنجاح!') && (
              <div className={`p-4 rounded-xl mb-6 font-bold ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {message.text}
              </div>
            )}

            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex justify-center py-3 px-10 border border-transparent shadow-sm text-lg font-bold rounded-xl text-white bg-teal-700 hover:bg-teal-800 focus:outline-none disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
