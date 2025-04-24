
import React, { useState, useEffect } from 'react';
import { setupRequiredFiles, systemRequirements } from '@/data/gameData';
import { Button } from '@/components/ui/button';
import { Check, X, Download, AlertTriangle, Loader2 } from 'lucide-react';
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
  const [progress, setProgress] = useState(0);
  const [missingFiles, setMissingFiles] = useState<string[]>([]);
  
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

  const handleInstallMissing = () => {
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
              This is the minimum recommended hardware to run RetroNexus Emulator. Advanced systems may require more powerful hardware.
            </p>
            
            <div className="border border-emulator-highlight rounded-lg overflow-hidden">
              <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight">
                <h4 className="font-bold">System Requirements</h4>
              </div>
              
              <table className="min-w-full">
                <thead>
                  <tr className="bg-emulator-highlight/30 text-xs">
                    <th className="text-left p-3">Component</th>
                    <th className="text-left p-3">Minimum</th>
                    <th className="text-left p-3">Recommended</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emulator-highlight">
                  {systemRequirements.map((req, index) => (
                    <tr key={index} className="text-sm">
                      <td className="p-3 font-medium">{req.component}</td>
                      <td className="p-3 text-emulator-text-secondary">{req.minimum}</td>
                      <td className="p-3 text-emulator-success">{req.recommended}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-emulator-text-secondary">
              RetroNexus Emulator has been successfully configured and is ready to use!
            </p>
            
            <div className="p-6 text-center">
              <div className="inline-block p-4 mb-4 rounded-full bg-emulator-accent/20 text-emulator-accent animate-pulse-glow">
                <Check size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Setup Complete</h3>
              <p className="text-emulator-text-secondary">
                You can now enjoy your games on multiple emulated platforms.
                <br />
                Upload your ROM files or try one of the pre-installed games.
              </p>
            </div>
            
            <div className="bg-emulator-highlight/20 p-4 rounded-lg border border-emulator-highlight text-sm">
              <p className="font-bold mb-2">Remember:</p>
              <ul className="list-disc pl-5 space-y-1 text-emulator-text-secondary">
                <li>Use ROMs and ISOs only for games you legally own</li>
                <li>Backup your save files regularly</li>
                <li>Check for RetroNexus updates to get the latest features</li>
                <li>Adjust graphics settings for optimal performance</li>
              </ul>
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
            RetroNexus Setup Wizard
          </DialogTitle>
          <DialogDescription>
            Step {step} of {totalSteps}: {step === 1 ? 'System Check' : step === 2 ? 'Requirements' : 'Complete'}
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
              disabled={isChecking || isInstalling}
            >
              Back
            </Button>
          )}
          
          <Button 
            onClick={step === totalSteps ? handleComplete : handleNext}
            disabled={(step === 1 && (isChecking || (missingFiles.length > 0 && !isInstalling))) || isInstalling}
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
