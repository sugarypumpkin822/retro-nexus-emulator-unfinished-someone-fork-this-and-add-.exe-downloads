
/**
 * Folder structure generator utilities
 */

// Create folder structure with appropriate files
export const createFolderStructure = (zip: any) => {
  const folders = [
    'roms', 'saves', 'states', 'configs', 'logs', 'cores', 'plugins', 
    'assets', 'shaders', 'themes', 'translations', 'tools', 'docs', 
    'netplay', 'replays', 'screenshots', 'cheats', 'profiles',
    'input_profiles', 'audio', 'video', 'modloader', 'cloud', 
    'telemetry', 'cache', 'cores/bios', 'cores/systems', 'libs'
  ];
  
  // Create each folder in the zip
  folders.forEach(folder => {
    zip.folder(folder);
  });
  
  // Create system-specific folders
  const systems = ['nes', 'snes', 'genesis', 'n64', 'ps1', 'ps2', 'dreamcast', 
                  'gamecube', 'gba', 'nds', 'psp', 'saturn', 'wii'];
  
  systems.forEach(system => {
    // Create ROM folder for each system
    zip.folder(`roms/${system}`);
    // Create save folder for each system
    zip.folder(`saves/${system}`);
    // Create states folder for each system
    zip.folder(`states/${system}`);
    // Create system-specific core folder
    zip.folder(`cores/systems/${system}`);
  });
  
  return folders;
};

// Add sample files to specific folders to make the package more complete
export const addSampleFiles = (zip: any) => {
  // This function would add various sample files to complete the package structure
  // Implementation would be similar to the createExecutablePackage function
};

/**
 * Creates a README file for a specific folder
 */
export const createFolderReadme = (folder: string): string => {
  const folderDescriptions: Record<string, string> = {
    roms: "Store your ROM files for each supported system in the appropriate subfolder.",
    saves: "Game save files are stored here, organized by system.",
    states: "Save states for quick game loading and resuming.",
    configs: "Configuration files for RetroNexus and system-specific settings.",
    logs: "Log files for troubleshooting and debugging.",
    cores: "Emulation core files and BIOS files required for each system.",
    plugins: "Optional plugins to enhance RetroNexus functionality.",
    assets: "Graphics, sounds, and other assets used by RetroNexus.",
    shaders: "Video shader files for enhancing graphics output.",
    themes: "RetroNexus UI themes for customizing the appearance.",
    translations: "Language files for the RetroNexus interface.",
    tools: "Utility tools for managing ROMs, saves, and other functions.",
    docs: "Documentation files including user manuals and guides.",
    netplay: "Files related to online multiplayer functionality.",
    replays: "Gameplay recording files for sharing or reviewing.",
    screenshots: "Game screenshots taken within RetroNexus.",
    cheats: "Cheat files organized by game and system.",
    profiles: "User profiles for saving preferences and settings.",
    input_profiles: "Controller and input device configuration profiles.",
    audio: "Audio processing plugins and related files.",
    video: "Video processing plugins and related files.",
    modloader: "Game modification files and mod management.",
    cloud: "Files related to cloud save and sync functionality.",
    telemetry: "Anonymous usage statistics (can be disabled in settings).",
    cache: "Temporary cache files for improved performance.",
    "cores/bios": "System BIOS files required for accurate emulation.",
    "cores/systems": "System-specific emulation core files.",
    libs: "Library files used by RetroNexus and its components."
  };

  // Get the base folder name if there's a path
  const baseFolderName = folder.includes('/') ? folder.split('/').pop() || folder : folder;
  
  // Get description or use a generic one
  const description = folderDescriptions[folder] || `This folder is used for ${baseFolderName} files in RetroNexus.`;
  
  return `# ${baseFolderName.toUpperCase()} Folder\n\n${description}\n\nPart of RetroNexus Emulation Platform.`;
};
