import React, { useState } from "react";
import {
  PieChart as PieChartIcon,
  LayoutDashboard,
  Briefcase,
  Users,
  CreditCard,
  Settings,
  Search,
  CheckCircle,
  Clock,
  MoreVertical,
  LogOut,
  Bell,
  TrendingUp,
  Ban,
  Shield,
  Zap,
} from "lucide-react";
import { LogoIcon } from '../Shared';
import { getVoiceInterviewFeatureEnabled, setVoiceInterviewFeatureEnabled } from '../config';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("إدارة الشركات");
  const [isVoiceFeatureEnabled, setIsVoiceFeatureEnabled] = useState(getVoiceInterviewFeatureEnabled());

  const handleToggleVoiceFeature = () => {
    const newVal = !isVoiceFeatureEnabled;
    setIsVoiceFeatureEnabled(newVal);
    setVoiceInterviewFeatureEnabled(newVal);
  };
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Sidebar - Dark Mode */}{" "}
      <aside className="w-72 bg-[#0F172A] text-white p-6 hidden lg:flex flex-col fixed h-full right-0 z-30 shadow-2xl">
        <div className="flex items-center gap-3 mb-12 px-2">
          <LogoIcon />{" "}
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">
              لوحة التحكم العليا
            </span>{" "}
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">
              Super Admin
            </span>{" "}
          </div>{" "}
        </div>{" "}
        <nav className="space-y-2 flex-1">
          {[
            { name: "نظرة عامة", icon: <LayoutDashboard size={20} /> },
            { name: "إدارة الشركات", icon: <Briefcase size={20} /> },
            { name: "الاشتراكات والفواتير", icon: <CreditCard size={20} /> },
            { name: "الإعدادات العامة", icon: <Settings size={20} /> },
            { name: "قاموس المهارات", icon: <FileText size={20} /> },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-semibold text-sm ${activeTab === item.name ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
            >
              {item.icon} <span>{item.name}</span>{" "}
            </button>
          ))}{" "}
        </nav>{" "}
        <div className="mt-auto pt-6 border-t border-white dark:border-slate-700/10">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/5 rounded-xl transition-all font-bold text-sm">
            <LogOut size={20} /> <span>خروج الآمن</span>{" "}
          </button>{" "}
        </div>{" "}
      </aside>{" "}
      {/* Main Content */}{" "}
      <main className="flex-1 lg:mr-72 p-8 pt-20 lg:pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {activeTab === "إدارة الشركات" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-navy dark:text-white mb-2">
                إدارة الشركات المشتركة
              </h1>{" "}
              <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
                مرحباً بك في لوحة تحكم النظام. يمكنك إدارة كافة الشركات
                والاشتراكات من هنا.
              </p>{" "}
            </div>{" "}
            <div className="flex gap-3">
              <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 dark:bg-slate-800/50 transition-all shadow-sm flex items-center gap-2">
                <Database size={18} /> قاعدة البيانات{" "}
              </button>{" "}
              <button className="bg-navy text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary transition-all shadow-lg flex items-center gap-2">
                <Zap size={18} /> تحديث النظام{" "}
              </button>{" "}
            </div>{" "}
          </header>{" "}
          {/* Companies Table */}{" "}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50/30">
              <div className="flex items-center gap-4">
                <h3 className="font-bold text-navy dark:text-white">
                  الشركات المسجلة
                </h3>{" "}
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 px-3 py-1 rounded-full text-[10px] font-bold">
                  128 شركة
                </span>{" "}
              </div>{" "}
              <div className="flex gap-2">
                  <input
                  type="text"
                  placeholder="بحث عن شركة..."
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-60 font-medium dark:text-white dark:placeholder-slate-400"
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-200 text-[11px] uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-bold">اسم الشركة</th>{" "}
                    <th className="px-6 py-4 font-bold">الوظائف النشطة</th>{" "}
                    <th className="px-6 py-4 font-bold">
                      السير الذاتية المعالجة
                    </th>{" "}
                    <th className="px-6 py-4 font-bold">حالة الاشتراك</th>{" "}
                    <th className="px-6 py-4 font-bold">الإجراءات</th>{" "}
                  </tr>{" "}
                </thead>{" "}
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {[
                    {
                      name: "شركة سحاب",
                      jobs: 3,
                      cvs: 150,
                      status: "فترة تجريبية",
                      color: "orange",
                    },
                    {
                      name: "مؤسسة الحلول الذكية",
                      jobs: 12,
                      cvs: 1240,
                      status: "نشط",
                      color: "teal",
                    },
                    {
                      name: "تقنية الغد",
                      jobs: 0,
                      cvs: 45,
                      status: "منتهي",
                      color: "red",
                    },
                    {
                      name: "مجموعة الرواد",
                      jobs: 8,
                      cvs: 890,
                      status: "نشط",
                      color: "teal",
                    },
                  ].map((company, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:bg-slate-800/50 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 text-sm">
                            {company.name.charAt(0)}{" "}
                          </div>{" "}
                          <span className="font-bold text-navy dark:text-white text-sm">
                            {company.name}
                          </span>{" "}
                        </div>{" "}
                      </td>{" "}
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-navy dark:text-white">
                          {company.jobs}
                        </span>{" "}
                      </td>{" "}
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-navy dark:text-white">
                          {company.cvs.toLocaleString()}
                        </span>{" "}
                      </td>{" "}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${company.color === "teal" ? "bg-teal-50 text-teal-700" : company.color === "orange" ? "bg-orange-50 text-orange-700" : "bg-red-50 text-red-700"}`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${company.color === "teal" ? "bg-teal-500" : company.color === "orange" ? "bg-orange-500" : "bg-red-500"}`}
                          />{" "}
                          {company.status}{" "}
                        </span>{" "}
                      </td>{" "}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-primary hover:text-white transition-all">
                            <Calendar size={14} /> التحكم بأيام الفترة
                            التجريبية{" "}
                          </button>{" "}
                          <button className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-red-600 hover:text-white transition-all">
                            <Ban size={14} /> إيقاف الحساب{" "}
                          </button>{" "}
                          <button className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-navy dark:text-white transition-colors">
                            <MoreVertical size={16} />{" "}
                          </button>{" "}
                        </div>{" "}
                      </td>{" "}
                    </tr>
                  ))}{" "}
                </tbody>{" "}
              </table>{" "}
            </div>{" "}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50/30 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                عرض 1-4 من أصل 128 شركة
              </span>{" "}
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-400 dark:text-slate-500 hover:bg-white dark:bg-slate-800 transition-all">
                  السابق
                </button>{" "}
                <button className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-navy dark:text-white shadow-sm">
                  1
                </button>{" "}
                <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-400 dark:text-slate-500 hover:bg-white dark:bg-slate-800 transition-all">
                  2
                </button>{" "}
                <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-400 dark:text-slate-500 hover:bg-white dark:bg-slate-800 transition-all">
                  التالي
                </button>{" "}
              </div>{" "}
            </div>{" "}
              </div>
            </div>
          )}

          {activeTab === "قاموس المهارات" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-6">
                <h1 className="text-3xl font-bold mb-2 text-navy dark:text-white flex items-center gap-3">
                  <FileText className="text-primary" /> قاموس المهارات (الذكاء الاصطناعي)
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  للاطلاع والمراجعة فقط. هذا هو الدليل الآلي المستخدم لمطابقة الأدوار واقتراح المهارات على الشركات بشكل تلقائي وقت كتابة الوظيفة.
                </p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(skillsDictionary).map(([jobTitle, skills]) => (
                  <div key={jobTitle} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-navy dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">{jobTitle}</h3>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {skills.map((skill, idx) => (
                        <span key={idx} className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light px-3 py-1.5 rounded-lg text-xs font-bold border border-primary/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "الإعدادات العامة" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-6">
                <h1 className="text-3xl font-bold mb-2 text-navy dark:text-white flex items-center gap-3">
                  <Settings className="text-primary" /> الإعدادات العامة للمنصة
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  التحكم في الميزات العامة للمنصة وتفعيل أو إيقاف الخصائص الرئيسية (Feature Flags).
                </p>
              </header>
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy dark:text-white mb-1">المقابلة الصوتية بالذكاء الاصطناعي</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
                      تفعيل أو إيقاف ميزة المقابلات الصوتية في كامل المنصة. عند الإيقاف، ستختفي إعداداتها من شاشة إنشاء الوظائف وسيتخطى المتقدمون هذه الخطوة.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={isVoiceFeatureEnabled} onChange={handleToggleVoiceFeature} />
                    <div className="relative w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.6rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-transform dark:border-slate-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "إدارة الشركات" && activeTab !== "قاموس المهارات" && activeTab !== "الإعدادات العامة" && (
            <div className="flex flex-col items-center justify-center p-20 bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
               <h2 className="text-2xl font-bold text-slate-400 mb-2">قريباً</h2>
               <p className="text-slate-500">هذه الأداة قيد التطوير...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const SuperAdmin = SuperAdminDashboard;
export default SuperAdmin;
