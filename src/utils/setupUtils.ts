
import { toast } from 'sonner';
import { SystemScanResults } from './hardwareScan';
import JSZip from 'jszip';

export interface SetupFile {
  name: string;
  size: string;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  progress: number;
  required: boolean;
}

export interface InstallLocation {
  path: string;
  freeSpace: string;
  recommended: boolean;
}

export const requiredSetupFiles: SetupFile[] = [
  { name: 'RetroNexusCore.dll', size: '245.3 MB', status: 'pending', progress: 0, required: true },
  { name: 'EmulationEngine.dll', size: '156.8 MB', status: 'pending', progress: 0, required: true },
  { name: 'HardwareAcceleration.dll', size: '87.2 MB', status: 'pending', progress: 0, required: true },
  { name: 'DirectX12Runtime.dll', size: '124.5 MB', status: 'pending', progress: 0, required: true },
  { name: 'VulkanSupport.dll', size: '76.3 MB', status: 'pending', progress: 0, required: true },
  { name: 'OpenGLWrapper.dll', size: '45.8 MB', status: 'pending', progress: 0, required: true },
  { name: 'AudioEngine.dll', size: '32.7 MB', status: 'pending', progress: 0, required: true },
  { name: 'InputManager.dll', size: '28.4 MB', status: 'pending', progress: 0, required: true },
  { name: 'NetworkServices.dll', size: '18.9 MB', status: 'pending', progress: 0, required: true },
  { name: 'CoreBIOS.bin', size: '12.6 MB', status: 'pending', progress: 0, required: true },
  { name: 'NESSystem.bin', size: '8.4 KB', status: 'pending', progress: 0, required: true },
  { name: 'SNESSystem.bin', size: '512 KB', status: 'pending', progress: 0, required: true },
  { name: 'N64System.bin', size: '2.4 MB', status: 'pending', progress: 0, required: true },
  { name: 'PSXSystem.bin', size: '4.2 MB', status: 'pending', progress: 0, required: true },
  { name: 'PS2System.bin', size: '8.6 MB', status: 'pending', progress: 0, required: true },
  { name: 'DreamcastSystem.bin', size: '3.8 MB', status: 'pending', progress: 0, required: true },
  { name: 'GBASystem.bin', size: '256 KB', status: 'pending', progress: 0, required: true },
  { name: 'GameCubeSystem.bin', size: '5.7 MB', status: 'pending', progress: 0, required: true },
];

export const optionalSetupFiles: SetupFile[] = [
  { name: 'EnhancedGraphics.dll', size: '98.3 MB', status: 'pending', progress: 0, required: false },
  { name: 'HDTexturePack.zip', size: '1.2 GB', status: 'pending', progress: 0, required: false },
  { name: 'AIUpscaling.dll', size: '145.7 MB', status: 'pending', progress: 0, required: false },
  { name: 'RayTracingSupport.dll', size: '276.5 MB', status: 'pending', progress: 0, required: false },
  { name: 'VirtualSurroundAudio.dll', size: '54.3 MB', status: 'pending', progress: 0, required: false },
  { name: 'PerformanceAnalyzer.dll', size: '32.7 MB', status: 'pending', progress: 0, required: false },
  { name: 'SaveStateManager.dll', size: '18.4 MB', status: 'pending', progress: 0, required: false },
  { name: 'NetplayServices.dll', size: '43.2 MB', status: 'pending', progress: 0, required: false },
  { name: 'ControllerProfiles.zip', size: '24.8 MB', status: 'pending', progress: 0, required: false },
  { name: 'LocalizationPack.zip', size: '76.5 MB', status: 'pending', progress: 0, required: false },
];

export const availableInstallLocations: InstallLocation[] = [
  { path: 'C:\\Program Files\\RetroNexus', freeSpace: '120 GB', recommended: true },
  { path: 'C:\\RetroNexus', freeSpace: '120 GB', recommended: false },
  { path: 'D:\\Games\\RetroNexus', freeSpace: '450 GB', recommended: false },
];

