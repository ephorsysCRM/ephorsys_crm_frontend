import { useState, useEffect, useRef } from "react";
import {
  Users,
  Flame,
  Kanban,
  Plus,
  Loader2,
  Phone,
  Calendar,
  XCircle,
  PhoneCall,
  AlertCircle,
  Handshake,
  ListTodo,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import LeadDetailModal from "../components/LeadDetailModal";
import MetricListModal from "../components/MetricListModal";
import socket from "../../services/socket.js";

export default function Lead() {
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [pipeline, setPipeline] = useState({});
  const [hotlist, setHotlist] = useState([]);
  const [activePipelineStage, setActivePipelineStage] = useState("Interested");
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [search, setSearch] = useState("");
  const searchDebounceRef = useRef(null);
  const LEADS_PER_PAGE = 10;

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [activeListModal, setActiveListModal] = useState(null);

  // Form State for Create
  const [createData, setCreateData] = useState({
    fullName: "",
    mobileNumber: "",
    leadSource: "Google Ads",
    projectType: "website_development",
    remarks: "",
    // Initial call tracking
    logInitialCall: false,
    initialCallStatus: "Connected",
    isInterested: false,
    followUpDate: "",
    followUpTime: "",
  });

  const LEAD_SOURCES = [
    "Google Ads",
    "Website",
    "Referral",
    "Direct Call",
    "Walk-In",
    "Justdial",
    "Meta Ads",
  ];

  const PROJECT_TYPES = [
    "website_development",
    "web_app_development",
    "mobile_app_development",
    "ui_ux_design",
    "graphic_design",
    "seo",
    "social_media_marketing",
    "paid_ads_management",
    "business_consulting",
    "it_consulting",
    "maintenance_support",
    "amc",
    "crm_development",
    "custom_software",
    "automation_service",
    "others",
  ];

  const CALL_STATUSES = [
    "Connected",
    "Not Connected",
    "Switch Off / Not Reachable",
    "Blocked",
    "Wrong Number",
    "Denied",
    "Not Picked",
    "Wrongly Inquired",
  ];

  const NOT_PICKED_STATUSES = [
    "Not Connected",
    "Switch Off / Not Reachable",
    "Not Picked",
  ];

  const formatProjectType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const filteredLeads = leads.filter((lead) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const cleanQ = q.replace(/\D/g, "");
    const cleanMobile = (lead.mobileNumber || "").replace(/\D/g, "");

    return (
      lead.fullName?.toLowerCase().includes(q) ||
      lead.mobileNumber?.includes(q) ||
      (cleanQ.length >= 3 && cleanMobile.includes(cleanQ)) ||
      lead.leadSource?.toLowerCase().includes(q) ||
      lead.projectType?.toLowerCase().includes(q)
    );
  });

  const fetchData = async (page = 1, searchVal = "") => {
    setLoading(true);
    try {
      // Always fetch stats to update the ribbon
      const statsRes = await api.get("/lead/dashboard");
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      if (activeTab === "all") {
        const params = new URLSearchParams({ page, limit: LEADS_PER_PAGE });
        if (searchVal) params.set("search", searchVal);
        const res = await api.get(`/lead/get-leads?${params.toString()}`);
        setLeads(res.data.data);
        setTotalPages(res.data.pages ?? 1);
        setTotalLeadsCount(res.data.total ?? 0);
      } else if (activeTab === "pipeline") {
        const res = await api.get("/lead/pipeline");
        setPipeline(res.data.data);
      } else if (activeTab === "hotlist") {
        const res = await api.get("/lead/hotlist");
        setHotlist(res.data.data);
      }
    } catch {
      toast.error("Failed to load leads data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setSearch("");
    fetchData(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    socket.on("lead:stats_updated", (data) => setStats(data));

    // New listener for follow‑up list updates
    socket.on("lead:follow_ups_updated", (data) => {
      if (Array.isArray(data)) {
        setHotlist(data);
      } else if (data.hotlist) {
        setHotlist(data.hotlist);
      } else {
        fetchData(currentPage, search);
      }
    });

    return () => {
      socket.off("lead:stats_updated");
      socket.off("lead:follow_ups_updated");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload
    const payload = { ...createData };

    if (!payload.logInitialCall) {
      delete payload.initialCallStatus;
      delete payload.isInterested;
      delete payload.followUpDate;
      delete payload.followUpTime;
    } else {
      // Check if followUp is required
      const requiresFollowUp =
        (payload.initialCallStatus === "Connected" && payload.isInterested) ||
        NOT_PICKED_STATUSES.includes(payload.initialCallStatus);

      if (
        requiresFollowUp &&
        (!payload.followUpDate || !payload.followUpTime)
      ) {
        toast.error(
          "Follow-up date and time are required for this call status.",
        );
        return;
      }
    }

    delete payload.logInitialCall; // Cleanup internal toggle

    try {
      const res = await api.post("/lead/create-lead", payload);
      if (res.data.success) {
        toast.success("Lead created successfully");
        setShowCreateModal(false);
        // Reset form
        setCreateData({
          fullName: "",
          mobileNumber: "",
          leadSource: "Google Ads",
          projectType: "website_development",
          remarks: "",
          logInitialCall: false,
          initialCallStatus: "Connected",
          isInterested: false,
          followUpDate: "",
          followUpTime: "",
        });
        fetchData(currentPage, search);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create lead");
    }
  };

  const statusColors = {
    New: "bg-blue-100 text-blue-700",
    Attempted: "bg-indigo-100 text-indigo-700",
    Interested: "bg-amber-100 text-amber-700",
    "Not Picked": "bg-slate-100 text-slate-700",
    Meeting: "bg-purple-100 text-purple-700",
    "Closed Won": "bg-emerald-100 text-emerald-700",
    "Closed Lost": "bg-red-100 text-red-700",
    Rejected: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col h-full min-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Track, update, and manage your assigned leads.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium shadow-sm transition-all shadow-indigo-200 shrink-0"
        >
          <Plus size={18} />
          Create Lead
        </button>
      </div>

      {/* Metrics Ribbon */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() =>
              setActiveListModal({
                type: "todayAttempted",
                title: "Today Attempted Calls",
              })
            }
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600">
              <PhoneCall size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">
                Today Attempted
              </p>
              <h3 className="text-xl font-bold text-slate-800">
                {stats.todayAttempted}
              </h3>
            </div>
          </div>
          <div
            onClick={() =>
              setActiveListModal({
                type: "todayFollowUps",
                title: "Daily Follow-ups",
              })
            }
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="bg-amber-100 p-2.5 rounded-lg text-amber-600">
              <ListTodo size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">
                Daily Follow-ups
              </p>
              <h3 className="text-xl font-bold text-slate-800">
                {stats.todayFollowUps}
              </h3>
            </div>
          </div>
          <div
            onClick={() =>
              setActiveListModal({ type: "todayMeetings", title: "Today's Meetings" })
            }
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:border-purple-300 hover:shadow-md transition-all"
          >
            <div className="bg-purple-100 p-2.5 rounded-lg text-purple-600">
              <Handshake size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">
                Today's Meetings
              </p>
              <h3 className="text-xl font-bold text-slate-800">
                {stats.todayMeetings}
              </h3>
            </div>
          </div>
          <div
            onClick={() =>
              setActiveListModal({ type: "missed", title: "Missed Follow-ups" })
            }
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:border-red-300 hover:shadow-md transition-all"
          >
            <div
              className={`p-2.5 rounded-lg ${stats.missedFollowUps > 0 ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"}`}
            >
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">
                Missed Follow-ups
              </p>
              <h3 className="text-xl font-bold text-slate-800">
                {stats.missedFollowUps}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100/80 p-1 rounded-xl mb-6 self-start">
        {[
          { id: "all", label: "All Leads", icon: Users },
          { id: "pipeline", label: "Pipeline", icon: Kanban },
          { id: "hotlist", label: "Hotlist", icon: Flame },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
            <span className="text-sm font-medium text-slate-500">
              Loading leads...
            </span>
          </div>
        ) : null}
        {/* Tab 1: All Leads Table */}
       {activeTab === "all" && (
  <div className="h-full flex flex-col">
    {/* Search Bar */}
    <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50">
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            const val = e.target.value;
            setSearch(val);
            clearTimeout(searchDebounceRef.current);
            searchDebounceRef.current = setTimeout(() => {
              setCurrentPage(1);
              fetchData(1, val);
            }, 350);
          }}
          placeholder="Search by name or phone number..."
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
        {search && (
          <button
            onClick={() => {
              setSearch("");
              setCurrentPage(1);
              fetchData(1, "");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <XCircle size={15} />
          </button>
        )}
      </div>
    </div>

    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
            Lead Name
          </th>
          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
            Mobile
          </th>
          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
            Status
          </th>
          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
            Project
          </th>
          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {filteredLeads.length === 0 ? (
          <tr>
            <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
              {search ? `No leads found for "${search}".` : "No leads found."}
            </td>
          </tr>
        ) : (
          filteredLeads.map((lead) => (
            <motion.tr
              key={lead._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hover:bg-slate-50 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-slate-900">
                {lead.fullName}
              </td>

              <td className="px-6 py-4 text-slate-600">
                {lead.mobileNumber}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    statusColors[lead.leadStatus] ||
                    "bg-slate-100 text-slate-600"
                  }`}
                >
                  {lead.leadStatus}
                </span>
              </td>

              <td className="px-6 py-4 text-slate-600">
                {formatProjectType(lead.projectType || "N/A")}
              </td>

              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => setSelectedLeadId(lead._id)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  View &amp; Update
                </button>
              </td>
            </motion.tr>
          ))
        )}
      </tbody>
    </table>

    {/* Pagination footer */}
    {totalPages >= 1 && leads.length > 0 && (
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white mt-auto flex-wrap gap-3">
        <p className="text-sm text-slate-500">
          {totalLeadsCount > 0
            ? `Showing ${(currentPage - 1) * LEADS_PER_PAGE + 1}–${Math.min(currentPage * LEADS_PER_PAGE, totalLeadsCount)} of ${totalLeadsCount} leads`
            : `${leads.length} leads`}
        </p>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              const p = currentPage - 1;
              setCurrentPage(p);
              fetchData(p, search);
            }}
            className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>

          {(() => {
            const getPages = () => {
              if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
              const pages = [];
              if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
              } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
              }
              return pages;
            };

            return getPages().map((p, i) =>
              p === "..." ? (
                <span key={`e-${i}`} className="px-1 text-slate-400 text-sm select-none">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => {
                    setCurrentPage(p);
                    fetchData(p, search);
                  }}
                  className={`w-9 h-9 text-sm rounded-lg border font-medium transition-colors ${
                    currentPage === p
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              )
            );
          })()}

          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              const p = currentPage + 1;
              setCurrentPage(p);
              fetchData(p, search);
            }}
            className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    )}
  </div>
)}

        {/* Tab 2: Pipeline Kanban (simplified layout) */}
        {activeTab === "pipeline" && (
          <div className="p-6 h-full bg-slate-50/50 overflow-y-auto">
            {/* Pipeline Stage Buttons */}
            <div className="flex gap-3 mb-6 overflow-x-auto">
              {Object.keys(pipeline).map((stage) => {
                const stageLeads = pipeline[stage];

                if (stageLeads.length === 0) return null;

                return (
                  <button
                    key={stage}
                    onClick={() => setActivePipelineStage(stage)}
                    className={`shrink-0 px-5 py-3 rounded-xl text-sm font-semibold transition-all border ${
                      activePipelineStage === stage
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {stage}
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        activePipelineStage === stage
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {stageLeads.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Leads */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-semibold text-lg text-slate-800">
                  {activePipelineStage}
                </h3>

                <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
                  {pipeline[activePipelineStage]?.length || 0} Leads
                </span>
              </div>

              {pipeline[activePipelineStage]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {pipeline[activePipelineStage].map((lead) => (
                    <div
                      key={lead._id}
                      onClick={() => setSelectedLeadId(lead._id)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <h4 className="font-semibold text-slate-900 text-sm">
                        {lead.fullName}
                      </h4>

                      <p className="text-xs text-slate-500 mt-1">
                        {lead.mobileNumber}
                      </p>

                      {lead.projectType && (
                        <p className="text-xs text-indigo-600 mt-3 font-medium bg-indigo-50 inline-block px-2 py-1 rounded-md">
                          {formatProjectType(lead.projectType)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-10 text-sm font-medium text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  No leads found in {activePipelineStage}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Tab 3: Hotlist */}
        {activeTab === "hotlist" && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotlist.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500">
                No hot leads right now. Set follow-ups to populate this list.
              </div>
            ) : (
              hotlist.map((lead) => (
                <div
                  key={lead._id}
                  className="bg-white border-2 border-amber-100 rounded-xl p-5 hover:border-amber-300 transition-all shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-900">
                      {lead.fullName}
                    </h3>
                    <Flame className="text-amber-500 w-5 h-5" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Phone size={14} /> {lead.mobileNumber}
                    </p>
                    <p className="text-sm text-amber-700 font-medium flex items-center gap-2">
                      <Calendar size={14} />
                      Next Follow-up:{" "}
                      {new Date(lead.nextFollowUpDate).toLocaleDateString(
                        "en-GB",
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedLeadId(lead._id)}
                    className="w-full py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 transition-colors"
                  >
                    Action Required
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh] relative z-10"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-20">
                <h2 className="text-lg font-bold text-slate-800">
                  Add New Lead
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={createData.fullName}
                      onChange={(e) =>
                        setCreateData({
                          ...createData,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="^[6-9]\d{9}$"
                      maxLength={10}
                      title="Enter a valid 10-digit Indian mobile number starting with 6-9"
                      value={createData.mobileNumber}
                      onChange={(e) =>
                        setCreateData({
                          ...createData,
                          mobileNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Project Type *
                    </label>
                    <select
                      value={createData.projectType}
                      onChange={(e) =>
                        setCreateData({
                          ...createData,
                          projectType: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {formatProjectType(type)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Lead Source *
                    </label>
                    <select
                      value={createData.leadSource}
                      onChange={(e) =>
                        setCreateData({
                          ...createData,
                          leadSource: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      {LEAD_SOURCES.map((source) => (
                        <option key={source} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Initial Remarks
                  </label>
                  <textarea
                    rows="2"
                    value={createData.remarks}
                    onChange={(e) =>
                      setCreateData({ ...createData, remarks: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Any initial notes about the client..."
                  ></textarea>
                </div>

                {/* Initial Call Section */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">
                        Log Initial Call?
                      </h4>
                      <p className="text-xs text-slate-500">
                        Record a call attempt while creating this lead
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={createData.logInitialCall}
                        onChange={(e) =>
                          setCreateData({
                            ...createData,
                            logInitialCall: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {createData.logInitialCall && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pt-2 border-t border-slate-200 space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Call Status *
                          </label>
                          <select
                            value={createData.initialCallStatus}
                            onChange={(e) =>
                              setCreateData({
                                ...createData,
                                initialCallStatus: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                          >
                            {CALL_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                        {createData.initialCallStatus === "Connected" && (
                          <div className="flex flex-col justify-center">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Is the client interested?
                            </label>
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                  type="radio"
                                  name="interested"
                                  checked={createData.isInterested}
                                  onChange={() =>
                                    setCreateData({
                                      ...createData,
                                      isInterested: true,
                                    })
                                  }
                                  className="text-indigo-600 focus:ring-indigo-500"
                                />{" "}
                                Yes
                              </label>
                              <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                  type="radio"
                                  name="interested"
                                  checked={!createData.isInterested}
                                  onChange={() =>
                                    setCreateData({
                                      ...createData,
                                      isInterested: false,
                                    })
                                  }
                                  className="text-indigo-600 focus:ring-indigo-500"
                                />{" "}
                                No
                              </label>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Follow up logic */}
                      {((createData.initialCallStatus === "Connected" &&
                        createData.isInterested) ||
                        NOT_PICKED_STATUSES.includes(
                          createData.initialCallStatus,
                        )) && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Follow-up Date *
                            </label>
                            <input
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              required
                              value={createData.followUpDate}
                              onChange={(e) =>
                                setCreateData({
                                  ...createData,
                                  followUpDate: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Follow-up Time *
                            </label>
                            <input
                              type="time"
                              required
                              value={createData.followUpTime}
                              onChange={(e) =>
                                setCreateData({
                                  ...createData,
                                  followUpTime: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                  >
                    Save Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEAD DETAIL MODAL */}
      {selectedLeadId && (
        <LeadDetailModal
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onRefresh={fetchData}
        />
      )}

      {/* METRIC LIST MODAL */}
      {activeListModal && (
        <MetricListModal
          listType={activeListModal.type}
          title={activeListModal.title}
          onClose={() => setActiveListModal(null)}
          onLeadSelect={(id) => {
            setActiveListModal(null);
            setSelectedLeadId(id);
          }}
        />
      )}
    </div>
  );
}
