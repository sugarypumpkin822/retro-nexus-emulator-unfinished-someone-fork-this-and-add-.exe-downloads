
/**
 * Helper functions to generate executable content
 */

export const createWindowsExecutableText = (): string => {
  return `
// RetroNexus Windows Installer
// Version: 1.2.5.482
// Copyright © 2025 RetroNexus Technologies Inc.

[MZ_HEADER]
4D 5A 90 00 03 00 00 00 04 00 00 00 FF FF 00 00
B8 00 00 00 00 00 00 00 40 00 00 00 00 00 00 00

[PE_HEADER]
50 45 00 00 64 86 06 00 4C 01 02 00 00 00 00 00
00 00 00 00 F0 00 22 02 0B 02 0E 1C 00 00 00 00
00 00 00 00 00 00 00 00 00 10 00 00 00 02 00 00
40 01 00 00 00 10 00 00 00 02 00 00 04 00 00 00

[WINDOWS_MANIFEST]
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
  <assemblyIdentity 
    version="1.2.5.482" 
    name="RetroNexus.Emulator" 
    type="win32"
    processorArchitecture="amd64"
  />
  <description>RetroNexus Multi-System Emulator</description>
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v3">
    <security>
      <requestedPrivileges>
        <requestedExecutionLevel level="requireAdministrator" uiAccess="false"/>
      </requestedPrivileges>
    </security>
  </trustInfo>
  <compatibility xmlns="urn:schemas-microsoft-com:compatibility.v1">
    <application>
      <supportedOS Id="{8e0f7a12-bfb3-4fe8-b9a5-48fd50a15a9a}"/>
      <supportedOS Id="{1f676c76-80e1-4239-95bb-83d0f6d0da78}"/>
      <supportedOS Id="{4a2f28e3-53b9-4441-ba9c-d69d4a4a6e38}"/>
      <supportedOS Id="{35138b9a-5d96-4fbd-8e2d-a2440225f93a}"/>
    </application>
  </compatibility>
  <application xmlns="urn:schemas-microsoft-com:asm.v3">
    <windowsSettings>
      <dpiAware xmlns="http://schemas.microsoft.com/SMI/2005/WindowsSettings">true/pm</dpiAware>
      <dpiAwareness xmlns="http://schemas.microsoft.com/SMI/2016/WindowsSettings">PerMonitorV2,PerMonitor</dpiAwareness>
      <longPathAware xmlns="http://schemas.microsoft.com/SMI/2016/WindowsSettings">true</longPathAware>
    </windowsSettings>
  </application>
</assembly>

[IMPORTS]
KERNEL32.dll:
  CreateFileW
  CreateDirectoryW
  ReadFile
  WriteFile
  CloseHandle
  GetFileAttributesW
  SetFileAttributesW
  DeleteFileW
  MoveFileW
  CopyFileW
  GetLastError
  LoadLibraryW
  GetProcAddress
  FreeLibrary
  VirtualAlloc
  VirtualFree
  GetSystemInfo
  GetLogicalDriveStringsW
  GetDriveTypeW
  GetDiskFreeSpaceExW

USER32.dll:
  MessageBoxW
  CreateWindowExW
  ShowWindow
  UpdateWindow
  GetSystemMetrics
  RegisterClassExW
  UnregisterClassW
  LoadImageW
  LoadIconW
  LoadCursorW
  
ADVAPI32.dll:
  RegCreateKeyExW
  RegOpenKeyExW
  RegSetValueExW
  RegQueryValueExW
  RegDeleteKeyW
  RegCloseKey
  InitiateSystemShutdownExW
  
SHELL32.dll:
  ShellExecuteW
  SHGetFolderPathW
  SHFileOperationW
  SHCreateDirectoryExW
  SHGetKnownFolderPath

[CODE_SECTION]
// Main entry point and initialization
55 8B EC 83 EC 28 53 56 57 68 00 00 40 00 E8
push ebp
mov ebp, esp
sub esp, 40
push ebx
push esi
push edi

// Initialize global state
function InitializeInstaller() {
  // Load configuration
  LoadInstallerConfig();
  
  // Check admin rights
  if (!CheckAdminPrivileges()) {
    ShowError("Administrator privileges required");
    return ERROR_ELEVATION_REQUIRED;
  }
  
  // Verify system requirements
  if (!VerifySystemRequirements()) {
    ShowError("System does not meet minimum requirements");
    return ERROR_REQUIREMENTS_NOT_MET;
  }
  
  return SUCCESS;
}

// File system operations
function CreateInstallationDirectories() {
  const directories = [
    "%INSTALLDIR%\\Games\\ROMs",
    "%INSTALLDIR%\\Games\\ISOs",
    "%INSTALLDIR%\\SaveStates",
    "%INSTALLDIR%\\SaveData",
    "%INSTALLDIR%\\Screenshots",
    "%INSTALLDIR%\\Recordings",
    "%INSTALLDIR%\\Shaders",
    "%INSTALLDIR%\\Textures"
  ];
  
  for (const dir of directories) {
    CreateDirectory(ExpandPath(dir));
  }
}

// DLL Management
function LoadCoreDLLs() {
  // Load core DLLs in correct order
  const dllLoadOrder = [
    "RetroNexusCore.dll",
    "EmulationEngine.dll", 
    "HardwareAcceleration.dll",
    "InputManager.dll",
    "AudioEngine.dll"
  ];
  
  for (const dll of dllLoadOrder) {
    const hModule = LoadLibrary(dll);
    if (!hModule) {
      return ERROR_DLL_LOAD_FAILED;
    }
    InitializeDLL(hModule);
  }
  
  return SUCCESS;
}

// Registry Configuration
function ConfigureRegistry() {
  // Create main registry keys
  CreateRegistryKey(HKEY_LOCAL_MACHINE, "SOFTWARE\\RetroNexus");
  
  // Register file extensions
  const extensions = [
    ".nes", ".snes", ".n64", ".iso", ".gba",
    ".nds", ".psp", ".wii", ".gcm", ".bin"
  ];
  
  for (const ext of extensions) {
    RegisterFileExtension(ext, "RetroNexus.Emulator");
  }
  
  // Set up uninstall information
  SetupUninstallInfo();
}

// Error handling and cleanup
function Cleanup() {
  UnloadAllDLLs();
  CloseAllHandles();
  DeleteTemporaryFiles();
  
  if (installationFailed) {
    RollbackChanges();
  }
}

// Main installation sequence
function InstallationSequence() {
  try {
    ShowProgress("Preparing installation...", 0);
    
    if (InitializeInstaller() !== SUCCESS) {
      throw new Error("Initialization failed");
    }
    
    ShowProgress("Creating directories...", 10);
    CreateInstallationDirectories();
    
    ShowProgress("Extracting files...", 30);
    ExtractFiles();
    
    ShowProgress("Installing core components...", 50);
    if (LoadCoreDLLs() !== SUCCESS) {
      throw new Error("Failed to load core DLLs");
    }
    
    ShowProgress("Configuring system...", 70);
    ConfigureRegistry();
    
    ShowProgress("Creating shortcuts...", 85);
    CreateShortcuts();
    
    ShowProgress("Finalizing installation...", 95);
    PerformFinalSetup();
    
    ShowProgress("Installation complete!", 100);
    
  } catch (error) {
    ShowError("Installation failed: " + error.message);
    Cleanup();
    return ERROR_INSTALLATION_FAILED;
  }
  
  return SUCCESS;
}

[RESOURCES]
1 ICON "RetroNexus.ico"
2 BITMAP "RetroNexus.bmp"
1 MANIFEST "RetroNexus.manifest"
1 VERSIONINFO
FILEVERSION 1,2,5,482
PRODUCTVERSION 1,2,5,482
FILEFLAGSMASK 0x3fL
FILEFLAGS 0x0L
FILEOS 0x40004L
FILETYPE 0x1L
FILESUBTYPE 0x0L
BEGIN
  BLOCK "StringFileInfo"
  BEGIN
    BLOCK "040904b0"
    BEGIN
      VALUE "CompanyName", "RetroNexus Technologies Inc."
      VALUE "FileDescription", "RetroNexus Multi-System Emulator"
      VALUE "FileVersion", "1.2.5.482"
      VALUE "InternalName", "RetroNexus.exe"
      VALUE "LegalCopyright", "© 2025 RetroNexus Technologies Inc."
      VALUE "OriginalFilename", "RetroNexus.exe"
      VALUE "ProductName", "RetroNexus Emulator"
      VALUE "ProductVersion", "1.2.5.482"
    END
  END
  BLOCK "VarFileInfo"
  BEGIN
    VALUE "Translation", 0x409, 1200
  END
END

[SIGNATURE_BLOCK]
// Digital signature (PKCS#7)
// SHA-256 with RSA encryption
30 82 0C 8A 06 09 2A 86 48 86 F7 0D 01 07 02 A0
82 0C 7B 30 82 0C 77 02 01 01 31 0F 30 0D 06 09
60 86 48 01 65 03 04 02 01 05 00 30 0B 06 09 2A
86 48 86 F7 0D 01 07 01 A0 82 08 7D 30 82 08 79
30 82 07 61 A0 03 02 01 02 02 14 0E F7 E7 C8 F5
73 95 73 B6 3E 82 05 9E 76 48 A5 82 08 A4 30 0D
`;
};

