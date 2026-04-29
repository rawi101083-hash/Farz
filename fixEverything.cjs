const fs = require('fs');

let dbContent = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const cacheLogic = `const getCachedApplicants = () => {
  try {
    return JSON.parse(window.localStorage.getItem('sahab_cached_applicants') || 'null');
  } catch {
    return null;
  }
};
let cachedApplicants: any = getCachedApplicants();`;

dbContent = dbContent.replace(/let cachedApplicants: Applicant\[\] \| null = null;/, cacheLogic);

const replacement = `cachedApplicants = next;
          try {
            window.localStorage.setItem('sahab_cached_applicants', JSON.stringify(next));
          } catch(e) {}
          return next;`;

dbContent = dbContent.replace(/cachedApplicants = next;\s*return next;/g, replacement);

fs.writeFileSync('src/components/Dashboard.tsx', dbContent);
console.log('Modified Dashboard.tsx');

// 2. Fix Shared.tsx runtime crashes
let sharedContent = fs.readFileSync('src/Shared.tsx', 'utf-8');

const oldSharedLogicRegex = /  const allStarredApplicants: any\[\] = \[\];[\s\S]*?return matchesJob && matchesSkill && matchesSearch;\r?\n  \}\);/;

const newSharedLogic = `  const allStarredApplicants: any[] = [];

  // Collect all starred applicants from everywhere
  (jobs || []).forEach(job => {
    if (job && job.applicantsList) {
      job.applicantsList.forEach(app => {
        if (app && app.id && shortlistedIds && shortlistedIds.includes(app.id) && !allStarredApplicants.find(t => t && t.id === app.id)) {
          allStarredApplicants.push({ ...app, job: job.title || "غير محدد" });
        }
      });
    }
  });

  if (externalApplicants && Array.isArray(externalApplicants)) {
    externalApplicants.forEach(app => {
      if (app && app.id && shortlistedIds && shortlistedIds.includes(app.id) && !allStarredApplicants.find(t => t && t.id === app.id)) {
        allStarredApplicants.push({ ...app, job: app.job || "غير محدد" });
      }
    });
  }

  (talentPool || []).forEach(app => {
    if (app && app.id && shortlistedIds && shortlistedIds.includes(app.id) && !allStarredApplicants.find(t => t && t.id === app.id)) {
      allStarredApplicants.push(app);
    }
  });

  const baseApplicants = showOnlyShortlisted ? allStarredApplicants : (talentPool || []);

  const allUniqueSkills = Array.from(new Set(
    baseApplicants.filter((t: any) => t && !t.is_removed_from_pool).flatMap((t: any) => t.skills || [])
  )).filter(Boolean).sort();

  const filteredTalents = baseApplicants.filter((t: any) => {
    if (!t || t.is_removed_from_pool) return false;
    const matchesJob =
      jobFilter === "all" ||
      (t.job && typeof t.job === 'string' && t.job.includes((jobs || []).find((j: any) => j && j.id === jobFilter)?.title || ""));
    const matchesSkill = skillFilter === "all" || (t.skills && Array.isArray(t.skills) && t.skills.includes(skillFilter));
    const searchLower = (searchTerm || "").toLowerCase();
    const matchesSearch = !searchTerm || 
      (t.name && typeof t.name === 'string' && t.name.toLowerCase().includes(searchLower)) ||
      (t.job && typeof t.job === 'string' && t.job.toLowerCase().includes(searchLower)) ||
      (t.skills && Array.isArray(t.skills) && t.skills.some((s: string) => s && typeof s === 'string' && s.toLowerCase().includes(searchLower)));
      
    return matchesJob && matchesSkill && matchesSearch;
  });`;

sharedContent = sharedContent.replace(oldSharedLogicRegex, newSharedLogic);
fs.writeFileSync('src/Shared.tsx', sharedContent);
console.log('Modified Shared.tsx');
