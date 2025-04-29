
/**
 * File generation utilities for package files
 */

export const createVCRedistFile = (): string => {
  return `Microsoft Visual C++ Redistributable Package (simulated)`;
};

export const createDirectX12File = (): string => {
  return `DirectX 12 Setup Package (simulated)`;
};

export const createDLLFiles = (): { name: string; content: string }[] => {
  return [
    { name: 'RetroNexusCore.dll', content: 'Core DLL content' },
    { name: 'EmulationEngine.dll', content: 'Emulation Engine DLL content' },
    { name: 'HardwareAcceleration.dll', content: 'Hardware Acceleration DLL content' },
    { name: 'InputManager.dll', content: 'Input Manager DLL content' },
    { name: 'AudioEngine.dll', content: 'Audio Engine DLL content' },
    { name: 'PhysicsEngine.dll', content: 'Physics Engine DLL content' },
    { name: 'ShaderCompiler.dll', content: 'Shader Compiler DLL content' },
    { name: 'TextureProcessor.dll', content: 'Texture Processor DLL content' },
    { name: 'SaveStateManager.dll', content: 'Save State Manager DLL content' },
    { name: 'RenderingUtils.dll', content: 'Rendering Utils DLL content' },
    { name: 'NetworkLayer.dll', content: 'Network Layer DLL content' },
    { name: 'DebugTools.dll', content: 'Debug Tools DLL content' },
    { name: 'MediaFoundation.dll', content: 'Media Foundation DLL content' }
  ];
};

export const createConfigFiles = (): { mainConfig: string; biosConfig: string } => {
  const mainConfig = `
[General]
Version=1.2.5.482
Language=English
ThemeName=Default
LastOpenedGame=
AutoSaveInterval=600
CheckForUpdates=true
AllowTelemetry=false
HardwareAcceleration=true

[Display]
Fullscreen=false
Resolution=1920x1080
AspectRatio=auto
VSync=true
Bilinear=true
CRTShader=false
HardwareFiltering=true
Upscaling=1x

[Audio]
Volume=80
BufferSize=128
OutputDevice=default
Stereo=true
ReverseL=false
ReverseR=false

[Input]
GamepadEnabled=true
KeyboardEnabled=true
DefaultMapping=Xbox
AutoConfigureGamepads=true
DeadzoneValue=15
TurboSpeed=10

[Network]
EnableNetplay=true
PreferredServer=auto
SpectatorMode=false
UseUPnP=true
PortNumber=55435
Latency=2
`;

  const biosConfig = `
[NES]
Path=cores/bios/nes_bios.bin
Required=false
MD5=ABCDEF1234567890

[PlayStation]
Path=cores/bios/ps1_bios.bin
Required=true
MD5=ABCDEF1234567890

[PlayStation2]
Path=cores/bios/ps2_bios.bin
Required=true
MD5=ABCDEF1234567890

[GameBoyAdvance]
Path=cores/bios/gba_bios.bin
Required=true
MD5=ABCDEF1234567890

[Dreamcast]
Path=cores/bios/dc_bios.bin
Required=true
MD5=ABCDEF1234567890

[Nintendo64]
Path=cores/bios/n64_bios.bin
Required=false
MD5=ABCDEF1234567890

[Sega Saturn]
Path=cores/bios/saturn_bios.bin
Required=true
MD5=ABCDEF1234567890
`;

  return { mainConfig, biosConfig };
};

