import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Trash2, Edit2, X, Save, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionTemplate {
  id: string;
  title: string;
  questions: any[];
}

interface Props {
  onClose: () => void;
  onSelectTemplate?: (template: QuestionTemplate) => void;
  mode?: 'manage' | 'select';
}

export let globalTemplatesCache: QuestionTemplate[] | null = null;
let globalTemplatesPromise: Promise<any> | null = null;

export const prefetchQuestionTemplates = async () => {
  if (globalTemplatesPromise) return globalTemplatesPromise;
  
  globalTemplatesPromise = (async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data, error } = await supabase
        .from('question_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        globalTemplatesCache = data;
        return data;
      }
    }
    return [];
  })();
  
  return globalTemplatesPromise;
};

export default function QuestionTemplatesManager({ onClose, onSelectTemplate, mode = 'manage' }: Props) {
  const [templates, setTemplates] = useState<QuestionTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<QuestionTemplate | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newQuestions, setNewQuestions] = useState<any[]>([
    {question: '', goal: ''},
    {question: '', goal: ''},
    {question: '', goal: ''},
    {question: '', goal: ''}
  ]);

  useEffect(() => {
    if (globalTemplatesCache) {
      setTemplates(globalTemplatesCache);
      setIsLoading(false);
      // Background refresh
      fetchTemplates(true);
    } else {
      fetchTemplates();
    }
  }, []);

  const fetchTemplates = async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    
    // Force new fetch if it's a background refresh
    if (isBackground) {
      globalTemplatesPromise = null;
    }
    
    const data = await prefetchQuestionTemplates();
    setTemplates(data);
    
    if (!isBackground) setIsLoading(false);
  };

  const handleSave = async () => {
    if (!newTitle.trim()) {
      alert("الرجاء إدخال اسم القالب");
      return;
    }
    
    const validQuestions = newQuestions.filter(q => q && typeof q === 'string' ? q.trim() !== '' : q.question?.trim() !== '');
    if (validQuestions.length === 0) {
      alert("الرجاء إدخال سؤال واحد على الأقل");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    if (editingTemplate?.id) {
      // Update
      const { error } = await supabase
        .from('question_templates')
        .update({ title: newTitle, questions: validQuestions })
        .eq('id', editingTemplate.id);
      
      if (!error) {
        const updated = templates.map(t => t.id === editingTemplate.id ? { ...t, title: newTitle, questions: validQuestions } : t);
        setTemplates(updated);
        globalTemplatesCache = updated;
        setEditingTemplate(null);
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from('question_templates')
        .insert([{ title: newTitle, questions: validQuestions, company_id: session.user.id }])
        .select();
        
      if (!error && data) {
        const updated = [data[0], ...templates];
        setTemplates(updated);
        globalTemplatesCache = updated;
        setEditingTemplate(null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القالب؟")) return;
    
    const { error } = await supabase
      .from('question_templates')
      .delete()
      .eq('id', id);
      
    if (!error) {
      const updated = templates.filter(t => t.id !== id);
      setTemplates(updated);
      globalTemplatesCache = updated;
    }
  };

  const startEdit = (t: QuestionTemplate) => {
    setEditingTemplate(t);
    setNewTitle(t.title);
    let qs = [...(t.questions || [])].map(q => {
      if (typeof q === 'string') return { question: q, goal: '' };
      return { question: q.question || '', goal: q.goal || '' };
    });
    while (qs.length < 4) qs.push({question: '', goal: ''});
    setNewQuestions(qs.slice(0, 4));
  };

  const startNew = () => {
    setEditingTemplate({ id: '', title: '', questions: [] });
    setNewTitle('');
    setNewQuestions([
      {question: '', goal: ''},
      {question: '', goal: ''},
      {question: '', goal: ''},
      {question: '', goal: ''}
    ]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-black text-navy dark:text-white">
            {mode === 'select' ? "اختر قالب الأسئلة" : "قوالب أسئلة مقابلة AI"}
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {editingTemplate ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم القالب</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-[2px] border-b-[4px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary dark:focus:border-primary focus:border-b-primary dark:focus:border-b-primary outline-none transition-all font-bold"
                  placeholder="مثال: أسئلة المبيعات، مبرمجين، عامة..."
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-800 dark:text-slate-200 mb-4">الأسئلة (بحد أقصى 4)</label>
                {newQuestions.map((qObj, idx) => (
                  <div key={idx} className="relative group p-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                    <div className="absolute left-4 top-4 w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-black z-10">
                      0{idx + 1}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">السؤال</label>
                      <textarea
                        rows={2}
                        value={qObj.question || ''}
                        onChange={(e) => {
                          const qs = [...newQuestions];
                          qs[idx] = { ...qs[idx], question: e.target.value };
                          setNewQuestions(qs);
                        }}
                        className="w-full pl-14 pr-4 py-3.5 rounded-xl border-[2px] border-b-[4px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary dark:focus:border-primary focus:border-b-primary dark:focus:border-b-primary outline-none text-sm transition-all font-medium resize-none shadow-sm"
                        placeholder="اكتب السؤال هنا..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">الهدف من السؤال (يتم تمريره للذكاء الاصطناعي)</label>
                      <input
                        type="text"
                        value={qObj.goal || ''}
                        onChange={(e) => {
                          const qs = [...newQuestions];
                          qs[idx] = { ...qs[idx], goal: e.target.value };
                          setNewQuestions(qs);
                        }}
                        className="w-full px-4 py-3 rounded-xl border-[2px] border-b-[4px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary dark:focus:border-primary focus:border-b-primary dark:focus:border-b-primary outline-none text-sm transition-all font-medium shadow-sm"
                        placeholder="مثال: اختبار القدرة على القيادة"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all border-[2px] border-primary border-b-[4px] border-b-primary/60 hover:brightness-105 active:border-b-[2px] active:translate-y-[2px] active:mb-[2px] shadow-sm"
                >
                  <Save size={18} /> حفظ القالب
                </button>
                <button 
                  onClick={() => setEditingTemplate(null)}
                  className="flex-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 font-bold py-3.5 rounded-xl transition-all border-[2px] border-b-[4px] border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 active:border-b-[2px] active:translate-y-[2px] active:mb-[2px]"
                >
                  إلغاء
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {mode === 'manage' && (
                <button 
                  onClick={startNew}
                  className="w-full border-[2px] border-b-[4px] border-dashed border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 text-slate-500 hover:text-primary rounded-2xl py-6 flex flex-col items-center justify-center gap-2 transition-all font-bold active:translate-y-[2px] active:border-b-[2px]"
                >
                  <Plus size={24} /> إضافة قالب جديد
                </button>
              )}

              {isLoading ? (
                <div className="py-10 text-center text-slate-500">جاري التحميل...</div>
              ) : templates.length === 0 ? (
                <div className="py-10 text-center text-slate-500 font-medium">لا توجد قوالب محفوظة حتى الآن.</div>
              ) : (
                <div className="space-y-3">
                  {templates.map(t => (
                    <div 
                      key={t.id} 
                      className="border-[2px] border-b-[4px] border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800/50 flex items-center justify-between group hover:-translate-y-[2px] hover:border-primary dark:hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => {
                        if (mode === 'select') {
                          onSelectTemplate?.(t);
                        } else {
                          startEdit(t);
                        }
                      }}
                    >
                      <div className={`flex-1`}>
                        <h3 className="font-bold text-navy dark:text-white">{t.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{t.questions.length} أسئلة</p>
                      </div>
                      
                      {mode === 'manage' ? (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); startEdit(t); }} className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 dark:border-primary/30 border-b-[3px] border-b-primary/30 dark:border-b-primary/40 flex items-center justify-center hover:bg-primary/20 active:translate-y-[1px] active:border-b-[1px] active:mb-[2px] transition-all">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }} className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 border-b-[3px] border-b-rose-300 dark:border-b-rose-700 flex items-center justify-center hover:bg-rose-100 active:translate-y-[1px] active:border-b-[1px] active:mb-[2px] transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => onSelectTemplate?.(t)}
                          className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-xs rounded-lg transition-colors"
                        >
                          اختيار
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
