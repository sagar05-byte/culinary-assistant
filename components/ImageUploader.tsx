
import React, { useState, useCallback, ChangeEvent } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const handleAnalyzeClick = () => {
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center p-8 bg-gray-800 border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold text-white mb-4">Your Culinary Assistant</h2>
      <p className="text-gray-400 mb-8">Snap a photo of your fridge, and I'll suggest recipes you can make right now.</p>
      
      <div className="w-full mb-6">
        <label htmlFor="file-upload" className="cursor-pointer bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300">
          {preview ? 'Change Photo' : 'Upload a Photo'}
        </label>
        <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {preview && (
        <div className="w-full mb-6 relative">
          <img src={preview} alt="Fridge preview" className="rounded-lg max-h-80 w-auto mx-auto shadow-lg" />
        </div>
      )}

      <button
        onClick={handleAnalyzeClick}
        disabled={!file || isLoading}
        className="w-full bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-blue-500 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Find Recipes'
        )}
      </button>
    </div>
  );
};

export default ImageUploader;
