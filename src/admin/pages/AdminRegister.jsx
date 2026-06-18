// AdminRegister.jsx
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { registerEmployee } from "../../redux/features/employeeSlice";
import Stepper from "../../components/ui/CustomStepper";
import PersonalStep from "../steps/PersonalStep";
import ContactStep from "../steps/ContactStep";
import JobStep from "../steps/JobStep";
import PayrollStep from "../steps/PayrollStep";
import EducationStep from "../steps/EducationStep";
import ExperienceStep from "../steps/ExperienceStep";
import DocumentsStep from "../steps/DocumentsStep";
import AccessStep from "../steps/AccessStep";

// Import step components


// ─────────────────────────────────────────────────────────────
// CONSTANTS & CONFIG
// ─────────────────────────────────────────────────────────────

const STEPS = [
  { id: "personal", label: "Personal", icon: "👤", desc: "Basic identity info" },
  { id: "contact", label: "Contact", icon: "📞", desc: "Address & emergency" },
  { id: "job", label: "Job", icon: "💼", desc: "Role & employment" },
  { id: "payroll", label: "Payroll", icon: "🏦", desc: "Salary & banking" },
  { id: "education", label: "Education", icon: "🎓", desc: "Academic history" },
  { id: "experience", label: "Experience", icon: "🏢", desc: "Work history" },
  { id: "documents", label: "Documents", icon: "📁", desc: "Upload files" },
  { id: "access", label: "Access", icon: "🔐", desc: "Login credentials" },
];

const STEP_NAMES = STEPS.map(s => s.label);

// ─────────────────────────────────────────────────────────────
// ENUMS (from backend)
// ─────────────────────────────────────────────────────────────

export const GENDERS = ["Male", "Female", "Other"];
export const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];
export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const DEPARTMENTS = [
  "Software Development",
  "Human Resources",
  "Sales",
  "Marketing",
  "Business Development Executive",
  "UI / UX Designer",
  "Others",
];
export const EMPLOYEE_TYPES = ["Full Time", "Part Time", "Intern", "Contract"];
export const WORK_MODES = ["Remote", "Hybrid", "Office"];
export const EMPLOYMENT_STATUSES = ["Active", "Notice Period", "Resigned", "Terminated"];
export const DOC_FIELDS = [
  ["aadhaarCard", "Aadhaar Card", false],
  ["panCard", "PAN Card", false],
  ["resume", "Resume", false],
  ["offerLetter", "Offer Letter", false],
  ["experienceLetter", "Experience Letter", true],
  ["educationCertificates", "Education Certificates", true],
  ["signedNDA", "Signed NDA (optional)", false],
  ["otherDocuments", "Other Documents (optional)", true],
];

// ─────────────────────────────────────────────────────────────
// STEP VALIDATION FIELDS
// ─────────────────────────────────────────────────────────────

const STEP_FIELDS = [
  ["employeeId", "firstName", "lastName", "gender", "dateOfBirth", "maritalStatus", "bloodGroup"],
  ["personalEmail", "officialEmail", "mobileNumber", "alternateMobileNumber", "emergencyContactNumber"],
  ["department", "designation", "employeeType", "joiningDate", "workMode", "employmentStatus"],
  ["salary", "accountNumber", "ifscCode", "panNumber"],
  [],
  [],
  [],
  ["password"],
];

// ─────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────

const initialForm = {
  employeeId: "", firstName: "", middleName: "", lastName: "",
  gender: "", dateOfBirth: "", maritalStatus: "", bloodGroup: "", nationality: "",
  personalEmail: "", officialEmail: "", mobileNumber: "", alternateMobileNumber: "",
  emergencyContactName: "", emergencyContactNumber: "",
  currentAddress: "", permanentAddress: "", city: "", state: "", country: "", zipCode: "",
  department: "", designation: "", employeeType: "", workLocation: "",
  joiningDate: "", probationEndDate: "", shiftTiming: "", workMode: "", employmentStatus: "",
  salary: "", bankName: "", accountNumber: "", ifscCode: "", panNumber: "",
  password: "",
};

const blankEdu = () => ({
  qualification: "", university: "", passingYear: "", percentage: "", specialization: ""
});

const blankExp = () => ({
  companyName: "", designation: "", startDate: "", endDate: "",
  totalExperience: "", skillsUsed: "", reasonForLeaving: ""
});

// ─────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────

