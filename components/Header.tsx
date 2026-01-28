
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-row justify-between items-center md:items-start border-b border-gray-100 px-6 md:px-8 py-4 md:py-6 mb-4">
      {/* Lado Izquierdo: Logo y Subtexto */}
      <div className="flex flex-col items-start max-w-[50%] md:max-w-none">
        <div className="mb-0.5">
          <img 
            src="https://i.ibb.co/zT3RhhT9/CAISHEN-NO-FONDO-AZUL-1.png" 
            alt="Caishen Capital Group" 
            className="h-6 md:h-8 w-max object-contain"
          />
        </div>
        <span className="text-[5.5px] md:text-[6.5px] font-medium tracking-[0.2em] md:tracking-[0.4em] text-[#9ba3af] uppercase whitespace-nowrap">
          Protocolo Onboarding Digital
        </span>
      </div>
      
      {/* Lado Derecho: Badge de Sistemas (Redimensionado para mayor armonía) */}
      <div className="bg-[#f8f9fb] border border-[#f0f2f5] rounded-[16px] px-3.5 py-2 md:px-5 md:py-2.5 flex flex-col items-center md:items-start shadow-sm self-center md:self-start transition-all hover:shadow-md">
        <span className="text-[6px] md:text-[7.5px] font-bold text-[#94a3b8] uppercase tracking-[0.08em] mb-1 whitespace-nowrap">
          Sistemas de Información
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#ceff04] shadow-[0_0_6px_rgba(206,255,4,0.5)]"></div>
          <span className="text-[9px] md:text-[11px] font-black text-[#1d1c2d] uppercase tracking-tight">
            KYC Protocol
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
