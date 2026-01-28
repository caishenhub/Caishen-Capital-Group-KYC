
import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DocumentKey } from '../types';

interface CameraOverlayProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  facingMode?: 'user' | 'environment';
  title: string;
  docKey: DocumentKey;
}

export const CameraOverlay: React.FC<CameraOverlayProps> = ({ onCapture, onClose, facingMode = 'environment', title, docKey }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function setupCamera() {
      try {
        const constraints = {
          video: { 
            facingMode, 
            width: { ideal: 1920 }, 
            height: { ideal: 1080 } 
          },
          audio: false
        };
        
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Acceso denegado. Por favor, habilite los permisos de cámara en su navegador.");
        setIsLoading(false);
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `kyc_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
            onClose();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const renderFramingGuide = () => {
    if (isLoading || error) return null;

    if (docKey === 'selfie') {
      return (
        <div className="w-[80vw] h-[100vw] max-w-[300px] max-h-[380px] border-[3px] border-[#ceff04] rounded-[160px] shadow-[0_0_0_9999px_rgba(0,0,0,0.75)] flex flex-col items-center justify-end pb-12">
          <div className="bg-[#ceff04] text-[#1d1c2d] px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(206,255,4,0.4)]">
            Rostro en el centro
          </div>
        </div>
      );
    }

    if (docKey === 'residence') {
      return (
        <div className="w-[80vw] h-[110vw] max-w-[400px] max-h-[550px] border-[3px] border-white/40 rounded-[20px] shadow-[0_0_0_9999px_rgba(0,0,0,0.75)] flex flex-col items-center justify-end pb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl">
            Factura / Recibo (Formato Carta)
          </div>
        </div>
      );
    }

    // Default: ID Card (Front/Back)
    return (
      <div className="w-[88vw] aspect-[1.58/1] max-w-[500px] border-[3px] border-white/40 rounded-[40px] shadow-[0_0_0_9999px_rgba(0,0,0,0.75)] flex flex-col items-center justify-end pb-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl">
          Encuadre el Documento
        </div>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col h-[100dvh] w-screen overflow-hidden animate-fade-in">
      
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/40 to-transparent flex items-start justify-between px-8 pt-10 z-30">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ceff04] animate-pulse"></div>
            <span className="text-[#ceff04] text-[8px] font-black uppercase tracking-[0.4em]">Captura de Verificación</span>
          </div>
          <h3 className="text-white text-[13px] font-bold uppercase tracking-[0.1em]">{title}</h3>
        </div>
        
        <button 
          onClick={onClose} 
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-2xl border border-white/20 hover:bg-white/20 active:scale-90 transition-all shadow-2xl"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="relative flex-1 w-full bg-[#050508] flex items-center justify-center overflow-hidden">
        {isLoading && (
          <div className="flex flex-col items-center z-20">
            <div className="w-12 h-12 border-[3px] border-[#ceff04] border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em]">Inicializando Óptica</p>
          </div>
        )}
        
        {error ? (
          <div className="z-20 max-w-sm text-center px-10">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[40px] mb-8 backdrop-blur-xl">
              <svg className="w-14 h-14 text-red-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-white text-[11px] font-bold uppercase leading-relaxed tracking-widest">{error}</p>
            </div>
            <button 
              onClick={onClose} 
              className="w-full py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-transform"
            >
              Volver al inicio
            </button>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'} ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />
        )}
        
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
          {renderFramingGuide()}
        </div>
      </div>

      <div className="h-44 bg-black flex flex-col items-center justify-center px-10 relative z-30 border-t border-white/5">
        {!isLoading && !error && (
          <div className="flex flex-col items-center gap-5">
            <button 
              onClick={capturePhoto}
              className="w-24 h-24 rounded-full border-[6px] border-white/10 p-2 flex items-center justify-center group active:scale-90 transition-all duration-150"
            >
              <div className="w-full h-full rounded-full bg-white group-hover:bg-[#ceff04] shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all"></div>
            </button>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.5em]">Pulsar para capturar</span>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>,
    document.body
  );
};
