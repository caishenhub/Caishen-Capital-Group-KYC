
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#1d1c2d] text-white pt-10 pb-12 px-4 text-center rounded-b-[40px] shadow-2xl">
      <div className="mb-6 flex justify-center">
        <div className="h-12 w-12 bg-[#ceff04] rounded-full flex items-center justify-center text-[#1d1c2d] font-black text-xl">
          C
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-2">Verificación de Identidad y Residencia</h1>
      <p className="text-gray-400 text-sm max-w-sm mx-auto">
        Cargue imágenes claras y legibles para completar el proceso de validación en Caishen Capital Group.
      </p>
    </header>
  );
};

export default Header;
