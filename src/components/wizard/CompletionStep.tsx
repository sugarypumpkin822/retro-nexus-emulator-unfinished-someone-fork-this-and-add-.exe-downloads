
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, FileDown } from 'lucide-react';

interface CompletionStepProps {
  handleGenerateExe: () => void;
  isGeneratingExe: boolean;
}

const CompletionStep: React.FC<CompletionStepProps> = ({
  handleGenerateExe,
  isGeneratingExe
}) => {
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
};

export default CompletionStep;
