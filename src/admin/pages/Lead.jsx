import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeads,
  createLead,
  updateLeadCallStatus,
  clearLeadMessages,
} from "../../redux/features/leadSlice";
import { fetchAllEmployees } from "../../redux/features/employeeSlice";
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Phone,
  User,
  Tag,
  Calendar,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  PhoneCall,
  Clock,
  TrendingUp,
  Eye,
  XCircle,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ── Enums matching backend lead.model.js ──────────────────────
const LEAD_SOURCES = [
  "Google Ads", "Website", "Referral", "Direct Call",
  "Walk-In", "Justdial", "Meta Ads",
];
const PROJECT_TYPES = [
  "website_development", "web_app_development", "mobile_app_development",
  "ui_ux_design", "graphic_design", "seo", "social_media_marketing",
  "paid_ads_management", "business_consulting", "it_consulting",
  "maintenance_support", "amc", "crm_development", "custom_software",
  "automation_service", "others",
];
const LEAD_STATUSES = [
  "New", "Attempted", "Not Picked", "Interested",
  "Meeting", "Closed Won", "Closed Lost", "Rejected",
];
const CALL_STATUSES = [
  "Connected", "Not Connected", "Switch Off / Not Reachable",
  "Blocked", "Wrong Number", "Denied", "Not Picked", "Wrongly Inquired",
];

const PROJECT_LABELS = {
  website_development: "Website Development",
  web_app_development: "Web App Development",
  mobile_app_development: "Mobile App Development",
  ui_ux_design: "UI/UX Design",
  graphic_design: "Graphic Design",
  seo: "SEO",
  social_media_marketing: "Social Media Marketing",
  paid_ads_management: "Paid Ads Management",
  business_consulting: "Business Consulting",
  it_consulting: "IT Consulting",
  maintenance_support: "Maintenance & Support",
  amc: "AMC",
  crm_development: "CRM Development",
  custom_software: "Custom Software",
  automation_service: "Automation Service",
  others: "Others",
};

// ── Status color map ──────────────────────────────────────────
const STATUS_COLORS = {
  New: "bg-blue-100 text-blue-700",
  Attempted: "bg-yellow-100 text-yellow-700",
  "Not Picked": "bg-orange-100 text-orange-700",
  Interested: "bg-emerald-100 text-emerald-700",
  Meeting: "bg-purple-100 text-purple-700",
  "Closed Won": "bg-green-100 text-green-700",
  "Closed Lost": "bg-red-100 text-red-700",
  Rejected: "bg-slate-100 text-slate-600",
};

// ── Lead Card ─────────────────────────────────────────────────
const LeadCard = ({ lead, onCallUpdate, onViewDetail }) => {
  const assignee = lead.assignedTo;
  const assigneeName = assignee
    ? `${assignee.firstName || ""} ${assignee.lastName || ""}`.trim()
    : "Unassigned";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-indigo-200 transition-all flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-900 text-base leading-tight">{lead.fullName}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{lead.mobileNumber}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${STATUS_COLORS[lead.leadStatus] || "bg-slate-100 text-slate-600"}`}>
          {lead.leadStatus}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <Tag size={12} className="text-slate-400" />
          <span>{lead.leadSource}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User size={12} className="text-slate-400" />
          <span className="truncate">{assigneeName}</span>
        </div>
        {lead.projectType && (
          <div className="flex items-center gap-1.5 col-span-2">
            <TrendingUp size={12} className="text-slate-400" />
            <span className="truncate">{PROJECT_LABELS[lead.projectType] || lead.projectType}</span>
          </div>
        )}
        {lead.nextFollowUpDate && (
          <div className="flex items-center gap-1.5 col-span-2 text-amber-600 font-medium">
            <Clock size={12} />
            <span>Follow-up: {new Date(lead.nextFollowUpDate).toLocaleDateString("en-IN")}</span>
          </div>
        )}
      </div>

      {lead.remarks && (
        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 italic border border-slate-100 line-clamp-2">
          "{lead.remarks}"
        </p>
      )}

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onViewDetail(lead)}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          <Eye size={13} /> View Details
        </button>
        {lead.isActive && (
          <button
            onClick={() => onCallUpdate(lead)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            <PhoneCall size={13} /> Log Call
          </button>
        )}
      </div>
    </div>
  );
};

