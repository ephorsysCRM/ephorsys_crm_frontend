import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";

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

// Smart paginator with ellipsis
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

export default function HappyClients() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const searchDebounceRef = useRef(null);

  const fetchClients = async (page = 1, searchVal = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ list: "closedWon", page, limit: LEADS_PER_PAGE });
      if (searchVal) params.set("search", searchVal);
      const res = await api.get(`/lead/get-leads?${params.toString()}`);
      if (res.data.success) {
        setLeads(res.data.data);
        setTotalPages(res.data.pages ?? 1);
        setTotalCount(res.data.total ?? 0);
      }
    } catch {
      toast.error("Failed to load happy clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(1, "");
  }, []);

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
    }, 350);
  };

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
    fetchClients(1, "");
  };

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <Trophy size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Happy Clients</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              All successfully closed deals{totalCount > 0 && ` · ${totalCount} clients`}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or phone..."
            className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-400 bg-white shadow-sm"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <XCircle size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 size={36} className="animate-spin text-emerald-500 mb-3" />
          <p className="text-sm text-slate-500">Loading happy clients...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
            <Trophy size={36} className="text-emerald-400" />
          </div>
          <h3 className="font-semibold text-slate-700 text-lg">No happy clients yet</h3>
          <p className="text-sm text-slate-500 mt-2">
            {search ? `No results for "${search}".` : "Closed deals will appear here."}
          </p>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage + search}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {leads.map((lead, i) => (
                <motion.div
                  key={lead._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-emerald-200 transition-all relative overflow-hidden"
                >
                  {/* Green accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-t-2xl" />

                  <div className="flex items-start justify-between gap-3 mt-1">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                        {lead.fullName}
                      </h3>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <Phone size={11} className="text-slate-400" />
                        {lead.mobileNumber}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Star size={16} className="text-emerald-500 fill-emerald-200" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {lead.projectType && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <TrendingUp size={12} className="text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{PROJECT_LABELS[lead.projectType] || lead.projectType}</span>
                      </div>
                    )}
                    {lead.leadSource && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="w-3 h-3 rounded-full bg-indigo-100 flex-shrink-0" />
                        {lead.leadSource}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar size={11} className="flex-shrink-0" />
                      Closed: {new Date(lead.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      <Trophy size={11} />
                      Closed Won
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <Pagination page={currentPage} totalPages={totalPages} onChange={handlePageChange} />
          <p className="text-center text-xs text-slate-400 mt-3">
            Page {currentPage} of {totalPages} · {totalCount} total happy clients
          </p>
        </>
      )}
    </div>
  );
}
