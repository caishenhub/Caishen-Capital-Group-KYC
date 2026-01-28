
import React, { useState, useCallback, useMemo } from 'react';
import { AppStatus, DocumentKey, VerificationState, DocumentInfo } from './types';
import Header from './components/Header';
import KycCard from './components/KycCard';
import SuccessView from './components/SuccessView';
import PrivacyNotice from './components/PrivacyNotice';

// Nueva URL de implementación proporcionada por el usuario
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxdUG1NUAO9LScmUBh-eF9dUUp0QTUntrq7hoIA-GfMOORFU0CEfB0O3hyADfyutEQ/exec';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.UPLOADING_PHASE);
  const [state, setState] = useState<VerificationState>({
    front: { file: null, previewUrl: null, error: null },
    back: { file: null, previewUrl: null, error: null },
    residence: { file: null, previewUrl: null, error: null },
    selfie: { file: null, previewUrl: null, error: null },
  });

  const handleFileChange = useCallback((key: DocumentKey, file: File | null) => {
    if (!file) {
      setState(prev => ({
        ...prev,
        [key]: { file: null, previewUrl: null, error: null }
      }));
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 12 * 1024 * 1024;

    let error = null;
    if (!validTypes.includes(file.type)) {
      error = 'Formato no permitido (JPG/PNG)';
    } else if (file.size > maxSize) {
      error = 'Máximo 12 MB permitido';
    }

    const previewUrl = error ? null : URL.createObjectURL(file);

    setState(prev => {
      if (prev[key].previewUrl) URL.revokeObjectURL(prev[key].previewUrl!);
      return {
        ...prev,
        [key]: { file: error ? null : file, previewUrl, error }
      };
    });
  }, []);

  const isComplete = useMemo(() => {
    return !!(state.front.file && state.back.file && state.residence.file && state.selfie.file);
  }, [state]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!isComplete) return;
    setStatus(AppStatus.SUBMITTING);
    
    try {
      const [front, back, residence, selfie] = await Promise.all([
        fileToBase64(state.front.file!),
        fileToBase64(state.back.file!),
        fileToBase64(state.residence.file!),
        fileToBase64(state.selfie.file!)
      ]);

      const payload = {
        front,
        back,
        residence,
        selfie, // Esta clave debe coincidir con data.selfie en tu Google Apps Script
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          platform: 'Caishen Digital Onboarding'
        }
      };

      // Se usa mode: 'no-cors' para evitar problemas de CORS con Google Apps Script
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      // En modo no-cors no podemos leer la respuesta, así que asumimos éxito si no hay error de red
      setStatus(AppStatus.SUCCESS);
      
      // Limpiar URLs de previsualización para liberar memoria
      (Object.values(state) as DocumentInfo[]).forEach(doc => {
        if (doc.previewUrl) URL.revokeObjectURL(doc.previewUrl);
      });

    } catch (err) {
      console.error('Error al enviar:', err);
      alert('Error de conexión al enviar los documentos. Por favor, intente de nuevo.');
      setStatus(AppStatus.UPLOADING_PHASE);
    }
  };

  if (status === AppStatus.SUCCESS) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 md:p-10">
        <SuccessView onReset={() => setStatus(AppStatus.UPLOADING_PHASE)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center">
      <div className="w-full max-w-[700px] md:my-10">
        <div className="bg-white rounded-none md:rounded-3xl shadow-soft flex flex-col overflow-hidden border border-slate-100 min-h-screen md:min-h-0">
          <Header />
          
          <div className="flex-1 px-6 sm:px-10 md:px-14 pt-4 pb-20">
            <KycCard 
              number={1}
              title="Identidad (Frente)" 
              description="Documento oficial vigente con fotografía." 
              docKey="front" 
              info={state.front} 
              onFileChange={handleFileChange} 
              disabled={status === AppStatus.SUBMITTING} 
            />
            <KycCard 
              number={2}
              title="Identidad (Reverso)" 
              description="Reverso del documento con códigos de barras." 
              docKey="back" 
              info={state.back} 
              onFileChange={handleFileChange} 
              disabled={status === AppStatus.SUBMITTING} 
            />
            <KycCard 
              number={3}
              title="Prueba de Domicilio" 
              description="Comprobante de domicilio (Agua, Luz o Gas)." 
              docKey="residence" 
              info={state.residence} 
              onFileChange={handleFileChange} 
              disabled={status === AppStatus.SUBMITTING} 
            />
            <KycCard 
              number={4}
              title="Verificación Facial" 
              description="Tómese una foto clara mirando a la cámara." 
              docKey="selfie" 
              info={state.selfie} 
              onFileChange={handleFileChange} 
              disabled={status === AppStatus.SUBMITTING} 
            />

            <div className="form-section-header mt-12">
              <div className="section-number">5</div>
              <h3 className="section-title">Finalizar Proceso</h3>
            </div>
            
            <div className="field-container bg-[#f8f9fb] border-none text-center py-10 md:py-12">
              <p className="text-[#8e9aaf] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-6 md:mb-8">
                Confirmación de Información
              </p>
              <button 
                onClick={handleSubmit} 
                disabled={!isComplete || status === AppStatus.SUBMITTING} 
                className={`w-full max-w-sm md:max-w-md mx-auto py-5 md:py-6 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
                  isComplete && status !== AppStatus.SUBMITTING 
                  ? 'bg-[#ceff04] text-[#1d1c2d] shadow-lg hover:shadow-[#ceff04]/30 hover:-translate-y-1' 
                  : 'bg-gray-200 text-[#9ba3af] cursor-not-allowed opacity-70'
                }`}
              >
                {status === AppStatus.SUBMITTING ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1d1c2d] border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  'Enviar Verificación'
                )}
              </button>
            </div>
            
            <PrivacyNotice />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
