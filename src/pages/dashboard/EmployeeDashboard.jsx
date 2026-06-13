import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Users, PhoneCall, Target, AlertCircle } from "lucide-react";
import api from "../../services/api";

const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColorClass}`}>
      <Icon className={`w-6 h-6 ${colorClass}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

const EmployeeDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get("/lead/dashboard");
      setStats(res.data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>;
  }



  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.firstName}!</h1>
        <p className="text-slate-500 mt-1">Here's your pipeline overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Leads" 
          value={stats?.totalLeads || 0} 
          icon={Users} 
          colorClass="text-blue-600" 
          bgColorClass="bg-blue-50" 
        />
        <StatCard 
          title="Today's Calls" 
          value={stats?.todayAttempted || 0} 
          icon={PhoneCall} 
          colorClass="text-indigo-600" 
          bgColorClass="bg-indigo-50" 
        />
        <StatCard 
          title="Today's Meetings" 
          value={stats?.todayMeetings || 0} 
          icon={Target} 
          colorClass="text-emerald-600" 
          bgColorClass="bg-emerald-50" 
        />
        <StatCard 
          title="Missed Follow-ups" 
          value={stats?.missedFollowUps || 0} 
          icon={AlertCircle} 
          colorClass="text-rose-600" 
          bgColorClass="bg-rose-50" 
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Pipeline Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
              <p className="text-sm text-amber-600 font-medium mb-1">Interested</p>
              <p className="text-3xl font-bold text-amber-700">{stats?.pipeline?.interested || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-sm text-slate-500 font-medium mb-1">Not Picked</p>
              <p className="text-3xl font-bold text-slate-700">{stats?.pipeline?.notPicked || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100">
              <p className="text-sm text-rose-500 font-medium mb-1">Rejected</p>
              <p className="text-3xl font-bold text-rose-700">{stats?.pipeline?.rejected || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <p className="text-sm text-emerald-600 font-medium mb-1">Closed Won</p>
              <p className="text-3xl font-bold text-emerald-700">{stats?.pipeline?.closedWon || 0}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default EmployeeDashboard;
