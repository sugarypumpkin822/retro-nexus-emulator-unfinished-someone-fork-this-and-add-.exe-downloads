
/**
 * Generator for Updater executable content
 */

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
