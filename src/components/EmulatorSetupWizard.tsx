
import React from 'react';
import { requiredSetupFiles, optionalSetupFiles } from '@/utils/setupData';
import { windowsRequirements } from '@/utils/setupData';
import { getRequiredDlls, getAllDlls } from '@/utils/dllCodeDefinitions';
import { allExecutableCodes } from '@/utils/executableCode'; // Updated import
import { SetupFile } from '@/utils/setupTypes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import our new components
import SystemCheckStep from './wizard/SystemCheckStep';
import DllManagementStep from './wizard/DllManagementStep';
import SystemRequirementsStep from './wizard/SystemRequirementsStep';
import CompletionStep from './wizard/CompletionStep';
import WizardFooter from './wizard/WizardFooter';
import useWizardState from '@/hooks/useWizardState';

interface EmulatorSetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmulatorSetupWizard: React.FC<EmulatorSetupWizardProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const {
    step,
    isChecking,
    setIsChecking,
    isInstalling,
    isGeneratingExe,
    progress,
    missingFiles,
    saveLocation,
    currentTabView,
    setCurrentTabView,
    currentFileIndex,
    installedDlls,
    totalSteps,
    checkRequiredDllsInstalled,
    handleNext,
    handleBack,
    handleComplete,
    handleInstallMissing,
    handleInstallDll,
    handleGenerateExe,
  } = useWizardState();
  
  // Convert DLL definitions to setup files format
  const requiredDlls: SetupFile[] = getRequiredDlls().map(dll => ({
    name: dll.name,
    size: `${Math.round(dll.size / 1024)}KB`,
    status: 'pending' as const,
    progress: 0,
    required: true
  }));
  
  const optionalDlls: SetupFile[] = getAllDlls()
    .filter(dll => !dll.isRequired)
    .map(dll => ({
      name: dll.name,
      size: `${Math.round(dll.size / 1024)}KB`,
      status: 'pending' as const,
      progress: 0,
      required: false
    }));
  
  // Convert executables to setup files
  const executableFiles: SetupFile[] = Object.values(allExecutableCodes).map(exe => ({
    name: exe.name,
    size: `${Math.round(exe.size / 1024)}KB`,
    status: 'pending' as const,
    progress: 0,
    required: true
  }));
  
  // Initialize checking when opening step 1
  React.useEffect(() => {
    if (open && step === 1) {
      setIsChecking(true);
      // The progress updating is handled in the useWizardState hook
    }
  }, [open, step, setIsChecking]);
  
  // Handle wizard completion and closing
  const handleWizardComplete = () => {
    const success = handleComplete();
    if (success) {
      onOpenChange(false);
    }
  };

  // Helper to render the current step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <SystemCheckStep
            isChecking={isChecking}
            progress={progress}
            missingFiles={missingFiles}
            requiredSetupFiles={requiredSetupFiles}
            isInstalling={isInstalling}
            handleInstallMissing={handleInstallMissing}
          />
        );
      
      case 2:
        return (
          <DllManagementStep
            requiredDlls={requiredDlls}
            optionalDlls={optionalDlls}
            executableFiles={executableFiles}
            installedDlls={installedDlls}
            isInstalling={isInstalling}
            currentFileIndex={currentFileIndex}
            handleInstallDll={handleInstallDll}
            onTabChange={setCurrentTabView}
            currentTabView={currentTabView}
            checkRequiredDllsInstalled={checkRequiredDllsInstalled}
          />
        );
      
      case 3:
        return (
          <SystemRequirementsStep
            windowsRequirements={windowsRequirements}
            isGeneratingExe={isGeneratingExe}
            progress={progress}
            saveLocation={saveLocation}
            handleGenerateExe={handleGenerateExe}
          />
        );
      
      case 4:
        return (
          <CompletionStep
            handleGenerateExe={handleGenerateExe}
            isGeneratingExe={isGeneratingExe}
          />
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-emulator-card-bg border-emulator-highlight">
        <DialogHeader>
          <DialogTitle className="text-xl font-retro tracking-wide glow-text">
            RetroNexus Windows Setup Wizard
          </DialogTitle>
          <DialogDescription>
            Step {step} of {totalSteps}: {
              step === 1 ? 'System Check' : 
              step === 2 ? 'DLL Management' : 
              step === 3 ? 'Windows Requirements' : 
              'Complete'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {renderStepContent()}
        </div>
        
        <DialogFooter>
          <WizardFooter
            step={step}
            totalSteps={totalSteps}
            isChecking={isChecking}
            isInstalling={isInstalling}
            isGeneratingExe={isGeneratingExe}
            missingFiles={missingFiles}
            saveLocation={saveLocation}
            handleBack={handleBack}
            handleNext={handleNext}
            handleComplete={handleWizardComplete}
            checkRequiredDllsInstalled={checkRequiredDllsInstalled}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmulatorSetupWizard;
