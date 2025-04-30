
/**
 * Generator for Launcher executable content
 */

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
