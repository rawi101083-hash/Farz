const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Bypass the onboarding modal requirement in handleCreateJob
c = c.replace('const isComplete = Boolean(userProfile.commercialRegistration || userProfile.freelanceDocument);', 
              'const isComplete = true; // Bypassed for platform owner');

// 2. Add local storage initialization to userProfile
const oldProfileState = `  const [userProfile, setUserProfile] = useState({
    name: "أحمد المدير",
    title: "مدير التوظيف",
    avatar: "https://picsum.photos/seed/admin/100/100",
    companyLogo: "",
    commercialRegistration: "1010123456",
    freelanceDocument: "",
    taxNumber: "",
    subscription_tier: "free",
    entityType: "company",
    city: "",
  });`;

const newProfileState = `  const [userProfile, setUserProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('userProfile_v2');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return {
      name: "أحمد المدير",
      title: "مدير التوظيف",
      avatar: "https://picsum.photos/seed/admin/100/100",
      companyLogo: "",
      commercialRegistration: "",
      freelanceDocument: "",
      taxNumber: "",
      subscription_tier: "free",
      entityType: "company",
      companyName: "",
      city: "",
    };
  });`;

c = c.replace(oldProfileState, newProfileState);

// 3. Fix the save button in SettingsPage
const oldSaveBtn = `<button className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
                حفظ التغييرات
              </button>`;
const newSaveBtn = `<button 
                onClick={(e) => {
                  e.preventDefault();
                  localStorage.setItem('userProfile_v2', JSON.stringify(userProfile));
                  window.dispatchEvent(new CustomEvent("showToast", { detail: "تم الحفظ بنجاح" }));
                }}
                className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
                حفظ التغييرات
              </button>`;

c = c.replace(oldSaveBtn, newSaveBtn); // Note: we need to replace both occurrences if there are two (for Account tab and Company tab)
c = c.replace(oldSaveBtn, newSaveBtn);

// Also remove the "onboarding_complete" blocks in App.tsx just to be safe
// Wait, we bypassed isComplete, so the modal won't show. And we can just let it be.

fs.writeFileSync('src/App.tsx', c);
console.log("Settings logic and modal bypass applied.");
