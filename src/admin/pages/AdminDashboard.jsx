// import { useState } from "react";
// import axios from "axios";
// import { EMPLOYEE_API_END_POINT } from "../../utils/endpoints";

// // ─── Initial State ───────────────────────────────────────────────────────────
// const initialForm = {
//   employeeId: "", firstName: "", middleName: "", lastName: "",
//   gender: "", dateOfBirth: "", maritalStatus: "", bloodGroup: "", nationality: "",
//   personalEmail: "", officialEmail: "", mobileNumber: "", alternateMobileNumber: "",
//   emergencyContactName: "", emergencyContactNumber: "",
//   currentAddress: "", permanentAddress: "",
//   city: "", state: "", country: "", zipCode: "",
//   department: "", designation: "", employeeType: "",
//   workLocation: "", joiningDate: "", probationEndDate: "",
//   shiftTiming: "", workMode: "", employmentStatus: "",
//   salary: "", bankName: "", accountNumber: "", ifscCode: "", panNumber: "",
//   password: "",
// };

// const blankEducation = () => ({ qualification: "", university: "", passingYear: "", percentage: "", specialization: "" });
// const blankExperience = () => ({ companyName: "", designation: "", startDate: "", endDate: "", totalExperience: "", skillsUsed: "", reasonForLeaving: "" });

// // ─── Steps ────────────────────────────────────────────────────────────────────
// const STEPS = [
//   { id: "personal",    label: "Personal",   icon: "👤" },
//   { id: "contact",     label: "Contact",    icon: "📞" },
//   { id: "job",         label: "Job",        icon: "💼" },
//   { id: "payroll",     label: "Payroll",    icon: "🏦" },
//   { id: "education",   label: "Education",  icon: "🎓" },
//   { id: "experience",  label: "Experience", icon: "🏢" },
//   { id: "documents",   label: "Documents",  icon: "📁" },
//   { id: "access",      label: "Access",     icon: "🔐" },
// ];

// // ─── Reusable Field Components ────────────────────────────────────────────────
// const Field = ({ label, required, children, className = "" }) => (
//   <div className={`flex flex-col gap-1.5 ${className}`}>
//     <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
//       {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
//     </label>
//     {children}
//   </div>
// );

// const inputCls = "w-full bg-white border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-black placeholder-slate-500 outline-none transition-all ";

// const Input = ({ label, required, className, fieldClass, ...props }) => (
//   <Field label={label} required={required} className={fieldClass}>
//     <input className={`${inputCls} ${className || ""}`} {...props} />
//   </Field>
// );

// const Sel = ({ label, required, children, fieldClass, ...props }) => (
//   <Field label={label} required={required} className={fieldClass}>
//     <select className={`${inputCls} cursor-pointer`} {...props}>
//       {children}
//     </select>
//   </Field>
// );

// const Textarea = ({ label, required, fieldClass, ...props }) => (
//   <Field label={label} required={required} className={fieldClass}>
//     <textarea className={`${inputCls} resize-none`} rows={3} {...props} />
//   </Field>
// );

