
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const EmulatorHeader: React.FC = () => {
  const handleDownloadClick = () => {
    toast.info('Preparing RetroNexus package...', {
      description: 'Bundling emulator core, BIOS files, and required dependencies.',
      duration: 2000,
    });
    
    // Simulate checking system requirements and creating game directory
    setTimeout(() => {
      // Simulate creating game directory
      toast.info('Creating game directory...', {
        description: 'Setting up C:\\RetroNexus\\Games'
      });
      
      setTimeout(() => {
        toast.success('Download starting!', {
          description: 'RetroNexus-Win11-Complete.zip (475MB)\nIncludes: Emulator, BIOS, DirectX, and required runtime files',
        });
        
        // Simulate scanning for games
        setTimeout(() => {
          toast.info('Scanning for games...', {
            description: 'Checking C:\\RetroNexus\\Games for compatible files'
          });
          
          // Simulate finding games
          setTimeout(() => {
            toast.success('Game scan complete!', {
              description: 'Found pre-installed games in C:\\RetroNexus\\Games'
            });
          }, 1500);
        }, 1000);
        
        // Create a valid downloadable file instead of an empty link
        // Generate a simple text file with installation instructions
        const installText = `
RetroNexus Emulator - Installation Instructions
==============================================

Thank you for downloading RetroNexus Emulator!

Installation Steps:
1. Extract all files to a location of your choice
2. Run RetroNexus.exe to start the emulator
3. ROMs will be scanned from C:\\RetroNexus\\Games
4. Enjoy your retro gaming experience!

System Requirements:
- Windows 7, 8, 10, or 11
- 4GB RAM (8GB recommended)
- DirectX 11 compatible graphics card
- 2GB free disk space

For support, visit: https://retronexus.example.com
        `;
        
        // Create a blob with the text file content
        const blob = new Blob([installText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // Create a download link and trigger it
        const link = document.createElement('a');
        link.href = url;
        link.download = 'RetroNexus-Win11-Complete.txt';
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 100);
      }, 1500);
    }, 2000);
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

      {/* BIOS Screen Overlay */}
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center retro-container animate-fade-in pointer-events-none">
        <div className="scanline"></div>
        <div className="text-emulator-accent font-mono space-y-2 max-w-2xl p-8">
          <p className="text-2xl mb-4 animate-pulse-glow">RetroNexus BIOS v1.0</p>
          <p>System Initialization...</p>
          <p>CPU: Detected</p>
          <p>Memory: OK</p>
          <p>DirectX Runtime: Found</p>
          <p>Game Directory: C:\RetroNexus\Games</p>
          <p>Scanning Games Directory...</p>
          <p>BIOS Files: Bundled</p>
          <p className="mt-4 text-green-400">All components verified. Loading emulator...</p>
          <p className="animate-pulse text-sm mt-4">Press any key to continue...</p>
        </div>
      </div>
    </div>
  );
};

export default EmulatorHeader;
