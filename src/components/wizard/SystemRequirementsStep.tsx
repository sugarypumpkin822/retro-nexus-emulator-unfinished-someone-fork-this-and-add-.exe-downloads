
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, FileDown, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { SystemRequirements } from '@/utils/setupTypes';

interface SystemRequirementsStepProps {
  windowsRequirements: SystemRequirements;
  isGeneratingExe: boolean;
  progress: number;
  saveLocation: string;
  handleGenerateExe: () => void;
}

const SystemRequirementsStep: React.FC<SystemRequirementsStepProps> = ({
  windowsRequirements,
  isGeneratingExe,
  progress,
  saveLocation,
  handleGenerateExe
}) => {
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
};

export default SystemRequirementsStep;
