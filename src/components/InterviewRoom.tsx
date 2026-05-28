import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, PhoneOff, AlertCircle, Play, ShieldCheck, Waves } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { LogoIcon } from '../Shared'; // Assuming LogoIcon is exported from Shared

const VAPI_PUBLIC_KEY = '1325def0-c344-4811-aa65-c3bb5d38ca16';
const ENGLISH_ASSISTANT_ID = '0486ff5b-3ef4-4a40-bb38-4b0ec6dfd400';
const ARABIC_ASSISTANT_ID = '465bda68-de37-4d5c-88c1-37df8164c98f';

export const InterviewRoom = ({ applicantId, onBack }: { applicantId: string, onBack: () => void }) => {
  const [callStatus, setCallStatus] = useState<'idle' | 'loading' | 'active' | 'ended' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(0);

  // Read language from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang') || 'ar';
  
  // Use a ref to store vapi instance so it persists
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);
    const vapi = vapiRef.current;

    vapi.on('call-start', () => {
      setCallStatus('active');
    });

    vapi.on('call-end', () => {
      setCallStatus('ended');
    });

    vapi.on('error', (error: any) => {
      console.error("VAPI ERROR LOG:", error);
      setCallStatus('error');
      // Extract the real error message if available, otherwise fallback
      const errorMsg = error?.message || error?.error?.message || JSON.stringify(error) || 'حدث خطأ أثناء الاتصال. يرجى التأكد من سماحيات المايكروفون والمحاولة مرة أخرى.';
      setErrorMessage(errorMsg);
    });

    vapi.on('volume-level', (level: number) => {
      setVolumeLevel(level);
    });

    return () => {
      vapi.removeAllListeners();
      vapi.stop();
    };
  }, []);

  const startInterview = async () => {
    try {
      setCallStatus('loading');
      const assistantId = lang === 'en' ? ENGLISH_ASSISTANT_ID : ARABIC_ASSISTANT_ID;
      await vapiRef.current.start(assistantId, {
        variableValues: {
          applicantId: applicantId
        }
      });
    } catch (err: any) {
      console.error(err);
      setCallStatus('error');
      setErrorMessage(err?.message || 'حدث خطأ غير متوقع');
    }
  };

  const endInterview = () => {
    vapiRef.current.stop();
    setCallStatus('ended');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="max-w-xl w-full bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-700/50 p-8 lg:p-12 relative z-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <LogoIcon size={32} />
          </div>
        </div>

        <h1 className="text-2xl lg:text-3xl font-black text-navy dark:text-white mb-2">
          المقابلة الصوتية الذكية
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">
          نظام فرز المتقدمين المدعوم بالذكاء الاصطناعي
        </p>

        <AnimatePresence mode="wait">
          {callStatus === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-6 rounded-2xl text-right">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-3">
                  <ShieldCheck size={20} />
                  قبل البدء، يرجى التأكد من:
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-400/80 space-y-2 list-disc list-inside font-medium">
                  <li>الجلوس في مكان هادئ لتجنب الضوضاء</li>
                  <li>السماح للمتصفح باستخدام المايكروفون</li>
                  <li>الرد بصوت واضح على الأسئلة الموجهة لك</li>
                </ul>
              </div>

              <button
                onClick={startInterview}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 text-lg"
              >
                <Play size={20} fill="currentColor" />
                ابدأ المقابلة الآن
              </button>
            </motion.div>
          )}

          {callStatus === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center py-10"
            >
              <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-6" />
              <p className="text-lg font-bold text-navy dark:text-white mb-2">جاري تهيئة الاتصال...</p>
              <p className="text-slate-500 text-sm">يرجى الانتظار والموافقة على صلاحية المايكروفون إذا طُلبت منك</p>
            </motion.div>
          )}

          {callStatus === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center py-6"
            >
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center relative z-10 border-4 border-primary/20">
                  <Mic size={40} className="text-primary animate-pulse" />
                </div>
                {/* Voice visualization placeholder based on volumeLevel */}
                <div 
                  className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 h-2 bg-primary rounded-full transition-all duration-75"
                  style={{ width: `${Math.max(10, volumeLevel * 300)}px`, opacity: Math.max(0.2, volumeLevel) }}
                />
              </div>

              <p className="text-xl font-bold text-navy dark:text-white mb-8">المقابلة جارية الآن...</p>

              <button
                onClick={endInterview}
                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2"
              >
                <PhoneOff size={20} />
                إنهاء المكالمة
              </button>
            </motion.div>
          )}

          {callStatus === 'ended' && (
            <motion.div
              key="ended"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-10"
            >
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-2xl font-bold text-navy dark:text-white mb-2">تمت المقابلة بنجاح</h2>
              <p className="text-slate-500 mb-8">شكراً لوقتك، يمكنك إغلاق هذه الصفحة الآن وسيتم مراجعة تقييمك من قبل فريق التوظيف.</p>
              
            </motion.div>
          )}

          {callStatus === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-10 text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">عذراً، حدثت مشكلة</h2>
              <p className="text-slate-500 mb-8 max-w-sm">{errorMessage}</p>
              
              <button
                onClick={() => { setCallStatus('idle'); setErrorMessage(''); }}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-8 py-3 rounded-2xl font-bold transition-all"
              >
                العودة والمحاولة مجدداً
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
