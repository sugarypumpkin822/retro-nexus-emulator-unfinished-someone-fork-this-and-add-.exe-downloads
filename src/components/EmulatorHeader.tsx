
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const EmulatorHeader: React.FC = () => {
  const handleDownloadClick = () => {
    toast.info('Preparing download...', {
      duration: 2000,
    });
    
    setTimeout(() => {
      toast.success('Download started!', {
        description: 'RetroNexus-Emulator-v1.0.zip (245MB)',
      });
    }, 2000);
  };

  return (
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
        Download Emulator v1.0
      </Button>
    </header>
  );
};

export default EmulatorHeader;