export const createEmulatorExe = (): string => {
  return `
// RetroNexus Emulator.exe
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
GDI32.dll
RetroNexusCore.dll
EmulationEngine.dll
HardwareAcceleration.dll
InputManager.dll
AudioEngine.dll

[MAIN]
// Main emulation core entry point
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
  // Initialize RetroNexus subsystems
  if (!InitializeEmulationSystems()) {
    ShowErrorDialog("Failed to initialize emulation systems");
    return 1;
  }
  
  // Parse command line arguments
  ParseCommandLine(lpCmdLine);
  
  // Load configuration
  if (!LoadConfiguration()) {
    ShowErrorDialog("Failed to load configuration");
    return 1;
  }
  
  // Create main window
  if (!CreateMainWindow(hInstance, nCmdShow)) {
    ShowErrorDialog("Failed to create main window");
    return 1;
  }
  
  // Enter message loop
  MSG msg;
  while (GetMessage(&msg, NULL, 0, 0)) {
    TranslateMessage(&msg);
    DispatchMessage(&msg);
  }
  
  // Cleanup and exit
  ShutdownEmulationSystems();
  return msg.wParam;
}

// Emulation system initialization
bool InitializeEmulationSystems() {
  // Load core DLLs
  if (!LoadCoreDLLs()) {
    return false;
  }
  
  // Initialize graphics subsystem
  if (!InitializeGraphics()) {
    return false;
  }
  
  // Initialize audio subsystem
  if (!InitializeAudio()) {
    return false;
  }
  
  // Initialize input subsystem
  if (!InitializeInput()) {
    return false;
  }
  
  // Initialize save system
  if (!InitializeSaveSystem()) {
    return false;
  }
  
  return true;
}

[RESOURCES]
1 ICON "RetroNexus.ico"
2 BITMAP "RetroNexus.bmp"
1 MANIFEST "RetroNexus.manifest"
`;
};

