import { useState, useEffect, useRef, useCallback } from "react";
import {
  Trophy,
  Phone,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calendar,
  XCircle,
  Star,
  User,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api";

// ── Constants ──────────────────────────────────────────────────
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

// ── Smart paginator ─────────────────────────────────────────────
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
          <span key={`e-${i}`} className="px-2 text-slate-400 text-sm select-none">…</span>
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

// ── Client Card ─────────────────────────────────────────────────
const ClientCard = ({ lead }) => {
  const assignee = lead.assignedTo;
  const assigneeName = assignee
    ? `${assignee.firstName || ""} ${assignee.lastName || ""}`.trim()
    : "Unassigned";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 relative overflow-hidden group">
      {/* Top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-t-2xl" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mt-1">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900 text-[15px] leading-snug truncate">
            {lead.fullName}
          </h3>
          <a
            href={`tel:${lead.mobileNumber}`}
            className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 hover:text-indigo-600 transition-colors w-fit"
          >
            <Phone size={11} className="text-slate-400" />
            {lead.mobileNumber}
          </a>
        </div>
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
          <Star size={18} className="text-emerald-500 fill-emerald-200" />
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2.5">
        {lead.projectType && (
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <TrendingUp size={12} className="text-emerald-500 flex-shrink-0" />
            <span className="truncate font-medium">
              {PROJECT_LABELS[lead.projectType] || lead.projectType}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <User size={11} className="text-indigo-400 flex-shrink-0" />
          <span className="truncate">{assigneeName}</span>
        </div>
        {lead.leadSource && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-indigo-200 flex-shrink-0" />
            {lead.leadSource}
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar size={11} className="flex-shrink-0" />
          Closed:{" "}
          {new Date(lead.updatedAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Footer badge */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wide">
          <Trophy size={10} />
          Closed Won
        </span>
      </div>
    </div>
  );
};

// ── Main Page ───────────────────────────────────────────────────
export default function AdminHappyClients() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fetchError, setFetchError] = useState(null);
  const searchDebounceRef = useRef(null);

  // Centralised fetch — useCallback so it's stable
  const fetchClients = useCallback(async (page, searchVal) => {
    setLoading(true);
    setFetchError(null);
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
    } catch (err) {
      setFetchError(err.response?.data?.message || "Failed to load happy clients.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
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
    }, 400);
  };

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
    fetchClients(1, "");
  };

  const handleRefresh = () => {
    fetchClients(currentPage, search);
  };

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200/60">
            <Trophy size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Happy Clients</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              All successfully closed deals across the team
              {totalCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                  {totalCount} clients
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name or phone..."
              className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-shadow"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle size={15} />
              </button>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh"
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Search active indicator */}
      {search && !loading && (
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <Search size={14} />
          <span>
            {totalCount > 0
              ? `${totalCount} result${totalCount !== 1 ? "s" : ""} for "${search}"`
              : `No results for "${search}"`}
          </span>
          <button
            onClick={clearSearch}
            className="text-indigo-600 hover:underline text-xs ml-1 font-medium"
          >
            Clear
          </button>
        </div>
      )}

      {/* ── Error ── */}
      {fetchError && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <XCircle size={16} className="flex-shrink-0" />
          {fetchError}
        </div>
      )}

      {/* ── Loading State ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Loading happy clients...</p>
        </div>

      ) : leads.length === 0 ? (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-5 shadow-inner">
            <Trophy size={36} className="text-emerald-300" />
          </div>
          <h3 className="font-bold text-slate-700 text-lg">No happy clients found</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-xs">
            {search
              ? `No results match "${search}". Try a different name or phone number.`
              : "Closed Won leads will appear here."}
          </p>
          {search && (
            <button
              onClick={clearSearch}
              className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>

      ) : (
        /* ── Grid ── */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {leads.map((lead) => (
              <ClientCard key={lead._id} lead={lead} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
          <p className="text-center text-xs text-slate-400 mt-3">
            Showing page {currentPage} of {totalPages} · {totalCount} total happy clients
          </p>
        </>
      )}
    </div>
  );
}
