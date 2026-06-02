import { useEffect, useState } from "react";
import { Filter, Phone, Mail, MoreVertical } from "lucide-react";
import api from "../../services/api";
import ActionModals from "../../components/ActionModals";

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  // Modal State
  const [modalState, setModalState] = useState({ isOpen: false, type: null, leadId: null });

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/lead/get-leads?list=${filter}`);
      setLeads(res.data.data.leads || []); // Ensure data structure matches API
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const openModal = (type, leadId) => setModalState({ isOpen: true, type, leadId });
  const closeModal = () => setModalState({ isOpen: false, type: null, leadId: null });

  const getStatusColor = (status) => {
    const colors = {
      "New": "bg-blue-100 text-blue-800",
      "Interested": "bg-amber-100 text-amber-800",
      "Meeting": "bg-indigo-100 text-indigo-800",
      "Closed Won": "bg-emerald-100 text-emerald-800",
      "Closed Lost": "bg-slate-100 text-slate-800",
      "Rejected": "bg-rose-100 text-rose-800",
      "Not Picked": "bg-orange-100 text-orange-800"
    };
    return colors[status] || "bg-slate-100 text-slate-800";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lead Directory</h1>
          <p className="text-slate-500 mt-1">Manage and track your leads.</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 outline-none cursor-pointer py-1"
          >
            <option value="all">All Leads</option>
            <option value="interested">Interested</option>
            <option value="notPicked">Not Picked</option>
            <option value="meeting">Meetings</option>
            <option value="closedWon">Closed Won</option>
            <option value="missed">Missed Follow-ups</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Lead Info</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Next Follow-up</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex justify-center"><div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No leads found in this list.</td>
                </tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{lead.fullName}</div>
                      <div className="text-slate-500 text-xs mt-1 flex items-center">
                        <Phone className="w-3 h-3 mr-1" /> {lead.mobileNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.leadStatus)}`}>
                        {lead.leadStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{lead.leadSource}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {lead.nextFollowUpDate ? new Date(lead.nextFollowUpDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {lead.leadStatus !== "Closed Won" && lead.leadStatus !== "Closed Lost" && (
                          <>
                            <button onClick={() => openModal("CALL_STATUS", lead._id)} className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                              Update Call
                            </button>
                            <button onClick={() => openModal("MEETING", lead._id)} className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
                              Meeting
                            </button>
                            <button onClick={() => openModal("CLOSE", lead._id)} className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                              Close
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ActionModals 
        isOpen={modalState.isOpen} 
        modalType={modalState.type} 
        leadId={modalState.leadId} 
        onClose={closeModal} 
        onSuccess={fetchLeads} 
      />
    </div>
  );
};

export default LeadsList;