const VALIDATORS = {
  employeeId: { required: true, pattern: /^[A-Za-z0-9\ /-_]{2,20}$/, msg: "2–20 alphanumeric" },
  firstName: { required: true, pattern: /^[A-Za-z\s]{2,50}$/, msg: "2–50 letters only" },
  middleName: { required: false, pattern: /^[A-Za-z\s]{0,50}$/, msg: "Letters only" },
  lastName: { required: true, pattern: /^[A-Za-z\s]{2,50}$/, msg: "2–50 letters only" },
  gender: { required: true, msg: "Select a gender" },
  dateOfBirth: { required: true, msg: "Date of birth is required" },
  maritalStatus: { required: true, msg: "Select a marital status" },
  bloodGroup: { required: true, msg: "Select a blood group" },
  personalEmail: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: "Enter a valid email" },
  officialEmail: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: "Enter a valid email" },
  mobileNumber: { required: true, pattern: /^[6-9]\d{9}$/, msg: "10 digits starting 6-9" },
  alternateMobileNumber: { required: false, pattern: /^([6-9]\d{9})?$/, msg: "10 digits starting 6-9" },
  emergencyContactNumber: { required: false, pattern: /^([6-9]\d{9})?$/, msg: "10 digits starting 6-9" },
  department: { required: true, msg: "Select a department" },
  designation: { required: true, pattern: /^.{2,80}$/, msg: "2–80 characters" },
  employeeType: { required: true, msg: "Select employee type" },
  joiningDate: { required: true, msg: "Joining date is required" },
  workMode: { required: true, msg: "Select a work mode" },
  employmentStatus: { required: true, msg: "Select employment status" },
  salary: { required: false, pattern: /^(\d{1,10})?$/, msg: "Numbers only" },
  accountNumber: { required: false, pattern: /^(\d{9,18})?$/, msg: "9–18 digits" },
  ifscCode: { required: false, pattern: /^([A-Z]{4}0[A-Z0-9]{6})?$/, msg: "e.g. HDFC0001234" },
  panNumber: { required: false, pattern: /^([A-Z]{5}[0-9]{4}[A-Z])?$/, msg: "ABCDE1234F format" },
  password: { required: true, pattern: /^.{6,}$/, msg: "Minimum 6 characters" },
};

export const FIELD_LABELS = {
  employeeId: "Employee ID", firstName: "First name", middleName: "Middle name",
  lastName: "Last name", gender: "Gender", dateOfBirth: "Date of birth",
  maritalStatus: "Marital status", bloodGroup: "Blood group",
  personalEmail: "Personal email", officialEmail: "Official email",
  mobileNumber: "Mobile number", alternateMobileNumber: "Alternate mobile",
  emergencyContactNumber: "Emergency contact", department: "Department",
  designation: "Designation", employeeType: "Employee type",
  joiningDate: "Joining date", workMode: "Work mode",
  employmentStatus: "Employment status", salary: "Salary",
  accountNumber: "Account number", ifscCode: "IFSC code",
  panNumber: "PAN number", password: "Password",
};

