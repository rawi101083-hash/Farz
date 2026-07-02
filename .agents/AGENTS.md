# ⚠️ CRITICAL RULES FOR ALL AI AGENTS AND DEVELOPERS ⚠️

**تنبيه صارم جداً من مالك المنصة (Strict Warning from the Platform Owner):**

أيها الذكاء الاصطناعي، أو المبرمج الذي يقرأ هذا الملف، يجب عليك الالتزام الحرفي بالقواعد التالية، وأي مخالفة لها تعتبر تدميراً للمشروع:

### 1. NO DESTRUCTIVE GIT COMMANDS (لا للأوامر التدميرية)
- **ممنوع منعاً باتاً** استخدام أوامر مثل `git reset --hard` أو `git checkout <branch>` أو مسح أي ملفات غير محفوظة (Uncommitted) بدون استئذان صريح وواضح من المستخدم.
- إذا احتجت إلى تغيير الفرع أو التراجع، **يجب عليك أولاً حفظ التعديلات الحالية** عبر `git add .` و `git commit` قبل أي إجراء. لا تضيع تعب المستخدم أبداً.

### 2. SAFE REVERTS ONLY (استرجاع جزئي وآمن فقط)
- إذا طلب منك المستخدم "استرجاع الشكل القديم" أو "التراجع عن التعديل"، **إياك أن تقوم بإرجاع المنصة بالكامل** أو عمل `git reset` للمشروع.
- المطلوب منك هو التراجع **فقط** عن الأسطر أو الملف المحدد الذي قمت أنت بتعديله مؤخراً (مثلاً تغيير زر، أو لون، أو شاشة معينة). لا تقم أبداً بتخريب الأجزاء الأخرى من المنصة.

### 3. EXPLICIT PERMISSION REQUIRED (طلب الإذن إلزامي)
- قبل القيام بأي عملية قد تمسح أو تستبدل أجزاء كبيرة من الكود، اسأل المستخدم أولاً: "هل تسمح لي بتنفيذ هذا الأمر؟" وانتظر موافقته الصريحة.

### 4. THE SNIPER METHOD (طريقة القناص الإلزامية)
- **يمنع منعاً باتاً** استبدال ملفات الـ React الضخمة والمعقدة (مثل `CreateJob.tsx`) دفعة واحدة أو إعادة كتابتها باستخدام سكربتات. هذا يدمر البنية المعقدة ويفقد المتغيرات.
- أي تعديل يجب أن يتم عن طريق **الاستبدال الجزئي الدقيق الموضعي** (Targeted Replace) للسطور المطلوبة فقط.
- **التدقيق الصارم للأقواس:** يجب قراءة وفحص الأسطر المحيطة بالتعديل لتجنب مسح أي أقواس إغلاق مهمة مثل `)}` أو `</div>` والتي تؤدي إلى تعطل الشاشة البيضاء (Error 500).
- **لا لتفتيت الملفات (No Forced Refactoring):** ما لم يطلب المستخدم صراحةً، لا تقم بمحاولة تفكيك وتقسيم المكونات الضخمة المليئة بالمتغيرات (States) لتفادي كسر العمليات الحساسة المرتبطة بقواعد البيانات.

### 5. MANDATORY LINE VERIFICATION (التحقق الإلزامي من الأرقام)
- **ممنوع التعديل بناءً على التخمين:** قبل استخدام أداة القناص (`replace_file_content`)، يجب عليك دائماً وأولاً استخدام أداة `view_file` أو `grep_search` لفتح الملف والتأكد 100٪ من رقم سطر البداية والنهاية الذي تريد استبداله. لا تعتمد أبداً على الذاكرة أو التخمين.

### 6. NO SILENT FIXES (يُمنع الترقيع الصامت)
- إذا ارتكبت خطأً أدى إلى مسح كود أو تعطل النظام، **توقف فوراً** واعترف بالخطأ للمستخدم واشرح له المشكلة بدقة واطلب الإذن منه للإصلاح.
- إياك أن تقوم بمحاولات إصلاح عشوائية من تلقاء نفسك وبدون إذن المستخدم (Silent fixes) لأنها ستدمر الكود أكثر.

---

### 7. MANDATORY POST-EDIT VERIFICATION (التحقق الذاتي الإلزامي بعد التعديل)
- **يُمنع منعاً باتاً** إخبار المستخدم بأن التعديل قد اكتمل قبل إجراء فحص برمجي للكود.
- بعد كل عملية استبدال أو تعديل في ملفات النظام (باستخدام أداة القناص)، **يجب عليك (كذكاء اصطناعي)** تشغيل أمر `npm run lint` أو `npx tsc --noEmit` في موجه الأوامر (Terminal) للتحقق من عدم وجود أي أخطاء في الـ Syntax أو وسوم إغلاق ناقصة (مثل `</label>` أو `</div>`).
- إذا ظهر لك أي خطأ برمجي في شاشة الأوامر، يجب عليك إدراك الخطأ وإصلاحه فوراً قبل أن تسلم النتيجة للمستخدم، لضمان عدم ظهور الشاشة البيضاء (Error 500) إطلاقاً.