export const createSystemCoreDll = (system: string): string => {
  const systemNames: Record<string, string> = {
    nes: 'Nintendo Entertainment System',
    snes: 'Super Nintendo Entertainment System',
    genesis: 'Sega Genesis/Mega Drive',
    n64: 'Nintendo 64',
    ps1: 'PlayStation',
    ps2: 'PlayStation 2',
    dreamcast: 'Sega Dreamcast',
    gamecube: 'Nintendo GameCube',
    gba: 'Game Boy Advance',
    nds: 'Nintendo DS',
    psp: 'PlayStation Portable',
    saturn: 'Sega Saturn',
    wii: 'Nintendo Wii'
  };

  const fullName = systemNames[system] || system.toUpperCase();
  
  return `
// RetroNexus ${fullName} Core DLL
// Version: 1.2.5.482
// Copyright © 2025 RetroNexus Technologies Inc.

[DLL_HEADER]
4D 5A 90 00 03 00 00 00 04 00 00 00 FF FF 00 00
B8 00 00 00 00 00 00 00 40 00 00 00 00 00 00 00

[EXPORTS]
Initialize${system.toUpperCase()}Core
Shutdown${system.toUpperCase()}Core
Load${system.toUpperCase()}ROM
Execute${system.toUpperCase()}Frame
Reset${system.toUpperCase()}System
Get${system.toUpperCase()}MemoryMap
Set${system.toUpperCase()}Region
Get${system.toUpperCase()}ScreenWidth
Get${system.toUpperCase()}ScreenHeight
Save${system.toUpperCase()}State
Load${system.toUpperCase()}State
Configure${system.toUpperCase()}Input

[DEPENDENCIES]
KERNEL32.dll
USER32.dll
RetroNexusCore.dll
EmulationEngine.dll

[VERSION_INFO]
CompanyName: RetroNexus Technologies
FileDescription: RetroNexus ${fullName} Emulation Core
LegalCopyright: © 2025 RetroNexus Technologies Inc.
ProductName: RetroNexus Emulator
FileVersion: 1.2.5.482
ProductVersion: 1.2.5.482
`;
};

export const createFolderReadme = (folder: string): string => {
  const descriptions: Record<string, string> = {
    roms: 'Store your ROM files here, organized by console.',
    saves: 'Save files from your gameplay sessions.',
    states: 'Save state files for quick save/load.',
    configs: 'Configuration files for emulator and games.',
    logs: 'Log files for debugging and troubleshooting.',
    cores: 'Emulation cores for different game systems.',
    plugins: 'Optional plugins and extensions.',
    assets: 'UI and visual assets like icons and images.',
    shaders: 'Shader files for visual enhancements.',
    themes: 'Custom UI themes and skins.',
    translations: 'Language files for localization.',
    tools: 'Utility tools and applications.',
    docs: 'Documentation and manuals.',
    netplay: 'Netplay configuration and session files.',
    replays: 'Game replay recordings.',
    screenshots: 'Captured gameplay screenshots.',
    cheats: 'Cheat files organized by game.',
    profiles: 'User profiles and settings.',
    input_profiles: 'Controller configurations and mappings.',
    audio: 'Audio files and sound settings.',
    video: 'Video settings and recordings.',
    modloader: 'Game modification files and resources.',
    cloud: 'Cloud sync settings and cached files.',
    telemetry: 'Anonymous usage data (if enabled).',
    cache: 'Temporary cache files.'
  };

  const defaultDesc = 'RetroNexus system folder.';
  const description = descriptions[folder] || defaultDesc;
  
  return `
RetroNexus ${folder} Directory
==============================

${description}

This directory is managed by RetroNexus and may be updated during software updates.
Custom content should be placed in user-specific subdirectories for safety.

RetroNexus v1.2.5.482
Copyright © 2025 RetroNexus Technologies Inc.
`;
};

export const createSampleConfigFile = (): string => {
  return `
[RetroNexus]
version = 1.2.5.482
author = RetroNexus Technologies Inc.
website = https://retronexus.example.com

[Performance]
resolution = native
vsync = true
threaded_rendering = true
buffer_swap = auto
frame_skip = 0
overclock = 100
gpu_renderer = auto

[Video]
fullscreen = false
scaling = linear
aspect_ratio = auto
shader = none
integer_scaling = false
bilinear = true
crop_overscan = false

[Audio]
enabled = true
volume = 0.8
sync = true
rate = 48000
latency = 64
reverb = false
stereo = true
`;
};

