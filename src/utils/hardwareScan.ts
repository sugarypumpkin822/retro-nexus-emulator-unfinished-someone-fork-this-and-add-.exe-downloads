
import { toast } from 'sonner';

export interface SystemComponent {
  name: string;
  details: string;
  isDetected: boolean;
  meetsMinimum: boolean;
  recommendedSpec?: string;
  currentValue?: string;
}

export interface SystemScanResults {
  cpu: SystemComponent;
  gpu: SystemComponent;
  ram: SystemComponent;
  storage: SystemComponent;
  directX: SystemComponent;
  operatingSystem: SystemComponent;
  soundCard?: SystemComponent;
  networkAdapter?: SystemComponent;
}

// Map GPU models to their relative performance scores (higher is better)
const gpuScores: Record<string, number> = {
  'RTX 4090': 100,
  'RTX 4080 Super': 95,
  'RTX 4080': 90,
  'RTX 4070 Ti Super': 85,
  'RTX 4070 Ti': 80,
  'RTX 4070': 75,
  'RTX 4060 Ti': 70,
  'RTX 4060': 65,
  'RTX 3090 Ti': 88,
  'RTX 3090': 85,
  'RTX 3080 Ti': 82,
  'RTX 3080': 80,
  'RTX 3070 Ti': 75,
  'RTX 3070': 70,
  'RTX 3060 Ti': 65,
  'RTX 3060': 60,
  'RTX 2080 Ti': 75,
  'RTX 2080 Super': 70,
  'RTX 2080': 68,
  'RTX 2070 Super': 63,
  'RTX 2070': 60,
  'RTX 2060 Super': 55,
  'RTX 2060': 50,
  'GTX 1080 Ti': 58,
  'GTX 1080': 53,
  'GTX 1070 Ti': 48,
  'GTX 1070': 45,
  'GTX 1060': 40,
  'RX 7900 XTX': 95,
  'RX 7900 XT': 90,
  'RX 7800 XT': 80,
  'RX 7700 XT': 75,
  'RX 7600 XT': 70,
  'RX 7600': 65,
  'RX 6950 XT': 85,
  'RX 6900 XT': 82,
  'RX 6800 XT': 78,
  'RX 6800': 75,
  'RX 6700 XT': 70,
  'RX 6700': 65,
  'RX 6600 XT': 60,
  'RX 6600': 55,
  'RX 5700 XT': 58,
  'RX 5700': 55,
  'RX 5600 XT': 50,
  'RX 5600': 48,
};

// Map CPU models to their relative performance scores (higher is better)
const cpuScores: Record<string, number> = {
  // Intel 14th gen
  'i9-14900K': 100,
  'i7-14700K': 95,
  'i5-14600K': 90,
  'i5-14500': 85,
  'i5-14400F': 80,
  'i3-14100F': 70,
  
  // Intel 13th gen
  'i9-13900K': 98,
  'i7-13700K': 93,
  'i5-13600K': 88,
  'i5-13500': 83,
  'i5-13400F': 78,
  'i3-13100F': 68,
  
  // Intel 12th gen
  'i9-12900K': 95,
  'i7-12700K': 90,
  'i5-12600K': 85,
  'i5-12500': 80,
  'i5-12400F': 75,
  'i3-12100F': 65,
  
  // Intel 11th gen and below
  'i9-11900K': 85,
  'i7-11700K': 80,
  'i5-11600K': 75,
  'i5-11400F': 70,
  'i9-10900K': 82,
  'i7-10700K': 77,
  'i5-10600K': 72,
  'i5-10400F': 67,
  
  // AMD Ryzen 7000 series
  'Ryzen 9 7950X3D': 100,
  'Ryzen 9 7950X': 98,
  'Ryzen 9 7900X3D': 97,
  'Ryzen 9 7900X': 95,
  'Ryzen 7 7800X3D': 93,
  'Ryzen 7 7700X': 90,
  'Ryzen 5 7600X': 85,
  'Ryzen 5 7600': 82,
  
  // AMD Ryzen 5000 series
  'Ryzen 9 5950X': 92,
  'Ryzen 9 5900X': 89,
  'Ryzen 7 5800X3D': 88,
  'Ryzen 7 5800X': 85,
  'Ryzen 5 5600X': 80,
  'Ryzen 5 5600': 77,
  
  // AMD Ryzen 3000 series
  'Ryzen 9 3950X': 85,
  'Ryzen 9 3900X': 82,
  'Ryzen 7 3800X': 78,
  'Ryzen 7 3700X': 75,
  'Ryzen 5 3600X': 70,
  'Ryzen 5 3600': 68,
};

