import React, { useState } from 'react';
import { Character } from '../types';
import { CHARACTERS } from '../characters';
import { CharacterVectorIcon } from './CharacterVectorIcon';
import { audio } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { AttributeRadarChart } from './AttributeRadarChart';
import { 
  X, 
  User, 
  Layers, 
  HelpCircle, 
  Flame, 
  ShieldAlert, 
  Heart, 
  Zap, 
  Trophy, 
  Award,
  Sparkles,
  RefreshCw,
  Sliders,
  Scale,
  Shield,
  Gem,
  Wind,
  Pause,
  Play,
  FastForward,
  RotateCcw,
  Settings,
  BookOpen,
  Sword,
  Target,
  Compass,
  Volume2,
  Lock,
  Cpu,
  Globe,
  Eye,
  Activity,
  HeartPulse,
  FlameKindling,
  Crosshair,
  Gauge
} from 'lucide-react';

interface HandbookProps {
  onClose: () => void;
  inBattle?: boolean;
  isPlaying?: boolean;
  setIsPlaying?: (playing: boolean) => void;
  battleSpeed?: number;
  setBattleSpeed?: (speed: number) => void;
  onBackToMenu?: () => void;
}

type TabType = 'characters' | 'botanist' | 'items' | 'modes' | 'attributes' | 'controls';

// Premium Theme mapping based on character elements
const getElementDetails = (id: string, customColor?: string) => {
  switch(id) {
    case 'vampire':
      return { 
        element: '🩸 猩紅', 
        label: 'Blood Element', 
        ringColor: 'rgba(239, 68, 68, 0.4)', 
        glowClass: 'shadow-red-500/25', 
        textClass: 'text-red-400', 
        themeColor: '#ef4444', 
        bgColor: 'bg-red-950/20',
        borderColor: 'border-red-500/40',
        gradient: 'from-red-950/40 via-slate-900 to-slate-950'
      };
    case 'mud':
      return { 
        element: '🟫 磐石', 
        label: 'Rock Element', 
        ringColor: 'rgba(217, 119, 6, 0.4)', 
        glowClass: 'shadow-amber-600/25', 
        textClass: 'text-amber-500', 
        themeColor: '#d97706', 
        bgColor: 'bg-amber-950/20',
        borderColor: 'border-amber-500/40',
        gradient: 'from-amber-950/30 via-slate-900 to-slate-950'
      };
    case 'blaze':
      return { 
        element: '🔥 烈火', 
        label: 'Fire Element', 
        ringColor: 'rgba(249, 115, 22, 0.4)', 
        glowClass: 'shadow-orange-500/25', 
        textClass: 'text-orange-400', 
        themeColor: '#f97316', 
        bgColor: 'bg-orange-950/20',
        borderColor: 'border-orange-500/40',
        gradient: 'from-orange-950/30 via-slate-900 to-slate-950'
      };
    case 'lightning':
      return { 
        element: '🌀 風雷', 
        label: 'Wind/Storm', 
        ringColor: 'rgba(6, 182, 212, 0.4)', 
        glowClass: 'shadow-cyan-500/25', 
        textClass: 'text-cyan-400', 
        themeColor: '#06b6d4', 
        bgColor: 'bg-cyan-950/20',
        borderColor: 'border-cyan-500/40',
        gradient: 'from-cyan-950/30 via-slate-900 to-slate-950'
      };
    case 'dice':
      return { 
        element: '🎲 混沌', 
        label: 'Entropy Dice', 
        ringColor: 'rgba(203, 213, 225, 0.4)', 
        glowClass: 'shadow-slate-400/25', 
        textClass: 'text-slate-400', 
        themeColor: '#cbd5e1', 
        bgColor: 'bg-slate-900/40',
        borderColor: 'border-slate-700/50',
        gradient: 'from-slate-800/30 via-slate-900 to-slate-950'
      };
    case 'gravity':
      return { 
        element: '🌌 引力', 
        label: 'Gravitational', 
        ringColor: 'rgba(129, 140, 248, 0.4)', 
        glowClass: 'shadow-indigo-500/25', 
        textClass: 'text-indigo-400', 
        themeColor: '#818cf8', 
        bgColor: 'bg-indigo-950/20',
        borderColor: 'border-indigo-500/40',
        gradient: 'from-indigo-950/30 via-slate-900 to-slate-950'
      };
    case 'phantom':
      return { 
        element: '🔮 幻影', 
        label: 'Quantum Phantom', 
        ringColor: 'rgba(192, 132, 252, 0.4)', 
        glowClass: 'shadow-purple-500/25', 
        textClass: 'text-purple-400', 
        themeColor: '#c084fc', 
        bgColor: 'bg-purple-950/20',
        borderColor: 'border-purple-500/40',
        gradient: 'from-purple-950/30 via-slate-900 to-slate-950'
      };
    case 'cat':
      return { 
        element: '🐱 靈貓', 
        label: 'Neko Swift', 
        ringColor: 'rgba(233, 213, 255, 0.4)', 
        glowClass: 'shadow-fuchsia-500/25', 
        textClass: 'text-fuchsia-300', 
        themeColor: '#e9d5ff', 
        bgColor: 'bg-fuchsia-950/20',
        borderColor: 'border-fuchsia-400/40',
        gradient: 'from-fuchsia-950/20 via-slate-900 to-slate-950'
      };
    case 'snake':
      return { 
        element: '🐍 貪婪', 
        label: 'Viper Serpent', 
        ringColor: 'rgba(16, 185, 129, 0.4)', 
        glowClass: 'shadow-emerald-500/25', 
        textClass: 'text-emerald-400', 
        themeColor: '#10b981', 
        bgColor: 'bg-emerald-950/20',
        borderColor: 'border-emerald-500/40',
        gradient: 'from-emerald-950/30 via-slate-900 to-slate-950'
      };
    case 'grid9':
      return { 
        element: '🔢 數陣', 
        label: 'Matrix Grid', 
        ringColor: 'rgba(245, 158, 11, 0.4)', 
        glowClass: 'shadow-amber-500/25', 
        textClass: 'text-amber-400', 
        themeColor: '#f59e0b', 
        bgColor: 'bg-amber-950/20',
        borderColor: 'border-amber-400/40',
        gradient: 'from-amber-950/20 via-slate-900 to-slate-950'
      };
    case 'water_dragon':
      return { 
        element: '🐉 蒼溟', 
        label: 'Abyssal Dragon', 
        ringColor: 'rgba(56, 189, 248, 0.4)', 
        glowClass: 'shadow-sky-500/25', 
        textClass: 'text-sky-400', 
        themeColor: '#38bdf8', 
        bgColor: 'bg-sky-950/20',
        borderColor: 'border-sky-500/40',
        gradient: 'from-sky-950/30 via-slate-900 to-slate-950'
      };
    default:
      return { 
        element: '🔮 元素', 
        label: 'Unstable Plasma', 
        ringColor: 'rgba(99, 102, 241, 0.4)', 
        glowClass: 'shadow-indigo-500/25', 
        textClass: 'text-indigo-400', 
        themeColor: customColor || '#6366f1', 
        bgColor: 'bg-slate-900/40',
        borderColor: 'border-indigo-500/30',
        gradient: 'from-slate-900/60 via-slate-950 to-slate-950'
      };
  }
};

// Ratings mapping solver
const getCharacterRatings = (char: Character) => {
  const hpRating = Math.min(100, Math.max(30, Math.floor((char.initialHp / 350) * 100)));
  const speedRating = Math.min(100, Math.max(35, Math.floor((char.speed / 1.5) * 100)));
  const massRating = Math.min(100, Math.max(25, Math.floor((char.mass / 1.5) * 100)));
  
  let difficulty = 60;
  let strategy = 70;
  if (char.role === 'support') { difficulty = 75; strategy = 90; }
  else if (char.role === 'assassin') { difficulty = 85; strategy = 75; }
  else if (char.role === 'mage') { difficulty = 80; strategy = 85; }
  else if (char.role === 'tank') { difficulty = 50; strategy = 65; }
  else if (char.role === 'shooter') { difficulty = 70; strategy = 80; }

  // Compute Attack Rating
  let atkRating = 70;
  if (char.role === 'assassin') atkRating = 94;
  else if (char.role === 'mage') atkRating = char.id === 'blaze' ? 98 : char.id === 'lightning' ? 92 : 88;
  else if (char.role === 'shooter') atkRating = 85;
  else if (char.role === 'fighter') atkRating = 80;
  else if (char.role === 'tank') atkRating = 45;
  else if (char.role === 'support') atkRating = 50;

  // Custom adjustments for ATK based on kit
  if (char.id === 'flash_bird') atkRating = 95;
  else if (char.id === 'poke') atkRating = 88;
  else if (char.id === 'whip') atkRating = 86;
  else if (char.id === 'phantom') atkRating = 96;
  else if (char.id === 'cat') atkRating = 92;

  // Compute Special Rating
  let specialRating = 75;
  if (char.id === 'silent') specialRating = 98;
  else if (char.id === 'water_dragon') specialRating = 96;
  else if (char.id === 'cosmic_mage') specialRating = 94;
  else if (char.id === 'dice') specialRating = 94;
  else if (char.id === 'lie') specialRating = 92;
  else if (char.id === 'lightning') specialRating = 90;
  else if (char.id === 'gravity') specialRating = 88;
  else if (char.id === 'wind_eagle') specialRating = 86;
  else if (char.id === 'snake') specialRating = 85;
  else if (char.id === 'conductor') specialRating = 84;
  else if (char.id === 'grid9') specialRating = 83;
  else if (char.id === 'vampire') specialRating = 82;
  else if (char.id === 'mud') specialRating = 80;
  else if (char.id === 'phantom') specialRating = 80;

  let areaLabel = '120% 屬性域';
  if (char.id === 'vampire') areaLabel = '70% 前向吸血域';
  else if (char.id === 'mud') areaLabel = '75% 泥潭減速域';
  else if (char.id === 'blaze') areaLabel = '150% 圓環烈焰區';
  else if (char.id === 'lightning') areaLabel = '140% 氣旋高彈阻';
  else if (char.id === 'gravity') areaLabel = '160% 黑洞向心拉力';
  else if (char.id === 'whip') areaLabel = '120% 銀鞭連擊範圍';
  else if (char.id === 'conductor') areaLabel = '5段軌道列車巡防';
  else if (char.id === 'phantom') areaLabel = '量子爆裂碎屑領域';
  else if (char.id === 'cat') areaLabel = '水晶利爪跳躍絆擊';
  else if (char.id === 'snake') areaLabel = '8節貪食環節圍殺';
  else if (char.id === 'grid9') areaLabel = '3x3 黃金數域格';
  else if (char.id === 'water_dragon') areaLabel = '大水爆與全屏濤溟';
  else if (char.id === 'wind_eagle') areaLabel = '風箏氣場偏移彈道';
  else if (char.id === 'explorer') areaLabel = '2x1岩石路障+紅外';
  else if (char.id === 'silent') areaLabel = '寂光囚籠漏斗光柱';

  return { hp: hpRating, speed: speedRating, mass: massRating, difficulty, strategy, area: areaLabel, atk: atkRating, special: specialRating };
};

