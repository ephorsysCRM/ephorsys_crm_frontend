import { useState } from "react";
import axios from "axios";
import { EMPLOYEE_API_END_POINT } from "../../utils/endpoints";

// ─── Initial State ───────────────────────────────────────────────────────────
const initialForm = {
  employeeId: "", firstName: "", middleName: "", lastName: "",
  gender: "", dateOfBirth: "", maritalStatus: "", bloodGroup: "", nationality: "",
  personalEmail: "", officialEmail: "", mobileNumber: "", alternateMobileNumber: "",
  emergencyContactName: "", emergencyContactNumber: "",
  currentAddress: "", permanentAddress: "",
  city: "", state: "", country: "", zipCode: "",
  department: "", designation: "", employeeType: "",
  workLocation: "", joiningDate: "", probationEndDate: "",
  shiftTiming: "", workMode: "", employmentStatus: "",
  salary: "", bankName: "", accountNumber: "", ifscCode: "", panNumber: "",
  password: "",
};

const blankEducation = () => ({ qualification: "", university: "", passingYear: "", percentage: "", specialization: "" });
const blankExperience = () => ({ companyName: "", designation: "", startDate: "", endDate: "", totalExperience: "", skillsUsed: "", reasonForLeaving: "" });

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: "personal",    label: "Personal",   icon: "👤" },
  { id: "contact",     label: "Contact",    icon: "📞" },
  { id: "job",         label: "Job",        icon: "💼" },
  { id: "payroll",     label: "Payroll",    icon: "🏦" },
  { id: "education",   label: "Education",  icon: "🎓" },
  { id: "experience",  label: "Experience", icon: "🏢" },
  { id: "documents",   label: "Documents",  icon: "📁" },
  { id: "access",      label: "Access",     icon: "🔐" },
];

