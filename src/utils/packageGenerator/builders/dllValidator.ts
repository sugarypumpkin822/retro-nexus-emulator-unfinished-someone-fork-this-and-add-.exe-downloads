
import { getRequiredDlls } from '../../dllCodeDefinitions';

/**
 * Check if all required DLLs are present
 */
export const verifyRequiredDlls = (installedDlls: string[]): { 
  isValid: boolean;
  missingDlls: string[];
} => {
  const requiredDlls = getRequiredDlls().map(dll => dll.name);
  const missingDlls = requiredDlls.filter(dll => !installedDlls.includes(dll));
  
  return {
    isValid: missingDlls.length === 0,
    missingDlls
  };
};
