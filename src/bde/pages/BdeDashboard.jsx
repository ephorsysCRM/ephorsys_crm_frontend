import { useState, useEffect } from "react";
import {
  Users,
  PhoneCall,
  CalendarCheck,
  AlertCircle,
  Briefcase,
  Trophy,
  Loader2,
  Target,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Flame,
  PhoneMissed,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import socket from "../../services/socket.js";
import MetricListModal from "../components/MetricListModal";
import LeadDetailModal from "../components/LeadDetailModal";

const StatCard = ({ title, value, icon: Icon, accent, tagText, tagOk, tagColors, delay, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="relative bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between"
  >
    {/* Accent strip */}
    <div className={`absolute top-0 left-0 w-full h-[3.5px] ${accent.strip}`} />

    <div>
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${accent.bg}`}
        >
          <Icon size={20} className={accent.text} />
        </div>

        {tagText && (
          <span
            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              tagColors || (tagOk ? "bg-[#74C316]/12 text-[#4a7d0d] border-[#74C316]/25" : "bg-red-50 text-red-600 border-red-200/60")
            }`}
          >
            {tagOk && <CheckCircle2 size={11} />}
            {tagText}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-1.5">
            {value}
          </h3>
          <p className="text-[13px] font-semibold text-slate-500">{title}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#74C316]/12 flex items-center justify-center transition-colors shrink-0">
          <ChevronRight size={16} className="text-slate-400 group-hover:text-[#4a7d0d] transition-colors" />
        </div>
      </div>
    </div>
  </motion.div>
);

const PipelineCard = ({ title, count, percentage, icon: Icon, colors, onClick }) => (
  <div
    onClick={onClick}
    className="group flex items-center gap-4 p-3 -mx-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
  >
    {/* Icon badge */}
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors.badgeBg}`}
    >
      <Icon size={18} className={colors.badgeIcon} />
    </div>

    {/* Label + bar */}
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[13.5px] font-semibold text-slate-800">
          {title}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[13.5px] font-bold text-slate-800">
            {count}
          </span>
          <span
            className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${colors.pillBg} ${colors.pillText}`}
          >
            {percentage}%
          </span>
        </div>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${colors.bar}`}
        />
      </div>
    </div>

    <ChevronRight
      size={16}
      className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
    />
  </div>
);

const FocusRow = ({ icon: Icon, title, subtitle, value, delay, onClick }) => (
  <motion.button
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.35, ease: "easeOut" }}
    whileHover={{ scale: 1.015 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    className="w-full bg-white rounded-xl p-3.5 flex items-center justify-between shadow-[0_1px_4px_rgb(0,0,0,0.06)] cursor-pointer text-left"
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-[#74C316]/12 flex items-center justify-center shrink-0">
        <Icon size={17} className="text-[#4a7d0d]" />
      </div>
      <div className="text-left">
        <p className="text-[13.5px] font-bold text-slate-800 leading-tight">
          {title}
        </p>
        <p className="text-[11.5px] text-slate-400 leading-tight mt-0.5">
          {subtitle}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-1">
      <span className="text-xl font-extrabold text-[#5da011]">{value}</span>
      <ChevronRight size={16} className="text-slate-300" />
    </div>
  </motion.button>
);

const BdeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeListModal, setActiveListModal] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchStats();
    socket.on("lead:stats_updated", (data) => {
      setStats(data);
    });
    return () => {
      socket.off("lead:stats_updated"); // ✅ cleanup on unmount
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-9 h-9 text-[#74C316] animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!stats) return null;

  const pipelineTotal = stats.totalLeads;
  const pct = (n) => (pipelineTotal > 0 ? Math.round((n / pipelineTotal) * 100) : 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-[22px] md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your pipeline and daily activity metrics in real time.
          </p>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={Users}
          accent={{
            bg: "bg-[#74C316]/12",
            text: "text-[#4a7d0d]",
            strip: "bg-[#74C316]",
          }}
          tagText="All time"
          tagOk={true}
          tagColors="bg-[#74C316]/12 text-[#4a7d0d] border-[#74C316]/25"
          delay={0.1}
          onClick={() => setActiveListModal({ type: "all", title: "Total Leads" })}
        />
        <StatCard
          title="Today's Calls"
          value={stats.todayAttempted}
          icon={PhoneCall}
          accent={{
            bg: "bg-blue-50",
            text: "text-blue-600",
            strip: "bg-blue-500",
          }}
          tagText="Today"
          tagOk={true}
          tagColors="bg-blue-50 text-blue-700 border-blue-200/60"
          delay={0.2}
          onClick={() => setActiveListModal({ type: "todayAttempted", title: "Today's Calls Attempted" })}
        />
        <StatCard
          title="Today's Meetings"
          value={stats.todayMeetings}
          icon={CalendarCheck}
          accent={{
            bg: "bg-purple-50",
            text: "text-purple-600",
            strip: "bg-purple-500",
          }}
          tagText="Scheduled"
          tagOk={true}
          tagColors="bg-purple-50 text-purple-700 border-purple-200/60"
          delay={0.3}
          onClick={() => setActiveListModal({ type: "todayMeetings", title: "Today's Scheduled Meetings" })}
        />
        <StatCard
          title="Missed Follow-ups"
          value={stats.missedFollowUps}
          icon={AlertCircle}
          accent={
            stats.missedFollowUps > 0
              ? { bg: "bg-red-50", text: "text-red-600", strip: "bg-red-500" }
              : {
                  bg: "bg-[#74C316]/12",
                  text: "text-[#4a7d0d]",
                  strip: "bg-[#74C316]",
                }
          }
          tagText={stats.missedFollowUps > 0 ? "Needs attention" : "On track"}
          tagOk={stats.missedFollowUps === 0}
          tagColors={
            stats.missedFollowUps > 0
              ? "bg-red-50 text-red-600 border-red-200/60"
              : "bg-[#74C316]/12 text-[#4a7d0d] border-[#74C316]/25"
          }
          delay={0.4}
          onClick={() => setActiveListModal({ type: "missed", title: "Missed Follow-ups" })}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-[0_2px_12px_rgb(0,0,0,0.03)]"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-lg bg-[#74C316]/12 flex items-center justify-center">
              <Briefcase className="w-[18px] h-[18px] text-[#4a7d0d]" />
            </div>
            <h2 className="text-[15px] font-bold text-slate-800">
              Pipeline Breakdown
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="py-2 first:pt-0">
              <PipelineCard
                title="Interested"
                count={stats.pipeline.interested}
                percentage={pct(stats.pipeline.interested)}
                icon={Flame}
                colors={{
                  badgeBg: "bg-amber-50",
                  badgeIcon: "text-amber-600",
                  pillBg: "bg-amber-50",
                  pillText: "text-amber-700",
                  bar: "bg-amber-500",
                }}
                onClick={() => setActiveListModal({ type: "interested", title: "Interested Leads" })}
              />
            </div>

            <div className="py-2">
              <PipelineCard
                title="Not Picked"
                count={stats.pipeline.notPicked}
                percentage={pct(stats.pipeline.notPicked)}
                icon={PhoneMissed}
                colors={{
                  badgeBg: "bg-slate-100",
                  badgeIcon: "text-slate-500",
                  pillBg: "bg-slate-100",
                  pillText: "text-slate-600",
                  bar: "bg-slate-400",
                }}
                onClick={() => setActiveListModal({ type: "notPicked", title: "Not Picked Leads" })}
              />
            </div>

            <div className="py-2">
              <PipelineCard
                title="Closed Won"
                count={stats.pipeline.closedWon}
                percentage={pct(stats.pipeline.closedWon)}
                icon={CheckCircle2}
                colors={{
                  badgeBg: "bg-[#74C316]/12",
                  badgeIcon: "text-[#4a7d0d]",
                  pillBg: "bg-[#74C316]/12",
                  pillText: "text-[#4a7d0d]",
                  bar: "bg-[#74C316]",
                }}
                onClick={() => setActiveListModal({ type: "closedWon", title: "Closed Won Deals" })}
              />
            </div>

            <div className="py-2 last:pb-0">
              <PipelineCard
                title="Rejected / Lost"
                count={stats.pipeline.rejected}
                percentage={pct(stats.pipeline.rejected)}
                icon={XCircle}
                colors={{
                  badgeBg: "bg-red-50",
                  badgeIcon: "text-red-600",
                  pillBg: "bg-red-50",
                  pillText: "text-red-700",
                  bar: "bg-red-500",
                }}
                onClick={() => setActiveListModal({ type: "rejected", title: "Rejected / Lost Leads" })}
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Action / Summary — "Today's Focus" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
          className="bg-gradient-to-br from-[#8fd93a] via-[#5fae12] to-[#3d7a09] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-15 pointer-events-none">
            <Target size={128} strokeWidth={1} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Target size={16} />
              </div>
              <h2 className="text-[15px] font-bold">Today's Focus</h2>
            </div>
            <p className="text-white/85 text-[12.5px] leading-snug mb-5">
              Stay on top of your daily tasks to hit your target.
            </p>

            <div className="space-y-2.5">
              <FocusRow
                icon={PhoneCall}
                title="Follow-ups Due"
                subtitle="Pending follow-ups"
                value={stats.todayFollowUps}
                delay={0.65}
                onClick={() => setActiveListModal({ type: "todayFollowUps", title: "Today's Follow-ups Due" })}
              />
              <FocusRow
                icon={Trophy}
                title="Total Deals Won"
                subtitle="Congratulations!"
                value={stats.pipeline.closedWon}
                delay={0.7}
                onClick={() => setActiveListModal({ type: "closedWon", title: "Total Deals Won" })}
              />
            </div>
          </div>

          <div className="relative z-10 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/bde/leads")}
              className="w-full bg-black/15 hover:bg-black/25 backdrop-blur-sm rounded-xl py-3 flex items-center justify-center gap-2 text-[13px] font-semibold transition-colors cursor-pointer"
            >
              View All Tasks
              <ArrowRight size={15} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Metric List Modal */}
      {activeListModal && (
        <MetricListModal
          listType={activeListModal.type}
          title={activeListModal.title}
          onClose={() => setActiveListModal(null)}
          onLeadSelect={(leadId) => {
            setActiveListModal(null);
            setSelectedLeadId(leadId);
          }}
        />
      )}

      {/* Lead Detail Modal */}
      {selectedLeadId && (
        <LeadDetailModal
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onUpdated={() => {
            fetchStats();
          }}
        />
      )}
    </div>
  );
};

export default BdeDashboard;