// const FileUpload = ({ label, previewName, ...props }) => (
//   <Field label={label}>
//     <label className="flex items-center gap-3 bg-white border border-dashed border-slate-600 rounded-lg px-3 py-2.5 cursor-pointer hover:border-black-500 transition-colors group">
//       <span className="text-slate-500 group-hover:text-violet-400 transition-colors text-lg">📎</span>
//       <span className="text-sm text-slate-400 truncate flex-1">
//         {previewName || "Choose file…"}
//       </span>
//       <input className="hidden" type="file" {...props} />
//     </label>
//   </Field>
// );

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function AdminDashboard() {
//   const [form, setForm] = useState(initialForm);
//   const [step, setStep] = useState(0);
//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [passportPhoto, setPassportPhoto] = useState(null);
//   const [documents, setDocuments] = useState({});
//   const [education, setEducation] = useState([blankEducation()]);
//   const [experience, setExperience] = useState([blankExperience()]);
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

//   const showToast = (type, msg) => {
//     setToast({ type, msg });
//     setTimeout(() => setToast(null), 4500);
//   };

//   const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleDocChange = (e) => setDocuments((p) => ({ ...p, [e.target.name]: e.target.files }));

//   const updateEdu = (i, k, v) => setEducation((p) => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
//   const updateExp = (i, k, v) => setExperience((p) => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r));

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const fd = new FormData();
//       Object.entries(form).forEach(([k, v]) => fd.append(k, v));

//       if (profilePhoto) fd.append("profilePhoto", profilePhoto);
//       if (passportPhoto) fd.append("passportPhoto", passportPhoto);

//       fd.append("education", JSON.stringify(education));
//       fd.append("experience", JSON.stringify(
//         experience.map((exp) => ({
//           ...exp,
//           skillsUsed: exp.skillsUsed
//             ? exp.skillsUsed.split(",").map((s) => s.trim()).filter(Boolean)
//             : [],
//         }))
//       ));

//       Object.entries(documents).forEach(([field, files]) => {
//         Array.from(files).forEach((file) => fd.append(field, file));
//       });

//       const res = await axios.post(`${EMPLOYEE_API_END_POINT}/register`, fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//       });

//       showToast("success", res.data.message || "Employee registered successfully");
//       setForm(initialForm);
//       setEducation([blankEducation()]);
//       setExperience([blankExperience()]);
//       setProfilePhoto(null);
//       setPassportPhoto(null);
//       setDocuments({});
//       setStep(0);
//     } catch (err) {
//       showToast("error", err.response?.data?.message || "Failed to register employee");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Section renders ────────────────────────────────────────────────────────
//   const sections = [
//     // 0 — Personal
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//       <Input label="Employee ID" required name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="EMP-001" />
//       <Input label="First name" required name="firstName" value={form.firstName} onChange={handleChange} placeholder="" />
//       <Input label="Middle name" name="middleName" value={form.middleName} onChange={handleChange} placeholder="" />
//       <Input label="Last name" required name="lastName" value={form.lastName} onChange={handleChange} placeholder="" />
//       <Sel label="Gender" required name="gender" value={form.gender} onChange={handleChange}>
//         <option value="">Select gender</option>
//         <option>Male</option><option>Female</option><option>Other</option>
//       </Sel>
//       <Input label="Date of birth" required type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
//       <Sel label="Marital status" name="maritalStatus" value={form.maritalStatus} onChange={handleChange}>
//         <option value="">Select</option>
//         <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
//       </Sel>
//       <Sel label="Blood group" name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
//         <option value="">Select</option>
//         {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b=><option key={b}>{b}</option>)}
//       </Sel>
//       <Input label="Nationality" name="nationality" value={form.nationality} onChange={handleChange} placeholder="Indian" />
//       <div className="md:col-span-3">
//         <FileUpload
//           label="Profile photo (image)"
//           accept="image/*"
//           previewName={profilePhoto?.name}
//           onChange={(e) => setProfilePhoto(e.target.files[0] || null)}
//         />
//       </div>
//     </div>,

//     // 1 — Contact
//     <div className="space-y-5">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         <Input label="Personal email" required type="email" name="personalEmail" value={form.personalEmail} onChange={handleChange} placeholder="arjun@gmail.com" />
//         <Input label="Official email" required type="email" name="officialEmail" value={form.officialEmail} onChange={handleChange} placeholder="arjun@company.com" />
//         <Input label="Mobile number" required name="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="+91 98765 43210" />
//         <Input label="Alternate mobile" name="alternateMobileNumber" value={form.alternateMobileNumber} onChange={handleChange} />
//         <Input label="Emergency contact name" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} />
//         <Input label="Emergency contact number" name="emergencyContactNumber" value={form.emergencyContactNumber} onChange={handleChange} />
//         <Input label="City" name="city" value={form.city} onChange={handleChange} />
//         <Input label="State" name="state" value={form.state} onChange={handleChange} />
//         <Input label="Country" name="country" value={form.country} onChange={handleChange} />
//         <Input label="Zip code" name="zipCode" value={form.zipCode} onChange={handleChange} />
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         <Textarea label="Current address" name="currentAddress" value={form.currentAddress} onChange={handleChange} placeholder="Street, Area, City…" />
//         <Textarea label="Permanent address" name="permanentAddress" value={form.permanentAddress} onChange={handleChange} placeholder="Street, Area, City…" />
//       </div>
//     </div>,


//     // 2 — Job
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         <Sel label="Department" required name="employeeType" value={form.department} onChange={handleChange}>
//         <option value="">Select type</option>
//         <option>Software Development</option><option>Human Resources</option><option>Sales</option><option>Marketing</option><option>Business Development Executive</option><option>UI / UX Designer</option><option>Others</option>
//       </Sel>
//       <Input label="Designation" required name="designation" value={form.designation} onChange={handleChange} placeholder="Software Engineer" />
//       <Sel label="Employee type" required name="department" value={form.employeeType} onChange={handleChange}>
//         <option value="">Select type</option>
//         <option>Full-Time</option><option>Part-Time</option><option>Intern</option><option>Contract</option>
//       </Sel>
  
//       <Input label="Work location" name="workLocation" value={form.workLocation} onChange={handleChange} placeholder="Bhubaneswar HQ" />
//       <Input label="Joining date" required type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} />
//       <Input label="Probation end date" type="date" name="probationEndDate" value={form.probationEndDate} onChange={handleChange} />
//       <Input label="Shift timing" name="shiftTiming" value={form.shiftTiming} onChange={handleChange} placeholder="9 AM – 6 PM" />
//       <Sel label="Work mode" name="workMode" value={form.workMode} onChange={handleChange}>
//         <option value="">Select mode</option>
//         <option>Onsite</option><option>Remote</option><option>Hybrid</option>
//       </Sel>
//       <Sel label="Employment status" name="employmentStatus" value={form.employmentStatus} onChange={handleChange}>
//         <option value="">Select status</option>
//         <option>Active</option><option>On Notice</option><option>Inactive</option>
//       </Sel>
//     </div>,

//     // 3 — Payroll
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//       <Input label="Salary (₹)" type="number" name="salary" value={form.salary} onChange={handleChange} placeholder="50000" />
//       <Input label="Bank name" name="bankName" value={form.bankName} onChange={handleChange} placeholder="HDFC Bank" />
//       <Input label="Account number" name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="00001234567890" />
//       <Input label="IFSC code" name="ifscCode" value={form.ifscCode} onChange={handleChange} placeholder="HDFC0001234" />
//       <Input label="PAN number" name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="ABCDE1234F" />
//     </div>,

//     // 4 — Education
//     <div className="space-y-4">
//       {education.map((edu, i) => (
//         <div key={i} className="border border-slate-700 rounded-xl p-4 bg-white-900/60">
//           <div className="flex justify-between items-center mb-4">
//             <span className="text-sm font-semibold text-black">Education #{i + 1}</span>
//             {education.length > 1 && (
//               <button type="button" onClick={() => setEducation(education.filter((_, idx) => idx !== i))}
//                 className="text-xs text-rose-400 hover:text-rose-300 border border-rose-800 px-2.5 py-1 rounded-lg transition-colors">
//                 Remove
//               </button>
//             )}
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Input label="Qualification" value={edu.qualification} onChange={(e) => updateEdu(i, "qualification", e.target.value)} placeholder="B.Tech, MCA…" />
//             <Input label="University / board" value={edu.university} onChange={(e) => updateEdu(i, "university", e.target.value)} />
//             <Input label="Passing year" value={edu.passingYear} onChange={(e) => updateEdu(i, "passingYear", e.target.value)} placeholder="2022" />
//             <Input label="Percentage / CGPA" value={edu.percentage} onChange={(e) => updateEdu(i, "percentage", e.target.value)} placeholder="85% / 8.5" />
//             <Input label="Specialization" value={edu.specialization} onChange={(e) => updateEdu(i, "specialization", e.target.value)} />
//           </div>
//         </div>
//       ))}
//       <button type="button" onClick={() => setEducation([...education, blankEducation()])}
//         className="text-sm font-medium text-violet-400 hover:text-violet-300 border border-violet-800 hover:border-violet-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
//         <span className="text-lg leading-none">+</span> Add education
//       </button>
//     </div>,

//     // 5 — Experience
//     <div className="space-y-4">
//       {experience.map((exp, i) => (
//         <div key={i} className="border border-slate-700 rounded-xl p-4 bg-white">
//           <div className="flex justify-between items-center mb-4">
//             <span className="text-sm font-semibold text-black">Experience #{i + 1}</span>
//             {experience.length > 1 && (
//               <button type="button" onClick={() => setExperience(experience.filter((_, idx) => idx !== i))}
//                 className="text-xs text-rose-400 hover:text-rose-300 border border-rose-800 px-2.5 py-1 rounded-lg transition-colors">
//                 Remove
//               </button>
//             )}
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Input label="Company name" value={exp.companyName} onChange={(e) => updateExp(i, "companyName", e.target.value)} />
//             <Input label="Designation" value={exp.designation} onChange={(e) => updateExp(i, "designation", e.target.value)} />
//             <Input label="Start date" type="date" value={exp.startDate} onChange={(e) => updateExp(i, "startDate", e.target.value)} />
//             <Input label="End date" type="date" value={exp.endDate} onChange={(e) => updateExp(i, "endDate", e.target.value)} />
//             <Input label="Total experience" value={exp.totalExperience} onChange={(e) => updateExp(i, "totalExperience", e.target.value)} placeholder="2 years 3 months" />
//             <Input label="Skills used (comma-separated)" value={exp.skillsUsed} onChange={(e) => updateExp(i, "skillsUsed", e.target.value)} placeholder="React, Node.js, MongoDB" />
//             <Input label="Reason for leaving" value={exp.reasonForLeaving} onChange={(e) => updateExp(i, "reasonForLeaving", e.target.value)} fieldClass="md:col-span-2" />
//           </div>
//         </div>
//       ))}
//       <button type="button" onClick={() => setExperience([...experience, blankExperience()])}
//         className="text-sm font-medium text-violet-400 hover:text-violet-300 border border-violet-800 hover:border-violet-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
//         <span className="text-lg leading-none">+</span> Add experience
//       </button>
//     </div>,

//     // 6 — Documents
//     // Backend DOC_FIELD_NAMES: aadhaarCard, panCard, resume, offerLetter, experienceLetter, educationCertificate
//     // passportPhoto handled separately (image → Cloudinary, stored in documents collection)
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//       <FileUpload
//         label="Passport photo (image)"
//         accept="image/*"
//         previewName={passportPhoto?.name}
//         onChange={(e) => setPassportPhoto(e.target.files[0] || null)}
//       />
//       <FileUpload
//         label="Aadhaar card"
//         name="aadhaarCard"
//         previewName={documents.aadhaarCard?.[0]?.name}
//         onChange={handleDocChange}
//       />
//       <FileUpload
//         label="PAN card"
//         name="panCard"
//         previewName={documents.panCard?.[0]?.name}
//         onChange={handleDocChange}
//       />
//       <FileUpload
//         label="Resume"
//         name="resume"
//         previewName={documents.resume?.[0]?.name}
//         onChange={handleDocChange}
//       />
//       <FileUpload
//         label="Offer letter"
//         name="offerLetter"
//         previewName={documents.offerLetter?.[0]?.name}
//         onChange={handleDocChange}
//       />
//       <FileUpload
//         label="Experience letter (multiple)"
//         name="experienceLetter"
//         multiple
//         previewName={documents.experienceLetter ? `${documents.experienceLetter.length} file(s)` : undefined}
//         onChange={handleDocChange}
//       />
//       <FileUpload
//         label="Education certificate (multiple)"
//         name="educationCertificate"
//         multiple
//         previewName={documents.educationCertificate ? `${documents.educationCertificate.length} file(s)` : undefined}
//         onChange={handleDocChange}
//       />
//     </div>,

//     // 7 — Access
//     <div className="space-y-6 max-w-md">
//       <div className="grid gap-5">
//         <Input label="Password" required type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" />
//       </div>
//       <div className="bg-green-950/50 border border-green-800/50 rounded-xl p-4 text-sm text-violet-300">
//         <p className="font-bold mb-1 text-white">🔐 Login credentials</p>
//         <p className="text-white text-xs">
//           The employee will sign in using their <strong className="text-black/80">official email</strong> and this password.
//           Make sure to share these credentials securely.
//         </p>
//       </div>
//     </div>,
//   ];

//   const isLastStep = step === STEPS.length - 1;

//   return (
//     <div className="min-h-screen bg-white text-black">
//       {/* Toast */}
//       {toast && (
//         <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all
//           ${toast.type === "success" ? "bg-emerald-900 border border-emerald-700 text-emerald-200" : "bg-rose-900 border border-rose-700 text-rose-200"}`}>
//           <span>{toast.type === "success" ? "✅" : "❌"}</span>
//           {toast.msg}
//         </div>
//       )}

//       {/* Header */}
//       <div className=" bg-white backdrop-blur  top-0 ">
//         <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-black tracking-tight">Register Employee</h1>
//             <p className="text-sm text-slate-500 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step].label}</p>
//           </div>
//           <div className="flex items-center gap-1.5">
//             {STEPS.map((s, i) => (
//               <button
//                 key={s.id}
//                 type="button"
//                 onClick={() => setStep(i)}
//                 title={s.label}
//                 className={`w-2 h-2 rounded-full transition-all ${
//                   i === step ? "bg-gray-500 w-6" : i < step ? "bg-black" : "bg-gray-700"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Step tabs */}
//       <div className="max-w-6xl mx-auto px-6 pt-6">
//         <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
//           {STEPS.map((s, i) => (
//             <button
//               key={s.id}
//               type="button"
//               onClick={() => setStep(i)}
//               className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap
//                 ${i === step
//                   ? "bg-green-600 text-black"
//                   : i < step
//                   ? "bg-black text-slate-300 hover:bg-slate-700"
//                   : "bg-transparent text-black hover:text-black/60 hover:bg-slate-800"
//                 }`}
//             >
//               <span>{s.icon}</span>
//               {s.label}
//               {i < step && <span className="text-emerald-400">✓</span>}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Form content */}
//       <div className="max-w-6xl mx-auto px-6 py-6">
//         <div className="bg-white border border-slate-800 rounded-2xl p-6 min-h-[420px]">
//           <h2 className="text-base font-semibold text-black-200 mb-6 flex items-center gap-2">
//             <span className="text-xl">{STEPS[step].icon}</span>
//             {STEPS[step].label} Information
//           </h2>
//           {sections[step]}
//         </div>
//       </div>

//       {/* Footer nav */}
//       <div className=" bottom-0 z-40   bg-white backdrop-blur">
//         <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
//           <button
//             type="button"
//             onClick={() => setStep((p) => Math.max(0, p - 1))}
//             disabled={step === 0}
//             className="flex items-center gap-2 px-4 py-2 rounded-lg text-xl font-medium text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//           >
//             ← Back
//           </button>

//           <span className="text-xs text-slate-600 hidden md:block">
//             {STEPS.slice(0, step + 1).map(s => s.label).join(" › ")}
//           </span>

//           {isLastStep ? (
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={loading}
//               className="flex items-center gap-2 bg-black hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                   </svg>
//                   Registering…
//                 </>
//               ) : (
//                 <>Register Employee</>
//               )}
//             </button>
//           ) : (
//             <button
//               type="button"
//               onClick={() => setStep((p) => Math.min(STEPS.length - 1, p + 1))}
//               className="flex items-center gap-2 bg-black hover:bg-black/80 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
//             >
//               Next →
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useRef } from "react";
import axios from "axios";
import { EMPLOYEE_API_END_POINT } from "../../utils/endpoints";

