// components/FormComponents.jsx

import { cls } from "../../utils/helpers";

const inputBase = "w-full bg-slate-50 border rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:shadow-sm";
const stateOk = "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
const stateErr = "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 bg-rose-50/30";
const stateDone = "border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const getInputCls = (error, touched, value) => {
  if (error && touched) return cls(inputBase, stateErr);
  if (!error && touched && value) return cls(inputBase, stateDone);
  return cls(inputBase, stateOk);
};

// ── Key Press Handlers ──────────────────────────────────────

export const onlyDigits = (e) => {
  if (!/[\d\b]/.test(e.key) && !["ArrowLeft", "ArrowRight", "Delete", "Tab", "Backspace"].includes(e.key))
    e.preventDefault();
};

export const onlyLetters = (e) => {
  if (!/[A-Za-z\s\b]/.test(e.key) && !["ArrowLeft", "ArrowRight", "Delete", "Tab", "Backspace"].includes(e.key))
    e.preventDefault();
};

export const onlyAlphaNum = (e) => {
  if (
    !/[A-Za-z0-9/_-]/.test(e.key) &&
    !["ArrowLeft", "ArrowRight", "Delete", "Tab", "Backspace"].includes(e.key)
  ) {
    e.preventDefault();
  }
};

export const onlyUpperAlphaNum = (e) => {
  if (!/[A-Za-z0-9\b]/.test(e.key) && !["ArrowLeft", "ArrowRight", "Delete", "Tab", "Backspace"].includes(e.key))
    e.preventDefault();
};

// ── Field Components ────────────────────────────────────────

export const FieldWrapper = ({ label, required, error, touched, children, className = "" }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
      {label}
      {required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && touched && (
      <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.5 2.5a.5.5 0 011 0v3a.5.5 0 01-1 0v-3zm.5 5a.6.6 0 110-1.2.6.6 0 010 1.2z" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

export const FormInput = ({
  name, label, required, type = "text", placeholder = "", className = "",
  maxLength, onlyDigits: onlyDigitsProp, onlyLetters: onlyLettersProp,
  onlyAlphaNum: onlyAlphaNumProp, onlyUpperAlphaNum: onlyUpperAlphaNumProp,
  form, errors, touched, onChange, onBlur
}) => {
  const getKeyHandler = () => {
    if (onlyDigitsProp) return onlyDigits;
    if (onlyLettersProp) return onlyLetters;
    if (onlyAlphaNumProp) return onlyAlphaNum;
    if (onlyUpperAlphaNumProp) return onlyUpperAlphaNum;
    return undefined;
  };

  return (
    <FieldWrapper
      label={label}
      required={required}
      error={errors?.[name]}
      touched={touched?.[name]}
      className={className}
    >
      <input
        type={type}
        name={name}
        value={form?.[name] || ""}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={getKeyHandler()}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete="off"
        className={getInputCls(errors?.[name], touched?.[name], form?.[name])}
      />
    </FieldWrapper>
  );
};

export const FormSelect = ({
  name, label, required, className = "", options, placeholder = "Select an option",
  form, errors, touched, onChange, onBlur
}) => (
  <FieldWrapper
    label={label}
    required={required}
    error={errors?.[name]}
    touched={touched?.[name]}
    className={className}
  >
    <select
      name={name}
      value={form?.[name] || ""}
      onChange={onChange}
      onBlur={onBlur}
      className={getInputCls(errors?.[name], touched?.[name], form?.[name])}
    >
      <option value="">{placeholder}</option>
      {options?.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </FieldWrapper>
);

export const FormTextarea = ({
  name, label, placeholder = "", className = "", maxLength = 300,
  form, onChange
}) => (
  <FieldWrapper label={label} className={className}>
    <textarea
      name={name}
      value={form?.[name] || ""}
      onChange={onChange}
      rows={3}
      placeholder={placeholder}
      maxLength={maxLength}
      className={cls(inputBase, stateOk, "resize-none")}
    />
  </FieldWrapper>
);

export const FormField = ({
  label, value, onChange, placeholder = "", type = "text", maxLength,
  onlyDigits: onlyDigitsProp, className = ""
}) => {
  const getKeyHandler = () => {
    if (onlyDigitsProp) return onlyDigits;
    return undefined;
  };

  return (
    <FieldWrapper label={label} className={className}>
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        onKeyDown={getKeyHandler()}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cls(inputBase, stateOk)}
      />
    </FieldWrapper>
  );
};

export const PasswordInput = ({
  name, label, required, placeholder = "",
  form, errors, touched, onChange, onBlur,
  showPassword, setShowPassword
}) => (
  <FieldWrapper
    label={label}
    required={required}
    error={errors?.[name]}
    touched={touched?.[name]}
  >
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={form?.[name] || ""}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete="new-password"
        className={cls(getInputCls(errors?.[name], touched?.[name], form?.[name]), "pr-16")}
      />
      <button
        type="button"
        onClick={() => setShowPassword(prev => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-semibold"
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  </FieldWrapper>
);

export const FileUpload = ({
  label,
  file,
  setFile,
  accept = "*",
  multiple = false,
}) => (
  <FieldWrapper label={label}>
    <div className="flex items-center gap-4 " >
      <label className="relative cursor-pointer group">
        {file ? (
          <img
            src={URL.createObjectURL(file)}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 border-4 border-white shadow-md flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
        )}

        {/* Edit Button */}
        <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
          ✎
        </div>

        <input
          className="hidden"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            if (multiple) {
              setFile(e.target.files);
            } else {
              setFile(e.target.files[0] || null);
            }
          }}
        />
      </label>

      <div>
        <h4 className="text-sm font-semibold text-slate-800">
          Profile Photo
        </h4>
        <p className="text-xs text-slate-500">
          Upload JPG, PNG or WEBP
        </p>

        {file && (
          <p className="text-xs text-emerald-600 mt-1">
            ✓ Photo selected
          </p>
        )}
      </div>
    </div>
  </FieldWrapper>
);