export const validateField = (name, value) => {
  const rule = VALIDATORS[name];
  if (!rule) return null;
  const v = value?.toString().trim() ?? "";
  if (rule.required && !v) return `${FIELD_LABELS[name] || name} is required`;
  if (rule.pattern && v && !rule.pattern.test(v)) return rule.msg;
  return null;
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function AdminRegister() {
  const dispatch = useDispatch();
  const topRef = useRef(null);

  // State
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [education, setEducation] = useState([blankEdu()]);
  const [experience, setExperience] = useState([blankExp()]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // ── Handlers ──────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleUpperChange = (e) => {
    handleChange({ target: { name: e.target.name, value: e.target.value.toUpperCase() } });
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  // ── Navigation ─────────────────────────────────────────────

  const validateStep = (stepIndex) => {
    const fields = STEP_FIELDS[stepIndex];
    const newErrors = {};
    const newTouched = {};

    fields.forEach(field => {
      newTouched[field] = true;
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });

    setTouched(prev => ({ ...prev, ...newTouched }));
    setErrors(prev => ({ ...prev, ...newErrors }));

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1));
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(0, prev - 1));
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStepClick = (index) => {
    if (index <= activeStep) {
      setActiveStep(index);
    } else if (index === activeStep + 1 && validateStep(activeStep)) {
      setActiveStep(index);
    }
  };

  // ── Submit ──────────────────────────────────────────────────

  const handleSubmit = async () => {
    // Validate all required fields
    const allErrors = {};
    const allTouched = {};

    Object.keys(VALIDATORS).forEach(field => {
      if (!VALIDATORS[field].required) return;
      allTouched[field] = true;
      const error = validateField(field, form[field]);
      if (error) allErrors[field] = error;
    });

    if (Object.keys(allErrors).length) {
      setTouched(prev => ({ ...prev, ...allTouched }));
      setErrors(prev => ({ ...prev, ...allErrors }));
      showToast("error", "Please fix all required fields before submitting.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      const enumFields = new Set(["gender", "maritalStatus", "bloodGroup", "employeeType", "workMode", "employmentStatus"]);

      Object.entries(form).forEach(([key, value]) => {
        if (enumFields.has(key) && !value) return;
        formData.append(key, value);
      });

      if (profilePhoto) formData.append("profilePhoto", profilePhoto);
      if (passportPhoto) formData.append("passportPhoto", passportPhoto);

      formData.append("education", JSON.stringify(education));
      formData.append("experience", JSON.stringify(
        experience.map(exp => ({
          ...exp,
          skillsUsed: exp.skillsUsed ? exp.skillsUsed.split(",").map(s => s.trim()).filter(Boolean) : []
        }))
      ));

      Object.entries(documents).forEach(([field, files]) => {
        Array.from(files).forEach(file => formData.append(field, file));
      });

      await dispatch(registerEmployee(formData)).unwrap();

      showToast("success", "Employee registered successfully!");

      // Reset form
      setForm(initialForm);
      setEducation([blankEdu()]);
      setExperience([blankExp()]);
      setProfilePhoto(null);
      setPassportPhoto(null);
      setDocuments({});
      setErrors({});
      setTouched({});
      setActiveStep(0);

    } catch (error) {
      const msg = error?.message || "Registration failed. Please try again.";
      showToast("error", msg);

      // Map backend errors to fields
      const errorMap = {
        "employee id": { field: "employeeId", step: 0 },
        "official email": { field: "officialEmail", step: 1 },
        "personal email": { field: "personalEmail", step: 1 },
      };

      const lowerMsg = msg.toLowerCase();
      for (const [key, { field, step }] of Object.entries(errorMap)) {
        if (lowerMsg.includes(key)) {
          setErrors(prev => ({ ...prev, [field]: `This ${field} already exists` }));
          setTouched(prev => ({ ...prev, [field]: true }));
          setActiveStep(step);
          break;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Render Helpers ────────────────────────────────────────

  const stepProps = {
    form,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleUpperChange,
    education,
    setEducation,
    experience,
    setExperience,
    profilePhoto,
    setProfilePhoto,
    passportPhoto,
    setPassportPhoto,
    documents,
    setDocuments,
    showPassword,
    setShowPassword,
    blankEdu,
    blankExp,
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0: return <PersonalStep {...stepProps} />;
      case 1: return <ContactStep {...stepProps} />;
      case 2: return <JobStep {...stepProps} />;
      case 3: return <PayrollStep {...stepProps} />;
      case 4: return <EducationStep {...stepProps} />;
      case 5: return <ExperienceStep {...stepProps} />;
      case 6: return <DocumentsStep {...stepProps} />;
      case 7: return <AccessStep {...stepProps} />;
      default: return null;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  return (
    <div className="" ref={topRef}>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-medium max-w-sm ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
          }`}>
          <span className="text-lg">{toast.type === "success" ? "✅" : "❌"}</span>
          <span>{toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-auto opacity-70 hover:opacity-100 text-xl leading-none">
            ×
          </button>
        </div>
      )}

      {/* Stepper */}
      <div className="mx-auto">
        <Stepper
          steps={STEP_NAMES}
          activeStep={activeStep}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Form Content */}
      <div className=" mx-auto pb-24">
        <div className=" border border-slate-200 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
            <span className="text-2xl">{STEPS[activeStep].icon}</span>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                {STEPS[activeStep].label} Information
              </h2>
              <p className="text-xs text-slate-500">{STEPS[activeStep].desc}</p>
            </div>
          </div>

          {renderStep()}
        </div>
      </div>

      {/* Footer Navigation */}
     <div className="border-t border-slate-200 pt-4 ">
  <div className="flex items-center justify-between">
    <button
      onClick={handleBack}
      disabled={activeStep === 0}
      className={`flex items-center gap-1.5 px-3 py-2z rounded-lg text-xs font-medium transition-all ${
        activeStep === 0
          ? "text-slate-300 cursor-not-allowed"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      ← Back
    </button>

    <div className="hidden lg:flex items-center gap-1 text-xs text-slate-400">
      <span>
        Step {activeStep + 1} of {STEPS.length}
      </span>
    </div>

    {activeStep === STEPS.length - 1 ? (
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all ${
          loading
            ? "bg-green-400 cursor-not-allowed"
            : "bg-[#74c316] hover:bg-[#67af14] shadow-sm"
        }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Saving...
          </>
        ) : (
          <>
            Register
            <span>✓</span>
          </>
        )}
      </button>
    ) : (
      <button
        onClick={handleNext}
        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm"
      >
        Next →
      </button>
    )}
  </div>
</div>
    </div>
  );
}