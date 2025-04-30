
/**
 * Generator for CrashHandler executable content
 */

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
