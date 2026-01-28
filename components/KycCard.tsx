
import React, { useRef } from 'react';
import { DocumentInfo, DocumentKey } from '../types';

interface KycCardProps {
  title: string;
  description: string;
  docKey: DocumentKey;
  info: DocumentInfo;
  onFileChange: (key: DocumentKey, file: File | null) => void;
  disabled?: boolean;
}

const KycCard: React.FC<KycCardProps> = ({ title, description, docKey, info, onFileChange, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBtnClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(docKey, file);
  };

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-navy text-lg">{title}</h3>
          <p className="text-gray-500 text-xs mt-1">{description}</p>
        </div>
        {info.file && !info.error && (
          <div className="bg-green-50 text-green-600 p-1 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
          {info.previewUrl ? (
            <img 
              src={info.previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover transition-transform group-hover:scale-110" 
            />
          ) : (
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-navy truncate">
            {info.file ? info.file.name : 'Ningún archivo seleccionado'}
          </p>
          <button
            onClick={handleBtnClick}
            className="mt-2 inline-flex items-center px-4 py-1.5 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            {info.file ? 'Cambiar' : 'Subir'}
          </button>
        </div>
      </div>

      {info.error && (
        <p className="mt-3 text-red-500 text-xs font-medium animate-pulse">
          {info.error}
        </p>
      )}

      <input
        type="file"
        ref={inputRef}
        onChange={handleInputChange}
        accept=".jpg,.jpeg,.png"
        className="hidden"
      />
    </div>
  );
};

export default KycCard;
