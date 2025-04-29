
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
    
    // Create folder structure first
    const folders = createFolderStructure(zip);
    
    // Add readme files to each folder
    folders.forEach(folder => {
      zip.file(`${folder}/readme.txt`, createFolderReadme(folder));
    });
    
    // Add main executable files to root directory
    zip.file('RetroNexus.exe', createWindowsExecutableText());
    zip.file('Emulator.exe', createEmulatorExe());
    zip.file('Launcher.exe', createLauncherExe());
    zip.file('Updater.exe', createUpdaterExe());
    zip.file('CrashHandler.exe', createCrashHandlerExe());
    zip.file('Setup.exe', createSetupExe());
    
    // Add support files to appropriate folders
    zip.file('tools/VC_redist.x64.exe', createVCRedistFile());
    zip.file('tools/dxsetup.exe', createDirectX12File());
    
    // Create DLL files and place them in the appropriate folders
    createDLLFiles().forEach(dll => {
      if (dll.name.includes('Core') || dll.name.includes('Engine') || dll.name.includes('Hardware')) {
        zip.file(`cores/${dll.name}`, dll.content);
      } else if (dll.name.includes('Rendering') || dll.name.includes('Shader') || dll.name.includes('Texture')) {
        zip.file(`shaders/${dll.name}`, dll.content);
      } else if (dll.name.includes('Audio')) {
        zip.file(`audio/${dll.name}`, dll.content);
      } else if (dll.name.includes('Input') || dll.name.includes('Controller')) {
        zip.file(`input_profiles/${dll.name}`, dll.content);
      } else if (dll.name.includes('Network') || dll.name.includes('Netplay')) {
        zip.file(`netplay/${dll.name}`, dll.content);
      } else {
        // Default location for other DLLs
        zip.file(`libs/${dll.name}`, dll.content);
      }
    });
    
    // Create main configuration files
    const configs = createConfigFiles();
    zip.file('configs/RetroNexusConfig.ini', configs.mainConfig);
    zip.file('configs/RetroNexusBIOS.ini', configs.biosConfig);
    
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
    
    // Add system-specific cores for each supported system
    const systems = ['nes', 'snes', 'genesis', 'n64', 'ps1', 'ps2', 'dreamcast', 
                    'gamecube', 'gba', 'nds', 'psp', 'saturn', 'wii'];
    
    systems.forEach(system => {
      zip.file(`cores/systems/${system}/${system}_core.dll`, createSystemCoreDll(system));
      // Add system-specific bios file too
      if (!['genesis', 'snes'].includes(system)) { // These systems don't require BIOS
        zip.file(`cores/bios/${system}_bios.bin`, createDummyBiosFile(`${system.toUpperCase()} BIOS`));
      }
    });

    return zip.generateAsync({ type: 'blob' });
  } catch (error) {
    console.error('Error creating executable package:', error);
    throw error;
  }
};
