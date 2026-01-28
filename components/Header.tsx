import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-row justify-between items-center md:items-start border-b border-gray-100 px-6 md:px-8 py-5 md:py-6 mb-4">
      {/* Lado Izquierdo: Logo y Subtexto */}
      <div className="flex flex-col items-start max-w-[65%] md:max-w-none">
        <div className="mb-1">
          <img 
            src="https://i.ibb.co/zT3RhhT9/CAISHEN-NO-FONDO-AZUL-1.png" 
            alt="Caishen Capital Group" 
            className="h-8 md:h-10 w-max object-contain"
          />
        </div>
        <span className="text-[6px] md:text-[7px] font-medium tracking-[0.2em] md:tracking-[0.4em] text-[#9ba3af] uppercase whitespace-nowrap">
          Protocolo Onboarding Digital
        </span>
      </div>
      
      {/* Lado Derecho: Badge de Sistemas */}
      <div className="bg-[#f4f7fa] border border-[#eef2f7] rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3 flex flex-col items-center shadow-sm self-center md:self-start">
        <span className="text-[6px] md:text-[8px] font-bold text-[#8e9aaf] uppercase tracking-[0.05em] mb-0.5 md:mb-1">
          Sistemas
        </span>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#ceff04]"></div>
          <span className="text-[8px] md:text-[11px] font-black text-[#1d1c2d] uppercase tracking-tighter">
            KYC
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;