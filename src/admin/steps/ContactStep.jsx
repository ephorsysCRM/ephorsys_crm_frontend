// steps/ContactStep.jsx
import { FormInput, FormTextarea } from "../components/FormComponents";

export default function ContactStep({ form, errors, touched, handleChange, handleBlur }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FormInput
          name="personalEmail"
          label="Personal Email"
          required
          type="email"
          placeholder="arjun@gmail.com"
          form={form} errors={errors} touched={touched}
          onChange={handleChange} onBlur={handleBlur}
        />

        <FormInput
          name="officialEmail"
          label="Official Email"
          required
          type="email"
          placeholder="arjun@company.com"
          form={form} errors={errors} touched={touched}
          onChange={handleChange} onBlur={handleBlur}
        />

        <FormInput
          name="mobileNumber"
          label="Mobile Number"
          required
          placeholder="9876543210"
          form={form} errors={errors} touched={touched}
          onChange={handleChange} onBlur={handleBlur}
          onlyDigits
          maxLength={10}
        />

        <FormInput
          name="alternateMobileNumber"
          label="Alternate Mobile"
          placeholder="9876543210 (optional)"
          form={form} errors={errors} touched={touched}
          onChange={handleChange} onBlur={handleBlur}
          onlyDigits
          maxLength={10}
        />

        <FormInput
          name="emergencyContactName"
          label="Emergency Contact Name"
          placeholder="Rahul Sharma (optional)"
          form={form} errors={errors} touched={touched}
          onChange={handleChange} onBlur={handleBlur}
          onlyLetters
        />

        <FormInput
          name="emergencyContactNumber"
          label="Emergency Contact Number"
          placeholder="9876543210 (optional)"
          form={form} errors={errors} touched={touched}
          onChange={handleChange} onBlur={handleBlur}
          onlyDigits
          maxLength={10}
        />

        <FormInput
          name="city"
          label="City"
          placeholder="Bhubaneswar"
          form={form} errors={errors} touched={touched}
          onChange={handleChange} onBlur={handleBlur}
        />

        <FormInput
          name="state"
          label="State"
          placeholder="Odisha"
          form={form} errors={errors} touched={touched}
          onChange={handleChange} onBlur={handleBlur}
        />

        <FormInput
          name="country"
          label="Country"
          placeholder="India"
          form={form} errors={errors} touched={touched}
          onChange={handleChange} onBlur={handleBlur}
        />

        <FormInput
          name="zipCode"
          label="Zip Code"
          placeholder="751001"
          form={form} errors={errors} touched={touched}
          onChange={handleChange} onBlur={handleBlur}
          onlyDigits
          maxLength={10}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormTextarea
          name="currentAddress"
          label="Current Address"
          placeholder="Flat 4B, MG Road, Bhubaneswar…"
          form={form} onChange={handleChange}
        />

        <FormTextarea
          name="permanentAddress"
          label="Permanent Address"
          placeholder="Village/Town, District…"
          form={form} onChange={handleChange}
        />
      </div>
    </div>
  );
}