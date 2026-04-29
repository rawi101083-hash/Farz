export const FEATURE_FLAGS = {
  enable_fast_sorting: false, // ميزة (الفرز السريع)
  enable_quick_link: false,   // مسار (رابط التوظيف السريع)
};

export const getVoiceInterviewFeatureEnabled = () => {
  const stored = localStorage.getItem("isVoiceInterviewFeatureEnabled");
  return stored ? stored === "true" : false; // Default is false
};

export const setVoiceInterviewFeatureEnabled = (enabled: boolean) => {
  localStorage.setItem("isVoiceInterviewFeatureEnabled", enabled.toString());
};