---

### 8. STRICT TASK CANCELLATION & NO BACKTRACKING (الإلغاء الصارم ومنع العودة للماضي)
- **قاعدة ذهبية:** إذا قال لك المستخدم "انسى الموضوع"، "وقف"، أو "لا تسوي هذا الطلب"، **يُمنع منعاً باتاً** العودة لهذا الطلب أو محاولة تنفيذه أو حتى البحث في ملفاته لاحقاً في المحادثة.
- يجب عليك تفريغ ذاكرتك (Clear mental queue) من أي مهام سابقة لم تكتمل، والتركيز **فقط** على الطلب المباشر الحالي.
- **لا للاجتهاد التلقائي (No Zombie Tasks):** إياك أن تقوم بإحياء مهام قديمة أو الاستمرار في تحليل أكواد تخص مهمة تم إيقافها. إذا لم تكن متأكداً، اسأل المستخدم: "هل أستمر في الطلب الفلاني؟" ولا تتصرف من تلقاء نفسك.

### 9. NO SQL ASSUMPTIONS (يُمنع افتراض أسماء الأعمدة في قواعد البيانات)
- **ممنوع كتابة أي أوامر SQL (Triggers, Functions, Queries)** قبل التحقق الفعلي والمؤكد من بنية الجدول (Schema).
- لا تقم أبداً بتخمين أسماء الأعمدة (Columns) بناءً على كود الواجهة الأمامية (Frontend) أو بناءً على المعرفة العامة.
- إذا طلب منك المستخدم كتابة كود SQL لجدول معين، **يجب عليك أولاً** أن تطلب منه إرسال بنية الجدول الدقيقة (`CREATE TABLE...`)، أو استخدام أدواتك للبحث عن ملفات الـ `schema` في المشروع وقراءتها للتأكد 100% قبل كتابة أي كود قاعدة بيانات.

### 10. MANDATORY STRUCTURAL ANALYSIS BEFORE UI FIXES (التحليل الهيكلي الإلزامي قبل التعديل)
- **Understand the Big Picture First (افهم الصورة الكاملة أولاً):** If the user reports an issue with a UI layout, an empty state, or a specific message, **DO NOT rush to modify the code.** You must first use `view_file` to read the entire component and understand its rendering logic and different states (e.g., New User vs. Existing User).
- **Trace the Exact Text (تتبع النص الدقيق):** Search for the exact text or element the user is complaining about, and analyze the exact conditional logic (e.g., `if/else`, ternary operators) that triggers it. 
- **Respect Intended Architecture (احترم البنية الأساسية):** Before modifying any condition (like changing `jobs.length === 0` to something else), ask yourself: "What was this variable *intended* to represent?" Do not bypass the architectural logic. If the UI is rendering the wrong state, find the root cause of why the state is wrong, rather than patching the UI condition itself.
- **Ask Before Patching (اسأل قبل الترقيع):** If you discover that fixing the bug requires bypassing the intended UI logic, STOP and explain the architecture to the user first.

### 11. MANDATORY SCOPE VERIFICATION (التحقق الإلزامي من نطاق المتغيرات)
- **Do not assume variable availability (لا تفترض توفر المتغير):** Before modifying code to use an existing variable (e.g., `filteredJobs`), you MUST verify that this variable is actually defined and accessible within the exact scope (block/function/component) you are modifying.
- **Use inline logic if unsure (استخدم المنطق المباشر عند الشك):** If you are inside a nested component, an isolated function, or an IIFE `(() => {...})()`, and you are not 100% sure the variable is in scope, write the explicit inline logic (e.g., `jobs.filter(...)`) instead of risking a `ReferenceError` that causes a White Screen of Death (WSOD).
- **Read the surrounding context (اقرأ السياق المحيط):** Do not blind-paste variables based on assumptions. A variable defined at the top of a file might not be accessible inside a different exported component in the same file.

### 12. MANDATORY FILE SEARCH BEFORE MODIFICATION (البحث الإلزامي عن الملف قبل التعديل)
- **Never guess file locations (لا تخمن أماكن الملفات):** Even if a structure is common (like `App.tsx` handling routing), you MUST use `grep_search` to confirm the exact file containing the code you want to modify before using any editing tools.
- **Verify tool output (تحقق من نتيجة الأداة):** If a replacement tool (like `multi_replace_file_content`) reports "We did our best... despite inaccuracies", you MUST stop and double-check if you targeted the right file. Do not assume the edit was successful.