// ─────────────────────────────────────────────────────────────
// STEPS
// ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: "personal",   label: "Personal",   icon: "👤", desc: "Basic identity info" },
  { id: "contact",    label: "Contact",    icon: "📞", desc: "Address & emergency" },
  { id: "job",        label: "Job",        icon: "💼", desc: "Role & employment" },
  { id: "payroll",    label: "Payroll",    icon: "🏦", desc: "Salary & banking" },
  { id: "education",  label: "Education",  icon: "🎓", desc: "Academic history" },
  { id: "experience", label: "Experience", icon: "🏢", desc: "Work history" },
  { id: "documents",  label: "Documents",  icon: "📁", desc: "Upload files" },
  { id: "access",     label: "Access",     icon: "🔐", desc: "Login credentials" },
];

// ─────────────────────────────────────────────────────────────
// ENUMS — copied verbatim from backend models
// ─────────────────────────────────────────────────────────────

// employee.model.js → gender enum
const GENDERS = ["Male", "Female", "Other"];

// employee.model.js → maritalStatus enum
const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];

// employee.model.js → bloodGroup enum
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// jobInformation.model.js → department enum
const DEPARTMENTS = [
  "Software Development",
  "Human Resources",
  "Sales",
  "Marketing",
  "Business Development Executive",
  "UI / UX Designer",
  "Others",
];

