
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { label: 'Frente', id: 1 },
    { label: 'Reverso', id: 2 },
    { label: 'Recibo', id: 3 },
    { label: 'Confirmación', id: 4 },
  ];

  return (
    <div className="flex items-center justify-between relative px-2">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
      {steps.map((step) => {
        const isActive = currentStep >= step.id;
        const isPast = currentStep > step.id;

        return (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 transform ${
                isActive ? 'bg-[#ceff04] text-[#1d1c2d] scale-110' : 'bg-gray-200 text-gray-500'
              } ${isPast ? 'bg-[#1d1c2d] text-[#ceff04]' : ''}`}
            >
              {isPast ? '✓' : step.id}
            </div>
            <span className={`text-[10px] uppercase tracking-wider font-semibold transition-colors duration-300 ${
              isActive ? 'text-[#1d1c2d]' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
