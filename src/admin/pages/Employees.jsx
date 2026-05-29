import { useState } from "react";
import axios from "axios";
import { EMPLOYEE_API_END_POINT } from "../../utils/endpoints";



const initialForm = {
  employeeId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  maritalStatus: "",
  bloodGroup: "",
  nationality: "",
  personalEmail: "",
  officialEmail: "",
  mobileNumber: "",
  alternateMobileNumber: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  currentAddress: "",
  permanentAddress: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  department: "",
  designation: "",
  employeeType: "",
  workLocation: "",
  joiningDate: "",
  probationEndDate: "",
  shiftTiming: "",
  workMode: "",
  employmentStatus: "",
  salary: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  panNumber: "",
  password: "",
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      {...props}
      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      {...props}
      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
      {children}
    </select>
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      {...props}
      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  </div>
);

const Section = ({ title, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <h3 className="mb-5 text-lg font-semibold text-gray-900">{title}</h3>
    {children}
  </div>
);

export default function RegisterEmployee() {
  const [form, setForm] = useState(initialForm);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [documents, setDocuments] = useState({});

  const [education, setEducation] = useState([
    {
      qualification: "",
      university: "",
      passingYear: "",
      percentage: "",
      specialization: "",
    },
  ]);

  const [experience, setExperience] = useState([
    {
      companyName: "",
      designation: "",
      startDate: "",
      endDate: "",
      totalExperience: "",
      skillsUsed: "",
      reasonForLeaving: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDocumentChange = (e) => {
    setDocuments((prev) => ({
      ...prev,
      [e.target.name]: e.target.files,
    }));
  };

  const updateEducation = (index, field, value) => {
    const copy = [...education];
    copy[index][field] = value;
    setEducation(copy);
  };

  const updateExperience = (index, field, value) => {
    const copy = [...experience];
    copy[index][field] = value;
    setExperience(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      if (passportPhoto) {
        formData.append("passportPhoto", passportPhoto);
      }

      formData.append("education", JSON.stringify(education));

      formData.append(
        "experience",
        JSON.stringify(
          experience.map((exp) => ({
            ...exp,
            skillsUsed: exp.skillsUsed
              ? exp.skillsUsed.split(",").map((skill) => skill.trim())
              : [],
          }))
        )
      );

      Object.entries(documents).forEach(([fieldName, files]) => {
        Array.from(files).forEach((file) => {
          formData.append(fieldName, file);
        });
      });

      const res = await axios.post(`${EMPLOYEE_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setSuccess(res.data.message || "Employee registered successfully");
      setForm(initialForm);
      setEducation([
        {
          qualification: "",
          university: "",
          passingYear: "",
          percentage: "",
          specialization: "",
        },
      ]);
      setExperience([
        {
          companyName: "",
          designation: "",
          startDate: "",
          endDate: "",
          totalExperience: "",
          skillsUsed: "",
          reasonForLeaving: "",
        },
      ]);
      setProfilePhoto(null);
      setPassportPhoto(null);
      setDocuments({});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Register Employee
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Add employee personal, job, payroll, education, experience and
            document details.
          </p>
        </div>

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Section title="Personal Information">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Input label="Employee ID *" name="employeeId" value={form.employeeId} onChange={handleChange} required />
              <Input label="First Name *" name="firstName" value={form.firstName} onChange={handleChange} required />
              <Input label="Middle Name" name="middleName" value={form.middleName} onChange={handleChange} />
              <Input label="Last Name *" name="lastName" value={form.lastName} onChange={handleChange} required />

              <Select label="Gender *" name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>

              <Input label="Date of Birth *" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required />
              <Input label="Marital Status" name="maritalStatus" value={form.maritalStatus} onChange={handleChange} />
              <Input label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} />
              <Input label="Nationality" name="nationality" value={form.nationality} onChange={handleChange} />

              <Input label="Profile Photo" type="file" accept="image/*" onChange={(e) => setProfilePhoto(e.target.files[0])} />
            </div>
          </Section>

          <Section title="Contact Information">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Input label="Personal Email *" type="email" name="personalEmail" value={form.personalEmail} onChange={handleChange} required />
              <Input label="Official Email *" type="email" name="officialEmail" value={form.officialEmail} onChange={handleChange} required />
              <Input label="Mobile Number *" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required />
              <Input label="Alternate Mobile Number" name="alternateMobileNumber" value={form.alternateMobileNumber} onChange={handleChange} />
              <Input label="Emergency Contact Name" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} />
              <Input label="Emergency Contact Number" name="emergencyContactNumber" value={form.emergencyContactNumber} onChange={handleChange} />
              <Input label="City" name="city" value={form.city} onChange={handleChange} />
              <Input label="State" name="state" value={form.state} onChange={handleChange} />
              <Input label="Country" name="country" value={form.country} onChange={handleChange} />
              <Input label="Zip Code" name="zipCode" value={form.zipCode} onChange={handleChange} />

              <div className="md:col-span-3 grid grid-cols-1 gap-5 md:grid-cols-2">
                <TextArea label="Current Address" name="currentAddress" value={form.currentAddress} onChange={handleChange} />
                <TextArea label="Permanent Address" name="permanentAddress" value={form.permanentAddress} onChange={handleChange} />
              </div>
            </div>
          </Section>

          <Section title="Job Information">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Input label="Department *" name="department" value={form.department} onChange={handleChange} required />
              <Input label="Designation *" name="designation" value={form.designation} onChange={handleChange} required />

              <Select label="Employee Type *" name="employeeType" value={form.employeeType} onChange={handleChange} required>
                <option value="">Select type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Intern">Intern</option>
                <option value="Contract">Contract</option>
              </Select>

              <Input label="Work Location" name="workLocation" value={form.workLocation} onChange={handleChange} />
              <Input label="Joining Date *" type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} required />
              <Input label="Probation End Date" type="date" name="probationEndDate" value={form.probationEndDate} onChange={handleChange} />
              <Input label="Shift Timing" name="shiftTiming" value={form.shiftTiming} onChange={handleChange} />

              <Select label="Work Mode" name="workMode" value={form.workMode} onChange={handleChange}>
                <option value="">Select mode</option>
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </Select>

              <Select label="Employment Status" name="employmentStatus" value={form.employmentStatus} onChange={handleChange}>
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="On Notice">On Notice</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </div>
          </Section>

          <Section title="Payroll Information">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Input label="Salary" type="number" name="salary" value={form.salary} onChange={handleChange} />
              <Input label="Bank Name" name="bankName" value={form.bankName} onChange={handleChange} />
              <Input label="Account Number" name="accountNumber" value={form.accountNumber} onChange={handleChange} />
              <Input label="IFSC Code" name="ifscCode" value={form.ifscCode} onChange={handleChange} />
              <Input label="PAN Number" name="panNumber" value={form.panNumber} onChange={handleChange} />
            </div>
          </Section>

          <Section title="Education Details">
            <div className="space-y-5">
              {education.map((edu, index) => (
                <div key={index} className="rounded-xl border bg-gray-50 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium text-gray-800">
                      Education #{index + 1}
                    </h4>

                    {education.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setEducation(education.filter((_, i) => i !== index))
                        }
                        className="text-sm font-medium text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <Input label="Qualification" value={edu.qualification} onChange={(e) => updateEducation(index, "qualification", e.target.value)} />
                    <Input label="University" value={edu.university} onChange={(e) => updateEducation(index, "university", e.target.value)} />
                    <Input label="Passing Year" value={edu.passingYear} onChange={(e) => updateEducation(index, "passingYear", e.target.value)} />
                    <Input label="Percentage" value={edu.percentage} onChange={(e) => updateEducation(index, "percentage", e.target.value)} />
                    <Input label="Specialization" value={edu.specialization} onChange={(e) => updateEducation(index, "specialization", e.target.value)} />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setEducation([
                    ...education,
                    {
                      qualification: "",
                      university: "",
                      passingYear: "",
                      percentage: "",
                      specialization: "",
                    },
                  ])
                }
                className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                + Add Education
              </button>
            </div>
          </Section>

          <Section title="Experience Details">
            <div className="space-y-5">
              {experience.map((exp, index) => (
                <div key={index} className="rounded-xl border bg-gray-50 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium text-gray-800">
                      Experience #{index + 1}
                    </h4>

                    {experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setExperience(experience.filter((_, i) => i !== index))
                        }
                        className="text-sm font-medium text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <Input label="Company Name" value={exp.companyName} onChange={(e) => updateExperience(index, "companyName", e.target.value)} />
                    <Input label="Designation" value={exp.designation} onChange={(e) => updateExperience(index, "designation", e.target.value)} />
                    <Input label="Start Date" type="date" value={exp.startDate} onChange={(e) => updateExperience(index, "startDate", e.target.value)} />
                    <Input label="End Date" type="date" value={exp.endDate} onChange={(e) => updateExperience(index, "endDate", e.target.value)} />
                    <Input label="Total Experience" value={exp.totalExperience} onChange={(e) => updateExperience(index, "totalExperience", e.target.value)} />
                    <Input label="Skills Used" placeholder="React, Node, MongoDB" value={exp.skillsUsed} onChange={(e) => updateExperience(index, "skillsUsed", e.target.value)} />
                    <Input label="Reason For Leaving" value={exp.reasonForLeaving} onChange={(e) => updateExperience(index, "reasonForLeaving", e.target.value)} />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setExperience([
                    ...experience,
                    {
                      companyName: "",
                      designation: "",
                      startDate: "",
                      endDate: "",
                      totalExperience: "",
                      skillsUsed: "",
                      reasonForLeaving: "",
                    },
                  ])
                }
                className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                + Add Experience
              </button>
            </div>
          </Section>

          <Section title="Documents">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Input label="Passport Photo" type="file" accept="image/*" onChange={(e) => setPassportPhoto(e.target.files[0])} />
              <Input label="Aadhaar Card" type="file" name="aadhaarCard" onChange={handleDocumentChange} />
              <Input label="PAN Card" type="file" name="panCard" onChange={handleDocumentChange} />
              <Input label="Resume" type="file" name="resume" onChange={handleDocumentChange} />
              <Input label="Offer Letter" type="file" name="offerLetter" onChange={handleDocumentChange} />
              <Input label="Experience Letter" type="file" name="experienceLetter" multiple onChange={handleDocumentChange} />
              <Input label="Education Certificate" type="file" name="educationCertificate" multiple onChange={handleDocumentChange} />
            </div>
          </Section>

          <Section title="Login Credential">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Input label="Password *" type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>
          </Section>

          <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white/90 px-6 py-4 backdrop-blur">
            <button
              type="button"
              className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}