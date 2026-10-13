import { LevelData, StageInfo } from '../types/game';
import forestBg from '../assets/images/forest_stage_bg_1791850064327.jpg';
import skyBg from '../assets/images/sky_clouds_bg_1791850064972.jpg';
import crystalBg from '../assets/images/crystal_cave_bg_1791850066103.jpg';
import castleBg from '../assets/images/shadow_castle_bg_1791850065960.jpg';

export const STAGES_METADATA: StageInfo[] = [
  {
    id: 1,
    name: 'Fase 1',
    title: 'O Bosque Encantado',
    theme: 'forest',
    description: 'Comece a jornada em uma floresta mágica cheia de árvores ancestrais, cachoeiras e segredos.',
    bgImage: forestBg,
    primaryColor: '#10B981',
    accentColor: '#F59E0B',
    unlocked: true,
    starsCollected: 0,
    bestScore: 0,
    coinsMax: 30,
  },
  {
    id: 2,
    name: 'Fase 2',
    title: 'A Vila das Nuvens',
    theme: 'clouds',
    description: 'Salte entre ilhas flutuantes celestiais, moinhos de vento e pontes de corda no alto dos céus.',
    bgImage: skyBg,
    primaryColor: '#0EA5E9',
    accentColor: '#38BDF8',
    unlocked: true,
    starsCollected: 0,
    bestScore: 0,
    coinsMax: 45,
  },
  {
    id: 3,
    name: 'Fase 3',
    title: 'Cavernas de Cristal',
    theme: 'crystals',
    description: 'Adentre profundezas iluminadas por ametistas e safiras brilhantes, com perigos cintilantes.',
    bgImage: crystalBg,
    primaryColor: '#8B5CF6',
    accentColor: '#C084FC',
    unlocked: false,
    starsCollected: 0,
    bestScore: 0,
    coinsMax: 50,
  },
  {
    id: 4,
    name: 'Fase 4',
    title: 'O Vulcão Dourado',
    theme: 'volcano',
    description: 'Desvie de rios de magma fervente, cinzas incandescentes e pedras de basalto que desabam.',
    bgImage: castleBg,
    primaryColor: '#F97316',
    accentColor: '#EF4444',
    unlocked: false,
    starsCollected: 0,
    bestScore: 0,
    coinsMax: 60,
  },
  {
    id: 5,
    name: 'Fase 5',
    title: 'Castelo das Sombras',
    theme: 'castle',
    description: 'A fortaleza final nas alturas. Supere armadilhas e enfrente o temível Dragão das Sombras!',
    bgImage: castleBg,
    primaryColor: '#6366F1',
    accentColor: '#EC4899',
    unlocked: false,
    starsCollected: 0,
    bestScore: 0,
    coinsMax: 70,
    isBossStage: true,
  },
];