// Simulate installation process
export const runSetupInstallation = (
  selectedFiles: SetupFile[], 
  installLocation: string,
  hardwareScan: SystemScanResults,
  onProgress: (progress: number, status: string) => void,
  onFileProgress: (fileIndex: number, progress: number) => void,
  onComplete: () => void,
  onError: (error: string) => void
): () => void => {
  let isCancelled = false;
  let overallProgress = 0;
  
  // Check if hardware meets minimum requirements
  const hasMinimumRequirements = hardwareScan.cpu.meetsMinimum && 
                               hardwareScan.gpu.meetsMinimum && 
                               hardwareScan.ram.meetsMinimum;
                               
  if (!hasMinimumRequirements) {
    onError('System does not meet minimum requirements');
    return () => { isCancelled = true; };
  }
  
  // Start installation process
  const timer = setTimeout(() => {
    onProgress(5, 'Preparing installation environment...');
    
    // Create necessary directories (simulated)
    setTimeout(() => {
      if (isCancelled) return;
      onProgress(10, `Creating directory structure in ${installLocation}...`);
      
      setTimeout(() => {
        if (isCancelled) return;
        onProgress(15, 'Verifying system compatibility...');
        
        // Download and install files sequentially
        const installFiles = async () => {
          for (let i = 0; i < selectedFiles.length; i++) {
            if (isCancelled) return;
            
            const file = selectedFiles[i];
            onProgress(15 + Math.floor((i / selectedFiles.length) * 70), 
                      `Installing ${file.name} (${i+1}/${selectedFiles.length})...`);
            
            // Simulate file download/installation
            await new Promise<void>((resolve) => {
              let fileProgress = 0;
              const fileInterval = setInterval(() => {
                if (isCancelled) {
                  clearInterval(fileInterval);
                  return;
                }
                
                fileProgress += Math.random() * 5;
                if (fileProgress >= 100) {
                  fileProgress = 100;
                  clearInterval(fileInterval);
                  setTimeout(resolve, 200);
                }
                
                onFileProgress(i, fileProgress);
              }, 200);
            });
          }
          
          if (isCancelled) return;
          
          // Final steps
          onProgress(85, 'Registering system components...');
          setTimeout(() => {
            if (isCancelled) return;
            onProgress(90, 'Creating start menu shortcuts...');
            
            setTimeout(() => {
              if (isCancelled) return;
              onProgress(95, 'Optimizing for detected hardware...');
              
              setTimeout(() => {
                if (isCancelled) return;
                onProgress(100, 'Installation complete!');
                onComplete();
              }, 1000);
            }, 800);
          }, 1000);
        };
        
        installFiles().catch(err => {
          console.error('Installation error:', err);
          onError('Installation failed: ' + (err.message || 'Unknown error'));
        });
      }, 1200);
    }, 1000);
  }, 500);
  
  return () => {
    isCancelled = true;
    clearTimeout(timer);
  };
};

