export type CharacterId = 'nena' | 'pepe' | 'duo';

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  subtitle: string;
  description: string;
  avatarColor: string;
  jacketColor: string;
  hairColor: string;
  specialSkill: string;
  skillDescription: string;
  stats: {
    speed: number;
    jump: number;
    agility: number;
  };
}

export interface StageInfo {
  id: number;
  name: string;
  title: string;
  theme: 'forest' | 'clouds' | 'crystals' | 'volcano' | 'castle';
  description: string;
  bgImage: string;
  primaryColor: string;
  accentColor: string;
  unlocked: boolean;
  starsCollected: number;
  bestScore: number;
  coinsMax: number;
  isBossStage?: boolean;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  facing: 'left' | 'right';
  lives: number;
  maxLives: number;
  coins: number;
  score: number;
  stars: number;
  isInvulnerable: boolean;
  invulnerabilityTimer: number;
  hasDoubleJump: boolean;
  doubleJumpUsed: boolean;
  powerUp: 'none' | 'speed' | 'high_jump' | 'shield';
  powerUpTimer: number;
  isAttacking: boolean;
  attackTimer: number;
}

export interface CompanionState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: 'left' | 'right';
  isGrounded: boolean;
  barkTimer: number;
  sniffing: boolean;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'stone' | 'wood' | 'cloud' | 'crystal' | 'basalt' | 'castle' | 'moving' | 'spring' | 'crumbly';
  moveRange?: number;
  moveSpeed?: number;
  currentOffset?: number;
  crumbleTimer?: number;
  crumbled?: boolean;
}

export interface Collectible {
  id: string;
  x: number;
  y: number;
  type: 'coin' | 'star' | 'heart' | 'potion_speed' | 'potion_jump' | 'potion_shield' | 'chest';
  collected: boolean;
  value: number;
  bobOffset: number;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  type: 'slime' | 'bird' | 'crab' | 'bat' | 'knight' | 'dragon';
  minX: number;
  maxX: number;
  health: number;
  maxHealth: number;
  alive: boolean;
  attackTimer?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'spark' | 'star' | 'smoke';
}

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  fromBoss: boolean;
}

export interface Checkpoint {
  x: number;
  y: number;
  activated: boolean;
}

export interface LevelData {
  id: number;
  name: string;
  width: number;
  height: number;
  spawnPoint: { x: number; y: number };
  goalPoint: { x: number; y: number };
  checkpoints: Checkpoint[];
  platforms: Platform[];
  collectibles: Collectible[];
  enemies: Enemy[];
  bgTheme: 'forest' | 'clouds' | 'crystals' | 'volcano' | 'castle';
  boss?: {
    name: string;
    maxHealth: number;
  };
}

export interface HighScoreRecord {
  id: string;
  playerName: string;
  character: CharacterId;
  stageName: string;
  stageId: number;
  score: number;
  coins: number;
  stars: number;
  date: string;
}
