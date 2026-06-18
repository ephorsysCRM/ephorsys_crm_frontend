// steps/EducationStep.jsx
import { FormInput, FormField } from "../components/FormComponents";

export default function EducationStep({ education, setEducation, blankEdu }) {
  const updateEdu = (index, key, value) => {
    setEducation(prev => prev.map((item, i) => i === index ? { ...item, [key]: value } : item));
  };

  const removeEdu = (index) => {
    setEducation(prev => prev.filter((_, i) => i !== index));
  };

  const addEdu = () => {
    setEducation(prev => [...prev, blankEdu()]);
  };

  return (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <div key={index} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              Education Record
            </span>
            {education.length > 1 && (
              <button
                type="button"
                onClick={() => removeEdu(index)}
                className="text-xs text-rose-500 hover:text-rose-700 border border-rose-200 hover:border-rose-400 px-2.5 py-1 rounded-lg"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Qualification"
              value={edu.qualification}
              onChange={(e) => updateEdu(index, "qualification", e.target.value)}
              placeholder="B.Tech, MCA…"
            />
            <FormField
              label="University / Board"
              value={edu.university}
              onChange={(e) => updateEdu(index, "university", e.target.value)}
              placeholder="BPUT, CBSE…"
            />
            <FormField
              label="Passing Year"
              value={edu.passingYear}
              onChange={(e) => updateEdu(index, "passingYear", e.target.value)}
              placeholder="2022"
              onlyDigits
              maxLength={4}
            />
            <FormField
              label="Percentage / CGPA"
              value={edu.percentage}
              onChange={(e) => updateEdu(index, "percentage", e.target.value)}
              placeholder="85% / 8.5"
            />
            <FormField
              label="Specialization"
              value={edu.specialization}
              onChange={(e) => updateEdu(index, "specialization", e.target.value)}
              placeholder="Computer Science"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEdu}
        className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-4 py-2 rounded-lg"
      >
        <span className="text-lg leading-none">+</span> Add Education
      </button>
    </div>
  );
}