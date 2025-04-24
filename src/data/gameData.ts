
export interface Game {
  id: string;
  title: string;
  system: EmulatorSystem;
  coverImage: string;
  description: string;
  releaseYear: number;
  fileSize: string;
  fileType: 'rom' | 'iso' | 'apk' | 'exe';
  installed: boolean;
}

export type EmulatorSystem = 
  | 'nes' 
  | 'snes' 
  | 'genesis' 
  | 'n64' 
  | 'ps1' 
  | 'gba' 
  | 'psp' 
  | 'dreamcast'
  | 'gamecube'
  | 'android'
  | 'windows';

export const SYSTEM_NAMES: Record<EmulatorSystem, string> = {
  nes: 'Nintendo Entertainment System',
  snes: 'Super Nintendo',
  genesis: 'Sega Genesis',
  n64: 'Nintendo 64',
  ps1: 'PlayStation',
  gba: 'Game Boy Advance',
  psp: 'PlayStation Portable',
  dreamcast: 'Sega Dreamcast',
  gamecube: 'Nintendo GameCube',
  android: 'Android',
  windows: 'Windows'
};

export const SYSTEM_ICONS: Record<EmulatorSystem, string> = {
  nes: '🎮',
  snes: '🎮',
  genesis: '🎮',
  n64: '🎮',
  ps1: '🎮',
  gba: '📱',
  psp: '📱',
  dreamcast: '🎮',
  gamecube: '🎮',
  android: '📱',
  windows: '💻'
};

