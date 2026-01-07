import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_MB } from '../constants';

interface FileUploadProps {
  onFileSelect: (base64: string, mimeType: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Invalid file type. Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 data (remove "data:image/xyz;base64,")
      const base64Data = result.split(',')[1];
      onFileSelect(base64Data, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className={`relative flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden
          ${dragActive ? 'border-neon bg-neon/5 scale-[1.02]' : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800 hover:border-gray-500'}
          ${error ? 'border-red-500 bg-red-500/10' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center z-10">
          {error ? (
             <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-3 text-red-500" />
          ) : (
             <div className={`p-3 sm:p-4 rounded-full mb-3 transition-colors ${dragActive ? 'bg-neon/20 text-neon' : 'bg-gray-700 text-gray-300'}`}>
                <Upload className="w-6 h-6 sm:w-8 sm:h-8" />
             </div>
          )}
          
          <p className="mb-1 sm:mb-2 text-sm text-gray-300 font-medium">
            <span className="font-bold text-white">Click to upload</span> or drag and drop
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500">
            JPG, PNG, WEBP, HEIC (MAX. {MAX_FILE_SIZE_MB}MB)
          </p>
          {error && <p className="mt-2 text-sm text-red-400 font-medium">{error}</p>}
        </div>

        {/* Background decorative elements */}
        <div className="absolute -bottom-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-purple-500/10 rounded-full blur-2xl" />
        <div className="absolute -top-10 -left-10 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/10 rounded-full blur-2xl" />
      </div>

      <div className="mt-4 flex items-start gap-2 text-[10px] sm:text-xs text-gray-500 bg-gray-900/50 p-2 sm:p-3 rounded-lg border border-gray-800">
        <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 shrink-0" />
        <p>Photos are processed securely by AI and are not permanently stored on our servers. For best results, use good lighting.</p>
      </div>
    </div>
  );
};

export default FileUpload;