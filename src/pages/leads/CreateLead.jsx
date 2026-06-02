import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PlusCircle, PhoneCall, User, Briefcase, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const LEAD_SOURCES = ["Google Ads", "Website", "Referral", "Direct Call", "Walk-In", "Justdial", "Meta Ads"];
const PROJECT_TYPES = [
  "website_development", "web_app_development", "mobile_app_development",
  "ui_ux_design", "graphic_design", "seo", "social_media_marketing",
  "business_consulting", "custom_software", "others"
];
const CALL_STATUSES = ["Connected", "Not Connected", "Switch Off / Not Reachable", "Blocked", "Wrong Number", "Denied", "Not Picked"];

const CreateLead = () => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const initialCallStatus = watch("initialCallStatus");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data };
      if (payload.isInterested) payload.isInterested = payload.isInterested === "true";
      
      await api.post("/lead/create-lead", payload);
      toast.success("Lead created successfully!");
      reset();
      navigate("/leads/pipeline");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <PlusCircle className="w-6 h-6 mr-2 text-indigo-600" />
          Create New Lead
        </h1>
        <p className="text-slate-500 mt-1">Enter lead details and initial call outcome.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Core Information Section */}
        <div className="p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-slate-400" />
            Lead Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
              <input
                {...register("fullName", { required: "Full name is required" })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Rahul Sharma"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number *</label>
              <input
                {...register("mobileNumber", { 
                  required: "Mobile is required",
                  pattern: { value: /^[6-9]\d{9}$/, message: "Valid 10-digit Indian number required" }
                })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="9876543210"
              />
              {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Lead Source *</label>
              <select
                {...register("leadSource", { required: "Source is required" })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="">Select source...</option>
                {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.leadSource && <p className="text-red-500 text-xs mt-1">{errors.leadSource.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Type</label>
              <select
                {...register("projectType")}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="">Select project type (optional)...</option>
                {PROJECT_TYPES.map(p => (
                  <option key={p} value={p}>{p.replace(/_/g, ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Initial Call Action Section */}
        <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200 space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center">
            <PhoneCall className="w-5 h-5 mr-2 text-indigo-500" />
            First Call Action (Optional)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Initial Call Status</label>
              <select
                {...register("initialCallStatus")}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="">No call made yet (Save as New)</option>
                {CALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Render conditional fields based on call status */}
            {initialCallStatus === "Connected" && (
              <div className="md:col-span-2 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                <label className="block text-sm font-medium text-slate-700 mb-3">Is the client interested?</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" value="true" {...register("isInterested", { required: "Please specify interest" })} className="text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-slate-700 font-medium">Yes, Interested</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" value="false" {...register("isInterested")} className="text-red-500 focus:ring-red-500" />
                    <span className="text-slate-700 font-medium">No, Not Interested</span>
                  </label>
                </div>
                {errors.isInterested && <p className="text-red-500 text-xs mt-2">{errors.isInterested.message}</p>}
              </div>
            )}

            {(initialCallStatus === "Connected" || ["Not Connected", "Switch Off / Not Reachable", "Not Picked"].includes(initialCallStatus)) && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Follow-Up Date</label>
                  <input
                    type="date"
                    {...register("followUpDate")}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Follow-Up Time</label>
                  <input
                    type="time"
                    {...register("followUpTime")}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </>
            )}
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center">
                <MessageSquare className="w-4 h-4 mr-1 text-slate-400" />
                Remarks / Notes
              </label>
              <textarea
                {...register("remarks")}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Enter discussion details..."
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="p-6 md:p-8 bg-slate-100 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => { reset(); navigate("/leads/pipeline"); }}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" /> : null}
            Create Lead
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateLead;
