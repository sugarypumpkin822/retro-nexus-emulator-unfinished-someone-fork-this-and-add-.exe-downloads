
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
}