export const createLauncherExe = (): string => {
  return `
// RetroNexus Launcher.exe
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
SHELL32.dll
Updater.exe
Emulator.exe

[MAIN]
// Main launcher entry point
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
  // Check for updates
  if (ShouldCheckForUpdates()) {
    RunUpdater("/silent");
  }
  
  // Load game library database
  LoadGameLibrary();
  
  // Create launcher window
  CreateLauncherWindow(hInstance, nCmdShow);
  
  // Main message loop
  MSG msg;
  while (GetMessage(&msg, NULL, 0, 0)) {
    TranslateMessage(&msg);
    DispatchMessage(&msg);
  }
  
  return msg.wParam;
}

// Launch game function
bool LaunchGame(const char* romPath, const char* systemType) {
  // Prepare command line
  char cmdLine[1024];
  sprintf(cmdLine, "Emulator.exe /system:%s /rom:\\"%s\\"", systemType, romPath);
  
  // Create process
  STARTUPINFO si = {0};
  PROCESS_INFORMATION pi = {0};
  si.cb = sizeof(STARTUPINFO);
  
  if (!CreateProcess(NULL, cmdLine, NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi)) {
    ShowErrorDialog("Failed to launch game");
    return false;
  }
  
  return true;
}

[RESOURCES]
1 ICON "Launcher.ico"
2 BITMAP "Splash.bmp"
3 BITMAP "Background.bmp"
`;
};

