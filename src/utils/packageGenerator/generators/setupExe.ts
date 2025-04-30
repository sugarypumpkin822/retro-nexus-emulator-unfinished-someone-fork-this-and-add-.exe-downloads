
/**
 * Generator for Setup executable content
 */

export const createSetupExe = (): string => {
  return `
// RetroNexus Setup.exe - Smart Installer
// Version: 1.2.5.482
// Copyright © 2025 RetroNexus Technologies Inc.

[MZ_HEADER]
4D 5A 90 00 03 00 00 00 04 00 00 00 FF FF 00 00
B8 00 00 00 00 00 00 00 40 00 00 00 00 00 00 00

[PE_HEADER]
50 45 00 00 64 86 06 00 4C 01 02 00 00 00 00 00
00 00 00 00 F0 00 22 02 0B 02 0E 1C 00 00 00 00

[IMPORTS]
KERNEL32.dll
USER32.dll
COMCTL32.dll
ADVAPI32.dll
SHELL32.dll
WININET.dll
URLMON.dll

[MAIN]
// Main setup entry point
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
  // Check admin rights
  if (!IsRunAsAdmin()) {
    // Relaunch with admin rights
    RelaunchWithAdminRights();
    return 0;
  }
  
  // Initialize common controls
  InitCommonControls();
  
  // Start by showing main setup dialog with progress bar and status
  DialogBox(hInstance, MAKEINTRESOURCE(IDD_SETUP_DIALOG), NULL, SetupDialogProc);
  
  return 0;
}

// Setup wizard procedure
INT_PTR CALLBACK SetupDialogProc(HWND hwndDlg, UINT message, WPARAM wParam, LPARAM lParam) {
  static SetupState setupState = {0};
  
  switch (message) {
    case WM_INITDIALOG:
      // Initialize dialog and setup state
      InitializeSetupDialog(hwndDlg, &setupState);
      return TRUE;
    
    case WM_COMMAND:
      switch (LOWORD(wParam)) {
        case IDC_NEXT_BUTTON:
          return HandleNextButton(hwndDlg, &setupState);
        
        case IDC_BACK_BUTTON:
          return HandleBackButton(hwndDlg, &setupState);
        
        case IDC_CANCEL_BUTTON:
          if (ShowConfirmDialog("Cancel Setup", "Are you sure you want to cancel installation?") == IDYES) {
            EndDialog(hwndDlg, 0);
          }
          return TRUE;
        
        case IDC_BROWSE_BUTTON:
          BrowseForInstallationFolder(hwndDlg, &setupState);
          return TRUE;
      }
      break;
    
    case WM_NOTIFY:
      return HandleSetupNotifications(hwndDlg, wParam, lParam, &setupState);
    
    case WM_CLOSE:
      if (ShowConfirmDialog("Cancel Setup", "Are you sure you want to cancel installation?") == IDYES) {
        EndDialog(hwndDlg, 0);
      }
      return TRUE;
  }
  
  return FALSE;
}

// Smart download manager implementation
bool DownloadRequiredFiles(HWND hwndProgress, SetupState* state) {
  // Make all files required
  SendMessageToUI(hwndProgress, "Verifying all required components...");
  
  // Core files that need to be downloaded - ALL marked as required
  const DownloadFileInfo coreFiles[] = {
    {"RetroNexus.exe", "https://cdn.retronexus.example.com/downloads/1.2.5/RetroNexus.exe", 1048576, true},
    {"Emulator.exe", "https://cdn.retronexus.example.com/downloads/1.2.5/Emulator.exe", 1048576, true},
    {"RetroNexusCore.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/RetroNexusCore.dll", 1048576, true},
    {"EmulationEngine.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/EmulationEngine.dll", 1048576, true},
    {"HardwareAcceleration.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/HardwareAcceleration.dll", 1048576, true},
    {"DirectX12Runtime.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/DirectX12Runtime.dll", 1048576, true},
    {"VulkanSupport.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/VulkanSupport.dll", 1048576, true},
    {"OpenGLWrapper.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/OpenGLWrapper.dll", 1048576, true},
    {"AudioEngine.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/AudioEngine.dll", 1048576, true},
    {"InputManager.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/InputManager.dll", 1048576, true},
    {"PhysicsEngine.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/PhysicsEngine.dll", 1048576, true},
    {"ShaderCompiler.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/ShaderCompiler.dll", 1048576, true}, 
    {"TextureProcessor.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/TextureProcessor.dll", 1048576, true},
    {"SaveStateManager.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/SaveStateManager.dll", 1048576, true},
    {"RenderingUtils.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/RenderingUtils.dll", 1048576, true},
    {"NetworkLayer.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/NetworkLayer.dll", 1048576, true}
  };
  
  // Download all required files
  int totalFiles = sizeof(coreFiles) / sizeof(coreFiles[0]);
  
  for (int i = 0; i < totalFiles; i++) {
    char localFilePath[MAX_PATH];
    sprintf(localFilePath, "%s\\%s", state->installPath, coreFiles[i].filename);
    
    char statusMsg[256];
    sprintf(statusMsg, "Downloading %s (%d of %d)...", coreFiles[i].filename, i+1, totalFiles);
    SendMessageToUI(hwndProgress, statusMsg);
    
    // Display progress
    UpdateProgressPercentage(hwndProgress, (i * 100) / totalFiles);
    
    // Download the file
    if (!DownloadFile(coreFiles[i].url, localFilePath)) {
      sprintf(statusMsg, "Failed to download %s", coreFiles[i].filename);
      SendMessageToUI(hwndProgress, statusMsg);
      
      // If this is a required file, abort installation
      if (coreFiles[i].required) {
        ShowErrorDialog("Critical required file could not be downloaded. Installation cannot continue.");
        return false;
      }
    }
  }
  
  return true;
}

// Create shortcuts
void CreateShortcuts(SetupState* state) {
  if (state->createDesktopShortcut) {
    CreateDesktopShortcut(state->installPath);
  }
  
  if (state->createStartMenuShortcuts) {
    CreateStartMenuShortcuts(state->installPath);
  }
}

// Create Start Menu shortcuts
void CreateStartMenuShortcuts(const char* installPath) {
  char programsPath[MAX_PATH];
  SHGetFolderPath(NULL, CSIDL_PROGRAMS, NULL, 0, programsPath);
  
  char shortcutDir[MAX_PATH];
  sprintf(shortcutDir, "%s\\RetroNexus", programsPath);
  
  // Create directory
  CreateDirectory(shortcutDir, NULL);
  
  // Create shortcuts
  CreateShortcutFile(shortcutDir, "RetroNexus Emulator", installPath, "RetroNexus.exe");
  CreateShortcutFile(shortcutDir, "RetroNexus Launcher", installPath, "Launcher.exe");
  CreateShortcutFile(shortcutDir, "RetroNexus Update", installPath, "Updater.exe");
  CreateShortcutFile(shortcutDir, "Uninstall RetroNexus", installPath, "Uninstall.exe");
}

// Self-extracting setup capability
[SELF_EXTRACT_HEADER]
// Size and offset information for self-extraction
// This allows the setup.exe to download and install all necessary files
HEADER_SIZE = 4096
DOWNLOAD_MANIFEST_OFFSET = 2048
DOWNLOAD_MANIFEST_SIZE = 2048
`;
};