// jobInformation.model.js → employeeType enum
// IMPORTANT: spaces not hyphens — "Full Time" not "Full-Time"
const EMPLOYEE_TYPES = ["Full Time", "Part Time", "Intern", "Contract"];

// jobInformation.model.js → workMode enum
// IMPORTANT: "Office" not "Onsite"
const WORK_MODES = ["Remote", "Hybrid", "Office"];

// jobInformation.model.js → employmentStatus enum
// IMPORTANT: "Notice Period" not "On Notice", includes "Resigned" & "Terminated"
const EMPLOYMENT_STATUSES = ["Active", "Notice Period", "Resigned", "Terminated"];

// document.model.js → fieldName enum (all 9 values)
const DOC_FIELDS = [
  ["aadhaarCard",          "Aadhaar Card",               false],
  ["panCard",              "PAN Card",                   false],
  ["resume",               "Resume",                     false],
  ["offerLetter",          "Offer Letter",               false],
  ["experienceLetter",     "Experience Letter",          true ],
  ["educationCertificates","Education Certificates",     true ],  // plural — matches model exactly
  ["signedNDA",            "Signed NDA (optional)",      false],
  ["otherDocuments",       "Other Documents (optional)", true ],
];

// ─────────────────────────────────────────────────────────────
// STEP → VALIDATED FIELDS (gating logic)
// ─────────────────────────────────────────────────────────────
const STEP_FIELDS = [
  ["employeeId", "firstName", "lastName", "gender", "dateOfBirth", "maritalStatus", "bloodGroup"], // 0 personal
  ["personalEmail", "officialEmail", "mobileNumber",
   "alternateMobileNumber", "emergencyContactNumber"],                    // 1 contact
  ["department", "designation", "employeeType", "joiningDate",
   "workMode", "employmentStatus"],                                        // 2 job
  ["salary", "accountNumber", "ifscCode", "panNumber"],                  // 3 payroll
  [],                                                                      // 4 education
  [],                                                                      // 5 experience
  [],                                                                      // 6 documents
  ["password"],                                                            // 7 access
];

// ─────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────
const initialForm = {
  employeeId: "", firstName: "", middleName: "", lastName: "",
  gender: "", dateOfBirth: "", maritalStatus: "", bloodGroup: "", nationality: "",
  personalEmail: "", officialEmail: "",
  mobileNumber: "", alternateMobileNumber: "",
  emergencyContactName: "", emergencyContactNumber: "",
  currentAddress: "", permanentAddress: "",
  city: "", state: "", country: "", zipCode: "",
  department: "", designation: "", employeeType: "",
  workLocation: "", joiningDate: "", probationEndDate: "",
  shiftTiming: "", workMode: "", employmentStatus: "",
  salary: "", bankName: "", accountNumber: "", ifscCode: "", panNumber: "",
  password: "",
};

const blankEdu = () => ({
  qualification: "", university: "", passingYear: "", percentage: "", specialization: "",
});
const blankExp = () => ({
  companyName: "", designation: "", startDate: "", endDate: "",
  totalExperience: "", skillsUsed: "", reasonForLeaving: "",
});

// ─────────────────────────────────────────────────────────────
// VALIDATION — every rule matches the model exactly
// maxLen is enforced via HTML maxLength AND pattern
// ─────────────────────────────────────────────────────────────
const VALIDATORS = {
  // employee.model.js
  employeeId:             { required: true,  maxLen: 20, pattern: /^[A-Za-z0-9\ /-_]{2,20}$/, msg: "2–20 alphanumeric, hyphens or underscores" },
  firstName:              { required: true,  maxLen: 50, pattern: /^[A-Za-z\s]{2,50}$/,      msg: "2–50 letters only" },
  middleName:             { required: false, maxLen: 50, pattern: /^[A-Za-z\s]{0,50}$/,      msg: "Letters only" },
  lastName:               { required: true,  maxLen: 50, pattern: /^[A-Za-z\s]{2,50}$/,      msg: "2–50 letters only" },
  gender:                 { required: true,  maxLen: null, pattern: null, msg: "Select a gender" },
  dateOfBirth:            { required: true,  maxLen: null, pattern: null, msg: "Date of birth is required" },
  maritalStatus:          { required: true,  maxLen: null, pattern: null, msg: "Select a marital status" },
  bloodGroup:             { required: true,  maxLen: null, pattern: null, msg: "Select a blood group" },
  personalEmail:          { required: true,  maxLen: 100, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: "Enter a valid email address" },
  officialEmail:          { required: true,  maxLen: 100, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: "Enter a valid email address" },
  // Indian mobile: starts 6–9, exactly 10 digits
  mobileNumber:           { required: true,  maxLen: 10,  pattern: /^[6-9]\d{9}$/,            msg: "Must start with 6–9 and be exactly 10 digits" },
  alternateMobileNumber:  { required: false, maxLen: 10,  pattern: /^([6-9]\d{9})?$/,         msg: "Must start with 6–9 and be exactly 10 digits" },
  emergencyContactNumber: { required: false, maxLen: 10,  pattern: /^([6-9]\d{9})?$/,         msg: "Must start with 6–9 and be exactly 10 digits" },
  // jobInformation.model.js
  department:             { required: true,  maxLen: null, pattern: null,                      msg: "Select a department" },
  designation:            { required: true,  maxLen: 80,  pattern: /^.{2,80}$/,               msg: "2–80 characters required" },
  employeeType:           { required: true,  maxLen: null, pattern: null, msg: "Select employee type" },
  joiningDate:            { required: true,  maxLen: null, pattern: null, msg: "Joining date is required" },
  workMode:               { required: true,  maxLen: null, pattern: null, msg: "Select a work mode" },
  employmentStatus:       { required: true,  maxLen: null, pattern: null, msg: "Select employment status" },
  // payroll.model.js — all optional, validate only if filled
  salary:                 { required: false, maxLen: 10,  pattern: /^(\d{1,10})?$/,           msg: "Numbers only" },
  accountNumber:          { required: false, maxLen: 18,  pattern: /^(\d{9,18})?$/,           msg: "9–18 digits, numbers only" },
  // IFSC: exactly 11 chars — 4 uppercase letters + literal 0 + 6 uppercase alphanumeric
  ifscCode:               { required: false, maxLen: 11,  pattern: /^([A-Z]{4}0[A-Z0-9]{6})?$/, msg: "11 chars: 4 letters + 0 + 6 alphanumeric (e.g. HDFC0001234)" },
  // PAN: exactly 10 chars — 5 uppercase letters + 4 digits + 1 uppercase letter
  panNumber:              { required: false, maxLen: 10,  pattern: /^([A-Z]{5}[0-9]{4}[A-Z])?$/, msg: "10 chars: ABCDE1234F format" },
  // employee.model.js → minlength: 6
  password:               { required: true,  maxLen: null, pattern: /^.{6,}$/,                msg: "Minimum 6 characters" },
};

