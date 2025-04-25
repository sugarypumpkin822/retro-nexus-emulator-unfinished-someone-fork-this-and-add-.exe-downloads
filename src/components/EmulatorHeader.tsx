
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { createExecutablePackage } from '@/utils/setupUtils';

const EmulatorHeader: React.FC = () => {
  const handleDownloadClick = async () => {
    toast.info('Preparing RetroNexus package...', {
      description: 'Bundling emulator core, BIOS files, and required dependencies.',
      duration: 2000,
    });
    
    try {
      // Simulate checking system requirements
      setTimeout(() => {
        // Simulate creating game directory structure
        toast.info('Creating directory structure...', {
          description: 'Setting up C:\\RetroNexus\\Games and system folders'
        });
        
        setTimeout(() => {
          // Generate the executable package with embedded setup wizard
          createExecutablePackage()
            .then(content => {
              const url = URL.createObjectURL(content);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'RetroNexus-Win11-Complete.zip';
              
              toast.success('Download ready!', {
                description: 'RetroNexus-Win11-Complete.zip (475MB)\nIncludes: Emulator, BIOS, Setup Wizard, DirectX, and all runtime files',
              });
              
              // Start download
              document.body.appendChild(link);
              link.click();
              
              // Clean up
              setTimeout(() => {
                URL.revokeObjectURL(url);
                document.body.removeChild(link);
                
                // Show follow-up information
                setTimeout(() => {
                  toast.info('Installation instructions', {
                    description: 'Run RetroNexus-Setup.exe from the downloaded package to begin installation'
                  });
                }, 1000);
              }, 100);
            })
            .catch(error => {
              console.error("Error creating executable package:", error);
              toast.error("Failed to create download package", {
                description: "Please try again or contact support."
              });
            });
        }, 1500);
      }, 1000);
    } catch (error) {
      console.error("Download error:", error);
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
        
        <Button 
          onClick={handleDownloadClick}
          className="bg-gradient-to-r from-emulator-accent to-emulator-accent-secondary text-black font-bold py-2 px-6 clip-download-button animate-pulse-glow"
        >
          <Download size={18} className="mr-2" />
          Download Complete Package
        </Button>
      </header>
    </div>
  );
};

export default EmulatorHeader;