export const preInstalledGames: Game[] = [
  {
    id: '1',
    title: 'Super Mario Bros.',
    system: 'nes',
    coverImage: 'https://images.unsplash.com/photo-1635514569146-9a5b748c13c6?q=80&w=200&auto=format&fit=crop',
    description: 'The classic platformer that defined a generation.',
    releaseYear: 1985,
    fileSize: '31.5 KB',
    fileType: 'rom',
    installed: true
  },
  {
    id: '2',
    title: 'The Legend of Zelda: A Link to the Past',
    system: 'snes',
    coverImage: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=200&auto=format&fit=crop',
    description: 'Explore the magical world of Hyrule in this action-adventure epic.',
    releaseYear: 1991,
    fileSize: '1.2 MB',
    fileType: 'rom',
    installed: true
  },
  {
    id: '3',
    title: 'Sonic the Hedgehog 2',
    system: 'genesis',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop',
    description: 'Speed through levels as the fastest hedgehog alive.',
    releaseYear: 1992,
    fileSize: '756 KB',
    fileType: 'rom',
    installed: true
  },
  {
    id: '4',
    title: 'Super Mario 64',
    system: 'n64',
    coverImage: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=200&auto=format&fit=crop',
    description: "Mario's first 3D adventure through Princess Peach's castle.",
    releaseYear: 1996,
    fileSize: '8.2 MB',
    fileType: 'rom',
    installed: true
  },
  {
    id: '5',
    title: 'Final Fantasy VII',
    system: 'ps1',
    coverImage: 'https://images.unsplash.com/photo-1559333086-b0a56225a93c?q=80&w=200&auto=format&fit=crop',
    description: 'Cloud and his allies battle against the evil Shinra Corporation.',
    releaseYear: 1997,
    fileSize: '1.2 GB',
    fileType: 'iso',
    installed: true
  },
  {
    id: '6',
    title: 'Pokémon Emerald',
    system: 'gba',
    coverImage: 'https://images.unsplash.com/photo-1542779283-429940ce8336?q=80&w=200&auto=format&fit=crop',
    description: 'Catch and train Pokémon in the Hoenn region.',
    releaseYear: 2004,
    fileSize: '16 MB',
    fileType: 'rom',
    installed: true
  },
  {
    id: '7',
    title: 'God of War: Chains of Olympus',
    system: 'psp',
    coverImage: 'https://images.unsplash.com/photo-1580327344181-c1163234e5a0?q=80&w=200&auto=format&fit=crop',
    description: 'Kratos battles mythological beasts and gods.',
    releaseYear: 2008,
    fileSize: '1.4 GB',
    fileType: 'iso',
    installed: true
  },
  {
    id: '8',
    title: 'Crazy Taxi',
    system: 'dreamcast',
    coverImage: 'https://images.unsplash.com/photo-1564694202883-46e7448c1b26?q=80&w=200&auto=format&fit=crop',
    description: 'Drive passengers to their destinations as quickly as possible.',
    releaseYear: 1999,
    fileSize: '700 MB',
    fileType: 'iso',
    installed: true
  },
  {
    id: '9',
    title: 'Animal Crossing',
    system: 'gamecube',
    coverImage: 'https://images.unsplash.com/photo-1560253023-3ec5085cfb80?q=80&w=200&auto=format&fit=crop',
    description: 'Live life in a village of anthropomorphic animals.',
    releaseYear: 2001,
    fileSize: '1.5 GB',
    fileType: 'iso',
    installed: true
  },
  {
    id: '10',
    title: 'Minecraft PE',
    system: 'android',
    coverImage: 'https://images.unsplash.com/photo-1587573089317-0342a6d6e2a0?q=80&w=200&auto=format&fit=crop',
    description: 'Build anything you can imagine in this mobile sandbox game.',
    releaseYear: 2011,
    fileSize: '150 MB',
    fileType: 'apk',
    installed: true
  },
  {
    id: '11',
    title: 'Counter-Strike 1.6',
    system: 'windows',
    coverImage: 'https://images.unsplash.com/photo-1551430872-633a02c4368c?q=80&w=200&auto=format&fit=crop',
    description: 'Classic team-based first-person shooter.',
    releaseYear: 2000,
    fileSize: '258 MB',
    fileType: 'exe',
    installed: true
  },
  {
    id: '12',
    title: 'Chrono Trigger',
    system: 'snes',
    coverImage: 'https://images.unsplash.com/photo-1554048424-76c36dbd0652?q=80&w=200&auto=format&fit=crop',
    description: 'A time-traveling RPG adventure with multiple endings.',
    releaseYear: 1995,
    fileSize: '4.3 MB',
    fileType: 'rom',
    installed: true
  },
  {
    id: '13',
    title: 'Metal Gear Solid',
    system: 'ps1',
    coverImage: 'https://images.unsplash.com/photo-1516900448138-f5491c84e159?q=80&w=200&auto=format&fit=crop',
    description: 'Stealth action with Solid Snake infiltrating a nuclear facility.',
    releaseYear: 1998,
    fileSize: '665 MB',
    fileType: 'iso',
    installed: true
  },
  {
    id: '14',
    title: 'The Elder Scrolls III: Morrowind',
    system: 'windows',
    coverImage: 'https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?q=80&w=200&auto=format&fit=crop',
    description: 'Open-world RPG set in the fantasy province of Morrowind.',
    releaseYear: 2002,
    fileSize: '1.2 GB',
    fileType: 'exe',
    installed: true
  },
  {
    id: '15',
    title: 'Castlevania: Symphony of the Night',
    system: 'ps1',
    coverImage: 'https://images.unsplash.com/photo-1605899435973-ca2d1a8861cf?q=80&w=200&auto=format&fit=crop',
    description: 'Play as Alucard exploring Dracula\'s castle.',
    releaseYear: 1997,
    fileSize: '350 MB',
    fileType: 'iso',
    installed: true
  },
  {
    id: '16',
    title: 'Grand Theft Auto: San Andreas',
    system: 'windows',
    coverImage: 'https://images.unsplash.com/photo-1588420343618-6141b3784bce?q=80&w=200&auto=format&fit=crop',
    description: 'Open-world crime action game set in the fictional state of San Andreas.',
    releaseYear: 2004,
    fileSize: '3.5 GB',
    fileType: 'exe',
    installed: true
  },
  {
    id: '17',
    title: 'Dota 2',
    system: 'windows',
    coverImage: 'https://images.unsplash.com/photo-1580327344181-c1163234e5a0?q=80&w=200&auto=format&fit=crop',
    description: 'Popular MOBA with complex team-based gameplay.',
    releaseYear: 2013,
    fileSize: '15 GB',
    fileType: 'exe',
    installed: true
  },
  {
    id: '18',
    title: 'Resident Evil 2',
    system: 'ps1',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=200&auto=format&fit=crop',
    description: 'Survive the zombie outbreak in Raccoon City.',
    releaseYear: 1998,
    fileSize: '700 MB',
    fileType: 'iso',
    installed: true
  },
  {
    id: '19',
    title: 'Metroid Prime',
    system: 'gamecube',
    coverImage: 'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?q=80&w=200&auto=format&fit=crop',
    description: 'Samus Aran explores the mysteries of planet Tallon IV.',
    releaseYear: 2002,
    fileSize: '1.5 GB',
    fileType: 'iso',
    installed: true
  },
  {
    id: '20',
    title: 'Tetris',
    system: 'nes',
    coverImage: 'https://images.unsplash.com/photo-1607727337209-d35392be232c?q=80&w=200&auto=format&fit=crop',
    description: 'The iconic puzzle game where blocks fall from the top of the screen.',
    releaseYear: 1989,
    fileSize: '20 KB',
    fileType: 'rom',
    installed: true
  },
  {
    id: '21',
    title: 'Donkey Kong Country',
    system: 'snes',
    coverImage: 'https://images.unsplash.com/photo-1597933534024-debb6104af15?q=80&w=200&auto=format&fit=crop',
    description: 'Donkey Kong and Diddy Kong journey to recover their banana hoard.',
    releaseYear: 1994,
    fileSize: '3.5 MB',
    fileType: 'rom',
    installed: true
  },
  {
    id: '22',
    title: 'Streets of Rage 2',
    system: 'genesis',
    coverImage: 'https://images.unsplash.com/photo-1506057527569-6a0285b2fcc1?q=80&w=200&auto=format&fit=crop',
    description: 'Beat \'em up classic where you fight against the syndicate.',
    releaseYear: 1992,
    fileSize: '1.1 MB',
    fileType: 'rom',
    installed: true
  },
  {
    id: '23',
    title: 'The Legend of Zelda: Ocarina of Time',
    system: 'n64',
    coverImage: 'https://images.unsplash.com/photo-1469284390178-171ff752a6a0?q=80&w=200&auto=format&fit=crop',
    description: 'Link\'s first 3D adventure across the land of Hyrule.',
    releaseYear: 1998,
    fileSize: '32 MB',
    fileType: 'rom',
    installed: true
  },
  {
    id: '24',
    title: 'Final Fantasy Tactics',
    system: 'ps1',
    coverImage: 'https://images.unsplash.com/photo-1547638375-ebf04735d730?q=80&w=200&auto=format&fit=crop',
    description: 'Tactical RPG set in the world of Ivalice.',
    releaseYear: 1997,
    fileSize: '450 MB',
    fileType: 'iso',
    installed: true
  },
  {
    id: '25',
    title: 'Pokemon FireRed',
    system: 'gba',
    coverImage: 'https://images.unsplash.com/photo-1613771404721-1f92d799e49f?q=80&w=200&auto=format&fit=crop',
    description: 'Remake of the original Pokemon Red with updated graphics and features.',
    releaseYear: 2004,
    fileSize: '16 MB',
    fileType: 'rom',
    installed: true
  },
  {
    id: '26',
    title: 'Grand Theft Auto: Vice City Stories',
    system: 'psp',
    coverImage: 'https://images.unsplash.com/photo-1560253023-3ec5085cfb80?q=80&w=200&auto=format&fit=crop',
    description: 'Open-world action game set in the fictional Vice City.',
    releaseYear: 2006,
    fileSize: '950 MB',
    fileType: 'iso',
    installed: true
  },
  {
    id: '27',
    title: 'Sonic Adventure',
    system: 'dreamcast',
    coverImage: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=200&auto=format&fit=crop',
    description: 'Sonic\'s first fully 3D adventure.',
    releaseYear: 1998,
    fileSize: '700 MB',
    fileType: 'iso',
    installed: true
  },
  {
    id: '28',
    title: 'The Legend of Zelda: Wind Waker',
    system: 'gamecube',
    coverImage: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=200&auto=format&fit=crop',
    description: 'Link sails the Great Sea in search of his kidnapped sister.',
    releaseYear: 2002,
    fileSize: '1.5 GB',
    fileType: 'iso',
    installed: true
  },
  {
    id: '29',
    title: 'Clash of Clans',
    system: 'android',
    coverImage: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=200&auto=format&fit=crop',
    description: 'Build your village, train troops, and attack other players.',
    releaseYear: 2012,
    fileSize: '150 MB',
    fileType: 'apk',
    installed: true
  },
  {
    id: '30',
    title: 'Half-Life 2',
    system: 'windows',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop',
    description: 'Gordon Freeman fights against the alien Combine empire.',
    releaseYear: 2004,
    fileSize: '6.5 GB',
    fileType: 'exe',
    installed: true
  }
];

