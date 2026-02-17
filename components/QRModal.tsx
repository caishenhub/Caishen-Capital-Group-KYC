
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRModalProps {
  onClose: () => void;
}

const QRModal: React.FC<QRModalProps> = ({ onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  const PRODUCTION_URL = 'https://caishen-capital-group-kyc.vercel.app/';

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(PRODUCTION_URL, {
          width: 600,
          margin: 2,
          color: {
            dark: '#1d1c2d',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Error generating QR:', err);
      }
    };
    generateQR();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(PRODUCTION_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-[#1d1c2d]/95 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl animate-slide-up border border-white/20">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-12 h-1 bg-gray-100 rounded-full mb-8"></div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#ceff04] animate-pulse"></div>
            <h3 className="text-[#1d1c2d] text-xs font-black uppercase tracking-[0.2em]">Sincronización Móvil</h3>
          </div>
          
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-8 leading-relaxed px-4">
            Escanea el código para continuar el proceso con la cámara de tu smartphone.
          </p>
          
          {qrDataUrl ? (
            <div className="bg-white p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-50 mb-8 transition-transform hover:scale-105 duration-500">
              <img 
                src={qrDataUrl} 
                alt="QR Code Caishen" 
                className="w-56 h-56 rounded-xl"
              />
            </div>
          ) : (
            <div className="w-56 h-56 bg-gray-50 rounded-3xl mb-8 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#1d1c2d] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div className="w-full flex flex-col gap-3 px-2">
            <button 
              onClick={copyToClipboard}
              className={`w-full py-4 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border ${
                copied ? 'bg-[#ceff04] border-[#ceff04] text-[#1d1c2d]' : 'bg-gray-50 border-gray-100 text-[#1d1c2d] hover:bg-white hover:shadow-md'
              }`}
            >
              {copied ? '¡Enlace Copiado!' : 'Copiar enlace manual'}
            </button>

            <button 
              onClick={onClose}
              className="w-full py-4 bg-[#1d1c2d] text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] transition-all hover:bg-black active:scale-95"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
