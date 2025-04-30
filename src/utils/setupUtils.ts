
import { toast } from 'sonner';
import { SystemScanResults } from './hardwareScan';
import { 
  SetupFile, 
  InstallLocation,
  SetupOptions,
  InstallationProgress,
  SystemComponent,
  SetupRequirement
} from './setupTypes';
import { 
  requiredSetupFiles, 
  optionalSetupFiles, 
  availableInstallLocations,
  windowsRequirements,
  minimumDiskSpace,
  recommendedDiskSpace, 
  supportedOperatingSystems
} from './setupData';
import { runSetupInstallation } from './installationUtils';
import { createExecutablePackage } from './packageGenerator/packageBuilder';
import { 
  createSetupExe, 
  createWindowsExecutableText,
  createEmulatorExe,
  createLauncherExe,
  createUpdaterExe,
  createCrashHandlerExe
} from './packageGenerator/executableGenerator';

// Utility function to create a smart installer that downloads required files
export const createSmartInstaller = async (options: SetupOptions): Promise<Blob> => {
  try {
    // Show preparation toast
    toast.info("Creating standalone installer with automatic content download capability.");

    // Create the base executable package
    const execPackage = await createExecutablePackage();
    
    // Apply customizations based on options
    const customizedPackage = await applyCustomOptions(execPackage, options);
    
    // Return the finalized setup executable
    return customizedPackage;
  } catch (error) {
    console.error("Error creating smart installer:", error);
    toast.error("Failed to create installer package.");
    throw error;
  }
};

// Apply custom options to the installer package
const applyCustomOptions = async (basePackage: Blob, options: SetupOptions): Promise<Blob> => {
  // Currently this is a placeholder that just returns the original package
  // In a real implementation, this would modify the installer based on options
  return basePackage;
};

// Utility function to check system compatibility
export const checkSystemCompatibility = (
  systemInfo: SystemScanResults
): { compatible: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Check OS compatibility
  if (!supportedOperatingSystems.includes(systemInfo.operatingSystem.details)) {
    issues.push(`Operating System ${systemInfo.operatingSystem.details} is not officially supported.`);
  }
  
  // Check CPU requirements
  const cpuCores = getCpuCoreCount(systemInfo);
  if (cpuCores < windowsRequirements.minCpuCores) {
    issues.push(`CPU has only ${cpuCores} cores. Minimum required: ${windowsRequirements.minCpuCores}.`);
  }
  
  // Check RAM requirements
  const ramGB = getSystemRamGB(systemInfo);
  if (ramGB < windowsRequirements.minRamGB) {
    issues.push(`System has only ${ramGB}GB RAM. Minimum required: ${windowsRequirements.minRamGB}GB.`);
  }
  
  // Check GPU compatibility
  if (!isGpuCompatible(systemInfo)) {
    issues.push('GPU does not support required DirectX features.');
  }
  
  // Check disk space
  const diskSpaceGB = getAvailableDiskSpace(systemInfo);
  if (diskSpaceGB < minimumDiskSpace) {
    issues.push(`Insufficient disk space. Available: ${diskSpaceGB}GB, Required: ${minimumDiskSpace}GB.`);
  }
  
  return {
    compatible: issues.length === 0,
    issues
  };
};

// Helper function to get CPU core count from system info
const getCpuCoreCount = (systemInfo: SystemScanResults): number => {
  // Extract core count from CPU details if available
  const cpuDetails = systemInfo.cpu.details;
  const coreMatch = cpuDetails.match(/(\d+)\s*cores?/i);
  return coreMatch ? parseInt(coreMatch[1], 10) : 4; // Default to 4 if not specified
};

// Helper function to get RAM in GB
const getSystemRamGB = (systemInfo: SystemScanResults): number => {
  // Extract RAM amount from system info
  const ramDetails = systemInfo.ram.details;
  const gbMatch = ramDetails.match(/(\d+(?:\.\d+)?)\s*GB/i);
  return gbMatch ? parseFloat(gbMatch[1]) : 8; // Default to 8 if not specified
};

// Helper function to check if GPU is compatible
const isGpuCompatible = (systemInfo: SystemScanResults): boolean => {
  return systemInfo.gpu.meetsMinimum;
};

// Helper function to get available disk space
const getAvailableDiskSpace = (systemInfo: SystemScanResults): number => {
  // Extract disk space info if available
  const storageDetails = systemInfo.storage.details;
  const gbMatch = storageDetails.match(/(\d+(?:\.\d+)?)\s*GB/i);
  return gbMatch ? parseFloat(gbMatch[1]) : 50; // Default to 50 if not specified
};

// Track installation progress
export const trackSetupProgress = (
  callback: (progress: InstallationProgress) => void
): { updateProgress: (stage: string, percent: number) => void } => {
  const updateProgress = (stage: string, percent: number) => {
    callback({
      stage,
      percent,
      isComplete: percent >= 100,
      timeRemaining: estimateTimeRemaining(stage, percent)
    });
  };
  
  return { updateProgress };
};

// Helper function to estimate remaining time based on stage and current progress
const estimateTimeRemaining = (stage: string, percent: number): number => {
  // This is a simplified calculation - a real implementation would be more complex
  const stageWeights: Record<string, number> = {
    'preparation': 5,
    'downloading': 60,
    'extracting': 20,
    'installing': 50,
    'configuring': 15,
    'finishing': 5
  };
  
  const weight = stageWeights[stage] || 10;
  const remaining = (100 - percent) / 100;
  
  return Math.round(remaining * weight);
};

// Export all the imports so they're available to components that import from setupUtils
export {
  requiredSetupFiles,
  optionalSetupFiles,
  availableInstallLocations,
  windowsRequirements,
  minimumDiskSpace,
  recommendedDiskSpace,
  supportedOperatingSystems,
  runSetupInstallation,
  createExecutablePackage,
  createSetupExe,
  createWindowsExecutableText,
  createEmulatorExe,
  createLauncherExe,
  createUpdaterExe,
  createCrashHandlerExe
};

// Re-export types for backward compatibility
export type {
  SetupFile,
  InstallLocation,
  SetupOptions,
  InstallationProgress,
  SystemComponent,
  SetupRequirement
};