export function Handbook({ 
  onClose,
  inBattle = false,
  isPlaying = true,
  setIsPlaying,
  battleSpeed = 1,
  setBattleSpeed,
  onBackToMenu,
}: HandbookProps) {
  const [activeTab, setActiveTab] = useState<TabType>(inBattle ? 'controls' : 'characters');
  const [selectedCharIndex, setSelectedCharIndex] = useState<number>(0);
  const [selectedSkillType, setSelectedSkillType] = useState<'passive' | 'active' | 'ultimate'>('active');
  const [skillPower, setSkillPower] = useState<number>(1.0);
  const [counterType, setCounterType] = useState<'neutral' | 'counter' | 'countered'>('neutral');
  const [hasteCd, setHasteCd] = useState<number>(15);
  const [activeElement, setActiveElement] = useState<string>('mud');
  
  // Interactive Arsenal item active index
  const [selectedItemIdx, setSelectedItemIdx] = useState<number>(0);

  // Angel preview states
  const [angelPreviewStacks, setAngelPreviewStacks] = useState<number>(5);
  const [angelPreviewGesture, setAngelPreviewGesture] = useState<'idle' | 'moving' | 'precast' | 'postcast'>('idle');
  const [angelInteractionState, setAngelInteractionState] = useState<'idle' | 'click' | 'hit'>('idle');

  const triggerAngelClick = () => {
    setAngelInteractionState('click');
    try { audio.playSelect(); } catch(err){}
    setTimeout(() => {
      setAngelInteractionState('idle');
    }, 500);
  };

  const triggerAngelHit = () => {
    setAngelInteractionState('hit');
    try { audio.playCollision(); } catch(err){}
    setTimeout(() => {
      setAngelInteractionState('idle');
    }, 600);
  };

  const selectedChar = CHARACTERS[selectedCharIndex];
  const detail = getElementDetails(selectedChar.id, selectedChar.color);
  const ratings = getCharacterRatings(selectedChar);

  const handleTabClick = (tab: TabType) => {
    try { audio.playSelect(); } catch(err){}
    setActiveTab(tab);
  };

  const handleCharClick = (idx: number) => {
    try { audio.playSelect(); } catch(err){}
    setSelectedCharIndex(idx);
    setSelectedSkillType('active'); 
  };

  const handleSkillTypeClick = (type: 'passive' | 'active' | 'ultimate') => {
    try { audio.playSelect(); } catch(err){}
    setSelectedSkillType(type);
  };

  // 5-Element relation solver with visual nodes coordinates for SVG rendering
  const pentagramElements = [
    { id: 'mud', name: '🟫 磐石', x: 200, y: 50, countersName: '🌀 風雷', countersId: 'lightning', vulnerabilityName: '🎲 混沌', vulnerabilityId: 'dice', lore: '大地能為所有超高壓電流提供零電阻接地導航，且高密度的黃沙重擊極易在一瞬間砸穿並撕開微小的流體大氣旋風渦。' },
    { id: 'lightning', name: '🌀 風雷', x: 340, y: 150, countersName: '🔥 烈火', countersId: 'blaze', vulnerabilityName: '🟫 磐石', vulnerabilityId: 'mud', lore: '高空強風氣壓形成的巨型龍捲風暴能瞬息吹滅凡間烈火、迅速隔絕氧氣來源；而伴隨降臨的大量暴雨更能消解吸收高溫粒子熱能。' },
    { id: 'blaze', name: '🔥 烈火', x: 280, y: 310, countersName: '🩸 血影', countersId: 'vampire', vulnerabilityName: '🌀 風雷', vulnerabilityId: 'lightning', lore: '邪魅的吸血鬼與腥紅蝙蝠群高密度附宿物極度脆弱在熱輻射高溫中。燃燒的烈火可以點燃極端吸血編碼並徹底洗禮狂野魔。' },
    { id: 'vampire', name: '🩸 血影', x: 120, y: 310, countersName: '🎲 混沌', countersId: 'dice', vulnerabilityName: '🔥 烈火', vulnerabilityId: 'blaze', lore: '混沌確率的骰運存在高度的不確定性，但血影領主能以特異的猩紅獠牙，強效禁錮目標生命線並直接啃食其代碼，使其無法擲骰。' },
    { id: 'dice', name: '🎲 混沌', x: 60, y: 150, countersName: '🟫 磐石', countersId: 'mud', vulnerabilityName: '🩸 血影', vulnerabilityId: 'vampire', lore: '混沌秩序高度不可測，而土石之剛烈也難敵無限概率的干涉與崩解；但混沌之機理又極易被血影吞噬。' }
  ];

  const selectedPentagram = pentagramElements.find(p => p.id === activeElement) || pentagramElements[0];

  const arsenalItems = [
    { 
      name: '黏濁泥濘沼澤', 
      english: 'Viscous Mud Puddle', 
      type: 'Terrain Hazard Spot', 
      icon: Layers, 
      color: 'from-amber-600/10 to-yellow-600/5 border-amber-600/40 text-amber-500',
      glow: 'shadow-amber-600/20',
      descId: 'TH-392', 
      desc: '地表因高壓碰撞產生的褐色極重泥區，重力常數在此發生黏滯突變，噴散泥沙流擴散特效。', 
      effect: '敵方球體踏入時被施加 <strong>極度緩速 (Muddy Slow)</strong>，移動速度降至原有速度的 <strong>4% 基礎值</strong> （降速 96% 幾乎完全凍結移動）。', 
      spawn: '由「泥土 (Mud)」球體施放，常態維持 0.2 秒，若為小技能則維持 1.2 秒。',
      stats: { radius: '38px', mass: '99.0kg', elasticity: '0.04 (黏結摩擦)', gravityWeight: '0.0x' }
    },
    { 
      name: '熾熱高壓火焰盾', 
      english: 'Scorching Fire Shield', 
      type: 'Active Burn Barrier', 
      icon: Flame, 
      color: 'from-orange-500/10 to-red-500/5 border-orange-500/40 text-orange-500',
      glow: 'shadow-orange-500/20',
      descId: 'AB-810', 
      desc: '圍繞球體高速盤旋的熾熱火焰圈，具有多層火光翻滾與岩漿高壓向外噴射物理特效。', 
      effect: '對周圍敵方造成多段高頻灼燒傷害，若進入爆燃模式則防壁膨脹至 <strong>2.2 倍</strong> 並造成高熱重度真實傷害。', 
      spawn: '由「烈焰 (Blaze)」球體召喚，碰撞後觸發召喚。常態維持 1.2 秒，爆燃模式 0.4 秒。',
      stats: { radius: '45px', mass: '0.10kg', elasticity: '0.90 (流體阻尼)', gravityWeight: '0.0x' }
    },
    { 
      name: '狂暴氣旋障壁', 
      english: 'Cyclone Forcefield', 
      type: 'Atmospheric Storm Zone', 
      icon: Wind, 
      color: 'from-cyan-500/10 to-blue-500/5 border-cyan-500/40 text-cyan-400',
      glow: 'shadow-cyan-500/20',
      descId: 'AS-901', 
      desc: '淺青色高速狂飆同心旋轉風圈障壁，伴隨強風氣流閃雷粒子包絡全體。', 
      effect: '敵方觸及陷入時受亂流風阻重度干涉（造成風屬性切割傷），在小技能 [強力亂流] 爆發激活時，障壁會額外注入 <strong>3.2 倍強烈排斥作用力</strong>，高速將敵方球體狂暴反彈震開，具有全角色最強橫的擊退戰術。', 
      spawn: '由「風暴 (Lightning)」球體碰撞後在體表膨脹產出。持续時長固定 0.5 秒。',
      stats: { radius: '50px', mass: '0.15kg', elasticity: '3.20 (超高擊退)', gravityWeight: '0.0x' }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-950/95 md:bg-slate-950/80 backdrop-blur-md">
      {/* Fully Responsive Dialog Shell fitting seamlessly on mobile screen sizes */}
      <div className="w-full h-full md:h-[92vh] md:max-h-[900px] md:max-w-6xl md:rounded-3xl border-none md:border md:border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-slate-100 relative">
        
        {/* Futuristic Grid Overlay & Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
        
        {/* Modal dialog core header */}
        <div className="flex items-center justify-between px-4 py-4 md:px-6 md:py-5 border-b border-slate-800/50 bg-slate-950/60 backdrop-blur shrink-0 z-10 w-full">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/5 border border-indigo-500/40 rounded-lg flex items-center justify-center text-indigo-400 shrink-0">
              <BookOpen className="w-4 h-4 animate-pulse" />
            </div>
            <div className="text-left min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black px-2 py-0.5 rounded font-mono tracking-wider">CYBER CODEX</span>
              </div>
              <h2 className="text-sm md:text-base font-black tracking-tight text-slate-100 truncate">
                {inBattle ? '戰局終端 & 物理圖鑑' : '重力對決：太空物理圖鑑'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button 
              onClick={onClose}
              id="close_handbook_button"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 hover:text-white text-slate-400 transition-all cursor-pointer shadow active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Selection controller - Scrollable ribbon with hidden scrollbar for ergonomics */}
        <div className="flex border-b border-indigo-950/40 bg-slate-950/80 px-2 sm:px-4 py-2.5 gap-1.5 overflow-x-auto select-none scrollbar-none flex-nowrap z-10 w-full shrink-0">
          {inBattle && (
            <button
               onClick={() => handleTabClick('controls')}
              id="tab_controls_button"
              className={`px-3 py-2 sm:px-4 sm:py-2 text-[12px] sm:text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 border uppercase tracking-wider ${
                activeTab === 'controls' 
                  ? 'bg-gradient-to-r from-rose-600 to-red-700 border-rose-500 text-white shadow-lg shadow-rose-600/30' 
                  : 'text-rose-400 border-rose-950/30 bg-rose-950/10 hover:bg-rose-950/20'
              }`}
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin-slow animate-pulse" />
              <span>⚙️ 戰局微調</span>
            </button>
          )}

          {[
            { id: 'characters', name: '球體英雄譜', icon: User, color: 'text-indigo-400' },
            { id: 'botanist', name: '綠野植學堂', icon: Activity, color: 'text-emerald-450 text-green-400' },
            { id: 'items', name: '藍圖裝備庫', icon: Gem, color: 'text-amber-400' },
            { id: 'modes', name: '重力與常數', icon: Sliders, color: 'text-cyan-400' },
            { id: 'attributes', name: '五行相剋星軌', icon: Scale, color: 'text-emerald-400' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as TabType)}
              id={`tab_${tab.id}_button`}
              className={`px-3.5 py-2 sm:px-4.5 sm:py-2 text-[12px] sm:text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 border ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 border-indigo-500 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-slate-400 border-transparent bg-transparent hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${tab.color}`} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Multi-tier display Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0 bg-slate-950/30">
          <AnimatePresence mode="wait">
            
            {/* TAB 0: LIVE BATTLE CONTROLS PANEL */}
            {activeTab === 'controls' && inBattle && (
              <motion.div 
                key="controls"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 text-left max-w-4xl mx-auto py-2"
              >
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute right-6 top-6 text-rose-500/10 pointer-events-none">
                    <Settings className="w-32 h-32 stroke-width-[0.8]" />
                  </div>
                  <span className="text-[10px] font-black text-rose-400 font-mono tracking-widest uppercase block mb-1">
                    ⚡ REALTIME PHYSICAL QUANTUM TELEMETRY
                  </span>
                  <h3 className="text-sm font-black text-slate-100 mb-1.5">戰場引力速度超頻調控中樞</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    在這裡您可以實時控制戰場的物理速率。調低速率可以進入「極限流光回溯時間」以便預判反彈拐角；調快速率可以使物理過載、完成急速競技結算。
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-slate-900/30 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between gap-5">
                    <div className="text-left">
                      <span className="text-[9px] font-mono font-black text-slate-500 block mb-1">COGNITIVE EMULATOR STATE</span>
                      <h4 className="text-xs font-black text-slate-200 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span>對決時間常數掛起 (SUSPEND TIME)</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        完全掛起物理世界和剛體運動計算，讓時空在此刻定格。您可以在此時精確測量雙球微觀夾角。
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        try { audio.playSelect(); } catch(err){}
                        if (setIsPlaying) setIsPlaying(!isPlaying);
                      }}
                      className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-black text-xs border transition-all cursor-pointer ${
                        isPlaying 
                          ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900' 
                          : 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-slate-300" />
                          <span>掛起時空波角 (FREEZE PROCESS)</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white animate-pulse" />
                          <span>恢復時空推演 (RECOVERY FLOW)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-900/30 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between gap-5">
                    <div className="text-left">
                      <span className="text-[9px] font-mono font-black text-slate-500 block mb-1">ACCELERATOR CONTROLS</span>
                      <h4 className="text-xs font-black text-slate-200 flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-cyan-400" />
                        <span>時空重力彈射流速檔位</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        調整本尊對決的沙盤時間流逝尺度。從慢動作微觀推演（0.50x）到極速高爆超頻（2.50x）。
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                        <span>時間拉伸倍數 (FLOW SPEED)</span>
                        <span className="text-cyan-400 font-black">{battleSpeed.toFixed(2)}x</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-900">
                        {([0.5, 1.0, 1.5, 2.0] as const).map(speed => (
                          <button
                            key={speed}
                            onClick={() => {
                              try { audio.playSelect(); } catch(err){}
                              if (setBattleSpeed) setBattleSpeed(speed);
                            }}
                            className={`py-2 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                              battleSpeed === speed 
                                ? 'bg-cyan-600 text-slate-100 shadow' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                          >
                            {speed.toFixed(1)}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-rose-950/10 border border-rose-500/20 p-4 rounded-xl flex items-start gap-3 mt-4">
                  <div className="p-1 px-1.5 bg-rose-500/20 text-rose-400 font-bold font-mono text-[9px] rounded-md mt-0.5 uppercase">ADMIN</div>
                  <div className="text-xs text-slate-400">
                    <span className="text-rose-400 font-extrabold">戰術警告：</span>調整戰役速率會深刻影響您的剛體力學反應手速需求！在高速檔位下，請密切提防貪食蛇環節、引力黑洞以及蒼溟重水的大面積包抄襲擊。
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 1: PREMIUM COMPREHENSIVE CHARACTER BOOK */}
            {activeTab === 'characters' && (
              <motion.div 
                key="characters"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid md:grid-cols-12 gap-6 items-stretch h-full"
              >
                {/* Responsive Mobile Layout Header Selector - Pinned Sticky on mobile, hidden on md Desktop */}
                <div className="md:hidden col-span-12 flex flex-col bg-slate-950/95 border-b border-indigo-950/40 p-3 shrink-0 sticky top-0 z-30 shadow-md backdrop-blur-md w-full">
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-widest pl-1 mb-2.5 block text-left">
                    🌌 星艦球形英雄目錄 (水平滑動切換)
                  </span>
                  <div className="flex flex-row gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-none select-none text-left snap-x scroll-smooth">
                    {CHARACTERS.map((char, index) => {
                      const isCur = index === selectedCharIndex;
                      const charTheme = getElementDetails(char.id, char.color);
                      return (
                        <button
                          key={char.id}
                          onClick={() => handleCharClick(index)}
                          className={`flex flex-col items-center justify-center gap-2 p-2 rounded-xl border text-center transition-all w-[74px] h-[74px] flex-shrink-0 snap-center cursor-pointer relative ${
                            isCur 
                              ? 'bg-slate-900 border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.3)]' 
                              : 'bg-slate-950 border-slate-850/80 text-slate-400 hover:bg-slate-900'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${
                            isCur 
                              ? 'bg-slate-950 border-indigo-500/30' 
                              : 'bg-slate-900 border-slate-850'
                          }`}>
                            <CharacterVectorIcon characterId={char.id} className="w-7 h-7" />
                          </div>
                          <span className="text-[10px] font-black text-slate-200 truncate w-full block leading-none">
                            {char.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Left side list column - Desktop layout */}
                <div className="hidden md:flex md:col-span-4 flex-col h-[600px] border border-slate-850 bg-slate-950/80 rounded-2.5xl p-3.5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 text-slate-700/20 pointer-events-none">
                    <Cpu className="w-16 h-16 stroke-width-[0.5]" />
                  </div>
                  <span className="text-[9px] font-mono font-black text-indigo-400 uppercase tracking-widest pl-1 mb-3.5 block text-left">
                    🌌 星艦球形英雄清單 ({CHARACTERS.length} UNITS)
                  </span>
                  
                  {/* Customized modern scroll list */}
                  <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1 no-scrollbar select-none text-left">
                    {CHARACTERS.map((char, index) => {
                      const isCur = index === selectedCharIndex;
                      const charTheme = getElementDetails(char.id, char.color);
                      return (
                        <button
                          key={char.id}
                          onClick={() => handleCharClick(index)}
                          className={`flex items-center gap-3.5 p-3 rounded-2xl border text-left transition-all w-full cursor-pointer relative group ${
                            isCur 
                              ? 'bg-slate-900 border-indigo-500/60 shadow-[0_0_15px_rgba(99,102,241,0.15)] bg-gradient-to-r from-slate-900 to-indigo-950/20' 
                              : 'bg-slate-950/50 border-slate-900/80 hover:bg-slate-900/60 hover:border-slate-800'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                            isCur 
                              ? 'bg-slate-950 border-indigo-500/30' 
                              : 'bg-slate-900 border-slate-850 text-slate-400'
                          }`}>
                            <CharacterVectorIcon characterId={char.id} className="w-7.5 h-7.5" />
                          </div>
                          
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-[12px] font-black text-slate-200 truncate group-hover:text-slate-100">{char.name}</h4>
                              <span className="text-[8px] font-mono font-black tracking-wider uppercase opacity-55 whitespace-nowrap scale-90" style={{ color: charTheme.themeColor }}>
                                {char.roleName.substring(0, 3)}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-[9px] scale-90 origin-left opacity-75 font-bold" style={{ color: charTheme.themeColor }}>
                                {charTheme.element}
                              </span>
                              {/* Simple mini-graphs */}
                              <div className="flex gap-0.5 items-end h-2 w-10">
                                <span className="w-full bg-slate-800 rounded-px h-full overflow-hidden relative">
                                  <span className="absolute top-0 left-0 bottom-0 bg-emerald-500 rounded-px" style={{ width: `${Math.min(100, (char.initialHp / 310) * 100)}%` }} />
                                </span>
                                <span className="w-full bg-slate-800 rounded-px h-full overflow-hidden relative">
                                  <span className="absolute top-0 left-0 bottom-0 bg-sky-400 rounded-px" style={{ width: `${Math.min(100, (char.speed / 1.4) * 100)}%` }} />
                                </span>
                              </div>
                            </div>
                          </div>

                          {isCur && (
                            <motion.div 
                              layoutId="activeSideBorder" 
                              className="absolute right-3.5 w-1.5 h-1.5 rounded-full" 
                              style={{ backgroundColor: charTheme.themeColor }} 
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right detailed dashboard column */}
                <div className="col-span-12 md:col-span-8 flex flex-col gap-5">
                  
                  {/* CARD 1: LARGE HERO LORE BIO CARD */}
                  <div className="bg-slate-900/30 border border-slate-850 rounded-2.5xl p-5.5 relative overflow-hidden">
                    <div className="absolute -right-12 -top-12 w-48 h-48 blur-[80px] opacity-20 rounded-full" style={{ backgroundColor: detail.themeColor }} />
                    <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: detail.themeColor }} />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {selectedChar.id === 'angel' ? (
                          /* SPECIAL ULTRA-HIGH QUALITY SPOTLIGHT AVATAR & BORDER PREVIEW */
                          <div className="relative shrink-0 select-none">
                            {/* Rotating gold flowing gradient rim border framing the card */}
                            <div className="absolute -inset-0.5 rounded-2xl bg-[conic-gradient(from_0deg,#e5e7eb,#fbb34d,#e5e7eb,#1e293b)] animate-[spin_8s_linear_infinite] opacity-70 p-[1.5px]" />
                            {/* Inner background container casing */}
                            <div 
                              className="w-16 h-16 rounded-2xl bg-slate-950 relative flex items-center justify-center border border-slate-800 p-0.5 overflow-hidden cursor-pointer"
                              style={{ boxShadow: '0 0 16px rgba(251, 191, 36, 0.25)' }}
                              onClick={triggerAngelClick}
                            >
                              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-950 to-amber-950/25 opacity-90" />
                              <CharacterVectorIcon 
                                characterId="angel" 
                                className="w-13 h-13 relative z-10" 
                                stacks={angelPreviewStacks}
                                gesture={angelPreviewGesture}
                                interactionState={angelInteractionState}
                              />
                            </div>
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1 text-[6.5px] rounded bg-amber-500 text-slate-950 font-mono font-black tracking-widest uppercase">
                              TAP
                            </span>
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-950 border border-slate-800 shadow-xl" style={{ boxShadow: `0px 8px 24px ${detail.themeColor}20` }}>
                            <CharacterVectorIcon characterId={selectedChar.id} className="w-11 h-11" />
                          </div>
                        )}
                        
                        <div className="text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-black text-slate-100">{selectedChar.name}</h3>
                            <span className="text-[9px] px-2.5 py-0.5 rounded-full font-black font-mono tracking-wider" style={{ backgroundColor: `${detail.themeColor}15`, color: detail.themeColor, border: `1px solid ${detail.themeColor}30` }}>
                              {detail.element}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-bold tracking-tight mt-0.5">{selectedChar.title}</p>
                        </div>
                      </div>

                      <div className="bg-slate-950/85 px-4 py-2 border border-slate-850/80 rounded-xl text-left sm:text-right shrink-0">
                        <p className="text-[8px] text-slate-500 font-mono font-black uppercase tracking-widest">TACTICAL CLASS</p>
                        <p className="text-[11px] font-black mt-0.5" style={{ color: detail.themeColor }}>{selectedChar.roleName} / SPHERE</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-850/50 text-left flex flex-col gap-3">
                      <div>
                        <span className="text-[8px] font-mono text-slate-500 font-black tracking-widest block">DECRYPTED VOICE DATA</span>
                        <p className="text-xs text-indigo-400/90 italic font-black leading-relaxed mt-1 block">
                          "{selectedChar.quotes.select}"
                        </p>
                      </div>

                      {/* --- SPECIAL INTERACTIVE EMBEDDED CONTROLS FOR WAR ANGEL AVATAR --- */}
                      {selectedChar.id === 'angel' && (
                        <div className="bg-slate-950/40 border border-amber-500/20 rounded-xl p-3 flex flex-col gap-2.5 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-amber-400 font-black tracking-wider flex items-center gap-1">
                              <Sliders className="w-3.5 h-3.5 text-amber-400" />
                              <span>戰鬥天使 • 手機圖鑑大頭貼與肢體調配倉</span>
                            </span>
                            <span className="text-[8.5px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold font-mono">
                              聖光蓄能: {angelPreviewStacks}層
                            </span>
                          </div>

                          <div className="relative">
                            <input 
                              type="range" 
                              min="0" 
                              max="5" 
                              value={angelPreviewStacks} 
                              onChange={(e) => {
                                try { audio.playSelect(); } catch(err){}
                                setAngelPreviewStacks(parseInt(e.target.value));
                              }}
                              className="w-full accent-amber-500 cursor-pointer h-1 bg-slate-850 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[7px] text-slate-500 font-mono mt-1 font-bold select-none">
                              <span>0層 (金紋素雅)</span>
                              <span>1~4層 (光核加速)</span>
                              <span>滿5層 (黃金溢彩+流轉光環)</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-850/40 pt-2">
                            <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-850/50">
                              <span className="text-[7.5px] text-slate-500 font-mono font-bold px-1 select-none">肢體動作:</span>
                              {[
                                { id: 'idle', label: '閒置' },
                                { id: 'moving', label: '行進' },
                                { id: 'precast', label: '蓄力' },
                                { id: 'postcast', label: '釋放' }
                              ].map((g) => (
                                <button
                                  key={g.id}
                                  onClick={() => {
                                    try { audio.playSelect(); } catch(err){}
                                    setAngelPreviewGesture(g.id as any);
                                  }}
                                  className={`text-[8.5px] px-2 py-0.5 rounded font-black border transition-all ${
                                    angelPreviewGesture === g.id 
                                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                                      : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
                                  }`}
                                >
                                  {g.label}
                                </button>
                              ))}
                            </div>

                            <div className="flex gap-1.5 shrink-0">
                              <button 
                                onClick={triggerAngelClick}
                                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[8.5px] font-black text-indigo-400 px-2 py-1 rounded-lg flex items-center gap-1 transition-all"
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>點擊光效</span>
                              </button>
                              <button 
                                onClick={triggerAngelHit}
                                className="bg-slate-900 hover:bg-red-950/10 border border-slate-800 text-[8.5px] font-black text-red-400 px-2 py-1 rounded-lg flex items-center gap-1 transition-all hover:border-red-500/20"
                              >
                                <ShieldAlert className="w-2.5 h-2.5" />
                                <span>模擬受擊</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MAIN INTEL GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                    
                    {/* SIMULATOR AND HIGH-END SWITCH COCKPIT */}
                    <div className="md:col-span-7 flex flex-col gap-4 bg-slate-950/70 border border-slate-850 rounded-2.5xl p-4">
                      
                      {/* Interactive Damage Meter & Visual Kinetic HUD (No redundant animations) */}
                      <div className="flex flex-col gap-3">
                        <div className="text-[11px] md:text-xs font-mono font-black bg-slate-900/60 border border-slate-850 p-2 px-3 rounded-xl flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-indigo-400">
                            <Activity className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                            <span>量子招式威力與能量判定 (QUANTUM DAMAGE ENERGY HUD)</span>
                          </span>
                          <span className="text-slate-200 font-extrabold text-[10px] bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded">
                            {selectedSkillType === 'passive' ? '被動衝擊' : selectedSkillType === 'active' ? '主動彈射' : '終極奧義'}
                          </span>
                        </div>

                        {/* Interactive Visual Damage & Impact Indicator Deck */}
                        <div className="p-4 rounded-2xl border border-slate-850/80 bg-slate-950/80 relative overflow-hidden flex flex-col gap-3.5 shadow-inner">
                          {/* Ambient Elements Overlay Glow */}
                          <div className="absolute -left-10 -bottom-10 w-32 h-32 blur-[40px] opacity-10 rounded-full" style={{ backgroundColor: detail.themeColor }} />
                          
                          {/* Large Calibrated Damage Output Gauge */}
                          <div className="flex items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-850/50 relative">
                            <div className="text-left">
                              <span className="text-[9px] font-mono text-slate-500 font-black block tracking-wider">預估極限碰撞釋放傷害</span>
                              <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-2xl font-black font-mono tracking-tight" style={{ color: detail.themeColor }}>
                                  {((
                                    selectedSkillType === 'passive'
                                      ? (selectedChar.id === 'vampire' ? 1.80 : selectedChar.id === 'mud' ? 2.00 : selectedChar.id === 'blaze' ? 1.50 : 1.2)
                                      : selectedSkillType === 'active'
                                        ? (selectedChar.id === 'vampire' ? 5.52 : selectedChar.id === 'mud' ? 2.05 : selectedChar.id === 'blaze' ? 3.00 : 2.1)
                                        : (selectedChar.id === 'vampire' ? 3.50 : selectedChar.id === 'mud' ? 4.00 : selectedChar.id === 'blaze' ? 4.50 : 3.6)
                                  ) * skillPower * (counterType === 'counter' ? 1.3 : counterType === 'countered' ? 0.8 : 1.0)).toFixed(1)}
                                </span>
                                <span className="text-xs text-slate-400 font-bold uppercase font-mono">⚡ HP</span>
                              </div>
                            </div>

                            <div className="text-right flex flex-col items-end gap-1 shrink-0">
                              <span className="text-[9px] font-mono font-black text-slate-500 block tracking-wider">力學相性增幅狀態</span>
                              <div className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                                counterType === 'counter' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                  : counterType === 'countered' 
                                    ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                                    : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}>
                                <Crosshair className="w-3 h-3" />
                                <span>{counterType === 'counter' ? '剋制 (+30%)' : counterType === 'countered' ? '被剋 (-20%)' : '完美平穩'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Scaled Gradient Energy Bar */}
                          <div className="space-y-1 text-left">
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                              <span>威力輸出刻度 (DAMAGE INTENSITY METER)</span>
                              <span className="font-bold flex items-center gap-1 text-[11px]">
                                <FlameKindling className="w-3.5 h-3.5 text-rose-450 text-rose-400" />
                                <span style={{ color: detail.themeColor }}>當前倍率：{((selectedSkillType === 'passive' ? 1.0 : selectedSkillType === 'active' ? 2.2 : 3.5) * skillPower).toFixed(2)}x</span>
                              </span>
                            </div>
                            <div className="h-3 bg-slate-900 rounded-lg p-0.5 relative flex items-center border border-slate-850/60 overflow-hidden">
                              {/* 3-Color visual gradient segment */}
                              <div className="absolute inset-y-0.5 left-0.5 rounded bg-gradient-to-r from-emerald-500 via-amber-450 via-amber-400 to-rose-500 transition-all duration-300" 
                                   style={{ 
                                     width: `${Math.min(100, (
                                       ((selectedSkillType === 'passive' ? 1.80 : selectedSkillType === 'active' ? 5.52 : 4.5) * skillPower) / 10
                                     ) * 100)}%` 
                                   }} 
                              />
                            </div>
                            <div className="flex justify-between text-[8px] text-slate-550 text-slate-500 font-mono font-bold">
                              <span>輕微碰撞 (LOW)</span>
                              <span>標準戰域 (MID)</span>
                              <span>過載核裂 (EXTREME)</span>
                            </div>
                          </div>

                          {/* Skill Specific Rigid Mechanics Parameters */}
                          <div className="grid grid-cols-3 gap-2 text-left mt-0.5">
                            {[
                              { label: '衝量傳導級 (Kinetic Push)', val: selectedSkillType === 'passive' ? '1.2x 彈退' : selectedSkillType === 'active' ? '2.5x 擊飛' : '4.0x 引重', color: 'text-indigo-400', progress: selectedSkillType === 'passive' ? 30 : selectedSkillType === 'active' ? 70 : 100 },
                              { label: '釋能範圍半徑 (Area Radius)', val: selectedSkillType === 'passive' ? '40px 體表' : selectedSkillType === 'active' ? '120px 區域' : '全屏 突擊', color: 'text-cyan-400', progress: selectedSkillType === 'passive' ? 20 : selectedSkillType === 'active' ? 65 : 100 },
                              { label: '冷卻蓄能回轉 (Cooldown Speed)', val: `${((10 - (hasteCd / 10)) * (selectedSkillType === 'passive' ? 0 : selectedSkillType === 'active' ? 1.0 : 1.8)).toFixed(1)}秒`, color: 'text-emerald-400', progress: Math.min(100, 100 - hasteCd) }
                            ].map((p, idx) => (
                              <div key={idx} className="bg-slate-905 bg-slate-900/40 p-2.5 rounded-xl border border-slate-850/50 flex flex-col justify-between">
                                <span className="text-[8px] font-mono text-slate-500 font-black tracking-tight leading-tight block mb-1">{p.label}</span>
                                <div>
                                  <span className={`text-[11px] font-black font-sans ${p.color}`}>{p.val}</span>
                                  <div className="h-1 bg-slate-950 rounded-full mt-1.5 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: 'currentColor' }} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* REDESIGNED HIGH-TECH SKILL TABS DECK */}
                      <div className="space-y-2.5 text-left">
                        <span className="text-[8.5px] font-black text-slate-500 font-mono tracking-widest block">
                          ⚡ 奧義招式切換與實戰演武觸發
                        </span>

                        <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-900">
                          {[
                            { id: 'passive', label: '被動', sub: '被動干涉', icon: Sword, color: 'text-indigo-400', activeBg: 'bg-indigo-500/15 border-indigo-500/45 text-indigo-400' },
                            { id: 'active', label: '主動', sub: '特殊戰術', icon: Zap, color: 'text-amber-400', activeBg: 'bg-amber-500/15 border-amber-500/45 text-amber-400' },
                            { id: 'ultimate', label: '奧義', sub: '終極奧義', icon: Sparkles, color: 'text-purple-400', activeBg: 'bg-purple-500/15 border-purple-500/45 text-purple-400' }
                          ].map(tab => {
                            const isSel = selectedSkillType === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => handleSkillTypeClick(tab.id as any)}
                                className={`py-2 px-1.5 rounded-lg border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-center font-black ${
                                  isSel 
                                    ? tab.activeBg + ' shadow-[0_0_10px_rgba(99,102,241,0.08)]' 
                                    : 'bg-slate-900/40 border-transparent text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                                }`}
                              >
                                <tab.icon className="w-3.5 h-3.5" />
                                <span className="text-[11px] block leading-none">{tab.label}</span>
                                <span className="text-[8px] opacity-60 font-medium block leading-none scale-90">{selectedChar.id === 'vampire' && tab.id === 'passive' ? '吸血' : tab.sub}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* ACTIVE DETAILED TEH CONSOLE SCREEN */}
                      <div className="bg-slate-950 border border-slate-900/85 p-3 px-3.5 rounded-2xl text-left select-all">
                        {(() => {
                          const activeSkillDetails = 
                            selectedSkillType === 'passive' ? { name: selectedChar.skillName, desc: selectedChar.detailedDesc, tag: '⚔️ 基礎普攻與碰撞被動' } :
                            selectedSkillType === 'active' ? { name: selectedChar.subSkillName || '特殊戰術一技能', desc: selectedChar.subSkillDesc, tag: '⚡ 核心戰術主動技能' } :
                            { name: selectedChar.skill2Name || '終極大招二技能', desc: selectedChar.skill2DetailedDesc || selectedChar.skill2Desc, tag: '🔮 終極奧義爆能技能' };
                          
                          return (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-1 border-b border-indigo-950/40 pb-1.5 mb-1.5">
                                <span className="text-[9.5px] font-bold text-indigo-400/85 tracking-widest uppercase">{activeSkillDetails.tag}</span>
                                <span className="text-[7.5px] font-mono text-slate-500 font-extrabold bg-slate-900 p-0.5 px-1.5 rounded border border-slate-850">SYSTEM CALIBRATED</span>
                              </div>
                              <h4 className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-violet-400" />
                                <span>{activeSkillDetails.name}</span>
                              </h4>
                              <p className="text-[11px] text-slate-350 leading-relaxed font-sans">{activeSkillDetails.desc}</p>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="flex items-center justify-between gap-2 text-[9px] text-slate-500 italic mt-0.5">
                        <span>💡 二維物理動態碰撞演算中</span>
                        <button
                          onClick={() => {
                            try { audio.playSelect(); } catch(err){}
                            // Reload char simulation to restart
                            const idx = selectedCharIndex;
                            setSelectedCharIndex(idx);
                          }}
                          className="flex items-center gap-1 font-mono text-[9px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 p-1 px-2.5 rounded-lg font-black hover:bg-indigo-500/20 transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>重播模擬 (REPLAY)</span>
                        </button>
                      </div>
                    </div>

                    {/* SPEC SPECIFICATIONS & TUNING RIG */}
                    <div className="md:col-span-5 flex flex-col gap-4">
                      
                      {/* Real-time Attribute Radar Chart Visual */}
                      <AttributeRadarChart character={selectedChar} ratings={ratings} />
                      
                      {/* Radar Specifications panel */}
                      <div className="bg-gradient-to-b from-slate-900/30 to-slate-950 border border-slate-850 rounded-2.5xl p-4 flex flex-col gap-3">
                        <span className="text-[9px] font-black text-slate-500 font-mono tracking-widest block border-b border-slate-850 pb-2 uppercase text-left">
                          物理雷達解析 (SPECIFICATIONS)
                        </span>

                        <div className="space-y-2.5 text-left">
                          {[
                            { label: '初始最大外殼生命 (HP)', value: `${selectedChar.initialHp} HP`, rating: ratings.hp, color: 'bg-emerald-500' },
                            { label: '起步速度物理常系', value: `${(selectedChar.speed * 100).toFixed(0)}%`, rating: ratings.speed, color: 'bg-sky-400' },
                            { label: '對物理牆面衝質量 (MASS)', value: `${(selectedChar.mass * 100).toFixed(0)}%`, rating: ratings.mass, color: 'bg-amber-500' },
                            { label: '關能場干涉奧義域', value: ratings.area, rating: 85, color: 'bg-indigo-500/80' }
                          ].map((bar, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-[10px] text-slate-400">
                                <span>{bar.label}</span>
                                <span className="text-slate-200 font-bold font-mono">{bar.value}</span>
                              </div>
                              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850/30">
                                <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.rating}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center text-[10px] border-t border-slate-850/50 pt-3 font-mono mt-1">
                          <div className="bg-slate-950 border border-slate-900 p-1.5 rounded-xl">
                            <span className="text-slate-500 block text-[8px] uppercase tracking-wide">操控精密度</span>
                            <span className="text-amber-400 font-black text-[11px]">{ratings.difficulty}%</span>
                          </div>
                          <div className="bg-slate-950 border border-slate-900 p-1.5 rounded-xl">
                            <span className="text-slate-500 block text-[8px] uppercase tracking-wide">戰略策應級</span>
                            <span className="text-indigo-400 font-black text-[11px]">{ratings.strategy}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Quantum Tuning panel */}
                      <div className="bg-slate-900/25 border border-slate-850 rounded-2.5xl p-4 flex flex-col gap-3.5">
                        <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                          <div className="flex items-center gap-1.5 text-left">
                            <Sliders className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-black text-slate-200">
                              常數核微調器 (CONTROL RIG)
                            </span>
                          </div>
                          <span className="text-[7.5px] bg-indigo-500/10 text-indigo-100 border border-indigo-500/25 px-2 py-0.5 rounded-full font-mono font-black">ACTIVE</span>
                        </div>

                        <div className="space-y-3.5">
                          {/* Power Factor Slider */}
                          <div className="space-y-1.5 text-left">
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                              <span>威力係數</span>
                              <span className="text-amber-400 font-bold">{(skillPower * 100).toFixed(0)}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0.5" 
                              max="2.0" 
                              step="0.1" 
                              value={skillPower} 
                              onChange={(e) => {
                                setSkillPower(parseFloat(e.target.value));
                                try { audio.playSelect(); } catch(err){}
                              }}
                              className="w-full accent-indigo-500 bg-slate-950 rounded-lg appearance-none h-1.5 cursor-pointer"
                            />
                          </div>

                          {/* Haste cd reduction */}
                          <div className="space-y-1.5 text-left">
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                              <span>技能冷卻縮減</span>
                              <span className="text-emerald-400 font-bold">-{hasteCd}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="50" 
                              step="5" 
                              value={hasteCd} 
                              onChange={(e) => {
                                setHasteCd(parseInt(e.target.value));
                                try { audio.playSelect(); } catch(err){}
                              }}
                              className="w-full accent-emerald-500 bg-slate-950 rounded-lg appearance-none h-1.5 cursor-pointer"
                            />
                          </div>

                          {/* Affinity select button trigger */}
                          <div className="space-y-1.5 text-left">
                            <span className="text-[10px] text-slate-400 block font-mono">五行屬性相剋常數</span>
                            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-900">
                              {(['counter', 'neutral', 'countered'] as const).map(type => (
                                <button
                                  key={type}
                                  onClick={() => {
                                    setCounterType(type);
                                    try { audio.playSelect(); } catch(err){}
                                  }}
                                  className={`py-1 text-[9px] font-black rounded-lg transition-all cursor-pointer ${
                                    counterType === type 
                                      ? 'bg-indigo-600 text-white shadow' 
                                      : 'text-slate-500 hover:text-slate-350 hover:bg-slate-900/50'
                                  }`}
                                >
                                  {type === 'counter' ? '剋制' : type === 'neutral' ? '中性' : '被剋'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Dynamics Predictor Formula */}
                        <div className="bg-slate-950 p-2.5 rounded-xl text-[10px] font-mono text-slate-400 flex flex-col gap-1 border border-slate-900 shadow-inner text-left">
                          <span className="text-slate-500 flex items-center gap-1 shrink-0 font-bold text-[8.5px]">
                            <Scale className="w-3.5 h-3.5 text-indigo-400" />
                            <span>物理動量波粒威力爆發：</span>
                          </span>
                          <div className="flex items-center gap-1 overflow-x-auto select-all whitespace-nowrap scrollbar-none font-black text-[10.5px]">
                            <span className="text-slate-200">
                              {selectedSkillType === 'passive'
                                ? (selectedChar.id === 'vampire' ? '1.80' : selectedChar.id === 'mud' ? '2.00' : selectedChar.id === 'blaze' ? '1.50' : '1.20')
                                : selectedSkillType === 'active'
                                  ? (selectedChar.id === 'vampire' ? '5.52' : selectedChar.id === 'mud' ? '2.05' : selectedChar.id === 'blaze' ? '3.00' : '2.10')
                                  : (selectedChar.id === 'vampire' ? '3.50' : selectedChar.id === 'mud' ? '4.00' : selectedChar.id === 'blaze' ? '4.50' : '3.60')
                              }
                            </span>
                            <span>×</span>
                            <span className="text-amber-400">{skillPower.toFixed(1)}</span>
                            <span>×</span>
                            <span className="text-emerald-400">
                              {counterType === 'counter' ? '1.30' : counterType === 'countered' ? '0.80' : '1.00'}
                            </span>
                            <span>➔</span>
                            <span className="text-rose-450 text-rose-400 bg-rose-950/20 border border-slate-900 px-1.5 rounded leading-none py-0.5">
                              -{((
                                selectedSkillType === 'passive'
                                  ? (selectedChar.id === 'vampire' ? 1.80 : selectedChar.id === 'mud' ? 2.00 : selectedChar.id === 'blaze' ? 1.50 : 1.2)
                                  : selectedSkillType === 'active'
                                    ? (selectedChar.id === 'vampire' ? 5.52 : selectedChar.id === 'mud' ? 2.05 : selectedChar.id === 'blaze' ? 3.00 : 2.1)
                                    : (selectedChar.id === 'vampire' ? 3.50 : selectedChar.id === 'mud' ? 4.00 : selectedChar.id === 'blaze' ? 4.50 : 3.6)
                              ) * skillPower * (counterType === 'counter' ? 1.3 : counterType === 'countered' ? 0.8 : 1.0)).toFixed(1)} HP
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* LORE STORIES */}
                  {selectedChar.story && (
                    <div className="p-5 bg-slate-900/20 border border-slate-850 rounded-2.5xl relative overflow-hidden text-left">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                      <span className="text-[10px] font-bold text-indigo-400 tracking-wider block mb-2.5">📜 星系深邃機密報告</span>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-mono select-all bg-slate-950/50 p-4 rounded-xl border border-slate-900 whitespace-pre-line leading-relaxed">
                        {selectedChar.story}
                      </p>
                    </div>
                  )}

                  {/* DIALOGUES CODES */}
                  <div className="p-5 bg-slate-900/20 border border-slate-850 rounded-2.5xl relative overflow-hidden text-left mb-2">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-400 tracking-wider block mb-3">💬 專屬作戰台詞語音</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                      {[
                        { title: '登場召喚', val: selectedChar.quotes.select, col: 'text-emerald-400', iconBg: 'bg-emerald-500/10' },
                        { title: '特種戰術', val: selectedChar.quotes.subSkill, col: 'text-amber-400', iconBg: 'bg-amber-500/10' },
                        { title: '軀殼解體', val: selectedChar.quotes.defeat, col: 'text-red-400', iconBg: 'bg-red-500/10' },
                        { title: '奧義凱旋', val: selectedChar.quotes.win || '承讓，引力軌域之推演終歸完美。', col: 'text-indigo-400', iconBg: 'bg-indigo-500/10' }
                      ].map((q, qidx) => (
                        <div key={qidx} className="bg-slate-950/70 p-3 rounded-2xl border border-slate-900 flex flex-col gap-1.5 hover:border-slate-800 transition-all group">
                          <span className="text-[8.5px] font-black text-slate-500 font-mono flex items-center gap-1.5">
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center border border-slate-900 ${q.iconBg}`}>
                              <Volume2 className={`w-3.5 h-3.5 ${q.col} group-hover:scale-110 transition-transform`} />
                            </span>
                            <span>{q.title}</span>
                          </span>
                          <p className="text-[11px] text-slate-350 italic font-medium pl-1 leading-normal">"{q.val}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB: BOTANIST GREEN ACADEMY */}
            {activeTab === 'botanist' && (
              <motion.div
                key="botanist-academy"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="space-y-6 text-left max-w-5xl mx-auto py-1"
              >
                {/* Header terminal decorative panel */}
                <div className="bg-gradient-to-r from-emerald-950/40 via-slate-905 to-indigo-950/20 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-emerald-950/10">
                  <div className="absolute right-4 top-4 text-emerald-500/5 pointer-events-none">
                    <Activity className="w-36 h-36" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-350 border border-emerald-500/30 font-black px-2 py-0.5 rounded tracking-wider">🌱 SUMMONER CLASS</span>
                        <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-black px-2 py-0.5 rounded tracking-wider">NATURAL CODE</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-100 flex items-center gap-2">
                        植物學家 • 綠野植學堂 <span className="text-emerald-450 text-green-450 text-sm font-normal">Botanist Nature-Symphony Codex</span>
                      </h3>
                      <p className="text-xs text-slate-450 text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                        植物學家是以<strong>生態共生</strong>為核心的頂級策略召喚英雄。她能編寫自然能量代碼，培育出具備強力減速、高頻毒孢、遠程烈陽穿透的三種自然戰鬥植物。透過在現場編織<strong>「根鬚禁錮」</strong>與<strong>「瘋狂生長」</strong>等各層級交互組合，築起堅實、具備高回血回能回饋的防守壁壘。
                      </p>
                    </div>
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 shrink-0 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg shadow-inner">🌱</div>
                      <div className="text-left">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">SP 播灑能量</div>
                        <div className="text-base font-black text-emerald-400 mt-0.5">每株一律 25 SP</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 1: Detailed Botanic Mimicry Stats Cards (Bento Grid) */}
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-emerald-550 bg-green-500 rounded-sm"></span>
                    植物召喚物名錄與精準數據 (Summoned Plants Blueprint & Core Stats)
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* card 1: Spore Flower */}
                    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 hover:border-pink-500/40 rounded-2xl p-5 relative overflow-hidden transition-all shadow group">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-pink-500/10 transition-all"></div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 font-bold">🌸</div>
                          <div>
                            <h5 className="text-xs font-black text-slate-200">毒孢花 Spore Flower</h5>
                            <span className="text-[9px] text-pink-400 font-mono font-medium">Venom Spore Cannon</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-black text-pink-400 bg-pink-500/10 px-1.5 py-0.5 border border-pink-500/20 rounded">
                          25 SP
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-4 min-h-[36px]">
                        基本款的高頻孢子植物。能朝進入攻擊範圍的最近敵方生命球連續發射綠色孢子，造成穩定的遠程壓制性傷害。
                      </p>
                      <div className="grid grid-cols-3 gap-2 border-t border-slate-800/60 pt-3">
                        <div className="bg-slate-900/60 border border-slate-800/40 rounded-lg p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">生命 HP</div>
                          <div className="text-xs font-black text-slate-200 mt-0.5">15 點</div>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800/40 rounded-lg p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">基傷 ATK</div>
                          <div className="text-xs font-black text-slate-200 mt-0.5">2.0 / 擊</div>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800/40 rounded-lg p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">射程 Range</div>
                          <div className="text-xs font-black text-slate-200 mt-0.5">135 像素</div>
                        </div>
                      </div>
                      <div className="mt-3 text-[10px] text-pink-305 text-pink-400 font-mono flex justify-between">
                        <span>攻擊冷卻 CD: 1.2s</span>
                        <span>共生加成：攻速+10%</span>
                      </div>
                    </div>

                    {/* card 2: Thorn Bush */}
                    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 hover:border-yellow-500/40 rounded-2xl p-5 relative overflow-hidden transition-all shadow group">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-yellow-500/10 transition-all"></div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold">🍂</div>
                          <div>
                            <h5 className="text-xs font-black text-slate-205 text-slate-200">荊棘叢 Thorn Bush</h5>
                            <span className="text-[9px] text-yellow-405 text-yellow-400 font-mono font-medium">Slowdown Gravity Field</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-black text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 border border-yellow-500/20 rounded">
                          25 SP
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-4 min-h-[36px]">
                        重裝防禦型控場灌木。周遭籠罩落羽，敵方接近時會受到大量毒刺扎傷並附加持續 2 秒的 <strong>30% 嚴重緩速</strong>。
                      </p>
                      <div className="grid grid-cols-3 gap-2 border-t border-slate-800/60 pt-3">
                        <div className="bg-slate-900/60 border border-slate-800/40 rounded-lg p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">生命 HP</div>
                          <div className="text-xs font-black text-slate-200 mt-0.5">25 點</div>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800/40 rounded-lg p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">基傷 ATK</div>
                          <div className="text-xs font-black text-slate-200 mt-0.5">1.5 / 擊</div>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800/40 rounded-lg p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">減速區 Range</div>
                          <div className="text-xs font-black text-slate-200 mt-0.5">120 像素</div>
                        </div>
                      </div>
                      <div className="mt-3 text-[10px] text-yellow-300 font-mono flex justify-between">
                        <span>攻擊冷卻 CD: 1.5s</span>
                        <span>特殊: +30% 緩速阻礙</span>
                      </div>
                    </div>

                    {/* card 3: Solar Sunflower / Vine Shooter */}
                    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-5 relative overflow-hidden transition-all shadow group">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all"></div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">🎋</div>
                          <div>
                            <h5 className="text-xs font-black text-slate-200 font-sans">陽光葵 / 蔓藤射手</h5>
                            <span className="text-[9px] text-emerald-400 font-mono font-medium">Solar Laser Sniper</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20 rounded">
                          25 SP
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-4 min-h-[36px]">
                        超高殺傷力自然狙擊者。會汲取陽光力量發射高聚能綠色烈陽射針，對遠距離目標造成極高傷害，是撕開防線的絕對王牌。
                      </p>
                      <div className="grid grid-cols-3 gap-2 border-t border-slate-800/60 pt-3">
                        <div className="bg-slate-900/60 border border-slate-855 border-slate-800/40 rounded-lg p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">生命 HP</div>
                          <div className="text-xs font-black text-slate-200 mt-0.5">20 點</div>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800/40 rounded-lg p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">基傷 ATK</div>
                          <div className="text-xs font-black text-slate-200 mt-0.5">4.0 / 擊</div>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800/40 rounded-lg p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">射程 Range</div>
                          <div className="text-xs font-black text-slate-200 mt-0.5">150 像素</div>
                        </div>
                      </div>
                      <div className="mt-3 text-[10px] text-emerald-300 font-mono flex justify-between">
                        <span>攻擊冷卻 CD: 1.8s</span>
                        <span>破甲威力：卓越</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Combat Chemistry & Interaction Combo Matrix */}
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-green-500 rounded-sm"></span>
                    多重生態化學反應與核心交互機制 (Ecosystem Symbioses & Multi-Tier Interaction Matrix)
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* card 1: Symbiosis Field */}
                    <div className="bg-slate-900/50 border border-slate-850 border-slate-800/60 rounded-xl p-4.5 space-y-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-base">✨</span>
                        <h5 className="text-xs font-black text-emerald-300">交互機制壹：共生領域 (Symbiotic Feedback Field)</h5>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed font-medium">
                        <li>• <strong className="text-slate-100">領域增幅：</strong>如果植物位於施法者本體 180 像素的「共生範圍」內，植物外緣會覆蓋動態呼吸綠色防護環，並獲得特別加成：<span className="text-emerald-450 text-green-400 font-bold">攻擊速度 +10%</span>、<span className="text-emerald-400 font-bold">防禦/防碰撞減傷 +1</span>。</li>
                        <li>• <strong className="text-slate-100">自我反哺：</strong>植物學家本體站在任意植物 30 像素（1公尺）範圍內，自身生命條閃爍翠綠熒光，生命值獲得 <span className="text-emerald-450 text-green-450 text-green-450 text-green-400 font-black">+2.0 HP/秒</span> 滋養回復，且基礎 SP 自然恢復速度由 4.0/秒 暴漲至 <span className="text-emerald-400 font-black font-mono">6.0 SP/秒</span>！</li>
                      </ul>
                    </div>

                    {/* card 2: Species Synergy */}
                    <div className="bg-slate-900/50 border border-slate-850 border-slate-800/60 rounded-xl p-4.5 space-y-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-base">🧬</span>
                        <h5 className="text-xs font-black text-indigo-300">交互機制貳：多樣植物增幅 (Botanical Biodiversity Spark)</h5>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed font-medium">
                        <li>• <strong className="text-slate-100">物種多樣性：</strong>場上存活的友方召喚物種類越多，全體植物的基礎輸出就更為強勁。</li>
                        <li>• <strong className="text-slate-100">增傷公式：</strong>每多存在 2 種不同種類的植物，場上所有友方召喚物的基礎傷害一律 <span className="text-indigo-400 font-bold">+1.0 點 (最高累計獲得 +2.0 點額外攻擊力增幅)</span>！維持多樣生存是高輸出的絕對核心。</li>
                      </ul>
                    </div>

                    {/* card 3: Root Bind */}
                    <div className="bg-slate-900/50 border border-slate-850 border-slate-800/60 rounded-xl p-4.5 space-y-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-base">🚫</span>
                        <h5 className="text-xs font-black text-yellow-300">一技能搭配：根鬚纏繞與暴擊 (Root Bind Crit Explosion)</h5>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed font-medium">
                        <li>• <strong className="text-slate-100">禁錮鎖敵：</strong>投擲根鬚束縛（20 SP，CD 12s）徹底禁錮最近敵人 1.5 秒，並產生大量深部植物纏繞波紋。</li>
                        <li>• <strong className="text-slate-100">絕對暴擊：</strong>在 1.5 秒纏繞期間內，場上不論哪一株友方植物遠程命中該禁錮目標，全部造成 <span className="text-yellow-400 font-black">1.5倍 絕對暴擊 (Critical Strike)</span>！能配合蔓藤射手或狂暴化造成高能秒殺連段。</li>
                      </ul>
                    </div>

                    {/* card 4: Crazy Growth */}
                    <div className="bg-slate-900/50 border border-slate-850 border-slate-800/60 rounded-xl p-4.5 space-y-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-base">🌸</span>
                        <h5 className="text-xs font-black text-pink-400">二技能搭配：瘋狂生長膨脹 (Crazy Growth Hypercharge)</h5>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed font-medium">
                        <li>• <strong className="text-slate-100">激素爆發：</strong>消耗 30 SP 激發植物激素。戰場所有已落地的召喚物本體尺寸巨幅膨脹 +30%，全身包裹粉色花粉孢子氣旋。</li>
                        <li>• <strong className="text-slate-100">數值爆發：</strong>在 5.0 秒持續時間內，所有植物獲得 <span className="text-pink-400 font-bold">攻擊速度 +30%</span>、<span className="text-pink-400 font-bold">攻擊力 +2.0</span>。刺棘灌木緩速覆蓋範圍與撕裂直徑擴張 30% 至 <span className="text-yellow-400 font-mono font-black">156 像素</span>，將廣闊戰場轉化為致命黏性沼澤。</li>
                      </ul>
                    </div>

                    {/* card 5: Ultimate Berserk */}
                    <div className="bg-slate-900/50 border border-slate-850 border-slate-800/60 rounded-xl p-4.5 space-y-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-base">🌲</span>
                        <h5 className="text-xs font-black text-green-400">終極奧義：森羅咆哮聯控 (Forest Screaming Final Storm)</h5>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed font-medium">
                        <li>• <strong className="text-slate-100">大狂暴光環：</strong>SP 達到 70 時點按或由 AI 自動引爆！使全場植物進入極致狂暴化狀態 6 秒：<span className="text-green-400">攻速額外 +50%</span>、<span className="text-green-400">傷害 +3.0</span>、<span className="text-green-400">防禦物防縮水 +3</span>。</li>
                        <li>• <strong className="text-slate-100">百草奪魂緩速：</strong>狂暴期間植物發射的任何飛針或孢子皆會對目標多重施加 30% 致命緩速。</li>
                        <li>• <strong className="text-slate-100">編碼護盾保護：</strong>本體同時獲得一個 <span className="text-green-300 font-bold font-mono">14 點 HP</span> 能量代碼生命抗打擊護盾，完美瓦解一切試圖切後的貼臉突襲！</li>
                      </ul>
                    </div>

                    {/* card 6: Proactive Seed Sowing */}
                    <div className="bg-slate-900/50 border border-slate-850 border-slate-800/60 rounded-xl p-4.5 space-y-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-base">🌱</span>
                        <h5 className="text-xs font-black text-cyan-300">播種基本攻：播種印記疊加 (Seed Sowing Mark Combo)</h5>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed font-medium">
                        <li>• <strong className="text-slate-100">播種突碰：</strong>植物學家平時會朝最近的對手扔擲高能種子（自動 basic 彈射），擊中時對敵人施加持續 5.0 秒的<strong>「播種標記」</strong>並造成 1.0 的碎裂傷害。</li>
                        <li>• <strong className="text-slate-100">定點集火增傷：</strong>友方任何已召喚出的花草，在射擊命中帶有「播種標記」的敵人時，單發穿刺額外 <span className="text-cyan-400 font-black">+1.0 點傷害</span>。這提供了集火戰術的絕佳爆發來源。</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footnote tips on combat deployment */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-[11px] text-slate-400 leading-normal">
                  💡 <strong className="text-slate-200">綠野戰術部署心法：</strong>
                  植物學家生存的關鍵在於與植物保持適當距離（共生領域），利用被動的強力回復加成在後排快速積累 SP。開局儘快將三種完全不同的植物（毒孢花、荊棘叢、蔓藤射手）全部扔出以點亮<strong>多多益善的物種威力增幅 (+2.0 ATK)</strong>。敵球試圖突臉時利用「一技能：根鬚纏繞」配合蔓藤在暴擊加成下迅速反殺；團戰白熱化下立刻開啟二技能瘋狂生長或森羅咆哮。防碰撞被動「樹界衝力」有 20 秒內置 CD 可以在對面刺客突進貼臉時強力推開保命。
                </div>
              </motion.div>
            )}

            {/* TAB 2: ARSENAL ITEMS BLUEPRINT ROOM */}
            {activeTab === 'items' && (
              <motion.div 
                key="items"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="grid md:grid-cols-12 gap-6 items-stretch h-full"
              >
                {/* Left Side Item Selector */}
                <div className="md:col-span-4 flex flex-col gap-2 border border-slate-850 bg-slate-950/80 rounded-2.5xl p-4 text-left">
                  <span className="text-[9px] font-mono font-black text-slate-500 tracking-wider mb-2.5 block uppercase">
                    装备研發清單 (ARSENAL ARTIFACTS)
                  </span>

                  <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pr-0 md:pr-1 no-scrollbar flex-grow select-none">
                    {arsenalItems.map((item, id) => {
                      const isSel = id === selectedItemIdx;
                      return (
                        <button
                          key={id}
                          onClick={() => {
                            try { audio.playSelect(); } catch(err){}
                            setSelectedItemIdx(id);
                          }}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all shrink-0 md:shrink w-[200px] md:w-full cursor-pointer relative ${
                            isSel 
                              ? 'bg-gradient-to-r from-indigo-950/30 to-slate-900 border-indigo-500/50 shadow-md shadow-indigo-950/25' 
                              : 'bg-slate-900/40 border-transparent hover:bg-slate-900 hover:border-slate-800'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                            isSel ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-205">{item.name}</h4>
                            <p className="text-[8px] font-mono opacity-50 tracking-wide mt-0.5 uppercase">{item.type}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Interactive blueprint layout */}
                <div className="md:col-span-8 flex flex-col gap-5">
                  {(() => {
                    const activeItem = arsenalItems[selectedItemIdx];
                    return (
                      <motion.div
                        key={selectedItemIdx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.18 }}
                        className="flex-grow p-6 rounded-2.5xl border border-slate-850 bg-slate-900/20 text-left flex flex-col justify-between gap-5 relative overflow-hidden"
                      >
                        {/* High-tech vector background outline */}
                        <div className="absolute -right-12 -bottom-12 pointer-events-none opacity-[0.02]">
                          <activeItem.icon className="w-72 h-72" />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-850 pb-4 gap-3">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-950 border border-slate-850 shadow text-indigo-400">
                              <activeItem.icon className="w-6.5 h-6.5" />
                            </div>
                            <div>
                              <h3 className="text-sm sm:text-base font-black text-slate-200">{activeItem.name}</h3>
                            </div>
                          </div>

                          <div className="bg-slate-950 px-3 py-1.5 border border-slate-900 rounded-xl">
                            <span className="text-[7.5px] text-slate-500 font-mono uppercase block">SCHEMATIC ID</span>
                            <span className="text-[10px] font-mono text-slate-300 font-black">CODE: {activeItem.descId}</span>
                          </div>
                        </div>

                        {/* Specs grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                          {Object.entries(activeItem.stats).map(([k, v]) => (
                            <div key={k} className="bg-slate-950/80 p-3 rounded-2xl border border-slate-900 flex flex-col">
                              <span className="text-[8px] text-slate-500 uppercase tracking-wide">
                                {k === 'radius' ? '物理半徑' : k === 'mass' ? '品質常數' : k === 'elasticity' ? '反彈彈性' : '引力干涉'}
                              </span>
                              <span className="text-[11px] font-black text-slate-200 mt-1">{v}</span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-4 pt-2">
                          <div className="space-y-1.5">
                            <span className="text-[8.5px] text-slate-500 font-mono font-black uppercase tracking-wider block">🔬 核心微觀特徵</span>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeItem.desc}</p>
                          </div>

                          <div className="space-y-1.5 p-4 rounded-2xl border border-indigo-500/20 bg-indigo-950/10">
                            <span className="text-[8.5px] text-indigo-400 font-mono font-black uppercase tracking-wider block">⚡ 戰術物理干涉效應</span>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: activeItem.effect }} />
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[8.5px] text-slate-500 font-mono font-black uppercase tracking-wider block">🌍 實戰衍生生成序列</span>
                            <p className="text-xs text-slate-405 text-slate-400 font-sans">{activeItem.spawn}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </div>
              </motion.div>
            )}

            {/* TAB 3: RULES & CONSTANTS MODES DETECTOR */}
            {activeTab === 'modes' && (
              <motion.div 
                key="modes"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="space-y-5 text-left max-w-4xl mx-auto py-2"
              >
                {/* Standard Battle Spec info */}
                <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2.5xl flex flex-col sm:flex-row items-start gap-4">
                  <div className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl flex-shrink-0">
                    <Trophy className="w-6.5 h-6.5" />
                  </div>
                  <div className="text-left space-y-2">
                    <h4 className="text-xs font-black text-slate-205 flex items-center gap-2">
                      <span>標準競賽剛體物理對決 (Standard Physics Match)</span>
                      <span className="text-[8px] bg-sky-500/15 text-sky-400 p-0.5 px-2 rounded font-mono font-black">DEFAULT SYSTEM</span>
                    </h4>
                    <p className="text-xs text-slate-350 leading-relaxed font-sans">
                      <strong>力學架構：</strong>經典的 1v1 或 8人單淘汰錦標賽物理對戰。雙方球體在 600x400 的高密發光邊界矩形物理賽場內受撞，直至一方生命值衰減為零落敗。
                    </p>
                    <p className="text-xs text-slate-350 leading-relaxed font-sans">
                      <strong>動量模型：</strong>遵照完備的剛體彈性非阻尼碰撞定理，保留完美的衝量與動量常系，角色初始大小、品質、速度按照底層平衡標準運行。
                    </p>
                  </div>
                </div>

                {/* Mutators panel */}
                <div className="bg-slate-900/45 border border-indigo-500/30 p-5.5 rounded-2.5xl flex flex-col sm:flex-row items-start gap-5 relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 text-indigo-500/5 pointer-events-none">
                    <Sliders className="w-36 h-36" />
                  </div>
                  <div className="p-3 bg-indigo-500/10 border border-indigo-505/20 text-indigo-400 rounded-xl flex-shrink-0 shadow-inner">
                    <Sliders className="w-6.5 h-6.5 animate-pulse" />
                  </div>
                  <div className="text-left space-y-3.5 flex-1">
                    <h4 className="text-xs font-black text-slate-205 flex items-center gap-2">
                      <span>微觀物理變異常數因子 (Physics Mutators)</span>
                      <span className="text-[8px] bg-indigo-600 text-slate-100 font-black p-0.5 px-2.5 rounded font-mono uppercase tracking-wider">ACTIVE CONFIG</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900/80 leading-normal hover:border-slate-800 transition-colors">
                        <span className="text-indigo-400 font-extrabold block mb-1">📐 血量外殼體積受損縮小算法</span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          當球體受傷 HP 減損時，其球體半徑將具備<strong>等比例縮小特性</strong>（最高縮小 35%）。體量變小利於利用牆板縫隙靈活卡位，高機動突圍避開火力！
                        </p>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900/80 leading-normal hover:border-slate-800 transition-colors">
                        <span className="text-amber-500 font-extrabold block mb-1">🚀 牆板反彈動力極限擋速</span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          常規反向彈射設有 <strong>9.50% 常規防超速安全器</strong>（保證精控戰略走位和預判偏角）；而在 <strong>20.50% 的動能解禁極限擋位</strong>下，對撞球速流光一閃、考驗您的極速超頻反應。
                        </p>
                      </div>
                    </div>

                    {/* Meteorological Events */}
                    <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-900">
                      <span className="text-emerald-400 font-extrabold text-[11.5px] block mb-2 font-mono uppercase tracking-wider">🪐 15秒一輪戰場重力微氣候輪替系統</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[11px] font-sans">
                        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-900 relative">
                          <span className="text-amber-500 font-bold block mb-1">⚙ 極地泥沼：</span>
                          <span className="text-slate-400 leading-normal">賽場正中央生成巨大的極地冰泥沼澤盤，陷入此處會面臨三倍阻尼物理重降速。</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-900 relative">
                          <span className="text-cyan-400 font-bold block mb-1">⚡ 超量反彈：</span>
                          <span className="text-slate-400 leading-normal">物理彈射速度係數超載 1.25x。每次激烈撞牆額外增加 1.5% 移動常數！</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-900 relative">
                          <span className="text-red-400 font-bold block mb-1">🔥 暴擊狂瀾：</span>
                          <span className="text-slate-400 leading-normal">碰撞引發狂暴極磁暴，常規反彈衝撞有高達 50% 機率直接翻番造成物理瞬傷。</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-900 relative">
                          <span className="text-emerald-400 font-bold block mb-1">🌌 痊癒極光：</span>
                          <span className="text-slate-400 leading-normal">神聖的宇宙極光沐浴，使身置場內的所有球體每秒溫和自動恢復 0.5 HP 外甲。</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: FIVE-ELEMENT RELATIONSHIP PENTAGRAM TRACKS */}
            {activeTab === 'attributes' && (
              <motion.div 
                key="attributes"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="space-y-6 text-left max-w-4xl mx-auto py-2"
              >
                
                {/* Upper interactive star view */}
                <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2.5xl flex flex-col md:flex-row gap-6 items-center">
                  
                  {/* Circle SVG Pentagram Alignment portal */}
                  <div className="w-full md:w-[320px] shrink-0 bg-slate-950/85 p-4 rounded-2.5xl border border-slate-850 flex flex-col items-center gap-4 relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full scale-75" />
                    <span className="text-[9.5px] font-black text-indigo-400 font-mono tracking-wider block">五星剋制核心天盤 (PENTAGRAM PORTAL)</span>
                    
                    {/* SVG Active laser connections paths */}
                    <div className="relative w-[180px] h-[180px] my-1">
                      <svg viewBox="0 0 400 400" className="w-full h-full">
                        {/* Background starry orbit */}
                        <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(99,102,241,0.06)" strokeWidth="3" strokeDasharray="6,4" />
                        
                        {/* Star linkages pentagram routes */}
                        <path 
                          d="M 200,50 L 280,310 M 280,310 L 60,150 M 60,150 L 340,150 M 340,150 L 120,310 M 120,310 L 200,50" 
                          fill="none" 
                          stroke="rgba(99,102,241,0.12)" 
                          strokeWidth="2" 
                        />

                        {/* Interactive dynamic lasers */}
                        {pentagramElements.map((el) => {
                          const isSel = el.id === activeElement;
                          if (!isSel) return null;
                          const tgt = pentagramElements.find(p => p.id === el.countersId);
                          const supressor = pentagramElements.find(p => p.id === el.vulnerabilityId);
                          return (
                            <g key={el.id}>
                              {/* Laser to countered element (Strike line) */}
                              {tgt && (
                                <line 
                                  x1={el.x} y1={el.y} x2={tgt.x} y2={tgt.y} 
                                  stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="8 6"
                                  className="pulse-laser" 
                                />
                              )}
                              {/* Laser from supressor element to us (Vulnerability line) */}
                              {supressor && (
                                <line 
                                  x1={supressor.x} y1={supressor.y} x2={el.x} y2={el.y} 
                                  stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4"
                                />
                              )}
                            </g>
                          );
                        })}

                        {/* Element Nodes circles */}
                        {pentagramElements.map(el => {
                          const isSel = activeElement === el.id;
                          return (
                            <g 
                              key={el.id} 
                              className="cursor-pointer"
                              onClick={() => {
                                try { audio.playSelect(); } catch(err){}
                                setActiveElement(el.id);
                              }}
                            >
                              <circle 
                                cx={el.x} cy={el.y} 
                                r={isSel ? 29 : 24} 
                                fill="#020617" 
                                stroke={isSel ? "#6366f1" : "#1e293b"} 
                                strokeWidth={isSel ? "3" : "1.5"} 
                              />
                              <text 
                                x={el.x} y={el.y + 5} 
                                textAnchor="middle" 
                                fontSize={isSel ? "26" : "20"}
                              >
                                {el.name.split(' ')[0]}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Simple tab elements button array */}
                    <div className="grid grid-cols-2 md:flex md:flex-col gap-1.5 w-full pt-1">
                      {pentagramElements.map(el => {
                        const isCur = activeElement === el.id;
                        return (
                          <button
                            key={el.id}
                            onClick={() => {
                              try { audio.playSelect(); } catch(err){}
                              setActiveElement(el.id);
                            }}
                            className={`p-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
                              isCur 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow shadow-indigo-600/30' 
                                : 'bg-slate-900 border-slate-900 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span>{el.name}</span>
                            <span className="text-[8.5px] font-mono tracking-wider opacity-65 uppercase">{isCur ? 'ACTIVE RIG' : 'SELECT'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Description cards details */}
                  <div className="flex-grow space-y-4.5 text-left">
                    
                    <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5 flex-wrap">
                      <span className="text-xs font-black text-slate-405 text-slate-400">當前星命核心：</span>
                      <span className="text-sm font-black text-indigo-400 flex items-center gap-1.5">
                        <span>{selectedPentagram.name}</span>
                        <span className="text-[10px] font-mono font-black text-slate-500 bg-slate-950 p-1 px-2 border border-slate-900 rounded-lg">ID: {selectedPentagram.id.toUpperCase()}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      
                      {/* Strike Advantage */}
                      <div className="bg-emerald-950/15 border border-emerald-500/20 p-4 rounded-2xl space-y-2 relative overflow-hidden">
                        <div className="absolute right-3 top-3 text-emerald-500/5">
                          <Sword className="w-12 h-12" />
                        </div>
                        <span className="text-[8.5px] font-black text-emerald-400 tracking-wider font-mono block">💥 剋制優勢 (COUNTER STRIKE: +30%)</span>
                        <h5 className="font-extrabold text-[13px] text-emerald-350 text-emerald-300">
                          {selectedPentagram.name} 剋制 {selectedPentagram.countersName}
                        </h5>
                        <p className="text-[11px] text-slate-350 leading-relaxed font-normal">
                          對撞、普攻、奧義技能擊中時，造成的物理/法術損害係數放大為原傷害的 <strong>1.30 倍</strong>。
                        </p>
                      </div>

                      {/* Vulnerability */}
                      <div className="bg-red-950/15 border border-red-500/20 p-4 rounded-2xl space-y-2 relative overflow-hidden">
                        <div className="absolute right-3 top-3 text-red-500/5">
                          <Shield className="w-12 h-12" />
                        </div>
                        <span className="text-[8.5px] font-black text-red-400 tracking-wider font-mono block">🛡️ 被剋弱點 (VULNERABILITY: -20%)</span>
                        <h5 className="font-extrabold text-[13px] text-red-350 text-red-350">
                          {selectedPentagram.name} 被剋於 {selectedPentagram.vulnerabilityName}
                        </h5>
                        <p className="text-[11px] text-slate-350 leading-relaxed font-normal">
                          當被其外殼衝打或奧義打擊時，造成的動能承傷遞減防護，造成的損害高達 <strong>1.20倍</strong> (自身吸收僅 <strong>0.80 倍</strong>)。
                        </p>
                      </div>

                    </div>

                    {/* Historical Lore context */}
                    <div className="bg-slate-900/35 p-4 rounded-2xl border border-slate-850/80 space-y-1.5">
                      <span className="text-[8.5px] font-black text-slate-500 tracking-widest font-mono uppercase block">🌟 量子五星剋制核心考証 (WEATHERPROOF PHILOSOPHICAL ANALYSIS)</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium italic select-all">
                        "{selectedPentagram.lore}"
                      </p>
                    </div>

                  </div>

                </div>

                <div className="p-3 bg-indigo-500/5 border border-indigo-550/10 border-indigo-500/10 rounded-xl text-[9.5px] text-indigo-400 text-center font-mono leading-relaxed">
                  💡 註：在相同屬性的同類對手鏡像對局中，以及不具備剋制對應的角色交互碰撞中不觸發優弱系，維持 1.00x 的純物理剛體對撞。
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3.5 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between bg-slate-950/90 backdrop-blur-sm text-[10px] text-slate-500 font-mono gap-2 z-10 selection:bg-indigo-500/10">
          <span>COSMIC CODEX SUPREME PROTOCOL: v1.5.2026-SPHERE (SECURE STATUS)</span>
          <span>提供高精雙球物理2D碰撞、調頻時空與五星星體軌道分析</span>
        </div>

      </div>
    </div>
  );
}
