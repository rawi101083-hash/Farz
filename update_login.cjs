const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace lucide imports
content = content.replace(/import \{([^}]+)\} from 'lucide-react';/, (match, p1) => {
  if (!match.includes('Eye')) {
    return 'import {' + p1 + ', Eye, EyeOff, Building2, User } from \'lucide-react\';';
  }
  return match;
});

const loginStart = content.indexOf('const LoginPage = ({');
const loginEnd = content.indexOf('const LandingPage = ({');

const replacement = `const LoginPage = ({
  onLogin,
  onBack,
  initialMode = "login"
}: {
  onLogin: () => void;
  onBack: () => void;
  initialMode?: "login" | "register";
}) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [entityType, setEntityType] = useState<"company" | "freelance">("company");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setMessage("تم إرسال رابط إعادة تعيين كلمة المرور بنجاح! يرجى مراجعة بريدك الإلكتروني.");
      setIsError(false);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setIsError(true);
      if (err.message === "Failed to fetch") {
        setMessage("تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.");
      } else {
        setMessage(err.message || "حدث خطأ أثناء إرسال الرابط. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (mode === "register" && !name) return;
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              entity_type: entityType
            }
          }
        });
        if (error) throw error;
        setMessage("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
        setMode("login");
        setPassword("");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        onLogin();
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setIsError(true);
      
      let errorMsg = "حدث خطأ أثناء المصادقة. يرجى المحاولة مرة أخرى.";
      if (err.message === "Invalid login credentials") {
        errorMsg = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      } else if (err.message.includes("User already registered")) {
        errorMsg = "عذراً، هذا الحساب مسجل مسبقاً! يرجى الذهاب لصفحة تسجيل الدخول.";
      } else if (err.message.toLowerCase().includes("rate limit")) {
        errorMsg = "تم تجاوز الحد المسموح لرسائل الإيميل من Supabase. يرجى إيقاف خيار (Confirm Email) من إعدادات لوحة تحكم Supabase.";
      } else if (err.message === "Failed to fetch") {
        errorMsg = "تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.";
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900">
      {/* Right Side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-[#129B81] text-white p-12 flex-col justify-center items-center text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="mb-8 flex justify-center">
            <div className="scale-[1.15]">
              <LogoIcon />
            </div>
          </div>
          <h1 className="text-[40px] font-bold mb-5 leading-tight tracking-tight text-white">
            مرحباً بك في بوابة فرز
          </h1>
          <p className="text-[17px] text-white/95 leading-relaxed font-medium text-center max-w-[380px]">
            أدر عمليات التوظيف بفعالية، وفرز آلاف المتقدمين بضغطة زر واحدة.
          </p>
        </motion.div>
      </div>

      {/* Left Side - Form */}
      <div className="md:w-1/2 bg-white dark:bg-slate-800 p-12 flex flex-col justify-center items-center relative overflow-y-auto">
        <button
          onClick={onBack}
          className="absolute top-8 right-8 flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors"
        >
          <ArrowRight size={18} /> العودة للرئيسية
        </button>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md my-auto pt-16 pb-8"
        >
          <div className="mb-10 text-center md:text-right">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">
              {isForgotPassword ? "استعادة كلمة المرور" : mode === "register" ? "إنشاء حساب جديد" : "تسجيل الدخول"}
            </h2>
            {isForgotPassword && (
              <p className="text-slate-500 font-medium mt-2">
                أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
              </p>
            )}
          </div>

          <form onSubmit={isForgotPassword ? handleResetPassword : handleAuth} className="space-y-5">
            {!isForgotPassword && mode === "register" && (
              <>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4">
                  <button
                    type="button"
                    onClick={() => setEntityType("company")}
                    className={\`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all \${entityType === "company" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"}\`}
                  >
                    <Building2 size={18} /> شركة / جهة اعتبارية
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntityType("freelance")}
                    className={\`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all \${entityType === "freelance" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"}\`}
                  >
                    <User size={18} /> فرد / عمل حر
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {entityType === "company" ? "اسم الشركة / الجهة" : "الاسم الكامل"}
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pr-4 pl-12 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                      placeholder={entityType === "company" ? "شركة التقنية المتقدمة" : "أحمد محمد"}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pr-4 pl-12 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                  placeholder={entityType === "company" && mode === "register" ? "name@company.com" : "name@example.com"}
                  dir="ltr"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    كلمة المرور
                  </label>
                  {mode === "login" && (
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">
                      نسيت كلمة المرور؟
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pr-12 pl-12 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className={\`p-4 rounded-xl text-sm font-bold \${isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}\`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || (!isForgotPassword && !password) || (!isForgotPassword && mode === "register" && !name)}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-primary hover:bg-teal-600 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isForgotPassword ? "إرسال رابط الاستعادة" : mode === "register" ? "إنشاء حساب" : "تسجيل الدخول"
              )}
            </button>
            
            {!isForgotPassword && (
              <div className="mt-6 text-center">
                {mode === "login" ? (
                  <button type="button" onClick={() => setMode("register")} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                    ليس لديك حساب؟ إنشاء حساب جديد
                  </button>
                ) : (
                  <button type="button" onClick={() => setMode("login")} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                    لديك حساب بالفعل؟ تسجيل الدخول
                  </button>
                )}
              </div>
            )}

            {isForgotPassword && (
              <button
                type="button"
                onClick={() => { setIsForgotPassword(false); setMessage(""); setIsError(false); }}
                className="w-full py-4 px-6 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all"
              >
                العودة لتسجيل الدخول
              </button>
            )}
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              نظام فرز المتقدم للتوظيف &copy; {new Date().getFullYear()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
`

content = content.substring(0, loginStart) + replacement + content.substring(loginEnd);

fs.writeFileSync('src/App.tsx', content);
