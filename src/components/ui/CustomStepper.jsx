// components/ui/CustomStepper.jsx
import { cls } from "../../utils/helpers";

export default function CustomStepper({ steps, activeStep, onStepClick }) {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((label, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;

        return (
          <div key={index} className="flex items-center flex-1">
            <button
              type="button"
              onClick={() => onStepClick?.(index)}
              className="flex flex-col items-center group"
              disabled={index > activeStep + 1}
            >
              <div
                className={cls(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                  isActive
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                    : isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 text-slate-500 border-2 border-slate-300"
                )}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <span
                className={cls(
                  "text-[10px] font-medium mt-1.5 whitespace-nowrap",
                  isActive
                    ? "text-indigo-600"
                    : isCompleted
                      ? "text-emerald-600"
                      : "text-slate-400"
                )}
              >
                {label}
              </span>
            </button>

            {index < steps.length - 1 && (
              <div
                className={cls(
                  "h-0.5 flex-1 mx-2 transition-all",
                  index < activeStep ? "bg-emerald-500" : "bg-slate-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}