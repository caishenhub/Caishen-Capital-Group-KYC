import React from 'react';

const PrivacyNotice: React.FC = () => {
  return (
    <footer className="mt-12 md:mt-16 pt-8 border-t border-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="max-w-md text-center md:text-left">
          <span className="text-[9px] md:text-[10px] font-black text-[#1d1c2d] uppercase tracking-widest block mb-2">
            Aviso de Privacidad
          </span>
          <p className="text-[9px] md:text-[10px] text-gray-400 leading-relaxed font-medium uppercase tracking-tight italic">
            "La información suministrada se utiliza exclusivamente para fines de verificación de identidad de acuerdo con las normativas internacionales. Caishen Capital Group garantiza el tratamiento confidencial y la protección de sus datos personales bajo estrictos estándares de seguridad digital."
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end">
          <span className="text-[9px] md:text-[10px] font-extrabold text-[#1d1c2d] uppercase tracking-[0.2em]">
            Caishen Capital Group
          </span>
        </div>
      </div>
    </footer>
  );
};

export default PrivacyNotice;