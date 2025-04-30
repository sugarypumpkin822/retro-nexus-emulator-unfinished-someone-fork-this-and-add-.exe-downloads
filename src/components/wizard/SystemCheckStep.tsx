
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Download, AlertTriangle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { SetupFile } from '@/utils/setupTypes';
import { toast } from 'sonner';

interface SystemCheckStepProps {
  isChecking: boolean;
  progress: number;
  missingFiles: string[];
  requiredSetupFiles: SetupFile[];
  isInstalling: boolean;
  handleInstallMissing: () => void;
}

const SystemCheckStep: React.FC<SystemCheckStepProps> = ({
  isChecking,
  progress,
  missingFiles,
  requiredSetupFiles,
  isInstalling,
  handleInstallMissing,
}) => {
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
                        <span>{file.name}</span>
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
};

export default SystemCheckStep;
