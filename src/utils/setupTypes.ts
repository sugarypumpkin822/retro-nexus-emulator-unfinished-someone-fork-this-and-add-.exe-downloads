
// Type definitions for setup utilities

export interface SetupFile {
  name: string;
  size: string;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  progress: number;
  required: boolean;
}

export interface InstallLocation {
  path: string;
  freeSpace: string;
  recommended: boolean;
}

// System requirements interface
export interface SystemRequirements {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  directX: string;
  storage: string;
  additionalNotes: string;
  minCpuCores: number;
  minRamGB: number;
}

// Setup options interface
export interface SetupOptions {
  installLocation: string;
  createDesktopShortcut: boolean;
  createStartMenuShortcuts: boolean;
  registerFileAssociations: boolean;
  installOptionalComponents: boolean;
  autoUpdateEnabled: boolean;
}

// Installation progress interface
export interface InstallationProgress {
  stage: string;
  percent: number;
  isComplete: boolean;
  timeRemaining: number;
}

// System component interface
export interface SystemComponent {
  name: string;
  details: string;
  isCompatible: boolean;
}

// Setup requirement interface
export interface SetupRequirement {
  name: string;
  required: boolean;
  installed: boolean;
}

// Pagination interface for file lists
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

// Executable code definition
export interface ExecutableCode {
  name: string;
  code: string;
  size: number; // in bytes
  version: string;
  description: string;
}

// DLL definition with dependencies
export interface DllDefinition {
  name: string;
  code: string;
  size: number; // in bytes
  version: string;
  dependencies: string[]; // Names of other DLLs this one depends on
  isRequired: boolean;
  description: string;
}
