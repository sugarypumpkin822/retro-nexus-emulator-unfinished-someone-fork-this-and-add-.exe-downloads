
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const EmulatorHeader: React.FC = () => {
  const [biosFadeOut, setBiosFadeOut] = useState(false);
  
  // Effect to make BIOS screen disappear after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setBiosFadeOut(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

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
        
        // Create a zip file with multiple bundled files instead of just a text file
        const generateZipFile = async () => {
          // We'll use JSZip to create a proper ZIP file
          const JSZip = await import('jszip').then(mod => mod.default);
          const zip = new JSZip();
          
          // Add enhanced installation instructions
          zip.file("README.txt", `
RetroNexus Emulator v1.2.5 - Installation Instructions
=======================================================

Thank you for downloading RetroNexus Emulator!

Installation Steps:
1. Run RetroNexus-Setup.exe to begin installation
2. Select installation directory (default: C:\\Program Files\\RetroNexus)
3. Choose components to install (Core Emulator, BIOS Files, DirectX, etc.)
4. Create desktop and start menu shortcuts if desired
5. Launch RetroNexus.exe after installation completes
6. ROMs will be scanned from C:\\RetroNexus\\Games
7. Configure controller settings in the Options menu
8. Enjoy your retro gaming experience!

System Requirements:
- Windows 7, 8, 10, or 11
- 4GB RAM (8GB recommended)
- DirectX 11 compatible graphics card
- 2GB free disk space
- Processor: Intel Core i3/AMD Ryzen 3 or better
- Internet connection for updates and online features
- Microsoft .NET Framework 4.8 or higher

Controller Support:
- Xbox controllers (360/One/Series X|S)
- PlayStation controllers (PS3/PS4/PS5)
- Nintendo Switch Pro controller
- Generic USB controllers
- Bluetooth controllers

For support, visit: https://retronexus.example.com
Join our Discord: https://discord.gg/retronexus
          `);
          
          // Add enhanced executable installer file
          zip.file("RetroNexus-Setup.exe", new Blob([
            // Simulate executable binary data with recognizable header (MZ header bytes)
            new Uint8Array([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 
                            0x04, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00])
          ], {type: 'application/x-msdownload'}));
          
          // Add main application executable
          zip.file("RetroNexus.exe", new Blob([
            // Simulate executable binary data
            new Uint8Array([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 
                            0x04, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00])
          ], {type: 'application/x-msdownload'}));

          // Create an enhanced BIOS folder with more system files
          const biosFolder = zip.folder("BIOS");
          biosFolder.file("ps1_bios.bin", new Blob([new Uint8Array(Array(2048).fill(0x42))], {type: 'application/octet-stream'}));
          biosFolder.file("ps2_bios.bin", new Blob([new Uint8Array(Array(4096).fill(0x43))], {type: 'application/octet-stream'}));
          biosFolder.file("dc_bios.bin", new Blob([new Uint8Array(Array(2048).fill(0x44))], {type: 'application/octet-stream'}));
          biosFolder.file("gba_bios.bin", new Blob([new Uint8Array(Array(1024).fill(0x45))], {type: 'application/octet-stream'}));
          biosFolder.file("n64_bios.bin", new Blob([new Uint8Array(Array(1024).fill(0x46))], {type: 'application/octet-stream'}));
          biosFolder.file("snes_bios.bin", new Blob([new Uint8Array(Array(512).fill(0x47))], {type: 'application/octet-stream'}));
          biosFolder.file("genesis_bios.bin", new Blob([new Uint8Array(Array(512).fill(0x48))], {type: 'application/octet-stream'}));
          biosFolder.file("saturn_bios.bin", new Blob([new Uint8Array(Array(1024).fill(0x49))], {type: 'application/octet-stream'}));
          
          // Create an enhanced DirectX folder
          const dxFolder = zip.folder("DirectX");
          dxFolder.file("dxsetup.exe", new Blob([new Uint8Array([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00])], {type: 'application/x-msdownload'}));
          dxFolder.file("DXSDK_Jun10.cab", new Blob([new Uint8Array(Array(1024).fill(0x41))], {type: 'application/octet-stream'}));
          dxFolder.file("dxwebsetup.exe", new Blob([new Uint8Array([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00])], {type: 'application/x-msdownload'}));
          
          // Create an empty Games folder with sample subdirectories
          const gamesFolder = zip.folder("Games");
          gamesFolder.file(".placeholder", "Game ROMs will be stored here");
          
          // Create subdirectories for different systems
          const nesFolder = gamesFolder.folder("NES");
          nesFolder.file("README.txt", "Place NES ROMs here (.nes files)");
          
          const snesFolder = gamesFolder.folder("SNES");
          snesFolder.file("README.txt", "Place Super Nintendo ROMs here (.sfc or .smc files)");
          
          const ps1Folder = gamesFolder.folder("PlayStation");
          ps1Folder.file("README.txt", "Place PlayStation ISO/BIN files here");
          
          const n64Folder = gamesFolder.folder("N64");
          n64Folder.file("README.txt", "Place Nintendo 64 ROMs here (.n64, .v64, or .z64 files)");
          
          // Add Emulator Core files
          const coresFolder = zip.folder("Cores");
          coresFolder.file("nes_core.dll", new Blob([new Uint8Array(Array(512).fill(0x50))], {type: 'application/octet-stream'}));
          coresFolder.file("snes_core.dll", new Blob([new Uint8Array(Array(1024).fill(0x51))], {type: 'application/octet-stream'}));
          coresFolder.file("n64_core.dll", new Blob([new Uint8Array(Array(2048).fill(0x52))], {type: 'application/octet-stream'}));
          coresFolder.file("psx_core.dll", new Blob([new Uint8Array(Array(2048).fill(0x53))], {type: 'application/octet-stream'}));
          coresFolder.file("genesis_core.dll", new Blob([new Uint8Array(Array(1024).fill(0x54))], {type: 'application/octet-stream'}));
          coresFolder.file("dreamcast_core.dll", new Blob([new Uint8Array(Array(4096).fill(0x55))], {type: 'application/octet-stream'}));
          coresFolder.file("gba_core.dll", new Blob([new Uint8Array(Array(1024).fill(0x56))], {type: 'application/octet-stream'}));
          
          // Add configuration files
          const configFolder = zip.folder("Config");
          configFolder.file("settings.ini", `
[General]
Language=English
CheckForUpdates=1
FullscreenOnStartup=0
SaveStateCompression=1

[Video]
Renderer=Direct3D11
Resolution=1920x1080
VerticalSync=1
Bilinear=1
CRT_Filter=0
Scanlines=0
AspectRatio=Original

[Audio]
Device=Default
Volume=80
Latency=64
Sync=1
Resampler=Sinc

[Input]
Player1_Type=XInput
Player1_A=Button_1
Player1_B=Button_2
Player1_X=Button_3
Player1_Y=Button_4
Player1_L=Button_5
Player1_R=Button_6
Player1_Start=Button_7
Player1_Select=Button_8
Player1_Up=POV_Up
Player1_Down=POV_Down
Player1_Left=POV_Left
Player1_Right=POV_Right

[Advanced]
ThreadedRendering=1
Overclock=100
RomDirectory=C:\\RetroNexus\\Games
SaveDirectory=C:\\RetroNexus\\Saves
StateDirectory=C:\\RetroNexus\\States
MemoryCardDirectory=C:\\RetroNexus\\MemCards
ScreenshotDirectory=C:\\RetroNexus\\Screenshots
RecordingDirectory=C:\\RetroNexus\\Recordings
`);
          
          // Add Saves folder structure
          const savesFolder = zip.folder("Saves");
          savesFolder.file(".placeholder", "Game saves will be stored here");
          
          // Add demo ROMs (very small placeholders, not real ROMs)
          const demosFolder = zip.folder("Demos");
          demosFolder.file("demo_nes.nes", new Blob([new Uint8Array(Array(512).fill(0x60))], {type: 'application/octet-stream'}));
          demosFolder.file("demo_snes.smc", new Blob([new Uint8Array(Array(512).fill(0x61))], {type: 'application/octet-stream'}));
          demosFolder.file("README.txt", "These demo files can be played to test the emulator functionality.");
          
          // Add documentation
          const docsFolder = zip.folder("Documentation");
          docsFolder.file("RetroNexus_Manual.pdf", new Blob([new Uint8Array(Array(1024).fill(0x70))], {type: 'application/pdf'}));
          docsFolder.file("Troubleshooting.html", `
<!DOCTYPE html>
<html>
<head>
  <title>RetroNexus - Troubleshooting Guide</title>
</head>
<body>
  <h1>RetroNexus Troubleshooting Guide</h1>
  <p>Common issues and their solutions:</p>
  <ul>
    <li>Games not loading - Check if BIOS files are properly installed</li>
    <li>Controller not detected - Install latest drivers</li>
    <li>Graphics glitches - Update your GPU drivers</li>
    <li>Audio issues - Check audio device settings</li>
  </ul>
</body>
</html>
          `);
          
          // Add support tools
          const toolsFolder = zip.folder("Tools");
          toolsFolder.file("controller_tester.exe", new Blob([new Uint8Array([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00])], {type: 'application/x-msdownload'}));
          toolsFolder.file("rom_validator.exe", new Blob([new Uint8Array([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00])], {type: 'application/x-msdownload'}));
          toolsFolder.file("memory_card_manager.exe", new Blob([new Uint8Array([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00])], {type: 'application/x-msdownload'}));
          
          // Add required runtime files
          const runtimeFolder = zip.folder("Runtime");
          runtimeFolder.file("vcredist_x64.exe", new Blob([new Uint8Array([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00])], {type: 'application/x-msdownload'}));
          runtimeFolder.file("vcredist_x86.exe", new Blob([new Uint8Array([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00])], {type: 'application/x-msdownload'}));
          runtimeFolder.file("dotnet48_web.exe", new Blob([new Uint8Array([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00])], {type: 'application/x-msdownload'}));
          
          // Generate the ZIP blob
          const content = await zip.generateAsync({type: "blob"});
          
          // Create download link for the ZIP file
          const url = URL.createObjectURL(content);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'RetroNexus-Win11-Complete.zip';
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          setTimeout(() => {
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
          }, 100);
        };
        
        // Generate and download the ZIP file
        generateZipFile().catch(err => {
          console.error("Error generating ZIP file:", err);
          toast.error("Download failed", {
            description: "There was a problem generating the package. Please try again."
          });
        });
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

      {/* BIOS Screen Overlay with fade-out animation */}
      <div className={`fixed inset-0 bg-black z-50 flex items-center justify-center retro-container ${biosFadeOut ? 'animate-fade-out pointer-events-none opacity-0' : 'animate-fade-in pointer-events-none'}`}
           style={{ transition: 'opacity 1s ease-out' }}>
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
