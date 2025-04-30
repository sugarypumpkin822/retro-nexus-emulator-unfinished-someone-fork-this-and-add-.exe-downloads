
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { SetupFile } from '@/utils/setupTypes';
import { requiredSetupFiles } from '@/utils/setupData';
import { verifyRequiredDlls } from '@/utils/packageGenerator/packageBuilder';
import { createExecutablePackage } from '@/utils/packageGenerator/packageBuilder';

export const useWizardState = () => {
  const [step, setStep] = useState(1);
  const [isChecking, setIsChecking] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isGeneratingExe, setIsGeneratingExe] = useState(false);
  const [progress, setProgress] = useState(0);
  const [missingFiles, setMissingFiles] = useState<string[]>([]);
  const [saveLocation, setSaveLocation] = useState<string>("");
  const [currentTabView, setCurrentTabView] = useState("required");
  const [currentFileIndex, setCurrentFileIndex] = useState<number | undefined>(undefined);
  const [installedDlls, setInstalledDlls] = useState<string[]>([]);
  
  const totalSteps = 4;
  
  // System check effect
  useEffect(() => {
    if (step === 1 && isChecking) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsChecking(false);
            
            // Randomly determine missing files (for demonstration)
            const missing = requiredSetupFiles
              .filter(() => Math.random() > 0.6)
              .map(file => file.name);
            setMissingFiles(missing);
            
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [step, isChecking]);

  // Check if all required DLLs are installed
  const checkRequiredDllsInstalled = (): boolean => {
    const dllVerification = verifyRequiredDlls(installedDlls);
    return dllVerification.isValid;
  };

  // Handle navigation
  const handleNext = () => {
    // When moving from DLL management to Windows installer page, check required DLLs
    if (step === 2 && !checkRequiredDllsInstalled()) {
      toast.error("Missing required DLLs", {
        description: "All required DLL files must be installed before proceeding"
      });
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    toast.success('Setup completed successfully!', {
      description: 'You can now start using RetroNexus Emulator.'
    });
    setStep(1);
    setInstalledDlls([]);
    return true; // Return true to indicate completion success
  };

  // Handle system check
  const handleInstallMissing = async () => {
    setIsInstalling(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsInstalling(false);
          setMissingFiles([]);
          toast.success('Missing files installed successfully!');
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };
  
  // Handle DLL installation
  const handleInstallDll = (file: SetupFile, index: number) => {
    if (isInstalling) return;
    
    setCurrentFileIndex(index);
    setIsInstalling(true);
    
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Add to installed DLLs list
        setInstalledDlls(prev => [...prev, file.name]);
        
        setIsInstalling(false);
        setCurrentFileIndex(undefined);
        
        toast.success(`${file.name} installed successfully!`);
      }
    }, 100);
  };

  // Handle Windows executable generation
  const handleGenerateExe = async () => {
    setIsGeneratingExe(true);
    setProgress(0);
    
    try {
      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            return 95; // Hold at 95% until actual completion
          }
          return prev + (95 - prev) * 0.1;
        });
      }, 100);
      
      // Generate the executable package
      const executableBlob = await createExecutablePackage();
      
      // Complete the progress
      clearInterval(progressInterval);
      setProgress(100);
      
      // Create download link
      const downloadUrl = URL.createObjectURL(executableBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = 'RetroNexus-Setup.zip';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Clean up the URL object
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 60000);
      
      toast.success('Windows installer package created!', {
        description: 'Your RetroNexus Setup.zip file is ready.'
      });
      
      setSaveLocation("RetroNexus-Setup.zip");
      setIsGeneratingExe(false);
    } catch (error) {
      console.error('Error generating Windows executable:', error);
      toast.error('Failed to create Windows package', {
        description: 'An error occurred while creating the setup package.'
      });
      setIsGeneratingExe(false);
    }
  };

  return {
    step,
    setStep,
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
  };
};

export default useWizardState;
