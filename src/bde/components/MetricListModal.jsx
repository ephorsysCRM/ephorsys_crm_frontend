import { useState, useEffect } from "react";
import { XCircle, Loader2, Phone, User, Eye } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import socket from "../../services/socket.js";
import toast from "react-hot-toast";

export default function MetricListModal({ listType, title, onClose, onLeadSelect }) {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/lead/get-leads?list=${listType}&limit=50`);
        if (res.data.success) {
          setLeads(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    };
    if (listType) {
      fetchList();
    }

    // Listen for real-time updates and auto-refresh the list
    const handleUpdate = () => {
      if (listType) fetchList();
    };
    socket.on("lead:follow_ups_updated", handleUpdate);
    socket.on("lead:stats_updated", handleUpdate);

    return () => {
      socket.off("lead:follow_ups_updated", handleUpdate);
      socket.off("lead:stats_updated", handleUpdate);
    };
  }, [listType]);

  // Full badge styling per status — distinct background so statuses read apart at a glance
  const statusStyles = {
    "New": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
    "Attempted": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
    "Interested": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
    "Not Picked": { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-300", dot: "bg-slate-400" },
    "Meeting": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
    "Closed Won": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    "Closed Lost": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
    "Rejected": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
  };
  const defaultStatusStyle = { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col relative z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Showing up to 50 leads</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-full shadow-sm transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30 p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#74C316] animate-spin mb-3" />
              <p className="text-slate-500 font-medium">Fetching leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-slate-500 font-medium">No leads found for this list.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {leads.map((lead) => {
                const style = statusStyles[lead.leadStatus] || defaultStatusStyle;
                return (
                  <div
                    key={lead._id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-[#74C316]/40 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#74C316]/10 flex items-center justify-center shrink-0">
                        <User size={16} className="text-[#5c9412]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 truncate">{lead.fullName}</h4>
                        <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                          <Phone size={14} className="text-slate-400" /> {lead.mobileNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right hidden sm:block">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {lead.leadStatus}
                        </span>
                        {lead.nextFollowUpDate && (
                          <p className="text-xs text-slate-500 mt-1.5">
                            Follow-up: {new Date(lead.nextFollowUpDate).toLocaleDateString("en-GB")}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          onLeadSelect(lead._id);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#74C316]/40 text-[#5c9412] text-sm font-semibold hover:bg-[#74C316] hover:text-white hover:border-[#74C316] transition-colors"
                      >
                        <Eye size={14} />
                        View & Update
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}