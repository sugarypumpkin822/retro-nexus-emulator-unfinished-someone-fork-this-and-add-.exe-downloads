
import { toast } from 'sonner';
import { SystemScanResults } from './hardwareScan';
import { 
  SetupFile, 
  InstallLocation
} from './setupTypes';
import { 
  requiredSetupFiles, 
  optionalSetupFiles, 
  availableInstallLocations,
  windowsRequirements 
} from './setupData';
import { runSetupInstallation } from './installationUtils';
import { createExecutablePackage } from './packageGenerator/packageBuilder';

// Export all the imports so they're available to components that import from setupUtils
export {
  requiredSetupFiles,
  optionalSetupFiles,
  availableInstallLocations,
  windowsRequirements,
  runSetupInstallation,
  createExecutablePackage
};

// Re-export types for backward compatibility
export type {
  SetupFile,
  InstallLocation
};