export const createUpdaterExe = (): string => {
  return `
// RetroNexus Updater.exe
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
WININET.dll
URLMON.dll

[MAIN]
// Main updater entry point
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
  bool silentMode = (strstr(lpCmdLine, "/silent") != NULL);
  
  // Check current version
  char currentVersion[32];
  if (!GetCurrentVersion(currentVersion)) {
    if (!silentMode) {
      ShowErrorDialog("Failed to determine current version");
    }
    return 1;
  }
  
  // Check for updates from server
  UpdateInfo updateInfo;
  if (!CheckForUpdates(currentVersion, &updateInfo)) {
    if (!silentMode) {
      ShowErrorDialog("Failed to check for updates");
    }
    return 1;
  }
  
  // If no updates available
  if (!updateInfo.updateAvailable) {
    if (!silentMode) {
      ShowInfoDialog("No updates available", "You are running the latest version of RetroNexus.");
    }
    return 0;
  }
  
  // If update available but silent mode is disabled, show update dialog
  if (!silentMode) {
    char message[256];
    sprintf(message, "An update is available: v%s\\n\\nDo you want to update now?", updateInfo.latestVersion);
    
    if (ShowConfirmDialog("Update Available", message) != IDYES) {
      return 0;
    }
  }
  
  // Download and install update
  if (!DownloadAndInstallUpdate(&updateInfo, silentMode)) {
    if (!silentMode) {
      ShowErrorDialog("Failed to install update");
    }
    return 1;
  }
  
  // Restart application if needed
  if (updateInfo.requiresRestart) {
    // Restart main application
    RestartApplication();
  }
  
  return 0;
}

[RESOURCES]
1 ICON "Updater.ico"
2 BITMAP "UpdateProgress.bmp"
`;
};

