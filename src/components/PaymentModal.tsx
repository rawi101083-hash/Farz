import React, { useState } from 'react';
import { CreditCard, Lock, ShieldCheck, X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: number;
  onConfirm: (saveCard: boolean) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, planName, price, onConfirm }) => {
  const [saveCard, setSaveCard] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-black text-xl text-navy dark:text-white flex items-center gap-2">
            <CreditCard className="text-primary" /> الدفع الآمن
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">تفاصيل الطلب</p>
              <p className="text-lg font-black text-navy dark:text-white">{planName}</p>
            </div>
            <div className="text-left">
              <p className="text-2xl font-black text-primary">{price} <span className="text-sm">ريال</span></p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-center">
            <Lock className="mx-auto text-slate-400 mb-2" size={32} />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              سيتم دمج واجهة الدفع الخاصة بـ (ميسر / PayTabs) هنا قريباً.
            </p>
          </div>

          <label className="flex items-start gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="relative flex items-center mt-1">
              <input 
                type="checkbox" 
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
              />
            </div>
            <div>
              <p className="font-bold text-navy dark:text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                حفظ البطاقة للمرات القادمة
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                أوافق على حفظ بيانات البطاقة بشكل مشفر (Tokenization) لتسهيل الشراء بضغطة زر وتفعيل التجديد التلقائي.
              </p>
            </div>
          </label>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={() => onConfirm(saveCard)}
            className="w-full py-4 bg-primary hover:bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
          >
            تأكيد الدفع ({price} ريال)
          </button>
        </div>
      </div>
    </div>
  );
};
