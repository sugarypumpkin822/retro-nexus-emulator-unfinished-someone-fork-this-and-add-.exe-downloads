
import JSZip from 'jszip';
import { createFolderStructure, createFolderReadme } from '../folderGenerator';
import {
  createVCRedistFile,
  createDirectX12File,
  createConfigFiles,
  createSampleConfigFile,
  createSampleShaderFile,
  createSampleThemeFile,
  createSampleLogFile,
  createDummyPdfFile,
  createCompatibilityListHtml,
  createLegalText,
  createMainReadmeFile,
  createDummyBiosFile
} from '../fileGenerators';

/**
 * Adds system files to the package
 */
export const addSystemFiles = (zip: JSZip): void => {
  // Add support files to appropriate folders
  zip.file('tools/VC_redist.x64.exe', createVCRedistFile());
  zip.file('tools/dxsetup.exe', createDirectX12File());
  
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
};

/**
 * Adds system cores and BIOS files to the package
 */
export const addSystemCoresAndBios = (zip: JSZip): void => {
  // Add sample BIOS files (text-based representations)
  zip.file('cores/bios/ps1_bios.bin', createDummyBiosFile('PlayStation BIOS'));
  zip.file('cores/bios/dreamcast_bios.bin', createDummyBiosFile('Dreamcast BIOS'));
  zip.file('cores/bios/gba_bios.bin', createDummyBiosFile('Game Boy Advance BIOS'));
  
  // Add system-specific cores for each supported system
  const systems = ['nes', 'snes', 'genesis', 'n64', 'ps1', 'ps2', 'dreamcast', 
                  'gamecube', 'gba', 'nds', 'psp', 'saturn', 'wii'];
  
  systems.forEach(system => {
    // Get or create system-specific core DLL
    const systemDllContent = `// ${system.toUpperCase()} system core - Generated placeholder\n[DLL_CONTENT]\n`;
    
    zip.file(`cores/systems/${system}/${system}_core.dll`, systemDllContent);
    
    // Add system-specific bios file too
    if (!['genesis', 'snes'].includes(system)) { // These systems don't require BIOS
      zip.file(`cores/bios/${system}_bios.bin`, createDummyBiosFile(`${system.toUpperCase()} BIOS`));
    }
  });
};

/**
 * Adds shaders and controller profiles to the package
 */
export const addShadersAndProfiles = (zip: JSZip): void => {
  // Add advanced shader collection
  const shaderTypes = ['crt', 'scanline', 'hq2x', 'hq4x', '2xsai', 'super2xsai', 'supereagle', 'gameboy', 'nes', 'scummvm'];
  shaderTypes.forEach(shader => {
    zip.file(`shaders/${shader}.glsl`, createSampleShaderFile());
    zip.file(`shaders/${shader}.hlsl`, createSampleShaderFile());
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
};

/**
 * Adds patches and updates to the package
 */
export const addPatchesAndUpdates = (zip: JSZip): void => {
  // Add patch and hot fixes
  zip.file('patches/security_patch_2025_04.bin', new Uint8Array([0x50, 0x41, 0x54, 0x43, 0x48, 0x00, 0x01]));
  zip.file('patches/performance_patch_2025_04.bin', new Uint8Array([0x50, 0x45, 0x52, 0x46, 0x00, 0x01]));
};
