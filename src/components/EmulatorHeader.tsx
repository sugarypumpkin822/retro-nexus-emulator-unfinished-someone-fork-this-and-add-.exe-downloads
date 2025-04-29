
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { createSetupExe } from '@/utils/packageGenerator/executableGenerator';
import EmulatorSetupWizard from './EmulatorSetupWizard';

const EmulatorHeader: React.FC = () => {
  const [setupWizardOpen, setSetupWizardOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownloadClick = async () => {
    setIsDownloading(true);
    toast.info('Preparing RetroNexus Setup installer...', {
      description: 'Creating standalone installer with automatic content download capability.',
      duration: 2000,
    });
    
    try {
      // Simulate checking system requirements
      setTimeout(() => {
        toast.info('Building Smart Installer...', {
          description: 'Preparing Setup.exe with auto-download functionality'
        });
        
        setTimeout(() => {
          // Generate just the Setup.exe file with enhanced functionality
          const setupExeContent = createSetupExe();
          const blob = new Blob([setupExeContent], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'RetroNexus-Setup.exe';
          
          toast.success('Download ready!', {
            description: 'RetroNexus-Setup.exe includes auto-download capabilities for all required files.',
          });
          
          // Start download
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          setTimeout(() => {
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
            setIsDownloading(false);
            
            // Show follow-up information
            setTimeout(() => {
              toast.info('Installation instructions', {
                description: 'Run RetroNexus-Setup.exe with administrative privileges to download and install all components'
              });
              
              // Offer to open setup wizard
              setTimeout(() => {
                toast(
                  'Need detailed setup instructions?',
                  {
                    action: {
                      label: 'Open Setup Wizard',
                      onClick: () => setSetupWizardOpen(true)
                    },
                    duration: 8000,
                  }
                );
              }, 2000);
            }, 1000);
          }, 100);
        }, 1500);
      }, 1000);
    } catch (error) {
      console.error("Download error:", error);
      setIsDownloading(false);
      toast.error("Download process failed", {
        description: "An unexpected error occurred. Please try again."
      });
    }
  };

  return (
    <div className="relative">
      <header className="flex items-center justify-between w-full px-6 py-3 border-b border-emulator-highlight">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-emulator-accent flex items-center justify-center animate-pulse-glow">
              <span className="text-2xl font-bold text-black">R</span>
            </div>
            <div>
              <h1 
                className="text-2xl font-bold tracking-tighter font-retro glow-text" 
                data-text="RetroNexus"
              >
                RetroNexus
              </h1>
              <p className="text-xs text-emulator-text-secondary">Multi-System Emulator</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setSetupWizardOpen(true)}
            className="bg-emulator-button border-emulator-highlight text-emulator-text hover:bg-emulator-button/80 transition-colors"
            disabled={isDownloading}
          >
            <Settings size={18} className="mr-2" />
            Setup Wizard
          </Button>
          
          <Button 
            onClick={handleDownloadClick}
            className="bg-gradient-to-r from-emulator-accent to-emulator-accent-secondary text-black font-bold py-2 px-6 clip-download-button animate-pulse-glow"
            disabled={isDownloading}
          >
            <Download size={18} className="mr-2" />
            {isDownloading ? 'Preparing...' : 'Download Windows Setup'}
          </Button>
        </div>
      </header>
      
      <EmulatorSetupWizard 
        open={setupWizardOpen} 
        onOpenChange={setSetupWizardOpen}
      />
    </div>
  );
};

export default EmulatorHeader;
