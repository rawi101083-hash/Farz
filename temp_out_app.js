var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/App.tsx
var App_exports = {};
__export(App_exports, {
  default: () => App
});
module.exports = __toCommonJS(App_exports);
var import_Shared = require("./Shared");
var import_SuperAdmin = __toESM(require("./components/SuperAdmin"), 1);
var import_JobApplication = __toESM(require("./components/JobApplication"), 1);
var import_ApplicantDetails = __toESM(require("./components/ApplicantDetails"), 1);
var import_Dashboard = __toESM(require("./components/Dashboard"), 1);
var import_CreateJob = __toESM(require("./components/CreateJob"), 1);
var import_react = __toESM(require("react"), 1);
var import_react2 = require("motion/react");
var import_lucide_react = require("lucide-react");
var import_jsx_runtime = require("react/jsx-runtime");
var ErrorBoundary = class extends import_react.default.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-8 text-center bg-red-50 text-red-600 rounded-2xl m-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-xl font-bold mb-4", children: "\u062D\u062F\u062B \u062E\u0637\u0623 \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { className: "text-left text-sm whitespace-pre-wrap overflow-auto max-h-96", children: this.state.error?.stack })
      ] });
    }
    return this.props.children;
  }
};
var OnboardingModal = ({ isOpen, onClose, userProfile, setUserProfile, onPublishDraft }) => {
  const [entityType, setEntityType] = (0, import_react.useState)(userProfile.entityType || "company");
  const [companyName, setCompanyName] = (0, import_react.useState)(userProfile.companyName || "");
  const [crNumber, setCrNumber] = (0, import_react.useState)(userProfile.commercialRegistration || "");
  const [freelanceDoc, setFreelanceDoc] = (0, import_react.useState)(userProfile.freelanceDocument || "");
  const [city, setCity] = (0, import_react.useState)(userProfile.city || "");
  if (!isOpen) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react2.motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, className: "bg-white dark:bg-slate-800 rounded-[32px] p-8 max-w-md w-full shadow-2xl relative border border-white dark:border-slate-700", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: onClose, className: "absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 24 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner-3d", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ShieldCheck, { size: 40 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-2xl font-bold text-center text-navy dark:text-white mb-3", children: "\u062E\u0637\u0648\u0629 \u0623\u062E\u064A\u0631\u0629 \u0644\u0646\u0634\u0631 \u0625\u0639\u0644\u0627\u0646\u0643!" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 text-center mb-8 text-sm leading-relaxed", children: "\u064A\u0631\u062C\u0649 \u0627\u0633\u062A\u0643\u0645\u0627\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0643\u064A\u0627\u0646 \u0627\u0644\u062E\u0627\u0635 \u0628\u0643 \u0644\u0646\u062A\u0645\u0643\u0646 \u0645\u0646 \u0639\u0631\u0636\u0647\u0627 \u0644\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646 \u0648\u0646\u0634\u0631 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0634\u0648\u0627\u063A\u0631 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0643." }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: (e) => {
      e.preventDefault();
      if (entityType === "company" && (!companyName || !crNumber)) return;
      if (entityType === "freelance" && (!companyName || !freelanceDoc)) return;
      setUserProfile({
        ...userProfile,
        entityType,
        companyName,
        city,
        commercialRegistration: entityType === "company" ? crNumber : "",
        freelanceDocument: entityType === "freelance" ? freelanceDoc : ""
      });
      localStorage.setItem("onboarding_complete", "true");
      if (onPublishDraft) {
        onPublishDraft();
      }
      onClose();
    }, className: "space-y-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex bg-slate-100 dark:bg-slate-900/50 p-1.5 gap-1.5 rounded-2xl w-full mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: () => setEntityType("company"), className: `flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${entityType === "company" ? "bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm" : "text-slate-500"}`, children: "\u062C\u0647\u0629 \u0627\u0639\u062A\u0628\u0627\u0631\u064A\u0629" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: () => setEntityType("freelance"), className: `flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${entityType === "freelance" ? "bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm" : "text-slate-500"}`, children: "\u0639\u0645\u0644 \u062D\u0631 (\u0645\u0633\u062A\u0642\u0644)" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1", children: entityType === "company" ? "\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u0634\u0623\u0629 \u0627\u0644\u0645\u0639\u062A\u0645\u062F" : "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u062B\u0644\u0627\u062B\u064A \u0627\u0644\u0645\u0639\u062A\u0645\u062F" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { required: true, type: "text", value: companyName, onChange: (e) => setCompanyName(e.target.value), placeholder: entityType === "company" ? "\u0645\u0624\u0633\u0633\u0629 \u0627\u0644\u062A\u0642\u0646\u064A\u0629 \u0627\u0644\u0628\u0633\u064A\u0637\u0629..." : "\u0645\u062B\u0627\u0644: \u0639\u0628\u062F\u0627\u0644\u0644\u0647 \u0645\u062D\u0645\u062F...", className: "w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-primary font-medium dark:text-white" })
      ] }),
      entityType === "company" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1", children: "\u0631\u0642\u0645 \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u062A\u062C\u0627\u0631\u064A (CR)" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { required: true, type: "text", value: crNumber, onChange: (e) => setCrNumber(e.target.value), placeholder: "1010XXXXXX", className: "w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-primary font-medium dark:text-white text-left", dir: "ltr" })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1", children: "\u0631\u0642\u0645 \u0648\u062B\u064A\u0642\u0629 \u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u062D\u0631" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { required: true, type: "text", value: freelanceDoc, onChange: (e) => setFreelanceDoc(e.target.value), placeholder: "FL-XXXXXX", className: "w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-primary font-medium dark:text-white text-left", dir: "ltr" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1", children: "\u0627\u0644\u0645\u062F\u064A\u0646\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "text", value: city, onChange: (e) => setCity(e.target.value), placeholder: "\u0627\u0644\u0631\u064A\u0627\u0636\u060C \u062C\u062F\u0629...", className: "w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-primary font-medium dark:text-white" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "submit", className: "w-full py-5 mt-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle, { size: 20 }),
        "\u062D\u0641\u0638 \u0648\u0645\u062A\u0627\u0628\u0639\u0629"
      ] })
    ] })
  ] }) });
};
var JobSuccess = ({
  job,
  onDone,
  onPreview
}) => {
  const [copied, setCopied] = (0, import_react.useState)(false);
  const [showVerificationModal, setShowVerificationModal] = (0, import_react.useState)(false);
  const link = `/apply/${job.id}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "min-h-screen bg-slate-100 flex items-center justify-center p-6", children: [
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_react2.motion.div,
        {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          className: "bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl p-10 md:p-16 max-w-2xl w-full text-center border border-white dark:border-slate-700",
          children: [
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner-3d", children: [
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle, { size: 48 }),
              " "
            ] }),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-4xl font-bold text-navy dark:text-white mb-4", children: "\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0634\u0627\u063A\u0631 \u0628\u0646\u062C\u0627\u062D!" }),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium mb-12", children: "\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0648\u0638\u064A\u0641\u0629 \u0648\u0625\u0646\u0634\u0627\u0621 \u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0642\u062F\u064A\u0645 \u0627\u0644\u062E\u0627\u0635 \u0628\u0647\u0627. \u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u0622\u0646 \u0645\u0634\u0627\u0631\u0643\u062A\u0647 \u0645\u0639 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646." }),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 mb-10", children: [
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-slate-400 dark:text-slate-500 font-bold uppercase mb-3 text-right", children: "\u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0642\u062F\u064A\u0645 \u0627\u0644\u0645\u0628\u0627\u0634\u0631" }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700", children: [
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "button",
                  {
                    onClick: copyToClipboard,
                    className: `flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${copied ? "bg-green-500 text-white" : "bg-primary text-white hover:bg-teal-600"}`,
                    children: [
                      " ",
                      copied ? "\u062A\u0645 \u0627\u0644\u0646\u0633\u062E!" : "\u0646\u0633\u062E \u0627\u0644\u0631\u0627\u0628\u0637",
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Copy, { size: 18 }),
                      " "
                    ]
                  }
                ),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "input",
                  {
                    readOnly: true,
                    value: link,
                    className: "flex-1 bg-transparent dark:bg-transparent dark:text-white outline-none text-slate-500 dark:text-slate-400 dark:text-slate-500 font-mono text-sm text-left"
                  }
                ),
                " "
              ] }),
              " "
            ] }),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  onClick: onPreview,
                  className: "flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-navy dark:text-white py-4 rounded-2xl font-bold hover:bg-slate-50 dark:bg-slate-800/50 transition-all",
                  children: [
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ExternalLink, { size: 20 }),
                    " \u0645\u0639\u0627\u064A\u0646\u0629 \u0635\u0641\u062D\u0629 \u0627\u0644\u062A\u0642\u062F\u064A\u0645",
                    " "
                  ]
                }
              ),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  onClick: onDone,
                  className: "bg-navy text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all",
                  children: [
                    " ",
                    "\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645",
                    " "
                  ]
                }
              ),
              " "
            ] }),
            " "
          ]
        }
      ),
      " "
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_Shared.VerificationModal,
      {
        isOpen: showVerificationModal,
        onClose: () => setShowVerificationModal(false),
        onVerify: () => {
          setShowVerificationModal(false);
          copyToClipboard();
        }
      }
    )
  ] });
};
var PublicJobPage = ({
  job,
  selectedRoleId,
  onSelectRole,
  onApply,
  onBackToCampaign
}) => {
  if (job.status === "\u0645\u0633\u0648\u062F\u0629") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center bg-white dark:bg-slate-800 p-12 rounded-3xl shadow-xl max-w-lg w-full border border-slate-100 dark:border-slate-800", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-20 h-20 bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { size: 32 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-2xl font-bold text-navy dark:text-white mb-4", children: "\u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 font-medium", children: "\u0639\u0630\u0631\u0627\u064B\u060C \u0647\u0630\u0627 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D \u062D\u0627\u0644\u064A\u0627\u064B \u0623\u0648 \u0645\u0639\u0644\u0642 \u0643\u0645\u0633\u0648\u062F\u0629\u060C \u064A\u064F\u0631\u062C\u0649 \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0634\u0631\u0643\u0629 \u0627\u0644\u0646\u0627\u0634\u0631\u0629 \u0644\u0644\u0625\u0639\u0644\u0627\u0646." })
    ] }) });
  }
  const isCampaign = job.recordType === "campaign";
  const isJobBoard = isCampaign && !selectedRoleId;
  const activeRole = isCampaign && selectedRoleId ? job.roles?.find((r) => r.id === selectedRoleId) : job.roles && job.roles.length > 0 ? job.roles[0] : null;
  const displayTitle = isJobBoard ? job.campaignTitle || job.title : activeRole?.title || job.title;
  const displayCompany = job.company;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-screen bg-slate-100 pt-32 pb-20 px-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_react2.motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl overflow-hidden border border-white dark:border-slate-700",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-10 md:p-16 bg-navy text-white relative overflow-hidden", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative z-10", children: [
            isCampaign && selectedRoleId && onBackToCampaign && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: onBackToCampaign,
                className: "mb-8 flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm w-fit",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowRight, { size: 16 }),
                  " \u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0648\u0638\u0627\u0626\u0641"
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 mb-8", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-16 h-16 p-0 bg-white dark:bg-slate-800/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white dark:border-slate-700/10 overflow-hidden shrink-0 shadow-sm", children: job.companyLogo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "img",
                {
                  src: job.companyLogo,
                  alt: `\u0634\u0639\u0627\u0631 ${job.company}`,
                  className: "w-full h-full object-cover rounded-[inherit] drop-shadow-sm"
                }
              ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Briefcase, { size: 16, className: "text-primary opacity-80" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-300 font-bold text-sm drop-shadow-sm", children: displayCompany }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 backdrop-blur-sm", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ShieldCheck, { size: 12, className: job.entityType === "freelance" ? "text-blue-400" : "text-emerald-400" }),
                    job.entityType === "freelance" ? "\u0645\u0633\u062A\u0642\u0644 \u0645\u0639\u062A\u0645\u062F" : "\u0645\u0624\u0633\u0633\u0629 \u0645\u0639\u062A\u0645\u062F\u0629"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "text-3xl md:text-4xl lg:text-5xl font-black mb-2 leading-tight opacity-90 drop-shadow-sm", children: displayTitle })
              ] })
            ] }),
            isJobBoard && (job.campaignDescription || job.description) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 mb-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-300 text-lg font-medium leading-relaxed whitespace-pre-wrap text-center max-w-4xl mx-auto", children: job.campaignDescription || job.description }) }),
            !isJobBoard && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap items-center gap-3 mt-4", children: [
              (activeRole?.type || job.type) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Clock, { size: 16, className: "text-white/80 shrink-0" }),
                " ",
                activeRole?.type || job.type
              ] }),
              (activeRole?.locations?.length ? activeRole.locations : job.locations?.length ? job.locations : activeRole?.location || job.location ? [activeRole?.location || job.location] : []).map((loc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { size: 16, className: "text-white/80 shrink-0" }),
                " ",
                loc
              ] }, idx)),
              (activeRole?.experience || job.experience) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Briefcase, { size: 16, className: "text-white/80 shrink-0" }),
                " ",
                activeRole?.experience || job.experience
              ] }),
              (activeRole?.qualification || job.qualification) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.FileText, { size: 16, className: "text-white/80 shrink-0" }),
                " ",
                activeRole?.qualification || job.qualification
              ] }),
              !(activeRole?.isSalaryHidden ?? job.isSalaryHidden) && (activeRole?.salaryMin || job.salaryMin) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center justify-center gap-2 bg-emerald-500/20 px-5 py-2.5 rounded-xl border border-emerald-400/40 text-sm font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] backdrop-blur-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CreditCard, { size: 16, className: "shrink-0 text-emerald-400" }),
                activeRole?.salaryMin || job.salaryMin,
                " ",
                activeRole?.salaryMax || job.salaryMax ? `- ${activeRole?.salaryMax || job.salaryMax}` : "",
                " \u0631\u064A\u0627\u0644"
              ] }),
              job.createdAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center justify-center gap-2 bg-white/5 px-5 py-2.5 rounded-xl border border-white/10 text-sm font-bold shadow-sm backdrop-blur-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Calendar, { size: 16, className: "text-white/60 shrink-0" }),
                " \u0646\u064F\u0634\u0631 \u0641\u064A ",
                job.createdAt
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-10 md:p-16 space-y-12", children: isJobBoard ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-2xl font-bold text-navy dark:text-white mb-8 flex items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-8 bg-primary rounded-full" }),
            " \u0627\u0644\u0641\u0631\u0635 \u0627\u0644\u0648\u0638\u064A\u0641\u064A\u0629 \u0627\u0644\u0645\u062A\u0627\u062D\u0629"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: job.roles?.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "button",
            {
              onClick: () => onSelectRole?.(role.id),
              className: "group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary/30 transition-all text-right flex flex-col items-start gap-4",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-full flex justify-between items-start gap-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "text-xl font-bold text-navy dark:text-white group-hover:text-primary transition-colors", children: role.title }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowRight, { size: 18, className: "-rotate-135" }) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap items-center gap-2", children: [
                  (role.locations?.length ? role.locations : role.location ? [role.location] : []).map((loc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { size: 14 }),
                    " ",
                    loc
                  ] }, idx)),
                  role.type && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-xs font-bold text-blue-600 dark:text-blue-400", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Clock, { size: 14 }),
                    " ",
                    role.type
                  ] }),
                  !role.isSalaryHidden && role.salaryMin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-xs font-bold text-emerald-600 dark:text-emerald-400", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CreditCard, { size: 14 }),
                    " ",
                    role.salaryMin,
                    " ",
                    role.salaryMax ? `- ${role.salaryMax}` : "",
                    " \u0631\u064A\u0627\u0644"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-primary", children: "\u0627\u0644\u062A\u0642\u062F\u064A\u0645 \u0639\u0644\u0649 \u0647\u0630\u0647 \u0627\u0644\u0648\u0638\u064A\u0641\u0629" }) })
              ]
            },
            role.id
          )) })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          job.recordType !== "campaign" && job.campaignDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-primary/5 border border-primary/20 rounded-[28px] p-8 -mt-4 mb-8 text-center shadow-sm", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-navy dark:text-white font-medium text-lg leading-relaxed", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "inline-block mr-2 -mt-1 text-primary", size: 24 }),
            " ",
            job.campaignDescription
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pb-8", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1.5 h-6 bg-primary rounded-full" }),
              " \u0646\u0628\u0630\u0629 \u0639\u0646 \u0627\u0644\u062F\u0648\u0631"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap text-base", children: activeRole?.roleSummary || job.roleSummary || activeRole?.description || job.description })
          ] }),
          ((activeRole?.targetMajors?.length ?? 0) > 0 || (job.targetMajors?.length ?? 0) > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-8 border-t border-slate-100 dark:border-slate-700 pb-8", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1.5 h-6 bg-primary rounded-full" }),
              " \u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2", children: (activeRole?.targetMajors || job.targetMajors || []).map((major, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-flex items-center px-4 py-2 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-100/50 dark:border-blue-800/20 shadow-sm transition-all hover:-translate-y-0.5", children: major }, i)) })
          ] }),
          (activeRole?.responsibilities || job.responsibilities) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-8 border-t border-slate-100 dark:border-slate-700 pb-8", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1.5 h-6 bg-primary rounded-full" }),
              " \u0627\u0644\u0645\u0647\u0627\u0645 \u0648\u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0627\u062A"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "space-y-3 list-none", children: (activeRole?.responsibilities || job.responsibilities || "").split("\n").filter((r) => r.trim()).map((res, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "flex gap-3 items-start text-slate-600 dark:text-slate-300 font-medium text-base", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle, { size: 12 }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "leading-relaxed", children: res.trim() })
            ] }, i)) })
          ] }),
          activeRole?.qualifications || job.qualifications || activeRole?.skills?.length || job.skills?.length || activeRole?.languages?.length || job.languages?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-8 border-t border-slate-100 dark:border-slate-700 pb-8", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1.5 h-6 bg-primary rounded-full" }),
              " \u0627\u0644\u0645\u0624\u0647\u0644\u0627\u062A \u0648\u0627\u0644\u0645\u062A\u0637\u0644\u0628\u0627\u062A"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
              (activeRole?.qualifications || job.qualifications) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "space-y-3 list-none", children: (activeRole?.qualifications || job.qualifications || "").split("\n").filter((q) => q.trim()).map((qual, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "flex gap-3 items-start text-slate-600 dark:text-slate-300 font-medium text-base", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-2.5 shrink-0" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "leading-relaxed", children: qual.trim() })
              ] }, i)) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-2", children: [
                activeRole?.skills?.length || job.skills?.length ? (activeRole?.skills || job.skills || []).map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 transition-colors", children: skill }, skill)) : null,
                activeRole?.languages?.length || job.languages?.length ? (activeRole?.languages || job.languages || []).map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 transition-colors", children: lang }, lang)) : null
              ] })
            ] })
          ] }) : null,
          (activeRole?.benefits || job.benefits) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-8 border-t border-slate-100 dark:border-slate-700 pb-8", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1.5 h-6 bg-primary rounded-full" }),
              " \u0627\u0644\u0645\u0645\u064A\u0632\u0627\u062A"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2", children: (activeRole?.benefits || job.benefits || "").split("\n").filter((b) => b.trim()).map((ben, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-medium border border-emerald-100/50 dark:border-emerald-800/20 flex items-center gap-1.5 transition-colors", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Star, { size: 14, className: "text-emerald-500/70" }),
              " ",
              ben.trim()
            ] }, i)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-8 border-t border-slate-100 dark:border-slate-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: onApply, className: "w-full bg-primary text-white py-5 rounded-2xl text-lg font-bold hover:bg-teal-600 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]", children: "\u0627\u0644\u062A\u0642\u062F\u064A\u0645 \u0639\u0644\u0649 \u0647\u0630\u0647 \u0627\u0644\u0648\u0638\u064A\u0641\u0629 \u0627\u0644\u0622\u0646" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-center text-slate-400 dark:text-slate-500 mt-4 text-sm font-medium", children: "\u064A\u062A\u0645 \u0641\u0631\u0632 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0622\u0644\u064A\u0627\u064B \u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u0634\u0641\u0627\u0641\u064A\u0629 \u0648\u0633\u0631\u0639\u0629 \u0627\u0644\u0631\u062F" })
          ] })
        ] }) })
      ]
    }
  ) }) });
};
var ManageJob = ({
  job,
  onBack,
  onUpdate,
  onDelete,
  onClone
}) => {
  const [activeTab, setActiveTab] = (0, import_react.useState)("\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644");
  const isLocked = job.status === "\u0646\u0634\u0637" && job.applicants > 0;
  const [title, setTitle] = (0, import_react.useState)(job.title || job.campaignTitle || "");
  const [company, setCompany] = (0, import_react.useState)(job.company || "");
  const [location, setLocation] = (0, import_react.useState)(job.location || "");
  const [experience, setExperience] = (0, import_react.useState)(job.experience || "\u0628\u062F\u0648\u0646 \u062E\u0628\u0631\u0629");
  const [qualification, setQualification] = (0, import_react.useState)(job.qualification || "\u062B\u0627\u0646\u0648\u064A");
  const [salaryMin, setSalaryMin] = (0, import_react.useState)(job.salaryMin || "");
  const [salaryMax, setSalaryMax] = (0, import_react.useState)(job.salaryMax || "");
  const [isSalaryHidden, setIsSalaryHidden] = (0, import_react.useState)(job.isSalaryHidden || false);
  const [type, setType] = (0, import_react.useState)(job.type || "\u062F\u0648\u0627\u0645 \u0643\u0627\u0645\u0644");
  const [description, setDescription] = (0, import_react.useState)(job.description || job.campaignDescription || "");
  const [status, setStatus] = (0, import_react.useState)(job.status || "\u0646\u0634\u0637");
  const defaultStart = (/* @__PURE__ */ new Date()).toISOString().slice(0, 16);
  const defaultEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString().slice(0, 16);
  const [startDate, setStartDate] = (0, import_react.useState)(job.startDate || defaultStart);
  const [endDate, setEndDate] = (0, import_react.useState)(job.endDate || defaultEnd);
  const [isOpenEnded, setIsOpenEnded] = (0, import_react.useState)(!job.endDate);
  const [selectedSkills, setSelectedSkills] = (0, import_react.useState)(
    Array.isArray(job.skills) ? job.skills : typeof job.skills === "string" ? [job.skills] : []
  );
  const [selectedLanguages, setSelectedLanguages] = (0, import_react.useState)(
    Array.isArray(job.languages) ? job.languages : typeof job.languages === "string" ? [job.languages] : []
  );
  const [customSkill, setCustomSkill] = (0, import_react.useState)("");
  const [showVerificationModal, setShowVerificationModal] = (0, import_react.useState)(false);
  const [responsibilities, setResponsibilities] = (0, import_react.useState)(job.responsibilities || "");
  const [targetMajors, setTargetMajors] = (0, import_react.useState)(job.targetMajors || []);
  const [customMajor, setCustomMajor] = (0, import_react.useState)("");
  const [customQuestions, setCustomQuestions] = (0, import_react.useState)(job.customQuestions || []);
  const [knockoutQuestions, setKnockoutQuestions] = (0, import_react.useState)(job.knockoutQuestions || []);
  const getSuggestions = () => {
    const normalizedTitle = title ? title.trim() : "";
    if (!normalizedTitle) return [];
    const matchedSkills = /* @__PURE__ */ new Set();
    for (const [key, skills] of Object.entries(import_Shared.skillsDictionary)) {
      if (normalizedTitle.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTitle.toLowerCase())) {
        if (Array.isArray(skills)) skills.forEach((s) => matchedSkills.add(s));
      }
    }
    const userSaved = (0, import_Shared.getUserSavedSkills)();
    for (const [key, skills] of Object.entries(userSaved)) {
      if (normalizedTitle.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTitle.toLowerCase())) {
        if (Array.isArray(skills)) {
          skills.forEach((s) => matchedSkills.add(s));
        } else if (typeof skills === "string") {
          matchedSkills.add(skills);
        }
      }
    }
    const suggestions = Array.from(matchedSkills);
    return suggestions.filter((s) => !selectedSkills.includes(s));
  };
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  const addCustomSkill = (e) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill("");
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isOpenEnded && endDate && new Date(endDate) <= new Date(startDate)) {
      alert("\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621 \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0628\u0639\u062F \u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0628\u062F\u0621");
      return;
    }
    const updatedJob = {
      ...job,
      title,
      company,
      location,
      experience,
      qualification,
      salaryMin,
      salaryMax,
      isSalaryHidden,
      type,
      description,
      status,
      skills: selectedSkills,
      languages: selectedLanguages,
      targetMajors,
      responsibilities,
      customQuestions,
      knockoutQuestions,
      startDate,
      endDate: isOpenEnded ? void 0 : endDate
    };
    try {
      await fetch(
        "https://circular-struggle-ethical-membership.trycloudflare.com/webhook-test/2489027f-d077-4af4-9d3d-fc0dd9f38953",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "UpdateJob", ...updatedJob })
        }
      );
    } catch (error) {
      console.error("Webhook error:", error);
    }
    (0, import_Shared.saveUserSkills)(title, selectedSkills);
    onUpdate(updatedJob);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "min-h-screen bg-slate-100 dark:bg-slate-900 p-8 pt-24 lg:pt-10", children: [
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto relative z-[100]", children: [
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-10 relative z-[100]", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.preventDefault();
              onBack();
            },
            className: "flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary font-bold transition-colors group",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white flex items-center justify-center group-hover:border-primary transition-all", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowLeft, { size: 18, className: "rotate-180" }) }),
              "\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645"
            ]
          }
        ),
        onClone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            onClick: () => onClone(job),
            className: "flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm",
            title: "\u0646\u0633\u062E \u0628\u064A\u0627\u0646\u0627\u062A \u0647\u0630\u0647 \u0627\u0644\u0648\u0638\u064A\u0641\u0629 \u0644\u0625\u0646\u0634\u0627\u0621 \u0645\u0633\u0648\u062F\u0629 \u062C\u062F\u064A\u062F\u0629",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
              ] }),
              "\u062A\u0643\u0631\u0627\u0631 \u0627\u0644\u0648\u0638\u064A\u0641\u0629"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "lg:col-span-2 space-y-8", children: [
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            import_react2.motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              className: "bg-white dark:bg-slate-800 p-8 rounded-3xl border border-white dark:border-slate-700 shadow-xl shadow-slate-200/50",
              children: [
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { className: "text-3xl font-bold text-navy dark:text-white mb-6", children: [
                  "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0648\u0638\u064A\u0641\u0629: ",
                  job.title
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex gap-4 border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar pb-0", children: ["\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644", "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0641\u0631\u0632", "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A"].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "button",
                  {
                    type: "button",
                    onClick: () => setActiveTab(tab),
                    className: `pb-4 font-bold text-lg px-4 border-b-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`,
                    children: [
                      tab,
                      tab === "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0641\u0631\u0632" && isLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { size: 14, className: "inline-block ml-2 text-amber-500" })
                    ]
                  },
                  tab
                )) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: handleUpdate, className: "space-y-6", children: [
                  isLocked && activeTab === "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0641\u0631\u0632" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-amber-50 dark:bg-amber-900/20 border-r-4 border-amber-500 p-4 rounded-l-xl mb-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-amber-700 dark:text-amber-400 font-bold flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { size: 18 }),
                    " \u062A\u0645 \u0642\u0641\u0644 \u062A\u0639\u062F\u064A\u0644 \u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0641\u0631\u0632 \u0644\u0648\u062C\u0648\u062F \u0645\u062A\u0642\u062F\u0645\u064A\u0646\u060C \u0648\u0630\u0644\u0643 \u0644\u0644\u062D\u0641\u0627\u0638 \u0639\u0644\u0649 \u062F\u0642\u0629 \u062A\u0645 \u062A\u0642\u064A\u064A\u0645 \u0646\u0638\u0627\u0645 \u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0622\u0644\u064A. \u0644\u062A\u0639\u062F\u064A\u0644\u0647\u0627 \u064A\u0631\u062C\u0649 \u062A\u0643\u0631\u0627\u0631 \u0627\u0644\u0648\u0638\u064A\u0641\u0629."
                  ] }) }),
                  activeTab === "\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react2.motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "space-y-6", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1", children: [
                          "\u0627\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u0648\u0638\u064A\u0641\u064A ",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium", required: true })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1", children: [
                          "\u0627\u0644\u0634\u0631\u0643\u0629 / \u0627\u0644\u0641\u0631\u0639 ",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "text", value: company, onChange: (e) => setCompany(e.target.value), className: "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium", required: true })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1", children: [
                        "\u0646\u0628\u0630\u0629 \u0639\u0646 \u0627\u0644\u062F\u0648\u0631 ",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400 font-normal text-xs ml-1", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "relative group inline-flex items-center ml-1", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { size: 14, className: "text-slate-400 group-hover:text-primary transition-colors cursor-help" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none", children: [
                            "\u062A\u0631\u0643 \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u0641\u0627\u0631\u063A\u0627\u064B \u0633\u064A\u062C\u0639\u0644 \u0645\u062D\u0631\u0643 \u0646\u0638\u0627\u0645 \u0627\u0644\u0641\u0631\u0632 \u064A\u0639\u062A\u0645\u062F \u0639\u0644\u0649 \u0627\u0644\u0645\u0639\u0627\u064A\u064A\u0631 \u0627\u0644\u0642\u064A\u0627\u0633\u064A\u0629 \u0644\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u0648\u0638\u064A\u0641\u064A. \u0644\u062A\u0642\u064A\u064A\u0645 \u0623\u062F\u0642\u060C \u0623\u0636\u0641 \u0646\u0628\u0630\u0629 \u0645\u062E\u062A\u0635\u0631\u0629.",
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5" })
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { rows: 5, value: description, onChange: (e) => setDescription(e.target.value), className: "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-none", placeholder: "\u0645\u062B\u0627\u0644: \u0646\u0628\u062D\u062B \u0639\u0646 \u0645\u0648\u0638\u0641 \u0637\u0645\u0648\u062D \u0644\u0625\u062F\u0627\u0631\u0629 \u0639\u0644\u0627\u0642\u0627\u062A \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0641\u064A \u0641\u0631\u0639\u0646\u0627 \u0627\u0644\u0631\u0626\u064A\u0633\u064A..." })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1", children: [
                        "\u0627\u0644\u0645\u0647\u0627\u0645 \u0648\u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0627\u062A ",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400 font-normal text-xs ml-1", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "relative group inline-flex items-center ml-1", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { size: 14, className: "text-slate-400 group-hover:text-primary transition-colors cursor-help" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none", children: [
                            "\u064A\u0641\u0636\u0644 \u0625\u0636\u0627\u0641\u062A\u0647\u0627 \u0641\u064A \u0634\u0643\u0644 \u0646\u0642\u0627\u0637 \u0644\u0644\u0648\u0638\u0627\u0626\u0641 \u0627\u0644\u0625\u062F\u0627\u0631\u064A\u0629 \u0623\u0648 \u0627\u0644\u0645\u062A\u062E\u0635\u0635\u0629 \u0644\u0631\u0641\u0639 \u062F\u0642\u0629 \u0645\u0637\u0627\u0628\u0642\u0629 \u0646\u0638\u0627\u0645 \u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0622\u0644\u064A.",
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5" })
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { rows: 4, value: responsibilities, onChange: (e) => setResponsibilities(e.target.value), className: "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-none", placeholder: "\u0645\u062B\u0627\u0644: - \u062A\u062D\u0642\u064A\u0642 \u0623\u0647\u062F\u0627\u0641 \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A \u0627\u0644\u0634\u0647\u0631\u064A\u0629. - \u0625\u0639\u062F\u0627\u062F \u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u0623\u062F\u0627\u0621..." })
                    ] })
                  ] }),
                  activeTab === "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0641\u0631\u0632" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react2.motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: `space-y-6 ${isLocked ? "opacity-80" : ""}`, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1", children: [
                          "\u0633\u0646\u0648\u0627\u062A \u0627\u0644\u062E\u0628\u0631\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 ",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { disabled: isLocked, value: experience, onChange: (e) => setExperience(e.target.value), className: "w-full px-4 py-3 bg-slate-50 disabled:bg-slate-100 disabled:opacity-70 dark:bg-slate-800/50 dark:disabled:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-navy dark:text-white cursor-pointer disabled:cursor-not-allowed", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0628\u062F\u0648\u0646 \u062E\u0628\u0631\u0629" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "1-3 \u0633\u0646\u0648\u0627\u062A" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "3-5 \u0633\u0646\u0648\u0627\u062A" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "5+ \u0633\u0646\u0648\u0627\u062A" })
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1", children: [
                          "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0644\u0645\u0624\u0647\u0644 ",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { disabled: isLocked, required: true, value: qualification, onChange: (e) => setQualification(e.target.value), className: "w-full px-4 py-3 bg-slate-50 disabled:bg-slate-100 disabled:opacity-70 dark:bg-slate-800/50 dark:disabled:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-navy dark:text-white cursor-pointer disabled:cursor-not-allowed", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u062B\u0627\u0646\u0648\u064A" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u062F\u0628\u0644\u0648\u0645" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0628\u0643\u0627\u0644\u0648\u0631\u064A\u0648\u0633" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0645\u0627\u062C\u0633\u062A\u064A\u0631" })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white flex items-center gap-1 mb-2", children: [
                        "\u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0647\u062F\u0641\u0629 ",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400 font-normal ml-1 text-xs", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "relative group inline-flex items-center ml-1", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { size: 14, className: "text-slate-400 group-hover:text-primary transition-colors cursor-help" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none", children: [
                            "\u0627\u062A\u0631\u0643 \u0627\u0644\u062D\u0642\u0644 \u0641\u0627\u0631\u063A\u0627\u064B \u0625\u0630\u0627 \u0643\u0627\u0646\u062A \u0627\u0644\u0648\u0638\u064A\u0641\u0629 \u062A\u0642\u0628\u0644 \u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A \u0644\u062A\u0648\u0633\u064A\u0639 \u0646\u0637\u0627\u0642 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646 \u0641\u064A \u0646\u0638\u0627\u0645 \u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0622\u0644\u064A.",
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5" })
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2 mb-3", children: targetMajors.map((major) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-xl text-sm flex items-center gap-2 ${isLocked ? "opacity-80" : ""}`, children: [
                        major,
                        " ",
                        !isLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: () => setTargetMajors(targetMajors.filter((l) => l !== major)), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 12 }) })
                      ] }, major)) }),
                      !isLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "text", value: customMajor, onChange: (e) => setCustomMajor(e.target.value), onKeyDown: (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (customMajor.trim() && !targetMajors.includes(customMajor.trim())) {
                              setTargetMajors([...targetMajors, customMajor.trim()]);
                              setCustomMajor("");
                            }
                          }
                        }, placeholder: "\u0623\u0636\u0641 \u062A\u062E\u0635\u0635\u0627\u064B \u0648\u0627\u0636\u063A\u0637 Enter...", className: "w-full pr-5 pl-12 py-3 bg-slate-50 border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 rounded-xl outline-none dark:text-white text-sm" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: () => {
                          if (customMajor.trim() && !targetMajors.includes(customMajor.trim())) {
                            setTargetMajors([...targetMajors, customMajor.trim()]);
                            setCustomMajor("");
                          }
                        }, className: "absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 p-1 hover:text-primary", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 18 }) })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700 relative", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white flex items-center gap-1 mb-2", children: [
                        "\u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062A \u0648\u0627\u0644\u062A\u0641\u0636\u064A\u0644\u0627\u062A ",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400 font-normal ml-1 text-xs", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "relative group inline-flex items-center ml-1", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { size: 14, className: "text-slate-400 group-hover:text-primary transition-colors cursor-help" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none", children: [
                            "\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0642\u0646\u064A\u0629 \u0627\u0644\u062F\u0642\u064A\u0642\u0629 \u064A\u062C\u0639\u0644 \u0646\u0638\u0627\u0645 \u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0622\u0644\u064A \u0623\u0643\u062B\u0631 \u0635\u0631\u0627\u0645\u0629 \u0648\u062F\u0642\u0629.",
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5" })
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-2 min-h-[60px] p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl", children: [
                        selectedSkills.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-sm text-slate-400 py-2", children: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u062E\u062A\u064A\u0627\u0631 \u0645\u0647\u0627\u0631\u0627\u062A..." }),
                        selectedSkills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm ${isLocked ? "opacity-80" : ""}`, children: [
                          skill,
                          " ",
                          !isLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: () => toggleSkill(skill), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 14 }) })
                        ] }, skill))
                      ] }),
                      !isLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "text", value: customSkill, onChange: (e) => setCustomSkill(e.target.value), onKeyDown: (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomSkill(e);
                          }
                        }, placeholder: "\u0623\u0636\u0641 \u0645\u0647\u0627\u0631\u0629...", className: "w-full pr-5 pl-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none focus:border-primary transition-all" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: addCustomSkill, className: "absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 p-1 hover:text-primary", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 18 }) })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3 pt-6 border-t border-slate-100 dark:border-slate-700", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 block", children: [
                        "\u0627\u0644\u0644\u063A\u0627\u062A \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 ",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400 font-normal ml-1", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2 mb-2", children: selectedLanguages.map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `bg-primary text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm ${isLocked ? "opacity-80" : ""}`, children: [
                        lang,
                        !isLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: () => setSelectedLanguages(selectedLanguages.filter((l) => l !== lang)), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 12 }) })
                      ] }, lang)) }),
                      !isLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                        "select",
                        {
                          value: "",
                          onChange: (e) => {
                            const val = e.target.value;
                            if (val && !selectedLanguages.includes(val)) {
                              setSelectedLanguages([...selectedLanguages, val]);
                            }
                          },
                          className: "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium appearance-none cursor-pointer",
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", disabled: true, className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0627\u062E\u062A\u0631 \u0644\u063A\u0629 \u0644\u0625\u0636\u0627\u0641\u062A\u0647\u0627..." }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", value: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", children: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", value: "\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629", children: "\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", value: "\u0627\u0644\u0641\u0631\u0646\u0633\u064A\u0629", children: "\u0627\u0644\u0641\u0631\u0646\u0633\u064A\u0629" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", value: "\u0627\u0644\u0625\u0633\u0628\u0627\u0646\u064A\u0629", children: "\u0627\u0644\u0625\u0633\u0628\u0627\u0646\u064A\u0629" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", value: "\u0627\u0644\u0647\u0646\u062F\u064A\u0629", children: "\u0627\u0644\u0647\u0646\u062F\u064A\u0629" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", value: "\u0627\u0644\u0623\u0648\u0631\u062F\u0648", children: "\u0627\u0644\u0623\u0648\u0631\u062F\u0648" })
                          ]
                        }
                      ) })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 block flex items-center gap-2", children: [
                        "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u062A\u0642\u064A\u064A\u0645\u064A\u0629 \u0644\u0644\u0627\u0633\u062A\u0628\u0639\u0627\u062F",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-200 dark:border-amber-800/50 flex items-center gap-1", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { size: 10 }),
                          " \u0644\u0644\u0642\u0631\u0627\u0621\u0629 \u0641\u0642\u0637"
                        ] })
                      ] }),
                      knockoutQuestions.length === 0 && customQuestions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl font-medium border border-slate-200 dark:border-slate-700", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0633\u0626\u0644\u0629 \u0645\u0636\u0627\u0641\u0629." }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                        knockoutQuestions.map((kq, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl relative", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { size: 14, className: "absolute left-4 top-4 text-slate-400" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-bold text-sm text-navy dark:text-white pr-2 border-r-4 border-red-400 mb-2", children: kq.text }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 px-2 py-1 rounded inline-block", children: [
                            "\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0627\u0633\u062A\u0628\u0639\u0627\u062F \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629: ",
                            kq.requiredAnswer
                          ] })
                        ] }, idx)),
                        customQuestions.map((q, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl relative", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { size: 14, className: "absolute left-4 top-4 text-slate-400" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-bold text-sm text-navy dark:text-white pr-2 border-r-4 border-primary mb-2", children: q.text }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded inline-block", children: [
                            q.type,
                            " - ",
                            q.required ? "\u0625\u0644\u0632\u0627\u0645\u064A" : "\u0627\u062E\u062A\u064A\u0627\u0631\u064A"
                          ] })
                        ] }, idx))
                      ] })
                    ] })
                  ] }),
                  activeTab === "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react2.motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "space-y-6", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1", children: [
                          "\u0646\u0648\u0639 \u0627\u0644\u0639\u0645\u0644 ",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: type, onChange: (e) => setType(e.target.value), className: "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "\u062F\u0648\u0627\u0645 \u0643\u0627\u0645\u0644" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "\u062F\u0648\u0627\u0645 \u062C\u0632\u0626\u064A" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "\u0639\u0646 \u0628\u0639\u062F" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "\u062A\u062F\u0631\u064A\u0628" })
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1", children: [
                          "\u0645\u0642\u0631 \u0627\u0644\u0639\u0645\u0644 (\u0627\u0644\u0645\u062F\u064A\u0646\u0629) ",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "text", value: location, onChange: (e) => setLocation(e.target.value), className: "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-navy dark:text-white font-medium", required: true })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white flex items-center gap-2", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Calendar, { size: 18, className: "text-primary" }),
                          " \u0625\u0639\u0644\u0627\u0646 \u0645\u0633\u062A\u0645\u0631 (\u0645\u0641\u062A\u0648\u062D \u062F\u0627\u0626\u0645\u0627\u064B)"
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "relative inline-flex items-center cursor-pointer shrink-0", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", className: "sr-only peer", checked: isOpenEnded, onChange: (e) => setIsOpenEnded(e.target.checked) }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary" })
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-navy dark:text-white mr-2", children: "\u0628\u062F\u0621 \u0627\u0644\u062A\u0642\u062F\u064A\u0645" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "datetime-local", lang: "en", style: { fontFamily: "Arial" }, value: startDate, onChange: (e) => setStartDate(e.target.value), className: "w-full px-4 py-3 bg-slate-50 outline-none rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 text-navy dark:text-white font-medium", dir: "ltr" })
                        ] }),
                        !isOpenEnded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-navy dark:text-white mr-2", children: "\u0627\u0646\u062A\u0647\u0627\u0621 \u0627\u0644\u062A\u0642\u062F\u064A\u0645" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "datetime-local", lang: "en", style: { fontFamily: "Arial" }, value: endDate, onChange: (e) => setEndDate(e.target.value), className: "w-full px-4 py-3 bg-slate-50 outline-none rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 text-navy dark:text-white font-medium", dir: "ltr" })
                        ] })
                      ] }),
                      isOpenEnded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-slate-500 font-bold bg-primary/5 p-3 rounded-xl border border-primary/10 mt-2 flex items-center gap-2", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { size: 16, className: "text-primary" }),
                        " \u0633\u064A\u0628\u0642\u0649 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0645\u062A\u0627\u062D\u0627\u064B \u0644\u0644\u062A\u0642\u062F\u064A\u0645 \u062D\u062A\u0649 \u064A\u062A\u0645 \u0625\u063A\u0644\u0627\u0642\u0647 \u064A\u062F\u0648\u064A\u0627\u064B."
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-2 block", children: [
                        "\u0646\u0637\u0627\u0642 \u0627\u0644\u0631\u0627\u062A\u0628 \u0627\u0644\u0645\u062A\u0648\u0642\u0639 (\u0631\u064A\u0627\u0644) ",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-normal text-slate-400 ml-1", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", placeholder: "\u0645\u0646...", value: salaryMin, onChange: (e) => setSalaryMin(e.target.value), className: "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 outline-none rounded-xl border border-slate-200 dark:border-slate-700 text-navy dark:text-white font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-sans" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-slate-400", children: "-" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", placeholder: "\u0625\u0644\u0649...", value: salaryMax, onChange: (e) => setSalaryMax(e.target.value), className: "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 outline-none rounded-xl border border-slate-200 dark:border-slate-700 text-navy dark:text-white font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-sans" })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "relative inline-flex items-center cursor-pointer select-none mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", className: "sr-only peer", checked: isSalaryHidden, onChange: (e) => setIsSalaryHidden(e.target.checked) }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-3 text-sm font-bold text-slate-700 dark:text-slate-300", children: "\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0631\u0627\u062A\u0628 \u0639\u0646 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646 (\u064A\u064F\u0633\u062A\u062E\u062F\u0645 \u0644\u0644\u0641\u0631\u0632 \u0627\u0644\u0622\u0644\u064A \u0641\u0642\u0637)" })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 mt-8 shadow-sm", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center transition-all ${status === "\u0646\u0634\u0637" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle, { size: 24 }) }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "font-bold text-navy dark:text-white text-lg", children: [
                            "\u062D\u0627\u0644\u0629 \u0627\u0644\u0625\u0639\u0644\u0627\u0646: ",
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: status === "\u0646\u0634\u0637" ? "text-green-600 dark:text-green-400" : "", children: status })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xs font-bold text-slate-500 dark:text-slate-400 mt-1", children: [
                            "\u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u0628\u062F\u064A\u0644 \u0625\u0644\u0649 ",
                            status === "\u0646\u0634\u0637" ? "\u0645\u063A\u0644\u0642" : "\u0646\u0634\u0637"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: () => setStatus(status === "\u0646\u0634\u0637" ? "\u0645\u063A\u0644\u0642" : "\u0646\u0634\u0637"), className: `w-16 h-8 rounded-full relative transition-all shadow-inner focus:outline-none focus:ring-4 focus:ring-primary/20 ${status === "\u0646\u0634\u0637" ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${status === "\u0646\u0634\u0637" ? "left-1" : "left-9"}` }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "submit", className: "w-full bg-primary text-white py-4 mt-8 rounded-2xl text-lg font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Save, { size: 22 }),
                    " \u062D\u0641\u0638 \u0648\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A"
                  ] })
                ] })
              ]
            }
          ),
          " "
        ] }),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-8", children: [
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-slate-800 p-6 rounded-3xl border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40", children: [
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-bold text-navy dark:text-white mb-6", children: "\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0633\u0631\u064A\u0639\u0629" }),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700", children: [
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-slate-400 dark:text-slate-500 font-bold mb-1", children: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-navy dark:text-white", children: job.applicants }),
                " "
              ] }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700", children: [
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-slate-400 dark:text-slate-500 font-bold mb-1", children: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0646\u0634\u0631" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg font-bold text-navy dark:text-white", children: job.createdAt }),
                " "
              ] }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700", children: [
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-slate-400 dark:text-slate-500 font-bold mb-1", children: "\u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0642\u062F\u064A\u0645" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "button",
                  {
                    onClick: () => {
                      navigator.clipboard.writeText(
                        `/apply/${job.id}`
                      );
                      alert("\u062A\u0645 \u0646\u0633\u062E \u0627\u0644\u0631\u0627\u0628\u0637");
                    },
                    className: "text-primary text-sm font-bold flex items-center gap-2 hover:underline",
                    children: [
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Share2, { size: 16 }),
                      " \u0646\u0633\u062E \u0627\u0644\u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0628\u0627\u0634\u0631",
                      " "
                    ]
                  }
                ),
                " "
              ] }),
              " "
            ] }),
            " "
          ] }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-navy text-white p-6 rounded-3xl shadow-xl shadow-navy/20", children: [
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6", children: [
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Zap, { size: 24 }),
              " "
            ] }),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-bold mb-2", children: "\u0627\u0644\u0647\u062F\u0641 \u0627\u0644\u062A\u062D\u0644\u064A\u0644\u064A \u0627\u0644\u0646\u0634\u0637" }),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-slate-400 dark:text-slate-500 text-sm leading-relaxed mb-6", children: [
              " ",
              "\u064A\u0642\u0648\u0645 \u0627\u0644\u0646\u0638\u0627\u0645 \u062D\u0627\u0644\u064A\u0627\u064B \u0628\u062A\u062D\u0644\u064A\u0644 ",
              job.applicants,
              " \u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u0634\u0627\u063A\u0631. \u064A\u0645\u0643\u0646\u0643 \u0631\u0624\u064A\u0629 \u0627\u0644\u0646\u062A\u0627\u0626\u062C \u0641\u064A \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0631\u0634\u062D\u064A\u0646.",
              " "
            ] }),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "w-full py-3 bg-white dark:bg-white/20 hover:bg-white/90 dark:hover:bg-white/30 text-navy dark:text-white rounded-xl font-bold text-sm transition-all focus:ring-4 focus:ring-primary/20", children: [
              " ",
              "\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u062A\u062D\u0644\u064A\u0644",
              " "
            ] }),
            " "
          ] }),
          " "
        ] }),
        " "
      ] }),
      " "
    ] }),
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_Shared.VerificationModal,
      {
        isOpen: showVerificationModal,
        onClose: () => setShowVerificationModal(false),
        onVerify: () => {
          setShowVerificationModal(false);
          navigator.clipboard.writeText(
            `/apply/${job.id}`
          );
          alert("\u062A\u0645 \u0646\u0633\u062E \u0627\u0644\u0631\u0627\u0628\u0637 \u0648\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062D\u0633\u0627\u0628 \u0628\u0646\u062C\u0627\u062D!");
        }
      }
    )
  ] });
};
var LogoIcon = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "logo-icon w-10 h-10 rounded-[12px] bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center relative shadow-[0_8px_16px_rgba(13,148,136,0.3),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.3)] transition-transform shrink-0", children: [
  " ",
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-[12px]" }),
  " ",
  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "svg",
    {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none",
      className: "relative z-10 drop-shadow-sm ml-0.5 mt-0.5",
      children: [
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "path",
          {
            d: "M10 6H6V18H10",
            stroke: "#064E3B",
            strokeWidth: "2.5",
            strokeLinecap: "square",
            strokeLinejoin: "miter"
          }
        ),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "14", cy: "12", r: "3", fill: "url(#copperGrd)" }),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "radialGradient",
            {
              id: "copperGrd",
              cx: "0",
              cy: "0",
              r: "1",
              gradientUnits: "userSpaceOnUse",
              gradientTransform: "translate(14 12) rotate(90) scale(3)",
              children: [
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", { stopColor: "#FCD34D" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", { offset: "1", stopColor: "#92400E" }),
                " "
              ]
            }
          ),
          " "
        ] }),
        " "
      ]
    }
  ),
  " "
] });
var Navbar = ({
  setStep,
  currentStep
}) => {
  const [isScrolled, setIsScrolled] = import_react.default.useState(false);
  const [activeSection, setActiveSection] = import_react.default.useState("");
  import_react.default.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sections = ["features", "testimonials", "contact"];
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section;
          }
        }
      }
      if (window.scrollY < window.innerHeight / 2) {
        current = "";
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "nav",
    {
      className: `fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${isScrolled ? "bg-white dark:bg-slate-800 shadow-sm py-4" : "bg-transparent dark:bg-transparent dark:text-white py-5"}`,
      children: [
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-6 md:px-12 w-full flex items-center justify-between", children: [
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "a",
            {
              href: "/",
              onClick: (e) => {
                e.preventDefault();
                setStep("landing");
              },
              className: "flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-opacity",
              children: [
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoIcon, {}),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-2xl font-black tracking-tighter text-navy dark:text-white flex items-center pt-1", children: "\u0641\u0631\u0632" }),
                " "
              ]
            }
          ),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "hidden md:flex items-center gap-8", children: [
            " ",
            currentStep === "landing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 text-[15px] font-medium text-slate-800", children: [
              " ",
              [
                { id: "features", label: "\u0627\u0644\u0645\u0645\u064A\u0632\u0627\u062A" },
                { id: "testimonials", label: "\u0634\u0631\u0643\u0627\u0621 \u0627\u0644\u0646\u062C\u0627\u062D" },
                { id: "contact", label: "\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627" }
              ].map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "a",
                {
                  href: `#${link.id}`,
                  className: `px-4 py-2 rounded-lg transition-all ${activeSection === link.id ? "text-primary bg-primary/5 font-bold" : "hover:bg-slate-100 hover:text-primary"}`,
                  children: [
                    " ",
                    link.label,
                    " "
                  ]
                },
                link.id
              )),
              " "
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: [
              " ",
              currentStep === "form" && "\u062E\u0637\u0648\u0629 1: \u062A\u0642\u062F\u064A\u0645 \u0627\u0644\u0637\u0644\u0628",
              " ",
              currentStep === "dashboard" && "\u062E\u0637\u0648\u0629 2: \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0646\u062A\u0627\u0626\u062C",
              " ",
              currentStep === "login" && "\u0628\u0648\u0627\u0628\u0629 \u0623\u0635\u062D\u0627\u0628 \u0627\u0644\u0639\u0645\u0644",
              " ",
              currentStep === "superAdmin" && "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0646\u0638\u0627\u0645",
              " "
            ] }),
            " "
          ] }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4", children: [
            " ",
            currentStep === "landing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: () => setStep("login"),
                className: "text-[15px] font-medium text-slate-800 hover:text-primary hover:bg-slate-100 transition-colors px-4 py-2 rounded-xl",
                children: [
                  " ",
                  "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644",
                  " "
                ]
              }
            ),
            " ",
            currentStep === "dashboard" || currentStep === "superAdmin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: () => setStep("landing"),
                className: "flex items-center gap-2 text-red-500 font-bold text-sm hover:bg-red-50 px-4 py-2 rounded-xl transition-all",
                children: [
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.LogOut, { size: 18 }),
                  " \u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u062A\u062C\u0631\u0628\u0629",
                  " "
                ]
              }
            ) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: () => setStep("registerCompany"),
                className: `bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all shadow-md active:scale-95`,
                children: [
                  " ",
                  "\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628",
                  " "
                ]
              }
            ),
            " "
          ] }),
          " "
        ] }),
        " "
      ]
    }
  );
};
var LoginPage = ({
  onLogin,
  onBack,
  initialMode = "login"
}) => {
  const [mode, setMode] = (0, import_react.useState)(initialMode);
  const [acceptedTerms, setAcceptedTerms] = (0, import_react.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "min-h-screen flex flex-col md:flex-row", children: [
    " ",
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "md:w-1/2 bg-employer-green text-white p-12 flex flex-col justify-center items-center text-center relative overflow-hidden", children: [
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_react2.motion.div,
        {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
          className: "relative z-10 max-w-md",
          children: [
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: onBack,
                className: "mb-10 flex justify-center w-full group cursor-pointer",
                children: [
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoIcon, { className: "group-hover:scale-105 transition-transform" }),
                  " "
                ]
              }
            ),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-4xl font-bold mb-6 leading-tight", children: "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A \u0628\u0648\u0627\u0628\u0629 \u0641\u0631\u0632" }),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xl text-white/80 font-medium leading-relaxed", children: [
              " ",
              mode === "login" ? "\u0623\u062F\u0631 \u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u062A\u0648\u0638\u064A\u0641 \u0628\u0641\u0639\u0627\u0644\u064A\u0629\u060C \u0648\u0641\u0631\u0632 \u0622\u0644\u0627\u0641 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646 \u0628\u0636\u063A\u0637\u0629 \u0632\u0631 \u0648\u0627\u062D\u062F\u0629." : "\u0623\u0646\u0634\u0626 \u062D\u0633\u0627\u0628\u0627\u064B \u062C\u062F\u064A\u062F\u0627\u064B \u0644\u0634\u0631\u0643\u062A\u0643 \u0648\u0627\u0646\u0637\u0644\u0642 \u0646\u062D\u0648 \u062A\u0648\u0638\u064A\u0641 \u0623\u0630\u0643\u0649 \u0648\u0623\u0633\u0631\u0639.",
              " "
            ] }),
            " "
          ]
        }
      ),
      " ",
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-64 h-64 bg-mint/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" }),
      " "
    ] }),
    " ",
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "md:w-1/2 bg-white dark:bg-slate-800 p-12 flex flex-col justify-center items-center relative", children: [
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "button",
        {
          onClick: onBack,
          className: "absolute top-8 right-8 flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors",
          children: [
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowRight, { size: 18 }),
            " \u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0631\u0626\u064A\u0633\u064A\u0629",
            " "
          ]
        }
      ),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_react2.motion.div,
        {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          className: "w-full max-w-md",
          children: [
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mb-12", children: [
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-3xl font-bold text-navy dark:text-white mb-2", children: mode === "login" ? "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" : "\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628 \u0634\u0631\u0643\u0629" }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium", children: mode === "login" ? "\u0623\u062F\u062E\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0634\u0631\u0643\u0629 \u0644\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645" : "\u0633\u062C\u0644 \u0627\u0644\u0622\u0646 \u0648\u0627\u0628\u062F\u0623 \u062A\u062C\u0631\u0628\u062A\u0643 \u0627\u0644\u0645\u062C\u0627\u0646\u064A\u0629 \u0644\u0645\u062F\u0629 14 \u064A\u0648\u0645\u0627\u064B." }),
              " "
            ] }),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "form",
              {
                className: "space-y-6",
                onSubmit: (e) => {
                  e.preventDefault();
                  if (mode === "register" && !acceptedTerms) {
                    alert("\u064A\u0631\u062C\u0649 \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0627\u0644\u0634\u0631\u0648\u0637 \u0648\u0627\u0644\u0623\u062D\u0643\u0627\u0645 \u0623\u0648\u0644\u0627\u064B.");
                    return;
                  }
                  onLogin();
                },
                children: [
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        if (mode === "register" && !acceptedTerms) {
                          alert("\u064A\u0631\u062C\u0649 \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0627\u0644\u0634\u0631\u0648\u0637 \u0648\u0627\u0644\u0623\u062D\u0643\u0627\u0645 \u0623\u0648\u0644\u0627\u064B \u0642\u0628\u0644 \u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0639\u0628\u0631 Google.");
                          return;
                        }
                        onLogin();
                      },
                      className: "w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3 text-slate-700 dark:text-white",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { viewBox: "0 0 24 24", width: "24", height: "24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { transform: "matrix(1, 0, 0, 1, 27.009001, -39.238998)", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { fill: "#4285F4", d: "M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { fill: "#34A853", d: "M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { fill: "#FBBC05", d: "M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { fill: "#EA4335", d: "M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" })
                        ] }) }),
                        mode === "login" ? "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u0648\u0627\u0633\u0637\u0629 Google" : "\u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0628\u0648\u0627\u0633\u0637\u0629 Google"
                      ]
                    }
                  ),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 my-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-slate-200 dark:bg-slate-700" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-sm font-bold text-slate-400 dark:text-slate-500", children: "\u0623\u0648 \u0628\u0627\u0644\u0625\u064A\u0645\u064A\u0644 \u0627\u0644\u062A\u0642\u0644\u064A\u062F\u064A" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-slate-200 dark:bg-slate-700" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-slate-700 dark:text-slate-300 mr-1", children: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0644\u0644\u0634\u0631\u0643\u0629" }),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_lucide_react.Mail,
                        {
                          className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500",
                          size: 20
                        }
                      ),
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "input",
                        {
                          required: true,
                          type: "email",
                          placeholder: "company@example.com",
                          className: "w-full pr-12 pl-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-mint/20 focus:border-mint outline-none transition-all font-medium"
                        }
                      ),
                      " "
                    ] }),
                    " "
                  ] }),
                  " ",
                  mode === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-slate-700 dark:text-slate-300 mr-1", children: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644" }),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_lucide_react.Phone,
                        {
                          className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500",
                          size: 20
                        }
                      ),
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "input",
                        {
                          required: true,
                          type: "tel",
                          dir: "ltr",
                          placeholder: "05xxxxxxxx",
                          className: "w-full pr-12 pl-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-mint/20 focus:border-mint outline-none transition-all text-right font-medium"
                        }
                      ),
                      " "
                    ] }),
                    " "
                  ] }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center px-1", children: [
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-slate-700 dark:text-slate-300", children: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" }),
                      " ",
                      mode === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "button",
                        {
                          type: "button",
                          className: "text-xs font-bold text-employer-green dark:text-green-300 hover:underline",
                          children: "\u0646\u0633\u064A\u062A \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631\u061F"
                        }
                      ),
                      " "
                    ] }),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_lucide_react.Lock,
                        {
                          className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500",
                          size: 20
                        }
                      ),
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "input",
                        {
                          required: true,
                          type: "password",
                          placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                          className: "w-full pr-12 pl-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-mint/20 focus:border-mint outline-none transition-all font-medium"
                        }
                      ),
                      " "
                    ] }),
                    " "
                  ] }),
                  " ",
                  mode === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-start gap-3 pt-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "input",
                      {
                        required: true,
                        type: "checkbox",
                        id: "terms",
                        checked: acceptedTerms,
                        onChange: (e) => setAcceptedTerms(e.target.checked),
                        className: "mt-1 w-5 h-5 rounded border-slate-300 text-primary border-2 focus:ring-primary accent-primary cursor-pointer shrink-0"
                      }
                    ),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "label",
                      {
                        htmlFor: "terms",
                        className: "text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed cursor-pointer select-none",
                        children: [
                          " ",
                          "\u0628\u0625\u0646\u0634\u0627\u0621 \u0647\u0630\u0627 \u0627\u0644\u062D\u0633\u0627\u0628\u060C \u0641\u0625\u0646\u0643 \u062A\u0648\u0627\u0641\u0642 \u0639\u0644\u0649",
                          " ",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                            "a",
                            {
                              href: "#",
                              className: "text-primary font-bold hover:underline",
                              children: "\u0627\u0644\u0634\u0631\u0648\u0637 \u0648\u0627\u0644\u0623\u062D\u0643\u0627\u0645"
                            }
                          ),
                          " ",
                          "\u0648",
                          " ",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                            "a",
                            {
                              href: "#",
                              className: "text-primary font-bold hover:underline",
                              children: "\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629"
                            }
                          ),
                          " ",
                          "\u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0645\u0646\u0635\u0629 \u0641\u0631\u0632.",
                          " "
                        ]
                      }
                    ),
                    " "
                  ] }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "button",
                    {
                      type: "submit",
                      className: "w-full bg-navy text-white py-5 rounded-2xl text-lg font-bold hover:bg-slate-800 transition-all shadow-xl shadow-navy/10 active:scale-[0.96] mt-4",
                      children: [
                        " ",
                        mode === "login" ? "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" : "\u062A\u0623\u0643\u064A\u062F \u0648\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u0633\u0627\u0628",
                        " "
                      ]
                    }
                  ),
                  " "
                ]
              }
            ),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-12 text-center", children: [
              " ",
              mode === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm", children: [
                "\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628\u061F",
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    onClick: () => setMode("register"),
                    className: "text-employer-green dark:text-green-300 font-bold hover:underline",
                    children: "\u0633\u062C\u0644 \u0634\u0631\u0643\u062A\u0643 \u0627\u0644\u0622\u0646"
                  }
                )
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm", children: [
                "\u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628 \u0628\u0627\u0644\u0641\u0639\u0644\u061F",
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    onClick: () => setMode("login"),
                    className: "text-employer-green dark:text-green-300 font-bold hover:underline",
                    children: "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0645\u0646 \u0647\u0646\u0627"
                  }
                )
              ] }),
              " "
            ] }),
            " "
          ]
        }
      ),
      " "
    ] }),
    " "
  ] });
};
var LandingPage = ({ onStart }) => {
  const [showVideoModal, setShowVideoModal] = (0, import_react.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-40 pb-20 px-4 overflow-hidden bg-watermark min-h-screen", children: [
    " ",
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_react2.motion.section,
      {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        className: "max-w-5xl mx-auto text-center mb-32 relative",
        children: [
          " ",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: "absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10 animate-pulse",
              style: { animationDelay: "1s" }
            }
          ),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            import_react2.motion.div,
            {
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: 0.2 },
              className: "inline-flex items-center gap-2 bg-white dark:bg-slate-800/80 backdrop-blur-sm border border-white dark:border-slate-700 px-6 py-2.5 rounded-full text-sm font-bold text-primary mb-10 shadow-xl shadow-primary/5",
              children: [
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { size: 16, className: "animate-spin-slow" }),
                " \u062B\u0648\u0631\u0629 \u0641\u064A \u0639\u0627\u0644\u0645 \u0627\u0644\u062A\u0648\u0638\u064A\u0641 \u0627\u0644\u0630\u0643\u064A",
                " "
              ]
            }
          ),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { className: "text-4xl md:text-5xl lg:text-[64px] font-semibold mt-6 mb-8 lg:mb-10 leading-snug lg:leading-[1.4] text-navy dark:text-white tracking-tight text-center", children: [
            " ",
            "\u0648\u0638\u0641 \u0627\u0644\u0643\u0641\u0627\u0621\u0627\u062A \u0627\u0644\u0635\u062D ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-600 relative font-bold inline-block", children: [
              " ",
              "\u0648\u0648\u0641\u0631 \u0648\u0642\u062A\u0643 \u0648\u062C\u0647\u062F\u0643 \u0645\u0639 \u0641\u0631\u0632",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "svg",
                {
                  className: "absolute -bottom-4 left-0 w-full h-4 text-primary/20",
                  viewBox: "0 0 100 10",
                  preserveAspectRatio: "none",
                  children: [
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "path",
                      {
                        d: "M0 5 Q 25 0, 50 5 T 100 5",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "4"
                      }
                    ),
                    " "
                  ]
                }
              ),
              " "
            ] }),
            " "
          ] }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xl md:text-2xl text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-14 max-w-xl mx-auto leading-relaxed font-medium text-center", children: [
            " ",
            "\u0645\u0646\u0635\u0629 \u062A\u0631\u062A\u0628 \u0644\u0643 \u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u062A\u0648\u0638\u064A\u0641\u060C \u062A\u0641\u0631\u0632 \u0627\u0644\u0633\u064A\u0631 \u0627\u0644\u0630\u0627\u062A\u064A\u0629\u060C \u0648\u062A\u0637\u0644\u0639 \u0644\u0643 \u0627\u0644\u062E\u0644\u0627\u0635\u0629 \u0639\u0634\u0627\u0646 \u062A\u062E\u062A\u0627\u0631 \u0627\u0644\u0623\u0646\u0633\u0628 \u0644\u0641\u0631\u064A\u0642\u0643 \u0628\u062F\u0648\u0646 \u062D\u0648\u0633\u0629 \u0648\u062A\u0639\u0628.",
            " "
          ] }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-8", children: [
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: onStart,
                className: "w-full sm:w-auto bg-primary text-white px-14 py-5 rounded-[24px] text-xl font-bold hover:shadow-[0_20px_50px_rgba(13,148,136,0.3)] transition-all hover:-translate-y-1.5 active:scale-95 flex items-center justify-center gap-3 group",
                children: [
                  " ",
                  "\u0627\u0628\u062F\u0623 \u0645\u062C\u0627\u0646\u0627\u064B \u0627\u0644\u0622\u0646",
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_lucide_react.ArrowLeft,
                    {
                      size: 22,
                      className: "group-hover:-translate-x-1 transition-transform"
                    }
                  ),
                  " "
                ]
              }
            ),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: () => setShowVideoModal(true),
                className: "w-full sm:w-auto bg-white dark:bg-slate-800/50 backdrop-blur-md text-navy dark:text-white border-2 border-white dark:border-slate-700 px-10 py-5 rounded-[24px] text-xl font-bold hover:bg-white dark:bg-slate-800 transition-all shadow-xl shadow-slate-200/20 active:scale-95 inline-flex items-center justify-center gap-3 group",
                children: [
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_lucide_react.Play,
                    {
                      size: 22,
                      className: "text-primary fill-primary group-hover:scale-110 transition-transform"
                    }
                  ),
                  " ",
                  "\u0634\u0627\u0647\u062F \u0643\u064A\u0641 \u0646\u0639\u0645\u0644",
                  " "
                ]
              }
            ),
            " "
          ] }),
          " ",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-32 pt-16 border-t border-slate-100 dark:border-slate-700", children: [
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 max-w-2xl mx-auto leading-relaxed", children: [
              " ",
              "\u0635\u064F\u0645\u0645 \u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u0634\u0631\u0643\u0627\u062A \u0648\u0627\u0644\u0645\u0634\u0627\u0631\u064A\u0639 \u0627\u0644\u062A\u064A \u062A\u0628\u062D\u062B \u0639\u0646 \u0627\u0644\u062C\u0648\u062F\u0629 \u0648\u0627\u0644\u0633\u0631\u0639\u0629 \u0641\u064A \u0627\u0644\u062A\u0648\u0638\u064A\u0641.",
              " "
            ] }),
            " "
          ] }),
          " "
        ]
      }
    ),
    " ",
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "max-w-7xl mx-auto mb-16 bg-slate-50 dark:bg-slate-800/50 rounded-[40px] py-24 px-8 md:px-12 border border-slate-100 dark:border-slate-700 relative", children: [
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center mb-24", children: [
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-4xl md:text-5xl font-bold text-navy dark:text-white mb-6", children: "\u0643\u064A\u0641 \u062A\u0648\u0638\u0641 \u0645\u0639 \u0641\u0631\u0632\u061F" }),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 dark:text-slate-500 text-lg font-medium", children: "3 \u062E\u0637\u0648\u0627\u062A \u062A\u0641\u0635\u0644\u0643 \u0639\u0646 \u0645\u0631\u0634\u062D\u0643 \u0627\u0644\u0623\u0646\u0633\u0628" }),
        " "
      ] }),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-12 relative", children: [
        " ",
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent -z-10" }),
        " ",
        [
          {
            step: "01",
            title: "\u062C\u0647\u0651\u0632 \u0637\u0644\u0628\u0643",
            desc: "\u062D\u062F\u062F \u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062A \u0627\u0644\u0644\u064A \u062A\u0628\u064A\u0647\u0627 \u0648\u0627\u0646\u0634\u0631 \u0627\u0644\u0631\u0627\u0628\u0637 \u0641\u064A \u062B\u0648\u0627\u0646\u064A.",
            icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.FileText, { size: 32, className: "text-primary fill-primary/20" })
          },
          {
            step: "02",
            title: "\u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0630\u0643\u064A",
            desc: "\u0646\u0638\u0627\u0645 \u0630\u0643\u064A \u064A\u0639\u062A\u0645\u062F \u0639\u0644\u0649 \u062E\u0648\u0627\u0631\u0632\u0645\u064A\u0627\u062A \u0645\u062A\u0642\u062F\u0645\u0629 \u0644\u0641\u0644\u062A\u0631\u0629 \u0622\u0644\u0627\u0641 \u0627\u0644\u0633\u064A\u0631 \u0627\u0644\u0630\u0627\u062A\u064A\u0629 \u0648\u0627\u0633\u062A\u062E\u0631\u0627\u062C \u0627\u0644\u0645\u0637\u0627\u0628\u0642 \u0644\u0645\u0639\u0627\u064A\u064A\u0631\u0643.",
            icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Zap, { size: 32, className: "text-primary fill-primary/20" })
          },
          {
            step: "03",
            title: "\u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u062E\u062A\u0635\u0631\u0629",
            desc: "\u0646\u0639\u0637\u064A\u0643 \u0623\u0641\u0636\u0644 \u0627\u0644\u0645\u0631\u0634\u062D\u064A\u0646 \u062C\u0627\u0647\u0632\u064A\u0646 \u0623\u0645\u0627\u0645\u0643 \u0644\u0643\u064A \u062A\u062A\u062E\u0630 \u0642\u0631\u0627\u0631\u0643 \u0627\u0644\u0646\u0647\u0627\u0626\u064A \u0628\u0628\u0646\u0627\u0621 \u0641\u0631\u064A\u0642\u0643 \u0628\u062B\u0642\u0629.",
            icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_lucide_react.CheckCircle,
              {
                size: 32,
                className: "text-primary fill-primary/20"
              }
            )
          }
        ].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "div",
          {
            className: "bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-md relative group hover:shadow-xl transition-all h-full",
            children: [
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute -top-6 right-10 w-12 h-12 bg-navy text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl", children: [
                " ",
                item.step,
                " "
              ] }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform", children: [
                " ",
                item.icon,
                " "
              ] }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-2xl font-bold text-navy dark:text-white mb-4", children: item.title }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 dark:text-slate-500 leading-relaxed font-medium", children: item.desc }),
              " "
            ]
          },
          i
        )),
        " "
      ] }),
      " "
    ] }),
    " ",
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-center mb-20 relative z-10 w-full opacity-60", children: [
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-7 h-12 border-2 border-slate-300 rounded-full flex justify-center pt-1.5", children: [
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_react2.motion.div,
          {
            animate: { y: [0, 16, 0] },
            transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
            className: "w-1 h-2.5 bg-slate-400 rounded-full"
          }
        ),
        " "
      ] }),
      " "
    ] }),
    " ",
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { id: "features", className: "max-w-5xl mx-auto mb-48", children: [
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center mb-16", children: [
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-4xl md:text-5xl font-bold text-navy dark:text-white", children: "\u0642\u062F\u0631\u0627\u062A \u062A\u0642\u0646\u064A\u0629 \u062A\u062F\u064A\u0631 \u0639\u0645\u0644\u064A\u0629 \u0627\u0644\u062A\u0648\u0638\u064A\u0641 \u0639\u0646\u0643" }),
        " "
      ] }),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-10", children: [
        " ",
        [
          {
            title: "\u0645\u0642\u0627\u0628\u0644\u0627\u062A \u0635\u0648\u062A\u064A\u0629 \u0645\u062F\u0645\u062C\u0629",
            desc: "\u0646\u0638\u0627\u0645 \u0630\u0643\u064A \u064A\u0633\u062C\u0644 \u0648\u064A\u062D\u0644\u0644 \u0625\u062C\u0627\u0628\u0627\u062A \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646 \u0635\u0648\u062A\u064A\u0627\u064B \u062F\u0627\u062E\u0644 \u0627\u0644\u0645\u0646\u0635\u0629 \u0645\u0628\u0627\u0634\u0631\u0629 \u0644\u0627\u0633\u062A\u062E\u0631\u0627\u062C \u0623\u0641\u0636\u0644 \u0627\u0644\u0643\u0641\u0627\u0621\u0627\u062A \u062F\u0648\u0646 \u0639\u0646\u0627\u0621.",
            icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_lucide_react.ShieldCheck,
              {
                className: "text-primary fill-primary/20",
                size: 32
              }
            ),
            color: "bg-primary/10"
          },
          {
            title: "\u0642\u0627\u0639\u062F\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u062D\u064A\u0629 (ATS)",
            desc: "\u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0622\u0644\u0627\u0641 \u0627\u0644\u0643\u0641\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u062D\u062F\u062B\u0629 \u0628\u0627\u0633\u062A\u0645\u0631\u0627\u0631 \u0648\u0627\u0644\u062C\u0627\u0647\u0632\u0629 \u0644\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0644\u0641\u0631\u064A\u0642\u0643\u060C \u0645\u0639 \u0625\u062F\u0627\u0631\u0629 \u0645\u062A\u0643\u0627\u0645\u0644\u0629 \u0644\u062E\u0637 \u0633\u064A\u0631 \u0627\u0644\u0645\u0631\u0634\u062D\u064A\u0646.",
            icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Database, { className: "text-primary fill-primary/20", size: 32 }),
            color: "bg-primary/10"
          }
        ].map((feature, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_react2.motion.div,
          {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: idx * 0.15 },
            className: "card-3d bg-white dark:bg-slate-800 p-10 rounded-[32px] shadow-md border border-slate-100 dark:border-slate-700 group hover:shadow-xl transition-all",
            children: [
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "div",
                {
                  className: `w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-inner-3d group-hover:scale-110 transition-transform`,
                  children: [
                    " ",
                    feature.icon,
                    " "
                  ]
                }
              ),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-2xl font-bold mb-4 text-navy dark:text-white", children: feature.title }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 dark:text-slate-500 leading-relaxed font-medium", children: feature.desc }),
              " "
            ]
          },
          idx
        )),
        " "
      ] }),
      " "
    ] }),
    " ",
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "section",
      {
        id: "testimonials",
        className: "max-w-7xl mx-auto mb-40 bg-navy rounded-[40px] p-16 md:p-24 relative overflow-hidden",
        children: [
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center", children: [
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { className: "text-4xl md:text-6xl font-bold text-white mb-8 leading-tight", children: [
                "\u0645\u0627\u0630\u0627 \u064A\u0642\u0648\u0644 ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
                " \u0634\u0631\u0643\u0627\u0621 \u0627\u0644\u0646\u062C\u0627\u062D\u061F"
              ] }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-400 dark:text-slate-500 text-xl font-medium mb-12", children: "\u0627\u0646\u0636\u0645 \u0644\u0644\u0634\u0631\u0643\u0627\u062A \u0627\u0644\u062A\u064A \u0627\u062E\u062A\u0635\u0631\u062A 70% \u0645\u0646 \u0648\u0642\u062A \u0627\u0644\u062A\u0648\u0638\u064A\u0641 \u0648\u0627\u0639\u062A\u0645\u062F\u062A \u0639\u0644\u0649 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u0623\u0641\u0636\u0644 \u0627\u0644\u0643\u0641\u0627\u0621\u0627\u062A." }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-4", children: [
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-16 h-1 bg-primary rounded-full" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-4 h-1 bg-white dark:bg-slate-800/20 rounded-full" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-4 h-1 bg-white dark:bg-slate-800/20 rounded-full" }),
                " "
              ] }),
              " "
            ] }),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-slate-800/5 backdrop-blur-xl p-12 rounded-[40px] border border-white dark:border-slate-700/10 relative", children: [
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute -top-10 -right-10 w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl", children: [
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { size: 32 }),
                " "
              ] }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-medium text-white mb-10 leading-relaxed italic", children: [
                " ",
                '"\u0644\u0642\u062F \u0648\u0641\u0631 \u0644\u0646\u0627 \u0647\u0630\u0627 \u0627\u0644\u0646\u0638\u0627\u0645 \u0623\u0643\u062B\u0631 \u0645\u0646 70% \u0645\u0646 \u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0645\u0633\u062A\u063A\u0631\u0642 \u0641\u064A \u0641\u0631\u0632 \u0627\u0644\u0633\u064A\u0631 \u0627\u0644\u0630\u0627\u062A\u064A\u0629. \u0627\u0644\u0646\u062A\u0627\u0626\u062C \u0643\u0627\u0646\u062A \u0645\u0630\u0647\u0644\u0629 \u0648\u0627\u0644\u0645\u0631\u0634\u062D\u0648\u0646 \u0627\u0644\u0630\u064A\u0646 \u062A\u0645 \u0627\u062E\u062A\u064A\u0627\u0631\u0647\u0645 \u0643\u0627\u0646\u0648\u0627 \u0627\u0644\u0623\u0641\u0636\u0644 \u0639\u0644\u0649 \u0627\u0644\u0625\u0637\u0644\u0627\u0642."',
                " "
              ] }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-6", children: [
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-16 h-16 rounded-2xl bg-slate-700 overflow-hidden border-2 border-primary", children: [
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "img",
                    {
                      src: "https://picsum.photos/seed/ceo/100/100",
                      alt: "CEO",
                      referrerPolicy: "no-referrer"
                    }
                  ),
                  " "
                ] }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "text-xl font-bold text-white", children: "\u0645. \u0641\u0647\u062F \u0627\u0644\u0633\u0639\u062F" }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-primary font-bold", children: "\u0627\u0644\u0631\u0626\u064A\u0633 \u0627\u0644\u062A\u0646\u0641\u064A\u0630\u064A - \u0634\u0631\u0643\u0629 \u0627\u0644\u062D\u0644\u0648\u0644 \u0627\u0644\u0645\u062A\u0643\u0627\u0645\u0644\u0629" }),
                  " "
                ] }),
                " "
              ] }),
              " "
            ] }),
            " "
          ] }),
          " "
        ]
      }
    ),
    " ",
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_react2.motion.section,
      {
        id: "contact",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "max-w-4xl mx-auto mt-32 bg-primary/5 rounded-[40px] p-12 relative overflow-hidden shadow-sm border border-primary/20",
        children: [
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative z-10", children: [
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center mb-12", children: [
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-4xl font-bold text-navy dark:text-white mb-4", children: "\u0647\u0644 \u0644\u062F\u064A\u0643 \u0627\u062D\u062A\u064A\u0627\u062C\u0627\u062A \u062A\u0648\u0638\u064A\u0641 \u0636\u062E\u0645\u0629 \u0623\u0648 \u0627\u0633\u062A\u0641\u0633\u0627\u0631\u0627\u062A \u0623\u0639\u0645\u0627\u0644\u061F" }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-slate-500 dark:text-slate-400 dark:text-slate-500 max-w-xl mx-auto font-medium text-lg", children: [
                " ",
                "\u0641\u0631\u064A\u0642 \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A \u0644\u062F\u064A\u0646\u0627 \u062C\u0627\u0647\u0632 \u0644\u062A\u0642\u062F\u064A\u0645 \u0639\u0631\u0636 \u062A\u0648\u0636\u064A\u062D\u064A \u0645\u062E\u0635\u0635 \u0648\u062A\u0635\u0645\u064A\u0645 \u0628\u0627\u0642\u0629 \u062A\u0646\u0627\u0633\u0628 \u062D\u062C\u0645 \u0623\u0639\u0645\u0627\u0644\u0643. \u0627\u062A\u0631\u0643 \u0628\u064A\u0627\u0646\u0627\u062A\u0643 \u0648\u0633\u0646\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0643.",
                " "
              ] }),
              " "
            ] }),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "form",
              {
                className: "grid grid-cols-1 md:grid-cols-2 gap-8",
                onSubmit: (e) => e.preventDefault(),
                children: [
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1", children: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644" }),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_lucide_react.Users,
                        {
                          className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500",
                          size: 20
                        }
                      ),
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "input",
                        {
                          type: "text",
                          placeholder: "\u0623\u062F\u062E\u0644 \u0627\u0633\u0645\u0643",
                          className: "w-full pr-12 pl-5 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                        }
                      ),
                      " "
                    ] }),
                    " "
                  ] }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1", children: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644" }),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_lucide_react.Phone,
                        {
                          className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500",
                          size: 20
                        }
                      ),
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "input",
                        {
                          type: "tel",
                          placeholder: "05xxxxxxxx",
                          dir: "ltr",
                          className: "w-full pr-12 pl-5 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-right font-medium"
                        }
                      ),
                      " "
                    ] }),
                    " "
                  ] }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "md:col-span-2 space-y-3", children: [
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1", children: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" }),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_lucide_react.Mail,
                        {
                          className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500",
                          size: 20
                        }
                      ),
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "input",
                        {
                          type: "email",
                          placeholder: "example@domain.com",
                          className: "w-full pr-12 pl-5 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                        }
                      ),
                      " "
                    ] }),
                    " "
                  ] }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "md:col-span-2 space-y-3", children: [
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1", children: [
                      "\u0627\u0633\u062A\u0641\u0633\u0627\u0631\u0643 \u0623\u0648 \u0631\u0633\u0627\u0644\u062A\u0643 ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-normal text-xs text-slate-400", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" })
                    ] }),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "textarea",
                        {
                          placeholder: "\u0627\u0643\u062A\u0628 \u062A\u0641\u0627\u0635\u064A\u0644 \u0637\u0644\u0628\u0643 \u0623\u0648 \u0627\u0633\u062A\u0641\u0633\u0627\u0631\u0643 \u0647\u0646\u0627...",
                          rows: 4,
                          className: "w-full p-5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-none"
                        }
                      ),
                      " "
                    ] }),
                    " "
                  ] }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "md:col-span-2 mt-4", children: [
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "w-full bg-primary text-white py-6 rounded-[24px] text-xl font-bold hover:shadow-[0_20px_50px_rgba(13,148,136,0.3)] transition-all active:scale-95", children: [
                      " ",
                      "\u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628 \u0627\u0644\u062A\u0648\u0627\u0635\u0644",
                      " "
                    ] }),
                    " "
                  ] }),
                  " "
                ]
              }
            ),
            " "
          ] }),
          " "
        ]
      }
    ),
    " ",
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react2.AnimatePresence, { children: [
      " ",
      showVideoModal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_react2.motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-8",
          children: [
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              import_react2.motion.div,
              {
                initial: { scale: 0.95, opacity: 0, y: 20 },
                animate: { scale: 1, opacity: 1, y: 0 },
                exit: { scale: 0.95, opacity: 0, y: 20 },
                className: "relative w-full max-w-5xl aspect-video bg-black rounded-[24px] md:rounded-[40px] shadow-2xl overflow-hidden border border-white dark:border-slate-700/10 flex items-center justify-center",
                children: [
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "button",
                    {
                      onClick: () => setShowVideoModal(false),
                      className: "absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 bg-white dark:bg-slate-800/10 hover:bg-red-500 transition-colors rounded-full flex items-center justify-center text-white z-10 backdrop-blur-sm shadow-lg",
                      children: [
                        " ",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 24 }),
                        " "
                      ]
                    }
                  ),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-20 h-20 bg-white dark:bg-slate-800/5 rounded-full flex items-center justify-center mx-auto mb-6", children: [
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_lucide_react.Play,
                        {
                          size: 32,
                          className: "text-white/50 fill-white/20 ml-2"
                        }
                      ),
                      " "
                    ] }),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-white/60 font-medium text-lg", children: "\u0645\u0643\u0627\u0646 \u0639\u0631\u0636 \u0641\u064A\u062F\u064A\u0648 \u0634\u0631\u062D \u0627\u0644\u0645\u0646\u0635\u0629 (Video Player)" }),
                    " "
                  ] }),
                  " "
                ]
              }
            ),
            " "
          ]
        }
      ),
      " "
    ] }),
    " "
  ] });
};
var MOCK_EXPIRATION_TIME = (/* @__PURE__ */ new Date("2026-04-22T21:00:00+03:00")).getTime();
var initialMockApplicants = Date.now() < MOCK_EXPIRATION_TIME ? [
  { id: "m1", name: "\u062E\u0627\u0644\u062F \u0627\u0644\u0633\u0627\u0644\u0645", job: "\u0645\u0647\u0646\u062F\u0633 \u0628\u0631\u0645\u062C\u064A\u0627\u062A \u0623\u0648\u0644", rating: 95, photoUrl: "https://i.pravatar.cc/150?u=m1", status: "\u0641\u0648\u0631\u064A", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", phone: "966500000001", email: "khaled@example.com", skills: ["React", "Node.js", "System Design"], aiSummary: "\u0645\u0631\u0634\u062D \u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A \u064A\u0645\u062A\u0644\u0643 \u062E\u0628\u0631\u0629 \u0639\u0645\u064A\u0642\u0629 \u0641\u064A \u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0646\u0638\u0645 \u0627\u0644\u0643\u0628\u064A\u0631\u0629.", voiceEval: "\u0646\u0628\u0631\u0629 \u0648\u0627\u062B\u0642\u0629 \u0648\u062A\u0648\u0627\u0635\u0644 \u0627\u062D\u062A\u0631\u0627\u0641\u064A \u0645\u0645\u062A\u0627\u0632", customAnswers: [] },
  { id: "m2", name: "\u0633\u0627\u0631\u0629 \u0639\u0628\u062F\u0627\u0644\u0644\u0647", job: "\u0645\u0635\u0645\u0645 \u0648\u0627\u062C\u0647\u0627\u062A \u0648\u062A\u062C\u0631\u0628\u0629 \u0645\u0633\u062A\u062E\u062F\u0645 (UI/UX)", rating: 88, photoUrl: "https://i.pravatar.cc/150?u=m2", status: "\u0623\u0633\u0628\u0648\u0639\u064A\u0646", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", phone: "966500000002", email: "sara@example.com", skills: ["Figma", "Prototyping", "User Research"], aiSummary: "\u0641\u0647\u0645 \u0639\u0627\u0644\u064A \u0644\u0627\u062D\u062A\u064A\u0627\u062C\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646 \u0645\u0639 \u0645\u0639\u0631\u0636 \u0623\u0639\u0645\u0627\u0644 \u0645\u0628\u0647\u0631.", voiceEval: "\u062A\u0648\u0627\u0635\u0644 \u0641\u0639\u0651\u0627\u0644 \u0648\u0642\u062F\u0631\u0629 \u062C\u064A\u062F\u0629 \u0639\u0644\u0649 \u0634\u0631\u062D \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u0645\u0646\u0637\u0642\u064A\u0629", customAnswers: [] },
  { id: "m3", name: "\u0645\u0634\u0627\u0631\u064A \u0627\u0644\u0642\u062D\u0637\u0627\u0646\u064A", job: "\u0645\u062F\u064A\u0631 \u0645\u0634\u0627\u0631\u064A\u0639 \u062A\u0642\u0646\u064A\u0629", rating: 82, photoUrl: "https://i.pravatar.cc/150?u=m3", status: "\u0634\u0647\u0631", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", phone: "966500000003", email: "meshari@example.com", skills: ["Agile", "Scrum", "Jira"], aiSummary: "\u064A\u0645\u062A\u0644\u0643 \u0645\u0647\u0627\u0631\u0627\u062A \u0642\u064A\u0627\u062F\u064A\u0629 \u0645\u0645\u062A\u0627\u0632\u0629\u060C \u0648\u0644\u0643\u0646 \u064A\u062D\u062A\u0627\u062C \u0644\u062A\u062F\u0631\u064A\u0628 \u0625\u0636\u0627\u0641\u064A \u0639\u0644\u0649 \u0627\u0644\u0623\u062F\u0648\u0627\u062A \u0627\u0644\u062D\u062F\u064A\u062B\u0629.", voiceEval: "\u0646\u0628\u0631\u0629 \u0642\u064A\u0627\u062F\u064A\u0629 \u0648\u062D\u0627\u0632\u0645\u0629", customAnswers: [] },
  { id: "m4", name: "\u0646\u0648\u0631\u0629 \u0627\u0644\u062F\u0648\u0633\u0631\u064A", job: "\u0639\u0627\u0644\u0645\u0629 \u0628\u064A\u0627\u0646\u0627\u062A", rating: 91, photoUrl: "https://i.pravatar.cc/150?u=m4", status: "\u0641\u0648\u0631\u064A", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", phone: "966500000004", email: "noura@example.com", skills: ["Python", "Machine Learning", "SQL"], aiSummary: "\u0642\u062F\u0631\u0629 \u062A\u062D\u0644\u064A\u0644\u064A\u0629 \u0642\u0648\u064A\u0629 \u0648\u062E\u0628\u0631\u0629 \u0645\u0645\u064A\u0632\u0629 \u0641\u064A \u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0648\u0628\u0646\u0627\u0621 \u0627\u0644\u0646\u0645\u0627\u0630\u062C.", voiceEval: "\u0647\u0627\u062F\u0626\u0629 \u0648\u0645\u0646\u0637\u0642\u064A\u0629 \u062C\u062F\u0627\u064B", customAnswers: [] },
  { id: "m5", name: "\u064A\u0627\u0633\u0631 \u0627\u0644\u062D\u0631\u0628\u064A", job: "\u0645\u0637\u0648\u0631 \u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0647\u0648\u0627\u062A\u0641", rating: 75, photoUrl: "https://i.pravatar.cc/150?u=m5", status: "\u0634\u0647\u0631\u064A\u0646", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400", phone: "966500000005", email: "yasser@example.com", skills: ["Flutter", "Dart", "Firebase"], aiSummary: "\u0645\u0647\u0627\u0631\u0627\u062A \u062C\u064A\u062F\u0629 \u0641\u064A \u0628\u0646\u0627\u0621 \u0627\u0644\u062A\u0637\u0628\u064A\u0642\u0627\u062A\u060C \u0644\u0643\u0646 \u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062A \u0627\u0644\u0623\u0645\u0646\u064A\u0629 \u062A\u062D\u062A\u0627\u062C \u0644\u062A\u062D\u0633\u064A\u0646.", voiceEval: "\u0634\u063A\u0648\u0641 \u0648\u0645\u0646\u062F\u0641\u0639", customAnswers: [] }
] : [];
function App() {
  const [talentPool, setTalentPool] = (0, import_react.useState)(initialMockApplicants);
  const [applicantSelectedRoleId, setApplicantSelectedRoleId] = (0, import_react.useState)(null);
  const [userProfile, setUserProfile] = (0, import_react.useState)({
    name: "\u0623\u062D\u0645\u062F \u0627\u0644\u0645\u062F\u064A\u0631",
    title: "\u0645\u062F\u064A\u0631 \u0627\u0644\u062A\u0648\u0638\u064A\u0641",
    avatar: "https://picsum.photos/seed/admin/100/100",
    companyLogo: "",
    commercialRegistration: "",
    freelanceDocument: "",
    taxNumber: "",
    subscription_tier: "free",
    entityType: "company",
    city: ""
  });
  const [step, setStep] = (0, import_react.useState)("landing");
  const [dashboardTab, setDashboardTab] = (0, import_react.useState)("\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629");
  const [darkMode, setDarkMode] = (0, import_react.useState)(false);
  const [showOnboardingGlobal, setShowOnboardingGlobal] = (0, import_react.useState)(false);
  const [globalPendingDraftId, setGlobalPendingDraftId] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  const [globalToastMessage, setGlobalToastMessage] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    const handler = (e) => {
      const customEvent = e;
      if (customEvent.detail) {
        if (typeof customEvent.detail === "string") {
          setGlobalToastMessage({ message: customEvent.detail, type: "success" });
        } else {
          setGlobalToastMessage({ message: customEvent.detail.message, type: customEvent.detail.type || "success" });
        }
        setTimeout(() => setGlobalToastMessage(null), 3500);
      }
    };
    window.addEventListener("showToast", handler);
    return () => window.removeEventListener("showToast", handler);
  }, []);
  const [selectedJob, setSelectedJob] = (0, import_react.useState)(null);
  const [clonedJob, setClonedJob] = (0, import_react.useState)(null);
  const [shortlistedIds, setShortlistedIds] = (0, import_react.useState)([]);
  const [showPaywallModal, setShowPaywallModal] = (0, import_react.useState)(false);
  const [previewJobState, setPreviewJobState] = (0, import_react.useState)(null);
  const [createJobType, setCreateJobType] = (0, import_react.useState)(
    "single"
  );
  const [jobs, setJobs] = (0, import_react.useState)(() => {
    const savedJobs = localStorage.getItem("sahab_jobs_db_v1");
    if (savedJobs) {
      try {
        return JSON.parse(savedJobs);
      } catch (e) {
        console.error("Error parsing jobs", e);
      }
    }
    return [];
  });
  (0, import_react.useEffect)(() => {
    const path = window.location.pathname;
    if (path.startsWith("/apply/")) {
      const jobId = path.split("/")[2];
      const jobFound = jobs.find((j) => j.id === jobId);
      if (jobFound) {
        setSelectedJob(jobFound);
        setStep(
          jobFound.directUpload || jobFound.roles?.some((r) => r.directUpload) || jobFound.roles?.[0]?.directUpload ? "form" : "publicJob"
        );
      }
    }
  }, [jobs]);
  (0, import_react.useEffect)(() => {
    localStorage.setItem("sahab_jobs_db_v1", JSON.stringify(jobs));
  }, [jobs]);
  const handleAutoSaveDraft = (jobData, existingDraftId) => {
    const jobIdToUse = existingDraftId || Math.random().toString(36).substr(2, 9);
    setJobs((prevJobs) => {
      const draftExists = prevJobs.some((j) => j.id === existingDraftId);
      if (draftExists && existingDraftId) {
        return prevJobs.map((j) => j.id === existingDraftId ? { ...j, ...jobData, status: "\u0645\u0633\u0648\u062F\u0629" } : j);
      } else {
        const newJob = {
          ...jobData,
          id: jobIdToUse,
          applicants: 0,
          status: "\u0645\u0633\u0648\u062F\u0629",
          createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
        };
        return [newJob, ...prevJobs];
      }
    });
    return jobIdToUse;
  };
  const handleCreateJob = (jobData, existingDraftId) => {
    const isComplete = true;
    const incomingStatus = jobData.status;
    const resolvedStatus = incomingStatus ? incomingStatus : isComplete ? "\u0646\u0634\u0637" : "\u0645\u0633\u0648\u062F\u0629";
    const jobIdToUse = existingDraftId || Math.random().toString(36).substr(2, 9);
    const newJob = {
      ...jobData,
      id: jobIdToUse,
      applicants: 0,
      status: resolvedStatus,
      createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    if (existingDraftId) {
      setJobs(jobs.map((j) => j.id === existingDraftId ? newJob : j));
    } else {
      setJobs([newJob, ...jobs]);
    }
    if (resolvedStatus === "\u0645\u0633\u0648\u062F\u0629") {
      return jobIdToUse;
    }
    if (isComplete) {
      setSelectedJob(newJob);
      setClonedJob(null);
      setStep("jobSuccess");
      return null;
    } else {
      return null;
    }
  };
  const handlePublishDraft = () => {
    if (globalPendingDraftId) {
      const pendingJob = jobs.find((j) => j.id === globalPendingDraftId);
      if (pendingJob) {
        setJobs(jobs.map((j) => j.id === globalPendingDraftId ? { ...j, status: "\u0646\u0634\u0637" } : j));
        setSelectedJob({ ...pendingJob, status: "\u0646\u0634\u0637" });
        setClonedJob(null);
        setStep("jobSuccess");
      }
      setGlobalPendingDraftId(null);
    }
  };
  const handleDeactivateJob = (job) => {
    const updatedJobs = jobs.map(
      (j) => j.id === job.id ? { ...j, status: "\u0645\u063A\u0644\u0642" } : j
    );
    setJobs(updatedJobs);
  };
  const handleReactivateJob = (job) => {
    const updatedJobs = jobs.map(
      (j) => j.id === job.id ? { ...j, status: "\u0646\u0634\u0637", createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] } : j
    );
    setJobs(updatedJobs);
  };
  const startJobCreation = (type, initialJobData = null) => {
    setCreateJobType(type);
    setClonedJob(initialJobData);
    setStep("createJob");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: `min-h-screen transition-colors duration-500 bg-slate-100 dark:bg-slate-900 selection:bg-primary/20 selection:text-primary`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingModal, { isOpen: showOnboardingGlobal, onClose: () => {
          setShowOnboardingGlobal(false);
          if (globalPendingDraftId) {
            alert("\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0643\u0645\u0633\u0648\u062F\u0629\u060C \u064A\u0645\u0643\u0646\u0643 \u0625\u0643\u0645\u0627\u0644\u0647 \u0644\u0627\u062D\u0642\u0627\u064B \u0645\u0646 \u0642\u0633\u0645 \u0627\u0644\u0625\u062F\u0627\u0631\u0629");
          }
        }, userProfile, setUserProfile, onPublishDraft: handlePublishDraft }),
        step === "landing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, { setStep, currentStep: step }),
        " ",
        " ",
        showPaywallModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_react2.motion.div,
          {
            initial: { opacity: 0, scale: 0.95, y: 10 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95, y: 10 },
            className: "w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl relative border border-amber-200 dark:border-amber-900/50",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-8 text-center pt-12", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  onClick: () => setShowPaywallModal(false),
                  className: "absolute top-6 left-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors",
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 24 })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-24 h-24 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Star, { size: 40, className: "text-amber-500 fill-amber-500" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-2 -right-2 bg-gradient-to-tr from-amber-500 to-yellow-400 text-white text-[10px] uppercase font-black px-3 py-1 rounded-full shadow-lg border-2 border-white dark:border-slate-800", children: "Pro" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-2xl font-bold text-navy dark:text-white mb-4", children: "\u0647\u0630\u0647 \u0627\u0644\u0645\u064A\u0632\u0629 \u0645\u062F\u0641\u0648\u0639\u0629" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8", children: '\u0623\u062F\u0627\u0629 "\u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0633\u0631\u064A\u0639 \u26A1" \u0645\u0635\u0645\u0645\u0629 \u0644\u062A\u0633\u0631\u064A\u0639 \u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u062A\u0648\u0638\u064A\u0641 \u0648\u062A\u0648\u0641\u064A\u0631 \u0648\u0642\u062A\u0643 \u0639\u0646 \u0637\u0631\u064A\u0642 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0628\u0634\u0643\u0644 \u0643\u0627\u0645\u0644. \u064A\u0631\u062C\u0649 \u0627\u0644\u062A\u0631\u0642\u064A\u0629 \u0644\u0644\u0628\u0627\u0642\u0627\u062A \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629 \u0644\u0641\u062A\u062D \u0647\u0630\u0647 \u0627\u0644\u062E\u0627\u0635\u064A\u0629.' }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col gap-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "button",
                  {
                    onClick: () => {
                      setShowPaywallModal(false);
                      alert("\u0633\u064A\u062A\u0645 \u0646\u0642\u0644\u0643 \u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u062A\u0631\u0642\u064A\u0629 \u0648\u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643\u0627\u062A \u0642\u0631\u064A\u0628\u0627\u064B!");
                    },
                    className: "w-full py-4 bg-gradient-to-l from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-amber-500/20 flex justify-center items-center gap-2",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { size: 20 }),
                      " \u062A\u0631\u0642\u064A\u0629 \u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0622\u0646"
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    onClick: () => setShowPaywallModal(false),
                    className: "w-full py-4 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
                    children: "\u0627\u0644\u0627\u0633\u062A\u0645\u0631\u0627\u0631 \u0628\u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0639\u0627\u062F\u064A\u0629"
                  }
                )
              ] })
            ] })
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.AnimatePresence, { children: globalToastMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_react2.motion.div,
          {
            initial: { opacity: 0, y: -50, x: "-50%" },
            animate: { opacity: 1, y: 0, x: "-50%" },
            exit: { opacity: 0, y: -50, x: "-50%" },
            className: `fixed top-8 left-1/2 z-[999] border px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm md:text-base whitespace-nowrap ${globalToastMessage.type === "warning" ? "bg-orange-50 text-orange-700 border-orange-200" : globalToastMessage.type === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-slate-900 border-slate-700 text-white"}`,
            children: [
              globalToastMessage.type === "warning" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertTriangle, { size: 20, className: "text-orange-500" }) : globalToastMessage.type === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertTriangle, { size: 20, className: "text-red-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle, { size: 20, className: "text-primary" }),
              globalToastMessage.message
            ]
          },
          "global-toast"
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react2.AnimatePresence, { mode: "wait", children: [
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              import_react2.motion.div,
              {
                initial: { opacity: 0, scale: 0.98 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 1.02 },
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                children: [
                  " ",
                  step === "landing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingPage, { onStart: () => setStep("registerCompany") }),
                  " ",
                  step === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_Dashboard.default,
                    {
                      activeTab: dashboardTab,
                      setActiveTab: setDashboardTab,
                      onViewDetails: () => setStep("applicantDetails"),
                      onCreateJob: () => {
                        setClonedJob(null);
                        startJobCreation("single");
                      },
                      onManageJob: (job) => {
                        setSelectedJob(job);
                        setStep("manageJob");
                      },
                      onCloneJob: (job) => startJobCreation(job.recordType || "single", job),
                      onDeactivateJob: handleDeactivateJob,
                      onReactivateJob: handleReactivateJob,
                      onPreviewJob: (job) => setPreviewJobState(job),
                      jobs,
                      shortlistedIds,
                      onToggleShortlist: (id) => {
                        setShortlistedIds(
                          (prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                        );
                      },
                      darkMode,
                      setDarkMode,
                      userProfile,
                      setUserProfile,
                      onShowOnboarding: () => setShowOnboardingGlobal(true),
                      talentPool,
                      setTalentPool,
                      onDeleteJob: (id) => {
                        setJobs((prev) => {
                          const newJobs = prev.filter((j) => j.id !== id);
                          localStorage.setItem("sahab_jobs_db_v1", JSON.stringify(newJobs));
                          return newJobs;
                        });
                      },
                      onDeleteAllDrafts: () => {
                        setJobs((prev) => prev.filter((j) => j.status !== "\u0645\u0633\u0648\u062F\u0629"));
                      }
                    }
                  ),
                  " ",
                  step === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    LoginPage,
                    {
                      onLogin: () => setStep("dashboard"),
                      onBack: () => setStep("landing"),
                      initialMode: "login"
                    }
                  ),
                  " ",
                  step === "registerCompany" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    LoginPage,
                    {
                      onLogin: () => setStep("dashboard"),
                      onBack: () => setStep("landing"),
                      initialMode: "register"
                    }
                  ),
                  " ",
                  step === "superAdmin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_SuperAdmin.default, {}),
                  " ",
                  step === "applicantDetails" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ApplicantDetails.default, { onBack: () => setStep("dashboard") }),
                  " ",
                  step === "createJob" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_CreateJob.default,
                    {
                      createJobType,
                      initialData: clonedJob,
                      onBack: () => {
                        setStep("dashboard");
                        setClonedJob(null);
                      },
                      onSubmit: handleCreateJob,
                      onAutoSaveDraft: handleAutoSaveDraft,
                      userProfile,
                      onGoToSettings: () => {
                        setDashboardTab("\u0627\u0644\u062D\u0633\u0627\u0628");
                        setStep("dashboard");
                      }
                    }
                  ),
                  " ",
                  step === "manageJob" && selectedJob && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    ManageJob,
                    {
                      job: selectedJob,
                      onBack: () => setStep("dashboard"),
                      onUpdate: (updatedJob) => {
                        setJobs(
                          jobs.map((j) => j.id === updatedJob.id ? updatedJob : j)
                        );
                        setStep("dashboard");
                      },
                      onDelete: (id) => {
                        setJobs(jobs.filter((j) => j.id !== id));
                        setStep("dashboard");
                      }
                    }
                  ) }),
                  " ",
                  step === "jobSuccess" && selectedJob && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    JobSuccess,
                    {
                      job: selectedJob,
                      onDone: () => setStep("dashboard"),
                      onPreview: () => setStep(
                        selectedJob?.directUpload || selectedJob?.roles?.some((r) => r.directUpload) || selectedJob?.roles?.[0]?.directUpload ? "form" : "publicJob"
                      )
                    }
                  ),
                  " ",
                  step === "publicJob" && selectedJob && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    PublicJobPage,
                    {
                      job: selectedJob,
                      selectedRoleId: applicantSelectedRoleId,
                      onSelectRole: (id) => setApplicantSelectedRoleId(id),
                      onBackToCampaign: () => setApplicantSelectedRoleId(null),
                      onApply: () => setStep("form")
                    }
                  ),
                  step === "form" && selectedJob && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_JobApplication.default,
                    {
                      job: selectedJob,
                      selectedRoleId: applicantSelectedRoleId,
                      onBackToJobs: () => {
                        setStep("publicJob");
                        setApplicantSelectedRoleId(null);
                      },
                      onSubmit: () => setStep("dashboard")
                    }
                  )
                ]
              },
              step
            ),
            " "
          ] }),
          " "
        ] }),
        " ",
        previewJobState && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_Shared.PreviewModal,
          {
            job: previewJobState,
            onClose: () => setPreviewJobState(null)
          }
        ),
        " ",
        " ",
        " "
      ]
    }
  );
}
/** * @license * SPDX-License-Identifier: Apache-2.0 */
