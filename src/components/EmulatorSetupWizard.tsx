
import React, { useState, useEffect } from 'react';
import { requiredSetupFiles, optionalSetupFiles } from '@/utils/setupData';
import { Button } from '@/components/ui/button';
import { Check, X, Download, AlertTriangle, Loader2, FileDown, Shield, Cpu, Code, FileCode } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from 'sonner';
import { windowsRequirements } from '@/utils/setupData';
import { createExecutablePackage, verifyRequiredDlls } from '@/utils/packageGenerator/packageBuilder';
import { allExecutableCodes } from '@/utils/executableCodeDefinitions';
import { getAllDlls, getRequiredDlls } from '@/utils/dllCodeDefinitions';
import FileListPagination from './FileListPagination';
import { SetupFile } from '@/utils/setupTypes';

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
  const [currentTabView, setCurrentTabView] = useState("required");
  const [currentFileIndex, setCurrentFileIndex] = useState<number | undefined>(undefined);
  const [installedDlls, setInstalledDlls] = useState<string[]>([]);
  
  // Convert DLL definitions to setup files format
  const requiredDlls: SetupFile[] = getRequiredDlls().map(dll => ({
    name: dll.name,
    size: `${Math.round(dll.size / 1024)}KB`,
    status: 'pending',
    progress: 0,
    required: true
  }));
  
  const optionalDlls: SetupFile[] = getAllDlls()
    .filter(dll => !dll.isRequired)
    .map(dll => ({
      name: dll.name,
      size: `${Math.round(dll.size / 1024)}KB`,
      status: 'pending',
      progress: 0,
      required: false
    }));
  
  // Convert executables to setup files
  const executableFiles: SetupFile[] = Object.values(allExecutableCodes).map(exe => ({
    name: exe.name,
    size: `${Math.round(exe.size / 1024)}KB`,
    status: 'pending',
    progress: 0,
    required: true
  }));
  
  const totalSteps = 4; // Now 4 steps with the DLL management page added
  
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
            const missing = requiredSetupFiles.filter(() => Math.random() > 0.6);
            setMissingFiles(missing);
            
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [open, step]);
  
  // Check if all required DLLs are installed
  const checkRequiredDllsInstalled = (): boolean => {
    const dllVerification = verifyRequiredDlls(installedDlls);
    return dllVerification.isValid;
  };

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
    setInstalledDlls([]);
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
  
  // Handle DLL installation
  const handleInstallDll = (file: SetupFile, index: number) => {
    if (isInstalling) return;
    
    setCurrentFileIndex(index);
    setIsInstalling(true);
    
    // Update the file status
    const updatedFile = {...file, status: 'downloading', progress: 0};
    
    // For DLLs, update in either required or optional arrays
    if (currentTabView === "required") {
      requiredDlls[requiredDlls.findIndex(f => f.name === file.name)] = updatedFile;
    } else if (currentTabView === "optional") {
      optionalDlls[optionalDlls.findIndex(f => f.name === file.name)] = updatedFile;
    } else if (currentTabView === "executables") {
      executableFiles[executableFiles.findIndex(f => f.name === file.name)] = updatedFile;
    }
    
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Mark as completed
        if (currentTabView === "required") {
          requiredDlls[requiredDlls.findIndex(f => f.name === file.name)].status = 'completed';
          requiredDlls[requiredDlls.findIndex(f => f.name === file.name)].progress = 100;
        } else if (currentTabView === "optional") {
          optionalDlls[optionalDlls.findIndex(f => f.name === file.name)].status = 'completed';
          optionalDlls[optionalDlls.findIndex(f => f.name === file.name)].progress = 100;
        } else if (currentTabView === "executables") {
          executableFiles[executableFiles.findIndex(f => f.name === file.name)].status = 'completed';
          executableFiles[executableFiles.findIndex(f => f.name === file.name)].progress = 100;
        }
        
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
                          {requiredSetupFiles.map((file, index) => (
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
        // The new DLL Management step
        return (
          <div className="space-y-4">
            <p className="text-emulator-text-secondary">
              Install and manage the required DLL files for the RetroNexus Emulator. <strong>All required DLLs must be installed</strong> for the emulator to function properly.
            </p>
            
            <Tabs defaultValue="required" onValueChange={setCurrentTabView}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="required">
                  Required DLLs
                  <span className="ml-2 px-2 py-0.5 text-xs bg-emulator-error/20 text-emulator-error rounded-full">
                    {requiredDlls.filter(dll => dll.status === 'completed').length}/{requiredDlls.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="optional">Optional DLLs</TabsTrigger>
                <TabsTrigger value="executables">Executables</TabsTrigger>
              </TabsList>
              
              <TabsContent value="required" className="mt-4 space-y-4">
                <div className="bg-emulator-highlight/10 p-3 rounded-md text-sm text-emulator-text-secondary border border-emulator-highlight mb-4">
                  <div className="flex items-center mb-1">
                    <AlertTriangle className="mr-2 text-emulator-warning" size={16} />
                    <span className="text-emulator-warning font-medium">All these DLLs are required</span>
                  </div>
                  <p>The RetroNexus Emulator requires all of these DLLs to function properly. Make sure to install them all.</p>
                </div>
                
                <FileListPagination 
                  files={requiredDlls} 
                  onFileAction={handleInstallDll}
                  isProcessingFile={isInstalling}
                  currentFileIndex={currentFileIndex}
                />
              </TabsContent>
              
              <TabsContent value="optional" className="mt-4">
                <div className="bg-emulator-highlight/10 p-3 rounded-md text-sm text-emulator-text-secondary border border-emulator-highlight mb-4">
                  <div className="flex items-center mb-1">
                    <FileCode className="mr-2 text-emulator-accent" size={16} />
                    <span className="text-emulator-accent font-medium">Optional enhancements</span>
                  </div>
                  <p>These DLLs add additional features like enhanced graphics or controller support but are not required.</p>
                </div>
                
                <FileListPagination 
                  files={optionalDlls} 
                  onFileAction={handleInstallDll}
                  isProcessingFile={isInstalling}
                  currentFileIndex={currentFileIndex}
                />
              </TabsContent>
              
              <TabsContent value="executables" className="mt-4">
                <div className="bg-emulator-highlight/10 p-3 rounded-md text-sm text-emulator-text-secondary border border-emulator-highlight mb-4">
                  <div className="flex items-center mb-1">
                    <Code className="mr-2 text-emulator-accent" size={16} />
                    <span className="text-emulator-accent font-medium">Executable Files</span>
                  </div>
                  <p>These are the main executable files required for RetroNexus Emulator.</p>
                </div>
                
                <FileListPagination 
                  files={executableFiles} 
                  onFileAction={handleInstallDll}
                  isProcessingFile={isInstalling}
                  currentFileIndex={currentFileIndex}
                />
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 pt-4 border-t border-emulator-highlight">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">DLL Installation Status</p>
                  <p className="text-xs text-emulator-text-secondary">
                    {installedDlls.length} of {getRequiredDlls().length} required DLLs installed
                  </p>
                </div>
                
                <div>
                  {checkRequiredDllsInstalled() ? (
                    <div className="flex items-center text-emulator-success">
                      <Check size={16} className="mr-1" />
                      <span className="text-sm">All required DLLs installed</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-emulator-error">
                      <AlertTriangle size={16} className="mr-1" />
                      <span className="text-sm">Missing required DLLs</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        // System requirements - now step 3 instead of 2
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
      
      case 4:
        // Completion - now step 4 instead of 3
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
                     (step === 2 && !checkRequiredDllsInstalled()) ||
                     (step === 3 && isGeneratingExe && !saveLocation) ||
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
