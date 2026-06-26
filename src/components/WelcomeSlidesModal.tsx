import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoIcon } from '../Shared';
import { Bot, FileSearch } from 'lucide-react';

const slides = [
  {
    id: 1,
    useLogo: true,
    title: 'أهلاً بك في منصة فرز',
    description: 'سعداء بانضمامك إلينا. لقد صممنا لك نظام متطور لجعل عملية التوظيف أسرع، أذكى، وأكثر فعالية.'
  },
  {
    id: 2,
    useImage: true,
    imageSrc: '/assets/ai_interview_saudi.png',
    title: 'مقابلات بالذكاء الاصطناعي',
    description: 'وفر وقتك ودع الذكاء الاصطناعي يجري المقابلات الأولية مع المرشحين بدقة واحترافية عالية، ويقدم لك تقييماً شاملاً لكل متقدم.'
  },
  {
    id: 3,
    useImage: true,
    imageSrc: '/assets/cv_screening_saudi_v2.png',
    title: 'فرز تلقائي للسير الذاتية',
    description: 'يقوم النظام بتحليل آلاف السير الذاتية في ثوانٍ لاستخراج الكفاءات المطابقة لمتطلباتك وتصفية الغير مؤهلين تلقائياً.'
  }
];

export const WelcomeSlidesModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const isLast = currentStep === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden max-w-[480px] w-full shadow-2xl relative border border-white/20 dark:border-slate-700/50"
      >
        <div className="w-full relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 overflow-hidden flex flex-col items-center pt-8 min-h-[260px] justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full flex items-center justify-center px-8"
            >
              {slides[currentStep].useLogo ? (
                <div className="scale-[4] origin-center drop-shadow-2xl text-primary my-12">
                  <LogoIcon />
                </div>
              ) : slides[currentStep].useImage ? (
                <div className="my-6 flex items-center justify-center">
                   <img src={slides[currentStep].imageSrc} alt="" className="w-44 h-44 object-cover rounded-3xl shadow-2xl border-[4px] border-white/50 dark:border-slate-700/50" />
                </div>
              ) : slides[currentStep].useIcon ? (
                <div className="my-10 flex items-center justify-center">
                   {slides[currentStep].icon}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-8 text-center bg-white dark:bg-slate-800 relative z-10">
          <div className="flex justify-center gap-2 mb-6" dir="ltr">
            {slides.map((_, idx) => (
               <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-8 bg-primary' : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-2xl font-black text-navy dark:text-white mb-3 tracking-tight">
                {slides[currentStep].title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed font-medium">
                {slides[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex gap-3">
            <button
              onClick={nextStep}
              className="flex-1 py-4 flex items-center justify-center gap-2 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] bg-primary text-white hover:bg-teal-600 shadow-primary/25"
            >
              {isLast ? 'ابدأ الآن' : 'التالي'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