// ── Create Lead Modal ─────────────────────────────────────────
const CreateLeadModal = ({ employees, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: "",
    leadSource: "",
    projectType: "",
    remarks: "",
    assignedTo: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!/^[6-9]\d{9}$/.test(form.mobileNumber)) e.mobileNumber = "Enter a valid 10-digit Indian mobile";
    if (!form.leadSource) e.leadSource = "Lead source is required";
    if (!form.assignedTo) e.assignedTo = "Please assign to an employee";
    return e;
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  };

  const inp = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white";
  const errInp = "w-full border border-red-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300 bg-red-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create New Lead</h2>
            <p className="text-xs text-slate-500">Fill in the lead details below</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Full Name *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange}
                placeholder="John Doe" className={errors.fullName ? errInp : inp} />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Mobile Number *</label>
              <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange}
                placeholder="9876543210" maxLength={10} className={errors.mobileNumber ? errInp : inp} />
              {errors.mobileNumber && <p className="text-xs text-red-500 mt-1">{errors.mobileNumber}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Lead Source *</label>
              <select name="leadSource" value={form.leadSource} onChange={handleChange}
                className={errors.leadSource ? errInp : inp}>
                <option value="">Select source</option>
                {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.leadSource && <p className="text-xs text-red-500 mt-1">{errors.leadSource}</p>}
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Project Type</label>
              <select name="projectType" value={form.projectType} onChange={handleChange} className={inp}>
                <option value="">Select project type (optional)</option>
                {PROJECT_TYPES.map(t => <option key={t} value={t}>{PROJECT_LABELS[t]}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Assign To *</label>
              <select name="assignedTo" value={form.assignedTo} onChange={handleChange}
                className={errors.assignedTo ? errInp : inp}>
                <option value="">Select employee</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName} — {emp.jobInformation?.designation || "N/A"}
                  </option>
                ))}
              </select>
              {errors.assignedTo && <p className="text-xs text-red-500 mt-1">{errors.assignedTo}</p>}
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Remarks</label>
              <textarea name="remarks" value={form.remarks} onChange={handleChange}
                placeholder="Optional notes about this lead..." rows={3}
                className={`${inp} resize-none`} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Creating...</> : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Log Call Modal ────────────────────────────────────────────
