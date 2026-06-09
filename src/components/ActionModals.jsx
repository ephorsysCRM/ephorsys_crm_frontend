import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const ActionModals = ({ 
  modalType, 
  isOpen, 
  onClose, 
  leadId, 
  onSuccess 
}) => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const callStatus = watch("callStatus");
  const meetingType = watch("type");

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleUpdateCallStatus = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data };
      if (payload.isInterested) payload.isInterested = payload.isInterested === "true";
      
      await api.patch(`/lead/${leadId}/update-lead`, payload);
      toast.success("Call status updated");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update call status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleMeeting = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post(`/lead/${leadId}/meeting`, data);
      toast.success("Meeting scheduled");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to schedule meeting");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseLead = async (data) => {
    setIsSubmitting(true);
    try {
      await api.patch(`/lead/${leadId}/close`, data);
      toast.success(`Lead marked as ${data.outcome}`);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to close lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ModalShell = ({ title, children, onSubmit }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {children}
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (modalType === "CALL_STATUS") {
    return (
      <ModalShell title="Update Call Status" onSubmit={handleUpdateCallStatus}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
          <select {...register("callStatus", { required: true })} className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="">Select status...</option>
            {["Connected", "Not Connected", "Switch Off / Not Reachable", "Blocked", "Wrong Number", "Denied", "Not Picked"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        
        {callStatus === "Connected" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Is Interested? *</label>
            <div className="flex space-x-4">
              <label className="flex items-center"><input type="radio" value="true" {...register("isInterested")} className="mr-2" /> Yes</label>
              <label className="flex items-center"><input type="radio" value="false" {...register("isInterested")} className="mr-2" /> No</label>
            </div>
          </div>
        )}

        {(callStatus === "Connected" || ["Not Connected", "Switch Off / Not Reachable", "Not Picked"].includes(callStatus)) && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Follow-up Date</label>
              <input type="date" {...register("followUpDate")} className="w-full px-3 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
              <input type="time" {...register("followUpTime")} className="w-full px-3 py-2 border rounded-xl" />
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
          <textarea {...register("remarks")} rows="2" className="w-full px-3 py-2 border rounded-xl resize-none"></textarea>
        </div>
      </ModalShell>
    );
  }

  if (modalType === "MEETING") {
    return (
      <ModalShell title="Schedule Meeting" onSubmit={handleScheduleMeeting}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
            <input type="date" {...register("meetingDate", { required: true })} className="w-full px-3 py-2 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Time *</label>
            <input type="time" {...register("meetingTime", { required: true })} className="w-full px-3 py-2 border rounded-xl" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Type *</label>
          <select {...register("type", { required: true })} className="w-full px-3 py-2 border rounded-xl">
            <option value="Online">Online / Video Call</option>
            <option value="Offline">Offline / In-Person</option>
          </select>
        </div>
        {meetingType === "Online" || !meetingType ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Link *</label>
            <input type="url" {...register("meetingLink", { required: true })} placeholder="https://meet.google.com/..." className="w-full px-3 py-2 border rounded-xl" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location / Address *</label>
            <input type="text" {...register("address", { required: true })} placeholder="123 Business Park..." className="w-full px-3 py-2 border rounded-xl" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
          <textarea {...register("remarks")} rows="2" className="w-full px-3 py-2 border rounded-xl resize-none"></textarea>
        </div>
      </ModalShell>
    );
  }

  if (modalType === "CLOSE") {
    return (
      <ModalShell title="Close Lead" onSubmit={handleCloseLead}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Final Outcome *</label>
          <select {...register("outcome", { required: true })} className="w-full px-3 py-2 border rounded-xl">
            <option value="">Select outcome...</option>
            <option value="Closed Won">🎉 Closed Won (Converted)</option>
            <option value="Closed Lost">❌ Closed Lost</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Closing Remarks</label>
          <textarea {...register("remarks")} rows="3" placeholder="Why was it won/lost?" className="w-full px-3 py-2 border rounded-xl resize-none"></textarea>
        </div>
      </ModalShell>
    );
  }

  return null;
};

export default ActionModals;
