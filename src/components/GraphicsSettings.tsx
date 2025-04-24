
import React, { useState } from 'react';
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
import { Save } from 'lucide-react';
import { toast } from 'sonner';

const GraphicsSettings: React.FC = () => {
  const [settings, setSettings] = useState<GraphicsSettingsType>(defaultGraphicsSettings);

  const handleChange = (key: keyof GraphicsSettingsType, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success('Graphics settings saved!', {
      description: 'Your preferences will be applied to all emulated games.'
    });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-emulator-text-secondary">Resolution</label>
            <Select
              value={settings.resolution}
              onValueChange={(value) => handleChange('resolution', value)}
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
              onValueChange={(value) => handleChange('aspectRatio', value)}
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
              onValueChange={(value) => handleChange('textureFiltering', value)}
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

          <div>
            <label className="block text-sm font-medium mb-2 text-emulator-text-secondary">Anti-aliasing</label>
            <Select
              value={settings.antiAliasing}
              onValueChange={(value) => handleChange('antiAliasing', value)}
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-emulator-text-secondary">Shader Effects</label>
            <Select
              value={settings.shaders}
              onValueChange={(value) => handleChange('shaders', value)}
            >
              <SelectTrigger className="bg-emulator-button border-emulator-highlight">
                <SelectValue placeholder="Select shader" />
              </SelectTrigger>
              <SelectContent className="bg-emulator-card-bg border-emulator-highlight">
                <SelectGroup>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="CRT">CRT (Classic TV)</SelectItem>
                  <SelectItem value="HQ2x">HQ2x (Smooth scaling)</SelectItem>
                  <SelectItem value="xBRZ">xBRZ (Improved scaling)</SelectItem>
                  <SelectItem value="Retro">Retro Pixel</SelectItem>
                  <SelectItem value="Scanlines">Scanlines</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-emulator-text-secondary">Frame Limiter</label>
            <div className="flex items-center space-x-2">
              <Slider 
                defaultValue={[settings.frameLimit]} 
                max={240} 
                step={10}
                className="bg-emulator-button"
                onValueChange={(value) => handleChange('frameLimit', value[0])} 
              />
              <span className="min-w-12 text-right text-emulator-text-secondary">{settings.frameLimit} FPS</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-emulator-text-secondary">V-Sync</label>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={settings.vsync} 
                onCheckedChange={(checked) => handleChange('vsync', checked)}
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
                onCheckedChange={(checked) => handleChange('crtEffect', checked)} 
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
                onCheckedChange={(checked) => handleChange('scanlines', checked)} 
                className="data-[state=checked]:bg-emulator-accent"
              />
              <span className="text-emulator-text-secondary">
                {settings.scanlines ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          className="bg-emulator-accent text-black hover:bg-emulator-accent/80"
        >
          <Save size={16} className="mr-2" />
          Save Graphics Settings
        </Button>
      </div>
    </div>
  );
};

export default GraphicsSettings;
