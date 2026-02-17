
import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DocumentKey, AlignmentStatus } from '../types';
import { GoogleGenAI } from "@google/genai";

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
  const [alignment, setAlignment] = useState<AlignmentStatus>('neutral');
  const [feedback, setFeedback] = useState<string>('Analizando...');
  
  const isAnalyzing = useRef(false);

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
        setError("Acceso denegado. Por favor, habilite los permisos de cámara.");
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

  useEffect(() => {
    if (isLoading || error || !stream) return;

    const analyzeFrame = async () => {
      if (isAnalyzing.current || !videoRef.current || !canvasRef.current) return;
      
      isAnalyzing.current = true;
      setAlignment('scanning');

      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        canvas.width = 320;
        canvas.height = 240;
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const base64Data = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];

          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const prompt = `Analiza este frame para un proceso KYC de ${title}. Responde únicamente en formato JSON: {"status": "good"|"poor", "message": "una breve instrucción en español para el usuario"}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
              parts: [
                { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
                { text: prompt }
              ]
            },
            config: { responseMimeType: "application/json" }
          });

          const result = JSON.parse(response.text || '{}');
          setAlignment(result.status || 'neutral');
          setFeedback(result.message || 'Buscando...');
        }
      } catch (e) {
        console.error("AI Analysis Error:", e);
      } finally {
        isAnalyzing.current = false;
      }
    };

    const interval = setInterval(analyzeFrame, 2500);
    return () => clearInterval(interval);
  }, [isLoading, error, stream, title]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (facingMode === 'user') { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
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

  const getGuideColor = () => {
    switch(alignment) {
      case 'good': return 'border-[#ceff04] shadow-[0_0_50px_rgba(206,255,4,0.4)]';
      case 'poor': return 'border-red-500 animate-pulse';
      case 'scanning': return 'border-blue-400 opacity-60';
      default: return 'border-white/40';
    }
  };

  const renderFramingGuide = () => {
    if (isLoading || error) return null;
    let guideStyle = docKey === 'selfie' ? "w-[80vw] h-[100vw] max-w-[300px] max-h-[380px] rounded-[160px]" : 
                     docKey === 'residence' ? "w-[80vw] h-[110vw] max-w-[400px] max-h-[550px] rounded-[20px]" :
                     "w-[88vw] aspect-[1.58/1] max-w-[500px] rounded-[40px]";

    return (
      <div className={`${guideStyle} border-[4px] transition-all duration-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.8)] flex flex-col items-center justify-end pb-8 ${getGuideColor()}`}>
        <div className={`backdrop-blur-xl border px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all ${
          alignment === 'good' ? 'bg-[#ceff04] text-[#1d1c2d] border-[#ceff04]' : 'bg-white/10 text-white border-white/20'
        }`}>
          {feedback}
        </div>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col h-[100dvh] w-screen overflow-hidden animate-fade-in">
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/40 to-transparent flex items-start justify-between px-8 pt-10 z-30">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${alignment === 'good' ? 'bg-[#ceff04] animate-pulse' : 'bg-blue-400'}`}></div>
            <span className="text-[#ceff04] text-[8px] font-black uppercase tracking-[0.4em]">Visión Inteligente</span>
          </div>
          <h3 className="text-white text-[13px] font-bold uppercase tracking-[0.1em]">{title}</h3>
        </div>
        <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-2xl border border-white/20 active:scale-90 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="relative flex-1 w-full bg-[#050508] flex items-center justify-center overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-2 border-[#ceff04] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} />
        )}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">{renderFramingGuide()}</div>
      </div>

      <div className="h-44 bg-black flex items-center justify-center px-10 relative z-30 border-t border-white/5">
        <button onClick={capturePhoto} className="w-24 h-24 rounded-full border-[6px] border-white/10 p-2 active:scale-90 transition-all duration-150 group">
          <div className={`w-full h-full rounded-full transition-all duration-300 ${alignment === 'good' ? 'bg-[#ceff04] shadow-[0_0_30px_#ceff04]' : 'bg-white'}`}></div>
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>,
    document.body
  );
};
