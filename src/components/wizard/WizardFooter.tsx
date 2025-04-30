
import React from 'react';
import { Button } from '@/components/ui/button';

interface WizardFooterProps {
  step: number;
  totalSteps: number;
  isChecking: boolean;
  isInstalling: boolean;
  isGeneratingExe: boolean;
  missingFiles: string[];
  saveLocation: string;
  handleBack: () => void;
  handleNext: () => void;
  handleComplete: () => void;
  checkRequiredDllsInstalled: () => boolean;
}

const WizardFooter: React.FC<WizardFooterProps> = ({
  step,
  totalSteps,
  isChecking,
  isInstalling,
  isGeneratingExe,
  missingFiles,
  saveLocation,
  handleBack,
  handleNext,
  handleComplete,
  checkRequiredDllsInstalled
}) => {
  const isNextDisabled = () => {
    if (step === 1) return isChecking || (missingFiles.length > 0 && !isInstalling);
    if (step === 2) return !checkRequiredDllsInstalled();
    if (step === 3) return isGeneratingExe && !saveLocation;
    return isInstalling;
  };

  return (
    <div className="flex justify-end space-x-2">
      {step > 1 && (
        <Button 
          onClick={handleBack} 
          variant="outline" 
          className="bg-emulator-button border-emulator-highlight"
          disabled={isChecking || isInstalling || isGeneratingExe}
        >
          Back
        </Button>
      )}
      
      <Button 
        onClick={step === totalSteps ? handleComplete : handleNext}
        disabled={isNextDisabled()}
        className={
          step === totalSteps 
            ? "bg-emulator-success text-black hover:bg-emulator-success/80" 
            : "bg-emulator-accent text-black hover:bg-emulator-accent/80"
        }
      >
        {step === totalSteps ? 'Finish' : 'Next'}
      </Button>
    </div>
  );
};

export default WizardFooter;
