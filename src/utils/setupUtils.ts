
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
  if (!supportedOperatingSystems.includes(systemInfo.os)) {
    issues.push(`Operating System ${systemInfo.os} is not officially supported.`);
  }
  
  // Check CPU requirements
  if (systemInfo.cpuCores < windowsRequirements.minCpuCores) {
    issues.push(`CPU has only ${systemInfo.cpuCores} cores. Minimum required: ${windowsRequirements.minCpuCores}.`);
  }
  
  // Check RAM requirements
  if (systemInfo.ramGB < windowsRequirements.minRamGB) {
    issues.push(`System has only ${systemInfo.ramGB}GB RAM. Minimum required: ${windowsRequirements.minRamGB}GB.`);
  }
  
  // Check GPU compatibility
  if (!systemInfo.gpuCompatible) {
    issues.push('GPU does not support required DirectX features.');
  }
  
  // Check disk space
  if (systemInfo.diskSpaceGB < minimumDiskSpace) {
    issues.push(`Insufficient disk space. Available: ${systemInfo.diskSpaceGB}GB, Required: ${minimumDiskSpace}GB.`);
  }
  
  return {
    compatible: issues.length === 0,
    issues
  };
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
