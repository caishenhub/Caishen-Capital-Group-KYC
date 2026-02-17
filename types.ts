
export type DocumentKey = 'front' | 'back' | 'residence' | 'selfie';

export type AlignmentStatus = 'neutral' | 'good' | 'poor' | 'scanning';

export interface DocumentInfo {
  file: File | null;
  previewUrl: string | null;
  error: string | null;
}

export interface VerificationState {
  front: DocumentInfo;
  back: DocumentInfo;
  residence: DocumentInfo;
  selfie: DocumentInfo;
}

export enum AppStatus {
  UPLOADING_PHASE = 'uploading',
  SUBMITTING = 'submitting',
  SUCCESS = 'success'
}
