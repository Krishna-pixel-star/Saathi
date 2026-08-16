const DEFAULT_STEPS = ['Registration', t('explorer.location'), 'Language'];

export default function StepIndicator({ currentStep, steps = DEFAULT_STEPS }) {
  const { t } = useUser();
  return (
    <div className="w-full" aria-label={`Step ${currentStep} of ${steps.length}`}>
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={step}
              className="relative flex flex-1 flex-col items-center last:flex-none"
            >
              {index > 0 && (
                <span
                  className={`absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2 ${
                    isComplete ? 'bg-[#2E7D32]' : 'bg-slate-200'
                  }`}
                />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  isComplete || isCurrent
                    ? 'border-[#2E7D32] bg-[#2E7D32] text-white'
                    : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                {isComplete ? '✓' : stepNumber}
              </span>
              <span
                className={`mt-2 text-center text-xs font-medium sm:text-sm ${
                  isCurrent ? 'text-[#2E7D32]' : 'text-slate-500'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
