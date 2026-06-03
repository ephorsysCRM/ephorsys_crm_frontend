import { useState, useEffect } from "react";
import { 
  Users, 
  PhoneCall, 
  CalendarCheck, 
  AlertCircle, 
  Briefcase,
  ThumbsUp,
  XCircle,
  Trophy,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between"
  >
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      <Icon size={24} />
    </div>
  </motion.div>
);

const PipelineCard = ({ title, count, colorClass, barClass, total }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm font-semibold ${colorClass}`}>{title}</span>
        <span className="text-sm font-bold text-slate-700">{count} <span className="text-slate-400 font-normal">({percentage}%)</span></span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full rounded-full ${barClass}`}
        />
      </div>
    </div>
  );
};

const BdeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/lead/dashboard");
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load dashboard statistics.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Track your pipeline and daily activity metrics.</p>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Leads" 
          value={stats.totalLeads} 
          icon={Users} 
          color="bg-blue-100 text-blue-600" 
          delay={0.1} 
        />
        <StatCard 
          title="Today's Calls" 
          value={stats.todayAttempted} 
          icon={PhoneCall} 
          color="bg-indigo-100 text-indigo-600" 
          delay={0.2} 
        />
        <StatCard 
          title="Today's Meetings" 
          value={stats.todayMeetings} 
          icon={CalendarCheck} 
          color="bg-purple-100 text-purple-600" 
          delay={0.3} 
        />
        <StatCard 
          title="Missed Follow-ups" 
          value={stats.missedFollowUps} 
          icon={AlertCircle} 
          color={stats.missedFollowUps > 0 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"} 
          delay={0.4} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pipeline Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-800">Pipeline Breakdown</h2>
          </div>
          
          <div className="space-y-6">
            <PipelineCard 
              title="Interested" 
              count={stats.pipeline.interested} 
              total={stats.totalLeads}
              colorClass="text-amber-600"
              barClass="bg-amber-500"
            />
            <PipelineCard 
              title="Not Picked" 
              count={stats.pipeline.notPicked} 
              total={stats.totalLeads}
              colorClass="text-slate-600"
              barClass="bg-slate-400"
            />
            <PipelineCard 
              title="Closed Won" 
              count={stats.pipeline.closedWon} 
              total={stats.totalLeads}
              colorClass="text-emerald-600"
              barClass="bg-emerald-500"
            />
            <PipelineCard 
              title="Rejected / Lost" 
              count={stats.pipeline.rejected} 
              total={stats.totalLeads}
              colorClass="text-red-600"
              barClass="bg-red-500"
            />
          </div>
        </motion.div>

        {/* Quick Action / Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="relative z-10">
            <h2 className="text-lg font-bold mb-2">Today's Focus</h2>
            <p className="text-indigo-100 text-sm mb-6">Stay on top of your daily tasks to hit your target.</p>
            
            <div className="space-y-4">
              <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <PhoneCall size={18} className="text-indigo-200" />
                  <span className="font-medium">Follow-ups Due</span>
                </div>
                <span className="text-xl font-bold">{stats.todayFollowUps}</span>
              </div>

              <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Trophy size={18} className="text-amber-300" />
                  <span className="font-medium">Total Deals Won</span>
                </div>
                <span className="text-xl font-bold">{stats.pipeline.closedWon}</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default BdeDashboard;