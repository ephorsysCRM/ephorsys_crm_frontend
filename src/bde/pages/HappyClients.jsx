import { useState, useEffect, useRef, useCallback } from "react";
import {
  Trophy,
  Phone,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  XCircle,
  MessageCircle,
  Eye,
  Briefcase,
  Layers,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api";
import LeadDetailModal from "../components/LeadDetailModal";

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

const LEADS_PER_PAGE = 12;

// ── Smart Paginator ─────────────────────────────────────────────
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
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
      >
        <ChevronLeft size={16} />
      </button>
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="px-2 text-slate-400 text-sm select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-10 h-10 text-sm rounded-xl border font-bold transition-all ${
              page === p
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20 scale-105"
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
        className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// ── Ultra-Premium Client Card ────────────────────────────────────
const ClientCard = ({ lead, onViewDetails }) => {
  const cleanPhone = (lead.mobileNumber || "").replace(/\D/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone}`
    : "#";

  const initials = (lead.fullName || "C")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:shadow-xl hover:border-emerald-300/80 transition-all duration-300 relative flex flex-col justify-between group overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />
      
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-t-2xl" />

      <div>
        {/* Header Row: Initials Avatar + Name & Phone + Star Badge */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-emerald-500/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              {initials}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-base leading-snug truncate group-hover:text-emerald-700 transition-colors">
                {lead.fullName}
              </h3>
              <a
                href={`tel:${lead.mobileNumber}`}
                className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 hover:text-indigo-600 font-semibold transition-colors w-fit"
                title="Click to Call"
              >
                <Phone size={12} className="text-emerald-500" />
                {lead.mobileNumber}
              </a>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-bold tracking-wide flex-shrink-0 shadow-2xs">
            <Sparkles size={11} className="text-emerald-500 fill-emerald-200" />
            Closed Won
          </span>
        </div>

        {/* Information Grid */}
        <div className="mt-4 pt-3 border-t border-slate-100/80 space-y-2.5">
          {lead.projectType && (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Briefcase size={12} />
              </div>
              <span className="font-semibold text-slate-700 truncate">
                {PROJECT_LABELS[lead.projectType] || lead.projectType}
              </span>
            </div>
          )}

          {lead.leadSource && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-5 h-5 rounded-md bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                <Layers size={12} />
              </div>
              <span className="text-slate-500">Source:</span>
              <span className="font-medium text-slate-700">{lead.leadSource}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
              <Calendar size={12} />
            </div>
            <span>Closed Date:</span>
            <span className="font-medium text-slate-700">
              {new Date(lead.updatedAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <a
            href={`tel:${lead.mobileNumber}`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600 transition-colors shadow-2xs"
            title="Call Client"
          >
            <Phone size={14} />
          </a>
          {cleanPhone && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600 transition-colors shadow-2xs"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={14} />
            </a>
          )}
        </div>

        <button
          onClick={() => onViewDetails(lead._id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold transition-all shadow-2xs"
        >
          <Eye size={13} />
          View Details
        </button>
      </div>
    </div>
  );
};

// ── Main Page ───────────────────────────────────────────────────
export default function BdeHappyClients() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const searchDebounceRef = useRef(null);

  const fetchClients = useCallback(async (page, searchVal) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        list: "closedWon",
        page: String(page),
        limit: String(LEADS_PER_PAGE),
      });
      if (searchVal && searchVal.trim()) {
        params.set("search", searchVal.trim());
      }
      const res = await api.get(`/lead/get-leads?${params.toString()}`);
      if (res.data.success) {
        setLeads(res.data.data || []);
        setTotalPages(res.data.pages ?? 1);
        setTotalCount(res.data.total ?? 0);
      }
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients(1, "");
  }, [fetchClients]);

  const handlePageChange = (p) => {
    setCurrentPage(p);
    fetchClients(p, search);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchClients(1, val);
    }, 300);
  };

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
    fetchClients(1, "");
  };

  const handleRefresh = () => {
    fetchClients(currentPage, search);
  };

  const filteredLeads = leads.filter((lead) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const cleanQ = q.replace(/\D/g, "");
    const cleanMobile = (lead.mobileNumber || "").replace(/\D/g, "");

    return (
      lead.fullName?.toLowerCase().includes(q) ||
      lead.mobileNumber?.includes(q) ||
      (cleanQ && cleanMobile.includes(cleanQ)) ||
      lead.leadSource?.toLowerCase().includes(q) ||
      lead.projectType?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 md:p-8 bg-slate-50/60 min-h-screen">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/25 p-3.5">
            <Trophy size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Happy Clients</h1>
            <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
              <span>All your successfully closed deals</span>
              {totalCount > 0 && (
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                  {totalCount} Total
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name, phone number..."
              className="w-full pl-10 pr-9 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm transition-all"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                title="Clear Search"
              >
                <XCircle size={16} />
              </button>
            )}
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh List"
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? "animate-spin text-emerald-600" : ""} />
          </button>
        </div>
      </div>

      {/* Search notification */}
      {search && !loading && (
        <div className="mb-5 flex items-center justify-between bg-emerald-50/70 border border-emerald-200/80 px-4 py-2.5 rounded-xl text-sm text-emerald-900">
          <div className="flex items-center gap-2">
            <Search size={15} className="text-emerald-600" />
            <span>
              Search results for <strong className="font-semibold">"{search}"</strong>
              <span className="ml-2 px-2 py-0.5 bg-emerald-200/80 text-emerald-900 text-xs font-bold rounded-md">
                {totalCount} found
              </span>
            </span>
          </div>
          <button
            onClick={clearSearch}
            className="text-emerald-700 hover:text-emerald-950 font-bold text-xs underline"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <Loader2 size={40} className="animate-spin text-emerald-600" />
          <p className="text-sm font-semibold text-slate-500">Searching happy clients...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
            <Trophy size={36} className="text-emerald-400" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No Happy Clients Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            {search
              ? `No client matched your search "${search}". Check phone number or name.`
              : "Closed Won leads will appear here automatically."}
          </p>
          {search && (
            <button
              onClick={clearSearch}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Reset Search Filter
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filteredLeads.map((lead) => (
              <ClientCard
                key={lead._id}
                lead={lead}
                onViewDetails={(id) => setSelectedLeadId(id)}
              />
            ))}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
          <p className="text-center text-xs text-slate-400 mt-4">
            Showing Page {currentPage} of {totalPages} · Total {totalCount} Happy Clients
          </p>
        </>
      )}

      {/* Modal */}
      {selectedLeadId && (
        <LeadDetailModal
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onRefresh={() => fetchClients(currentPage, search)}
        />
      )}
    </div>
  );
}
