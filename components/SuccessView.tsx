
import React from 'react';

interface SuccessViewProps {
  onReset: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ onReset }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-24 h-24 bg-[#ceff04] rounded-full flex items-center justify-center mb-8 shadow-xl shadow-lime-100 animate-bounce">
        <svg className="w-12 h-12 text-[#1d1c2d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-3xl font-black text-[#1d1c2d] mb-4">¡Documentos Recibidos!</h2>
      <p className="text-gray-500 max-w-sm mb-10 leading-relaxed">
        El área encargada revisará la información y se comunicará contigo a través de los canales oficiales.
      </p>

      <button
        onClick={onReset}
        className="px-8 py-3 border-2 border-[#1d1c2d] rounded-xl font-bold hover:bg-[#1d1c2d] hover:text-white transition-all transform active:scale-95"
      >
        Volver al inicio
      </button>

      <div className="mt-16 text-gray-300 font-bold tracking-widest uppercase text-xs">
        Caishen Capital Group
      </div>
    </div>
  );
};

export default SuccessView;