export function getLevelData(stageId: number): LevelData {
  switch (stageId) {
    case 1:
      return {
        id: 1,
        name: 'O Bosque Encantado',
        width: 3200,
        height: 800,
        spawnPoint: { x: 100, y: 550 },
        goalPoint: { x: 3050, y: 500 },
        bgTheme: 'forest',
        checkpoints: [
          { x: 1500, y: 520, activated: false }
        ],
        platforms: [
          // Starting ground
          { x: 0, y: 640, width: 850, height: 160, type: 'stone' },
          // Stepping platforms
          { x: 320, y: 510, width: 140, height: 32, type: 'wood' },
          { x: 520, y: 400, width: 160, height: 32, type: 'wood' },
          // Spring flower
          { x: 740, y: 610, width: 60, height: 30, type: 'spring' },
          { x: 700, y: 300, width: 150, height: 32, type: 'wood' },
          // Gap 1
          { x: 950, y: 640, width: 650, height: 160, type: 'stone' },
          { x: 1100, y: 480, width: 140, height: 32, type: 'moving', moveRange: 180, moveSpeed: 1.5, currentOffset: 0 },
          { x: 1350, y: 390, width: 150, height: 32, type: 'wood' },
          // Mid ground & Checkpoint
          { x: 1650, y: 600, width: 600, height: 200, type: 'stone' },
          { x: 1800, y: 460, width: 130, height: 30, type: 'crumbly', crumbleTimer: 0, crumbled: false },
          { x: 2000, y: 360, width: 150, height: 32, type: 'wood' },
          // Moving log
          { x: 2320, y: 500, width: 140, height: 32, type: 'moving', moveRange: 150, moveSpeed: 2, currentOffset: 0 },
          // High branch
          { x: 2520, y: 380, width: 160, height: 32, type: 'wood' },
          // Final stretch
          { x: 2750, y: 640, width: 450, height: 160, type: 'stone' },
        ],
        collectibles: [
          // Early coins
          { id: 'c1', x: 220, y: 600, type: 'coin', collected: false, value: 10, bobOffset: 0 },
          { id: 'c2', x: 270, y: 600, type: 'coin', collected: false, value: 10, bobOffset: 0.5 },
          { id: 'c3', x: 380, y: 470, type: 'coin', collected: false, value: 10, bobOffset: 1 },
          { id: 'c4', x: 570, y: 360, type: 'coin', collected: false, value: 10, bobOffset: 1.5 },
          // Star 1 (High branch)
          { id: 's1', x: 770, y: 240, type: 'star', collected: false, value: 100, bobOffset: 0 },
          // Potion
          { id: 'p1', x: 1020, y: 600, type: 'potion_jump', collected: false, value: 50, bobOffset: 0.8 },
          { id: 'c5', x: 1150, y: 440, type: 'coin', collected: false, value: 10, bobOffset: 0 },
          { id: 'c6', x: 1200, y: 440, type: 'coin', collected: false, value: 10, bobOffset: 0.5 },
          { id: 'c7', x: 1400, y: 350, type: 'coin', collected: false, value: 10, bobOffset: 1 },
          // Heart
          { id: 'h1', x: 1450, y: 350, type: 'heart', collected: false, value: 50, bobOffset: 0 },
          // Star 2 (Secret alcove)
          { id: 's2', x: 1860, y: 420, type: 'star', collected: false, value: 100, bobOffset: 0.2 },
          // Treasure chest
          { id: 'ch1', x: 2060, y: 320, type: 'chest', collected: false, value: 200, bobOffset: 0 },
          { id: 'c8', x: 2380, y: 460, type: 'coin', collected: false, value: 10, bobOffset: 0.7 },
          { id: 'c9', x: 2570, y: 340, type: 'coin', collected: false, value: 10, bobOffset: 1.2 },
          { id: 'c10', x: 2620, y: 340, type: 'coin', collected: false, value: 10, bobOffset: 1.7 },
          // Star 3 (Before Goal)
          { id: 's3', x: 2900, y: 580, type: 'star', collected: false, value: 100, bobOffset: 0 },
          { id: 'c11', x: 2820, y: 600, type: 'coin', collected: false, value: 10, bobOffset: 0 },
          { id: 'c12', x: 2980, y: 600, type: 'coin', collected: false, value: 10, bobOffset: 0.4 },
        ],
        enemies: [
          { id: 'e1', x: 450, y: 608, width: 36, height: 32, vx: 1.2, type: 'slime', minX: 350, maxX: 680, health: 1, maxHealth: 1, alive: true },
          { id: 'e2', x: 1100, y: 608, width: 36, height: 32, vx: -1.2, type: 'slime', minX: 980, maxX: 1300, health: 1, maxHealth: 1, alive: true },
          { id: 'e3', x: 1800, y: 568, width: 36, height: 32, vx: 1.4, type: 'slime', minX: 1700, maxX: 2100, health: 1, maxHealth: 1, alive: true },
        ],
      };

    case 2:
      return {
        id: 2,
        name: 'A Vila das Nuvens',
        width: 3500,
        height: 850,
        spawnPoint: { x: 120, y: 580 },
        goalPoint: { x: 3350, y: 460 },
        bgTheme: 'clouds',
        checkpoints: [
          { x: 1680, y: 500, activated: false }
        ],
        platforms: [
          { x: 0, y: 660, width: 600, height: 160, type: 'cloud' },
          { x: 350, y: 540, width: 140, height: 35, type: 'cloud' },
          // Cloud spring
          { x: 520, y: 630, width: 60, height: 30, type: 'spring' },
          { x: 680, y: 440, width: 160, height: 35, type: 'cloud' },
          { x: 920, y: 380, width: 140, height: 32, type: 'moving', moveRange: 160, moveSpeed: 1.8, currentOffset: 0 },
          { x: 1180, y: 520, width: 220, height: 35, type: 'wood' },
          // Floating islands
          { x: 1480, y: 640, width: 500, height: 160, type: 'cloud' },
          { x: 1720, y: 460, width: 130, height: 30, type: 'crumbly', crumbleTimer: 0, crumbled: false },
          { x: 1930, y: 360, width: 160, height: 35, type: 'cloud' },
          { x: 2180, y: 480, width: 140, height: 32, type: 'moving', moveRange: 200, moveSpeed: 2.2, currentOffset: 0 },
          { x: 2480, y: 400, width: 150, height: 35, type: 'cloud' },
          { x: 2700, y: 550, width: 180, height: 35, type: 'wood' },
          { x: 2950, y: 440, width: 140, height: 35, type: 'cloud' },
          { x: 3180, y: 620, width: 320, height: 160, type: 'cloud' },
        ],
        collectibles: [
          { id: 'c1', x: 200, y: 620, type: 'coin', collected: false, value: 10, bobOffset: 0 },
          { id: 'c2', x: 250, y: 620, type: 'coin', collected: false, value: 10, bobOffset: 0.5 },
          { id: 's1', x: 740, y: 380, type: 'star', collected: false, value: 100, bobOffset: 0 },
          { id: 'p1', x: 1240, y: 470, type: 'potion_speed', collected: false, value: 50, bobOffset: 0 },
          { id: 'c3', x: 1300, y: 470, type: 'coin', collected: false, value: 10, bobOffset: 0.3 },
          { id: 'c4', x: 1580, y: 590, type: 'coin', collected: false, value: 10, bobOffset: 0.6 },
          { id: 'h1', x: 1640, y: 590, type: 'heart', collected: false, value: 50, bobOffset: 0 },
          { id: 's2', x: 2000, y: 300, type: 'star', collected: false, value: 100, bobOffset: 0.2 },
          { id: 'ch1', x: 2540, y: 350, type: 'chest', collected: false, value: 200, bobOffset: 0 },
          { id: 'c5', x: 2750, y: 500, type: 'coin', collected: false, value: 10, bobOffset: 0 },
          { id: 'c6', x: 3000, y: 390, type: 'coin', collected: false, value: 10, bobOffset: 0.5 },
          { id: 's3', x: 3250, y: 560, type: 'star', collected: false, value: 100, bobOffset: 0 },
        ],
        enemies: [
          { id: 'e1', x: 750, y: 280, width: 34, height: 26, vx: 1.8, type: 'bird', minX: 680, maxX: 950, health: 1, maxHealth: 1, alive: true },
          { id: 'e2', x: 1600, y: 605, width: 36, height: 32, vx: -1.2, type: 'slime', minX: 1500, maxX: 1850, health: 1, maxHealth: 1, alive: true },
          { id: 'e3', x: 2300, y: 330, width: 34, height: 26, vx: 2, type: 'bird', minX: 2150, maxX: 2450, health: 1, maxHealth: 1, alive: true },
        ],
      };

    case 3:
      return {
        id: 3,
        name: 'Cavernas de Cristal',
        width: 3600,
        height: 850,
        spawnPoint: { x: 120, y: 580 },
        goalPoint: { x: 3420, y: 480 },
        bgTheme: 'crystals',
        checkpoints: [
          { x: 1750, y: 520, activated: false }
        ],
        platforms: [
          { x: 0, y: 660, width: 650, height: 160, type: 'crystal' },
          { x: 380, y: 520, width: 140, height: 32, type: 'crystal' },
          { x: 590, y: 410, width: 150, height: 32, type: 'crystal' },
          { x: 800, y: 580, width: 160, height: 32, type: 'moving', moveRange: 180, moveSpeed: 2, currentOffset: 0 },
          { x: 1050, y: 450, width: 150, height: 30, type: 'crumbly', crumbleTimer: 0, crumbled: false },
          { x: 1280, y: 350, width: 180, height: 32, type: 'crystal' },
          // Spring geode
          { x: 1400, y: 320, width: 50, height: 30, type: 'spring' },
          { x: 1550, y: 640, width: 550, height: 160, type: 'crystal' },
          { x: 1850, y: 460, width: 140, height: 32, type: 'crystal' },
          { x: 2060, y: 360, width: 150, height: 32, type: 'moving', moveRange: 160, moveSpeed: 2.3, currentOffset: 0 },
          { x: 2300, y: 500, width: 180, height: 32, type: 'crystal' },
          { x: 2560, y: 380, width: 160, height: 32, type: 'crystal' },
          { x: 2800, y: 520, width: 150, height: 32, type: 'moving', moveRange: 200, moveSpeed: 1.8, currentOffset: 0 },
          { x: 3100, y: 650, width: 450, height: 160, type: 'crystal' },
        ],
        collectibles: [
          { id: 'c1', x: 200, y: 610, type: 'coin', collected: false, value: 10, bobOffset: 0 },
          { id: 'c2', x: 260, y: 610, type: 'coin', collected: false, value: 10, bobOffset: 0.3 },
          { id: 's1', x: 650, y: 360, type: 'star', collected: false, value: 100, bobOffset: 0 },
          { id: 'p1', x: 1330, y: 300, type: 'potion_shield', collected: false, value: 50, bobOffset: 0 },
          { id: 'c3', x: 1620, y: 590, type: 'coin', collected: false, value: 10, bobOffset: 0.5 },
          { id: 'c4', x: 1680, y: 590, type: 'coin', collected: false, value: 10, bobOffset: 0.8 },
          { id: 'h1', x: 1740, y: 590, type: 'heart', collected: false, value: 50, bobOffset: 0 },
          { id: 's2', x: 1910, y: 410, type: 'star', collected: false, value: 100, bobOffset: 0 },
          { id: 'ch1', x: 2620, y: 330, type: 'chest', collected: false, value: 200, bobOffset: 0 },
          { id: 'c5', x: 2860, y: 470, type: 'coin', collected: false, value: 10, bobOffset: 0 },
          { id: 's3', x: 3220, y: 600, type: 'star', collected: false, value: 100, bobOffset: 0 },
          { id: 'c6', x: 3300, y: 600, type: 'coin', collected: false, value: 10, bobOffset: 0.4 },
        ],
        enemies: [
          { id: 'e1', x: 420, y: 485, width: 36, height: 28, vx: 1.3, type: 'crab', minX: 380, maxX: 520, health: 1, maxHealth: 1, alive: true },
          { id: 'e2', x: 1680, y: 605, width: 36, height: 28, vx: -1.3, type: 'crab', minX: 1580, maxX: 1900, health: 1, maxHealth: 1, alive: true },
          { id: 'e3', x: 2360, y: 465, width: 36, height: 28, vx: 1.5, type: 'crab', minX: 2300, maxX: 2470, health: 1, maxHealth: 1, alive: true },
        ],
      };

    case 4:
      return {
        id: 4,
        name: 'O Vulcão Dourado',
        width: 3800,
        height: 850,
        spawnPoint: { x: 120, y: 580 },
        goalPoint: { x: 3620, y: 480 },
        bgTheme: 'volcano',
        checkpoints: [
          { x: 1850, y: 500, activated: false }
        ],
        platforms: [
          { x: 0, y: 670, width: 550, height: 160, type: 'basalt' },
          { x: 350, y: 520, width: 130, height: 32, type: 'basalt' },
          { x: 550, y: 410, width: 140, height: 30, type: 'crumbly', crumbleTimer: 0, crumbled: false },
          { x: 760, y: 530, width: 150, height: 32, type: 'moving', moveRange: 160, moveSpeed: 2.2, currentOffset: 0 },
          { x: 1000, y: 420, width: 150, height: 32, type: 'basalt' },
          // Spring vent
          { x: 1100, y: 390, width: 50, height: 30, type: 'spring' },
          { x: 1230, y: 280, width: 150, height: 32, type: 'basalt' },
          { x: 1480, y: 440, width: 140, height: 30, type: 'crumbly', crumbleTimer: 0, crumbled: false },
          { x: 1720, y: 640, width: 500, height: 160, type: 'basalt' },
          { x: 2000, y: 480, width: 130, height: 32, type: 'basalt' },
          { x: 2200, y: 370, width: 160, height: 32, type: 'moving', moveRange: 190, moveSpeed: 2.5, currentOffset: 0 },
          { x: 2480, y: 460, width: 150, height: 30, type: 'crumbly', crumbleTimer: 0, crumbled: false },
          { x: 2720, y: 360, width: 150, height: 32, type: 'basalt' },
          { x: 2980, y: 500, width: 140, height: 32, type: 'moving', moveRange: 180, moveSpeed: 2, currentOffset: 0 },
          { x: 3250, y: 400, width: 160, height: 32, type: 'basalt' },
          { x: 3480, y: 640, width: 350, height: 160, type: 'basalt' },
        ],
        collectibles: [
          { id: 'c1', x: 180, y: 620, type: 'coin', collected: false, value: 10, bobOffset: 0 },
          { id: 'c2', x: 240, y: 620, type: 'coin', collected: false, value: 10, bobOffset: 0.4 },
          { id: 's1', x: 1290, y: 230, type: 'star', collected: false, value: 100, bobOffset: 0 },
          { id: 'p1', x: 1060, y: 370, type: 'potion_jump', collected: false, value: 50, bobOffset: 0 },
          { id: 'c3', x: 1780, y: 590, type: 'coin', collected: false, value: 10, bobOffset: 0 },
          { id: 'h1', x: 1840, y: 590, type: 'heart', collected: false, value: 50, bobOffset: 0 },
          { id: 's2', x: 2270, y: 310, type: 'star', collected: false, value: 100, bobOffset: 0 },
          { id: 'ch1', x: 2780, y: 310, type: 'chest', collected: false, value: 200, bobOffset: 0 },
          { id: 'c4', x: 3310, y: 350, type: 'coin', collected: false, value: 10, bobOffset: 0.3 },
          { id: 's3', x: 3550, y: 580, type: 'star', collected: false, value: 100, bobOffset: 0 },
        ],
        enemies: [
          { id: 'e1', x: 770, y: 470, width: 32, height: 26, vx: 2, type: 'bat', minX: 720, maxX: 950, health: 1, maxHealth: 1, alive: true },
          { id: 'e2', x: 1800, y: 605, width: 36, height: 32, vx: -1.4, type: 'slime', minX: 1730, maxX: 2050, health: 1, maxHealth: 1, alive: true },
          { id: 'e3', x: 2730, y: 300, width: 32, height: 26, vx: -2, type: 'bat', minX: 2650, maxX: 2900, health: 1, maxHealth: 1, alive: true },
        ],
      };

    case 5:
    default:
      return {
        id: 5,
        name: 'Castelo das Sombras',
        width: 3200,
        height: 850,
        spawnPoint: { x: 120, y: 580 },
        goalPoint: { x: 3050, y: 480 },
        bgTheme: 'castle',
        boss: {
          name: 'O Dragão das Sombras',
          maxHealth: 100,
        },
        checkpoints: [
          { x: 1600, y: 500, activated: false }
        ],
        platforms: [
          // Castle intro
          { x: 0, y: 670, width: 600, height: 160, type: 'castle' },
          { x: 350, y: 520, width: 140, height: 32, type: 'castle' },
          { x: 580, y: 410, width: 150, height: 32, type: 'castle' },
          { x: 800, y: 530, width: 150, height: 32, type: 'moving', moveRange: 160, moveSpeed: 2, currentOffset: 0 },
          { x: 1040, y: 420, width: 160, height: 32, type: 'castle' },
          { x: 1280, y: 320, width: 140, height: 30, type: 'crumbly', crumbleTimer: 0, crumbled: false },
          // Boss Arena Arena Entrance
          { x: 1500, y: 650, width: 1700, height: 180, type: 'castle' },
          // Arena floating battle platforms
          { x: 1800, y: 480, width: 150, height: 30, type: 'castle' },
          { x: 2100, y: 380, width: 180, height: 30, type: 'castle' },
          { x: 2420, y: 480, width: 150, height: 30, type: 'castle' },
          { x: 2750, y: 380, width: 160, height: 30, type: 'castle' },
        ],
        collectibles: [
          { id: 'c1', x: 200, y: 620, type: 'coin', collected: false, value: 10, bobOffset: 0 },
          { id: 's1', x: 640, y: 360, type: 'star', collected: false, value: 100, bobOffset: 0 },
          { id: 'p1', x: 1100, y: 370, type: 'potion_shield', collected: false, value: 50, bobOffset: 0 },
          { id: 'h1', x: 1550, y: 600, type: 'heart', collected: false, value: 50, bobOffset: 0 },
          { id: 's2', x: 1330, y: 260, type: 'star', collected: false, value: 100, bobOffset: 0 },
          // Arena supplies
          { id: 'h2', x: 2180, y: 330, type: 'heart', collected: false, value: 50, bobOffset: 0 },
          { id: 'ch1', x: 2800, y: 330, type: 'chest', collected: false, value: 250, bobOffset: 0 },
          // Final star after dragon
          { id: 's3', x: 2950, y: 580, type: 'star', collected: false, value: 200, bobOffset: 0 },
        ],
        enemies: [
          { id: 'e1', x: 400, y: 485, width: 36, height: 34, vx: 1.2, type: 'knight', minX: 350, maxX: 490, health: 1, maxHealth: 1, alive: true },
          { id: 'e2', x: 1070, y: 385, width: 36, height: 34, vx: -1.2, type: 'knight', minX: 1040, maxX: 1200, health: 1, maxHealth: 1, alive: true },
          // Boss: O Dragão das Sombras
          {
            id: 'boss_dragon',
            x: 2350,
            y: 450,
            width: 140,
            height: 110,
            vx: 2.2,
            type: 'dragon',
            minX: 1850,
            maxX: 2750,
            health: 100,
            maxHealth: 100,
            alive: true,
            attackTimer: 0,
          },
        ],
      };
  }
}
