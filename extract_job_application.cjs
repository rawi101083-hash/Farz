const fs = require('fs');

const appTsxPath = 'src/App.tsx';
let content = fs.readFileSync(appTsxPath, 'utf8');

// Find start and end of ApplicantForm
const startIdx = content.indexOf('const ApplicantForm = ({');
if (startIdx === -1) {
    console.error('ApplicantForm not found!');
    process.exit(1);
}

// We know it ends before "const [talentPool, setTalentPool]" or before "export default function App()"
// Let's search for "export default function App()"
const stopIdx = content.indexOf('export default function App() {');
if (stopIdx === -1) {
    console.error('App component not found!');
    process.exit(1);
}

// The exact text we extract is between startIdx and just before stopIdx (actually we should look for the closing brace before stopIdx)
const textBeforeApp = content.substring(startIdx, stopIdx);
const lastClosingBrace = textBeforeApp.lastIndexOf('};');
const extracted = textBeforeApp.substring(0, lastClosingBrace + 2);

// imports
const imports = `import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Search,
  Filter,
  Users,
  User,
  ShoppingBag,
  Database,
  Upload,
  LayoutDashboard,
  CheckCircle,
  Play,
  FileText,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  LogOut,
  Lock,
  Mail,
  Shield,
  CreditCard,
  Settings,
  MoreVertical,
  Ban,
  Calendar,
  Phone,
  Globe,
  Bell,
  Copy,
  ExternalLink,
  MapPin,
  Share2,
  Trash2,
  Save,
  Star,
  MessageCircle,
  X,
  Plus,
  Moon,
  Sun,
  Eye,
  Download,
  ChevronDown,
  Mic,
  Square,
  RotateCcw,
  CheckSquare,
  Pencil,
  AlertTriangle,
  Linkedin,
} from "lucide-react";
import { skillsDictionary, getUserSavedSkills, saveUserSkills, SAUDI_CITIES, SearchableSelect, VerificationModal, FlowStep, CustomAttachment, Role, Job, ImageLightbox, EmptyState, PreviewModal, TalentPoolModal, TalentPool, GlobalJobSelector, Reports, SettingsPage, ActiveJobs, Applicant, mockApplicants, FastScreening } from '../Shared';

`;

const componentContent = imports + extracted + '\n\nconst JobApplication = ApplicantForm;\nexport default JobApplication;\n';

fs.writeFileSync('src/components/JobApplication.tsx', componentContent);
console.log('Successfully wrote src/components/JobApplication.tsx');

// Modify App.tsx
// 1. Remove ApplicantForm
let newContent = content.substring(0, startIdx) + content.substring(startIdx + lastClosingBrace + 2);

// 2. Replace <ApplicantForm with <JobApplication
newContent = newContent.replace(/<ApplicantForm/g, '<JobApplication');

// 3. Add import
const importLine = `import JobApplication from './components/JobApplication';\n`;
const importStartIdx = newContent.indexOf('import ApplicantDetails from');
if (importStartIdx !== -1) {
    newContent = newContent.substring(0, importStartIdx) + importLine + newContent.substring(importStartIdx);
    console.log('Successfully added import to App.tsx');
} else {
    // just put it at the top after initial imports
    newContent = importLine + newContent;
}

fs.writeFileSync(appTsxPath, newContent);
console.log('Successfully updated App.tsx');