export const createSampleShaderFile = (): string => {
  return `
// RetroNexus CRT-style shader
// Version 1.0
// Based on CRT-Geom shader

#version 330 core
uniform sampler2D Texture;
uniform vec2 TextureSize;
uniform vec2 InputSize;
uniform vec2 OutputSize;

in vec2 fragCoord;
out vec4 FragColor;

#define CURVATURE 0.5
#define SCANLINES 0.5
#define SHADOW_MASK 0.3
#define BRIGHTNESS 1.0
#define DISTORTION 0.1
#define CORNER 0.02

void main() {
    // Basic texture coordinate adjustment
    vec2 uv = fragCoord;
    
    // Apply screen curvature
    vec2 cc = uv - 0.5;
    float dist = dot(cc, cc) * DISTORTION;
    uv = uv + cc * (0.5 - dist) * CURVATURE;
    
    // Check if we're outside the visible area after distortion
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    // Sample the texture
    vec3 color = texture(Texture, uv).rgb;
    
    // Apply scanlines
    float scanline = sin(uv.y * TextureSize.y * 3.1415);
    scanline = (1.0 - SCANLINES) + SCANLINES * scanline;
    color *= scanline;
    
    // Apply shadow mask
    int px = int(fragCoord.x * OutputSize.x);
    int mask = px % 3;
    vec3 mask_weights = vec3(0.0);
    
    if (mask == 0) mask_weights = vec3(1.0, SHADOW_MASK, SHADOW_MASK);
    else if (mask == 1) mask_weights = vec3(SHADOW_MASK, 1.0, SHADOW_MASK);
    else mask_weights = vec3(SHADOW_MASK, SHADOW_MASK, 1.0);
    
    color *= mask_weights;
    
    // Apply vignette (darker corners)
    float vignette = 1.0 - dot(cc, cc) * CORNER;
    color *= vignette;
    
    // Apply brightness
    color *= BRIGHTNESS;
    
    FragColor = vec4(color, 1.0);
}
`;
};

export const createSampleThemeFile = (): string => {
  return `
{
  "name": "Default",
  "version": "1.2.5",
  "author": "RetroNexus Design Team",
  "license": "Proprietary",
  "colors": {
    "primary": "#3498db",
    "secondary": "#2ecc71",
    "background": "#1f2233",
    "cardBackground": "#2a2f42",
    "text": "#ffffff",
    "textSecondary": "#b8b8b8",
    "accent": "#e74c3c",
    "warning": "#f39c12",
    "success": "#2ecc71",
    "error": "#e74c3c",
    "highlight": "#3a3f55"
  },
  "fonts": {
    "main": "Roboto",
    "headings": "Orbitron",
    "monospace": "Roboto Mono",
    "retro": "Press Start 2P"
  },
  "buttons": {
    "borderRadius": "4px",
    "primaryColor": "#3498db",
    "primaryTextColor": "#ffffff",
    "secondaryColor": "#2a2f42",
    "secondaryTextColor": "#ffffff",
    "hoverEffectIntensity": 0.1
  },
  "gameLibrary": {
    "cardAspectRatio": "4:3",
    "coverArtStyle": "boxart",
    "gridColumns": 4,
    "gridGap": "12px",
    "showTitles": true
  },
  "effects": {
    "useBlur": true,
    "useTransition": true,
    "animationSpeed": "normal",
    "glowIntensity": 0.6
  },
  "icons": {
    "style": "outlined",
    "size": "medium",
    "animation": true
  }
}
`;
};

