
/**
 * Generator for Windows executable text content
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
