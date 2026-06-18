// steps/JobStep.jsx
import { DEPARTMENTS, EMPLOYEE_TYPES, WORK_MODES, EMPLOYMENT_STATUSES } from "../pages/AdminRegister";
import { FormInput, FormSelect } from "../components/FormComponents";

export default function JobStep({ form, errors, touched, handleChange, handleBlur }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <FormSelect
        name="department"
        label="Department"
        required
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        options={DEPARTMENTS}
        placeholder="Select department"
      />

      <FormInput
        name="designation"
        label="Designation"
        required
        placeholder="Software Engineer"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
      />

      <FormSelect
        name="employeeType"
        label="Employee Type"
        required
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        options={EMPLOYEE_TYPES}
        placeholder="Select type"
      />

      <FormInput
        name="workLocation"
        label="Work Location"
        placeholder="Bhubaneswar HQ"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
      />

      <FormInput
        name="joiningDate"
        label="Joining Date"
        required
        type="date"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
      />

      <FormInput
        name="probationEndDate"
        label="Probation End Date"
        type="date"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
      />

      <FormInput
        name="shiftTiming"
        label="Shift Timing"
        placeholder="9 AM – 6 PM"
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
      />

      <FormSelect
        name="workMode"
        label="Work Mode"
        required
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        options={WORK_MODES}
        placeholder="Select work mode"
      />

      <FormSelect
        name="employmentStatus"
        label="Employment Status"
        required
        form={form} errors={errors} touched={touched}
        onChange={handleChange} onBlur={handleBlur}
        options={EMPLOYMENT_STATUSES}
        placeholder="Select status"
      />
    </div>
  );
}