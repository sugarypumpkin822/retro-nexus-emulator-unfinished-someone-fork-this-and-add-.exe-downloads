
import React, { useState, useEffect } from 'react';
import { defaultGraphicsSettings, GraphicsSettings as GraphicsSettingsType } from '@/data/gameData';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface CustomizableBIOSProps {
  onComplete: () => void;
}

const CustomizableBIOS: React.FC<CustomizableBIOSProps> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<'system' | 'graphics' | 'boot'>('system');
  const [progress, setProgress] = useState(0);
  const [settings, setSettings] = useState<GraphicsSettingsType>(defaultGraphicsSettings);
  const [bootProgress, setBootProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(false);
  const [biosFadeOut, setBiosFadeOut] = useState(false);
  const [autoExit, setAutoExit] = useState(true);
  const [accessKey, setAccessKey] = useState<'del' | 'f2' | 'f12' | 'all'>('all');
  const [bootDelay, setBootDelay] = useState(5);
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  
  // Auto-exit BIOS after boot delay if enabled
  useEffect(() => {
    if (autoExit) {
      const timer = setTimeout(() => {
        handleBoot();
      }, bootDelay * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [autoExit, bootDelay]);
  
  // Initial progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    
    return () => clearInterval(interval);
  }, []);
  
  // Listen for keyboard events to capture BIOS access keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the key pressed matches the configured BIOS access key
      if (
        (accessKey === 'del' && e.key === 'Delete') ||
        (accessKey === 'f2' && e.key === 'F2') ||
        (accessKey === 'f12' && e.key === 'F12') ||
        (accessKey === 'all' && (e.key === 'Delete' || e.key === 'F2' || e.key === 'F12'))
      ) {
        // Add to pressed keys (for visual feedback)
        setPressedKeys(prev => [...prev, e.key]);
        
        // Stop auto-boot if configured
        setAutoExit(false);
        
        // Show a toast to indicate key was pressed
        toast.info('BIOS access key detected', {
          description: `${e.key} key pressed. BIOS auto-boot stopped.`
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [accessKey]);
  
  const handleTabChange = (tab: 'system' | 'graphics' | 'boot') => {
    setActiveTab(tab);
  };
  
  const handleGraphicsChange = (key: keyof GraphicsSettingsType, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSaveSettings = () => {
    toast.success('BIOS settings saved!', {
      description: 'Your preferences will be applied when the emulator loads.'
    });
  };
  
  const handleBoot = () => {
    setIsBooting(true);
    setBootProgress(0);
    
    const interval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBiosFadeOut(true);
          
          // Complete fade-out animation before calling onComplete
          setTimeout(() => {
            onComplete();
          }, 1000);
          
          return 100;
        }
        return prev + 2;
      });
    }, 40);
  };
  
  const renderSystemTab = () => (
    <div className="space-y-4">
      <div className="bg-black/30 p-4 rounded-lg border border-emulator-highlight">
        <h3 className="text-lg font-bold mb-3 text-emulator-accent">System Information</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-emulator-text-secondary">BIOS Version:</span>
            <span className="font-mono">v1.2.5 (Build 2025.04.25)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emulator-text-secondary">CPU:</span>
            <span className="font-mono">Intel Core i7-13700K</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emulator-text-secondary">Memory:</span>
            <span className="font-mono">32GB DDR5-6000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emulator-text-secondary">Graphics:</span>
            <span className="font-mono">RTX 4080 16GB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emulator-text-secondary">DirectX:</span>
            <span className="font-mono">DirectX 12 Ultimate</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emulator-text-secondary">OpenGL:</span>
            <span className="font-mono">4.6.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emulator-text-secondary">Vulkan:</span>
            <span className="font-mono">1.3.261</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emulator-text-secondary">Game Directory:</span>
            <span className="font-mono">C:\RetroNexus\Games</span>
          </div>
        </div>
      </div>
      
      <div className="bg-black/30 p-4 rounded-lg border border-emulator-highlight">
        <h3 className="text-lg font-bold mb-3 text-emulator-accent">BIOS Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Boot Delay</label>
            <div className="flex items-center space-x-2">
              <Slider 
                value={[bootDelay]} 
                max={10}
                min={0} 
                step={1}
                className="bg-emulator-button"
                onValueChange={(value) => setBootDelay(value[0])} 
              />
              <span className="min-w-12 text-right">{bootDelay} sec</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Auto Boot</label>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={autoExit} 
                onCheckedChange={(checked) => setAutoExit(checked)}
                className="data-[state=checked]:bg-emulator-accent"
              />
              <span>{autoExit ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">BIOS Access Key</label>
            <Select 
              value={accessKey}
              onValueChange={(value: 'del' | 'f2' | 'f12' | 'all') => setAccessKey(value)}
            >
              <SelectTrigger className="bg-emulator-button border-emulator-highlight">
                <SelectValue placeholder="Select BIOS access key" />
              </SelectTrigger>
              <SelectContent className="bg-emulator-card-bg border-emulator-highlight">
                <SelectGroup>
                  <SelectItem value="del">DEL key</SelectItem>
                  <SelectItem value="f2">F2 key</SelectItem>
                  <SelectItem value="f12">F12 key</SelectItem>
                  <SelectItem value="all">All keys (DEL, F2, F12)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-xs text-emulator-text-secondary mt-1">
              Key(s) to press during boot to access BIOS setup
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Boot Logo</label>
            <Select defaultValue="retro">
              <SelectTrigger className="bg-emulator-button border-emulator-highlight">
                <SelectValue placeholder="Select boot logo" />
              </SelectTrigger>
              <SelectContent className="bg-emulator-card-bg border-emulator-highlight">
                <SelectGroup>
                  <SelectItem value="retro">Retro Logo</SelectItem>
                  <SelectItem value="modern">Modern Logo</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="classic">Classic BIOS</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">BIOS Theme</label>
            <Select defaultValue="blue">
              <SelectTrigger className="bg-emulator-button border-emulator-highlight">
                <SelectValue placeholder="Select BIOS theme" />
              </SelectTrigger>
              <SelectContent className="bg-emulator-card-bg border-emulator-highlight">
                <SelectGroup>
                  <SelectItem value="blue">Classic Blue</SelectItem>
                  <SelectItem value="green">Terminal Green</SelectItem>
                  <SelectItem value="red">System Red</SelectItem>
                  <SelectItem value="purple">Retro Purple</SelectItem>
                  <SelectItem value="amber">Amber Monochrome</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderGraphicsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-emulator-text-secondary">Resolution</label>
            <Select
              value={settings.resolution}
              onValueChange={(value) => handleGraphicsChange('resolution', value)}
            >
              <SelectTrigger className="bg-emulator-button border-emulator-highlight">
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent className="bg-emulator-card-bg border-emulator-highlight">
                <SelectGroup>
                  <SelectItem value="640x480">640x480</SelectItem>
                  <SelectItem value="800x600">800x600</SelectItem>
                  <SelectItem value="1024x768">1024x768</SelectItem>
                  <SelectItem value="1280x720">1280x720 (720p)</SelectItem>
                  <SelectItem value="1920x1080">1920x1080 (1080p)</SelectItem>
                  <SelectItem value="2560x1440">2560x1440 (1440p)</SelectItem>
                  <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-emulator-text-secondary">Aspect Ratio</label>
            <Select
              value={settings.aspectRatio}
              onValueChange={(value) => handleGraphicsChange('aspectRatio', value)}
            >
              <SelectTrigger className="bg-emulator-button border-emulator-highlight">
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent className="bg-emulator-card-bg border-emulator-highlight">
                <SelectGroup>
                  <SelectItem value="4:3">4:3 (Classic)</SelectItem>
                  <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                  <SelectItem value="16:10">16:10</SelectItem>
                  <SelectItem value="21:9">21:9 (Ultrawide)</SelectItem>
                  <SelectItem value="auto">Auto (Original)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-emulator-text-secondary">Texture Filtering</label>
            <Select
              value={settings.textureFiltering}
              onValueChange={(value) => handleGraphicsChange('textureFiltering', value)}
            >
              <SelectTrigger className="bg-emulator-button border-emulator-highlight">
                <SelectValue placeholder="Select texture filtering" />
              </SelectTrigger>
              <SelectContent className="bg-emulator-card-bg border-emulator-highlight">
                <SelectGroup>
                  <SelectItem value="Nearest">Nearest (Pixelated)</SelectItem>
                  <SelectItem value="Bilinear">Bilinear (Smooth)</SelectItem>
                  <SelectItem value="Trilinear">Trilinear</SelectItem>
                  <SelectItem value="Anisotropic">Anisotropic</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-emulator-text-secondary">Frame Limiter</label>
            <div className="flex items-center space-x-2">
              <Slider 
                defaultValue={[settings.frameLimit]} 
                max={240} 
                step={10}
                className="bg-emulator-button"
                onValueChange={(value) => handleGraphicsChange('frameLimit', value[0])} 
              />
              <span className="min-w-12 text-right text-emulator-text-secondary">{settings.frameLimit} FPS</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-emulator-text-secondary">V-Sync</label>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={settings.vsync} 
                onCheckedChange={(checked) => handleGraphicsChange('vsync', checked)}
                className="data-[state=checked]:bg-emulator-accent"
              />
              <span className="text-emulator-text-secondary">
                {settings.vsync ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-emulator-text-secondary">CRT Effect</label>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={settings.crtEffect} 
                onCheckedChange={(checked) => handleGraphicsChange('crtEffect', checked)} 
                className="data-[state=checked]:bg-emulator-accent"
              />
              <span className="text-emulator-text-secondary">
                {settings.crtEffect ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-emulator-text-secondary">Scanlines</label>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={settings.scanlines} 
                onCheckedChange={(checked) => handleGraphicsChange('scanlines', checked)} 
                className="data-[state=checked]:bg-emulator-accent"
              />
              <span className="text-emulator-text-secondary">
                {settings.scanlines ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-emulator-text-secondary">Anti-aliasing</label>
            <Select
              value={settings.antiAliasing}
              onValueChange={(value) => handleGraphicsChange('antiAliasing', value)}
            >
              <SelectTrigger className="bg-emulator-button border-emulator-highlight">
                <SelectValue placeholder="Select anti-aliasing" />
              </SelectTrigger>
              <SelectContent className="bg-emulator-card-bg border-emulator-highlight">
                <SelectGroup>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="FXAA">FXAA</SelectItem>
                  <SelectItem value="SMAA">SMAA</SelectItem>
                  <SelectItem value="MSAA 2x">MSAA 2x</SelectItem>
                  <SelectItem value="MSAA 4x">MSAA 4x</SelectItem>
                  <SelectItem value="MSAA 8x">MSAA 8x</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings} 
          className="bg-emulator-accent text-black hover:bg-emulator-accent/80"
        >
          <Save size={16} className="mr-2" />
          Save Graphics Settings
        </Button>
      </div>
    </div>
  );
  
  const renderBootTab = () => (
    <div className="space-y-6">
      <div className="bg-black/30 p-4 rounded-lg border border-emulator-highlight">
        <h3 className="text-lg font-bold mb-3 text-emulator-accent">System Check</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>CPU Check</span>
            <span className="text-emulator-success">✓ PASSED</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Memory Check</span>
            <span className="text-emulator-success">✓ PASSED</span>
          </div>
          <div className="flex justify-between items-center">
            <span>GPU Check</span>
            <span className="text-emulator-success">✓ PASSED</span>
          </div>
          <div className="flex justify-between items-center">
            <span>BIOS Files Check</span>
            <span className="text-emulator-success">✓ PASSED</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Directory Structure</span>
            <span className="text-emulator-success">✓ PASSED</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Core Files Check</span>
            <span className="text-emulator-success">✓ PASSED</span>
          </div>
        </div>
      </div>
      
      <div className="text-center p-6">
        <Button 
          onClick={handleBoot}
          disabled={isBooting}
          size="lg"
          className="bg-emulator-accent text-black hover:bg-emulator-accent/80 px-8 py-6 text-lg"
        >
          Boot RetroNexus Emulator
        </Button>
        
        {isBooting && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Booting emulator...</span>
              <span>{bootProgress}%</span>
            </div>
            <Progress value={bootProgress} className="h-2" />
          </div>
        )}
      </div>
    </div>
  );
  
  return (
    <div className={`fixed inset-0 bg-black z-50 ${biosFadeOut ? 'animate-fade-out pointer-events-none' : ''}`}>
      <div className="scanline"></div>
      
      <div className="h-screen flex flex-col p-8 text-emulator-accent font-mono">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 animate-pulse-glow">RetroNexus BIOS v1.2.5</h1>
          <div className="flex justify-between items-center">
            <p>System initialization completed</p>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-emulator-success animate-pulse mr-2"></div>
              <span className="text-sm">SYSTEM READY</span>
            </div>
          </div>
          {autoExit && (
            <div className="mt-2 text-sm">
              <span className="animate-pulse">
                Press <kbd className="bg-emulator-highlight/50 px-1.5 py-0.5 rounded font-bold">DEL</kbd>, 
                <kbd className="bg-emulator-highlight/50 px-1.5 py-0.5 rounded font-bold mx-1">F2</kbd>, or 
                <kbd className="bg-emulator-highlight/50 px-1.5 py-0.5 rounded font-bold ml-1">F12</kbd> to enter setup
              </span>
              <span className="ml-4">Boot in {bootDelay}s</span>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              onClick={() => handleTabChange('system')}
              className={`${activeTab === 'system' ? 'bg-emulator-highlight/50 border-emulator-accent' : 'bg-black/30 border-emulator-highlight'}`}
            >
              System
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleTabChange('graphics')}
              className={`${activeTab === 'graphics' ? 'bg-emulator-highlight/50 border-emulator-accent' : 'bg-black/30 border-emulator-highlight'}`}
            >
              Graphics Settings
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleTabChange('boot')}
              className={`${activeTab === 'boot' ? 'bg-emulator-highlight/50 border-emulator-accent' : 'bg-black/30 border-emulator-highlight'}`}
            >
              Boot
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-6 border border-emulator-highlight bg-black/40 p-4 rounded-lg">
          {activeTab === 'system' && renderSystemTab()}
          {activeTab === 'graphics' && renderGraphicsTab()}
          {activeTab === 'boot' && renderBootTab()}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span>System Check:</span>
            <Progress value={progress} className="w-40 h-2" />
            <span>{progress}%</span>
          </div>
          
          <div className="flex space-x-2">
            {activeTab !== 'system' && (
              <Button 
                onClick={() => handleTabChange(activeTab === 'graphics' ? 'system' : 'graphics')}
                className="bg-emulator-button border border-emulator-highlight hover:bg-emulator-highlight px-4"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
            )}
            
            {activeTab !== 'boot' && (
              <Button 
                onClick={() => handleTabChange(activeTab === 'system' ? 'graphics' : 'boot')}
                className="bg-emulator-button border border-emulator-highlight hover:bg-emulator-highlight px-4"
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            )}
            
            {activeTab === 'boot' && !isBooting && (
              <Button 
                onClick={handleBoot}
                className="bg-emulator-accent text-black hover:bg-emulator-accent/80"
              >
                Boot Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizableBIOS;
