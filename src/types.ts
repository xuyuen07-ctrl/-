/**
 * Types and interfaces for the Sphere Battle Arena game.
 */

export interface Character {
  id: string;
  name: string;
  title: string;
  role: 'tank' | 'fighter' | 'shooter' | 'mage' | 'support' | 'assassin';
  roleName: string; // e.g. "坦克位", "戰士位", etc.
  initialHp: number;
  color: string;      // Glow hex code / core color, e.g., "#ef4444"
  bgColor: string;    // Tailwind color class, e.g., "bg-red-500"
  textColor: string;  // Tailwind text class, e.g., "text-red-400"
  shadowColor: string;// Tailwind shadow, e.g., "shadow-red-500/50"
  speed: number;      // Speed modifier, multiplier of baseline (e.g., 1.0)
  mass: number;       // For elastic collisions
  icon: string;       // Emoji or SVG shorthand
  skillName: string;
  skillType: 'collision-drain' | 'collision-inst' | 'collision-burn' | 'collision-surge' | 'collision-gamble' | 'collision-phantom' | 'collision-cat' | 'collision-snake' | 'collision-grid9' | 'collision-dragon' | 'collision-whip' | 'collision-cosmic' | 'collision-conductor' | 'collision-wind-eagle' | 'collision-explorer' | 'collision-silent' | 'collision-flash-bird' | 'collision-harvey' | 'collision-poke' | 'collision-none' | 'collision-lie' | 'collision-painter' | 'collision-scythe';
  skillDesc: string;
  detailedDesc: string;
  subSkillName?: string;
  subSkillDesc?: string;
  skill2Name?: string;
  skill2Desc?: string;
  skill2DetailedDesc?: string;
  isPlaceholder?: boolean;
  story?: string;
  quotes?: {
    select?: string;
    subSkill?: string;
    defeat?: string;
    win?: string;
  };
}

export type GameStatus = 'MAIN_MENU' | 'SELECTING' | 'BATTLE' | 'GAME_OVER';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  life: number;     // Remaining duration, e.g., 1.0 down to 0
  maxLife: number;
  type: 'spark' | 'blood' | 'dust' | 'fire' | 'lightning' | 'push' | 'water' | 'wind' | 'poison' | 'divine' | 'cosmic' | 'poker' | 'earth';
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  vy: number;
  vx?: number;      // Optional horizontal travel velocity
  color: string;
  life: number;     // Life percentage 1.0 down to 0
}

export interface MudPuddle {
  id: string;
  x: number;
  y: number;
  radius: number;
  life: number;     // Duration in seconds (e.g. 0.2s)
  maxLife: number;
}

export interface FireArea {
  id: string;
  x: number;
  y: number;
  radius: number;
  life: number;
  maxLife: number;
}
