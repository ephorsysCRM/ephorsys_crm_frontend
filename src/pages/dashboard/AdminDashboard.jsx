import { useEffect, useState } from "react";
import { Search, Users, PhoneCall, AlertCircle, Target, UserCircle } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center space-x-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColorClass}`}>
      <Icon className={`w-6 h-6 ${colorClass}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [globalStats, setGlobalStats] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const fetchGlobalStats = async () => {
    try {
      const res = await api.get("/lead/dashboard");
      setGlobalStats(res.data.data);
    } catch {
      toast.error("Failed to fetch global stats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGlobalStats();
  }, []);

  const handleSearchEmployee = async (e) => {
    e.preventDefault();
    if (!employeeId.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await api.get(`/lead/performance/${employeeId.trim()}`);
      setEmployeeData(res.data.data);
      toast.success("Employee performance loaded");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch employee performance");
      setEmployeeData(null);
    } finally {
      setIsSearching(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>;
  }



  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
        <p className="text-slate-500 mt-1">Global system statistics and employee performance tracking.</p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads (All)" value={globalStats?.totalLeads || 0} icon={Users} colorClass="text-blue-600" bgColorClass="bg-blue-50" />
        <StatCard title="Total Attempted" value={globalStats?.todayAttempted || 0} icon={PhoneCall} colorClass="text-indigo-600" bgColorClass="bg-indigo-50" />
        <StatCard title="Total Meetings" value={globalStats?.todayMeetings || 0} icon={Target} colorClass="text-emerald-600" bgColorClass="bg-emerald-50" />
        <StatCard title="Total Missed" value={globalStats?.missedFollowUps || 0} icon={AlertCircle} colorClass="text-rose-600" bgColorClass="bg-rose-50" />
      </div>

      {/* Employee Performance Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <UserCircle className="w-5 h-5 mr-2 text-indigo-500" />
          Employee Performance Lookup
        </h2>
        
        <form onSubmit={handleSearchEmployee} className="flex gap-3 max-w-md mb-6">
          <input 
            type="text" 
            placeholder="Enter Employee ObjectId..."
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            type="submit" 
            disabled={isSearching}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center"
          >
            {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> : <Search className="w-4 h-4 mr-2" />}
            Lookup
          </button>
        </form>

        {employeeData && (
          <div className="mt-8 border-t border-slate-100 pt-6 animate-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-md font-medium text-slate-700 mb-4">Performance Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Leads Handled</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{employeeData.stats.totalLeads}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs text-emerald-600 uppercase tracking-wider">Closed Won</p>
                <p className="text-2xl font-bold text-emerald-800 mt-1">{employeeData.stats.pipeline.closedWon}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-600 uppercase tracking-wider">Interested</p>
                <p className="text-2xl font-bold text-amber-800 mt-1">{employeeData.stats.pipeline.interested}</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                <p className="text-xs text-rose-500 uppercase tracking-wider">Missed Follow-ups</p>
                <p className="text-2xl font-bold text-rose-800 mt-1">{employeeData.stats.missedFollowUps}</p>
              </div>
            </div>

            <h3 className="text-md font-medium text-slate-700 mb-4">Recent Leads (Last 10)</h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Mobile</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employeeData.recentLeads.map(lead => (
                    <tr key={lead._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{lead.fullName}</td>
                      <td className="px-4 py-3 text-slate-600">{lead.mobileNumber}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          {lead.leadStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{lead.leadSource}</td>
                    </tr>
                  ))}
                  {employeeData.recentLeads.length === 0 && (
                    <tr><td colSpan="4" className="px-4 py-6 text-center text-slate-500">No leads found for this employee.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
