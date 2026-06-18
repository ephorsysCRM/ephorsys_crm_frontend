// steps/PayrollStep.jsx
import { FormInput } from "../components/FormComponents";

export default function PayrollStep({ form, errors, touched, handleChange, handleBlur, handleUpperChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <FormInput
        name="salary"
        label="Salary (₹)"
        type="number"
        placeholder="50000"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        onlyDigits
        maxLength={10}
      />

      <FormInput
        name="bankName"
        label="Bank Name"
        placeholder="HDFC Bank"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
      />

      <FormInput
        name="accountNumber"
        label="Account Number"
        placeholder="00001234567890"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        onlyDigits
        maxLength={18}
      />

      <FormInput
        name="ifscCode"
        label="IFSC Code"
        placeholder="HDFC0001234"
        form={form} errors={errors} touched={touched}
        onChange={handleUpperChange}
        onBlur={handleBlur}
        onlyUpperAlphaNum
        maxLength={11}
      />

      <FormInput
        name="panNumber"
        label="PAN Number"
        placeholder="ABCDE1234F"
        form={form} errors={errors} touched={touched}
        onChange={handleUpperChange}
        onBlur={handleBlur}
        onlyUpperAlphaNum
        maxLength={10}
      />
    </div>
  );
}