// ─── Reusable Field Components ────────────────────────────────────────────────
const Field = ({ label, required, children, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
      {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = "w-full bg-white border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-black placeholder-slate-500 outline-none transition-all ";

const Input = ({ label, required, className, fieldClass, ...props }) => (
  <Field label={label} required={required} className={fieldClass}>
    <input className={`${inputCls} ${className || ""}`} {...props} />
  </Field>
);

const Sel = ({ label, required, children, fieldClass, ...props }) => (
  <Field label={label} required={required} className={fieldClass}>
    <select className={`${inputCls} cursor-pointer`} {...props}>
      {children}
    </select>
  </Field>
);

const Textarea = ({ label, required, fieldClass, ...props }) => (
  <Field label={label} required={required} className={fieldClass}>
    <textarea className={`${inputCls} resize-none`} rows={3} {...props} />
  </Field>
);

const FileUpload = ({ label, previewName, ...props }) => (
  <Field label={label}>
    <label className="flex items-center gap-3 bg-white border border-dashed border-slate-600 rounded-lg px-3 py-2.5 cursor-pointer hover:border-black-500 transition-colors group">
      <span className="text-slate-500 group-hover:text-violet-400 transition-colors text-lg">📎</span>
      <span className="text-sm text-slate-400 truncate flex-1">
        {previewName || "Choose file…"}
      </span>
      <input className="hidden" type="file" {...props} />
    </label>
  </Field>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [documents, setDocuments] = useState({});
  const [education, setEducation] = useState([blankEducation()]);
  const [experience, setExperience] = useState([blankExperience()]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4500);
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleDocChange = (e) => setDocuments((p) => ({ ...p, [e.target.name]: e.target.files }));

  const updateEdu = (i, k, v) => setEducation((p) => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const updateExp = (i, k, v) => setExperience((p) => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      if (profilePhoto) fd.append("profilePhoto", profilePhoto);
      if (passportPhoto) fd.append("passportPhoto", passportPhoto);

      fd.append("education", JSON.stringify(education));
      fd.append("experience", JSON.stringify(
        experience.map((exp) => ({
          ...exp,
          skillsUsed: exp.skillsUsed
            ? exp.skillsUsed.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
        }))
      ));

      Object.entries(documents).forEach(([field, files]) => {
        Array.from(files).forEach((file) => fd.append(field, file));
      });

      const res = await axios.post(`${EMPLOYEE_API_END_POINT}/register`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      showToast("success", res.data.message || "Employee registered successfully");
      setForm(initialForm);
      setEducation([blankEducation()]);
      setExperience([blankExperience()]);
      setProfilePhoto(null);
      setPassportPhoto(null);
      setDocuments({});
      setStep(0);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to register employee");
    } finally {
      setLoading(false);
    }
  };

  // ─── Section renders ────────────────────────────────────────────────────────
  const sections = [
    // 0 — Personal
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Input label="Employee ID" required name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="EMP-001" />
      <Input label="First name" required name="firstName" value={form.firstName} onChange={handleChange} placeholder="" />
      <Input label="Middle name" name="middleName" value={form.middleName} onChange={handleChange} placeholder="" />
      <Input label="Last name" required name="lastName" value={form.lastName} onChange={handleChange} placeholder="" />
      <Sel label="Gender" required name="gender" value={form.gender} onChange={handleChange}>
        <option value="">Select gender</option>
        <option>Male</option><option>Female</option><option>Other</option>
      </Sel>
      <Input label="Date of birth" required type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
      <Sel label="Marital status" name="maritalStatus" value={form.maritalStatus} onChange={handleChange}>
        <option value="">Select</option>
        <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
      </Sel>
      <Sel label="Blood group" name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
        <option value="">Select</option>
        {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b=><option key={b}>{b}</option>)}
      </Sel>
      <Input label="Nationality" name="nationality" value={form.nationality} onChange={handleChange} placeholder="Indian" />
      <div className="md:col-span-3">
        <FileUpload
          label="Profile photo (image)"
          accept="image/*"
          previewName={profilePhoto?.name}
          onChange={(e) => setProfilePhoto(e.target.files[0] || null)}
        />
      </div>
    </div>,

    // 1 — Contact
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Input label="Personal email" required type="email" name="personalEmail" value={form.personalEmail} onChange={handleChange} placeholder="arjun@gmail.com" />
        <Input label="Official email" required type="email" name="officialEmail" value={form.officialEmail} onChange={handleChange} placeholder="arjun@company.com" />
        <Input label="Mobile number" required name="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="+91 98765 43210" />
        <Input label="Alternate mobile" name="alternateMobileNumber" value={form.alternateMobileNumber} onChange={handleChange} />
        <Input label="Emergency contact name" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} />
        <Input label="Emergency contact number" name="emergencyContactNumber" value={form.emergencyContactNumber} onChange={handleChange} />
        <Input label="City" name="city" value={form.city} onChange={handleChange} />
        <Input label="State" name="state" value={form.state} onChange={handleChange} />
        <Input label="Country" name="country" value={form.country} onChange={handleChange} />
        <Input label="Zip code" name="zipCode" value={form.zipCode} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Textarea label="Current address" name="currentAddress" value={form.currentAddress} onChange={handleChange} placeholder="Street, Area, City…" />
        <Textarea label="Permanent address" name="permanentAddress" value={form.permanentAddress} onChange={handleChange} placeholder="Street, Area, City…" />
      </div>
    </div>,


    // 2 — Job
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Sel label="Department" required name="employeeType" value={form.department} onChange={handleChange}>
        <option value="">Select type</option>
        <option>Software Development</option><option>Human Resources</option><option>Sales</option><option>Marketing</option><option>Business Development Executive</option><option>UI / UX Designer</option><option>Others</option>
      </Sel>
      <Input label="Designation" required name="designation" value={form.designation} onChange={handleChange} placeholder="Software Engineer" />
      <Sel label="Employee type" required name="department" value={form.employeeType} onChange={handleChange}>
        <option value="">Select type</option>
        <option>Full-Time</option><option>Part-Time</option><option>Intern</option><option>Contract</option>
      </Sel>
  
      <Input label="Work location" name="workLocation" value={form.workLocation} onChange={handleChange} placeholder="Bhubaneswar HQ" />
      <Input label="Joining date" required type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} />
      <Input label="Probation end date" type="date" name="probationEndDate" value={form.probationEndDate} onChange={handleChange} />
      <Input label="Shift timing" name="shiftTiming" value={form.shiftTiming} onChange={handleChange} placeholder="9 AM – 6 PM" />
      <Sel label="Work mode" name="workMode" value={form.workMode} onChange={handleChange}>
        <option value="">Select mode</option>
        <option>Onsite</option><option>Remote</option><option>Hybrid</option>
      </Sel>
      <Sel label="Employment status" name="employmentStatus" value={form.employmentStatus} onChange={handleChange}>
        <option value="">Select status</option>
        <option>Active</option><option>On Notice</option><option>Inactive</option>
      </Sel>
    </div>,

    // 3 — Payroll
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Input label="Salary (₹)" type="number" name="salary" value={form.salary} onChange={handleChange} placeholder="50000" />
      <Input label="Bank name" name="bankName" value={form.bankName} onChange={handleChange} placeholder="HDFC Bank" />
      <Input label="Account number" name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="00001234567890" />
      <Input label="IFSC code" name="ifscCode" value={form.ifscCode} onChange={handleChange} placeholder="HDFC0001234" />
      <Input label="PAN number" name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="ABCDE1234F" />
    </div>,

    // 4 — Education
    <div className="space-y-4">
      {education.map((edu, i) => (
        <div key={i} className="border border-slate-700 rounded-xl p-4 bg-white-900/60">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-black">Education #{i + 1}</span>
            {education.length > 1 && (
              <button type="button" onClick={() => setEducation(education.filter((_, idx) => idx !== i))}
                className="text-xs text-rose-400 hover:text-rose-300 border border-rose-800 px-2.5 py-1 rounded-lg transition-colors">
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Qualification" value={edu.qualification} onChange={(e) => updateEdu(i, "qualification", e.target.value)} placeholder="B.Tech, MCA…" />
            <Input label="University / board" value={edu.university} onChange={(e) => updateEdu(i, "university", e.target.value)} />
            <Input label="Passing year" value={edu.passingYear} onChange={(e) => updateEdu(i, "passingYear", e.target.value)} placeholder="2022" />
            <Input label="Percentage / CGPA" value={edu.percentage} onChange={(e) => updateEdu(i, "percentage", e.target.value)} placeholder="85% / 8.5" />
            <Input label="Specialization" value={edu.specialization} onChange={(e) => updateEdu(i, "specialization", e.target.value)} />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => setEducation([...education, blankEducation()])}
        className="text-sm font-medium text-violet-400 hover:text-violet-300 border border-violet-800 hover:border-violet-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
        <span className="text-lg leading-none">+</span> Add education
      </button>
    </div>,

    // 5 — Experience
    <div className="space-y-4">
      {experience.map((exp, i) => (
        <div key={i} className="border border-slate-700 rounded-xl p-4 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-black">Experience #{i + 1}</span>
            {experience.length > 1 && (
              <button type="button" onClick={() => setExperience(experience.filter((_, idx) => idx !== i))}
                className="text-xs text-rose-400 hover:text-rose-300 border border-rose-800 px-2.5 py-1 rounded-lg transition-colors">
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Company name" value={exp.companyName} onChange={(e) => updateExp(i, "companyName", e.target.value)} />
            <Input label="Designation" value={exp.designation} onChange={(e) => updateExp(i, "designation", e.target.value)} />
            <Input label="Start date" type="date" value={exp.startDate} onChange={(e) => updateExp(i, "startDate", e.target.value)} />
            <Input label="End date" type="date" value={exp.endDate} onChange={(e) => updateExp(i, "endDate", e.target.value)} />
            <Input label="Total experience" value={exp.totalExperience} onChange={(e) => updateExp(i, "totalExperience", e.target.value)} placeholder="2 years 3 months" />
            <Input label="Skills used (comma-separated)" value={exp.skillsUsed} onChange={(e) => updateExp(i, "skillsUsed", e.target.value)} placeholder="React, Node.js, MongoDB" />
            <Input label="Reason for leaving" value={exp.reasonForLeaving} onChange={(e) => updateExp(i, "reasonForLeaving", e.target.value)} fieldClass="md:col-span-2" />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => setExperience([...experience, blankExperience()])}
        className="text-sm font-medium text-violet-400 hover:text-violet-300 border border-violet-800 hover:border-violet-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
        <span className="text-lg leading-none">+</span> Add experience
      </button>
    </div>,

    // 6 — Documents
    // Backend DOC_FIELD_NAMES: aadhaarCard, panCard, resume, offerLetter, experienceLetter, educationCertificate
    // passportPhoto handled separately (image → Cloudinary, stored in documents collection)
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <FileUpload
        label="Passport photo (image)"
        accept="image/*"
        previewName={passportPhoto?.name}
        onChange={(e) => setPassportPhoto(e.target.files[0] || null)}
      />
      <FileUpload
        label="Aadhaar card"
        name="aadhaarCard"
        previewName={documents.aadhaarCard?.[0]?.name}
        onChange={handleDocChange}
      />
      <FileUpload
        label="PAN card"
        name="panCard"
        previewName={documents.panCard?.[0]?.name}
        onChange={handleDocChange}
      />
      <FileUpload
        label="Resume"
        name="resume"
        previewName={documents.resume?.[0]?.name}
        onChange={handleDocChange}
      />
      <FileUpload
        label="Offer letter"
        name="offerLetter"
        previewName={documents.offerLetter?.[0]?.name}
        onChange={handleDocChange}
      />
      <FileUpload
        label="Experience letter (multiple)"
        name="experienceLetter"
        multiple
        previewName={documents.experienceLetter ? `${documents.experienceLetter.length} file(s)` : undefined}
        onChange={handleDocChange}
      />
      <FileUpload
        label="Education certificate (multiple)"
        name="educationCertificate"
        multiple
        previewName={documents.educationCertificate ? `${documents.educationCertificate.length} file(s)` : undefined}
        onChange={handleDocChange}
      />
    </div>,

    // 7 — Access
    <div className="space-y-6 max-w-md">
      <div className="grid gap-5">
        <Input label="Password" required type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" />
      </div>
      <div className="bg-green-950/50 border border-green-800/50 rounded-xl p-4 text-sm text-violet-300">
        <p className="font-bold mb-1 text-white">🔐 Login credentials</p>
        <p className="text-white text-xs">
          The employee will sign in using their <strong className="text-black/80">official email</strong> and this password.
          Make sure to share these credentials securely.
        </p>
      </div>
    </div>,
  ];

  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all
          ${toast.type === "success" ? "bg-emerald-900 border border-emerald-700 text-emerald-200" : "bg-rose-900 border border-rose-700 text-rose-200"}`}>
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className=" bg-white backdrop-blur  top-0 ">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black tracking-tight">Register Employee</h1>
            <p className="text-sm text-slate-500 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step].label}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(i)}
                title={s.label}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === step ? "bg-gray-500 w-6" : i < step ? "bg-black" : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step tabs */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(i)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap
                ${i === step
                  ? "bg-green-600 text-black"
                  : i < step
                  ? "bg-black text-slate-300 hover:bg-slate-700"
                  : "bg-transparent text-black hover:text-black/60 hover:bg-slate-800"
                }`}
            >
              <span>{s.icon}</span>
              {s.label}
              {i < step && <span className="text-emerald-400">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Form content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white border border-slate-800 rounded-2xl p-6 min-h-[420px]">
          <h2 className="text-base font-semibold text-black-200 mb-6 flex items-center gap-2">
            <span className="text-xl">{STEPS[step].icon}</span>
            {STEPS[step].label} Information
          </h2>
          {sections[step]}
        </div>
      </div>

      {/* Footer nav */}
      <div className=" bottom-0 z-40   bg-white backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((p) => Math.max(0, p - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xl font-medium text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>

          <span className="text-xs text-slate-600 hidden md:block">
            {STEPS.slice(0, step + 1).map(s => s.label).join(" › ")}
          </span>

          {isLastStep ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-black hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Registering…
                </>
              ) : (
                <>Register Employee</>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep((p) => Math.min(STEPS.length - 1, p + 1))}
              className="flex items-center gap-2 bg-black hover:bg-black/80 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}