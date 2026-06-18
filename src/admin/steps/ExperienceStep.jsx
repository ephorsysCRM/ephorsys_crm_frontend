// steps/ExperienceStep.jsx
import { FormField } from "../components/FormComponents";

export default function ExperienceStep({ experience, setExperience, blankExp }) {
  const updateExp = (index, key, value) => {
    setExperience(prev => prev.map((item, i) => i === index ? { ...item, [key]: value } : item));
  };

  const removeExp = (index) => {
    setExperience(prev => prev.filter((_, i) => i !== index));
  };

  const addExp = () => {
    setExperience(prev => [...prev, blankExp()]);
  };

  return (
    <div className="space-y-4">
      {experience.map((exp, index) => (
        <div key={index} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              Work Experience
            </span>
            {experience.length > 1 && (
              <button
                type="button"
                onClick={() => removeExp(index)}
                className="text-xs text-rose-500 hover:text-rose-700 border border-rose-200 hover:border-rose-400 px-2.5 py-1 rounded-lg"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Company Name"
              value={exp.companyName}
              onChange={(e) => updateExp(index, "companyName", e.target.value)}
              placeholder="Infosys Ltd"
            />
            <FormField
              label="Designation"
              value={exp.designation}
              onChange={(e) => updateExp(index, "designation", e.target.value)}
              placeholder="Software Engineer"
            />
            <FormField
              label="Total Experience"
              value={exp.totalExperience}
              onChange={(e) => updateExp(index, "totalExperience", e.target.value)}
              placeholder="2 years 3 months"
            />
            <FormField
              label="Skills (comma-separated)"
              value={exp.skillsUsed}
              onChange={(e) => updateExp(index, "skillsUsed", e.target.value)}
              placeholder="React, Node.js"
            />
            <FormField
              label="Start Date"
              type="date"
              value={exp.startDate}
              onChange={(e) => updateExp(index, "startDate", e.target.value)}
            />
            <FormField
              label="End Date"
              type="date"
              value={exp.endDate}
              onChange={(e) => updateExp(index, "endDate", e.target.value)}
            />
            <div className="md:col-span-3">
              <FormField
                label="Reason for Leaving"
                value={exp.reasonForLeaving}
                onChange={(e) => updateExp(index, "reasonForLeaving", e.target.value)}
                placeholder="Better opportunity"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExp}
        className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-4 py-2 rounded-lg"
      >
        <span className="text-lg leading-none">+</span> Add Experience
      </button>
    </div>
  );
}