### 13. STRICT DB SCHEMA SYNCHRONIZATION (التحقق الإلزامي من تطابق قاعدة البيانات)
- **يُمنع منعاً باتاً** إضافة أي حقل إدخال جديد (Input Field) أو متغير في واجهة المستخدم (Frontend) وإرساله برمجياً في دوال الإدخال (`insert` / `update`) إلى قاعدة البيانات، دون التحقق المسبق والمؤكد 100% من وجود هذا العمود (Column) في بنية الجدول (Schema).
- إذا طلب المستخدم إضافة حقل جديد للواجهة، **يجب عليك أولاً** تزويد المستخدم بكود الـ SQL (`ALTER TABLE`) لإنشاء العمود في قاعدة البيانات، والانتظار حتى يؤكد لك أنه قام بتشغيله، قبل أن تقوم بتعديل كود الـ Frontend لإرسال هذه القيمة.

### 14. ARCHITECTURE AWARENESS & NO BLIND RESTORES (الوعي بالبنية المعمارية ومنع الاسترجاع الأعمى)
- **لا تستنتج الفشل من أخطاء الكونسول (Don't assume failure from Console Errors):** إذا رأيت خطأ مثل `401 Unauthorized` في الاتصال بـ API خارجي (مثل سيرفر تحليل السير الذاتية)، **يُمنع منعاً باتاً** التسرع بتخمين أن الكود معطل ومحاولة استرجاع (Restore) أكواد قديمة محذوفة أو مفاتيح سرية (API Keys).
- **تأكد من هندسة النظام (Verify System Architecture):** الأنظمة المتقدمة تستخدم (Background Sweepers) تعمل في الخلفية من السيرفر. قد يكون مسح مفتاح الـ API من الواجهة خطوة أمنية مقصودة وليست خطأ.
- **إياك أن تقوم بإرجاع مفاتيح أمنية محذوفة** بمجرد أن تجدها في الـ (Git Log) لتصحيح خطأ ظاهري، قبل أن تتأكد 100% أن النظام لا يعتمد على طرق خلفية (Backend) لتنفيذ نفس المهمة.

### 15. NO BLIND ASSUMPTIONS OR FALSE CLAIMS (يُمنع تقديم إجابات تخمينية أو أسباب وهمية)
- **لا تكذب أو تؤلف أسباباً (Do not fabricate reasons):** إذا سألك المستخدم عن سبب مشكلة معينة (مثل اختفاء بيانات أو تعطل ميزة)، يُمنع منعاً باتاً إعطاؤه إجابة أو استنتاجاً قبل أن تقوم بفحص قاعدة البيانات (عبر السكربتات) أو قراءة الكود الفعلي المسبب للمشكلة.
- **تأكد 100% قبل الإجابة (Verify before answering):** إياك أن تقول "لا يوجد شيء" أو "البيانات وهمية" ما لم تكن قد تحققت من ذلك بنفسك بشكل قاطع.
- **الاعتراف بعدم المعرفة (Admit ignorance if unsure):** إذا لم تكن متأكداً، قل "لا أعرف حتى الآن، أحتاج لفحص قاعدة البيانات"، ولا تقم بإعطاء تبريرات لتسليك المستخدم.

### 16. EXPLICIT JUSTIFICATION FOR ARCHITECTURAL CHANGES (التبرير الإلزامي لأي تعديل هيكلي)
- **ممنوع التعديل من الرأس (No guessing or blind modifications):** لا تقم أبداً بتغيير منطق الحالات (مثل تغيير `pending` إلى `locked_fomo` في الواجهة الأمامية) بناءً على اجتهاد شخصي دون أن تفهم هندسة النظام الأصلية.
- **الاحترام التام لتصميم المستخدم (Respect the user's design):** إذا كانت الواجهة تعتمد على تغيير واجهة المستخدم ديناميكياً (مثلاً قراءة حالة `pending` وتغبيشها بناءً على الرصيد صفر)، لا تقم بإفساد هذه الهندسة عبر فرض حالات أخرى في قاعدة البيانات.
- **التوضيح الصريح والإذن قبل التعديل (Explicit permission & justification required):** إذا اضطررت لتغيير بنية الكود أو حالة معينة، **يجب عليك** أن تكتب للمستخدم أولاً: "أنا سأقوم بتعديل هذا الجزء ليكون كذا بدلاً من كذا، والسبب المعماري هو كذا، هل توافق؟" ولا تقم بالتعديل حتى يوافق.

### 17. DO NOT BREAK EXISTING ARCHITECTURE (لا تصلح شيء وتخرب شيء بنيناه)
- **المبدأ الذهبي:** إياك أن تقوم بإصلاح مشكلة (Bug) على حساب تدمير ميزة أخرى كانت تعمل مسبقاً (مثل واجهة مغبشة أو طريقة عرض معينة).
- **لا للتدخل العشوائي:** إذا كان الكود معقداً ومبنياً بطريقة معينة (حتى لو بدت غريبة)، فلا تتدخل وتعدل فيها بحجة "التحسين" إلا إذا طلب منك المستخدم ذلك حرفياً. احترام جهد المستخدم وتفاصيل بنائه للكود أهم من تحسيناتك الشخصية.
- **الإبلاغ الصريح في حال التعديل (Mandatory Disclosure of Changes):** إذا حصل واضطررت لتعديل أي شيء أو تغيير مسار الكود لسبب طارئ، يجب عليك أن تقول للمستخدم بشكل مباشر وصريح: "ترى أنا والله عدلت كذا وكذا، واضطريت إني أعدلها عشان كذا وكذا". لا تقم بأي تعديل صامت أبداً ووضح السبب دائماً.

### 18. EXACT DATABASE COLUMN VERIFICATION (التحقق الصارم من أسماء الأعمدة)
- **يُمنع تخمين أسماء الأعمدة (No guessing column names):** يُمنع منعاً باتاً تحديث أو إدخال بيانات في قاعدة البيانات (مثل `supabase.update`) باستخدام أسماء أعمدة مبنية على التخمين أو التشابه (مثل كتابة `voice_eval_url` بدلاً من `voice_eval`).
- **التحقق الإلزامي من الـ Schema (Mandatory Schema Check):** قبل كتابة أي كود يتفاعل مع قاعدة البيانات (Frontend, Backend, أو Edge Functions)، **يجب عليك** فحص الكود القديم للتحقق 100% من الاسم الدقيق للعمود، لأن الخطأ في حرف واحد يسبب (Crash) للعملية بأكملها.
- **أنت من بنى النظام، فتأكد منه (You built it, own it):** تذكر أنك أنت من كتب الأكواد السابقة، لذا لا تقدم مسميات خاطئة. ابحث دائماً في الكود لتتأكد من الأسماء الصحيحة التي أنشأتها مسبقاً قبل أي تعديل.

---

### 19. STRICT BAN ON DANGEROUS TOOLS AND COMMANDS (الحظر الصارم للأدوات والأوامر المدمرة)
- **أداة الاستبدال الجماعي (multi_replace_file_content):** يُمنع منعاً باتاً استخدام هذه الأداة لحذف أو استبدال أجزاء كبيرة من الكود (Multi-line blocks) لأنها قد تخطئ وتقوم بمسح أكواد مشابهة في أماكن أخرى. إذا احتجت لتعديل أو حذف بلوك كبير، يجب عليك استخدام أدوات التعديل الدقيقة جداً أو تحديد الأسطر بالضبط.
- **أوامر Git المدمرة:** يُمنع منعاً باتاً، وتحت أي ظرف، استخدام أمر `git checkout <file>` أو `git reset` لإرجاع ملف إلى حالة سابقة دون أن تتحدث مع المستخدم وتحصل على إذن صريح وواضح منه. هذا الأمر يدمر الشغل غير المحفوظ (Uncommitted changes) ويعتبر جريمة برمجية في هذا المشروع.

---
### 20. STRICT AWARENESS OF DATA FLOW & NAMING CONVENTIONS (الوعي الصارم بتدفق البيانات وتحولات الأسماء)
- **لا تفترض تطابق الأسماء بين الواجهة والخلفية (Do not assume naming consistency):** يجب أن تدرك تماماً أن قواعد البيانات (مثل Supabase/Postgres) تقوم غالباً بتحويل أسماء المتغيرات القادمة من الواجهة الأمامية بصيغة (CamelCase) مثل `aiOverrideFields` إلى صيغة (Snake_Case) مثل `ai_override_fields`.
- **التحقق من الكود الوسيط (Verify the Intermediary Code):** عند تعديل أو قراءة كود الذكاء الاصطناعي (Backend / Python)، يجب عليك فحص كيف يتم استخراج البيانات من قاموس الاستجابة (`job_data.get`). إياك أن تعتمد على اسم المتغير كما أرسلته الواجهة الأمامية دون التحقق من كيفية تخزينه في قاعدة البيانات، واستخدم دائماً الدالة `get` مع التحقق من الصيغتين (مثل `job_data.get("camelCase") or job_data.get("snake_case")`) لتفادي فقدان البيانات.

---

*This file acts as the ultimate constitution for AI agents operating on this codebase. Read it, understand it, and never violate it.*
