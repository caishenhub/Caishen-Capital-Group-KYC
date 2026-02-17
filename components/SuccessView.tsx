
import React from 'react';

interface SuccessViewProps {
  onReset: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ onReset }) => {
  const handleFinalize = () => {
    // Actualizado al dominio correcto solicitado por el usuario
    window.location.href = 'https://caishencapitalgroup.com/';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[24px] shadow-soft p-12 min-h-[70vh] flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-24 h-24 bg-[#ceff04] rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-[#ceff04]/30 animate-bounce">
          <svg className="w-10 h-10 text-[#1d1c2d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-black text-[#1d1c2d] uppercase tracking-widest mb-4">
          Carga Exitosa
        </h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider max-w-sm mb-12 leading-relaxed">
          Su protocolo de verificación ha sido recibido. El equipo de Auditoría Digital revisará su información en un plazo máximo de 24 horas hábiles.
        </p>

        <button
          onClick={handleFinalize}
          className="px-10 py-4 bg-[#1d1c2d] text-[#ceff04] rounded-xl font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-opacity-90 transition-all shadow-xl active:scale-95"
        >
          Finalizar y Salir
        </button>

        <div className="mt-16">
          <img 
            src="https://i.ibb.co/zT3RhhT9/CAISHEN-NO-FONDO-AZUL-1.png" 
            alt="Caishen Capital Group" 
            className="h-8 opacity-20 grayscale mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessView;