export const createCrashHandlerExe = (): string => {
  return `
// RetroNexus CrashHandler.exe
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
DBGHELP.dll
SHELL32.dll

[MAIN]
// Main crash handler entry point
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
  // Parse command line
  char dumpPath[MAX_PATH] = {0};
  DWORD processId = 0;
  ParseCrashHandlerArgs(lpCmdLine, &processId, dumpPath);
  
  if (processId == 0) {
    ShowErrorDialog("Invalid process ID provided");
    return 1;
  }
  
  // Open process handle
  HANDLE hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, processId);
  if (hProcess == NULL) {
    ShowErrorDialog("Failed to open process");
    return 1;
  }
  
  // Create mini dump
  if (!CreateMiniDump(hProcess, dumpPath)) {
    ShowErrorDialog("Failed to create crash dump");
    CloseHandle(hProcess);
    return 1;
  }
  
  // Close process handle
  CloseHandle(hProcess);
  
  // Show crash dialog
  ShowCrashDialog(dumpPath);
  
  return 0;
}

// Create mini dump
bool CreateMiniDump(HANDLE hProcess, const char* dumpPath) {
  HANDLE hFile = CreateFile(dumpPath, GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
  if (hFile == INVALID_HANDLE_VALUE) {
    return false;
  }
  
  MINIDUMP_EXCEPTION_INFORMATION exInfo;
  exInfo.ThreadId = GetThreadId(hProcess);
  exInfo.ExceptionPointers = NULL;
  exInfo.ClientPointers = FALSE;
  
  BOOL result = MiniDumpWriteDump(
    hProcess,
    GetProcessId(hProcess),
    hFile,
    MiniDumpNormal,
    &exInfo,
    NULL,
    NULL
  );
  
  CloseHandle(hFile);
  return (result == TRUE);
}

// Show crash dialog
void ShowCrashDialog(const char* dumpPath) {
  char message[1024];
  sprintf(message, 
    "RetroNexus has encountered an unexpected error and needs to close.\\n\\n"
    "A crash report has been created at:\\n%s\\n\\n"
    "Would you like to submit this report to help improve RetroNexus?",
    dumpPath
  );
  
  int result = MessageBox(NULL, message, "RetroNexus Crash Report", MB_YESNO | MB_ICONERROR);
  if (result == IDYES) {
    SubmitCrashReport(dumpPath);
  }
}

[RESOURCES]
1 ICON "CrashHandler.ico"
`;
};

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
  // Core files that need to be downloaded
  const DownloadFileInfo coreFiles[] = {
    {"RetroNexus.exe", "https://cdn.retronexus.example.com/downloads/1.2.5/RetroNexus.exe", 8640512},
    {"Emulator.exe", "https://cdn.retronexus.example.com/downloads/1.2.5/Emulator.exe", 4215808},
    {"Launcher.exe", "https://cdn.retronexus.example.com/downloads/1.2.5/Launcher.exe", 2567168},
    {"Updater.exe", "https://cdn.retronexus.example.com/downloads/1.2.5/Updater.exe", 1847296},
    {"CrashHandler.exe", "https://cdn.retronexus.example.com/downloads/1.2.5/CrashHandler.exe", 985088},
    {"RetroNexusCore.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/RetroNexusCore.dll", 12458752},
    {"EmulationEngine.dll", "https://cdn.retronexus.example.com/downloads/1.2.5/EmulationEngine.dll", 15727104}
  };

  // Create core directories
  const char* coreDirs[] = {
    "roms", "saves", "states", "configs", "logs", "cores", "plugins", 
    "assets", "shaders", "themes", "translations", "tools", "docs", 
    "netplay", "replays", "screenshots", "cheats", "profiles",
    "input_profiles", "audio", "video", "modloader", "cloud", 
    "telemetry", "cache", "cores\\bios", "cores\\systems", "libs"
  };

  // Create system-specific directories
  const char* systems[] = {
    "nes", "snes", "genesis", "n64", "ps1", "ps2", "dreamcast", 
    "gamecube", "gba", "nds", "psp", "saturn", "wii"
  };

  // Create all directories first
  SendMessageToUI(hwndProgress, "Creating directory structure...");
  
  for (int i = 0; i < ARRAYSIZE(coreDirs); i++) {
    char fullPath[MAX_PATH];
    sprintf(fullPath, "%s\\%s", state->installPath, coreDirs[i]);
    CreateDirectoryRecursive(fullPath);
    
    // Create readme file for each directory
    char readmePath[MAX_PATH];
    sprintf(readmePath, "%s\\readme.txt", fullPath);
    WriteReadmeFile(readmePath, coreDirs[i]);
  }
  
  // Create system directories
  for (int i = 0; i < ARRAYSIZE(systems); i++) {
    // ROM folders
    char romPath[MAX_PATH];
    sprintf(romPath, "%s\\roms\\%s", state->installPath, systems[i]);
    CreateDirectoryRecursive(romPath);
    
    // Save folders
    char savePath[MAX_PATH];
    sprintf(savePath, "%s\\saves\\%s", state->installPath, systems[i]);
    CreateDirectoryRecursive(savePath);
    
    // State folders
    char statePath[MAX_PATH];
    sprintf(statePath, "%s\\states\\%s", state->installPath, systems[i]);
    CreateDirectoryRecursive(statePath);
    
    // System-specific core folders
    char corePath[MAX_PATH];
    sprintf(corePath, "%s\\cores\\systems\\%s", state->installPath, systems[i]);
    CreateDirectoryRecursive(corePath);
    
    // System-specific core files
    char coreDllPath[MAX_PATH];
    sprintf(coreDllPath, "%s\\%s_core.dll", corePath, systems[i]);
    
    char coreUrl[256];
    sprintf(coreUrl, "https://cdn.retronexus.example.com/downloads/1.2.5/cores/%s_core.dll", systems[i]);
    
    // Add to download list
    AddFileToDownloadQueue(coreUrl, coreDllPath);
  }
  
  // Download all core files
  SendMessageToUI(hwndProgress, "Downloading core files...");
  int totalFiles = ARRAYSIZE(coreFiles);
  
  for (int i = 0; i < totalFiles; i++) {
    char localFilePath[MAX_PATH];
    sprintf(localFilePath, "%s\\%s", state->installPath, coreFiles[i].filename);
    
    char statusMsg[256];
    sprintf(statusMsg, "Downloading %s (%d of %d)...", coreFiles[i].filename, i+1, totalFiles);
    SendMessageToUI(hwndProgress, statusMsg);
    
    UpdateProgressPercentage(hwndProgress, (i * 100) / totalFiles);
    
    // Use Windows API to download the file
    if (!DownloadFileWithProgress(coreFiles[i].url, localFilePath, hwndProgress)) {
      sprintf(statusMsg, "Failed to download %s", coreFiles[i].filename);
      SendMessageToUI(hwndProgress, statusMsg);
      return false;
    }
  }
  
  // Process download queue for system-specific files
  SendMessageToUI(hwndProgress, "Downloading system-specific files...");
  if (!ProcessDownloadQueue(hwndProgress)) {
    SendMessageToUI(hwndProgress, "Failed to download some system files");
    return false;
  }
  
  // Download optional files based on user selections
  if (state->installOptionalComponents) {
    SendMessageToUI(hwndProgress, "Downloading optional components...");
    DownloadOptionalComponents(hwndProgress, state);
  }
  
  // Create configuration files
  SendMessageToUI(hwndProgress, "Creating configuration files...");
  CreateDefaultConfigFiles(state->installPath);
  
  return true;
}

