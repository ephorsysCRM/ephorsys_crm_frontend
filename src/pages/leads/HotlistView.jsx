import { useEffect, useState } from "react";
import { Clock, Phone, AlertCircle } from "lucide-react";
import api from "../../services/api";

const HotlistView = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHotlist = async () => {
    try {
      const res = await api.get("/lead/hotlist");
      setLeads(res.data.data);
    } catch (error) {
      console.error("Failed to fetch hotlist", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHotlist();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <AlertCircle className="w-6 h-6 mr-2 text-rose-500" />
          Hotlist Pipeline
        </h1>
        <p className="text-slate-500 mt-1">Your highly prioritized leads sorted by nearest follow-up date.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
            No hot leads at the moment. Keep pushing!
          </div>
        ) : (
          leads.map(lead => {
            const isMeeting = lead.leadStatus === "Meeting";
            
            return (
              <div key={lead._id} className={`bg-white rounded-2xl p-6 border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${isMeeting ? "border-indigo-100 hover:border-indigo-300" : "border-rose-100 hover:border-rose-300"}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isMeeting ? "bg-indigo-100 text-indigo-700" : "bg-rose-100 text-rose-700"}`}>
                    {lead.leadStatus.toUpperCase()}
                  </span>
                  <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(lead.nextFollowUpDate).toLocaleDateString()}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-1">{lead.fullName}</h3>
                <div className="flex items-center text-sm text-slate-600 font-medium mb-4">
                  <Phone className="w-4 h-4 mr-1.5 text-slate-400" />
                  {lead.mobileNumber}
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Project Need</p>
                  <p className="text-sm font-medium text-slate-700">{lead.projectType ? lead.projectType.replace(/_/g, ' ') : "Not specified"}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default HotlistView;
