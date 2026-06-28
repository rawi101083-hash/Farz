import { Applicant } from "../Shared";

const STORE_NAME = "applicantsCache";

export let globalApplicantsCache: Applicant[] | null = null;
export let globalJobsCacheStr: string = "";

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("SmartRecruitmentDB", 1);
    request.onerror = (e) => reject(e);
    request.onsuccess = (e) => resolve((e.target as any).result);
    request.onupgradeneeded = (e) => {
      const db = (e.target as any).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const saveToIDB = async (key: string, data: any) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(data, key);
  } catch (e) {
    console.error("IDB Save Error", e);
  }
};

export const loadFromIDB = async (key: string): Promise<any> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    return null;
  }
};

export const setGlobalApplicantsCache = (data: Applicant[], jobsStr: string) => {
  globalApplicantsCache = data;
  globalJobsCacheStr = jobsStr;
  
  const lightWeightData = data.map(app => {
    const { 
      interview_transcript, 
      interview_summary, 
      customAnswers, 
      ...rest 
    } = app as any;
    const lightWeightApp = { ...rest };
    return lightWeightApp as Applicant;
  });

  try { localStorage.setItem("sahab_applicants_fast_cache", JSON.stringify(lightWeightData)); } catch(e) {}

  saveToIDB("cache_v1", {
    applicants: lightWeightData,
    jobsStr: jobsStr,
    timestamp: Date.now()
  });
};