// Run the installation process
bool PerformInstallation(HWND hwndProgress, SetupState* state) {
  // Create base installation directory
  if (!CreateDirectoryRecursive(state->installPath)) {
    char errorMsg[256];
    sprintf(errorMsg, "Failed to create directory: %s", state->installPath);
    MessageBox(NULL, errorMsg, "Installation Error", MB_ICONERROR);
    return false;
  }
  
  // Download required files
  if (!DownloadRequiredFiles(hwndProgress, state)) {
    MessageBox(NULL, "Failed to download required files. Please check your internet connection and try again.", "Download Error", MB_ICONERROR);
    return false;
  }
  
  // Register file associations
  if (state->registerFileAssociations) {
    SendMessageToUI(hwndProgress, "Registering file associations...");
    RegisterFileAssociations(state->installPath);
  }
  
  // Create shortcuts
  if (state->createDesktopShortcut) {
    SendMessageToUI(hwndProgress, "Creating desktop shortcut...");
    CreateDesktopShortcut(state->installPath);
  }
  
  // Create Start Menu shortcuts
  if (state->createStartMenuShortcuts) {
    SendMessageToUI(hwndProgress, "Creating Start Menu shortcuts...");
    CreateStartMenuShortcuts(state->installPath);
  }
  
  // Register uninstaller
  SendMessageToUI(hwndProgress, "Registering uninstaller...");
  RegisterUninstaller(state->installPath);
  
  // Set environment variables
  SendMessageToUI(hwndProgress, "Setting up environment variables...");
  SetEnvironmentVariables(state->installPath);
  
  return true;
}

[RESOURCES]
1 ICON "Setup.ico"
2 BITMAP "Banner.bmp"
3 BITMAP "Welcome.bmp"
4 BITMAP "Complete.bmp"
5 DIALOG IDD_SETUP_DIALOG
6 DIALOG IDD_LICENSE_DIALOG
7 DIALOG IDD_COMPONENTS_DIALOG
8 DIALOG IDD_PROGRESS_DIALOG
9 DIALOG IDD_COMPLETE_DIALOG
10 RCDATA "license.rtf"

[EMBEDDED_RESOURCES]
// Embedded small assets needed for initial setup
// These will be extracted during installation
1 RCDATA "embedded_banner.png"
2 RCDATA "embedded_icon.ico"
3 RCDATA "embedded_license.txt"

// Self-extracting setup capability
[SELF_EXTRACT_HEADER]
// Size and offset information for self-extraction
// This allows the setup.exe to download and install all necessary files
HEADER_SIZE = 4096
DOWNLOAD_MANIFEST_OFFSET = 2048
DOWNLOAD_MANIFEST_SIZE = 2048
`;
};
