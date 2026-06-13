import { useState, useEffect } from "react";
import { Users, Loader2, User, Phone, Mail, Building, XCircle, TrendingUp, PhoneCall, ListTodo, AlertCircle, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEmployees } from "../../redux/features/employeeSlice";

// Helper component for the Metric Cards in the Performance Modal
const MetricCard = ({ title, value, icon, bgClass, textClass }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${bgClass} ${textClass}`}>{icon}</div>
    <div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">{title}</p>
      <h3 className="text-2xl font-black text-slate-800">{value}</h3>
    </div>
  </div>
);


const EmployeePerformanceModal = ({ employee, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/lead/performance/${employee._id}`);
        if (res.data.success) {
          setPerformance(res.data.data);
        }
      } catch (err) {
        toast.error("Failed to fetch employee performance.");
      } finally {
        setLoading(false);
      }
    };
    if (employee?._id) fetchPerformance();
  }, [employee]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div 
          initial={{opacity:0, y:20, scale:0.95}} 
          animate={{opacity:1, y:0, scale:1}} 
          exit={{opacity:0, y:20, scale:0.95}} 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col relative z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold overflow-hidden">
                {employee.profilePhoto ? (
                  <img src={employee.profilePhoto} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 uppercase">{employee.firstName} {employee.middleName} {employee.lastName}</h2>
                <p className="text-sm text-slate-500 font-medium">{employee.jobInformation?.department || "Employee"} • {employee.jobInformation?.designation || "N/A"}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
              <XCircle size={24}/>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Analyzing Performance Metrics...</p>
              </div>
            ) : performance ? (
              <div className="space-y-8">
                
                {/* Metrics Grid */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-indigo-500" /> Key Performance Indicators
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard 
                      title="Today Attempted" 
                      value={performance.stats.todayAttempted} 
                      icon={<PhoneCall size={24}/>} 
                      bgClass="bg-blue-100" textClass="text-blue-600" 
                    />
                    <MetricCard 
                      title="Daily Follow-ups" 
                      value={performance.stats.todayFollowUps} 
                      icon={<ListTodo size={24}/>} 
                      bgClass="bg-amber-100" textClass="text-amber-600" 
                    />
                    <MetricCard 
                      title="Missed Follow-ups" 
                      value={performance.stats.missedFollowUps} 
                      icon={<AlertCircle size={24}/>} 
                      bgClass={performance.stats.missedFollowUps > 0 ? "bg-red-100" : "bg-slate-100"} 
                      textClass={performance.stats.missedFollowUps > 0 ? "text-red-600" : "text-slate-500"} 
                    />
                    <MetricCard 
                      title="Happy Clients" 
                      value={performance.stats.pipeline.closedWon} 
                      icon={<Trophy size={24}/>} 
                      bgClass="bg-emerald-100" textClass="text-emerald-600" 
                    />
                  </div>
                </div>

                {/* Pipeline Stats */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Pipeline Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                     <div>
                       <p className="text-3xl font-black text-slate-700">{performance.stats.totalLeads}</p>
                       <p className="text-sm font-medium text-slate-500 uppercase mt-1">Total Assigned</p>
                     </div>
                     <div>
                       <p className="text-3xl font-black text-amber-600">{performance.stats.pipeline.interested}</p>
                       <p className="text-sm font-medium text-slate-500 uppercase mt-1">Interested</p>
                     </div>
                     <div>
                       <p className="text-3xl font-black text-rose-600">{performance.stats.pipeline.rejected}</p>
                       <p className="text-sm font-medium text-slate-500 uppercase mt-1">Rejected</p>
                     </div>
                     <div>
                       <p className="text-3xl font-black text-emerald-600">{performance.stats.pipeline.closedWon}</p>
                       <p className="text-sm font-medium text-slate-500 uppercase mt-1">Closed Won</p>
                     </div>
                  </div>
                </div>
                
                {/* Recent Leads */}
                <div>
                   <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Leads</h3>
                   {performance.recentLeads?.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {performance.recentLeads.map(lead => (
                         <div key={lead._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                           <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-slate-800">{lead.fullName}</h4>
                             <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{lead.leadStatus}</span>
                           </div>
                           <p className="text-xs text-slate-500 font-medium">Source: {lead.leadSource}</p>
                           <p className="text-xs text-slate-500 mt-2">Added: {new Date(lead.createdAt).toLocaleDateString('en-GB')}</p>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <p className="text-slate-500 text-sm bg-white p-4 rounded-xl border border-slate-200 text-center">No recent leads assigned to this employee.</p>
                   )}
                </div>

              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-red-500">Failed to load performance data.</div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


export default function Employees() {
  const dispatch = useDispatch();
  const { employees, loading } = useSelector((state) => state.employee);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    dispatch(fetchAllEmployees({ department: "Business Development Executive" }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Users className="text-indigo-600" size={32} />
              BDE Directory
            </h1>
            <p className="text-slate-500 font-medium mt-2">Manage your team and track their performance.</p>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600">
              <Building size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Number of BDE</p>
              {loading ? (
                 <Loader2 className="w-5 h-5 animate-spin text-slate-400 mt-1" />
              ) : (
                 <p className="text-2xl font-black text-slate-800 leading-none mt-1">{employees.length}</p>
              )}
            </div>
          </div>
        </div>

        {/* Employee Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
        ) : employees.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
             <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-slate-700">No Employees Found</h3>
             <p className="text-slate-500 mt-2">There are currently no employees registered in the system.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((emp) => (
              <div 
                key={emp._id} 
                onClick={() => setSelectedEmployee(emp)}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-inner group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                    {emp.profilePhoto ? (
                      <img src={emp.profilePhoto} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">
                      {emp.firstName} {emp.middleName} {emp.lastName}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-1">
                      {emp.jobInformation?.department || "Employee"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-auto">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    <span className="truncate">{emp.officialEmail}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    <span>{emp.mobileNumber}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${emp.jobInformation?.employmentStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {emp.jobInformation?.employmentStatus || "Active"}
                  </span>
                  <span className="text-sm font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Performance &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Modal */}
      {selectedEmployee && (
        <EmployeePerformanceModal 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)} 
        />
      )}
    </div>
  );
}