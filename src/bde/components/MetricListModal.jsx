import { useState, useEffect } from "react";
import { XCircle, Loader2, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
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
      } catch (err) {
        toast.error("Failed to load list details.");
      } finally {
        setLoading(false);
      }
    };
    if (listType) {
      fetchList();
    }
  }, [listType]);

  const statusColors = {
    "New": "bg-blue-100 text-blue-700",
    "Attempted": "bg-indigo-100 text-indigo-700",
    "Interested": "bg-amber-100 text-amber-700",
    "Not Picked": "bg-slate-100 text-slate-700",
    "Meeting": "bg-purple-100 text-purple-700",
    "Closed Won": "bg-emerald-100 text-emerald-700",
    "Closed Lost": "bg-red-100 text-red-700",
    "Rejected": "bg-rose-100 text-rose-700"
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div 
          initial={{opacity:0, y:20, scale:0.95}} 
          animate={{opacity:1, y:0, scale:1}} 
          exit={{opacity:0, y:20, scale:0.95}} 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col relative z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
            <div>
              <h2 className="text-lg font-bold text-slate-800">{title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Showing up to 50 leads</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-full shadow-sm"><XCircle size={24}/></button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30 p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                <p className="text-slate-500 font-medium">Fetching leads...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-slate-500 font-medium">No leads found for this list.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {leads.map(lead => (
                  <div key={lead._id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800">{lead.fullName}</h4>
                      <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                        <Phone size={14} className="text-indigo-400"/> {lead.mobileNumber}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                         <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full uppercase tracking-wide ${statusColors[lead.leadStatus] || "bg-slate-100 text-slate-600"}`}>
                           {lead.leadStatus}
                         </span>
                         {lead.nextFollowUpDate && (
                           <p className="text-xs text-slate-500 mt-1.5">
                             Follow-up: {new Date(lead.nextFollowUpDate).toLocaleDateString('en-GB')}
                           </p>
                         )}
                      </div>
                      
                      <button 
                        onClick={() => {
                          onLeadSelect(lead._id);
                        }}
                        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        View & Update
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