const LogCallModal = ({ lead, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({
    callStatus: "",
    remarks: "",
    followUpDate: "",
    followUpTime: "",
    projectType: "",
  });
  const [errors, setErrors] = useState({});

  const needsFollowUp = ["Not Connected", "Switch Off / Not Reachable", "Not Picked", "Interested"].includes(form.callStatus);

  const validate = () => {
    const e = {};
    if (!form.callStatus) e.callStatus = "Call status is required";
    if (needsFollowUp && !form.followUpDate) e.followUpDate = "Follow-up date is required";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(lead._id, form);
  };

  const inp = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 bg-white";
  const errInp = "w-full border border-red-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300 bg-red-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Log Call</h2>
            <p className="text-xs text-slate-500">{lead.fullName} · {lead.mobileNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Call Status *</label>
            <select value={form.callStatus} onChange={e => setForm(p => ({ ...p, callStatus: e.target.value }))}
              className={errors.callStatus ? errInp : inp}>
              <option value="">Select call outcome</option>
              {CALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.callStatus && <p className="text-xs text-red-500 mt-1">{errors.callStatus}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Remarks</label>
            <textarea value={form.remarks} onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))}
              placeholder="Notes about this call..." rows={3} className={`${inp} resize-none`} />
          </div>

          {form.callStatus === "Interested" && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Project Type</label>
              <select value={form.projectType} onChange={e => setForm(p => ({ ...p, projectType: e.target.value }))} className={inp}>
                <option value="">Select project type</option>
                {PROJECT_TYPES.map(t => <option key={t} value={t}>{PROJECT_LABELS[t]}</option>)}
              </select>
            </div>
          )}

          {needsFollowUp && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Follow-up Date *</label>
                <input type="date" value={form.followUpDate} min={new Date().toISOString().split("T")[0]}
                  onChange={e => setForm(p => ({ ...p, followUpDate: e.target.value }))}
                  className={errors.followUpDate ? errInp : inp} />
                {errors.followUpDate && <p className="text-xs text-red-500 mt-1">{errors.followUpDate}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Follow-up Time</label>
                <input type="time" value={form.followUpTime}
                  onChange={e => setForm(p => ({ ...p, followUpTime: e.target.value }))} className={inp} />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : "Save Call Log"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Lead Detail Modal ─────────────────────────────────────────
const LeadDetailModal = ({ lead, onClose }) => {
  if (!lead) return null;
  const assignee = lead.assignedTo;
  const assigneeName = assignee
    ? `${assignee.firstName || ""} ${assignee.lastName || ""}`.trim()
    : "Unassigned";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col z-10 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white flex-shrink-0">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">{lead.fullName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500">{lead.mobileNumber}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[lead.leadStatus] || "bg-slate-100 text-slate-600"}`}>
                {lead.leadStatus}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500">
            <XCircle size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
            <div><p className="text-xs text-slate-400 uppercase">Lead Source</p><p className="font-semibold text-slate-800 text-sm mt-0.5">{lead.leadSource}</p></div>
            <div><p className="text-xs text-slate-400 uppercase">Project Type</p><p className="font-semibold text-slate-800 text-sm mt-0.5">{lead.projectType ? PROJECT_LABELS[lead.projectType] : "—"}</p></div>
            <div><p className="text-xs text-slate-400 uppercase">Assigned To</p><p className="font-semibold text-slate-800 text-sm mt-0.5">{assigneeName}</p></div>
            <div><p className="text-xs text-slate-400 uppercase">Created</p><p className="font-semibold text-slate-800 text-sm mt-0.5">{new Date(lead.createdAt).toLocaleDateString("en-IN")}</p></div>
            {lead.nextFollowUpDate && (
              <div className="col-span-2">
                <p className="text-xs text-slate-400 uppercase">Next Follow-Up</p>
                <p className="font-semibold text-amber-600 text-sm mt-0.5">
                  {new Date(lead.nextFollowUpDate).toLocaleDateString("en-IN")}
                  {lead.nextFollowUpTime && ` at ${lead.nextFollowUpTime}`}
                </p>
              </div>
            )}
          </div>

          {/* Remarks */}
          {lead.remarks && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Remarks</p>
              <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-100">{lead.remarks}</p>
            </div>
          )}

          {/* Call Logs */}
          {lead.callLogs?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
                <Phone size={13} /> Call History ({lead.callLogs.length})
              </p>
              <div className="space-y-2">
                {[...lead.callLogs].reverse().map((log, i) => (
                  <div key={log._id || i} className="flex gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Phone size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-slate-700">{log.callStatus}</span>
                        <span className="text-xs text-slate-400">{new Date(log.calledAt).toLocaleString("en-IN")}</span>
                      </div>
                      {log.remarks && <p className="text-xs text-slate-500 mt-0.5">{log.remarks}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow Ups */}
          {lead.followUps?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
                <Calendar size={13} /> Follow-Up History ({lead.followUps.length})
              </p>
              <div className="space-y-2">
                {[...lead.followUps].reverse().map((fu, i) => (
                  <div key={fu._id || i} className={`flex gap-3 rounded-xl p-3 border ${fu.isMissed ? "bg-red-50 border-red-100" : fu.isCompleted ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${fu.isMissed ? "bg-red-100 text-red-600" : fu.isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                      <Clock size={13} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {new Date(fu.scheduledDate).toLocaleDateString("en-IN")}
                        {fu.scheduledTime && ` at ${fu.scheduledTime}`}
                      </p>
                      <p className={`text-xs font-medium mt-0.5 ${fu.isMissed ? "text-red-600" : fu.isCompleted ? "text-emerald-600" : "text-amber-600"}`}>
                        {fu.isMissed ? "Missed" : fu.isCompleted ? "Completed" : "Pending"}
                      </p>
                      {fu.remarks && <p className="text-xs text-slate-500 mt-0.5">{fu.remarks}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Pagination Component ──────────────────────────────────────
const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (page <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (page >= totalPages - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = page - 1; i <= page + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
      >
        <ChevronLeft size={15} />
      </button>
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-9 h-9 text-sm rounded-lg border font-medium transition-colors ${
              page === p
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
};

const Lead = () => {
  const dispatch = useDispatch();
  const { leads, loading, error, successMessage, pagination } = useSelector(state => state.lead);
  const { employees } = useSelector(state => state.employee);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ leadStatus: "", leadSource: "", assignedTo: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [callLead, setCallLead] = useState(null);
  const [detailLead, setDetailLead] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const LEADS_PER_PAGE = 12;
  const searchDebounceRef = useRef(null);

  // Centralised fetch — called whenever page / filters / search change
  const doFetch = useCallback((page, searchVal, filterVals) => {
    const params = { page, limit: LEADS_PER_PAGE };
    if (searchVal) params.search = searchVal;
    if (filterVals.leadStatus) params.leadStatus = filterVals.leadStatus;
    if (filterVals.leadSource) params.leadSource = filterVals.leadSource;
    if (filterVals.assignedTo) params.assignedTo = filterVals.assignedTo;
    dispatch(fetchLeads(params));
  }, [dispatch]);

  // Load initial data
  useEffect(() => {
    dispatch(fetchAllEmployees());
    doFetch(1, "", { leadStatus: "", leadSource: "", assignedTo: "" });
  }, [dispatch, doFetch]);

  // Re-fetch when filters change (reset to page 1)
  useEffect(() => {
    setCurrentPage(1);
    doFetch(1, search, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Watch Redux messages
  useEffect(() => {
    if (successMessage) {
      showToast(successMessage, "success");
      dispatch(clearLeadMessages());
    }
    if (error) {
      showToast(error, "error");
      dispatch(clearLeadMessages());
    }
  }, [successMessage, error, dispatch]);

  const showToast = (msg, type = "success") => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Debounced search handler
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      doFetch(1, val, filters);
    }, 350);
  };

  // Summary stats — use pagination.total if available for accurate totals
  const stats = {
    total: pagination?.total ?? leads.length,
    active: leads.filter(l => l.isActive).length,
    interested: leads.filter(l => l.leadStatus === "Interested").length,
    closedWon: leads.filter(l => l.leadStatus === "Closed Won").length,
  };

  const totalPages = pagination?.pages ?? 1;

  // Page change handler
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    doFetch(newPage, search, filters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Create lead handler
  const handleCreateLead = async (formData) => {
    setSubmitting(true);
    try {
      await dispatch(createLead(formData)).unwrap();
      setShowCreateModal(false);
      doFetch(currentPage, search, filters); // refresh current page
    } catch (err) {
      showToast(err?.message || "Failed to create lead", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Log call handler
  const handleLogCall = async (leadId, data) => {
    setSubmitting(true);
    try {
      await dispatch(updateLeadCallStatus({ id: leadId, data })).unwrap();
      setCallLead(null);
      doFetch(currentPage, search, filters); // refresh current page
    } catch (err) {
      showToast(err?.message || "Failed to log call", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const clearFilters = () => setFilters({ leadStatus: "", leadSource: "", assignedTo: "" });

  const handleRefresh = () => doFetch(currentPage, search, filters);

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      {/* Toast */}
      {toastMsg && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toastMsg.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}>
          {toastMsg.type === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {toastMsg.msg}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateLeadModal
          employees={employees}
          loading={submitting}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateLead}
        />
      )}
      {callLead && (
        <LogCallModal
          lead={callLead}
          loading={submitting}
          onClose={() => setCallLead(null)}
          onSubmit={handleLogCall}
        />
      )}
      {detailLead && (
        <LeadDetailModal
          lead={detailLead}
          onClose={() => setDetailLead(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track all your sales leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            title="Refresh"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-indigo-200 transition-all"
          >
            <Plus size={16} /> New Lead
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Leads", value: stats.total, icon: <MessageSquare size={18} />, color: "bg-blue-100 text-blue-600" },
          { label: "Active", value: stats.active, icon: <TrendingUp size={18} />, color: "bg-emerald-100 text-emerald-600" },
          { label: "Interested", value: stats.interested, icon: <Phone size={18} />, color: "bg-purple-100 text-purple-600" },
          { label: "Closed Won", value: stats.closedWon, icon: <CheckCircle size={18} />, color: "bg-green-100 text-green-600" },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or phone number..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(p => !p)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? "bg-indigo-600 text-white border-indigo-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
          >
            <Filter size={15} />
            Filters
            {Object.values(filters).some(Boolean) && (
              <span className="w-5 h-5 rounded-full bg-white text-indigo-600 text-xs font-bold flex items-center justify-center">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
            <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
            <select
              value={filters.leadStatus}
              onChange={e => setFilters(p => ({ ...p, leadStatus: e.target.value }))}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
            >
              <option value="">All Statuses</option>
              {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filters.leadSource}
              onChange={e => setFilters(p => ({ ...p, leadSource: e.target.value }))}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
            >
              <option value="">All Sources</option>
              {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filters.assignedTo}
              onChange={e => setFilters(p => ({ ...p, assignedTo: e.target.value }))}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
            >
              <option value="">All Assignees</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Lead Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 size={36} className="animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Loading leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <MessageSquare size={48} className="text-slate-300 mb-3" />
          <h3 className="font-semibold text-slate-700">No leads found</h3>
          <p className="text-sm text-slate-500 mt-1 mb-4">
            {search || Object.values(filters).some(Boolean)
              ? "Try adjusting your search or filters."
              : "Create your first lead to get started."}
          </p>
          {!search && !Object.values(filters).some(Boolean) && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700"
            >
              <Plus size={15} /> Create Lead
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {leads.map(lead => (
            <LeadCard
              key={lead._id}
              lead={lead}
              onCallUpdate={(l) => setCallLead(l)}
              onViewDetail={(l) => setDetailLead(l)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && leads.length > 0 && (
        <>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
          <p className="text-center text-xs text-slate-400 mt-3">
            Page {currentPage} of {totalPages} · {pagination?.total ?? leads.length} total leads
          </p>
        </>
      )}
    </div>
  );
};

export default Lead;