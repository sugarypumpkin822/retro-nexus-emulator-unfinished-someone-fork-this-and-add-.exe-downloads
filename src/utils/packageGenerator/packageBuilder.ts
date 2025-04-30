
import JSZip from 'jszip';
import { createFolderStructure } from './folderGenerator';
import { 
  allExecutableCodes
} from '../executableCodeDefinitions';
import {
  getAllDlls,
  getRequiredDlls
} from '../dllCodeDefinitions';
import { 
  addSystemFiles, 
  addSystemCoresAndBios,
  addShadersAndProfiles,
  addPatchesAndUpdates 
} from './builders/systemFilesBuilder';
import { createSystemUpdateArchive } from './builders/updateBuilder';
import { 
  defaultPaginationState, 
  paginateItems, 
  getPaginationState 
} from './builders/paginationUtils';
import { verifyRequiredDlls } from './builders/dllValidator';

// Re-export pagination utilities
export { 
  defaultPaginationState, 
  paginateItems, 
  getPaginationState,
  verifyRequiredDlls 
};

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
    
    // Add main executable files to root directory using our executable code definitions
    Object.values(allExecutableCodes).forEach(exe => {
      zip.file(`${exe.name}`, exe.code);
    });
    
    // Add required DLL files from our DLL definitions
    const allDlls = getAllDlls();
    
    // Add DLLs to appropriate folders
    allDlls.forEach(dll => {
      if (dll.name.includes('Core') || dll.name.includes('Engine') || dll.name.includes('Hardware')) {
        zip.file(`cores/${dll.name}`, dll.code);
      } else if (dll.name.includes('Rendering') || dll.name.includes('Shader')) {
        zip.file(`shaders/${dll.name}`, dll.code);
      } else if (dll.name.includes('Audio')) {
        zip.file(`audio/${dll.name}`, dll.code);
      } else if (dll.name.includes('Input') || dll.name.includes('Controller')) {
        zip.file(`input_profiles/${dll.name}`, dll.code);
      } else if (dll.name.includes('Network') || dll.name.includes('Netplay')) {
        zip.file(`netplay/${dll.name}`, dll.code);
      } else {
        // Default location for other DLLs
        zip.file(`libs/${dll.name}`, dll.code);
      }
    });
    
    // Add system files, documentation, and configurations
    addSystemFiles(zip);
    
    // Add system-specific cores and BIOS files
    addSystemCoresAndBios(zip);
    
    // Add shaders and controller profiles
    addShadersAndProfiles(zip);
    
    // Add system updates package
    const updateArchive = await createSystemUpdateArchive();
    zip.file('updates/system_update.zip', updateArchive);
    
    // Add patches and hot fixes
    addPatchesAndUpdates(zip);

    return zip.generateAsync({ type: 'blob' });
  } catch (error) {
    console.error('Error creating executable package:', error);
    throw error;
  }
};
