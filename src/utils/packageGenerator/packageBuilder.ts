
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
    
    // Add advanced shader collection
    const shaderTypes = ['crt', 'scanline', 'hq2x', 'hq4x', '2xsai', 'super2xsai', 'supereagle', 'gameboy', 'nes', 'scummvm'];
    shaderTypes.forEach(shader => {
      zip.file(`shaders/${shader}.glsl`, createSampleShaderFile(shader));
      zip.file(`shaders/${shader}.hlsl`, createSampleShaderFile(`${shader}-dx`));
    });
    
    // Add controller mappings for popular controllers
    const controllers = ['xbox360', 'xboxone', 'ps3', 'ps4', 'ps5', 'switch', '8bitdo', 'snes', 'genesis'];
    controllers.forEach(controller => {
      zip.file(`input_profiles/${controller}.json`, JSON.stringify({
        name: `${controller.toUpperCase()} Controller`,
        guid: `${Math.random().toString(36).substring(2, 10)}`,
        buttons: {
          a: controller === 'xbox360' || controller === 'xboxone' ? 0 : 1,
          b: controller === 'xbox360' || controller === 'xboxone' ? 1 : 2,
          x: controller === 'xbox360' || controller === 'xboxone' ? 2 : 0,
          y: controller === 'xbox360' || controller === 'xboxone' ? 3 : 3,
          l1: 4,
          r1: 5,
          l2: 6,
          r2: 7,
          select: 8,
          start: 9,
          l3: 10,
          r3: 11,
          home: 12,
          dpad_up: 13,
          dpad_down: 14,
          dpad_left: 15,
          dpad_right: 16
        },
        axes: {
          left_x: 0,
          left_y: 1,
          right_x: 2,
          right_y: 3,
          l2: controller.includes('ps') ? 4 : -1,
          r2: controller.includes('ps') ? 5 : -1
        }
      }, null, 2));
    });

    // Add system updates package
    const updateArchive = await createSystemUpdateArchive();
    zip.file('updates/system_update.zip', updateArchive);
    
    // Add patch and hot fixes
    zip.file('patches/security_patch_2025_04.bin', new Uint8Array([0x50, 0x41, 0x54, 0x43, 0x48, 0x00, 0x01]));
    zip.file('patches/performance_patch_2025_04.bin', new Uint8Array([0x50, 0x45, 0x52, 0x46, 0x00, 0x01]));

    return zip.generateAsync({ type: 'blob' });
  } catch (error) {
    console.error('Error creating executable package:', error);
    throw error;
  }
};

/**
 * Create a system update archive with necessary files
 */
const createSystemUpdateArchive = async (): Promise<Blob> => {
  const updateZip = new JSZip();
  
  // Add update manifest
  updateZip.file('update.manifest', JSON.stringify({
    version: '1.2.5.482',
    releaseDate: '2025-04-29',
    requiredVersion: '1.2.0.0',
    components: [
      {name: 'core', version: '1.2.5.482', path: 'core/'},
      {name: 'launcher', version: '1.2.5.300', path: 'launcher/'},
      {name: 'emulator', version: '1.2.5.482', path: 'emulator/'}
    ],
    changelog: [
      'Fixed compatibility issues with latest Windows update',
      'Improved performance for PlayStation 2 games',
      'Added support for more controller types',
      'Fixed save state corruption issues',
      'Added new shader effects'
    ]
  }, null, 2));
  
  // Add update components
  updateZip.file('core/update.bin', new Uint8Array([0x43, 0x4F, 0x52, 0x45, 0x00, 0x01]));
  updateZip.file('launcher/update.bin', new Uint8Array([0x4C, 0x41, 0x55, 0x4E, 0x00, 0x01]));
  updateZip.file('emulator/update.bin', new Uint8Array([0x45, 0x4D, 0x55, 0x00, 0x01]));
  
  return updateZip.generateAsync({ type: 'blob' });
};
