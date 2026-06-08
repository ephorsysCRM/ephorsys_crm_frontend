import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Clock,
  FileText,
  CreditCard,
  Pencil,
  Check,
  X,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api";

// ─── Reusable editable field ────────────────────────────────────────────────
const EditableField = ({ label, value, name, type = "text", options, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(name, val);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setVal(value || "");
    setEditing(false);
  };

  return (
    <div className="group">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      {editing ? (
        <div className="flex items-center gap-2">
          {options ? (
            <select
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="flex-1 px-3 py-2 border border-indigo-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              {options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="flex-1 px-3 py-2 border border-indigo-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          </button>
          <button
            onClick={handleCancel}
            className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-slate-800 font-medium">
            {value || <span className="text-slate-400 italic">Not set</span>}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          >
            <Pencil size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Section card ────────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
      <div className="p-2 bg-indigo-100 rounded-lg">
        <Icon size={16} className="text-indigo-600" />
      </div>
      <h2 className="font-semibold text-slate-800 text-sm">{title}</h2>
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);

// ─── Main page ───────────────────────────────────────────────────────────────
const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/employee/${id}`);
      if (res.data.success) setEmployee(res.data.data);
    } catch (err) {
      console.error("Failed to fetch employee:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Generic save handler — customize endpoints as needed
  const handleSave = async (section, field, value) => {
    try {
      await api.patch(`/employee/${id}`, { [section]: { [field]: value } });
      setEmployee((prev) => {
        if (section === "root") {
          return { ...prev, [field]: value };
        } else if (section === "educationDetails" || section === "experienceDetails") {
          const currentArr = prev[section] && prev[section].length > 0 ? prev[section] : [{}];
          const updatedItem = { ...currentArr[0], [field]: value };
          return { ...prev, [section]: [updatedItem, ...currentArr.slice(1)] };
        } else {
          return { ...prev, [section]: { ...prev[section], [field]: value } };
        }
      });
      showToast("Field updated successfully");
    } catch (err) {
      showToast("Failed to update field", "error");
      console.error(err);
    }
  };

  const makeHandler = (section) => (field, value) => handleSave(section, field, value);
  const rootHandler = makeHandler("root"); // for top-level fields

  const handleViewDocument = async (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, "_blank");
      return;
    }
    
    try {
      const res = await api.get(`/employee/document/${doc._id}`, {
        responseType: "blob",
      });
      const fileBlob = new Blob([res.data], { type: doc.mimeType || "application/pdf" });
      const objectUrl = window.URL.createObjectURL(fileBlob);
      window.open(objectUrl, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60000);
    } catch (error) {
      console.error("Failed to open document:", error);
      showToast("Failed to open document", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-slate-700">Employee not found</h2>
          <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 text-sm hover:underline">
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const job = employee.jobInformation || {};
  const payroll = employee.payroll || {};
  const edu = employee.educationDetails?.[0] || {};
  const exp = employee.experienceDetails?.[0] || {};

  const fullName = [employee.firstName, employee.middleName, employee.lastName]
    .filter(Boolean)
    .join(" ");

  const getInitials = (name = "NA") =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {toast.type === "error" ? <AlertCircle size={16} /> : <BadgeCheck size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-bold text-slate-900 text-lg">{fullName}</h1>
          <p className="text-xs text-slate-500">{employee.employeeId} · {job.designation || "No Designation"}</p>
        </div>
        <span
          className={`ml-auto text-xs px-3 py-1 rounded-full font-semibold ${
            job.employmentStatus === "Active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {job.employmentStatus || "N/A"}
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* Profile hero */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-indigo-100 flex items-center justify-center flex-shrink-0">
            {employee.profilePhoto ? (
              <img src={employee.profilePhoto} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-indigo-700 font-bold text-2xl">{getInitials(fullName)}</span>
            )}
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Employee ID</p>
              <p className="font-semibold text-slate-800 text-sm mt-0.5">{employee.employeeId}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Department</p>
              <p className="font-semibold text-slate-800 text-sm mt-0.5">{job.department || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Joining Date</p>
              <p className="font-semibold text-slate-800 text-sm mt-0.5">
                {job.joiningDate ? new Date(job.joiningDate).toLocaleDateString("en-IN") : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Work Mode</p>
              <p className="font-semibold text-slate-800 text-sm mt-0.5">{job.workMode || "—"}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <Section icon={User} title="Personal Information">
          <EditableField label="First Name" value={employee.firstName} name="firstName"
            onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Middle Name" value={employee.middleName} name="middleName"
            onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Last Name" value={employee.lastName} name="lastName"
            onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Gender" value={employee.gender} name="gender"
            options={["Male", "Female", "Other"]}
            onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Date of Birth" value={employee.dateOfBirth?.split("T")[0]} name="dateOfBirth"
            type="date" onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Blood Group" value={employee.bloodGroup} name="bloodGroup"
            options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
            onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Marital Status" value={employee.maritalStatus} name="maritalStatus"
            options={["Single", "Married", "Divorced", "Widowed"]}
            onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Nationality" value={employee.nationality} name="nationality"
            onSave={(n, v) => handleSave("root", n, v)} />
        </Section>

        {/* Contact Information */}
        <Section icon={Phone} title="Contact Information">
          <EditableField label="Personal Email" value={employee.personalEmail} name="personalEmail"
            type="email" onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Official Email" value={employee.officialEmail} name="officialEmail"
            type="email" onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Mobile Number" value={employee.mobileNumber} name="mobileNumber"
            onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Alternate Mobile" value={employee.alternateMobileNumber} name="alternateMobileNumber"
            onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Emergency Contact Name" value={employee.emergencyContactName} name="emergencyContactName"
            onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Emergency Contact Number" value={employee.emergencyContactNumber} name="emergencyContactNumber"
            onSave={(n, v) => handleSave("root", n, v)} />
        </Section>

        {/* Address */}
        <Section icon={MapPin} title="Address">
          <EditableField label="Current Address" value={employee.currentAddress} name="currentAddress"
            onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Permanent Address" value={employee.permanentAddress} name="permanentAddress"
            onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="City" value={employee.city} name="city"
            onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="State" value={employee.state} name="state"
            onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Country" value={employee.country} name="country"
            onSave={(n, v) => handleSave("root", n, v)} />
          <EditableField label="Zip Code" value={employee.zipCode} name="zipCode"
            onSave={(n, v) => handleSave("root", n, v)} />
        </Section>

        {/* Job Information */}
        <Section icon={Briefcase} title="Job Information">
          <EditableField label="Department" value={job.department} name="department"
          options={["Software Development", "Human Resources", "Sales", "Marketing", "Others", "Business Development Executive", "UI / UX Designer"]}
            onSave={(n, v) => handleSave("jobInformation", n, v)} />
          <EditableField label="Designation" value={job.designation} name="designation"
            onSave={(n, v) => handleSave("jobInformation", n, v)} />
          <EditableField label="Employee Type" value={job.employeeType} name="employeeType"
            options={["Full Time", "Part Time", "Intern", "Contract"]}
            onSave={(n, v) => handleSave("jobInformation", n, v)} />
          <EditableField label="Work Location" value={job.workLocation} name="workLocation"
            onSave={(n, v) => handleSave("jobInformation", n, v)} />
          <EditableField label="Joining Date" value={job.joiningDate?.split("T")[0]} name="joiningDate"
            type="date" onSave={(n, v) => handleSave("jobInformation", n, v)} />
          <EditableField label="Probation End Date" value={job.probationEndDate?.split("T")[0]} name="probationEndDate"
            type="date" onSave={(n, v) => handleSave("jobInformation", n, v)} />
          <EditableField label="Shift Timing" value={job.shiftTiming} name="shiftTiming"
            onSave={(n, v) => handleSave("jobInformation", n, v)} />
          <EditableField label="Work Mode" value={job.workMode} name="workMode"
            options={["Office", "Remote", "Hybrid"]}
            onSave={(n, v) => handleSave("jobInformation", n, v)} />
          <EditableField label="Employment Status" value={job.employmentStatus} name="employmentStatus"
            options={["Active", "Inactive", "Terminated", "Resigned"]}
            onSave={(n, v) => handleSave("jobInformation", n, v)} />
        </Section>

        {/* Payroll */}
        <Section icon={CreditCard} title="Payroll & Bank Details">
          <EditableField label="Salary (₹)" value={payroll.salary} name="salary"
            type="number" onSave={(n, v) => handleSave("payroll", n, v)} />
          <EditableField label="Bank Name" value={payroll.bankName} name="bankName"
            onSave={(n, v) => handleSave("payroll", n, v)} />
          <EditableField label="Account Number" value={payroll.accountNumber} name="accountNumber"
            onSave={(n, v) => handleSave("payroll", n, v)} />
          <EditableField label="IFSC Code" value={payroll.ifscCode} name="ifscCode"
            onSave={(n, v) => handleSave("payroll", n, v)} />
          <EditableField label="PAN Number" value={payroll.panNumber} name="panNumber"
            onSave={(n, v) => handleSave("payroll", n, v)} />
        </Section>

        {/* Education */}
        <Section icon={GraduationCap} title="Education Details">
          <EditableField label="Qualification" value={edu.qualification} name="qualification"
            onSave={(n, v) => handleSave("educationDetails", n, v)} />
          <EditableField label="University" value={edu.university} name="university"
            onSave={(n, v) => handleSave("educationDetails", n, v)} />
          <EditableField label="Passing Year" value={edu.passingYear} name="passingYear"
            onSave={(n, v) => handleSave("educationDetails", n, v)} />
          <EditableField label="Percentage / Grade" value={edu.percentage} name="percentage"
            onSave={(n, v) => handleSave("educationDetails", n, v)} />
          <EditableField label="Specialization" value={edu.specialization} name="specialization"
            onSave={(n, v) => handleSave("educationDetails", n, v)} />
        </Section>

        {/* Experience */}
        <Section icon={Clock} title="Experience Details">
          <EditableField label="Company Name" value={exp.companyName} name="companyName"
            onSave={(n, v) => handleSave("experienceDetails", n, v)} />
          <EditableField label="Designation" value={exp.designation} name="designation"
            onSave={(n, v) => handleSave("experienceDetails", n, v)} />
          <EditableField label="Start Date" value={exp.startDate?.split("T")[0]} name="startDate"
            type="date" onSave={(n, v) => handleSave("experienceDetails", n, v)} />
          <EditableField label="End Date" value={exp.endDate?.split("T")[0]} name="endDate"
            type="date" onSave={(n, v) => handleSave("experienceDetails", n, v)} />
          <EditableField label="Total Experience" value={exp.totalExperience} name="totalExperience"
            onSave={(n, v) => handleSave("experienceDetails", n, v)} />
          <EditableField label="Reason for Leaving" value={exp.reasonForLeaving} name="reasonForLeaving"
            onSave={(n, v) => handleSave("experienceDetails", n, v)} />
        </Section>

        {/* Documents */}
        {employee.documents?.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText size={16} className="text-indigo-600" />
              </div>
              <h2 className="font-semibold text-slate-800 text-sm">Documents</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {employee.documents.map((doc) => (
                <div key={doc._id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="p-2 bg-white border border-slate-200 rounded-lg">
                    <FileText size={16} className="text-indigo-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-700 capitalize">
                      {doc.fieldName.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{doc.originalName}</p>
                  </div>
                  <button
                    onClick={() => handleViewDocument(doc)}
                    className="ml-auto text-xs text-indigo-600 hover:underline flex-shrink-0"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetailPage;