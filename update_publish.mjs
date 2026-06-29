const fs = require('fs');

let content = fs.readFileSync('src/components/CreateJob.tsx', 'utf8');

// Fix executePublishJob
const publishTarget = `    if (adType === "campaign" && finalRoles.length === 0 && roleTitle.trim()) {
      finalRoles.push({
        id: Math.random().toString(36).substr(2, 9),
        title: roleTitle.trim(),`;
        
const publishReplace = `    if (adType === "campaign" && roleTitle.trim()) {
      const activeRoleData = {
        id: editingRoleId || Math.random().toString(36).substr(2, 9),
        title: roleTitle.trim(),`;

content = content.replace(publishTarget, publishReplace);

const publishTargetEnd = `            languages: aiLanguages
          } : undefined,
        });
      }`;
      
const publishReplaceEnd = `            languages: aiLanguages
          } : undefined,
      };
      if (editingRoleId) {
        const index = finalRoles.findIndex(r => r.id === editingRoleId);
        if (index >= 0) finalRoles[index] = { ...finalRoles[index], ...activeRoleData };
      } else {
        finalRoles.push(activeRoleData as any);
      }
    }`;

content = content.replace(publishTargetEnd, publishReplaceEnd);

// Fix handleSaveAsDraft
const draftTarget = `    const finalRoles =
      adType === "single"
        ? [
          {
            id: editingRoleId || Math.random().toString(36).substr(2, 9),
            title: roleTitle.trim() || "شاغر جديد",`;

const draftReplace = `    let finalRoles = [...roles];
    
    if (adType === "single" || (adType === "campaign" && roleTitle.trim())) {
        const activeRoleData = {
            id: editingRoleId || Math.random().toString(36).substr(2, 9),
            title: roleTitle.trim() || "شاغر جديد",`;

content = content.replace(draftTarget, draftReplace);

const draftTargetEnd = `            voiceInterviewQuestions,
            photoRequirement,
          },
        ]
        : roles.length > 0 ? roles : [];`;

const draftReplaceEnd = `            voiceInterviewQuestions,
            photoRequirement,
        };
        if (editingRoleId) {
          const index = finalRoles.findIndex(r => r.id === editingRoleId);
          if (index >= 0) finalRoles[index] = { ...finalRoles[index], ...activeRoleData };
        } else {
          if (adType === "single") finalRoles = [activeRoleData as any];
          else finalRoles.push(activeRoleData as any);
        }
    }`;

content = content.replace(draftTargetEnd, draftReplaceEnd);

fs.writeFileSync('src/components/CreateJob.tsx', content);