export const createSampleLogFile = (): string => {
  // Create a realistic log file with timestamps
  const now = new Date();
  const timestamp = now.toISOString();
  const timestampYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  
  return `
[${timestampYesterday}] [INFO] RetroNexus v1.2.5.482 starting up
[${timestampYesterday}] [INFO] Operating System: Windows 11 Pro 64-bit (10.0.22621)
[${timestampYesterday}] [INFO] CPU: Intel(R) Core(TM) i9-13900K @ 5.80GHz
[${timestampYesterday}] [INFO] RAM: 32768 MB total, 24576 MB available
[${timestampYesterday}] [INFO] GPU: NVIDIA GeForce RTX 4080 [Driver: 546.29]
[${timestampYesterday}] [INFO] Loading configuration from C:\\Users\\User\\AppData\\Roaming\\RetroNexus\\config.ini
[${timestampYesterday}] [INFO] Loading core: RetroNexusCore.dll
[${timestampYesterday}] [INFO] Loading hardware acceleration module: HardwareAcceleration.dll
[${timestampYesterday}] [INFO] DirectX 12 initialized successfully
[${timestampYesterday}] [INFO] Loading input manager: InputManager.dll
[${timestampYesterday}] [INFO] Detected 2 gamepad controllers
[${timestampYesterday}] [INFO] Loading audio engine: AudioEngine.dll
[${timestampYesterday}] [INFO] Audio initialized: 48000Hz, 16-bit, Stereo
[${timestampYesterday}] [INFO] Loading save state manager: SaveStateManager.dll
[${timestampYesterday}] [INFO] Scanning ROM directories...
[${timestampYesterday}] [INFO] Found 1,245 ROMs across 12 systems
[${timestampYesterday}] [INFO] Building game library database...
[${timestampYesterday}] [INFO] Loading recent games list
[${timestampYesterday}] [INFO] Startup complete in 3.42 seconds
[${timestampYesterday}] [INFO] User launched game: Super Mario World (SNES)
[${timestampYesterday}] [INFO] Loading SNES core: SNESSystem.dll
[${timestampYesterday}] [INFO] Allocating 2MB for SNES emulated RAM
[${timestampYesterday}] [INFO] ROM loaded: Super Mario World (34.7 MB)
[${timestampYesterday}] [INFO] Game running at 60.10 FPS (100% speed)
[${timestampYesterday}] [INFO] Save state created: slot 1
[${timestampYesterday}] [INFO] Save state created: slot 2
[${timestampYesterday}] [INFO] User exited game after 1h 23m 12s of play
[${timestampYesterday}] [INFO] Releasing SNES core resources
[${timestampYesterday}] [INFO] RetroNexus shutting down normally
[${timestamp}] [INFO] RetroNexus v1.2.5.482 starting up
[${timestamp}] [INFO] Operating System: Windows 11 Pro 64-bit (10.0.22621)
[${timestamp}] [INFO] CPU: Intel(R) Core(TM) i9-13900K @ 5.80GHz
[${timestamp}] [INFO] RAM: 32768 MB total, 25600 MB available
[${timestamp}] [INFO] GPU: NVIDIA GeForce RTX 4080 [Driver: 546.29]
[${timestamp}] [INFO] Loading configuration from C:\\Users\\User\\AppData\\Roaming\\RetroNexus\\config.ini
[${timestamp}] [INFO] Loading core: RetroNexusCore.dll
[${timestamp}] [INFO] Loading hardware acceleration module: HardwareAcceleration.dll
[${timestamp}] [INFO] DirectX 12 initialized successfully
[${timestamp}] [INFO] Loading input manager: InputManager.dll
[${timestamp}] [INFO] Detected 2 gamepad controllers
[${timestamp}] [INFO] Loading audio engine: AudioEngine.dll
[${timestamp}] [INFO] Audio initialized: 48000Hz, 16-bit, Stereo
[${timestamp}] [INFO] Loading save state manager: SaveStateManager.dll
[${timestamp}] [INFO] Scanning ROM directories...
[${timestamp}] [INFO] Found 1,245 ROMs across 12 systems
[${timestamp}] [INFO] Building game library database...
[${timestamp}] [INFO] Loading recent games list
[${timestamp}] [INFO] Startup complete in 3.56 seconds
`;
};

export const createDummyPdfFile = (title: string): string => {
  return `%PDF-1.7
1 0 obj
<< /Type /Catalog
   /Pages 2 0 R
>>
endobj
2 0 obj
<< /Type /Pages
   /Kids [3 0 R]
   /Count 1
>>
endobj
3 0 obj
<< /Type /Page
   /Parent 2 0 R
   /Resources << /Font << /F1 4 0 R >> >>
   /MediaBox [0 0 612 792]
   /Contents 5 0 R
>>
endobj
4 0 obj
<< /Type /Font
   /Subtype /Type1
   /BaseFont /Helvetica
>>
endobj
5 0 obj
<< /Length 68 >>
stream
BT
/F1 24 Tf
100 700 Td
(${title}) Tj
/F1 12 Tf
0 -30 Td
(RetroNexus Documentation) Tj
0 -20 Td
(Copyright © 2025 RetroNexus Technologies Inc.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000234 00000 n
0000000301 00000 n
trailer
<< /Size 6
   /Root 1 0 R
>>
startxref
421
%%EOF`;
};