export interface GraphicsSettings {
  resolution: string;
  aspectRatio: string;
  textureFiltering: string;
  antiAliasing: string;
  shaders: string;
  vsync: boolean;
  frameLimit: number;
  stretchMode: string;
  scanlines: boolean;
  crtEffect: boolean;
}

export const defaultGraphicsSettings: GraphicsSettings = {
  resolution: '1280x720',
  aspectRatio: '16:9',
  textureFiltering: 'Bilinear',
  antiAliasing: 'None',
  shaders: 'None',
  vsync: true,
  frameLimit: 60,
  stretchMode: 'Keep Aspect',
  scanlines: false,
  crtEffect: false
};

export interface EmulatorConfiguration {
  graphics: GraphicsSettings;
  controllerMappings: Record<string, string>;
  audioLatency: number;
  audioVolume: number;
  saveLocation: string;
  autoSave: boolean;
}

export const defaultEmulatorConfig: EmulatorConfiguration = {
  graphics: defaultGraphicsSettings,
  controllerMappings: {
    'up': 'Arrow Up',
    'down': 'Arrow Down',
    'left': 'Arrow Left',
    'right': 'Arrow Right',
    'a': 'Z',
    'b': 'X',
    'start': 'Enter',
    'select': 'Space',
  },
  audioLatency: 100,
  audioVolume: 80,
  saveLocation: 'C:\\EmulatorSaves',
  autoSave: true
};

export type SystemRequirement = {
  component: string;
  minimum: string;
  recommended: string;
};

export const systemRequirements: SystemRequirement[] = [
  { component: 'OS', minimum: 'Windows 7/macOS 10.12/Linux', recommended: 'Windows 10/macOS 10.15/Ubuntu 20.04' },
  { component: 'CPU', minimum: 'Intel Core i3 2.4 GHz', recommended: 'Intel Core i5 3.0 GHz or AMD Ryzen 5' },
  { component: 'RAM', minimum: '4 GB', recommended: '8 GB' },
  { component: 'GPU', minimum: 'DirectX 11 compatible', recommended: 'NVIDIA GTX 960 / AMD RX 470 or better' },
  { component: 'Storage', minimum: '10 GB available', recommended: '50 GB SSD available' },
  { component: 'Network', minimum: 'Broadband connection', recommended: 'High-speed internet connection' }
];

export const setupRequiredFiles = [
  'DirectX Runtime Environment',
  'Microsoft Visual C++ 2015-2022 Redistributable',
  '.NET Framework 4.7.2',
  'OpenAL Audio Library',
  'RetroNexus Core Files'
];