// Simulate detecting system hardware
export const detectSystemHardware = (): Promise<SystemScanResults> => {
  return new Promise((resolve) => {
    // Simulate a delay for "scanning"
    setTimeout(() => {
      try {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        let memoryEstimate = 8; // Default to 8GB
        
        // Try to get device memory if available
        if ('deviceMemory' in navigator) {
          // @ts-ignore - deviceMemory is not in the standard type definition
          memoryEstimate = navigator.deviceMemory;
        }
        
        // Simulate GPU detection
        let detectedGpu = 'Unknown GPU';
        let gpuScore = 0;
        let gpuVendor = '';
        
        // Try to get WebGL info to estimate GPU capability
        try {
          const canvas = document.createElement('canvas');
          // Use explicit cast to WebGLRenderingContext
          const gl = canvas.getContext('webgl') as WebGLRenderingContext || 
                    canvas.getContext('experimental-webgl') as WebGLRenderingContext;
          
          if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
              const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
              const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
              
              // For debug/demo purposes only, not accurate for real hardware detection
              if (renderer.includes('NVIDIA')) {
                detectedGpu = 'RTX 4060';
                gpuScore = gpuScores['RTX 4060'] || 65;
                gpuVendor = 'NVIDIA';
              } else if (renderer.includes('AMD') || renderer.includes('Radeon')) {
                detectedGpu = 'RX 7600';
                gpuScore = gpuScores['RX 7600'] || 65;
                gpuVendor = 'AMD';
              } else if (renderer.includes('Intel')) {
                detectedGpu = 'Intel Iris Xe';
                gpuScore = 40; // Approximate score
                gpuVendor = 'Intel';
              } else {
                detectedGpu = renderer;
              }
            }
          }
        } catch (error) {
          console.error('Error detecting GPU:', error);
        }
        
        // Simulate CPU detection
        let detectedCpu = 'Unknown CPU';
        let cpuScore = 0;
        
        if (userAgent.includes('Win')) {
          detectedCpu = 'Intel i5-14400F';
          cpuScore = cpuScores['i5-14400F'] || 80;
        } else if (userAgent.includes('Mac')) {
          detectedCpu = 'Apple M2';
          cpuScore = 85; // Approximate score
        } else {
          detectedCpu = 'Intel i5-12400F';
          cpuScore = cpuScores['i5-12400F'] || 75;
        }
        
        // Determine OS
        let operatingSystem = 'Unknown OS';
        if (userAgent.includes('Win')) {
          operatingSystem = userAgent.includes('Windows NT 10') ? 'Windows 10' : 
                            userAgent.includes('Windows NT 11') ? 'Windows 11' : 'Windows';
        } else if (userAgent.includes('Mac')) {
          operatingSystem = 'macOS';
        } else if (userAgent.includes('Linux')) {
          operatingSystem = 'Linux';
        }
        
        // Determine DirectX version based on OS (simulated)
        let directXVersion = 'Unknown';
        if (operatingSystem.includes('Windows 11')) {
          directXVersion = 'DirectX 12 Ultimate';
        } else if (operatingSystem.includes('Windows 10')) {
          directXVersion = 'DirectX 12';
        } else if (operatingSystem.includes('Windows')) {
          directXVersion = 'DirectX 11';
        }
        
        // Check if meets minimum requirements
        const meetsMinimumGpu = gpuScore >= gpuScores['RTX 4060'];
        const meetsMinimumCpu = cpuScore >= cpuScores['i5-14400F'];
        const meetsMinimumRam = memoryEstimate >= 16;
        
        // Create hardware detection results
        const results: SystemScanResults = {
          cpu: {
            name: 'CPU',
            details: detectedCpu,
            isDetected: true,
            meetsMinimum: meetsMinimumCpu,
            recommendedSpec: 'Intel i5-14400F or better',
            currentValue: detectedCpu
          },
          gpu: {
            name: 'GPU',
            details: detectedGpu,
            isDetected: true,
            meetsMinimum: meetsMinimumGpu,
            recommendedSpec: 'NVIDIA RTX 4060 or better',
            currentValue: detectedGpu
          },
          ram: {
            name: 'RAM',
            details: `${memoryEstimate} GB`,
            isDetected: true,
            meetsMinimum: meetsMinimumRam,
            recommendedSpec: '16 GB or higher',
            currentValue: `${memoryEstimate} GB`
          },
          storage: {
            name: 'Storage',
            details: 'SSD detected',
            isDetected: true,
            meetsMinimum: true,
            recommendedSpec: 'SSD with 50GB free space',
            currentValue: 'SSD (free space unknown)'
          },
          directX: {
            name: 'DirectX',
            details: directXVersion,
            isDetected: true,
            meetsMinimum: directXVersion.includes('12'),
            recommendedSpec: 'DirectX 12',
            currentValue: directXVersion
          },
          operatingSystem: {
            name: 'Operating System',
            details: operatingSystem,
            isDetected: true,
            meetsMinimum: operatingSystem.includes('Windows 10') || operatingSystem.includes('Windows 11'),
            recommendedSpec: 'Windows 10/11 64-bit',
            currentValue: operatingSystem
          }
        };
        
        resolve(results);
      } catch (error) {
        // Fallback to default values in case of errors
        console.error('Error during hardware detection:', error);
        toast.error('Hardware detection failed', {
          description: 'Using fallback system specifications'
        });
        
        resolve({
          cpu: {
            name: 'CPU',
            details: 'Detection failed',
            isDetected: false,
            meetsMinimum: false,
            recommendedSpec: 'Intel i5-14400F or better'
          },
          gpu: {
            name: 'GPU',
            details: 'Detection failed',
            isDetected: false,
            meetsMinimum: false,
            recommendedSpec: 'NVIDIA RTX 4060 or better'
          },
          ram: {
            name: 'RAM',
            details: 'Detection failed',
            isDetected: false,
            meetsMinimum: false,
            recommendedSpec: '16 GB or higher'
          },
          storage: {
            name: 'Storage',
            details: 'Detection failed',
            isDetected: false,
            meetsMinimum: false,
            recommendedSpec: 'SSD with 50GB free space'
          },
          directX: {
            name: 'DirectX',
            details: 'Detection failed',
            isDetected: false,
            meetsMinimum: false,
            recommendedSpec: 'DirectX 12'
          },
          operatingSystem: {
            name: 'Operating System',
            details: 'Detection failed',
            isDetected: false,
            meetsMinimum: false,
            recommendedSpec: 'Windows 10/11 64-bit'
          }
        });
      }
    }, 1500);
  });
};

