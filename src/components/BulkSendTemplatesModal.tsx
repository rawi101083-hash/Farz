import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { X, Send, CheckCircle2, MessageCircle, Mail, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import QuestionTemplatesManager from './QuestionTemplatesManager';

interface QuestionTemplate {
  id: string;
  title: string;
  questions: string[];
}

interface Applicant {
  id: string;
  full_name?: string;
  name?: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  suggested_questions?: string[];
  interview_sent?: boolean;
}

interface Props {
  applicants: Applicant[];
  onClose: () => void;
  onUpdateStatus?: () => void;
}

export default function BulkSendTemplatesModal({ applicants, onClose, onUpdateStatus }: Props) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [useAI, setUseAI] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<QuestionTemplate | null>(null);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [templates, setTemplates] = useState<QuestionTemplate[]>([]);
  const [sentStatus, setSentStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTemplates();
  }, [showTemplateManager]); // Refetch when manager closes just in case

  const fetchTemplates = async () => {
    const { data } = await supabase.from('question_templates').select('*').order('created_at', { ascending: false });
    if (data) setTemplates(data);
  };

  const handleSendToApplicant = async (app: Applicant, method: 'whatsapp' | 'email') => {
    if (!useAI && !selectedTemplate) return;

    let questionsToSend = [];
    if (useAI) {
      questionsToSend = app.suggested_questions || [];
    } else {
      questionsToSend = selectedTemplate?.questions || [];
    }

    // Save to DB
    await supabase
      .from('applicants')
      .update({
        client_interview_questions: questionsToSend,
        interview_sent: true,
        interview_sent_at: new Date().toISOString(),
        interview_revoked: false,
        decision: 'interview'
      })
      .eq('id', app.id);

    // Update local status so it shows a checkmark
    setSentStatus(prev => ({ ...prev, [app.id]: true }));
    if (onUpdateStatus) onUpdateStatus();

    const link = `${window.location.origin}/interview/${app.id}`;
    const actualName = (app.name || app.full_name)?.split(' ')[0] || 'عزيزي المتقدم';
    const text = `مرحباً ${actualName}، ندعوك لإجراء مقابلة الذكاء الاصطناعي الفورية عبر الرابط التالي:\n${link}`;
    
    if (method === 'whatsapp') {
      window.open(`https://wa.me/${app.phone}?text=${encodeURIComponent(text)}`, "_blank");
    } else {
      const subject = `دعوة لإجراء مقابلة الذكاء الاصطناعي`;
      window.open(`mailto:${app.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`, "_blank");
    }
  };

  if (showTemplateManager) {
    return (
      <QuestionTemplatesManager 
        mode="select" 
        onClose={() => setShowTemplateManager(false)} 
        onSelectTemplate={(t) => {
          setSelectedTemplate(t);
          setShowTemplateManager(false);
          setStep(2);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border-[3px] border-b-[8px] border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-black text-navy dark:text-white">
            إعداد مقابلة الذكاء الاصطناعي
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {step === 0 && (
            <div className="space-y-6">
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                لقد قمت بتحديد {applicants.length} متقدم. كيف تود إعداد أسئلة المقابلة لهم؟
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  onClick={() => {
                    setUseAI(true);
                    setStep(2);
                  }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl border-[2px] border-b-[4px] border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 active:translate-y-[2px] active:border-b-[2px] transition-all group shadow-sm"
                >
                  <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="font-bold text-navy dark:text-white text-lg mb-2">أسئلة الذكاء الاصطناعي</h3>
                  <p className="text-sm text-slate-500">
                    إرسال الأسئلة المخصصة التي استخرجها النظام من السيرة الذاتية لكل متقدم بشكل منفصل.
                  </p>
                </button>

                <button
                  onClick={() => {
                    setUseAI(false);
                    setStep(1);
                  }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl border-[2px] border-b-[4px] border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 active:translate-y-[2px] active:border-b-[2px] transition-all group shadow-sm"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MessageCircle size={32} />
                  </div>
                  <h3 className="font-bold text-navy dark:text-white text-lg mb-2">اختيار قالب جاهز</h3>
                  <p className="text-sm text-slate-500">
                    إرسال نفس الأسئلة لجميع المتقدمين المحددين من القوالب المحفوظة مسبقاً.
                  </p>
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                لقد قمت بتحديد {applicants.length} متقدم. يرجى اختيار قالب الأسئلة الذي ترغب في إرساله لهم:
              </p>

              <div className="grid gap-3">
                {templates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplate(t);
                      setStep(2);
                    }}
                    className="w-full text-right p-4 rounded-xl border-[2px] border-b-[4px] border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-primary/5 active:translate-y-[2px] active:border-b-[2px] active:mb-[2px] transition-all flex justify-between items-center group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <MessageCircle size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-navy dark:text-white">{t.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{t.questions.length} أسئلة</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        اختيار القالب
                      </span>
                    </div>
                  </button>
                ))}

                <button
                  onClick={() => setShowTemplateManager(true)}
                  className="w-full mt-4 p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary text-slate-500 hover:text-primary font-bold transition-all text-center"
                >
                  + إدارة / إضافة قوالب جديدة
                </button>
              </div>
            </div>
          )}

          {step === 2 && (useAI || selectedTemplate) && (
            <div className="space-y-6">
              {useAI ? (
                <div className="bg-teal-50 dark:bg-teal-900/20 border-[2px] border-b-[4px] border-teal-200 dark:border-teal-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-bold mb-1">مصدر الأسئلة</p>
                    <p className="font-bold text-navy dark:text-white flex items-center gap-2">
                      <Sparkles size={16} className="text-teal-600 dark:text-teal-400" />
                      أسئلة الذكاء الاصطناعي المخصصة لكل سيرة
                    </p>
                  </div>
                  <button onClick={() => setStep(0)} className="text-xs text-teal-600 hover:text-teal-800 underline font-bold transition-colors">تغيير الاختيار</button>
                </div>
              ) : selectedTemplate ? (
                <div className="bg-white dark:bg-slate-800 border-[2px] border-b-[4px] border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">القالب المختار</p>
                    <p className="font-bold text-navy dark:text-white flex items-center gap-2">
                      <MessageCircle size={16} className="text-primary" />
                      {selectedTemplate.title}
                    </p>
                  </div>
                  <button onClick={() => setStep(0)} className="text-xs text-primary hover:text-primary-dark underline font-bold transition-colors">تغيير الاختيار</button>
                </div>
              ) : null}

              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اضغط إرسال بجوار كل متقدم (سيفتح واتساب تلقائياً):</p>
                {applicants.map(app => {
                  const isSent = sentStatus[app.id];
                  const actualName = (app.name || app.full_name)?.trim() || 'متقدم غير معروف';
                  const displayPhone = app.phone.startsWith('5') ? '0' + app.phone : app.phone;
                  return (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-xl border-[2px] border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-200 border-[2px] border-slate-100 border-b-[4px] border-b-slate-200 dark:border-slate-600 dark:border-b-slate-900 shadow-sm overflow-hidden text-lg">
                          {app.photoUrl ? (
                            <img src={app.photoUrl} alt={actualName} className="w-full h-full object-cover" />
                          ) : (
                            actualName.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-navy dark:text-white text-sm">{actualName}</p>
                          <p className="text-xs text-slate-500 font-medium text-right w-full block" dir="ltr">{displayPhone}</p>
                        </div>
                      </div>
                      
                      {isSent ? (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-200">
                          <CheckCircle2 size={16} /> تم التوجيه
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSendToApplicant(app, 'whatsapp')}
                            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_4px_10px_rgba(37,211,102,0.3)] border-b-[4px] border-[#1da851] active:translate-y-[2px] active:border-b-[0px] active:mb-[4px] hover:-translate-y-0.5"
                            title="إرسال عبر واتساب"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleSendToApplicant(app, 'email')}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_4px_10px_rgba(37,99,235,0.3)] border-b-[4px] border-blue-800 active:translate-y-[2px] active:border-b-[0px] active:mb-[4px] hover:-translate-y-0.5"
                            title="إرسال عبر الإيميل"
                          >
                            <Mail size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
