
import React, { useRef, useState } from 'react';
import { DocumentInfo, DocumentKey } from '../types';
import { CameraOverlay } from './CameraOverlay';

interface KycCardProps {
  number: number;
  title: string;
  description: string;
  docKey: DocumentKey;
  info: DocumentInfo;
  onFileChange: (key: DocumentKey, file: File | null) => void;
  disabled?: boolean;
}

const KycCard: React.FC<KycCardProps> = ({ number, title, docKey, info, onFileChange, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleBtnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(docKey, file);
  };

  const handleCameraCapture = (file: File) => {
    onFileChange(docKey, file);
  };

  return (
    <div className={`mb-8 md:mb-10 animate-slide-up ${disabled ? 'opacity-50 pointer-events-none' : ''}`} style={{ animationDelay: `${number * 0.1}s` }}>
      <div className="form-section-header">
        <div className="section-number">{number}</div>
        <h3 className="section-title text-[12px] md:text-[14px]">{title}</h3>
      </div>

      <div className="field-container group relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
          
          {/* Main Action Area: Preview/Camera Trigger */}
          <div 
            onClick={() => setIsCameraOpen(true)}
            className={`cursor-pointer relative w-full sm:w-40 h-40 sm:h-32 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center shrink-0 overflow-hidden group/preview ${
              info.previewUrl 
                ? 'border-[#ceff04] bg-white shadow-lg shadow-[#ceff04]/10' 
                : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-[#1d1c2d]/30 border-dashed'
            }`}
          >
            {info.previewUrl ? (
              <>
                <img 
                  src={info.previewUrl} 
                  alt="Documento" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-110" 
                />
                {/* Overlay intuitivo para cambiar */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex flex-col items-center justify-center">
                   <div className="bg-white/20 backdrop-blur-md p-3 rounded-full mb-2">
                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                     </svg>
                   </div>
                   <span className="text-white text-[10px] font-black uppercase tracking-widest">Re-tomar Foto</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-gray-400 group-hover/preview:text-[#1d1c2d] transition-colors">
                <div className="p-3 bg-gray-100 rounded-2xl mb-2 group-hover/preview:bg-[#ceff04]/20 group-hover/preview:text-[#1d1c2d]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">Abrir Cámara</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">
                {info.file ? 'Verificación Lista' : 'Estado del Documento'}
              </label>
              {info.file && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[#ceff04]/10 text-[#1d1c2d] rounded-md text-[9px] font-bold uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ceff04]"></div>
                  Cargado
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3 shrink-0">
                  <svg className={`w-4 h-4 ${info.file ? 'text-[#ceff04]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[11px] md:text-xs font-bold text-[#1d1c2d] truncate">
                  {info.file ? info.file.name : 'No se ha detectado captura'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsCameraOpen(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    info.file 
                    ? 'bg-[#1d1c2d] text-white hover:bg-black shadow-lg shadow-black/10' 
                    : 'bg-[#ceff04] text-[#1d1c2d] hover:brightness-105 shadow-lg shadow-[#ceff04]/20'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                  {info.file ? 'Tomar de Nuevo' : 'Usar Cámara'}
                </button>
                
                <button
                  onClick={handleBtnClick}
                  className="px-5 flex items-center justify-center bg-gray-100 text-[#1d1c2d] rounded-xl hover:bg-gray-200 transition-all border border-gray-200"
                  title="Subir Archivo Local"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {info.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 animate-shake">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-600 text-[10px] font-black uppercase tracking-tight">{info.error}</p>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={inputRef}
        onChange={handleInputChange}
        accept=".jpg,.jpeg,.png"
        className="hidden"
      />

      {isCameraOpen && (
        <CameraOverlay 
          title={title}
          onCapture={handleCameraCapture}
          onClose={() => setIsCameraOpen(false)}
          facingMode={docKey === 'selfie' ? 'user' : 'environment'}
          docKey={docKey}
        />
      )}
    </div>
  );
};

export default KycCard;