const FIELD_LABELS = {
  employeeId: "Employee ID", firstName: "First name", middleName: "Middle name",
  lastName: "Last name", gender: "Gender", dateOfBirth: "Date of birth",
  maritalStatus: "Marital status", bloodGroup: "Blood group",
  personalEmail: "Personal email", officialEmail: "Official email",
  mobileNumber: "Mobile number", alternateMobileNumber: "Alternate mobile",
  emergencyContactNumber: "Emergency contact number",
  department: "Department", designation: "Designation",
  employeeType: "Employee type", joiningDate: "Joining date",
  workMode: "Work mode", employmentStatus: "Employment status",
  salary: "Salary", accountNumber: "Account number",
  ifscCode: "IFSC code", panNumber: "PAN number", password: "Password",
};

const validateField = (name, value) => {
  const rule = VALIDATORS[name];
  if (!rule) return null;
  const v = value?.toString().trim() ?? "";
  if (rule.required && !v) return `${FIELD_LABELS[name] || name} is required`;
  if (rule.pattern && v && !rule.pattern.test(v)) return rule.msg;
  return null;
};

// key filter helpers — block invalid keypresses at the DOM level
const onlyDigits   = (e) => { if (!/[\d\b]/.test(e.key) && !["ArrowLeft","ArrowRight","Delete","Tab","Backspace"].includes(e.key)) e.preventDefault(); };
const onlyLetters  = (e) => { if (!/[A-Za-z\s\b]/.test(e.key) && !["ArrowLeft","ArrowRight","Delete","Tab","Backspace"].includes(e.key)) e.preventDefault(); };
const onlyAlphaNum = (e) => { if (!/[A-Za-z0-9\/-_\b]/.test(e.key) && !["ArrowLeft","ArrowRight","Delete","Tab","Backspace"].includes(e.key)) e.preventDefault(); };
const onlyUpperAlphaNum = (e) => { if (!/[A-Za-z0-9\b]/.test(e.key) && !["ArrowLeft","ArrowRight","Delete","Tab","Backspace"].includes(e.key)) e.preventDefault(); };

// ─────────────────────────────────────────────────────────────
// STYLE HELPERS
// ─────────────────────────────────────────────────────────────
const cls = (...c) => c.filter(Boolean).join(" ");
const inputBase = "w-full bg-slate-50 border rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:shadow-sm";
const stateOk   = "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
const stateErr  = "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 bg-rose-50/30";
const stateDone = "border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const getInputCls = (err, isTouched, val) => {
  if (err && isTouched)        return cls(inputBase, stateErr);
  if (!err && isTouched && val) return cls(inputBase, stateDone);
  return cls(inputBase, stateOk);
};

// ─────────────────────────────────────────────────────────────
// PRIMITIVE COMPONENTS — ALL outside main component
// (inside = new identity every render = focus lost on keystroke)
// ─────────────────────────────────────────────────────────────

const FieldWrapper = ({ label, required, error, touched, children, className = "" }) => (
  <div className={cls("flex flex-col gap-1", className)}>
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
      {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && touched && (
      <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.5 2.5a.5.5 0 011 0v3a.5.5 0 01-1 0v-3zm.5 5a.6.6 0 110-1.2.6.6 0 010 1.2z"/>
        </svg>
        {error}
      </p>
    )}
  </div>
);

// Generic text/date/number/email input
const FormInput = ({
  name, label, required, type = "text", placeholder = "",
  className = "", maxLength, onKeyDown,
  form, errors, touched, onChange, onBlur,
}) => (
  <FieldWrapper label={label} required={required} error={errors[name]} touched={touched[name]} className={className}>
    <input
      type={type}
      name={name}
      value={form[name]}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      maxLength={maxLength || VALIDATORS[name]?.maxLen || undefined}
      autoComplete="off"
      className={getInputCls(errors[name], touched[name], form[name])}
    />
  </FieldWrapper>
);

const FormSelect = ({
  name, label, required, className = "",
  form, errors, touched, onChange, onBlur, children,
}) => (
  <FieldWrapper label={label} required={required} error={errors[name]} touched={touched[name]} className={className}>
    <select
      name={name}
      value={form[name]}
      onChange={onChange}
      onBlur={onBlur}
      className={getInputCls(errors[name], touched[name], form[name])}
    >
      {children}
    </select>
  </FieldWrapper>
);

const FormTextarea = ({ name, label, placeholder = "", className = "", maxLength, form, onChange }) => (
  <FieldWrapper label={label} className={className}>
    <textarea
      name={name}
      value={form[name]}
      onChange={onChange}
      rows={3}
      placeholder={placeholder}
      maxLength={maxLength}
      className={cls(inputBase, stateOk, "resize-none")}
    />
  </FieldWrapper>
);

