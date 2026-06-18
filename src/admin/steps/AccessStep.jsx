// steps/AccessStep.jsx
import { PasswordInput } from "../components/FormComponents";

export default function AccessStep({ form, errors, touched, handleChange, handleBlur, showPassword, setShowPassword }) {
  return (
    <div className="max-w-md space-y-5">
      <PasswordInput
        name="password"
        label="Password"
        required
        placeholder="Min. 6 characters"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <p className="font-semibold text-indigo-800 mb-1 text-sm">🔐 Login credentials</p>
        <p className="text-indigo-700 text-xs leading-relaxed">
          The employee signs in with their <strong>official email</strong> and this password.
          Share credentials securely. Minimum <strong>6 characters</strong>.
        </p>
      </div>
    </div>
  );
}