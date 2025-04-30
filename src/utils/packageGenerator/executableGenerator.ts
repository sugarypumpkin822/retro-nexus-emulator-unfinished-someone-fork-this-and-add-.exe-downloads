
/**
 * Helper functions to generate executable content
 * This is the main entry point that imports from individual generator files
 */

import { createWindowsExecutableText } from './generators/windowsExecutable';
import { createEmulatorExe } from './generators/emulatorExe';
import { createLauncherExe } from './generators/launcherExe';
import { createUpdaterExe } from './generators/updaterExe';
import { createCrashHandlerExe } from './generators/crashHandlerExe';
import { createSetupExe } from './generators/setupExe';

// Re-export all generators
export {
  createWindowsExecutableText,
  createEmulatorExe,
  createLauncherExe,
  createUpdaterExe,
  createCrashHandlerExe,
  createSetupExe
};
