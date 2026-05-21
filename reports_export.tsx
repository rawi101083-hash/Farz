export const Reports = ({ jobs, filterId, applicants = [] }: { jobs: Job[]; filterId: string; applicants?: any[] }) => {
  const filteredJobs = filterId === "all" ? jobs : jobs.filter(j => j.id === filterId);
  const totalJobs = filteredJobs.length;

  const relevantApplicants = filterId === "all" 
    ? applicants 
    : applicants.filter(a => {
        const searchJob = jobs.find(j => j.id === filterId)?.title || "";
        return searchJob ? a.job.includes(searchJob) : false;
      });

  const totalApplicants = applicants.length > 0 
    ? relevantApplicants.length 
    : filteredJobs.reduce((sum, j) => sum + (j.applicants || 0), 0);

  const pendingCount = relevantApplicants.filter(a => !a.decision || a.decision === "pending").length;
  const interviewCount = relevantApplicants.filter(a => a.decision === "interview").length;
  const acceptedCount = relevantApplicants.filter(a => a.decision === "accepted").length;
  const rejectedCount = relevantApplicants.filter(a => a.decision === "rejected").length;
  const autoRejectedCount = relevantApplicants.filter(a => a.decision === "filtered").length;

  let linkdinCount = 0;
  let baytCount = 0;
  let twitterCount = 0;
  let facebookCount = 0;
  let whatsappCount = 0;
  let telegramCount = 0;
  let referralCount = 0;
  let websiteCount = 0;

  relevantApplicants.forEach(app => {
    const src = (app.source || "").toLowerCase();
    if (src.includes("لينكد إن") || src.includes("linkedin")) linkdinCount++;
    else if (src.includes("بيت.كوم") || src.includes("bayt")) baytCount++;
    else if (src.includes("تويتر") || src.includes("إكس") || src.includes("x.com") || src.includes("twitter")) twitterCount++;
    else if (src.includes("فيسبوك") || src.includes("facebook")) facebookCount++;
    else if (src.includes("واتساب") || src.includes("whatsapp")) whatsappCount++;
    else if (src.includes("تيليجرام") || src.includes("telegram")) telegramCount++;
    else if (src.includes("توصية") || src.includes("referral") || src.includes("معارف")) referralCount++;
    else if (src.includes("موقع الشركة") || src.includes("website") || src.includes("غير محدد")) websiteCount++;
    else websiteCount++;
  });

  // Removed mock data as per user request to display actual real data (even if 0)

  const platformsTotal = linkdinCount + baytCount;
  const socialTotal = twitterCount + facebookCount;
  const messagingTotal = whatsappCount + telegramCount;
  const otherTotal = referralCount + websiteCount;

  const safePercent = (part: number, total: number) => total > 0 ? Math.round((part / total) * 100) : 0;

  const sourceOfHireData = [
    {
      name: "منصات التوظيف",
      value: platformsTotal,
      breakdown: [{ name: "لينكد إن", value: safePercent(linkdinCount, platformsTotal) }, { name: "بيت.كوم", value: safePercent(baytCount, platformsTotal) }]
    },
    {
      name: "شبكات التواصل",
      value: socialTotal,
      breakdown: [{ name: "تويتر / X", value: safePercent(twitterCount, socialTotal) }, { name: "فيسبوك", value: safePercent(facebookCount, socialTotal) }]
    },
    {
      name: "تطبيقات المراسلة",
      value: messagingTotal,
      breakdown: [{ name: "واتساب", value: safePercent(whatsappCount, messagingTotal) }, { name: "تيليجرام", value: safePercent(telegramCount, messagingTotal) }]
    },
    {
      name: "مصادر أخرى",
      value: otherTotal,
      breakdown: [{ name: "الإحالات", value: safePercent(referralCount, otherTotal) }, { name: "موقع الشركة", value: safePercent(websiteCount, otherTotal) }]
    },
  ];

  // Hiring funnel
  const screenedCount = Math.max(0, totalApplicants - autoRejectedCount);
  const interviewsStageCount = interviewCount + acceptedCount;
  const offersCount = acceptedCount;

  const hiringFunnelData = [
    { name: "إجمالي المتقدمين", value: totalApplicants },
    { name: "الفرز الآلي", value: screenedCount },
    { name: "المقابلات", value: interviewsStageCount },
    { name: "المقبولين", value: offersCount },
  ];

  // Candidate Quality Index
  const highQualityCount = relevantApplicants.filter(a => { const r = a.rating || a.match_percentage || 0; return r >= 80; }).length;
  const mediumQualityCount = relevantApplicants.filter(a => { const r = a.rating || a.match_percentage || 0; return r >= 70 && r < 80; }).length;
  const lowQualityCount = relevantApplicants.filter(a => { const r = a.rating || a.match_percentage || 0; return r < 70; }).length;

  const qualityIndexData = [
    { name: "كفاءة عالية (+80%)", value: highQualityCount },
    { name: "كفاءة متوسطة (70%-79%)", value: mediumQualityCount },
    { name: "كفاءة ضعيفة (<70%)", value: lowQualityCount }
  ].filter(d => d.value > 0);
  
  // Calculate dynamic average time to hire (based on time since job creation)
  let totalDays = 0;
  let validJobsCount = 0;

  filteredJobs.forEach(job => {
    if (job.createdAt) {
      const createdDate = new Date(job.createdAt);
      const currentDate = new Date();
      // Calculate diff in days
      const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalDays += diffDays;
      validJobsCount++;
    }
  });

  const avgTime = validJobsCount > 0 ? Math.round(totalDays / validJobsCount) : 0;

  const glassStyleStr = { background: "rgba(25, 168, 145, 0.30)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(25, 168, 145, 0.50)", boxShadow: "0 4px 15px rgba(25, 168, 145, 0.2)" };

  // Glass versions of original colors: Blue, Orange, Purple, Teal
  const COLORS = [
    "rgba(59, 130, 246, 0.40)",
    "rgba(249, 115, 22, 0.40)",
    "rgba(139, 92, 246, 0.40)",
    "rgba(13, 148, 136, 0.40)"
  ];
  const STROKE_COLORS = [
    "rgba(59, 130, 246, 0.60)",
    "rgba(249, 115, 22, 0.60)",
    "rgba(139, 92, 246, 0.60)",
    "rgba(13, 148, 136, 0.60)"
  ];
  return (
    <div className="space-y-6 pb-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-3 text-navy dark:text-white">
          التقارير والتحليلات
        </h1>{" "}
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium text-lg">
          نظرة شاملة ودقيقة على أداء عمليات التوظيف والبيانات التحليلية.
        </p>{" "}
      </header>{" "}
      {/* Top Row: Metric Cards */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            label: "إجمالي المتقدمين",
            value: totalApplicants.toString(),
            icon: <Users size={20} />,
            color: "text-primary",
            bg: "bg-primary/10",
            subtitle: totalApplicants > 0 ? (
              <span className="flex items-center gap-1.5 justify-center">
                <Sparkles size={14} className="text-primary fill-primary/20" />
                <span>تم استبعاد {Math.round((autoRejectedCount / totalApplicants) * 100)}% آلياً.</span>
              </span>
            ) : undefined,
          },
          {
            label: "إجمالي الوظائف",
            value: totalJobs.toString(),
            icon: <Briefcase size={20} />,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "متوسط وقت التوظيف",
            value: `${avgTime} يوم`,
            icon: <Clock size={20} />,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-[24px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center"
          >
            <div
              className={`w-12 h-12 ${metric.bg} ${metric.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner-3d`}
            >
              {metric.icon}{" "}
            </div>{" "}
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest mb-2">
              {metric.label}
            </p>{" "}
            <h3 className="text-3xl font-black text-navy dark:text-white">
              {metric.value}
            </h3>{" "}
            {metric.subtitle && (
              <p className="mt-4 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-xl">
                {metric.subtitle}
              </p>
            )}
          </motion.div>
        ))}{" "}
      </div>{" "}
      {/* Middle Row: Charts */}{" "}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Source of Hire Pie Chart Card */}
        <div className="lg:col-span-5 p-6 rounded-[24px]" style={glassStyleStr}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-navy dark:text-white">
              مصادر التوظيف
            </h3>{" "}
            <PieChartIcon className="text-slate-300" size={20} />{" "}
          </div>{" "}
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceOfHireData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                >
                  {sourceOfHireData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke={STROKE_COLORS[index % STROKE_COLORS.length]}
                      strokeWidth={1}
                    />
                  ))}{" "}
                </Pie>{" "}
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-4 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] min-w-[160px] text-right" style={glassStyleStr} dir="rtl">
                          <p className="font-bold text-slate-500 dark:text-slate-400 mb-2 text-xs">{data.name}</p>
                          <p className="text-navy dark:text-white font-black text-lg mb-2">
                            {data.value} مرشحاً
                          </p>
                          {data.breakdown && data.breakdown.length > 0 && (
                            <div className="space-y-1 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                              {data.breakdown.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                  <span>{item.name}</span>
                                  <span className="text-primary">{item.value}%</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />{" "}
                <Legend
                  verticalAlign="bottom"
                  height={40}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-navy dark:text-white font-bold text-sm mr-2">
                      {value}
                    </span>
                  )}
                />{" "}
              </PieChart>{" "}
            </ResponsiveContainer>{" "}
          </div>{" "}
        </div>{" "}
        {/* Hiring Funnel Chart Card */}
        <div className="lg:col-span-7 p-6 rounded-[24px]" style={glassStyleStr}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-navy dark:text-white">
              مسار توظيف المتقدمين
            </h3>{" "}
            <BarChartIcon className="text-slate-300" size={20} />{" "}
          </div>{" "}
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hiringFunnelData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 160, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" strokeOpacity={0.1} />
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 14, fontWeight: "bold" }} 
                  width={150} 
                  tickMargin={10} 
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-4 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] min-w-[140px] text-right" style={glassStyleStr} dir="rtl">
                          <p className="font-bold text-slate-500 dark:text-slate-400 mb-2 text-xs">{label}</p>
                          <p className="text-white font-black text-sm flex items-center gap-1">{payload[0].value} متقدماً</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  trigger="hover"
                  wrapperStyle={{ pointerEvents: 'auto' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={12} 
                  barSize={30} 
                  stroke="none"
                >
                  {hiringFunnelData.map((entry, index) => {
                    let fillRgba = "rgba(13, 148, 136, 0.40)"; // Green for Total and Accepted
                    let strokeRgba = "rgba(13, 148, 136, 0.60)";
                    if (entry.name === "الفرز الآلي") {
                       fillRgba = "rgba(59, 130, 246, 0.40)"; // Blue for AI Screening
                       strokeRgba = "rgba(59, 130, 246, 0.60)";
                    } else if (entry.name === "المقابلات") {
                       fillRgba = "rgba(249, 115, 22, 0.40)"; // Orange for Interviews
                       strokeRgba = "rgba(249, 115, 22, 0.60)";
                    }
                    return <Cell key={"cell-" + index} fill={fillRgba} stroke={strokeRgba} strokeWidth={1} />;
                  })}
                  <LabelList position="right" fill="#64748b" stroke="none" dataKey="value" fontSize={14} fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Bottom Row: Full Width Bar Chart for Candidate Quality Index */}
      <div className="p-6 rounded-[24px]" style={glassStyleStr}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-navy dark:text-white">
              مؤشر جودة المتقدمين
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mt-1">
              تحليل مستويات كفاءة المتقدمين بناءً على نسب المطابقة.
            </p>
          </div>
          <BarChartIcon className="text-slate-300" size={20} />
        </div>
        <div className="w-full h-80 transition-all duration-300" dir="ltr">
          {qualityIndexData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={qualityIndexData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 160, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f1f5f9"
                  strokeOpacity={0.1}
                />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 14, fontWeight: "bold" }}
                  width={150}
                  tickMargin={10}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-4 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] min-w-[140px] text-right" style={glassStyleStr} dir="rtl">
                          <p className="font-bold text-slate-500 dark:text-slate-400 mb-2 text-xs">{label}</p>
                          <p className="text-slate-600 dark:text-slate-300 font-black text-sm mb-2">{payload[0].value} متقدم</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  wrapperStyle={{ pointerEvents: 'auto' }}
                />
                <Bar
                  dataKey="value"
                  radius={12}
                  barSize={30}
                  stroke="none"
                >
                  {qualityIndexData.map((entry, index) => {
                    let fillRgba = "rgba(13, 148, 136, 0.40)"; // Teal/Green for high efficiency
                    let strokeRgba = "rgba(13, 148, 136, 0.60)";
                    if (entry.name.includes("متوسطة")) {
                       fillRgba = "rgba(249, 115, 22, 0.40)"; // Orange for medium efficiency
                       strokeRgba = "rgba(249, 115, 22, 0.60)";
                    } else if (entry.name.includes("ضعيفة")) {
                       fillRgba = "rgba(239, 68, 68, 0.40)"; // Red for low efficiency
                       strokeRgba = "rgba(239, 68, 68, 0.60)";
                    }
                    return <Cell key={"cell-" + index} fill={fillRgba} stroke={strokeRgba} strokeWidth={1} />;
                  })}
                  <LabelList position="right" fill="#64748b" stroke="none" dataKey="value" fontSize={14} fontWeight="bold" offset={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">لا توجد بيانات كافية</div>
          )}
        </div>
      </div>
    </div>
  );
};

