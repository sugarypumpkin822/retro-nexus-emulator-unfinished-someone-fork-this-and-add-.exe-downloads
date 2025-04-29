
import { SetupFile, InstallLocation, SystemRequirements } from './setupTypes';

// Required setup files data
export const requiredSetupFiles: SetupFile[] = [
  { name: 'RetroNexusCore.dll', size: '245.3 MB', status: 'pending', progress: 0, required: true },
  { name: 'EmulationEngine.dll', size: '156.8 MB', status: 'pending', progress: 0, required: true },
  { name: 'HardwareAcceleration.dll', size: '87.2 MB', status: 'pending', progress: 0, required: true },
  { name: 'DirectX12Runtime.dll', size: '124.5 MB', status: 'pending', progress: 0, required: true },
  { name: 'VulkanSupport.dll', size: '76.3 MB', status: 'pending', progress: 0, required: true },
  { name: 'OpenGLWrapper.dll', size: '45.8 MB', status: 'pending', progress: 0, required: true },
  { name: 'AudioEngine.dll', size: '32.7 MB', status: 'pending', progress: 0, required: true },
  { name: 'InputManager.dll', size: '28.4 MB', status: 'pending', progress: 0, required: true },
  { name: 'NetworkServices.dll', size: '18.9 MB', status: 'pending', progress: 0, required: true },
  { name: 'CoreBIOS.bin', size: '12.6 MB', status: 'pending', progress: 0, required: true },
  { name: 'NESSystem.bin', size: '8.4 KB', status: 'pending', progress: 0, required: true },
  { name: 'SNESSystem.bin', size: '512 KB', status: 'pending', progress: 0, required: true },
  { name: 'N64System.bin', size: '2.4 MB', status: 'pending', progress: 0, required: true },
  { name: 'PSXSystem.bin', size: '4.2 MB', status: 'pending', progress: 0, required: true },
  { name: 'PS2System.bin', size: '8.6 MB', status: 'pending', progress: 0, required: true },
  { name: 'DreamcastSystem.bin', size: '3.8 MB', status: 'pending', progress: 0, required: true },
  { name: 'GBASystem.bin', size: '256 KB', status: 'pending', progress: 0, required: true },
  { name: 'GameCubeSystem.bin', size: '5.7 MB', status: 'pending', progress: 0, required: true },
  { name: "PhysicsEngine.dll", size: "64.8 MB", status: "pending", progress: 0, required: true },
  { name: "ShaderCompiler.dll", size: "43.2 MB", status: "pending", progress: 0, required: true },
  { name: "TextureProcessor.dll", size: "38.7 MB", status: "pending", progress: 0, required: true },
  { name: "SaveStateManager.dll", size: "22.4 MB", status: "pending", progress: 0, required: true },
  { name: "RenderingUtils.dll", size: "56.9 MB", status: "pending", progress: 0, required: true },
  { name: "NetworkLayer.dll", size: "34.2 MB", status: "pending", progress: 0, required: true },
  { name: "DebugTools.dll", size: "28.6 MB", status: "pending", progress: 0, required: true },
  { name: "MediaFoundation.dll", size: "92.3 MB", status: "pending", progress: 0, required: true },
  { name: "WiiSystem.bin", size: "4.8 MB", status: "pending", progress: 0, required: true },
  { name: "PSPSystem.bin", size: "3.2 MB", status: 'pending', progress: 0, required: true },
  { name: "NDSSystem.bin", size: "1.8 MB", status: "pending", progress: 0, required: true },
];

// Optional setup files data
export const optionalSetupFiles: SetupFile[] = [
  { name: 'EnhancedGraphics.dll', size: '98.3 MB', status: 'pending', progress: 0, required: false },
  { name: 'HDTexturePack.zip', size: '1.2 GB', status: 'pending', progress: 0, required: false },
  { name: 'AIUpscaling.dll', size: '145.7 MB', status: 'pending', progress: 0, required: false },
  { name: 'RayTracingSupport.dll', size: '276.5 MB', status: 'pending', progress: 0, required: false },
  { name: 'VirtualSurroundAudio.dll', size: '54.3 MB', status: 'pending', progress: 0, required: false },
  { name: 'PerformanceAnalyzer.dll', size: '32.7 MB', status: 'pending', progress: 0, required: false },
  { name: 'SaveStateManager.dll', size: '18.4 MB', status: 'pending', progress: 0, required: false },
  { name: 'NetplayServices.dll', size: '43.2 MB', status: 'pending', progress: 0, required: false },
  { name: 'ControllerProfiles.zip', size: '24.8 MB', status: 'pending', progress: 0, required: false },
  { name: 'LocalizationPack.zip', size: '76.5 MB', status: 'pending', progress: 0, required: false },
];

// Available install locations data
export const availableInstallLocations: InstallLocation[] = [
  { path: 'C:\\Program Files\\RetroNexus', freeSpace: '120 GB', recommended: true },
  { path: 'C:\\RetroNexus', freeSpace: '120 GB', recommended: false },
  { path: 'D:\\Games\\RetroNexus', freeSpace: '450 GB', recommended: false },
];

// System requirements data
export const windowsRequirements: SystemRequirements = {
  os: "Windows 10 (64-bit) or Windows 11",
  processor: "Intel Core i5-14400F / AMD Ryzen 5 7600 or better",
  memory: "16 GB RAM",
  graphics: "NVIDIA RTX 4060 8GB / AMD RX 7600 8GB or better",
  directX: "Version 12",
  storage: "50 GB available space",
  additionalNotes: "SSD storage recommended for optimal performance."
};
