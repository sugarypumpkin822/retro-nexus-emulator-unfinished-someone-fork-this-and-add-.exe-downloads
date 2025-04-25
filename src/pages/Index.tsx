
import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import EmulatorHeader from '@/components/EmulatorHeader';
import GameCard from '@/components/GameCard';
import SystemFilters from '@/components/SystemFilters';
import FileUpload from '@/components/FileUpload';
import GameDetails from '@/components/GameDetails';
import EmulatorPlayScreen from '@/components/EmulatorPlayScreen';
import CustomizableBIOS from '@/components/CustomizableBIOS';
import EmulatorSetupWizard from '@/components/EmulatorSetupWizard';
import { EmulatorSystem, Game, preInstalledGames, systemRequirements, setupRequiredFiles } from '@/data/gameData';
import { Button } from '@/components/ui/button';
import { 
  GamepadIcon, 
  Upload, 
  HardDriveIcon, 
  InfoIcon, 
  Search 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Index = () => {
  const [selectedSystem, setSelectedSystem] = useState<EmulatorSystem | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGameDetails, setShowGameDetails] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [playingGame, setPlayingGame] = useState<Game | null>(null);
  const [showBIOS, setShowBIOS] = useState(true);
  const [setupWizardOpen, setSetupWizardOpen] = useState(false);
  
  const handlePlayGame = (game: Game) => {
    setPlayingGame(game);
    toast.info(`Launching ${game.title}`, {
      description: `Starting ${game.system} emulator...`
    });
  };
  
  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setShowGameDetails(true);
  };
  
  const handleCloseDetails = () => {
    setShowGameDetails(false);
  };
  
  const handleClosePlayScreen = () => {
    setPlayingGame(null);
  };
  
  const handleBIOSComplete = () => {
    setShowBIOS(false);
  };
  
  const handleOpenSetupWizard = () => {
    setSetupWizardOpen(true);
  };
  
  const filteredGames = preInstalledGames.filter(game => {
    const matchesSystem = selectedSystem === 'all' || game.system === selectedSystem;
    const matchesSearch = searchQuery === '' || 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSystem && matchesSearch;
  });
  
  return (
    <div className="min-h-screen bg-emulator-bg-dark text-emulator-text-primary flex flex-col">
      {/* Show BIOS during initialization */}
      {showBIOS && (
        <CustomizableBIOS onComplete={handleBIOSComplete} />
      )}
      
      <EmulatorHeader />
      
      <main className="flex-1 container mx-auto p-4 lg:p-6">
        <Tabs defaultValue="games" className="w-full">
          <div className="border-b border-emulator-highlight mb-6">
            <TabsList className="bg-transparent w-full justify-start border-b-0">
              <TabsTrigger 
                value="games"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emulator-accent data-[state=active]:text-emulator-accent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2"
              >
                <GamepadIcon size={18} className="mr-2" />
                Games
              </TabsTrigger>
              
              <TabsTrigger 
                value="upload"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emulator-accent data-[state=active]:text-emulator-accent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2"
              >
                <Upload size={18} className="mr-2" />
                Upload Files
              </TabsTrigger>
              
              <TabsTrigger 
                value="system"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emulator-accent data-[state=active]:text-emulator-accent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2"
              >
                <HardDriveIcon size={18} className="mr-2" />
                System
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="games" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emulator-text-secondary" size={18} />
                <Input
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-emulator-button border-emulator-highlight"
                />
              </div>
              
              <Button 
                className="bg-emulator-button border border-emulator-highlight hover:bg-emulator-highlight"
                onClick={handleOpenSetupWizard}
              >
                <InfoIcon size={18} className="mr-2" />
                Setup Wizard
              </Button>
            </div>
            
            <SystemFilters 
              selectedSystem={selectedSystem}
              onSelectSystem={setSelectedSystem}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredGames.length > 0 ? (
                filteredGames.map(game => (
                  <GameCard 
                    key={game.id} 
                    game={game}
                    onPlay={handlePlayGame}
                    onClick={() => handleGameClick(game)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-emulator-text-secondary">No games match your current filters.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upload">
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Upload Game Files</h2>
                <p className="text-emulator-text-secondary">
                  Add your own ROM, ISO, APK or EXE files to play on RetroNexus Emulator. 
                  Supported systems include NES, SNES, Genesis, N64, PS1, GBA, PSP, Dreamcast, GameCube, Android and Windows.
                </p>
              </div>
              
              <FileUpload />
              
              <div className="mt-8 p-4 bg-emulator-highlight/20 border border-emulator-highlight rounded-lg">
                <h3 className="font-bold mb-2 flex items-center">
                  <InfoIcon size={16} className="mr-2 text-emulator-accent" />
                  Supported File Types
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div className="bg-emulator-card-bg p-2 rounded">
                    <span className="font-medium block">ROM Files</span>
                    <span className="text-xs text-emulator-text-secondary">NES, SNES, Genesis, GBA</span>
                  </div>
                  <div className="bg-emulator-card-bg p-2 rounded">
                    <span className="font-medium block">ISO Files</span>
                    <span className="text-xs text-emulator-text-secondary">PS1, GameCube, Dreamcast</span>
                  </div>
                  <div className="bg-emulator-card-bg p-2 rounded">
                    <span className="font-medium block">APK Files</span>
                    <span className="text-xs text-emulator-text-secondary">Android Applications</span>
                  </div>
                  <div className="bg-emulator-card-bg p-2 rounded">
                    <span className="font-medium block">EXE Files</span>
                    <span className="text-xs text-emulator-text-secondary">Windows Applications</span>
                  </div>
                  <div className="bg-emulator-card-bg p-2 rounded">
                    <span className="font-medium block">Archive Files</span>
                    <span className="text-xs text-emulator-text-secondary">ZIP, RAR, 7Z</span>
                  </div>
                  <div className="bg-emulator-card-bg p-2 rounded">
                    <span className="font-medium block">Other</span>
                    <span className="text-xs text-emulator-text-secondary">BIN, CUE, CSO, CHD</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="system">
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">System Information</h2>
                <p className="text-emulator-text-secondary">
                  Information about system requirements and configuration for the RetroNexus Emulator.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emulator-card-bg border border-emulator-highlight rounded-lg overflow-hidden">
                  <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight flex justify-between items-center">
                    <h3 className="font-bold">System Requirements</h3>
                    <HardDriveIcon size={18} className="text-emulator-text-secondary" />
                  </div>
                  
                  <div className="p-4">
                    <table className="min-w-full">
                      <thead>
                        <tr className="text-xs border-b border-emulator-highlight">
                          <th className="text-left pb-2">Component</th>
                          <th className="text-left pb-2">Minimum</th>
                          <th className="text-left pb-2">Recommended</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emulator-highlight/30">
                        {systemRequirements.map((req, index) => (
                          <tr key={index} className="text-sm">
                            <td className="py-2 font-medium">{req.component}</td>
                            <td className="py-2 text-emulator-text-secondary">{req.minimum}</td>
                            <td className="py-2 text-emulator-success">{req.recommended}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-emulator-card-bg border border-emulator-highlight rounded-lg overflow-hidden">
                    <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight flex justify-between items-center">
                      <h3 className="font-bold">Required Files</h3>
                      <HardDriveIcon size={18} className="text-emulator-text-secondary" />
                    </div>
                    
                    <ul className="p-4 space-y-2 text-sm">
                      {setupRequiredFiles.map((file, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-emulator-accent mr-2"></div>
                          <span>{file}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-emulator-card-bg border border-emulator-highlight rounded-lg overflow-hidden">
                    <div className="bg-emulator-highlight/20 p-3 border-b border-emulator-highlight">
                      <h3 className="font-bold">Setup Configuration</h3>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-emulator-text-secondary mb-4">
                        If you need to reconfigure your emulator or check for missing files, you can run the setup wizard again.
                      </p>
                      
                      <Button 
                        className="w-full bg-emulator-button border border-emulator-highlight hover:bg-emulator-highlight"
                        onClick={handleOpenSetupWizard}
                      >
                        <InfoIcon size={18} className="mr-2" />
                        Run Setup Wizard
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t border-emulator-highlight py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-xs text-emulator-text-secondary">
            RetroNexus Emulator v1.0 — Windows 11 Compatible
          </p>
          <p className="text-xs text-emulator-text-secondary">
            Game files are saved to C:\RetroNexus\Games by default
          </p>
        </div>
      </footer>
      
      <GameDetails
        game={selectedGame}
        open={showGameDetails}
        onClose={handleCloseDetails}
        onPlay={handlePlayGame}
      />
      
      <EmulatorPlayScreen
        game={playingGame}
        open={!!playingGame}
        onClose={handleClosePlayScreen}
      />

      <EmulatorSetupWizard
        open={setupWizardOpen}
        onOpenChange={setSetupWizardOpen}
      />
    </div>
  );
};

export default Index;
