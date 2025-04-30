
import { mainExecutableCode } from './mainExecutableCode';
import { emulatorExeCode } from './emulatorExeCode';
import { setupExeCode } from './setupExeCode';
import { ExecutableCode } from './types';

// Export individual executable codes
export { 
  mainExecutableCode,
  emulatorExeCode,
  setupExeCode
};

// All exported executable code
export const allExecutableCodes: Record<string, ExecutableCode> = {
  "RetroNexus.exe": mainExecutableCode,
  "Emulator.exe": emulatorExeCode,
  "Setup.exe": setupExeCode
};
