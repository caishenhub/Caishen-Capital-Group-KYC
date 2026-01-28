
import React from 'react';

const PrivacyNotice: React.FC = () => {
  return (
    <footer className="mt-12 text-center border-t border-gray-100 pt-8">
      <div className="bg-gray-100/50 p-4 rounded-xl inline-block max-w-sm">
        <p className="text-[10px] text-gray-500 leading-normal uppercase tracking-tighter">
          Aviso de Privacidad
        </p>
        <p className="text-[11px] text-gray-400 mt-2 italic">
          “La información suministrada se utiliza únicamente para fines de verificación. No garantiza aprobación. Sujeto a validación por Caishen Capital Group.”
        </p>
      </div>
      <p className="mt-6 text-[10px] text-gray-300 font-medium">
        © 2024 Caishen Capital Group. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default PrivacyNotice;
