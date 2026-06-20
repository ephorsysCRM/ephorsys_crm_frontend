// components/ui/CustomStepper.jsx
import { cls } from "../../utils/helpers";

export default function CustomStepper({ steps, activeStep, onStepClick }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center min-w-max px-1 mt-1 pb-9">
        {steps.map((label, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isDisabled = index > activeStep + 1;

          return (
            <div key={index} className="flex items-center ">
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onStepClick?.(index)}
                className={cls(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 transition-all",
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : isCompleted
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500",
                  isDisabled
                    ? "cursor-not-allowed opacity-60"
                    : "hover:bg-indigo-50 hover:text-black"
                )}
              >
                <span
                  className={cls(
                    "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold",
                    isActive
                      ? "bg-white text-green-600"
                      : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-white text-slate-500"
                  )}
                >
                  {isCompleted ? "✓" : index + 1}
                </span>

                <span className="hidden md:block text-xs font-medium whitespace-nowrap">
                  {label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div
                  className={cls(
                    "mx-2 h-[2px] w-8 rounded-full",
                    index < activeStep ? "bg-green-500" : "bg-slate-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}