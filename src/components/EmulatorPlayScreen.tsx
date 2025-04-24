
import React, { useState, useEffect } from 'react';
import { Game, SYSTEM_NAMES } from '@/data/gameData';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { X, PauseIcon, Maximize2, Volume2, VolumeX } from 'lucide-react';

interface EmulatorPlayScreenProps {
  game: Game | null;
  open: boolean;
  onClose: () => void;
}

const EmulatorPlayScreen: React.FC<EmulatorPlayScreenProps> = ({ game, open, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (open) {
      // Simulate loading
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    } else {
      setLoading(true);
    }
  }, [open]);

  if (!game) return null;

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`bg-black border-emulator-highlight p-0 max-w-[95vw] ${isFullscreen ? 'h-[95vh]' : 'h-[80vh]'}`}>
        <div className="relative w-full h-full flex flex-col">
          {/* Header controls */}
          <div className="absolute top-0 left-0 right-0 z-10 flex justify-between bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="text-white">
              <h3 className="font-bold">{game.title}</h3>
              <p className="text-xs text-gray-300">{SYSTEM_NAMES[game.system]}</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleMute}
                className="text-white hover:bg-white/20"
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize2 size={18} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X size={18} />
              </Button>
            </div>
          </div>
          
          {/* Game area */}
          <div className="flex-1 w-full h-full flex items-center justify-center retro-container">
            {loading ? (
              <div className="text-center">
                <div className="inline-block p-4 mb-4 rounded-full bg-emulator-accent/20 text-emulator-accent animate-pulse-glow">
                  <div className="w-12 h-12 border-4 border-t-transparent border-emulator-accent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-retro glow-text mb-2">LOADING...</h3>
                <p className="text-emulator-text-secondary">
                  Initializing {SYSTEM_NAMES[game.system]} emulator...
                </p>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img 
                  src={game.coverImage} 
                  alt={game.title} 
                  className="absolute inset-0 w-full h-full object-cover blur-md opacity-30" 
                />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 p-8 rounded-lg text-center max-w-md">
                    <div className="inline-block p-4 mb-4 rounded-full bg-emulator-accent/20 text-emulator-accent">
                      <PauseIcon size={32} />
                    </div>
                    <h3 className="text-xl font-retro glow-text mb-2">GAME PAUSED</h3>
                    <p className="text-emulator-text-secondary mb-4">
                      This is a simulated interface. In a real emulator, the actual game would be running here.
                    </p>
                    <div className="text-xs text-emulator-text-secondary mb-6">
                      Game: {game.title} ({game.releaseYear})<br />
                      System: {SYSTEM_NAMES[game.system]}<br />
                      File Type: {game.fileType.toUpperCase()}<br />
                    </div>
                    <Button 
                      onClick={onClose}
                      className="bg-emulator-accent text-black hover:bg-emulator-accent/80"
                    >
                      Exit Game
                    </Button>
                  </div>
                </div>
                
                <div className="scanline"></div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmulatorPlayScreen;
