
import React from 'react';
import { EmulatorSystem, SYSTEM_NAMES } from '@/data/gameData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface SystemFiltersProps {
  selectedSystem: EmulatorSystem | 'all';
  onSelectSystem: (system: EmulatorSystem | 'all') => void;
}

const SystemFilters: React.FC<SystemFiltersProps> = ({ 
  selectedSystem, 
  onSelectSystem 
}) => {
  const systems: (EmulatorSystem | 'all')[] = [
    'all',
    'nes',
    'snes',
    'genesis',
    'n64',
    'ps1',
    'gba',
    'psp',
    'dreamcast',
    'gamecube',
    'android',
    'windows',
  ];

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 p-2 pb-4">
        {systems.map((system) => (
          <Button
            key={system}
            onClick={() => onSelectSystem(system)}
            variant={selectedSystem === system ? "default" : "outline"}
            className={`
              whitespace-nowrap 
              ${selectedSystem === system ? 
                'bg-emulator-accent text-black border-emulator-accent animate-pulse-glow' : 
                'bg-emulator-button border-emulator-highlight'
              }
            `}
          >
            {system === 'all' ? 'All Systems' : SYSTEM_NAMES[system]}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SystemFilters;
