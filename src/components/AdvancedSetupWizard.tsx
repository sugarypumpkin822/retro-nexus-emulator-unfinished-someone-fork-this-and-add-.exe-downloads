import React, { useState, useEffect, useCallback } from 'react';
import { 
  detectSystemHardware, 
  SystemScanResults, 
  analyzeSystemCompatibility,
  generateSystemRequirements
} from '@/utils/hardwareScan';
import { 
  SetupFile, 
  requiredSetupFiles, 
  optionalSetupFiles,
  availableInstallLocations,
  runSetupInstallation,
  InstallLocation
} from '@/utils/setupUtils';

import { Button } from '@/components/ui/button';
import { 
  Check, 
  X, 
  Download, 
  AlertTriangle, 
  Loader2, 
  HardDrive, 
  Cpu, 
  Save, 
  ChevronLeft, 
  ChevronRight,
  Info
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from "@/components/ui/slider";

interface AdvancedSetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdvancedSetupWizard: React.FC<AdvancedSetupWizardProps> = ({ 
  open, 
  onOpenChange 
}) => {
  // Wizard state
  const [step, setStep] = useState(1);
  const [installingFiles, setInstallingFiles] = useState<SetupFile[]>([]);
  const [installLocation, setInstallLocation] = useState<string>(availableInstallLocations[0].path);
  const [selectedOptionalFiles, setSelectedOptionalFiles] = useState<string[]>([]);
  
  // Progress tracking
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [installProgress, setInstallProgress] = useState(0);
  const [installStatus, setInstallStatus] = useState('');
  const [isInstalling, setIsInstalling] = useState(false);
  const [installCancelFn, setInstallCancelFn] = useState<(() => void) | null>(null);
  
  // Hardware detection results
  const [hardwareScan, setHardwareScan] = useState<SystemScanResults | null>(null);
  const [compatibility, setCompatibility] = useState<{
    overallCompatible: boolean;
    criticalIssues: string[];
    recommendations: string[];
  } | null>(null);
  
  // Advanced options
  const [createDesktopShortcut, setCreateDesktopShortcut] = useState(true);
  const [createStartMenuEntry, setCreateStartMenuEntry] = useState(true);
  const [installDirectX, setInstallDirectX] = useState(true);
  const [installVulkan, setInstallVulkan] = useState(true);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [preloadRoms, setPreloadRoms] = useState(false);
  
  const totalSteps = 5;
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setIsScanning(false);
      setScanProgress(0);
      setHardwareScan(null);
      setCompatibility(null);
      setInstallProgress(0);
      setInstallStatus('');
      setIsInstalling(false);
      setInstallingFiles([...requiredSetupFiles]);
      setInstallLocation(availableInstallLocations[0].path);
      setSelectedOptionalFiles([]);
      if (installCancelFn) {
        installCancelFn();
        setInstallCancelFn(null);
      }
    }
  }, [open, installCancelFn]);
  
  // Start hardware scan when entering step 1
  useEffect(() => {
    if (open && step === 1 && !hardwareScan) {
      startHardwareScan();
    }
  }, [open, step, hardwareScan]);
  
  // Function to initiate hardware scanning
  const startHardwareScan = useCallback(() => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate progress indicators
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) {
          clearInterval(scanInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 200);
    
    // Perform actual hardware detection
    detectSystemHardware().then(results => {
      // Ensure we hit 100% for UX reasons
      setScanProgress(100);
      setHardwareScan(results);
      setIsScanning(false);
      
      // Analyze compatibility based on scan results
      const compatibilityResults = analyzeSystemCompatibility(results);
      setCompatibility(compatibilityResults);
      
      // Show toast based on compatibility
      if (compatibilityResults.overallCompatible) {
        toast.success('Hardware scan complete', {
          description: 'Your system meets the minimum requirements.'
        });
      } else {
        toast.error('Hardware compatibility issues detected', {
          description: 'Your system may not meet minimum requirements.'
        });
      }
    }).catch(error => {
      console.error('Hardware scan error:', error);
      setIsScanning(false);
      setScanProgress(0);
      toast.error('Hardware scan failed', {
        description: 'Could not detect system specifications.'
      });
    }).finally(() => {
      clearInterval(scanInterval);
    });
  }, []);
  
  // Handle file selection for optional components
  const handleOptionalFileToggle = (fileName: string) => {
    setSelectedOptionalFiles(prev => {
      if (prev.includes(fileName)) {
        return prev.filter(name => name !== fileName);
      } else {
        return [...prev, fileName];
      }
    });
  };
  
  // Update installing files when optional selections change
  useEffect(() => {
    const selected = [
      ...requiredSetupFiles,
      ...optionalSetupFiles.filter(file => selectedOptionalFiles.includes(file.name))
    ];
    setInstallingFiles(selected);
  }, [selectedOptionalFiles]);
  
  // Handle file progress updates during installation
  const handleFileProgress = useCallback((fileIndex: number, progress: number) => {
    setInstallingFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[fileIndex]) {
        newFiles[fileIndex] = {
          ...newFiles[fileIndex],
          progress: progress,
          status: progress < 100 ? 'downloading' : 'completed'
        };
      }
      return newFiles;
    });
  }, []);
  
  // Start installation process
  const startInstallation = useCallback(() => {
    setIsInstalling(true);
    setInstallProgress(0);
    setInstallStatus('Initializing installation...');
    
    if (hardwareScan) {
      // Run the installation process
      const cancelFn = runSetupInstallation(
        installingFiles,
        installLocation,
        hardwareScan,
        (progress, status) => {
          setInstallProgress(progress);
          setInstallStatus(status);
        },
        handleFileProgress,
        () => {
          // On installation complete
          setIsInstalling(false);
          setInstallProgress(100);
          setInstallStatus('Installation complete! Press Next to continue.');
          toast.success('Installation completed successfully!', {
            description: 'RetroNexus has been installed on your system.'
          });
          setInstallCancelFn(null);
        },
        (error) => {
          // On installation error
          setIsInstalling(false);
          setInstallProgress(0);
          setInstallStatus('');
          toast.error('Installation failed', {
            description: error
          });
          setInstallCancelFn(null);
        }
      );
      
      setInstallCancelFn(() => cancelFn);
    } else {
      toast.error('Cannot start installation', {
        description: 'Hardware scan not completed.'
      });
      setIsInstalling(false);
    }
  }, [installingFiles, installLocation, hardwareScan, handleFileProgress]);
  
  // Cancel installation if in progress
  const cancelInstallation = useCallback(() => {
    if (installCancelFn) {
      installCancelFn();
      setInstallCancelFn(null);
    }
    setIsInstalling(false);
    setInstallProgress(0);
    setInstallStatus('Installation cancelled');
    toast.info('Installation cancelled', {
      description: 'The installation process has been cancelled.'
    });
  }, [installCancelFn]);
  
  // Navigation between steps
  const handleNext = () => {
    // Special handling for each step
    if (step === 3 && !isInstalling && installProgress === 0) {
      startInstallation();
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      // Cancel any ongoing installation
      if (step === 3 && isInstalling) {
        cancelInstallation();
      }
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    toast.success('Setup completed successfully!', {
      description: 'You can now start using RetroNexus Emulator.'
    });
    onOpenChange(false);
  };
  
  // Component to render based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1: // System scan
        return (
          <div className="space-y-4">
            <p className="text-emulator-text-secondary mb-4">
              The setup wizard will scan your system for hardware compatibility and 
              required components. This process ensures RetroNexus will run optimally 
              on your system.
            </p>
            
            {isScanning ? (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Scanning system hardware...</span>
                  <span>{scanProgress}%</span>
                </div>
                <Progress 
                  value={scanProgress} 
                  className="h-2" 
                />
                <div className="space-y-2 py-3">
                  <p className="text-xs text-emulator-text-secondary animate-pulse">
                    <Cpu className="inline mr-2 h-4 w-4" />
                    Detecting CPU architecture...
                  </p>
                  <p className="text-xs text-emulator-text-secondary animate-pulse">
                    <HardDrive className="inline mr-2 h-4 w-4" />
                    Scanning hardware components...
                  </p>
                  <p className="text-xs text-emulator-text-secondary animate-pulse">
                    <Info className="inline mr-2 h-4 w-4" />
                    Analyzing system capabilities...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {hardwareScan ? (
                  <div className="border border-emulator-highlight rounded-lg overflow-hidden">
                    <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight">
                      <h4 className="font-bold">System Scan Results</h4>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.values(hardwareScan).map((component, index) => (
                          <div key={index} className="border border-emulator-highlight/50 rounded p-3 bg-emulator-card-bg/50">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{component.name}</span>
                              {component.meetsMinimum ? (
                                <span className="text-emulator-success flex items-center">
                                  <Check size={16} className="mr-1" />
                                  Compatible
                                </span>
                              ) : (
                                <span className="text-emulator-error flex items-center">
                                  <AlertTriangle size={16} className="mr-1" />
                                  Below Minimum
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-emulator-text-primary">{component.details}</p>
                            <p className="text-xs text-emulator-text-secondary mt-1">
                              Recommended: {component.recommendedSpec}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      {compatibility && (
                        <div className="mt-4">
                          {compatibility.criticalIssues.length > 0 && (
                            <div className="bg-emulator-error/20 border border-emulator-error/30 rounded p-3 mb-3">
                              <h5 className="font-semibold text-emulator-error mb-2 flex items-center">
                                <AlertTriangle size={16} className="mr-2" />
                                Critical Issues
                              </h5>
                              <ul className="space-y-1 text-sm">
                                {compatibility.criticalIssues.map((issue, index) => (
                                  <li key={index} className="flex items-start">
                                    <X className="mr-2 text-emulator-error flex-shrink-0 mt-0.5" size={14} />
                                    <span>{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {compatibility.recommendations.length > 0 && (
                            <div className="bg-emulator-warning/10 border border-emulator-warning/30 rounded p-3">
                              <h5 className="font-semibold text-emulator-warning mb-2 flex items-center">
                                <Info size={16} className="mr-2" />
                                Recommendations
                              </h5>
                              <ul className="space-y-1 text-sm">
                                {compatibility.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start">
                                    <Info className="mr-2 text-emulator-warning flex-shrink-0 mt-0.5" size={14} />
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {compatibility.criticalIssues.length === 0 && (
                            <div className="bg-emulator-success/10 border border-emulator-success/30 rounded p-3 mt-3">
                              <div className="flex items-center">
                                <Check size={18} className="mr-2 text-emulator-success" />
                                <p className="text-emulator-success font-medium">
                                  Your system meets all requirements for RetroNexus Emulator.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {!hardwareScan && (
                        <Button 
                          onClick={startHardwareScan}
                          className="w-full mt-4 bg-emulator-button border border-emulator-highlight hover:bg-emulator-highlight"
                        >
                          Scan System Again
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <div className="mb-4">
                      <AlertTriangle size={40} className="mx-auto text-emulator-warning" />
                    </div>
                    <p className="mb-4 text-emulator-text-secondary">
                      No hardware scan results available. Please run a system scan first.
                    </p>
                    <Button 
                      onClick={startHardwareScan}
                      className="bg-emulator-accent text-black hover:bg-emulator-accent"
                    >
                      <Cpu size={16} className="mr-2" />
                      Start System Scan
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            <div className="border border-emulator-highlight rounded-lg overflow-hidden mt-4">
              <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight">
                <h4 className="font-bold">System Requirements</h4>
              </div>
              
              <div className="p-4">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-emulator-highlight">
                      <th className="text-left pb-2">Component</th>
                      <th className="text-left pb-2">Minimum</th>
                      <th className="text-left pb-2">Recommended</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emulator-highlight/30">
                    {generateSystemRequirements().map((req, index) => (
                      <tr key={index}>
                        <td className="py-2 font-medium">{req.component}</td>
                        <td className="py-2 text-emulator-text-secondary">{req.minimum}</td>
                        <td className="py-2 text-emulator-success">{req.recommended}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 2: // Installation options
        return (
          <div className="space-y-4">
            <p className="text-emulator-text-secondary mb-4">
              Configure your installation preferences and select additional components to install.
            </p>
            
            <div className="border border-emulator-highlight rounded-lg overflow-hidden">
              <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight">
                <h4 className="font-bold">Installation Location</h4>
              </div>
              
              <div className="p-4">
                <Select 
                  value={installLocation} 
                  onValueChange={setInstallLocation}
                >
                  <SelectTrigger className="bg-emulator-button border-emulator-highlight">
                    <SelectValue placeholder="Select installation directory" />
                  </SelectTrigger>
                  <SelectContent className="bg-emulator-card-bg border-emulator-highlight">
                    {availableInstallLocations.map((loc, index) => (
                      <SelectItem key={index} value={loc.path}>
                        <div className="flex justify-between w-full">
                          <span>{loc.path}</span>
                          <span className="text-xs text-emulator-text-secondary">
                            {loc.freeSpace} free
                            {loc.recommended && ' (Recommended)'}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <p className="text-xs text-emulator-text-secondary mt-2">
                  RetroNexus will require approximately 2.5GB of disk space for core files.
                  Additional space will be needed for ROMs and save states.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-emulator-highlight rounded-lg overflow-hidden">
                <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight">
                  <h4 className="font-bold">Required Components</h4>
                </div>
                
                <ScrollArea className="h-40 p-4">
                  <ul className="space-y-2">
                    {requiredSetupFiles.map((file, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Checkbox checked disabled className="mr-2" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <span className="text-xs text-emulator-text-secondary">{file.size}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
              
              <div className="border border-emulator-highlight rounded-lg overflow-hidden">
                <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight">
                  <h4 className="font-bold">Optional Components</h4>
                </div>
                
                <ScrollArea className="h-40 p-4">
                  <ul className="space-y-2">
                    {optionalSetupFiles.map((file, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Checkbox 
                            id={`opt-${index}`}
                            checked={selectedOptionalFiles.includes(file.name)}
                            onCheckedChange={() => handleOptionalFileToggle(file.name)}
                            className="mr-2"
                          />
                          <label 
                            htmlFor={`opt-${index}`} 
                            className="text-sm cursor-pointer"
                          >
                            {file.name}
                          </label>
                        </div>
                        <span className="text-xs text-emulator-text-secondary">{file.size}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </div>
            
            <div className="border border-emulator-highlight rounded-lg overflow-hidden">
              <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight">
                <h4 className="font-bold">Advanced Options</h4>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={createDesktopShortcut} 
                    onCheckedChange={setCreateDesktopShortcut}
                    className="data-[state=checked]:bg-emulator-accent"
                  />
                  <span className="text-sm">Create Desktop Shortcut</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={createStartMenuEntry} 
                    onCheckedChange={setCreateStartMenuEntry}
                    className="data-[state=checked]:bg-emulator-accent"
                  />
                  <span className="text-sm">Create Start Menu Entry</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={installDirectX} 
                    onCheckedChange={setInstallDirectX}
                    className="data-[state=checked]:bg-emulator-accent"
                  />
                  <span className="text-sm">Install DirectX Components</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={installVulkan} 
                    onCheckedChange={setInstallVulkan}
                    className="data-[state=checked]:bg-emulator-accent"
                  />
                  <span className="text-sm">Install Vulkan Runtime</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={autoUpdateEnabled} 
                    onCheckedChange={setAutoUpdateEnabled}
                    className="data-[state=checked]:bg-emulator-accent"
                  />
                  <span className="text-sm">Enable Automatic Updates</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={preloadRoms} 
                    onCheckedChange={setPreloadRoms}
                    className="data-[state=checked]:bg-emulator-accent"
                  />
                  <span className="text-sm">Preload Sample ROMs</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3: // Installation progress
        return (
          <div className="space-y-4">
            <p className="text-emulator-text-secondary mb-4">
              RetroNexus is being installed on your system. This process may take several minutes 
              depending on your system speed and selected components.
            </p>
            
            <div className="border border-emulator-highlight rounded-lg overflow-hidden">
              <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight">
                <h4 className="font-bold">Installation Progress</h4>
              </div>
              
              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{installStatus}</span>
                    <span>{installProgress}%</span>
                  </div>
                  <Progress 
                    value={installProgress} 
                    className="h-2" 
                  />
                </div>
                
                <div className="mt-4">
                  <ScrollArea className="h-40 border border-emulator-highlight/50 rounded p-2 bg-black/30">
                    <div className="space-y-1 font-mono text-xs">
                      {installingFiles.map((file, index) => (
                        <div key={index} className="flex items-center">
                          {file.status === 'pending' && (
                            <div className="w-4 h-4 mr-2 flex-shrink-0"></div>
                          )}
                          {file.status === 'downloading' && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin text-emulator-accent flex-shrink-0" />
                          )}
                          {file.status === 'completed' && (
                            <Check className="w-4 h-4 mr-2 text-emulator-success flex-shrink-0" />
                          )}
                          {file.status === 'error' && (
                            <X className="w-4 h-4 mr-2 text-emulator-error flex-shrink-0" />
                          )}
                          
                          <span className={`flex-1 ${file.status === 'completed' ? 'text-emulator-success' : file.status === 'error' ? 'text-emulator-error' : 'text-emulator-text-secondary'}`}>
                            {file.name}
                          </span>
                          
                          <div className="flex items-center">
                            <Progress 
                              value={file.progress} 
                              className="h-1 w-20 mr-2" 
                            />
                            <span className="w-8 text-right">{Math.round(file.progress)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                {isInstalling && (
                  <Button 
                    onClick={cancelInstallation}
                    variant="destructive" 
                    className="mt-4"
                  >
                    Cancel Installation
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      
      case 4: // Configuration
        return (
          <div className="space-y-4">
            <p className="text-emulator-text-secondary mb-4">
              Configure additional settings for RetroNexus. These settings can also be changed 
              later from the BIOS or emulator settings.
            </p>
            
            <div className="border border-emulator-highlight rounded-lg overflow-hidden">
              <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight">
                <h4 className="font-bold">BIOS Settings</h4>
              </div>
              
              <div className="p-4 space-y-4">
                <p className="text-sm text-emulator-text-secondary">
                  RetroNexus features a customizable BIOS interface that can be accessed 
                  during startup. Configure key BIOS preferences below:
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">BIOS Access Key</label>
                    <Select defaultValue="del">
                      <SelectTrigger className="bg-emulator-button border-emulator-highlight">
                        <SelectValue placeholder="Select BIOS key" />
                      </SelectTrigger>
                      <SelectContent className="bg-emulator-card-bg border-emulator-highlight">
                        <SelectItem value="del">DEL key</SelectItem>
                        <SelectItem value="f2">F2 key</SelectItem>
                        <SelectItem value="f12">F12 key</SelectItem>
                        <SelectItem value="all">All keys (DEL, F2, F12)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Auto Boot Delay</label>
                    <div className="flex items-center space-x-2">
                      <Slider 
                        defaultValue={[5]} 
                        max={10}
                        min={0} 
                        step={1}
                        className="bg-emulator-button"
                      />
                      <span className="min-w-12 text-right">5 sec</span>
                    </div>
                    <p className="text-xs text-emulator-text-secondary mt-1">
                      Time to wait before auto-booting the emulator.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-emulator-highlight rounded-lg overflow-hidden">
              <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight">
                <h4 className="font-bold">Default Graphics Settings</h4>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Resolution Scaling</label>
                  <Select defaultValue="1x">
                    <SelectTrigger className="bg-emulator-button border-emulator-highlight">
                      <SelectValue placeholder="Select resolution scaling" />
                    </SelectTrigger>
                    <SelectContent className="bg-emulator-card-bg border-emulator-highlight">
                      <SelectItem value="0.5x">0.5x (Performance)</SelectItem>
                      <SelectItem value="1x">1x (Native)</SelectItem>
                      <SelectItem value="2x">2x (High Quality)</SelectItem>
                      <SelectItem value="3x">3x (Ultra Quality)</SelectItem>
                      <SelectItem value="auto">Automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
                  <Select defaultValue="auto">
                    <SelectTrigger className="bg-emulator-button border-emulator-highlight">
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent className="bg-emulator-card-bg border-emulator-highlight">
                      <SelectItem value="4:3">4:3 (Classic)</SelectItem>
                      <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                      <SelectItem value="auto">Auto (Original)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    defaultChecked={true}
                    className="data-[state=checked]:bg-emulator-accent"
                  />
                  <span className="text-sm">Enable Shader Effects</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    defaultChecked={true}
                    className="data-[state=checked]:bg-emulator-accent"
                  />
                  <span className="text-sm">Hardware Acceleration</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    defaultChecked={true}
                    className="data-[state=checked]:bg-emulator-accent"
                  />
                  <span className="text-sm">V-Sync</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    defaultChecked={false}
                    className="data-[state=checked]:bg-emulator-accent"
                  />
                  <span className="text-sm">CRT Effects</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                toast.success('Settings saved', {
                  description: 'Your configuration has been saved and will be applied on first launch.'
                });
              }}
              className="bg-emulator-accent text-black hover:bg-emulator-accent/80 w-full"
            >
              <Save size={16} className="mr-2" />
              Save Configuration
            </Button>
          </div>
        );
      
      case 5: // Complete
        return (
          <div className="space-y-6">
            <div className="p-6 text-center">
              <div className="inline-block p-4 mb-4 rounded-full bg-emulator-accent/20 text-emulator-accent">
                <Check size={40} />
              </div>
              
              <h3 className="text-xl font-bold mb-2">Installation Complete</h3>
              
              <p className="text-emulator-text-secondary">
                RetroNexus Emulator has been successfully installed on your system.
                <br />
                You can now enjoy retro gaming with advanced emulation capabilities.
              </p>
            </div>
            
            <div className="bg-emulator-highlight/20 p-4 rounded-lg border border-emulator-highlight text-sm">
              <h4 className="font-bold mb-2">Quick Start Guide</h4>
              
              <ul className="space-y-2 text-emulator-text-secondary">
                <li className="flex items-start">
                  <Check size={16} className="mr-2 text-emulator-success flex-shrink-0 mt-0.5" />
                  Launch RetroNexus from your desktop or start menu
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 text-emulator-success flex-shrink-0 mt-0.5" />
                  Press <span className="font-mono bg-black/30 px-1 rounded">DEL</span>, <span className="font-mono bg-black/30 px-1 rounded">F2</span>, or <span className="font-mono bg-black/30 px-1 rounded">F12</span> during startup to access BIOS settings
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 text-emulator-success flex-shrink-0 mt-0.5" />
                  Configure graphics settings in the BIOS for optimal performance
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 text-emulator-success flex-shrink-0 mt-0.5" />
                  Upload your ROM files or try the pre-installed games
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 text-emulator-success flex-shrink-0 mt-0.5" />
                  Save states and configurations are stored in your installation directory
                </li>
              </ul>
            </div>
            
            <Separator />
            
            <div className="flex justify-center">
              <Button 
                onClick={handleComplete}
                className="bg-emulator-accent text-black hover:bg-emulator-accent/80 px-8 py-6 text-lg"
              >
                Start RetroNexus
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] bg-emulator-card-bg border-emulator-highlight">
        <DialogHeader>
          <DialogTitle className="text-xl font-retro tracking-wide glow-text">
            RetroNexus Advanced Setup Wizard
          </DialogTitle>
          <DialogDescription>
            Step {step} of {totalSteps}: {
              step === 1 ? 'System Requirements Check' : 
              step === 2 ? 'Installation Options' : 
              step === 3 ? 'Installing Files' : 
              step === 4 ? 'Configuration' : 'Complete'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 overflow-y-auto">
          {renderStepContent()}
        </div>
        
        <DialogFooter>
          {step > 1 && step !== 5 && (
            <Button 
              onClick={handleBack} 
              variant="outline" 
              className="bg-emulator-button border-emulator-highlight"
              disabled={step === 3 && isInstalling}
            >
              <ChevronLeft className="mr-1" size={16} />
              Back
            </Button>
          )}
          
          {step < totalSteps && (
            <Button 
              onClick={handleNext}
              disabled={
                (step === 1 && (!hardwareScan || isScanning)) ||
                (step === 3 && isInstalling)
              }
              className={
                step === totalSteps - 1
                  ? "bg-emulator-success text-black hover:bg-emulator-success/80" 
                  : "bg-emulator-accent text-black hover:bg-emulator-accent/80"
              }
            >
              {step === 3 && installProgress === 0 && !isInstalling ? (
                <>
                  <Download className="mr-1" size={16} />
                  Start Installation
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-1" size={16} />
                </>
              )}
            </Button>
          )}
          
          {step === totalSteps && (
            <Button 
              onClick={handleComplete}
              className="bg-emulator-success text-black hover:bg-emulator-success/80"
            >
              Finish
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSetupWizard;
