
import React, { useState, useEffect } from 'react';
import { setupRequiredFiles, systemRequirements } from '@/data/gameData';
import { Button } from '@/components/ui/button';
import { Check, X, Download, AlertTriangle, Loader2, FileDown, Shield, Cpu } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { createExecutablePackage, windowsRequirements } from '@/utils/setupUtils';

interface EmulatorSetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmulatorSetupWizard: React.FC<EmulatorSetupWizardProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [step, setStep] = useState(1);
  const [isChecking, setIsChecking] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isGeneratingExe, setIsGeneratingExe] = useState(false);
  const [progress, setProgress] = useState(0);
  const [missingFiles, setMissingFiles] = useState<string[]>([]);
  const [saveLocation, setSaveLocation] = useState<string>("");
  
  const totalSteps = 3;

  // Simulate system check
  useEffect(() => {
    if (open && step === 1) {
      setIsChecking(true);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsChecking(false);
            
            // Randomly determine missing files (for demonstration)
            const missing = setupRequiredFiles.filter(() => Math.random() > 0.6);
            setMissingFiles(missing);
            
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [open, step]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
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
    onOpenChange(false);
    setStep(1);
  };

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
  
  // Helper to render the current step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-emulator-text-secondary">
              The setup wizard will check your system for required files and components.
            </p>
            
            {isChecking ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Checking system compatibility...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 progress-bar-animate" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border border-emulator-highlight rounded-lg overflow-hidden">
                  <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight">
                    <h4 className="font-bold">System Check Results</h4>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    {missingFiles.length > 0 ? (
                      <>
                        <div className="flex items-center text-emulator-warning">
                          <AlertTriangle className="mr-2" size={16} />
                          <span>Missing required files detected</span>
                        </div>
                        
                        <ul className="space-y-2">
                          {missingFiles.map((file, index) => (
                            <li key={index} className="flex items-center">
                              <X className="mr-2 text-emulator-error" size={16} />
                              <span>{file}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <Button 
                          onClick={handleInstallMissing}
                          disabled={isInstalling}
                          className="w-full bg-emulator-warning text-black hover:bg-emulator-warning/80"
                        >
                          {isInstalling ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Installing... {progress}%
                            </>
                          ) : (
                            <>
                              <Download className="mr-2" size={16} />
                              Download & Install Missing Files
                            </>
                          )}
                        </Button>
                        
                        {isInstalling && (
                          <Progress value={progress} className="h-2 progress-bar-animate" />
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex items-center text-emulator-success">
                          <Check className="mr-2" size={16} />
                          <span>All required files are present</span>
                        </div>
                        
                        <ul className="space-y-2">
                          {setupRequiredFiles.map((file, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="mr-2 text-emulator-success" size={16} />
                              <span>{file}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-emulator-text-secondary">
              This is the minimum recommended hardware to run RetroNexus Emulator. The Windows installer will verify these requirements.
            </p>
            
            <div className="border border-emulator-highlight rounded-lg overflow-hidden">
              <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight">
                <h4 className="font-bold">Windows System Requirements</h4>
              </div>
              
              <table className="min-w-full">
                <thead>
                  <tr className="bg-emulator-highlight/30 text-xs">
                    <th className="text-left p-3">Component</th>
                    <th className="text-left p-3">Minimum Requirements</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emulator-highlight">
                  <tr className="text-sm">
                    <td className="p-3 font-medium">Operating System</td>
                    <td className="p-3 text-emulator-text-secondary">{windowsRequirements.os}</td>
                  </tr>
                  <tr className="text-sm">
                    <td className="p-3 font-medium">Processor</td>
                    <td className="p-3 text-emulator-text-secondary">{windowsRequirements.processor}</td>
                  </tr>
                  <tr className="text-sm">
                    <td className="p-3 font-medium">Memory</td>
                    <td className="p-3 text-emulator-text-secondary">{windowsRequirements.memory}</td>
                  </tr>
                  <tr className="text-sm">
                    <td className="p-3 font-medium">Graphics</td>
                    <td className="p-3 text-emulator-text-secondary">{windowsRequirements.graphics}</td>
                  </tr>
                  <tr className="text-sm">
                    <td className="p-3 font-medium">DirectX</td>
                    <td className="p-3 text-emulator-text-secondary">{windowsRequirements.directX}</td>
                  </tr>
                  <tr className="text-sm">
                    <td className="p-3 font-medium">Storage</td>
                    <td className="p-3 text-emulator-text-secondary">{windowsRequirements.storage}</td>
                  </tr>
                </tbody>
              </table>
              
              <div className="p-3 bg-emulator-highlight/20 text-sm text-emulator-text-secondary">
                <p>{windowsRequirements.additionalNotes}</p>
              </div>
            </div>
            
            <div className="border border-emulator-highlight rounded-lg overflow-hidden">
              <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight">
                <h4 className="font-bold">Windows Installer Package</h4>
              </div>
              
              <div className="p-4 space-y-4">
                <p className="text-sm text-emulator-text-secondary">
                  Generate a Windows-compatible installer package that includes:
                </p>
                
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 text-emulator-accent" size={14} />
                    <span>Signed .exe with Windows compatibility manifest</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 text-emulator-accent" size={14} />
                    <span>Visual C++ Redistributable dependencies</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 text-emulator-accent" size={14} />
                    <span>DirectX 12 runtime installer</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 text-emulator-accent" size={14} />
                    <span>Hardware verification during installation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 text-emulator-accent" size={14} />
                    <span>Windows registry integration for easy uninstall</span>
                  </li>
                </ul>
                
                <Button 
                  onClick={handleGenerateExe}
                  disabled={isGeneratingExe}
                  className="w-full bg-emulator-accent text-black hover:bg-emulator-accent/80"
                >
                  {isGeneratingExe ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Windows Package... {progress}%
                    </>
                  ) : (
                    <>
                      <FileDown className="mr-2" size={16} />
                      Generate Windows Installer Package
                    </>
                  )}
                </Button>
                
                {isGeneratingExe && (
                  <>
                    <Progress value={progress} className="h-2 progress-bar-animate" />
                    <p className="text-xs text-center text-emulator-text-secondary">
                      Building signed .exe and packaging dependencies...
                    </p>
                  </>
                )}
                
                {saveLocation && (
                  <div className="p-3 bg-emulator-success/20 rounded-md text-sm">
                    <div className="flex items-center text-emulator-success">
                      <Check className="mr-2" size={16} />
                      <span className="font-medium">Package created successfully!</span>
                    </div>
                    <p className="mt-1 text-emulator-text-secondary">
                      Saved as: {saveLocation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-emulator-text-secondary">
              RetroNexus Emulator has been successfully configured as a Windows-compatible application!
            </p>
            
            <div className="p-6 text-center">
              <div className="inline-block p-4 mb-4 rounded-full bg-emulator-accent/20 text-emulator-accent animate-pulse-glow">
                <Shield size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Windows Setup Complete</h3>
              <p className="text-emulator-text-secondary">
                Your Windows-compatible installer package is ready.
                <br />
                The package includes all necessary dependencies and compatibility checks.
              </p>
            </div>
            
            <div className="bg-emulator-highlight/20 p-4 rounded-lg border border-emulator-highlight text-sm">
              <p className="font-bold mb-2">Windows Installation Notes:</p>
              <ul className="list-disc pl-5 space-y-1 text-emulator-text-secondary">
                <li>Run the installer with administrative privileges</li>
                <li>Accept the User Account Control (UAC) prompt when prompted</li>
                <li>Visual C++ and DirectX runtimes will be installed if needed</li>
                <li>The setup wizard will verify hardware meets minimum requirements</li>
                <li>During first boot, press DEL, F2, or F12 to access BIOS settings</li>
              </ul>
            </div>
            
            <div className="flex items-center justify-center p-4">
              <Button 
                onClick={handleGenerateExe}
                className="bg-emulator-accent text-black hover:bg-emulator-accent/80"
                disabled={isGeneratingExe}
              >
                <FileDown className="mr-2" size={16} />
                Download Windows Package Again
              </Button>
            </div>
          </div>
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
            Step {step} of {totalSteps}: {step === 1 ? 'System Check' : step === 2 ? 'Windows Requirements' : 'Complete'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {renderStepContent()}
        </div>
        
        <DialogFooter>
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
            disabled={(step === 1 && (isChecking || (missingFiles.length > 0 && !isInstalling))) || 
                     (step === 2 && isGeneratingExe && !saveLocation) ||
                     isInstalling}
            className={
              step === totalSteps 
                ? "bg-emulator-success text-black hover:bg-emulator-success/80" 
                : "bg-emulator-accent text-black hover:bg-emulator-accent/80"
            }
          >
            {step === totalSteps ? 'Finish' : 'Next'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmulatorSetupWizard;