export const createCompatibilityListHtml = (): string => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>RetroNexus Compatibility List</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
    h1 { color: #1f2233; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
    th { background-color: #2a2f42; color: white; }
    tr:hover { background-color: #f5f5f5; }
    .perfect { color: #2ecc71; }
    .playable { color: #3498db; }
    .issues { color: #f39c12; }
    .broken { color: #e74c3c; }
    .status-dot { height: 12px; width: 12px; border-radius: 50%; display: inline-block; margin-right: 5px; }
    .status-perfect { background-color: #2ecc71; }
    .status-playable { background-color: #3498db; }
    .status-issues { background-color: #f39c12; }
    .status-broken { background-color: #e74c3c; }
    .system-heading { background-color: #eee; font-weight: bold; padding: 10px; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>RetroNexus Compatibility List</h1>
  <p>Last updated: April 27, 2025</p>
  
  <div class="system-heading">Nintendo Entertainment System (NES)</div>
  <table>
    <tr>
      <th>Game</th>
      <th>Status</th>
      <th>Notes</th>
    </tr>
    <tr>
      <td>Super Mario Bros.</td>
      <td><span class="status-dot status-perfect"></span><span class="perfect">Perfect</span></td>
      <td>Runs flawlessly at full speed</td>
    </tr>
    <tr>
      <td>The Legend of Zelda</td>
      <td><span class="status-dot status-perfect"></span><span class="perfect">Perfect</span></td>
      <td>Fully compatible with all game functions</td>
    </tr>
    <tr>
      <td>Metroid</td>
      <td><span class="status-dot status-perfect"></span><span class="perfect">Perfect</span></td>
      <td>All features working correctly</td>
    </tr>
    <tr>
      <td>Castlevania</td>
      <td><span class="status-dot status-playable"></span><span class="playable">Playable</span></td>
      <td>Minor audio glitches in certain levels</td>
    </tr>
    <tr>
      <td>Battletoads</td>
      <td><span class="status-dot status-issues"></span><span class="issues">Issues</span></td>
      <td>Level 3 has graphical corruption</td>
    </tr>
  </table>
  
  <div class="system-heading">Super Nintendo Entertainment System (SNES)</div>
  <table>
    <tr>
      <th>Game</th>
      <th>Status</th>
      <th>Notes</th>
    </tr>
    <tr>
      <td>Super Mario World</td>
      <td><span class="status-dot status-perfect"></span><span class="perfect">Perfect</span></td>
      <td>Runs flawlessly at full speed</td>
    </tr>
    <tr>
      <td>The Legend of Zelda: A Link to the Past</td>
      <td><span class="status-dot status-perfect"></span><span class="perfect">Perfect</span></td>
      <td>Fully compatible with save states</td>
    </tr>
    <tr>
      <td>Chrono Trigger</td>
      <td><span class="status-dot status-playable"></span><span class="playable">Playable</span></td>
      <td>Minor graphical issues during certain cutscenes</td>
    </tr>
    <tr>
      <td>Star Fox</td>
      <td><span class="status-dot status-issues"></span><span class="issues">Issues</span></td>
      <td>SuperFX chip emulation has some performance issues on slower systems</td>
    </tr>
    <tr>
      <td>Donkey Kong Country</td>
      <td><span class="status-dot status-perfect"></span><span class="perfect">Perfect</span></td>
      <td>All features working correctly</td>
    </tr>
  </table>
  
  <!-- More systems would be listed here -->
  
  <p><strong>Status Explanation:</strong></p>
  <ul>
    <li><span class="status-dot status-perfect"></span><span class="perfect">Perfect</span> - Game works flawlessly with no known issues</li>
    <li><span class="status-dot status-playable"></span><span class="playable">Playable</span> - Game can be played from start to finish with minor issues</li>
    <li><span class="status-dot status-issues"></span><span class="issues">Issues</span> - Game has noticeable problems but is still playable</li>
    <li><span class="status-dot status-broken"></span><span class="broken">Broken</span> - Game crashes or has severe issues preventing completion</li>
  </ul>
</body>
</html>`;
};

export const createLegalText = (): string => {
  return `
RetroNexus Legal Information and Disclaimer
===========================================

Copyright © 2025 RetroNexus Technologies Inc.
All rights reserved.

SOFTWARE LICENSE AGREEMENT
-------------------------

This Software License Agreement ("Agreement") is between you (either an individual or an entity) and RetroNexus Technologies Inc. ("RetroNexus"). By installing, copying, or otherwise using RetroNexus software ("Software"), you agree to be bound by the terms of this Agreement.

1. GRANT OF LICENSE
RetroNexus grants you a non-exclusive, non-transferable license to use the Software on one computer for personal, non-commercial use only.

2. COPYRIGHT
The Software is protected by copyright laws and international treaty provisions. You acknowledge that no title to the intellectual property in the Software is transferred to you. You further acknowledge that title and full ownership rights to the Software will remain the exclusive property of RetroNexus.

3. REVERSE ENGINEERING
You agree not to attempt to reverse compile, modify, translate, or disassemble the Software in whole or in part.

4. DISCLAIMER OF WARRANTY
THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. RETRONEXUS DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION, ANY IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.

5. LIMITATION OF LIABILITY
IN NO EVENT SHALL RETRONEXUS BE LIABLE FOR ANY DAMAGES WHATSOEVER (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF BUSINESS PROFITS, BUSINESS INTERRUPTION, LOSS OF BUSINESS INFORMATION, OR ANY OTHER PECUNIARY LOSS) ARISING OUT OF THE USE OF OR INABILITY TO USE THE SOFTWARE, EVEN IF RETRONEXUS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

ROM AND BIOS FILES
------------------
RetroNexus does not include or provide ROM or BIOS files for any system. Users are responsible for obtaining any necessary ROM or BIOS files legally according to the laws in their jurisdiction.

RetroNexus does not condone or promote piracy. We encourage users to legally dump their own ROMs from original cartridges and discs they own, and to extract BIOS files from their own hardware.

TRADEMARK NOTICE
---------------
All product names, trademarks, and registered trademarks mentioned in this software and documentation are the property of their respective owners.

Nintendo, PlayStation, Sega, and other console names are registered trademarks of their respective owners and are used for identification purposes only.

CONTACT INFORMATION
------------------
If you have questions regarding this license, please contact:
legal@retronexus.example.com
`;
};

export const createMainReadmeFile = (): string => {
  return `
===================================
RetroNexus Multi-System Emulator
===================================
Version 1.2.5.482
Copyright © 2025 RetroNexus Technologies Inc.

Thank you for downloading RetroNexus, the comprehensive multi-system emulator!

INSTALLATION
-----------
To install RetroNexus:
1. Run Setup.exe with administrator privileges.
2. Follow the on-screen instructions.
3. Once installation completes, you can launch RetroNexus from the desktop shortcut or Start Menu.

SYSTEM REQUIREMENTS
------------------
Minimum:
- Windows 10 (64-bit) or Windows 11
- Intel Core i5-14400F / AMD Ryzen 5 7600 or better
- 16 GB RAM
- NVIDIA RTX 4060 8GB / AMD RX 7600 8GB or better
- DirectX 12
- 50 GB available space

Recommended:
- Windows 11 (latest)
- Intel Core i7-14700K / AMD Ryzen 7 7800X3D or better
- 32 GB RAM
- NVIDIA RTX 4070 12GB / AMD RX 7800 XT 16GB or better
- SSD storage
- Xbox/PlayStation controller

SUPPORTED SYSTEMS
----------------
RetroNexus currently supports the following game systems:
- Nintendo Entertainment System (NES)
- Super Nintendo Entertainment System (SNES)
- Nintendo 64 (N64)
- Nintendo GameCube
- Nintendo Wii
- Game Boy / Game Boy Color
- Game Boy Advance
- Nintendo DS
- PlayStation (PSX)
- PlayStation 2 (PS2)
- PlayStation Portable (PSP)
- Sega Genesis / Mega Drive
- Sega Saturn
- Sega Dreamcast
- TurboGrafx-16 / PC Engine
- Neo Geo

BASIC USAGE
----------
1. Launch RetroNexus
2. Use the "File" menu to scan for ROMs or add ROM directories
3. Browse your game library and double-click a game to play
4. Use keyboard or connected controllers to play
5. Press F1 for in-game options and hotkeys

DEFAULT HOTKEYS
--------------
F1 - Quick Menu
F2 - Save State
F3 - Load State
F4 - Toggle Fullscreen
F5 - Screenshot
F6 - Fast Forward (hold)
F7 - Rewind (hold)
F8 - Frame Advance
Escape - Exit game / Return to menu

GETTING HELP
-----------
For help and troubleshooting:
- Check the docs folder for detailed documentation
- Visit our website: https://retronexus.example.com
- Community forums: https://community.retronexus.example.com
- Email support: support@retronexus.example.com

LEGAL NOTICE
-----------
RetroNexus is a high-performance multi-system emulator. RetroNexus does not include ROMs or BIOS files for any system. Users are responsible for obtaining these files legally according to laws in their jurisdiction.

See docs/legal.txt for full legal information.
`;
};

export const createDummyBiosFile = (biosType: string): string => {
  return `This is a simulated ${biosType} file for demonstration purposes. In a real package, this would be an actual binary BIOS file required for emulation.`;
};
