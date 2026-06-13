import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";

const STAGES = [
  "New", "Attempted", "Not Picked", "Interested", "Meeting", "Closed Won", "Closed Lost", "Rejected"
];

const PipelineView = () => {
  const [pipelineData, setPipelineData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchPipeline = async () => {
    try {
      const res = await api.get("/lead/pipeline");
      setPipelineData(res.data.data);
    } catch (error) {
      console.error("Failed to fetch pipeline", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPipeline();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pipeline Board</h1>
        <p className="text-slate-500 mt-1">Kanban view of all your leads by status.</p>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex space-x-4 h-full min-w-max items-start">
          
          {STAGES.map((stage) => {
            const leads = pipelineData[stage] || [];
            
            // Determine header colors
            let headerColor = "bg-slate-200 text-slate-700";
            if (stage === "Interested") headerColor = "bg-amber-100 text-amber-800";
            if (stage === "Meeting") headerColor = "bg-indigo-100 text-indigo-800";
            if (stage === "Closed Won") headerColor = "bg-emerald-100 text-emerald-800";
            
            return (
              <div key={stage} className="w-72 bg-slate-100 rounded-xl border border-slate-200 flex flex-col max-h-full shrink-0">
                <div className={`px-4 py-3 border-b border-white/20 rounded-t-xl flex justify-between items-center font-semibold ${headerColor}`}>
                  <span>{stage}</span>
                  <span className="bg-white/50 text-xs px-2 py-0.5 rounded-full">{leads.length}</span>
                </div>
                
                <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-300">
                  {leads.map((lead) => (
                    <motion.div 
                      key={lead._id}
                      layoutId={lead._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
                    >
                      <h4 className="font-bold text-slate-800 mb-1">{lead.fullName}</h4>
                      <p className="text-xs text-slate-500 mb-3">{lead.mobileNumber}</p>
                      
                      <div className="flex justify-between items-center text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        <span>{lead.leadSource}</span>
                        {lead.nextFollowUpDate && (
                          <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                            {new Date(lead.nextFollowUpDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {leads.length === 0 && (
                    <div className="text-center p-4 text-xs font-medium text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                      Drop leads here
                    </div>
                  )}
                </div>
              </div>
            )
          })}

        </div>
      </div>
    </div>
  );
};

export default PipelineView;