// Function to analyze system compatibility and provide recommendations
export const analyzeSystemCompatibility = (results: SystemScanResults): {
  overallCompatible: boolean;
  criticalIssues: string[];
  recommendations: string[];
} => {
  const criticalIssues: string[] = [];
  const recommendations: string[] = [];
  
  // Check each component for compatibility issues
  if (!results.cpu.meetsMinimum) {
    criticalIssues.push(`CPU below minimum requirements: ${results.cpu.details}. Recommended: ${results.cpu.recommendedSpec}`);
  }
  
  if (!results.gpu.meetsMinimum) {
    criticalIssues.push(`GPU below minimum requirements: ${results.gpu.details}. Recommended: ${results.gpu.recommendedSpec}`);
  }
  
  if (!results.ram.meetsMinimum) {
    criticalIssues.push(`Insufficient RAM: ${results.ram.details}. Recommended: ${results.ram.recommendedSpec}`);
  }
  
  if (!results.directX.meetsMinimum) {
    criticalIssues.push(`DirectX version not supported: ${results.directX.details}. Recommended: ${results.directX.recommendedSpec}`);
  }
  
  if (!results.operatingSystem.meetsMinimum) {
    criticalIssues.push(`Operating system not supported: ${results.operatingSystem.details}. Recommended: ${results.operatingSystem.recommendedSpec}`);
  }
  
  // Generate recommendations
  if (results.cpu.isDetected && results.cpu.details.includes('i3') || 
      results.cpu.details.includes('Ryzen 3') || 
      results.cpu.details.includes('i5-10') || 
      results.cpu.details.includes('i5-11')) {
    recommendations.push('Consider upgrading your CPU for better emulation performance, especially for PS2 and GameCube titles.');
  }
  
  if (results.gpu.isDetected && !results.gpu.details.includes('RTX') && !results.gpu.details.includes('RX 6') && !results.gpu.details.includes('RX 7')) {
    recommendations.push('A more modern GPU would improve shader compilation times and enable enhanced graphics features.');
  }
  
  if (results.ram.isDetected && results.ram.details.includes('8 GB')) {
    recommendations.push('Upgrade to 16GB RAM or more for smoother multitasking while emulating.');
  }
  
  if (!results.storage.details.includes('SSD')) {
    recommendations.push('Using an SSD instead of HDD will significantly reduce game loading times.');
  }
  
  return {
    overallCompatible: criticalIssues.length === 0,
    criticalIssues,
    recommendations
  };
};

// Generate realistic requirements list for display purposes
export const generateSystemRequirements = () => {
  return [
    {
      component: 'CPU',
      minimum: 'Intel Core i5-14400F / AMD Ryzen 5 7600',
      recommended: 'Intel Core i7-14700K / AMD Ryzen 7 7800X3D'
    },
    {
      component: 'GPU',
      minimum: 'NVIDIA RTX 4060 8GB / AMD RX 7600 8GB',
      recommended: 'NVIDIA RTX 4070 12GB / AMD RX 7700 XT 12GB'
    },
    {
      component: 'RAM',
      minimum: '16GB DDR4-3200 / DDR5-5600',
      recommended: '32GB DDR5-6000'
    },
    {
      component: 'Storage',
      minimum: '50GB SSD',
      recommended: '100GB NVMe SSD'
    },
    {
      component: 'DirectX',
      minimum: 'DirectX 12',
      recommended: 'DirectX 12 Ultimate'
    },
    {
      component: 'OS',
      minimum: 'Windows 10 64-bit',
      recommended: 'Windows 11 22H2 or newer'
    },
    {
      component: 'Network',
      minimum: 'Broadband connection',
      recommended: 'High-speed fiber connection'
    }
  ];
};
