// steps/PersonalStep.jsx
import { GENDERS, MARITAL_STATUSES, BLOOD_GROUPS } from "../pages/AdminRegister";
import { FormInput, FormSelect, FileUpload } from "../components/FormComponents";

export default function PersonalStep({ form, errors, touched, handleChange, handleBlur, profilePhoto, setProfilePhoto }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <FormInput
        name="employeeId"
        label="Employee ID"
        required
        placeholder="EMP-001"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        onlyAlphaNum
      />

      <FormInput
        name="firstName"
        label="First Name"
        required
        placeholder="Arjun"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        onlyLetters
      />

      <FormInput
        name="middleName"
        label="Middle Name"
        placeholder="Kumar"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        onlyLetters
      />

      <FormInput
        name="lastName"
        label="Last Name"
        required
        placeholder="Sharma"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        onlyLetters
      />

      <FormSelect
        name="gender"
        label="Gender"
        required
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        options={GENDERS}
        placeholder="Select gender"
      />

      <FormInput
        name="dateOfBirth"
        label="Date of Birth"
        required
        type="date"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
      />

      <FormSelect
        name="maritalStatus"
        label="Marital Status"
        required
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        options={MARITAL_STATUSES}
        placeholder="Select marital status"
      />

      <FormSelect
        name="bloodGroup"
        label="Blood Group"
        required
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        options={BLOOD_GROUPS}
        placeholder="Select blood group"
      />

      <FormInput
        name="nationality"
        label="Nationality"
        placeholder="Indian"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        onlyLetters
      />

      <div className="md:col-span-3">
        <FileUpload
          label="Profile Photo (optional)"
          file={profilePhoto}
          setFile={setProfilePhoto}
          accept="image/*"
        />
      </div>
    </div>
  );
}