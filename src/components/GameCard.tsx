
import React from 'react';
import { Game, SYSTEM_NAMES, SYSTEM_ICONS } from '@/data/gameData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Download, Settings, Info } from 'lucide-react';
import { toast } from 'sonner';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  const handlePlay = () => {
    onPlay(game);
  };

  const handleInfo = () => {
    toast.info(`${game.title}`, {
      description: `${game.description}\nSystem: ${SYSTEM_NAMES[game.system]}\nRelease Year: ${game.releaseYear}\nFile Size: ${game.fileSize}`,
      duration: 5000,
    });
  };

  return (
    <Card className="w-full bg-emulator-card-bg border border-emulator-highlight overflow-hidden transition-all hover:border-emulator-accent hover:scale-[1.02] hover:z-10 relative group">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-50 group-hover:opacity-70 transition-opacity z-10"></div>
      
      <div className="relative h-48">
        <img 
          src={game.coverImage} 
          alt={game.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 z-20 flex gap-1">
          <span className="bg-black/70 text-xs px-2 py-1 rounded-sm text-emulator-text-secondary">
            {game.fileType.toUpperCase()}
          </span>
          <span className="bg-black/70 text-xs px-2 py-1 rounded-sm text-emulator-text-secondary">
            {SYSTEM_ICONS[game.system]}
          </span>
        </div>
      </div>
      
      <div className="p-4 relative z-20">
        <h3 className="font-bold text-lg mb-1 truncate">{game.title}</h3>
        <p className="text-xs text-emulator-text-secondary mb-3">
          {SYSTEM_NAMES[game.system]} • {game.releaseYear}
        </p>
        
        <div className="flex justify-between items-center">
          <Button 
            onClick={handlePlay} 
            size="sm" 
            className="bg-gradient-to-r from-emulator-accent to-emulator-accent-secondary text-black hover:from-emulator-accent-secondary hover:to-emulator-accent"
          >
            <Play size={16} className="mr-1" />
            Play
          </Button>
          
          <div className="flex gap-1">
            <Button 
              onClick={handleInfo} 
              size="sm" 
              variant="outline" 
              className="bg-emulator-button border-emulator-highlight p-1 h-8 w-8"
            >
              <Info size={16} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GameCard;