const PasswordInput = ({
  name, label, required, placeholder = "",
  form, errors, touched, onChange, onBlur, showPass, onToggleShow,
}) => (
  <FieldWrapper label={label} required={required} error={errors[name]} touched={touched[name]}>
    <div className="relative">
      <input
        type={showPass ? "text" : "password"}
        name={name}
        value={form[name]}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete="new-password"
        className={cls(getInputCls(errors[name], touched[name], form[name]), "pr-16")}
      />
      <button type="button" onClick={onToggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-semibold">
        {showPass ? "Hide" : "Show"}
      </button>
    </div>
  </FieldWrapper>
);

const FileUploadBtn = ({ label, fileName, hasFile, inputProps }) => (
  <FieldWrapper label={label}>
    <label className={cls(
      "flex items-center gap-3 border border-dashed rounded-lg px-3 py-3 cursor-pointer transition-all text-sm",
      hasFile
        ? "border-emerald-400 bg-emerald-50/60 text-emerald-700"
        : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-500"
    )}>
      <span className="text-lg flex-shrink-0">{hasFile ? "✅" : "📎"}</span>
      <span className="truncate flex-1">{fileName || "Choose file…"}</span>
      <input className="hidden" type="file" {...inputProps} />
    </label>
  </FieldWrapper>
);

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function RegisterEmployee() {
  const [form, setForm]             = useState(initialForm);
  const [errors, setErrors]         = useState({});
  const [touched, setTouched]       = useState({});
  const [step, setStep]             = useState(0);
  const [education, setEducation]   = useState([blankEdu()]);
  const [experience, setExperience] = useState([blankExp()]);
  const [profilePhoto, setProfilePhoto]   = useState(null);
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [documents, setDocuments]   = useState({});
  const [loading, setLoading]       = useState(false);
  const [toast, setToast]           = useState(null);
  const [showPass, setShowPass]     = useState(false);
  const topRef = useRef(null);

  // ── handlers ────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setTouched(p => ({ ...p, [name]: true }));
    setErrors(p => ({ ...p, [name]: validateField(name, value) }));
  };

  // upper-casing handler for IFSC and PAN
  const handleUpperChange = (e) => {
    const synth = { target: { name: e.target.name, value: e.target.value.toUpperCase() } };
    handleChange(synth);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    setErrors(p => ({ ...p, [name]: validateField(name, value) }));
  };

  const handleUpperBlur = (e) => {
    const synth = { target: { name: e.target.name, value: e.target.value.toUpperCase() } };
    handleBlur(synth);
  };

  const handleDocChange = (e) => {
    setDocuments(p => ({ ...p, [e.target.name]: e.target.files }));
  };

  const updateEdu = (i, k, v) => setEducation(p => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const updateExp = (i, k, v) => setExperience(p => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r));

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  // ── step gating ──────────────────────────────────────────────
  const validateStep = (idx) => {
    const fields = STEP_FIELDS[idx];
    const newErrors = {};
    const newTouched = {};
    fields.forEach(f => {
      newTouched[f] = true;
      const err = validateField(f, form[f]);
      if (err) newErrors[f] = err;
    });
    setTouched(p => ({ ...p, ...newTouched }));
    setErrors(p => ({ ...p, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const stepHasError = (i) => STEP_FIELDS[i].some(f => errors[f] && touched[f]);

  const stepIsDone = (i) => {
    const fields = STEP_FIELDS[i];
    if (!fields.length) return i < step;
    return fields.every(f => !validateField(f, form[f]));
  };

  // ── navigation ───────────────────────────────────────────────
  const goNext = () => {
    if (!validateStep(step)) { topRef.current?.scrollIntoView({ behavior: "smooth" }); return; }
    setStep(p => Math.min(STEPS.length - 1, p + 1));
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const goBack = () => {
    setStep(p => Math.max(0, p - 1));
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const goToStep = (i) => {
    if (i <= step) { setStep(i); return; }
    if (i === step + 1 && validateStep(step)) setStep(i);
  };

  // ── submit ───────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep(7)) return;
    const allTouched = {};
    const allErrors  = {};
    Object.keys(VALIDATORS).forEach(f => {
      if (!VALIDATORS[f].required) return;
      allTouched[f] = true;
      const err = validateField(f, form[f]);
      if (err) allErrors[f] = err;
    });
    if (Object.keys(allErrors).length) {
      setTouched(p => ({ ...p, ...allTouched }));
      setErrors(p => ({ ...p, ...allErrors }));
      showToast("error", "Please fix all required fields before submitting.");
      return;
    }
    setLoading(true);
    try {
      // Never send an empty string for any enum field — Mongoose rejects it.
      // Since all enums are now required, this is a safety net only.
      const ENUM_FIELDS = new Set([
        "gender", "maritalStatus", "bloodGroup",
        "employeeType", "workMode", "employmentStatus",
      ]);

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (ENUM_FIELDS.has(k) && !v) return; // skip empty enum → backend uses model default
        fd.append(k, v);
      });
      if (profilePhoto)  fd.append("profilePhoto",  profilePhoto);
      if (passportPhoto) fd.append("passportPhoto", passportPhoto);
      fd.append("education", JSON.stringify(education));
      fd.append("experience", JSON.stringify(
        experience.map(exp => ({
          ...exp,
          skillsUsed: exp.skillsUsed
            ? exp.skillsUsed.split(",").map(s => s.trim()).filter(Boolean)
            : [],
        }))
      ));
      Object.entries(documents).forEach(([field, files]) => {
        Array.from(files).forEach(file => fd.append(field, file));
      });
      const res = await axios.post(`${EMPLOYEE_API_END_POINT}/register`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      showToast("success", res.data.message || "Employee registered successfully!");
      setForm(initialForm);
      setEducation([blankEdu()]); setExperience([blankExp()]);
      setProfilePhoto(null); setPassportPhoto(null);
      setDocuments({}); setErrors({}); setTouched({});
      setStep(0);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      showToast("error", msg);
      const lmsg = msg.toLowerCase();
      if (lmsg.includes("employee id")) {
        setErrors(p => ({ ...p, employeeId: "This Employee ID already exists" }));
        setTouched(p => ({ ...p, employeeId: true })); setStep(0);
      } else if (lmsg.includes("official email")) {
        setErrors(p => ({ ...p, officialEmail: "This official email already exists" }));
        setTouched(p => ({ ...p, officialEmail: true })); setStep(1);
      } else if (lmsg.includes("personal email")) {
        setErrors(p => ({ ...p, personalEmail: "This personal email already exists" }));
        setTouched(p => ({ ...p, personalEmail: true })); setStep(1);
      }
    } finally { setLoading(false); }
  };

  const isLastStep  = step === STEPS.length - 1;
  const totalErrors = Object.values(errors).filter(Boolean).length;
  // shared props bundle for FormInput / FormSelect
  const fp = { form, errors, touched, onChange: handleChange, onBlur: handleBlur };

  // ─────────────────────────────────────────────────────────
  // STEP CONTENT
  // ─────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {

      // ── 0 Personal ────────────────────────────────────────
      case 0: return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* employeeId: alphanumeric + hyphen + underscore, 2–20 */}
          <FormInput {...fp} name="employeeId" label="Employee ID" required
            placeholder="EMP-001" onKeyDown={onlyAlphaNum} />

          {/* names: letters + spaces only */}
          <FormInput {...fp} name="firstName" label="First Name" required
            placeholder="Arjun" onKeyDown={onlyLetters} />
          <FormInput {...fp} name="middleName" label="Middle Name"
            placeholder="Kumar" onKeyDown={onlyLetters} />
          <FormInput {...fp} name="lastName" label="Last Name" required
            placeholder="Sharma" onKeyDown={onlyLetters} />

          {/* gender: enum — Male | Female | Other */}
          <FormSelect {...fp} name="gender" label="Gender" required>
            <option value="">Select gender</option>
            {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
          </FormSelect>

          <FormInput {...fp} name="dateOfBirth" label="Date of Birth" required type="date" />

          {/* maritalStatus: enum — Single | Married | Divorced | Widowed */}
          <FormSelect {...fp} name="maritalStatus" label="Marital Status" required>
            <option value="">Select marital status</option>
            {MARITAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </FormSelect>

          {/* bloodGroup: enum — A+ A- B+ B- AB+ AB- O+ O- */}
          <FormSelect {...fp} name="bloodGroup" label="Blood Group" required>
            <option value="">Select blood group</option>
            {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
          </FormSelect>

          <FormInput {...fp} name="nationality" label="Nationality"
            placeholder="Indian" onKeyDown={onlyLetters} />

          <div className="md:col-span-3">
            <FileUploadBtn
              label="Profile Photo (image, optional)"
              hasFile={!!profilePhoto} fileName={profilePhoto?.name}
              inputProps={{ accept: "image/*", onChange: e => setProfilePhoto(e.target.files[0] || null) }}
            />
          </div>
        </div>
      );

      // ── 1 Contact ─────────────────────────────────────────
      case 1: return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormInput {...fp} name="personalEmail" label="Personal Email" required
              type="email" placeholder="arjun@gmail.com" maxLength={100} />
            <FormInput {...fp} name="officialEmail" label="Official Email" required
              type="email" placeholder="arjun@company.com" maxLength={100} />

            {/* mobile: digits only, max 10, must start 6–9 */}
            <FormInput {...fp} name="mobileNumber" label="Mobile Number" required
              placeholder="9876543210" onKeyDown={onlyDigits} maxLength={10} />
            <FormInput {...fp} name="alternateMobileNumber" label="Alternate Mobile"
              placeholder="9876543210 (optional)" onKeyDown={onlyDigits} maxLength={10} />

            <FormInput {...fp} name="emergencyContactName" label="Emergency Contact Name"
              placeholder="Rahul Sharma (optional)" onKeyDown={onlyLetters} maxLength={80} />
            <FormInput {...fp} name="emergencyContactNumber" label="Emergency Contact Number"
              placeholder="9876543210 (optional)" onKeyDown={onlyDigits} maxLength={10} />

            <FormInput {...fp} name="city"    label="City"     placeholder="Bhubaneswar" maxLength={60} />
            <FormInput {...fp} name="state"   label="State"    placeholder="Odisha" maxLength={60} />
            <FormInput {...fp} name="country" label="Country"  placeholder="India" maxLength={60} />
            <FormInput {...fp} name="zipCode" label="Zip Code" placeholder="751001"
              onKeyDown={onlyDigits} maxLength={10} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormTextarea {...fp} name="currentAddress"   label="Current Address"
              placeholder="Flat 4B, MG Road, Bhubaneswar…" maxLength={300} />
            <FormTextarea {...fp} name="permanentAddress" label="Permanent Address"
              placeholder="Village/Town, District…" maxLength={300} />
          </div>
        </div>
      );

      // ── 2 Job ─────────────────────────────────────────────
      case 2: return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* department: exact enum from jobInformation.model.js */}
          <FormSelect {...fp} name="department" label="Department" required>
            <option value="">Select department</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </FormSelect>

          <FormInput {...fp} name="designation" label="Designation" required
            placeholder="Software Engineer" maxLength={80} />

          {/* employeeType: "Full Time"|"Part Time"|"Intern"|"Contract" — spaces not hyphens */}
          <FormSelect {...fp} name="employeeType" label="Employee Type" required>
            <option value="">Select type</option>
            {EMPLOYEE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </FormSelect>

          <FormInput {...fp} name="workLocation" label="Work Location"
            placeholder="Bhubaneswar HQ" maxLength={100} />
          <FormInput {...fp} name="joiningDate"      label="Joining Date"       required type="date" />
          <FormInput {...fp} name="probationEndDate" label="Probation End Date" type="date" />
          <FormInput {...fp} name="shiftTiming"      label="Shift Timing"
            placeholder="9 AM – 6 PM" maxLength={40} />

          {/* workMode: "Remote"|"Hybrid"|"Office" — NOT "Onsite" */}
          <FormSelect {...fp} name="workMode" label="Work Mode" required>
            <option value="">Select work mode</option>
            {WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}
          </FormSelect>

          {/* employmentStatus: "Active"|"Notice Period"|"Resigned"|"Terminated" */}
          <FormSelect {...fp} name="employmentStatus" label="Employment Status" required>
            <option value="">Select employment status</option>
            {EMPLOYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </FormSelect>
        </div>
      );

      // ── 3 Payroll ─────────────────────────────────────────
      case 3: return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* salary: digits only */}
          <FormInput {...fp} name="salary" label="Salary (₹)" type="number"
            placeholder="50000" onKeyDown={onlyDigits} maxLength={10} />

          <FormInput {...fp} name="bankName" label="Bank Name"
            placeholder="HDFC Bank" maxLength={80} />

          {/* accountNumber: 9–18 digits */}
          <FormInput {...fp} name="accountNumber" label="Account Number"
            placeholder="00001234567890" onKeyDown={onlyDigits} maxLength={18} />

          {/* IFSC: auto-uppercase, exactly 11 chars */}
          <FormInput
            name="ifscCode" label="IFSC Code"
            placeholder="HDFC0001234"
            form={form} errors={errors} touched={touched}
            onChange={handleUpperChange}
            onBlur={handleUpperBlur}
            onKeyDown={onlyUpperAlphaNum}
            maxLength={11}
          />

          {/* PAN: auto-uppercase, exactly 10 chars */}
          <FormInput
            name="panNumber" label="PAN Number"
            placeholder="ABCDE1234F"
            form={form} errors={errors} touched={touched}
            onChange={handleUpperChange}
            onBlur={handleUpperBlur}
            onKeyDown={onlyUpperAlphaNum}
            maxLength={10}
          />
        </div>
      );

      // ── 4 Education (all optional) ────────────────────────
      case 4: return (
        <div className="space-y-4">
          {education.map((edu, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span>
                  Education Record
                </span>
                {education.length > 1 && (
                  <button type="button"
                    onClick={() => setEducation(education.filter((_, idx) => idx !== i))}
                    className="text-xs text-rose-500 hover:text-rose-700 border border-rose-200 hover:border-rose-400 px-2.5 py-1 rounded-lg transition-colors">
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  ["qualification",  "Qualification",      "B.Tech, MCA…",      80,  null],
                  ["university",     "University / Board", "BPUT, CBSE…",       120, null],
                  ["passingYear",    "Passing Year",       "2022",              4,   onlyDigits],
                  ["percentage",     "Percentage / CGPA",  "85% / 8.5",        10,  null],
                  ["specialization", "Specialization",     "Computer Science",  80,  null],
                ].map(([k, lbl, ph, ml, kd]) => (
                  <FieldWrapper key={k} label={lbl}>
                    <input value={edu[k]} onChange={e => updateEdu(i, k, e.target.value)}
                      placeholder={ph} maxLength={ml} onKeyDown={kd || undefined}
                      className={cls(inputBase, stateOk)} />
                  </FieldWrapper>
                ))}
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setEducation([...education, blankEdu()])}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-4 py-2 rounded-lg transition-colors">
            <span className="text-lg leading-none">+</span> Add Education
          </button>
        </div>
      );

      // ── 5 Experience (all optional) ───────────────────────
      case 5: return (
        <div className="space-y-4">
          {experience.map((exp, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span>
                  Work Experience
                </span>
                {experience.length > 1 && (
                  <button type="button"
                    onClick={() => setExperience(experience.filter((_, idx) => idx !== i))}
                    className="text-xs text-rose-500 hover:text-rose-700 border border-rose-200 hover:border-rose-400 px-2.5 py-1 rounded-lg transition-colors">
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  ["companyName",     "Company Name",                  "Infosys Ltd",          100],
                  ["designation",     "Designation",                   "Software Engineer",    80 ],
                  ["totalExperience", "Total Experience",              "2 years 3 months",     40 ],
                  ["skillsUsed",      "Skills (comma-separated)",      "React, Node.js",       200],
                ].map(([k, lbl, ph, ml]) => (
                  <FieldWrapper key={k} label={lbl}>
                    <input value={exp[k]} onChange={e => updateExp(i, k, e.target.value)}
                      placeholder={ph} maxLength={ml}
                      className={cls(inputBase, stateOk)} />
                  </FieldWrapper>
                ))}
                <FieldWrapper label="Start Date">
                  <input type="date" value={exp.startDate} onChange={e => updateExp(i, "startDate", e.target.value)}
                    className={cls(inputBase, stateOk)} />
                </FieldWrapper>
                <FieldWrapper label="End Date">
                  <input type="date" value={exp.endDate} onChange={e => updateExp(i, "endDate", e.target.value)}
                    className={cls(inputBase, stateOk)} />
                </FieldWrapper>
                <FieldWrapper label="Reason for Leaving" className="md:col-span-3">
                  <input value={exp.reasonForLeaving} onChange={e => updateExp(i, "reasonForLeaving", e.target.value)}
                    placeholder="Better opportunity" maxLength={200}
                    className={cls(inputBase, stateOk)} />
                </FieldWrapper>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setExperience([...experience, blankExp()])}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-4 py-2 rounded-lg transition-colors">
            <span className="text-lg leading-none">+</span> Add Experience
          </button>
        </div>
      );

      // ── 6 Documents ───────────────────────────────────────
      // All fieldName values match document.model.js enum exactly
      case 6: return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* passportPhoto: image → Cloudinary (handled separately in controller) */}
            <FileUploadBtn
              label="Passport Photo (image)"
              hasFile={!!passportPhoto} fileName={passportPhoto?.name}
              inputProps={{ accept: "image/*", onChange: e => setPassportPhoto(e.target.files[0] || null) }}
            />
            {DOC_FIELDS.map(([name, label, multiple]) => (
              <FileUploadBtn key={name} label={label}
                hasFile={!!documents[name]?.length}
                fileName={documents[name]?.length ? `${documents[name].length} file(s) selected` : null}
                inputProps={{ name, multiple, onChange: handleDocChange }}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            📌 PDFs are stored in the database · Images are uploaded to Cloudinary
          </p>
        </div>
      );

      // ── 7 Access ──────────────────────────────────────────
      case 7: return (
        <div className="max-w-md space-y-5">
          {/* password: minlength 6 (employee.model.js) */}
          <PasswordInput
            name="password" label="Password" required placeholder="Min. 6 characters"
            form={form} errors={errors} touched={touched}
            onChange={handleChange} onBlur={handleBlur}
            showPass={showPass} onToggleShow={() => setShowPass(p => !p)}
          />
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <p className="font-semibold text-indigo-800 mb-1 text-sm">🔐 Login credentials</p>
            <p className="text-indigo-700 text-xs leading-relaxed">
              The employee signs in with their <strong>official email</strong> and this password.
              Share credentials securely. Minimum <strong>6 characters</strong>.
            </p>
          </div>
          {/* Health summary of required steps */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wider">Completion Summary</p>
            <div className="grid grid-cols-2 gap-2">
              {STEPS.slice(0, 4).map((s, i) => {
                const done   = stepIsDone(i);
                const hasErr = stepHasError(i);
                return (
                  <div key={s.id} onClick={() => setStep(i)}
                    className={cls(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors",
                      done    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : hasErr ? "bg-rose-50 text-rose-700 border border-rose-200"
                               : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                    )}>
                    {done ? "✅" : hasErr ? "❌" : "⏳"} {s.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );

      default: return null;
    }
  };

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30" ref={topRef}>

      {toast && (
        <div className={cls(
          "fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-medium max-w-sm",
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
        )}>
          <span className="text-lg">{toast.type === "success" ? "✅" : "❌"}</span>
          <span>{toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-auto opacity-70 hover:opacity-100 text-xl leading-none">×</button>
        </div>
      )}

      {/* Sticky header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Register New Employee</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Step {step + 1} of {STEPS.length} —{" "}
              <span className="font-semibold text-indigo-600">{STEPS[step].label}</span>
              {" · "}{STEPS[step].desc}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            {STEPS.map((s, i) => {
              const done = stepIsDone(i), err = stepHasError(i), active = i === step;
              return (
                <button key={s.id} type="button" onClick={() => goToStep(i)} title={s.label}
                  className={cls(
                    "transition-all rounded-full flex items-center justify-center text-xs font-bold",
                    active ? "w-8 h-8 bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : done  ? "w-7 h-7 bg-emerald-500 text-white"
                    : err   ? "w-7 h-7 bg-rose-500 text-white"
                             : "w-7 h-7 bg-slate-200 text-slate-500 hover:bg-slate-300"
                  )}>
                  {active ? step + 1 : done ? "✓" : err ? "!" : i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step tabs */}
        <div className="max-w-6xl mx-auto px-6 pb-3">
          <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {STEPS.map((s, i) => {
              const done = stepIsDone(i), err = stepHasError(i), active = i === step;
              return (
                <button key={s.id} type="button" onClick={() => goToStep(i)}
                  className={cls(
                    "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                    active ? "bg-indigo-600 text-white shadow-sm"
                    : done  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : err   ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                             : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  )}>
                  {s.icon} {s.label}
                  {done && !active && <span className="text-emerald-500 ml-0.5">✓</span>}
                  {err  && !active && <span className="text-rose-500 ml-0.5">!</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 min-h-[440px]">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
            <span className="text-2xl">{STEPS[step].icon}</span>
            <div>
              <h2 className="text-base font-bold text-slate-800">{STEPS[step].label} Information</h2>
              <p className="text-xs text-slate-500">{STEPS[step].desc}</p>
            </div>
            {totalErrors > 0 && (
              <div className="ml-auto flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium px-3 py-1.5 rounded-lg">
                ⚠️ {totalErrors} error{totalErrors > 1 ? "s" : ""} found
              </div>
            )}
          </div>
          {renderStep()}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button type="button" onClick={goBack} disabled={step === 0}
            className={cls(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              step === 0 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}>
            ← Back
          </button>
          <span className="hidden md:block text-xs text-slate-400 truncate">
            {STEPS.slice(0, step + 1).map(s => s.label).join(" › ")}
          </span>
          {isLastStep ? (
            <button type="button" onClick={handleSubmit} disabled={loading}
              className={cls(
                "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-sm",
                loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
              )}>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Registering…
                </>
              ) : "Register Employee ✓"}
            </button>
          ) : (
            <button type="button" onClick={goNext}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-indigo-200">
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}