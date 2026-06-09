import { useState, useEffect } from "react";
import { 
  XCircle, Loader2, Phone, Calendar, 
  History, CheckCircle2, MessageSquare, PhoneCall, Handshake
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../services/api";

const CALL_STATUSES = [
  "Connected", "Not Connected", "Switch Off / Not Reachable", 
  "Blocked", "Wrong Number", "Denied", "Not Picked"
];

const NOT_PICKED_STATUSES = [
  "Not Connected", "Switch Off / Not Reachable", "Not Picked"
];

export default function LeadDetailModal({ leadId, onClose, onRefresh }) {
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState(null);
  
  // Action Tabs
  const [activeTab, setActiveTab] = useState("log-call");
  
  // Form States
  const [callData, setCallData] = useState({
    callStatus: "Connected",
    isInterested: false,
    followUpDate: "",
    followUpTime: "",
    projectType: "",
    remarks: "",
  });

  const [meetingData, setMeetingData] = useState({
    meetingDate: "",
    meetingTime: "",
    type: "Online",
    address: "",
    meetingLink: "",
    remarks: "",
  });

  const [closeData, setCloseData] = useState({
    outcome: "Closed Won",
    remarks: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchLead = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/lead/get-lead/${leadId}`);
      if (res.data.success) {
        setLead(res.data.data);
        setCallData(prev => ({ ...prev, projectType: res.data.data.projectType || "" }));
      }
    } catch {
      toast.error("Failed to load lead details.");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    if (leadId) fetchLead();
  }, [leadId]);

  const isClosed = ["Closed Won", "Closed Lost", "Rejected"].includes(lead?.leadStatus);

  const handleCallUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...callData };
      if (payload.callStatus !== "Connected" || !payload.isInterested) {
         if (!NOT_PICKED_STATUSES.includes(payload.callStatus)) {
            delete payload.followUpDate;
            delete payload.followUpTime;
         }
      }
      
      const res = await api.patch(`/lead/${leadId}/update-lead`, payload);
      if (res.data.success) {
        toast.success("Call logged successfully!");
        fetchLead();
        onRefresh();
        setCallData(prev => ({...prev, remarks: "", followUpDate: "", followUpTime: ""}));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log call.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMeetingSchedule = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post(`/lead/${leadId}/meeting`, meetingData);
      if (res.data.success) {
        toast.success("Meeting scheduled successfully!");
        fetchLead();
        onRefresh();
        setMeetingData({ meetingDate: "", meetingTime: "", type: "Online", address: "", meetingLink: "", remarks: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to schedule meeting.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseLead = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.patch(`/lead/${leadId}/close`, closeData);
      if (res.data.success) {
        toast.success(`Lead marked as ${closeData.outcome}!`);
        fetchLead();
        onRefresh();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to close lead.");
    } finally {
      setSubmitting(false);
    }
  };

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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div 
          initial={{opacity:0, y:20, scale:0.95}} 
          animate={{opacity:1, y:0, scale:1}} 
          exit={{opacity:0, y:20, scale:0.95}} 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col relative z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-800">Lead Details</h2>
              {lead && (
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${statusColors[lead.leadStatus] || "bg-slate-100 text-slate-600"}`}>
                  {lead.leadStatus}
                </span>
              )}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-full shadow-sm"><XCircle size={24}/></button>
          </div>

          {loading || !lead ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-white/50">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
              <p className="text-slate-500 font-medium">Fetching lead history...</p>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              
              {/* Left Column: Info & Timeline */}
              <div className="w-full md:w-1/2 p-6 border-r border-slate-100 overflow-y-auto bg-slate-50/30 custom-scrollbar">
                
                {/* Profile Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
                   <h3 className="text-xl font-bold text-slate-900 mb-1">{lead.fullName}</h3>
                   <div className="space-y-2 mt-4">
                     <p className="text-sm text-slate-600 flex items-center gap-2"><Phone size={16} className="text-indigo-400"/> <span className="font-medium text-slate-800">{lead.mobileNumber}</span></p>
                     <p className="text-sm text-slate-600 flex items-center gap-2"><Calendar size={16} className="text-indigo-400"/> Created: {new Date(lead.createdAt).toLocaleDateString('en-GB')}</p>
                     <p className="text-sm text-slate-600 flex items-center gap-2"><MessageSquare size={16} className="text-indigo-400"/> Source: {lead.leadSource}</p>
                   </div>
                </div>

                {/* Timeline */}
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <History size={18} className="text-slate-400"/> Interaction History
                </h4>
                
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
                  
                  {lead.callLogs?.length === 0 && lead.meetings?.length === 0 ? (
                    <p className="text-sm text-slate-500 pl-12">No interactions logged yet.</p>
                  ) : (
                    [...(lead.callLogs || []), ...(lead.meetings || [])]
                      .sort((a, b) => new Date(b.calledAt || b.createdAt) - new Date(a.calledAt || a.createdAt))
                      .map((item, i) => (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          {/* Icon */}
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-100 text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            {item.callStatus ? <PhoneCall size={16}/> : <Handshake size={16}/>}
                          </div>
                          {/* Card */}
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.callStatus ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                {item.callStatus ? `Call: ${item.callStatus}` : 'Meeting Scheduled'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(item.calledAt || item.createdAt).toLocaleDateString('en-GB')}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-2">{item.remarks || "No remarks left."}</p>
                            
                            {/* Show Follow Up on the latest interaction if applicable */}
                            {i === 0 && lead.nextFollowUpDate && !isClosed && (
                              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                                <Calendar size={14} className="text-amber-500" />
                                <span className="text-xs font-medium text-amber-700">Next Follow-up: {new Date(lead.nextFollowUpDate).toLocaleDateString('en-GB')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                </div>

              </div>

              {/* Right Column: Actions */}
              <div className="w-full md:w-1/2 flex flex-col bg-white">
                
                {isClosed ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                     <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
                     <h3 className="text-xl font-bold text-slate-800 mb-2">Lead Closed</h3>
                     <p className="text-slate-500 text-sm">This lead has been marked as <strong>{lead.leadStatus}</strong> and cannot be updated further.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex border-b border-slate-100">
                      {[
                        { id: "log-call", label: "Log Call" },
                        { id: "schedule-meeting", label: "Schedule Meeting" },
                        { id: "close-lead", label: "Close Lead" }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                      
                      {/* Log Call Form */}
                      {activeTab === "log-call" && (
                        <form onSubmit={handleCallUpdate} className="space-y-4">
                           <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Call Outcome *</label>
                             <select value={callData.callStatus} onChange={e=>setCallData({...callData, callStatus: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm">
                               {CALL_STATUSES.map(status => (
                                 <option key={status} value={status}>{status}</option>
                               ))}
                             </select>
                           </div>

                           {callData.callStatus === "Connected" && (
                             <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                               <label className="block text-sm font-medium text-slate-800 mb-2">Is the client interested?</label>
                               <div className="flex items-center gap-6">
                                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="radio" checked={callData.isInterested} onChange={() => setCallData({...callData, isInterested: true})} className="text-indigo-600 focus:ring-indigo-500" /> Yes
                                  </label>
                                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="radio" checked={!callData.isInterested} onChange={() => setCallData({...callData, isInterested: false})} className="text-indigo-600 focus:ring-indigo-500" /> No
                                  </label>
                               </div>
                             </div>
                           )}

                           {((callData.callStatus === "Connected" && callData.isInterested) || NOT_PICKED_STATUSES.includes(callData.callStatus)) && (
                             <div className="grid grid-cols-2 gap-4">
                               <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Follow-up Date *</label>
                                 <input type="date" min={new Date().toISOString().split('T')[0]} required value={callData.followUpDate} onChange={e=>setCallData({...callData, followUpDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />
                               </div>
                               <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Follow-up Time *</label>
                                 <input type="time" required value={callData.followUpTime} onChange={e=>setCallData({...callData, followUpTime: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />
                               </div>
                             </div>
                           )}

                           <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Call Remarks</label>
                             <textarea rows="3" value={callData.remarks} onChange={e=>setCallData({...callData, remarks: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Summarize the conversation..."></textarea>
                           </div>

                           <button type="submit" disabled={submitting} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                             {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone size={16}/>}
                             Log Call
                           </button>
                        </form>
                      )}

                      {/* Schedule Meeting Form */}
                      {activeTab === "schedule-meeting" && (
                        <form onSubmit={handleMeetingSchedule} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Date *</label>
                              <input type="date" min={new Date().toISOString().split('T')[0]} required value={meetingData.meetingDate} onChange={e=>setMeetingData({...meetingData, meetingDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Time *</label>
                              <input type="time" required value={meetingData.meetingTime} onChange={e=>setMeetingData({...meetingData, meetingTime: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />
                            </div>
                          </div>

                          <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Type *</label>
                             <select value={meetingData.type} onChange={e=>setMeetingData({...meetingData, type: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm">
                               <option value="Online">Online (Video/Audio)</option>
                               <option value="Offline">Offline (In Person)</option>
                             </select>
                          </div>

                          {meetingData.type === "Online" ? (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Link *</label>
                              <input type="url" required value={meetingData.meetingLink} onChange={e=>setMeetingData({...meetingData, meetingLink: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="https://meet.google.com/..." />
                            </div>
                          ) : (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Address / Location *</label>
                              <input type="text" required value={meetingData.address} onChange={e=>setMeetingData({...meetingData, address: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Client Office Address..." />
                            </div>
                          )}

                          <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
                             <textarea rows="2" value={meetingData.remarks} onChange={e=>setMeetingData({...meetingData, remarks: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Any specific agenda items?"></textarea>
                          </div>

                          <button type="submit" disabled={submitting} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                             {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar size={16}/>}
                             Schedule Meeting
                           </button>
                        </form>
                      )}

                      {/* Close Lead Form */}
                      {activeTab === "close-lead" && (
                        <form onSubmit={handleCloseLead} className="space-y-4">
                           <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                             <p className="text-sm text-amber-800 font-medium">Warning: Closing a lead marks it as read-only. This action cannot be undone.</p>
                           </div>

                           <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Outcome *</label>
                             <select value={closeData.outcome} onChange={e=>setCloseData({...closeData, outcome: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm">
                               <option value="Closed Won">Closed Won (Success! 🎉)</option>
                               <option value="Closed Lost">Closed Lost (Denied / Deal Failed)</option>
                             </select>
                           </div>

                           <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Final Remarks *</label>
                             <textarea rows="4" required value={closeData.remarks} onChange={e=>setCloseData({...closeData, remarks: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm" placeholder="Why was the lead won/lost?"></textarea>
                           </div>

                           <button type="submit" disabled={submitting} className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                             {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 size={16}/>}
                             Confirm & Close Lead
                           </button>
                        </form>
                      )}

                    </div>
                  </>
                )}

              </div>

            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
