
# RetroNexus Emulator

RetroNexus is a multi-system emulation platform with support for Windows systems.

## System Requirements

- **Operating System:** Windows 10 (64-bit) or Windows 11
- **Processor:** Intel Core i5-14400F / AMD Ryzen 5 7600 or better
- **Memory:** 16 GB RAM
- **Graphics:** NVIDIA RTX 4060 8GB / AMD RX 7600 8GB or better
- **DirectX:** Version 12
- **Storage:** 50 GB available space
- **Notes:** SSD storage recommended for optimal performance

## Installation Instructions

1. Download the RetroNexus setup package
2. Extract the ZIP file to a temporary directory
3. Run install.bat or install.ps1 with administrative privileges
4. Follow the on-screen instructions to complete installation

## BIOS Access

Access the BIOS configuration during startup by pressing one of these keys when the RetroNexus logo appears:
- DEL
- F2
- F12

## Included Files

The download package includes:
- Installation scripts (BAT and PowerShell)
- Configuration files
- Text representations of binary files
- Visual C++ Redistributable setup
- DirectX 12 runtime setup
- File associations for ROMs and ISOs

## Default Installation Path

The default installation path is `C:\RetroNexus` with the following structure:
- Games/ROMs
- Games/ISOs
- SaveStates
- SaveData
- Screenshots
- Recordings
- Shaders
- Textures

## Technical Notes

- Windows integration via register entries and file associations
- Hardware detection to ensure system compatibility
- High-performance emulation engine with multi-threading support
- DirectX 12 graphics backend with optional ray tracing
- XInput controller support with auto-configuration
