
import React from 'react';
import { Game, SYSTEM_NAMES } from '@/data/gameData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';

interface GameDetailsProps {
  game: Game | null;
  open: boolean;
  onClose: () => void;
  onPlay: (game: Game) => void;
}

const GameDetails: React.FC<GameDetailsProps> = ({ game, open, onClose, onPlay }) => {
  if (!game) return null;

  const handlePlay = () => {
    onPlay(game);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-emulator-card-bg border-emulator-highlight max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{game.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="w-full">
            <div className="aspect-[3/4] overflow-hidden rounded-lg border border-emulator-highlight">
              <img 
                src={game.coverImage} 
                alt={game.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <p className="text-sm text-emulator-text-secondary">
              {game.description}
            </p>
            
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <span className="text-emulator-text-secondary">System: </span>
                <span className="font-medium">{SYSTEM_NAMES[game.system]}</span>
              </div>
              
              <div>
                <span className="text-emulator-text-secondary">Release Year: </span>
                <span className="font-medium">{game.releaseYear}</span>
              </div>
              
              <div>
                <span className="text-emulator-text-secondary">File Type: </span>
                <span className="font-medium uppercase">{game.fileType}</span>
              </div>
              
              <div>
                <span className="text-emulator-text-secondary">File Size: </span>
                <span className="font-medium">{game.fileSize}</span>
              </div>
              
              <div className="col-span-2">
                <span className="text-emulator-text-secondary">Status: </span>
                <span className="font-medium text-emulator-accent">
                  {game.installed ? 'Installed' : 'Not Installed'}
                </span>
              </div>
            </div>

            <div className="border-t border-emulator-highlight pt-4 mt-4">
              <h4 className="text-sm font-medium mb-2">Emulator Configuration</h4>
              <p className="text-xs text-emulator-text-secondary">
                This game will run best with default settings. Customize settings from the Graphics page.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-emulator-button border-emulator-highlight"
          >
            <X size={16} className="mr-2" />
            Close
          </Button>
          
          <Button 
            onClick={handlePlay}
            className="bg-gradient-to-r from-emulator-accent to-emulator-accent-secondary text-black hover:from-emulator-accent-secondary hover:to-emulator-accent"
          >
            <Play size={16} className="mr-2" />
            Launch Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameDetails;
