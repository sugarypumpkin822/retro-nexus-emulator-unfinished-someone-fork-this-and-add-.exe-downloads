
/**
 * Generator for Emulator executable content
 */

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
// Secondary emulation runner that delegates to RetroNexus.exe
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
  // Check if RetroNexus.exe exists
  DWORD fileAttr = GetFileAttributesA("RetroNexus.exe");
  if (fileAttr == INVALID_FILE_ATTRIBUTES) {
    MessageBoxA(NULL, "RetroNexus.exe not found. Please reinstall the application.", "Error", MB_ICONERROR);
    return 1;
  }
  
  // Launch RetroNexus.exe with the same command line
  char commandLine[1024] = "RetroNexus.exe ";
  if (lpCmdLine && lpCmdLine[0] != '\\0') {
    strcat(commandLine, lpCmdLine);
  }
  
  STARTUPINFO si = { sizeof(STARTUPINFO) };
  PROCESS_INFORMATION pi;
  
  if (!CreateProcessA(NULL, commandLine, NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi)) {
    MessageBoxA(NULL, "Failed to launch RetroNexus.exe", "Error", MB_ICONERROR);
    return 1;
  }
  
  // Wait for process to exit
  WaitForSingleObject(pi.hProcess, INFINITE);
  
  // Get exit code
  DWORD exitCode = 0;
  GetExitCodeProcess(pi.hProcess, &exitCode);
  
  // Clean up
  CloseHandle(pi.hProcess);
  CloseHandle(pi.hThread);
  
  return exitCode;
}

[RESOURCES]
1 ICON "RetroNexus.ico"
2 BITMAP "RetroNexus.bmp"
1 MANIFEST "RetroNexus.manifest"
`;
};
