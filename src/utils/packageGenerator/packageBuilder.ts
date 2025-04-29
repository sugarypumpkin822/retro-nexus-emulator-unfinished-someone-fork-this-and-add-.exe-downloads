
import JSZip from 'jszip';
import { createFolderStructure } from './folderGenerator';
import { 
  createVCRedistFile,
  createDirectX12File,
  createDLLFiles,
  createConfigFiles,
  createSystemCoreDll,
  createFolderReadme,
  createSampleConfigFile,
  createSampleShaderFile,
  createSampleThemeFile,
  createSampleLogFile,
  createDummyPdfFile,
  createCompatibilityListHtml,
  createLegalText,
  createMainReadmeFile,
  createDummyBiosFile
} from './fileGenerators';
import { 
  createWindowsExecutableText,
  createEmulatorExe,
  createLauncherExe,
  createUpdaterExe,
  createCrashHandlerExe,
  createSetupExe
} from './executableGenerator';

/**
 * Create a complete executable package containing all necessary files
 */
export const createExecutablePackage = async (): Promise<Blob> => {
  try {
    const zip = new JSZip();
    
    // Add main executable files
    zip.file('RetroNexus.exe', createWindowsExecutableText());
    zip.file('Emulator.exe', createEmulatorExe());
    zip.file('Launcher.exe', createLauncherExe());
    zip.file('Updater.exe', createUpdaterExe());
    zip.file('CrashHandler.exe', createCrashHandlerExe());
    zip.file('Setup.exe', createSetupExe());
    
    // Add support files
    zip.file('VC_redist.x64.exe', createVCRedistFile());
    zip.file('dxsetup.exe', createDirectX12File());
    
    // Create DLL files
    createDLLFiles().forEach(dll => {
      zip.file(dll.name, dll.content);
    });
    
    // Create main configuration files
    const configs = createConfigFiles();
    zip.file('RetroNexusConfig.ini', configs.mainConfig);
    zip.file('RetroNexusBIOS.ini', configs.biosConfig);
    
    // Create folder structure with readme files in each
    const folders = createFolderStructure(zip);
    
    folders.forEach(folder => {
      zip.file(`${folder}/readme.txt`, createFolderReadme(folder));
    });
    
    // Add sample files for certain folders
    zip.file('configs/default.ini', createSampleConfigFile());
    zip.file('shaders/crt.glsl', createSampleShaderFile());
    zip.file('themes/default.json', createSampleThemeFile());
    zip.file('logs/startup.log', createSampleLogFile());
    
    // Add documentation files
    zip.file('docs/manual.pdf', createDummyPdfFile('RetroNexus User Manual'));
    zip.file('docs/compatibility.html', createCompatibilityListHtml());
    zip.file('docs/legal.txt', createLegalText());
    zip.file('README.txt', createMainReadmeFile());
    
    // Add sample BIOS files (text-based representations)
    zip.file('cores/bios/ps1_bios.bin', createDummyBiosFile('PlayStation BIOS'));
    zip.file('cores/bios/dreamcast_bios.bin', createDummyBiosFile('Dreamcast BIOS'));
    zip.file('cores/bios/gba_bios.bin', createDummyBiosFile('Game Boy Advance BIOS'));
    
    // Add system-specific cores
    const systems = ['nes', 'snes', 'genesis', 'n64', 'ps1', 'ps2', 'dreamcast', 
                    'gamecube', 'gba', 'nds', 'psp', 'saturn', 'wii'];
    
    systems.forEach(system => {
      zip.file(`cores/${system}_core.dll`, createSystemCoreDll(system));
    });

    return zip.generateAsync({ type: 'blob' });
  } catch (error) {
    console.error('Error creating executable package:', error);
    throw error;
  }
};