// Create executable simulation
export const createExecutablePackage = async (): Promise<Blob> => {
  // Simulate creating an executable package
  try {
    toast.info('Building executable package...', {
      description: 'This may take a few moments'
    });
    
    const JSZip = await import('jszip').then(mod => mod.default);
    const zip = new JSZip();
    
    // Create a more advanced executable structure
    const createExecutable = (size = 2048) => {
      // PE header and structure for a more realistic EXE
      const dosHeader = new Uint8Array([
        0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, // MZ header
        0x04, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00,
        0xB8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x80, 0x00, 0x00, 0x00,
      ]);
      
      // PE signature and file header
      const peHeader = new Uint8Array([
        0x50, 0x45, 0x00, 0x00, // PE signature
        0x64, 0x86, // Machine (x64)
        0x06, 0x00, // Number of sections
        0x4E, 0x92, 0x42, 0x64, // Time date stamp
        0x00, 0x00, 0x00, 0x00, // Pointer to symbol table
        0x00, 0x00, 0x00, 0x00, // Number of symbols
        0xF0, 0x00, // Size of optional header
        0x22, 0x02, // Characteristics - IMAGE_FILE_EXECUTABLE_IMAGE | IMAGE_FILE_LARGE_ADDRESS_AWARE
      ]);
      
      // More sophisticated file content with section headers
      const headerData = new Uint8Array(Array(512).fill(0).map(() => Math.floor(Math.random() * 256)));
      const dataSection = new Uint8Array(Array(size).fill(0).map(() => Math.floor(Math.random() * 256)));
      
      // Include BIOS and Setup Wizard code segments as binary data
      const biosCodeSegment = new TextEncoder().encode(
        "BIOS_INIT_SEQUENCE:0x4000,BOOT_SECTOR:0x7C00,GRAPHICS_INIT:0x500,ACPI_TABLES:0xE0000," +
        "BIOS_DATA_AREA:0x400,BOOT_SERVICES:0x9FC00,PCI_CONFIG:0xCF8,APIC:0xFEE00000," +
        "RetroNexus BIOS v1.2.5 Copyright (c) 2024 RetroNexus Technologies Inc. All rights reserved." +
        "Press DEL, F2, or F12 to enter BIOS setup. Press F8 for boot menu."
      );
      
      // Setup wizard code segments
      const setupWizardCode = new TextEncoder().encode(
        "RN_SETUP_WIZARD:ENTRY_POINT=0x401000,HARDWARE_SCAN_MODULE=0x402000,FILE_COPY_MODULE=0x403000," +
        "REGISTRY_SETUP=0x404000,DIRECT_X_CHECK=0x405000,VULKAN_CHECK=0x406000,GRAPHICS_TEST=0x407000," +
        "REQUIREMENTS_CHECK=0x408000,TARGET_DIRECTORIES=0x409000,SHORTCUT_CREATION=0x40A000," +
        "SETUP_COMPLETED=0x40B000,ERROR_HANDLER=0x40C000,LOG_SYSTEM=0x40D000," +
        "UNINSTALL_INFO=0x40E000,SIGNATURE=0x40F000"
      );
      
      // Combine to make a full executable
      return new Blob([
        dosHeader, 
        new Uint8Array([...Array(128-dosHeader.length).fill(0)]),
        peHeader,
        new Uint8Array([...Array(256-peHeader.length).fill(0)]),
        headerData,
        biosCodeSegment,
        setupWizardCode,
        dataSection
      ], {type: 'application/x-msdownload'});
    };
    
    // Add main executable and embedded files
    zip.file("RetroNexus-Setup.exe", createExecutable(2048 * 1024)); // 2MB executable
    zip.file("RetroNexus.exe", createExecutable(4096 * 1024)); // 4MB main executable
    
    // Add readme with updated requirements
    zip.file("README.txt", `
RetroNexus Emulator v1.2.5 - Installation Instructions
=====================================================

Thank you for downloading RetroNexus Emulator!

SYSTEM REQUIREMENTS:
-------------------
- CPU: Intel Core i5-14400F / AMD Ryzen 5 7600 or better
- GPU: NVIDIA RTX 4060 8GB / AMD RX 7600 8GB or better
- RAM: 16GB DDR4-3200 / DDR5-5600
- Storage: 50GB SSD space
- DirectX: DirectX 12
- OS: Windows 10 64-bit / Windows 11

INSTALLATION STEPS:
------------------
1. Run RetroNexus-Setup.exe to launch the installation wizard
2. The installer will automatically scan your hardware
3. If your system meets requirements, select installation directory
4. Choose components to install (Core Emulator, BIOS Files, DirectX, etc.)
5. Wait for files to be installed and configured
6. Launch RetroNexus.exe after installation completes

BIOS CONFIGURATION:
------------------
- During first boot, the BIOS configuration will appear
- Press DEL, F2, or F12 during boot to access BIOS settings
- Configure graphics settings and performance options in BIOS
- Save changes and exit to complete setup

TROUBLESHOOTING:
---------------
- If installation fails, check system requirements
- Ensure you have administrative privileges
- Disable antivirus temporarily if installation is blocked
- Update graphics drivers to latest version
- Visit https://retronexus.example.com/support for assistance

For support, visit: https://retronexus.example.com
Join our Discord: https://discord.gg/retronexus
    `);
    
    // Create more embedded files
    const biosFolder = zip.folder("embedded");
    if (biosFolder) {
      biosFolder.file("BIOS_CODE.bin", new Blob([new Uint8Array(Array(4096).fill(0x42))], {type: 'application/octet-stream'}));
      biosFolder.file("SETUP_WIZARD.bin", new Blob([new Uint8Array(Array(8192).fill(0x43))], {type: 'application/octet-stream'}));
      biosFolder.file("HARDWARE_SCAN.dll", new Blob([new Uint8Array(Array(2048).fill(0x44))], {type: 'application/octet-stream'}));
      biosFolder.file("SYSTEM_CHECK.dll", new Blob([new Uint8Array(Array(4096).fill(0x45))], {type: 'application/octet-stream'}));
    }
    
    const content = await zip.generateAsync({type: "blob"});
    return content;
  } catch (error) {
    console.error("Error generating executable package:", error);
    toast.error("Package generation failed", {
      description: "There was a problem creating the setup package."
    });
    throw error;
  }
};
