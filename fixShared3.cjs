const fs = require('fs');
let content = fs.readFileSync('src/Shared.tsx', 'utf-8');

const oldLogicRegex = /  const allPlatformApplicants = \[\.\.\.talentPool\];[\s\S]*?return matchesJob && matchesShortlist && matchesSkill && matchesSearch;\r?\n  \}\);/;

const newLogic = `  const allStarredApplicants: any[] = [];

  // Collect all starred applicants from everywhere
  jobs.forEach(job => {
    if (job.applicantsList) {
      job.applicantsList.forEach(app => {
        if (shortlistedIds.includes(app.id) && !allStarredApplicants.find(t => t.id === app.id)) {
          allStarredApplicants.push({ ...app, job: job.title || "غير محدد" });
        }
      });
    }
  });

  if (externalApplicants) {
    externalApplicants.forEach(app => {
      if (shortlistedIds.includes(app.id) && !allStarredApplicants.find(t => t.id === app.id)) {
        allStarredApplicants.push({ ...app, job: app.job || "غير محدد" });
      }
    });
  }

  talentPool.forEach(app => {
    if (shortlistedIds.includes(app.id) && !allStarredApplicants.find(t => t.id === app.id)) {
      allStarredApplicants.push(app);
    }
  });

  const baseApplicants = showOnlyShortlisted ? allStarredApplicants : talentPool;

  const allUniqueSkills = Array.from(new Set(baseApplicants.filter((t: any) => !t.is_removed_from_pool).flatMap(t => t.skills || []))).filter(Boolean).sort();

  const filteredTalents = baseApplicants.filter((t: any) => {
    if (t.is_removed_from_pool) return false;
    const matchesJob =
      jobFilter === "all" ||
      (t.job && t.job.includes(jobs.find((j) => j.id === jobFilter)?.title || ""));
    const matchesSkill = skillFilter === "all" || (t.skills && t.skills.includes(skillFilter));
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      (t.name && t.name.toLowerCase().includes(searchLower)) ||
      (t.job && t.job.toLowerCase().includes(searchLower)) ||
      (t.skills && t.skills.some((s: string) => s.toLowerCase().includes(searchLower)));
      
    return matchesJob && matchesSkill && matchesSearch;
  });`;

content = content.replace(oldLogicRegex, newLogic);
fs.writeFileSync('src/Shared.tsx', content);
console.log('Done!');
