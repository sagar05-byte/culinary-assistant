
import React, { useState, useEffect, useCallback } from 'react';
import { Recipe } from '../types';
import { SpeakerIcon, StopIcon } from '../constants';

interface CookingModeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const CookingModeModal: React.FC<CookingModeModalProps> = ({ recipe, onClose }) => {
  const [step, setStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const totalSteps = recipe.instructions.length;
  const currentInstruction = recipe.instructions[step];

  const stopSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speakInstruction = useCallback((text: string) => {
    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [stopSpeech]);

  useEffect(() => {
    // Cleanup speech synthesis on component unmount
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  const handleNext = () => {
    stopSpeech();
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    stopSpeech();
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const toggleSpeak = () => {
    if (isSpeaking) {
        stopSpeech();
    } else {
        speakInstruction(currentInstruction);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900 w-full max-w-4xl h-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col p-6 md:p-10 relative border-2 border-blue-500" onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{recipe.recipeName}</h2>
          <p className="text-blue-400 font-semibold text-lg">Step {step + 1} of {totalSteps}</p>
        </div>
        
        <div className="flex-grow flex items-center justify-center mb-6">
          <p className="text-2xl md:text-4xl lg:text-5xl text-gray-100 text-center leading-relaxed font-medium">
            {currentInstruction}
          </p>
        </div>

        <div className="flex-shrink-0">
          <div className="flex items-center justify-center mb-6">
              <button onClick={toggleSpeak} className={`p-4 rounded-full transition-colors duration-300 ${isSpeaking ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                {isSpeaking ? <StopIcon className="w-8 h-8 text-white"/> : <SpeakerIcon className="w-8 h-8 text-white"/>}
              </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={step === 0}
              className="w-full sm:w-auto bg-gray-700 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-gray-600 transition-colors disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={step === totalSteps - 1}
              className="w-full sm:w-auto bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-500 transition-colors disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CookingModeModal;
