import React, { useState } from 'react';
import { Character } from '../types';
import { CharacterVectorIcon } from './CharacterVectorIcon';
import { audio } from '../utils/audio';
import { PATCH_LOGS } from '../data/patchNotes';
import { 
  Sparkles, Activity, Shield, Flame, Swords, Settings, Users, 
  CloudSun, TrendingUp, Minimize2, Wind, BookOpen, Heart, Globe, 
  Dices, AlertCircle, Info, Zap, ChevronLeft, ChevronRight, Check,
  ChevronDown, ChevronUp, Trophy, X, Megaphone
} from 'lucide-react';

interface CharacterSelectionScreenProps {
  characters: Character[];
  p1Index: number;
  p2Index: number;
  p1PartnerIndex: number;
  p2PartnerIndex: number;
  onSelectP1: (index: number) => void;
  onSelectP1Partner: (index: number) => void;
  onSelectP2: (index: number) => void;
  onSelectP2Partner: (index: number) => void;
  onConfirmBattle: () => void;
  isCustomMode: boolean;
  setIsCustomMode: (v: boolean) => void;
  isEnvironmentEnabled: boolean;
  setIsEnvironmentEnabled: (v: boolean) => void;
  isShrinkingArenaEnabled: boolean;
  setIsShrinkingArenaEnabled: (v: boolean) => void;
  isWindVortexEnabled: boolean;
  setIsWindVortexEnabled: (v: boolean) => void;
  isPortalEnabled: boolean;
  setIsPortalEnabled: (v: boolean) => void;
  isTournamentActive: boolean;
  setIsTournamentActive: (v: boolean) => void;
  tournamentParticipants: number[];
  setTournamentParticipants: React.Dispatch<React.SetStateAction<number[]>>;
  onStartTournament: (selectedIndices: number[]) => void;
  customSpeedLimit: number;
  setCustomSpeedLimit: (v: number) => void;
  visualPreset: 'classic' | 'cosmic' | 'neon';
  setVisualPreset: (v: 'classic' | 'cosmic' | 'neon') => void;
  trailStyle: 'sparkle' | 'laser' | 'pixel';
  setTrailStyle: (v: 'sparkle' | 'laser' | 'pixel') => void;
  glowPower: 'delicate' | 'radiant' | 'ultra';
  setGlowPower: (v: 'delicate' | 'radiant' | 'ultra') => void;
  setIsHandbookOpen: (v: boolean) => void;
  isTwoVsTwoMode: boolean;
  setIsTwoVsTwoMode: (v: boolean) => void;
  tournamentType?: 'elimination' | 'points';
  setTournamentType?: (type: 'elimination' | 'points') => void;
}

const CHARACTER_METADATA: Record<string, { difficulty: 'easy' | 'medium' | 'hard', tags: string[] }> = {
  vampire: { difficulty: 'medium', tags: ['持續吸血', '控制擊飛', '猩紅印記'] },
  mud: { difficulty: 'easy', tags: ['防守坦克', '泥濘阻慢', '超高生命'] },
  blaze: { difficulty: 'easy', tags: ['範圍灼燒', '流星火海', '爆擊點火'] },
  lightning: { difficulty: 'easy', tags: ['氣旋割裂', '雷擊推飛', '磁偏旋渦'] },
  dice: { difficulty: 'hard', tags: ['隨機點數', '低血均分', '因果天平'] },
  gravity: { difficulty: 'easy', tags: ['黑洞牽引', '無敵吸附', '反彈阻尼'] },
  phantom: { difficulty: 'hard', tags: ['分身移位', '折線定身', '機動突襲'] },
  whip: { difficulty: 'medium', tags: ['削弱慣性', '旋掃清場', '引力地裂'] },
  gambler: { difficulty: 'hard', tags: ['扇形撲克', '換牌重抽', '爆發射擊'] },
  angel: { difficulty: 'medium', tags: ['聖耀雙環', '聖光衝槍', '天啟裁決'] },
  cat: { difficulty: 'hard', tags: ['閃步保命', '致幻香霧', '輕快提速'] },
  snake: { difficulty: 'easy', tags: ['代擋體節', '衝鋒鎖死', '酸霧毒網'] },
  grid9: { difficulty: 'medium', tags: ['九宮數格', '數字翻倍', '高壓鎖定'] },
  water_dragon: { difficulty: 'easy', tags: ['鎖定水柱', '水精回血', '水牆拍飛'] },
  cosmic_mage: { difficulty: 'hard', tags: ['連發星塵', '秩序極光', '黑洞囚籠'] },
  conductor: { difficulty: 'easy', tags: ['自動軌道', '驗票禁錮', '車廂護盾'] },
  wind_eagle: { difficulty: 'hard', tags: ['風箏偏移', '穿心箭勢', '狂暴氣流'] },
  explorer: { difficulty: 'medium', tags: ['臨時路障', '繩網捕捉', '閃光震撼'] },
  silent: { difficulty: 'medium', tags: ['寂光禁錮', '沉默結界', '控制輔助'] },
  flash_bird: { difficulty: 'medium', tags: ['極光流引', '三捷瞬步', '流光隕爆'] },
  harvey: { difficulty: 'easy', tags: ['據點物資', '炮台連射', '功能輔助'] },
  poke: { difficulty: 'medium', tags: ['引力拋竿', '蓄能震盪', '戰術干擾'] },
  lie: { difficulty: 'medium', tags: ['蓄力穿刺', '低血爆碎', '斬殺戰士'] }
};

export const CharacterSelectionScreen: React.FC<CharacterSelectionScreenProps> = ({
  characters,
  p1Index,
  p2Index,
  p1PartnerIndex,
  p2PartnerIndex,
  onSelectP1,
  onSelectP1Partner,
  onSelectP2,
  onSelectP2Partner,
  onConfirmBattle,
  isCustomMode,
  setIsCustomMode,
  isEnvironmentEnabled,
  setIsEnvironmentEnabled,
  isShrinkingArenaEnabled,
  setIsShrinkingArenaEnabled,
  isWindVortexEnabled,
  setIsWindVortexEnabled,
  isPortalEnabled,
  setIsPortalEnabled,
  isTournamentActive,
  setIsTournamentActive,
  tournamentParticipants,
  setTournamentParticipants,
  onStartTournament,
  customSpeedLimit,
  setCustomSpeedLimit,
  visualPreset,
  setVisualPreset,
  trailStyle,
  setTrailStyle,
  glowPower,
  setGlowPower,
  setIsHandbookOpen,
  isTwoVsTwoMode,
  setIsTwoVsTwoMode,
  tournamentType = 'elimination',
  setTournamentType = (_type: 'elimination' | 'points') => {}
 }) => {
  // Character Categories Definition optimized for classic combat order
  const CATEGORIES = [
    { id: 'fighter', name: '獵魔戰士系', icon: '⚔️', roles: ['fighter'] },
    { id: 'assassin', name: '神秘刺客系', icon: '🗡️', roles: ['assassin'] },
    { id: 'shooter', name: '遠程射手系', icon: '🏹', roles: ['shooter'] },
    { id: 'mage', name: '奧術法術系', icon: '🔮', roles: ['mage'] },
    { id: 'tank', name: '堅毅坦克系', icon: '🛡️', roles: ['tank'] },
    { id: 'support', name: '命運輔助系', icon: '✨', roles: ['support'] },
  ];

  // Patch notes modal and announcement banner states
  const [isPatchModalOpen, setIsPatchModalOpen] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [selectedPatchIndex, setSelectedPatchIndex] = useState(0);

  // Player 1 Search, Sort, Filter States
  const [p1SearchQuery, setP1SearchQuery] = useState('');
  const [p1SortBy, setP1SortBy] = useState<'default' | 'hp' | 'speed' | 'mass' | 'difficulty'>('default');
  const [p1FilterDiff, setP1FilterDiff] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Player 2 Search, Sort, Filter States
  const [p2SearchQuery, setP2SearchQuery] = useState('');
  const [p2SortBy, setP2SortBy] = useState<'default' | 'hp' | 'speed' | 'mass' | 'difficulty'>('default');
  const [p2FilterDiff, setP2FilterDiff] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const getProcessedChars = (side: 'p1' | 'p2', catId: string) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat) return [];
    
    // 1. Filter by category roles
    let list = characters.filter(char => cat.roles.includes(char.role));
    
    const searchQuery = side === 'p1' ? p1SearchQuery : p2SearchQuery;
    const filterDiff = side === 'p1' ? p1FilterDiff : p2FilterDiff;
    const sortBy = side === 'p1' ? p1SortBy : p2SortBy;
    
    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(char => 
        char.name.toLowerCase().includes(q) ||
        char.title.toLowerCase().includes(q) ||
        char.skillName.toLowerCase().includes(q) ||
        char.skillDesc.toLowerCase().includes(q)
      );
    }
    
    // 3. Filter by Difficulty
    if (filterDiff !== 'all') {
      list = list.filter(char => {
        const meta = CHARACTER_METADATA[char.id];
        return meta && meta.difficulty === filterDiff;
      });
    }
    
    // 4. Sort
    const sortedList = [...list];
    if (sortBy === 'hp') {
      sortedList.sort((a, b) => b.initialHp - a.initialHp);
    } else if (sortBy === 'speed') {
      sortedList.sort((a, b) => b.speed - a.speed);
    } else if (sortBy === 'mass') {
      sortedList.sort((a, b) => b.mass - a.mass);
    } else if (sortBy === 'difficulty') {
      const diffScore: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
      sortedList.sort((a, b) => {
        const diffA = diffScore[CHARACTER_METADATA[a.id]?.difficulty || 'medium'];
        const diffB = diffScore[CHARACTER_METADATA[b.id]?.difficulty || 'medium'];
        return diffA - diffB; // Easy first
      });
    }
    
    return sortedList;
  };

  const getProcessedCharsCount = (side: 'p1' | 'p2') => {
    let count = 0;
    CATEGORIES.forEach(cat => {
      count += getProcessedChars(side, cat.id).length;
    });
    return count;
  };

  // Collapsible accordion group state for both players
  const [p1ExpandedCategories, setP1ExpandedCategories] = useState<Record<string, boolean>>({
    tank: true,
    fighter: true,
    assassin: true,
    mage: true,
    shooter: true,
    support: true
  });
  const [p2ExpandedCategories, setP2ExpandedCategories] = useState<Record<string, boolean>>({
    tank: true,
    fighter: true,
    assassin: true,
    mage: true,
    shooter: true,
    support: true
  });

  // Category scrolling rail references to enable click chevrons and smooth touch swiping on mobile
  const p1CategoryRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const p2CategoryRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  const scrollP1Category = (catId: string, dir: 'left' | 'right') => {
    const el = p1CategoryRefs.current[catId];
    if (el) {
      const scrollVal = dir === 'left' ? -150 : 150;
      el.scrollBy({ left: scrollVal, behavior: 'smooth' });
    }
  };

  const scrollP2Category = (catId: string, dir: 'left' | 'right') => {
    const el = p2CategoryRefs.current[catId];
    if (el) {
      const scrollVal = dir === 'left' ? -150 : 150;
      el.scrollBy({ left: scrollVal, behavior: 'smooth' });
    }
  };

  // Navigation tabs for the dual campers
  const [p1Tab, setP1Tab] = useState<'passive' | 'active' | 'ultimate' | 'lore'>('passive');
  const [p2Tab, setP2Tab] = useState<'passive' | 'active' | 'ultimate' | 'lore'>('passive');

  // Currently focused slot for choosing in 2v2 (Leader vs Partner)
  const [p1FocusSlot, setP1FocusSlot] = useState<'leader' | 'partner'>('leader');
  const [p2FocusSlot, setP2FocusSlot] = useState<'leader' | 'partner'>('leader');

  // Tooltip hovering state representation
  const [hoveredCharId, setHoveredCharId] = useState<string | null>(null);
  const [tooltipSide, setTooltipSide] = useState<'p1' | 'p2'>('p1');

  // Active characters corresponding to indices
  const p1LeaderChar = characters[p1Index] || characters[0];
  const p1PartnerChar = characters[p1PartnerIndex] || characters[1];
  const p1ActiveChar = p1FocusSlot === 'leader' ? p1LeaderChar : p1PartnerChar;

  const p2LeaderChar = characters[p2Index] || characters[0];
  const p2PartnerChar = characters[p2PartnerIndex] || characters[3];
  const p2ActiveChar = p2FocusSlot === 'leader' ? p2LeaderChar : p2PartnerChar;

  // Custom Tag Helper representing core design guidelines
  const getCharacterLabel = (role: string) => {
    switch (role) {
      case 'tank': return '堅抗坦克';
      case 'fighter': return '充沛戰士';
      case 'assassin': return '爆發刺客';
      case 'shooter': return '遠程射手';
      case 'mage': return '奧術法師';
      case 'support': return '功能輔助';
      default: return '未知定位';
    }
  };

  const getRoleColors = (role: string) => {
    switch (role) {
      case 'tank': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25/30';
      case 'fighter': return 'text-red-400 bg-red-500/10 border-red-500/25/30';
      case 'assassin': return 'text-purple-400 bg-purple-500/10 border-purple-500/25/30';
      case 'shooter': return 'text-amber-400 bg-amber-500/10 border-amber-500/25/30';
      case 'mage': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25/30';
      case 'support': return 'text-sky-400 bg-sky-500/10 border-sky-500/25/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  // Structured skill parser helpers for the pristine lists
  const getParsedStats = (char: Character, tab: 'passive' | 'active' | 'ultimate') => {
    if (tab === 'passive') {
      return {
        name: char.skillName,
        desc: char.detailedDesc,
        cooldown: char.id === 'cat' ? '5.0秒 (被動閃避)' : '常駐 (被動觸發)',
        damage: char.id === 'vampire' ? '吸血傷害 / 連續' : char.id === 'mud' ? '2.0 (泥濘觸發)' : char.id === 'blaze' ? '1.2 (灼燒/秒)' : char.id === 'grid9' ? '(球面+格數) x 0.4' : '視碰撞情況',
        range: char.id === 'gravity' ? '1.6 倍體積半徑' : char.id === 'blaze' ? '1.5 倍體積半徑' : char.id === 'lightning' ? '1.4 倍體積半徑' : '實體碰撞域',
        mechanic: char.id === 'vampire' ? '雙重吸血 & 擊飛' : char.id === 'mud' ? '泥濘嚴重阻礙減速' : char.id === 'cat' ? '累計印記提速且免碰撞' : '觸發即生效'
      };
    } else if (tab === 'active') {
      return {
        name: char.subSkillName || '基礎小技',
        desc: char.subSkillDesc || '向前方釋放英雄球體專屬的小技能爆發。',
        cooldown: char.id === 'whip' ? '6.2秒' : char.id === 'snake' ? '6.0秒' : char.id === 'cat' ? '7.0秒' : char.id === 'dice' ? '9.0秒' : '10.0秒',
        damage: char.id === 'vampire' ? '5.52 點穿刺傷害' : char.id === 'whip' ? '2.3 + 1.93 點雙段抽' : char.id === 'cat' ? '2.10 點幽爪銳擊' : '高額彈力/魔法傷害',
        range: char.id === 'blaze' ? '2.2 倍爆燃範圍' : char.id === 'whip' ? '狹長拉拽 + 環形橫擊' : '前方判定線',
        mechanic: char.id === 'gravity' ? '無敵 2.5 秒並狂暴向心吸' : char.id === 'snake' ? '衝刺附帶大纏繞阻礙' : char.id === 'dice' ? '判定 1-3 點巨額改命' : '強位移及擊退'
      };
    } else {
      return {
        name: char.skill2Name || '太虛終印',
        desc: char.skill2DetailedDesc || char.skill2Desc || '終結奧義。',
        cooldown: char.id === 'dice' ? '22秒' : char.id === 'whip' ? '16秒' : char.id === 'mud' ? '15秒' : '18秒 (超載冷卻)',
        damage: char.id === 'grid9' ? '4.50 點數字絞殺' : char.id === 'phantom' ? '3.60 量子割裂' : char.id === 'water_dragon' ? '3.50 + 雙水柱' : '高壓巨額奧術爆傷',
        range: char.id === 'water_dragon' ? '全屏橫掃大水牆' : char.id === 'grid9' ? '5個十字黃金格區間' : '追蹤最近點 35+ 範圍',
        mechanic: char.id === 'cosmic_mage' ? '神聖秩序極光，抹去所有敵方增益' : char.id === 'dice' ? '低血強製均分血量翻盤' : char.id === 'phantom' ? '投影換位/路徑雷射定身' : '大範圍硬控制眩暈'
      };
    }
  };

  // Random picker
  const handleRandomSelect = () => {
    audio.playSelect();
    const len = characters.length;
    
    // Player 1
    const p1RandLeader = Math.floor(Math.random() * len);
    onSelectP1(p1RandLeader);
    if (isTwoVsTwoMode) {
      let p1RandPartner = Math.floor(Math.random() * len);
      while (p1RandPartner === p1RandLeader) {
        p1RandPartner = Math.floor(Math.random() * len);
      }
      onSelectP1Partner(p1RandPartner);
    }

    // Player 2
    let p2RandLeader = Math.floor(Math.random() * len);
    while (!isTwoVsTwoMode && p2RandLeader === p1RandLeader) {
      p2RandLeader = Math.floor(Math.random() * len);
    }
    onSelectP2(p2RandLeader);

    if (isTwoVsTwoMode) {
      let p2RandPartner = Math.floor(Math.random() * len);
      while (p2RandPartner === p2RandLeader) {
        p2RandPartner = Math.floor(Math.random() * len);
      }
      onSelectP2Partner(p2RandPartner);
    }
  };

  // Thumbnail hover tooltip triggers
  const handleThumbHover = (char: Character, side: 'p1' | 'p2', active: boolean) => {
    if (active) {
      setHoveredCharId(char.id);
      setTooltipSide(side);
    } else {
      setHoveredCharId(null);
    }
  };

  const handleSelectCharIndex = (index: number, side: 'p1' | 'p2') => {
    audio.playSelect();
    if (side === 'p1') {
      if (p1FocusSlot === 'leader') {
        // Enforce non-duplication in 2v2
        if (isTwoVsTwoMode && index === p1PartnerIndex) {
          // swap them
          onSelectP1Partner(p1Index);
        }
        onSelectP1(index);
      } else {
        if (index === p1Index) {
          // swap them
          onSelectP1(p1PartnerIndex);
        }
        onSelectP1Partner(index);
      }
    } else {
      if (p2FocusSlot === 'leader') {
        if (isTwoVsTwoMode && index === p2PartnerIndex) {
          onSelectP2Partner(p2Index);
        }
        onSelectP2(index);
      } else {
        if (index === p2Index) {
          onSelectP2(p2PartnerIndex);
        }
        onSelectP2Partner(index);
      }
    }
  };

  const isMirrorMatch = !isTwoVsTwoMode && p1Index === p2Index;

  return (
    <div className="flex flex-col gap-3 sm:gap-6 w-full animate-fadeIn select-none p-1.5 sm:p-4">
      
      {/* 📢 Floating Announcement Alert Banner */}
      {!isBannerDismissed && (
        <div id="latest-announcement-banner" className="relative group overflow-hidden bg-gradient-to-r from-indigo-950/95 via-slate-900/98 to-slate-950/98 border border-indigo-500/30 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-4 shadow-[0_4px_20px_rgba(99,102,241,0.15)] animate-slideDown select-none">
          {/* Animated decorative flow lines inside banner */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5 opacity-40 pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
          
          <div 
            onClick={() => {
              audio.playSelect();
              setSelectedPatchIndex(0); // latest patch
              setIsPatchModalOpen(true);
            }} 
            className="flex items-center gap-3 cursor-pointer min-w-0 flex-1 text-left"
          >
            {/* Animated megaphone icon badge */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-inner">
              <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 animate-pulse" />
            </div>
            
            <div className="text-left min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] bg-indigo-500 text-white font-black px-1.5 py-0.5 rounded font-mono tracking-wider animate-pulse">NEW UPDATE</span>
                <span className="text-[10px] sm:text-xs font-semibold text-indigo-400">{PATCH_LOGS[0].version} 版本平衡發佈</span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-100 tracking-tight mt-0.5 group-hover:text-indigo-300 transition-colors truncate">
                最新公告：星艦平衡更新「{PATCH_LOGS[0].title}」已載入！點擊查看調整細節 🚀
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                audio.playSelect();
                setSelectedPatchIndex(0);
                setIsPatchModalOpen(true);
              }}
              className="px-3 py-1.5 text-[10px] sm:text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/40 hover:border-indigo-400 rounded-lg shadow-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">查閱改動</span>
            </button>
            
            <button
              onClick={() => {
                audio.playSelect();
                setIsBannerDismissed(true);
              }}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-950/50 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer mr-1"
              title="關閉公告"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Header Banner & Mode Indicators */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-3.5 sm:p-5 text-center relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 w-full">
        {/* Decorative corner light accents */}
        <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 opacity-60" />
        <div className="absolute bottom-0 right-0 w-24 h-1 bg-gradient-to-r from-pink-500 to-orange-500 opacity-60" />
        
        <div className="text-left w-full md:w-auto">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-mono text-indigo-400 font-extrabold flex items-center gap-1.5 mb-1">
            <Swords className="w-3.5 h-3.5" />
            <span>競技對決 • 選取球形意志</span>
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-100 font-sans tracking-tight leading-none">
            球體被動奧義對決
          </h2>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 max-w-lg font-medium leading-relaxed">
            每顆智慧球體具備特異的 <strong className="text-emerald-400">初始生命值</strong>、<strong className="text-indigo-400">速度與大底被動</strong>。
          </p>
        </div>

        {/* Mode Selector and Custom Mutator quick switches */}
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap w-full md:w-auto justify-end">
          {/* Announcement/Patch notes trigger button */}
          <button
            onClick={() => {
              audio.playSelect();
              setIsPatchModalOpen(true);
            }}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded-xl border bg-slate-950/80 border-slate-800 text-indigo-400 hover:border-indigo-500/50 hover:text-indigo-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Megaphone className="w-3.5 h-3.5 text-indigo-400" />
            <span>更新日誌</span>
          </button>

          {/* 1v1 vs 2v2 controller */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 sm:p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                audio.playSelect();
                setIsTwoVsTwoMode(false);
              }}
              className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                !isTwoVsTwoMode 
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white font-black shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Swords className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>1V1 對決</span>
            </button>
            <button
              onClick={() => {
                audio.playSelect();
                setIsTwoVsTwoMode(true);
                // Make sure partner index does not collide with main leader in 2v2 on turning on
                if (p1Index === p1PartnerIndex) {
                  onSelectP1Partner((p1Index + 1) % characters.length);
                }
                if (p2Index === p2PartnerIndex) {
                  onSelectP2Partner((p2Index + 1) % characters.length);
                }
              }}
              className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                isTwoVsTwoMode 
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white font-black shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>2V2 協同</span>
            </button>
          </div>

          {/* Quick Mutator toggle icon switcher */}
          <button
            onClick={() => {
              audio.playSelect();
              setIsCustomMode(!isCustomMode);
              if (isCustomMode) {
                setIsEnvironmentEnabled(false);
              }
            }}
            className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded-xl border transition-all flex items-center gap-1 sm:gap-1.5 ${
              isCustomMode 
                ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.15)] font-black' 
                : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>自定義</span>
            {isCustomMode && <span className="w-1 h-1 rounded-full bg-indigo-400 animate-ping" />}
          </button>
        </div>
      </div>

      {/* 2. Main Selected Showcase Bento-block Split Columns */}
      <div className="grid lg:grid-cols-2 gap-3.5 sm:gap-6 items-start w-full">
        
        {/* COLUMN A: Player 1 (Blue Force Camp) */}
        <div className={`flex flex-col gap-2.5 sm:gap-4 rounded-2xl sm:rounded-3xl border border-slate-900/60 p-3 sm:p-5 bg-gradient-to-b from-sky-950/15 to-slate-950/50 backdrop-blur shadow-xl relative`}>
          {/* Camp corner label */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="font-mono text-[9px] font-black text-sky-400 uppercase tracking-widest">
              P1 (藍)
            </span>
          </div>

          {/* Slot active controls (only relevant if 2v2 mode is selected) */}
          {isTwoVsTwoMode ? (
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              <button
                onClick={() => {
                  audio.playSelect();
                  setP1FocusSlot('leader');
                }}
                className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                  p1FocusSlot === 'leader'
                    ? 'bg-sky-950/55 border-sky-500/50 text-sky-200 shadow-md shadow-sky-500/5'
                    : 'bg-slate-950/40 border-slate-850 hover:bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="w-6 h-6 rounded bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-[10px] shrink-0 font-bold text-sky-400">
                  主
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] uppercase font-mono text-sky-500 font-extrabold leading-none">核心主將</div>
                  <div className="text-xs font-bold truncate max-w-[90px]">{p1LeaderChar.name}</div>
                </div>
                {p1FocusSlot === 'leader' && <div className="ml-auto w-1 h-1 rounded-full bg-sky-400 animate-pulse" />}
              </button>

              <button
                onClick={() => {
                  audio.playSelect();
                  setP1FocusSlot('partner');
                }}
                className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                  p1FocusSlot === 'partner'
                    ? 'bg-sky-950/55 border-sky-500/50 text-sky-200 shadow-md shadow-sky-500/5'
                    : 'bg-slate-950/40 border-slate-850 hover:bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="w-6 h-6 rounded bg-sky-400/10 border border-sky-300/10 flex items-center justify-center text-[10px] shrink-0 font-bold text-sky-300">
                  副
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] uppercase font-mono text-sky-400 font-extrabold leading-none">協同副將</div>
                  <div className="text-xs font-bold truncate max-w-[90px]">{p1PartnerChar.name}</div>
                </div>
                {p1FocusSlot === 'partner' && <div className="ml-auto w-1 h-1 rounded-full bg-sky-400 animate-pulse" />}
              </button>
            </div>
          ) : (
            <div className="h-2" />
          )}

          {/* Compact Hero Showcase Board */}
          <div className="flex flex-row items-center gap-3 sm:gap-5 bg-slate-950/40 border border-slate-900 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-inner text-left w-full">
            {/* Sphere Avatar Showcase */}
            <div className="relative flex items-center justify-center w-16 h-16 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-850/80 p-1 sm:p-2 shadow-2xl flex-shrink-0">
              {/* Outer pulsing glow matching color */}
              <div 
                className="absolute inset-0 rounded-xl sm:rounded-2xl blur-xl opacity-30 transition-all duration-500 animate-pulse"
                style={{ backgroundColor: p1ActiveChar.color }}
              />
              <CharacterVectorIcon 
                characterId={p1ActiveChar.id} 
                className="w-full h-full transform scale-105 sm:scale-110 active:scale-125 transition-transform duration-300 animate-dragBreathing" 
              />
              
              {/* Overlaid HP badge */}
              <div className="absolute bottom-0.5 right-0.5 bg-slate-900/95 border border-emerald-500/30 text-emerald-400 text-[8px] sm:text-[10px] font-mono font-black px-1 sm:px-2 py-0.5 rounded shadow-lg">
                HP {p1ActiveChar.initialHp}
              </div>
            </div>

            {/* Quick specifications and Titles */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded font-extrabold border ${getRoleColors(p1ActiveChar.role)}`}>
                  {getCharacterLabel(p1ActiveChar.role)}
                </span>
                <span className="text-[8px] sm:text-[10px] bg-slate-900 border border-slate-800 text-slate-350 font-mono px-1.5 py-0.5 rounded">
                  {p1ActiveChar.mass < 0.6 ? '輕盈' : p1ActiveChar.mass > 1.2 ? '玄金' : '中庸'}
                </span>
                <span className={`text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                  CHARACTER_METADATA[p1ActiveChar.id]?.difficulty === 'easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                  CHARACTER_METADATA[p1ActiveChar.id]?.difficulty === 'medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                  'text-rose-400 bg-rose-500/10 border-rose-500/20'
                }`}>
                  {CHARACTER_METADATA[p1ActiveChar.id]?.difficulty === 'easy' ? '新手推薦' :
                   CHARACTER_METADATA[p1ActiveChar.id]?.difficulty === 'medium' ? '高手進階' : '專家操作'}
                </span>
              </div>
              
              <h3 className="text-sm sm:text-lg font-black text-slate-100 tracking-tight mt-1 truncate">
                {p1ActiveChar.name}
              </h3>
              <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 mt-0.5 leading-normal italic truncate">
                「{p1ActiveChar.title}」
              </p>
              
              {/* Custom Tags */}
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {CHARACTER_METADATA[p1ActiveChar.id]?.tags?.map(tag => (
                  <span key={tag} className="text-[8px] sm:text-[9.5px] text-indigo-400/90 bg-indigo-500/5 border border-indigo-505/10 px-1.5 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* Basic spec parameters in beautiful progress badges */}
              <div className="grid grid-cols-2 gap-1.5 mt-2 text-[9px] sm:text-[11px] font-mono">
                <div className="flex items-center gap-1 text-slate-400 bg-slate-950/65 p-1 sm:p-1.5 rounded-lg border border-slate-850">
                  <Activity className="w-3 h-3 text-sky-400 shrink-0" />
                  <span className="truncate">移速: <strong className="text-white">{(p1ActiveChar.speed * 100).toFixed(0)}%</strong></span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 bg-slate-950/65 p-1 sm:p-1.5 rounded-lg border border-slate-850">
                  <Shield className="w-3 h-3 text-purple-400 shrink-0" />
                  <span className="truncate">重量: <strong className="text-white">{(p1ActiveChar.mass * 100).toFixed(0)}%</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Categorized Selection Board with smooth swipes & chevrons */}
          <div className="flex flex-col gap-2 mt-1 border-t border-slate-900/60 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-extrabold block text-left">
                📦 球體成員分類選取 (可滑動與折疊)
              </span>
              <button
                onClick={() => {
                  audio.playSelect();
                  const allClosed = Object.values(p1ExpandedCategories).every(v => !v);
                  const nextVal = allClosed;
                  const nextMap: Record<string, boolean> = {};
                  CATEGORIES.forEach(cat => { nextMap[cat.id] = nextVal; });
                  setP1ExpandedCategories(nextMap);
                }}
                className="px-2 py-0.5 rounded bg-slate-950/60 hover:bg-slate-900 border border-slate-850 text-[9px] text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-tight cursor-pointer"
              >
                {Object.values(p1ExpandedCategories).every(v => !v) ? '展開全部 📂' : '摺疊全部 📁'}
              </button>
            </div>

            {/* P1 Search, Filter & Sort Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-0.5 mb-1.5 bg-slate-950/40 p-2 rounded-xl border border-slate-900/40 text-left">
              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  value={p1SearchQuery}
                  onChange={(e) => setP1SearchQuery(e.target.value)}
                  placeholder="搜尋球體名稱、技能..."
                  className="w-full pl-7 pr-6 py-1 text-[10px] sm:text-[11px] bg-slate-950 border border-slate-850 hover:border-slate-750 focus:border-sky-500/80 rounded-lg text-slate-200 placeholder-slate-550 focus:outline-none transition-all"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] pointer-events-none">🔍</span>
                {p1SearchQuery && (
                  <button 
                    onClick={() => setP1SearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-[10px] px-1 focus:outline-none"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort selector pills */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                <span className="text-[9px] text-slate-500 font-bold shrink-0">排序:</span>
                {[
                  { id: 'default', label: '預設' },
                  { id: 'hp', label: 'HP' },
                  { id: 'speed', label: '移速' },
                  { id: 'mass', label: '重量' },
                  { id: 'difficulty', label: '難度' }
                ].map(opt => (
                  <button
                    key={`p1-sort-${opt.id}`}
                    onClick={() => { audio.playSelect(); setP1SortBy(opt.id as any); }}
                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded transition-all shrink-0 cursor-pointer ${
                      p1SortBy === opt.id 
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' 
                        : 'bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Difficulty filter pills */}
              <div className="col-span-1 sm:col-span-2 flex items-center gap-1 overflow-x-auto scrollbar-none py-1 border-t border-slate-900/45 mt-0.5">
                <span className="text-[9px] text-slate-500 font-bold shrink-0">難度:</span>
                {[
                  { id: 'all', label: '全部' },
                  { id: 'easy', label: '🟢 新手' },
                  { id: 'medium', label: '🟡 進階' },
                  { id: 'hard', label: '🔴 專家' }
                ].map(opt => (
                  <button
                    key={`p1-diff-${opt.id}`}
                    onClick={() => { audio.playSelect(); setP1FilterDiff(opt.id as any); }}
                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded transition-all shrink-0 cursor-pointer ${
                      p1FilterDiff === opt.id 
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' 
                        : 'bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-none">
              {getProcessedCharsCount('p1') === 0 && (
                <div className="text-center py-8 text-slate-500 text-[11px] font-medium border border-slate-900/50 rounded-xl bg-slate-950/20">
                  🔍 未找到符合搜尋與篩選條件的球體成員
                </div>
              )}

              {CATEGORIES.map(cat => {
                const catChars = getProcessedChars('p1', cat.id);
                if (catChars.length === 0) return null;
                const isOpen = p1ExpandedCategories[cat.id];

                return (
                  <div key={`p1-cat-${cat.id}`} className="flex flex-col gap-1 bg-slate-950/30 border border-slate-900/80 rounded-xl p-1.5">
                    {/* Collapsible header */}
                    <div
                      onClick={() => {
                        audio.playSelect();
                        setP1ExpandedCategories(prev => ({ ...prev, [cat.id]: !prev[cat.id] }));
                      }}
                      className="flex items-center justify-between px-2 py-1 rounded bg-slate-950/55 hover:bg-slate-950/90 border border-slate-900/40 cursor-pointer transition-all select-none"
                    >
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                        <span className="text-sm shrink-0">{cat.icon}</span>
                        <span>{cat.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono font-normal">({catChars.length}名)</span>
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                        <span>{isOpen ? '收納' : '展開'}</span>
                        {isOpen ? <ChevronUp className="w-3 h-3 text-slate-550" /> : <ChevronDown className="w-3 h-3 text-slate-550" />}
                      </div>
                    </div>

                    {/* Expandable Character list container */}
                    {isOpen && (
                      <div className="relative w-full flex items-center group/rail px-1">
                        {/* Slide Left Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            audio.playSelect();
                            scrollP1Category(cat.id, 'left');
                          }}
                          className="absolute left-[-2px] z-10 p-1 rounded-full bg-slate-900/95 border border-slate-800 text-slate-400 hover:text-sky-400 opacity-0 group-hover/rail:opacity-100 transition-opacity hidden sm:flex items-center justify-center cursor-pointer shadow-lg active:scale-90"
                          title="向左滑動"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>

                        {/* Swipeable List */}
                        <div
                          ref={(el) => { p1CategoryRefs.current[cat.id] = el; }}
                          className="flex-1 flex gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none touch-pan-x scroll-smooth select-none"
                        >
                          {catChars.map((char) => {
                            const origIdx = characters.findIndex(c => c.id === char.id);
                            const isCurLeader = p1Index === origIdx;
                            const isCurPartner = isTwoVsTwoMode && p1PartnerIndex === origIdx;
                            const isFocused = p1FocusSlot === 'leader' ? isCurLeader : isCurPartner;

                            return (
                              <button
                                key={`p1-thumb-${char.id}`}
                                onClick={() => handleSelectCharIndex(origIdx, 'p1')}
                                onMouseEnter={() => handleThumbHover(char, 'p1', true)}
                                onMouseLeave={() => handleThumbHover(char, 'p1', false)}
                                className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-950 border-2 transition-all p-0.5 flex-shrink-0 flex items-center justify-center cursor-pointer ${
                                  isFocused
                                    ? 'border-sky-500 scale-105 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                                    : isCurLeader || isCurPartner
                                      ? 'border-slate-800 bg-slate-900/60 opacity-65'
                                      : 'border-slate-900 hover:border-slate-700 bg-slate-950'
                                }`}
                                style={{
                                  boxShadow: isFocused ? `0 0 10px ${char.color}33` : 'none'
                                }}
                              >
                                <CharacterVectorIcon characterId={char.id} className="w-7 h-7 sm:w-8 sm:h-8" />
                                
                                {isTwoVsTwoMode && (isCurLeader || isCurPartner) && (
                                  <div className="absolute top-[-3px] right-[-3px] w-4 h-4 rounded-full bg-sky-500/90 border border-slate-950 flex items-center justify-center text-[7px] font-black text-white">
                                    {isCurLeader ? '主' : '副'}
                                  </div>
                                )}

                                {char.id === p2LeaderChar.id && !isTwoVsTwoMode && (
                                  <span className="absolute bottom-[-1px] left-[-1px] w-1.5 h-1.5 rounded-full bg-orange-500 border border-slate-950 animate-pulse" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Slide Right Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            audio.playSelect();
                            scrollP1Category(cat.id, 'right');
                          }}
                          className="absolute right-[-2px] z-10 p-1 rounded-full bg-slate-900/95 border border-slate-800 text-slate-400 hover:text-sky-400 opacity-0 group-hover/rail:opacity-100 transition-opacity hidden sm:flex items-center justify-center cursor-pointer shadow-lg active:scale-90"
                          title="向右滑動"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabbed Interactive Skill introductor specification panel */}
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex bg-slate-950/80 p-0.5 rounded-lg border border-slate-900">
              {[
                { tab: 'passive', label: '被動', icon: Sparkles },
                { tab: 'active', label: '戰術', icon: Flame },
                { tab: 'ultimate', label: '大招', icon: Zap },
                { tab: 'lore', label: '研究', icon: BookOpen }
              ].map(item => {
                const Icon = item.icon;
                const isActive = p1Tab === item.tab;
                return (
                  <button
                    key={`p1-tab-${item.tab}`}
                    onClick={() => {
                      audio.playSelect();
                      setP1Tab(item.tab as any);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1 py-1 text-[9px] sm:text-[10px] font-bold rounded-md transition-all ${
                      isActive 
                        ? 'bg-sky-600/15 text-sky-400 border border-sky-500/20' 
                        : 'text-slate-500 hover:text-slate-350 hover:bg-slate-900/30'
                    }`}
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Spec Output area formatted precisely with colored parameters */}
            <div className="bg-slate-950/65 rounded-xl p-2.5 sm:p-4 border border-slate-900 min-h-[110px] sm:min-h-[160px] text-left">
              {p1Tab === 'lore' ? (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] sm:text-xs font-bold text-sky-400 flex items-center gap-1 pb-1 border-b border-slate-900">
                    <BookOpen className="w-3 h-3" />
                    <span>機體秘境履歷一覽</span>
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 leading-normal font-sans mt-0.5">
                    {p1ActiveChar.story}
                  </p>
                  <p className="text-[10px] font-bold text-sky-500/90 mt-1 bg-sky-500/5 py-0.5 px-2.5 border border-sky-500/10 rounded-lg italic">
                    登場台詞：「{p1ActiveChar.quotes?.select}」
                  </p>
                </div>
              ) : (
                (() => {
                  const s = getParsedStats(p1ActiveChar, p1Tab as any);
                  return (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-1">
                        <span className="text-[11px] sm:text-xs font-black text-sky-300 flex items-center gap-1.5">
                          {p1Tab === 'passive' ? <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> : p1Tab === 'active' ? <Flame className="w-3.5 h-3.5 text-orange-500" /> : <Zap className="w-3.5 h-3.5 text-indigo-500" />}
                          <span>{s.name}</span>
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
                          {p1Tab === 'passive' ? '常駐干涉' : p1Tab === 'active' ? '主動碰撞' : '超載加載'}
                        </span>
                      </div>

                      <p className="text-[10px] sm:text-[11px] text-slate-400 leading-normal font-sans">
                        {p1ActiveChar.skillDesc}
                      </p>

                      <hr className="border-slate-900/60" />

                      {/* Numeric values formatted with corresponding instructions colors */}
                      <div className="grid grid-cols-2 gap-1 mt-0.5 text-[9px] sm:text-[10px] font-mono">
                        <div className="flex flex-col gap-0.5 bg-slate-900/35 p-1 rounded border border-slate-855">
                          <span className="text-slate-500">核心傷害/爆發值:</span>
                          <span className="font-extrabold text-[#ef4444] truncate">{s.damage}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 bg-slate-900/35 p-1 rounded border border-slate-855">
                          <span className="text-slate-500">超頻冷卻計時:</span>
                          <span className="font-extrabold text-[#38bdf8] truncate">{s.cooldown}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 bg-slate-900/35 p-1 rounded border border-slate-855">
                          <span className="text-slate-500">作用域/半徑:</span>
                          <span className="font-extrabold text-amber-500 truncate">{s.range}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 bg-slate-900/35 p-1 rounded border border-slate-855">
                          <span className="text-slate-500">特殊連鎖交互:</span>
                          <span className="font-extrabold text-emerald-400 truncate">{s.mechanic}</span>
                        </div>
                      </div>

                      <div className="mt-0.5 bg-slate-950 p-1.5 border border-slate-900 rounded-lg">
                        <p className="text-[8px] sm:text-[10px] text-slate-500 leading-relaxed text-left">
                          <strong className="text-slate-400">運轉細節:</strong> {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>

        {/* COLUMN B: Player 2 (Orange Flame Camp) */}
        <div className={`flex flex-col gap-2.5 sm:gap-4 rounded-2xl sm:rounded-3xl border border-slate-900/60 p-3 sm:p-5 bg-gradient-to-b from-orange-950/15 to-slate-950/50 backdrop-blur shadow-xl relative`}>
          {/* Camp corner label */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="font-mono text-[9px] font-black text-orange-400 uppercase tracking-widest">
              P2 (橙)
            </span>
          </div>

          {/* Slot active controls (only relevant if 2v2 mode is selected) */}
          {isTwoVsTwoMode ? (
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              <button
                onClick={() => {
                  audio.playSelect();
                  setP2FocusSlot('leader');
                }}
                className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                  p2FocusSlot === 'leader'
                    ? 'bg-orange-950/55 border-orange-500/50 text-orange-250 shadow-md shadow-orange-500/5'
                    : 'bg-slate-950/40 border-slate-850 hover:bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="w-6 h-6 rounded bg-orange-500/10 border border-orange-400/20 flex items-center justify-center text-[10px] shrink-0 font-bold text-orange-400">
                  主
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] uppercase font-mono text-orange-500 font-extrabold leading-none">核心主將</div>
                  <div className="text-xs font-bold truncate max-w-[90px]">{p2LeaderChar.name}</div>
                </div>
                {p2FocusSlot === 'leader' && <div className="ml-auto w-1 h-1 rounded-full bg-orange-400 animate-pulse" />}
              </button>

              <button
                onClick={() => {
                  audio.playSelect();
                  setP2FocusSlot('partner');
                }}
                className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                  p2FocusSlot === 'partner'
                    ? 'bg-orange-950/55 border-orange-500/50 text-orange-250 shadow-md shadow-orange-500/5'
                    : 'bg-slate-950/40 border-slate-850 hover:bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="w-6 h-6 rounded bg-orange-400/10 border border-orange-300/10 flex items-center justify-center text-[10px] shrink-0 font-bold text-orange-300">
                  副
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] uppercase font-mono text-orange-400 font-extrabold leading-none">協同副將</div>
                  <div className="text-xs font-bold truncate max-w-[90px]">{p2PartnerChar.name}</div>
                </div>
                {p2FocusSlot === 'partner' && <div className="ml-auto w-1 h-1 rounded-full bg-orange-400 animate-pulse" />}
              </button>
            </div>
          ) : (
            <div className="h-2" />
          )}

          {/* Compact Hero Showcase Board */}
          <div className="flex flex-row items-center gap-3 sm:gap-5 bg-slate-950/40 border border-slate-900 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-inner text-left w-full">
            {/* Sphere Avatar Showcase */}
            <div className="relative flex items-center justify-center w-16 h-16 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-850/80 p-1 sm:p-2 shadow-2xl flex-shrink-0">
              {/* Outer pulsing glow matching color */}
              <div 
                className="absolute inset-0 rounded-xl sm:rounded-2xl blur-xl opacity-30 transition-all duration-500 animate-pulse"
                style={{ backgroundColor: p2ActiveChar.color }}
              />
              <CharacterVectorIcon 
                characterId={p2ActiveChar.id} 
                className="w-full h-full transform scale-105 sm:scale-110 active:scale-125 transition-transform duration-300 animate-dragBreathing" 
              />
              
              {/* Overlaid HP badge */}
              <div className="absolute bottom-0.5 right-0.5 bg-slate-900/95 border border-emerald-500/30 text-emerald-400 text-[8px] sm:text-[10px] font-mono font-black px-1 sm:px-2 py-0.5 rounded shadow-lg">
                HP {p2ActiveChar.initialHp}
              </div>
            </div>

            {/* Quick specifications and Titles */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded font-extrabold border ${getRoleColors(p2ActiveChar.role)}`}>
                  {getCharacterLabel(p2ActiveChar.role)}
                </span>
                <span className="text-[8px] sm:text-[10px] bg-slate-900 border border-slate-800 text-slate-350 font-mono px-1.5 py-0.5 rounded">
                  {p2ActiveChar.mass < 0.6 ? '輕盈' : p2ActiveChar.mass > 1.2 ? '玄金' : '中庸'}
                </span>
                <span className={`text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                  CHARACTER_METADATA[p2ActiveChar.id]?.difficulty === 'easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                  CHARACTER_METADATA[p2ActiveChar.id]?.difficulty === 'medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                  'text-rose-400 bg-rose-500/10 border-rose-500/20'
                }`}>
                  {CHARACTER_METADATA[p2ActiveChar.id]?.difficulty === 'easy' ? '新手推薦' :
                   CHARACTER_METADATA[p2ActiveChar.id]?.difficulty === 'medium' ? '高手進階' : '專家操作'}
                </span>
              </div>
              
              <h3 className="text-sm sm:text-lg font-black text-slate-100 tracking-tight mt-1 truncate">
                {p2ActiveChar.name}
              </h3>
              <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 mt-0.5 leading-normal italic truncate">
                「{p2ActiveChar.title}」
              </p>

              {/* Custom Tags */}
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {CHARACTER_METADATA[p2ActiveChar.id]?.tags?.map(tag => (
                  <span key={tag} className="text-[8px] sm:text-[9.5px] text-orange-400/90 bg-orange-500/5 border border-orange-505/10 px-1.5 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* Basic spec parameters in beautiful progress badges */}
              <div className="grid grid-cols-2 gap-1.5 mt-2 text-[9px] sm:text-[11px] font-mono">
                <div className="flex items-center gap-1 text-slate-400 bg-slate-950/65 p-1 sm:p-1.5 rounded-lg border border-slate-850">
                  <Activity className="w-3 h-3 text-orange-400 shrink-0" />
                  <span className="truncate">移速: <strong className="text-white">{(p2ActiveChar.speed * 100).toFixed(0)}%</strong></span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 bg-slate-950/65 p-1 sm:p-1.5 rounded-lg border border-slate-850">
                  <Shield className="w-3 h-3 text-purple-400 shrink-0" />
                  <span className="truncate">重量: <strong className="text-white">{(p2ActiveChar.mass * 100).toFixed(0)}%</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Categorized Selection Board with smooth swipes & chevrons */}
          <div className="flex flex-col gap-2 mt-1 border-t border-slate-900/60 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-extrabold block text-left">
                📦 球體成員分類選取 (可滑動與折疊)
              </span>
              <button
                onClick={() => {
                  audio.playSelect();
                  const allClosed = Object.values(p2ExpandedCategories).every(v => !v);
                  const nextVal = allClosed;
                  const nextMap: Record<string, boolean> = {};
                  CATEGORIES.forEach(cat => { nextMap[cat.id] = nextVal; });
                  setP2ExpandedCategories(nextMap);
                }}
                className="px-2 py-0.5 rounded bg-slate-950/60 hover:bg-slate-900 border border-slate-850 text-[9px] text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-tight cursor-pointer"
              >
                {Object.values(p2ExpandedCategories).every(v => !v) ? '展開全部 📂' : '摺疊全部 📁'}
              </button>
            </div>

            {/* P2 Search, Filter & Sort Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-0.5 mb-1.5 bg-slate-950/40 p-2 rounded-xl border border-slate-900/40 text-left">
              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  value={p2SearchQuery}
                  onChange={(e) => setP2SearchQuery(e.target.value)}
                  placeholder="搜尋球體名稱、技能..."
                  className="w-full pl-7 pr-6 py-1 text-[10px] sm:text-[11px] bg-slate-950 border border-slate-850 hover:border-slate-750 focus:border-sky-500/80 rounded-lg text-slate-200 placeholder-slate-550 focus:outline-none transition-all"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] pointer-events-none">🔍</span>
                {p2SearchQuery && (
                  <button 
                    onClick={() => setP2SearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-[10px] px-1 focus:outline-none"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort selector pills */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                <span className="text-[9px] text-slate-500 font-bold shrink-0">排序:</span>
                {[
                  { id: 'default', label: '預設' },
                  { id: 'hp', label: 'HP' },
                  { id: 'speed', label: '移速' },
                  { id: 'mass', label: '重量' },
                  { id: 'difficulty', label: '難度' }
                ].map(opt => (
                  <button
                    key={`p2-sort-${opt.id}`}
                    onClick={() => { audio.playSelect(); setP2SortBy(opt.id as any); }}
                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded transition-all shrink-0 cursor-pointer ${
                      p2SortBy === opt.id 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                        : 'bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Difficulty filter pills */}
              <div className="col-span-1 sm:col-span-2 flex items-center gap-1 overflow-x-auto scrollbar-none py-1 border-t border-slate-900/45 mt-0.5">
                <span className="text-[9px] text-slate-500 font-bold shrink-0">難度:</span>
                {[
                  { id: 'all', label: '全部' },
                  { id: 'easy', label: '🟢 新手' },
                  { id: 'medium', label: '🟡 進階' },
                  { id: 'hard', label: '🔴 專家' }
                ].map(opt => (
                  <button
                    key={`p2-diff-${opt.id}`}
                    onClick={() => { audio.playSelect(); setP2FilterDiff(opt.id as any); }}
                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded transition-all shrink-0 cursor-pointer ${
                      p2FilterDiff === opt.id 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                        : 'bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-none">
              {getProcessedCharsCount('p2') === 0 && (
                <div className="text-center py-8 text-slate-500 text-[11px] font-medium border border-slate-900/50 rounded-xl bg-slate-950/20">
                  🔍 未找到符合搜尋與篩選條件的球體成員
                </div>
              )}

              {CATEGORIES.map(cat => {
                const catChars = getProcessedChars('p2', cat.id);
                if (catChars.length === 0) return null;
                const isOpen = p2ExpandedCategories[cat.id];

                return (
                  <div key={`p2-cat-${cat.id}`} className="flex flex-col gap-1 bg-slate-950/30 border border-slate-900/80 rounded-xl p-1.5">
                    {/* Collapsible header */}
                    <div
                      onClick={() => {
                        audio.playSelect();
                        setP2ExpandedCategories(prev => ({ ...prev, [cat.id]: !prev[cat.id] }));
                      }}
                      className="flex items-center justify-between px-2 py-1 rounded bg-slate-950/55 hover:bg-slate-950/95 border border-slate-900/40 cursor-pointer transition-all select-none"
                    >
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                        <span className="text-sm shrink-0">{cat.icon}</span>
                        <span>{cat.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono font-normal">({catChars.length}名)</span>
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                        <span>{isOpen ? '收納' : '展開'}</span>
                        {isOpen ? <ChevronUp className="w-3 h-3 text-slate-550" /> : <ChevronDown className="w-3 h-3 text-slate-550" />}
                      </div>
                    </div>

                    {/* Expandable Character list container */}
                    {isOpen && (
                      <div className="relative w-full flex items-center group/rail px-1">
                        {/* Slide Left Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            audio.playSelect();
                            scrollP2Category(cat.id, 'left');
                          }}
                          className="absolute left-[-2px] z-10 p-1 rounded-full bg-slate-900/95 border border-slate-800 text-slate-400 hover:text-sky-400 opacity-0 group-hover/rail:opacity-100 transition-opacity hidden sm:flex items-center justify-center cursor-pointer shadow-lg active:scale-90"
                          title="向左滑動"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>

                        {/* Swipeable List */}
                        <div
                          ref={(el) => { p2CategoryRefs.current[cat.id] = el; }}
                          className="flex-1 flex gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none touch-pan-x scroll-smooth select-none"
                        >
                          {catChars.map((char) => {
                            const origIdx = characters.findIndex(c => c.id === char.id);
                            const isCurLeader = p2Index === origIdx;
                            const isCurPartner = isTwoVsTwoMode && p2PartnerIndex === origIdx;
                            const isFocused = p2FocusSlot === 'leader' ? isCurLeader : isCurPartner;

                            return (
                              <button
                                key={`p2-thumb-${char.id}`}
                                onClick={() => handleSelectCharIndex(origIdx, 'p2')}
                                onMouseEnter={() => handleThumbHover(char, 'p2', true)}
                                onMouseLeave={() => handleThumbHover(char, 'p2', false)}
                                className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-950 border-2 transition-all p-0.5 flex-shrink-0 flex items-center justify-center cursor-pointer ${
                                  isFocused
                                    ? 'border-orange-500 scale-105 shadow-[0_0_12px_rgba(249,115,22,0.25)]'
                                    : isCurLeader || isCurPartner
                                      ? 'border-slate-800 bg-slate-900/60 opacity-65'
                                      : 'border-slate-900 hover:border-slate-700 bg-slate-950'
                                }`}
                                style={{
                                  boxShadow: isFocused ? `0 0 10px ${char.color}33` : 'none'
                                }}
                              >
                                <CharacterVectorIcon characterId={char.id} className="w-7 h-7 sm:w-8 sm:h-8" />
                                
                                {isTwoVsTwoMode && (isCurLeader || isCurPartner) && (
                                  <div className="absolute top-[-3px] right-[-3px] w-4 h-4 rounded-full bg-orange-500/90 border border-slate-950 flex items-center justify-center text-[7px] font-black text-white">
                                    {isCurLeader ? '主' : '副'}
                                  </div>
                                )}

                                {char.id === p1LeaderChar.id && !isTwoVsTwoMode && (
                                  <span className="absolute bottom-[-1px] left-[-1px] w-1.5 h-1.5 rounded-full bg-sky-500 border border-slate-950 animate-pulse" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Slide Right Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            audio.playSelect();
                            scrollP2Category(cat.id, 'right');
                          }}
                          className="absolute right-[-2px] z-10 p-1 rounded-full bg-slate-900/95 border border-slate-800 text-slate-400 hover:text-sky-400 opacity-0 group-hover/rail:opacity-100 transition-opacity hidden sm:flex items-center justify-center cursor-pointer shadow-lg active:scale-90"
                          title="向右滑動"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabbed Interactive Skill introductor specification panel */}
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex bg-slate-950/80 p-0.5 rounded-lg border border-slate-900">
              {[
                { tab: 'passive', label: '被動', icon: Sparkles },
                { tab: 'active', label: '戰術', icon: Flame },
                { tab: 'ultimate', label: '大招', icon: Zap },
                { tab: 'lore', label: '研究', icon: BookOpen }
              ].map(item => {
                const Icon = item.icon;
                const isActive = p2Tab === item.tab;
                return (
                  <button
                    key={`p2-tab-${item.tab}`}
                    onClick={() => {
                      audio.playSelect();
                      setP2Tab(item.tab as any);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1 py-1 text-[9px] sm:text-[10px] font-bold rounded-md transition-all ${
                      isActive 
                        ? 'bg-orange-600/15 text-orange-400 border border-orange-500/20' 
                        : 'text-slate-500 hover:text-slate-350 hover:bg-slate-900/30'
                    }`}
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Spec Output area formatted precisely with colored parameters */}
            <div className="bg-slate-950/65 rounded-xl p-2.5 sm:p-4 border border-slate-900 min-h-[110px] sm:min-h-[160px] text-left">
              {p2Tab === 'lore' ? (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] sm:text-xs font-bold text-orange-400 flex items-center gap-1 pb-1 border-b border-slate-900">
                    <BookOpen className="w-3 h-3" />
                    <span>機體秘境履歷一覽</span>
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 leading-normal font-sans mt-0.5">
                    {p2ActiveChar.story}
                  </p>
                  <p className="text-[10px] font-bold text-orange-500/90 mt-1 bg-orange-500/5 py-0.5 px-2.5 border border-orange-500/10 rounded-lg italic">
                    登場台詞：「{p2ActiveChar.quotes?.select}」
                  </p>
                </div>
              ) : (
                (() => {
                  const s = getParsedStats(p2ActiveChar, p2Tab as any);
                  return (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-1">
                        <span className="text-[11px] sm:text-xs font-black text-orange-300 flex items-center gap-1.5">
                          {p2Tab === 'passive' ? <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> : p2Tab === 'active' ? <Flame className="w-3.5 h-3.5 text-orange-500" /> : <Zap className="w-3.5 h-3.5 text-indigo-500" />}
                          <span>{s.name}</span>
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                          {p2Tab === 'passive' ? '常駐干涉' : p2Tab === 'active' ? '主動碰撞' : '超載加載'}
                        </span>
                      </div>

                      <p className="text-[10px] sm:text-[11px] text-slate-400 leading-normal font-sans">
                        {p2ActiveChar.skillDesc}
                      </p>

                      <hr className="border-slate-900/60" />

                      {/* Numeric values formatted with corresponding instructions colors */}
                      <div className="grid grid-cols-2 gap-1 mt-0.5 text-[9px] sm:text-[10px] font-mono">
                        <div className="flex flex-col gap-0.5 bg-slate-900/35 p-1 rounded border border-slate-855">
                          <span className="text-slate-500">核心傷害/爆發值:</span>
                          <span className="font-extrabold text-[#ef4444] truncate">{s.damage}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 bg-slate-900/35 p-1 rounded border border-slate-855">
                          <span className="text-slate-500">超頻冷卻計時:</span>
                          <span className="font-extrabold text-[#38bdf8] truncate">{s.cooldown}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 bg-slate-900/35 p-1 rounded border border-slate-855">
                          <span className="text-slate-500">作用域/半徑:</span>
                          <span className="font-extrabold text-amber-500 truncate">{s.range}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 bg-slate-900/35 p-1 rounded border border-slate-855">
                          <span className="text-slate-500">特殊連鎖交互:</span>
                          <span className="font-extrabold text-emerald-400 truncate">{s.mechanic}</span>
                        </div>
                      </div>

                      <div className="mt-0.5 bg-slate-950 p-1.5 border border-slate-900 rounded-lg">
                        <p className="text-[8px] sm:text-[10px] text-slate-500 leading-relaxed text-left">
                          <strong className="text-slate-400">運轉細節:</strong> {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Global Floating Tooltip Popover near selection list */}
      {hoveredCharId && (
        (() => {
          const hoveredChar = characters.find(c => c.id === hoveredCharId);
          if (!hoveredChar) return null;
          return (
            <div 
              className={`fixed z-50 bg-slate-950/95 border text-left p-3.5 rounded-xl shadow-2xl transition-all duration-200 w-64 ${
                tooltipSide === 'p1' 
                  ? 'bottom-24 left-4 sm:left-12 border-sky-500/40 shadow-sky-950/40' 
                  : 'bottom-24 right-4 sm:right-12 border-orange-500/40 shadow-orange-950/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <CharacterVectorIcon characterId={hoveredChar.id} className="w-7 h-7 shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-white">{hoveredChar.name}</h4>
                  <span className="text-[9px] text-slate-400 block font-bold mt-0.5">「{hoveredChar.title}」</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-900 pt-1.5 font-sans">
                {hoveredChar.skillDesc}
              </p>
              <div className="flex items-center justify-between text-[9px] font-mono mt-2 pt-1 border-t border-slate-900 text-slate-500">
                <span>HP: <strong className="text-emerald-400">{hoveredChar.initialHp}</strong></span>
                <span>速度: <strong className="text-sky-400">{(hoveredChar.speed*100).toFixed(0)}%</strong></span>
                <span>難度: <strong className={
                  CHARACTER_METADATA[hoveredChar.id]?.difficulty === 'easy' ? 'text-emerald-400' :
                  CHARACTER_METADATA[hoveredChar.id]?.difficulty === 'medium' ? 'text-amber-400' :
                  'text-rose-400'
                }>{
                  CHARACTER_METADATA[hoveredChar.id]?.difficulty === 'easy' ? '新手' :
                  CHARACTER_METADATA[hoveredChar.id]?.difficulty === 'medium' ? '進階' : '專家'
                }</strong></span>
              </div>
            </div>
          );
        })()
      )}

      {/* 4. Real-time mirror warning badge */}
      {isMirrorMatch && (
        <div className="text-center text-[10px] text-yellow-500/90 bg-yellow-500/5 border border-yellow-500/10 py-2.5 px-4 rounded-xl max-w-sm mx-auto w-full font-mono font-bold animate-pulse flex items-center justify-center gap-1.5 shadow">
          <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
          <span>經典鏡像同角賽 (Mirror Matchup Active)</span>
        </div>
      )}

      {/* 5. Custom Mode Mutator Settings Panel Drawer (Collapsible) */}
      {isCustomMode && (
        <div className="bg-slate-900/35 border border-indigo-500/15 rounded-3xl p-5 shadow-2xl relative">
          <div className="absolute top-4 right-4 text-[9px] uppercase font-mono font-extrabold text-indigo-400 tracking-wider">
            Mutator Panel Active
          </div>
          <div className="text-xs font-black text-indigo-400 tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2.5 mb-4 text-left">
            <Settings className="w-4.5 h-4.5 text-indigo-400" />
            <span>自定義副選項戰場設置</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {/* Ambient weather selector */}
            <div className="bg-slate-950/65 border border-slate-900 rounded-2xl p-4.5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>戰場天氣環境效果</span>
                </span>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-2">
                  開啟後，局內會隨機突現爆擊雷雲、泥濘、痊癒極光、超量彈跳。
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono font-extrabold">STATUS: {isEnvironmentEnabled ? 'ON' : 'OFF'}</span>
                <button
                  onClick={() => {
                    audio.playSelect();
                    setIsEnvironmentEnabled(!isEnvironmentEnabled);
                  }}
                  className={`relative inline-flex h-5.5 w-10.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    isEnvironmentEnabled ? 'bg-emerald-600' : 'bg-slate-800'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition duration-200 ${
                    isEnvironmentEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Dynamic speed limits */}
            <div className="bg-slate-950/65 border border-slate-900 rounded-2xl p-4.5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>最大反彈速度上限 ({customSpeedLimit.toFixed(1)}%)</span>
                </span>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-2">
                  調整球體物理碰撞後的最高受力移速閾值，數值越高對撞衝擊越猛烈。
                </p>
              </div>
              <div className="mt-4 flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-900 text-center">
                {[9.5, 20.5, 29.0].map(limit => (
                  <button
                    key={`lim-${limit}`}
                    onClick={() => { audio.playSelect(); setCustomSpeedLimit(limit); }}
                    className={`flex-1 py-1 text-[10px] font-bold rounded transition-colors cursor-pointer ${
                      customSpeedLimit === limit ? 'bg-indigo-650 text-white font-extrabold shadow' : 'text-slate-500'
                    }`}
                  >
                    {limit === 9.5 ? '普通' : limit === 20.5 ? '高階' : '鬼神'}
                  </button>
                ))}
              </div>
            </div>

            {/* Shrinking systems */}
            <div className="bg-slate-950/65 border border-slate-900 rounded-2xl p-4.5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Minimize2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>動態縮圈警戒系統</span>
                </span>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-2">
                  每 1.5s 收縮場地邊緣，呈現金色警戒牆面線。
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono font-extrabold">STATUS: {isShrinkingArenaEnabled ? 'ON' : 'OFF'}</span>
                <button
                  onClick={() => {
                    audio.playSelect();
                    setIsShrinkingArenaEnabled(!isShrinkingArenaEnabled);
                  }}
                  className={`relative inline-flex h-5.5 w-10.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    isShrinkingArenaEnabled ? 'bg-orange-600' : 'bg-slate-800'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition duration-200 ${
                    isShrinkingArenaEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Wind Vortex systems */}
            <div className="bg-slate-950/65 border border-slate-900 rounded-2xl p-4.5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>狂風黑洞拉扯風場</span>
                </span>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-2">
                  每 30s 生成流浪風洞，入洞獲爆突動力及移速加載。
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono font-extrabold">STATUS: {isWindVortexEnabled ? 'ON' : 'OFF'}</span>
                <button
                  onClick={() => {
                    audio.playSelect();
                    setIsWindVortexEnabled(!isWindVortexEnabled);
                  }}
                  className={`relative inline-flex h-5.5 w-10.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    isWindVortexEnabled ? 'bg-sky-600' : 'bg-slate-800'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition duration-200 ${
                    isWindVortexEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Double Portals systems */}
            <div className="bg-slate-950/65 border border-slate-900 rounded-2xl p-4.5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>雙向空間傳送門</span>
                </span>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-2">
                  地圖左上、右上新增超感官蟲洞，提供無慣性雙向傳送門傳移 (不加載速度)。
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono font-extrabold">STATUS: {isPortalEnabled ? 'ON' : 'OFF'}</span>
                <button
                  onClick={() => {
                    audio.playSelect();
                    setIsPortalEnabled(!isPortalEnabled);
                  }}
                  className={`relative inline-flex h-5.5 w-10.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    isPortalEnabled ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition duration-200 ${
                    isPortalEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* 8-Player single elimination tournament */}
            <div className="bg-slate-950/65 border border-slate-900 rounded-2xl p-4.5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                  <Swords className="w-4 h-4 text-yellow-500 shrink-0" />
                  <span>8強單敗淘汰錦標賽</span>
                </span>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-2 flex-grow font-sans">
                  挑選 8 位角色，自動分組進行半準決賽、準決賽與總決賽，首創擊敗 3秒自動下一輪！
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono font-extrabold font-mono">STATUS: {isTournamentActive ? 'ON' : 'OFF'}</span>
                <button
                  onClick={() => {
                    audio.playSelect();
                    setIsTournamentActive(!isTournamentActive);
                  }}
                  className={`relative inline-flex h-5.5 w-10.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    isTournamentActive ? 'bg-yellow-600' : 'bg-slate-800'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition duration-200 ${
                    isTournamentActive ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* 8-Player Tournament Active config drawer */}
          {isTournamentActive && (
            <div className="mt-4 p-5 bg-slate-900/40 border border-yellow-500/10 rounded-2xl text-left font-sans shadow-2xl relative overflow-hidden backdrop-blur-md animate-fadeIn">
              {/* Subtle visual ambient top glow to indicate special mode */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-900 pb-3 mb-4 gap-3">
                <div>
                  <span className="text-xs font-black text-yellow-400 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                    🏆 錦標賽主將選配官 ({tournamentParticipants.length} / 8)
                  </span>
                  <div className="flex gap-2 mt-2 mb-2 bg-slate-950/80 p-0.5 rounded-xl border border-slate-850/80 w-fit">
                    <button
                      type="button"
                      onClick={() => {
                        audio.playSelect();
                        setTournamentType('elimination');
                      }}
                      className={`px-3.5 py-1.5 text-[10px] font-black rounded-lg cursor-pointer transition-all ${
                        tournamentType === 'elimination'
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md transform scale-102'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                      }`}
                    >
                      單敗淘汰賽 (BO1)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        audio.playSelect();
                        setTournamentType('points');
                      }}
                      className={`px-3.5 py-1.5 text-[10px] font-black rounded-lg cursor-pointer transition-all ${
                        tournamentType === 'points'
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md transform scale-102'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                      }`}
                    >
                      多局總積分賽 (BO5)
                    </button>
                  </div>
                  <p className="text-[9.5px] text-slate-500 mt-0.5 leading-relaxed max-w-md">
                    {tournamentType === 'points'
                      ? '【個人積分賽】採取 5 局 20 場總積分制，全員不淘汰打滿 5 局。每局結算排名依序給予 7/6/5/4/3/2/2/1 積分，同分時比較首名次數與第五局名次。'
                      : '【單敗淘汰賽】前 2位一組、3與4一組依次進行一戰制淘汰，存活者晉級至下一輪。'
                    }
                  </p>
                </div>
                <div className="flex gap-2.5 shrink-0">
                  <button
                    onClick={() => {
                      audio.playSelect();
                      setTournamentParticipants([0, 1, 2, 3, 4, 5, 6, 7]);
                    }}
                    className="px-3 py-1.5 text-[9px] bg-slate-950/80 hover:bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl font-extrabold cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                  >
                    <span>⚡ 一鍵前八</span>
                  </button>
                  <button
                    onClick={() => {
                      audio.playSelect();
                      const pool = Array.from({ length: characters.length }, (_, i) => i);
                      const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, 8);
                      setTournamentParticipants(shuffled);
                    }}
                    className="px-3 py-1.5 text-[9px] bg-slate-950/80 hover:bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl font-extrabold cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                  >
                    <span>🎲 隨機配偶</span>
                  </button>
                  <button
                    onClick={() => {
                      audio.playSelect();
                      setTournamentParticipants([]);
                    }}
                    className="px-2.5 py-1.5 text-[9px] bg-slate-950/80 hover:bg-red-505/10 border border-red-500/15 text-red-400 rounded-xl font-extrabold cursor-pointer transition-all active:scale-95"
                  >
                    重置
                  </button>
                </div>
              </div>

              {/* Tournament Starting Grid visualization */}
              <div className="bg-slate-950/80 border border-slate-900/60 rounded-xl p-3.5 mb-4.5 shadow-inner">
                <span className="text-[9px] font-mono font-black text-slate-400 block mb-2.5 uppercase tracking-wider">
                  ⚔️ 八強擂台對戰佈陣 (Starting Battle Slots)
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
                  {Array.from({ length: 8 }).map((_, seatIdx) => {
                    const charIdx = tournamentParticipants[seatIdx];
                    const char = charIdx !== undefined ? characters[charIdx] : null;
                    return (
                      <div 
                        key={`seat-${seatIdx}`}
                        className={`relative rounded-xl border p-2 flex flex-col items-center justify-center transition-all min-h-[5.5rem] group overflow-hidden ${
                          char 
                            ? 'bg-gradient-to-b from-yellow-500/5 to-slate-950 border-yellow-500/30 text-slate-200 shadow shadow-yellow-500/5 hover:border-yellow-550'
                            : 'bg-slate-950/50 border-dashed border-slate-900 text-slate-600'
                        }`}
                      >
                        {char ? (
                          <>
                            {/* Seat Badge */}
                            <span className="absolute top-1 left-1.5 text-[8.5px] font-mono font-black px-1.5 py-0.2 rounded-full bg-yellow-500 text-slate-950 shadow scale-90">
                              #{seatIdx + 1}
                            </span>
                            
                            {/* Remove button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                audio.playSelect();
                                setTournamentParticipants(prev => prev.filter(i => i !== charIdx));
                              }}
                              className="absolute top-1 right-1 w-4 h-4 bg-slate-900 hover:bg-red-950 text-red-400 border border-slate-800 rounded-full flex items-center justify-center text-[9px] font-black cursor-pointer opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                              title="移除此席位"
                            >
                              ✕
                            </button>

                            <div className="w-8.5 h-8.5 bg-slate-950 border border-slate-900/60 rounded-lg flex items-center justify-center mb-1 shadow-inner mt-1">
                              <CharacterVectorIcon characterId={char.id} className="w-6.5 h-6.5" />
                            </div>
                            <span className="text-[10px] font-bold truncate text-yellow-400 text-center w-full">
                              {char.name}
                            </span>
                            <span className="text-[8px] text-slate-500 font-bold tracking-tight truncate w-full text-center">
                              {char.type}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-[8.5px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-slate-900 text-slate-500 mb-2">
                              #{seatIdx + 1}
                            </span>
                            <span className="text-[9px] font-bold text-slate-500">席位待選</span>
                            <span className="text-[7.5px] text-slate-600 font-medium block text-center mt-1 scale-90">點擊下方選取</span>
                          </>
                        )}
                        {/* Divider connectors between pairings */}
                        {seatIdx % 2 === 0 && (
                          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-1.5 h-4 border-y border-r border-slate-900/40 opacity-0 md:opacity-100 uppercase text-[6px] text-slate-700 font-mono font-black select-none pointer-events-none">vs</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Picker Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2">
                {characters.map((char, idx) => {
                  const seatOrder = tournamentParticipants.indexOf(idx);
                  const isSelected = seatOrder !== -1;
                  return (
                    <button
                      key={`tour-select-${char.id}`}
                      onClick={() => {
                        audio.playSelect();
                        if (isSelected) {
                          setTournamentParticipants(prev => prev.filter(i => i !== idx));
                        } else {
                          if (tournamentParticipants.length < 8) {
                            setTournamentParticipants(prev => [...prev, idx]);
                          } else {
                            // If exactly 8, replaces the oldest selection
                            setTournamentParticipants(prev => [...prev.slice(1), idx]);
                          }
                        }
                      }}
                      className={`relative p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-yellow-500/10 border-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.22)] font-extrabold text-yellow-300'
                          : 'bg-slate-950/60 border-slate-900 hover:border-slate-800 opacity-60 hover:opacity-100 hover:bg-slate-950'
                      }`}
                    >
                      {/* Seat indicator badge */}
                      {isSelected && (
                        <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-yellow-500 text-slate-950 text-[9px] font-mono font-black flex items-center justify-center shadow">
                          {seatOrder + 1}
                        </span>
                      )}
                      
                      <CharacterVectorIcon characterId={char.id} className="w-7 h-7" />
                      <span className={`text-[8.5px] font-black mt-1 text-center truncate w-full ${isSelected ? 'text-yellow-405' : 'text-slate-400'}`}>
                        {char.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {tournamentParticipants.length < 8 ? (
                <p className="text-[10px] text-amber-400 font-semibold text-center mt-3 animate-pulse bg-amber-500/5 p-1.5 py-2 border border-amber-500/10 rounded-xl">
                  ⚠️ 請挑選足夠 8 位主將以啟動淘汰對決，當前已配置 ({tournamentParticipants.length} / 8)。
                </p>
              ) : (
                <p className="text-[10px] text-emerald-400 font-semibold text-center mt-3 bg-emerald-500/5 p-1.5 py-2 border border-emerald-500/10 rounded-xl">
                  🏆 已充填 8 個錦標賽終極席位！請點擊下方的「🏆 啟動八強錦標淘汰賽」開啟終極戰局！
                </p>
              )}
            </div>
          )}

          {/* Aesthetic customization presets */}
          <div className="grid md:grid-cols-3 gap-4 text-left border-t border-slate-900 mt-4 pt-4">
            {/* Presets */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-slate-400">外觀皮膚渲染</span>
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-900 text-center">
                {['classic', 'cosmic', 'neon'].map(preset => (
                  <button
                    key={`preset-${preset}`}
                    onClick={() => { audio.playSelect(); setVisualPreset(preset as any); }}
                    className={`py-1 text-[10px] font-bold rounded transition-all cursor-pointer ${
                      visualPreset === preset ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-500'
                    }`}
                  >
                    {preset === 'classic' ? '經典' : preset === 'cosmic' ? '星空' : '龐克'}
                  </button>
                ))}
              </div>
            </div>

            {/* Trail selection */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-slate-400">釋放軌跡風格</span>
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-900 text-center">
                {['sparkle', 'laser', 'pixel'].map(style => (
                  <button
                    key={`trail-${style}`}
                    onClick={() => { audio.playSelect(); setTrailStyle(style as any); }}
                    className={`py-1 text-[10px] font-bold rounded transition-all cursor-pointer ${
                      trailStyle === style ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-500'
                    }`}
                  >
                    {style === 'sparkle' ? '流沙' : style === 'laser' ? '極光' : '像素'}
                  </button>
                ))}
              </div>
            </div>

            {/* Glow power */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-slate-400">光暈爆發強度</span>
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-900 text-center">
                {['delicate', 'radiant', 'ultra'].map(power => (
                  <button
                    key={`glow-${power}`}
                    onClick={() => { audio.playSelect(); setGlowPower(power as any); }}
                    className={`py-1 text-[10px] font-bold rounded transition-all cursor-pointer ${
                      glowPower === power ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-500'
                    }`}
                  >
                    {power === 'delicate' ? '幽微' : power === 'radiant' ? '閃耀' : '超載'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Grand Finalist Action triggers */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4.5 mt-4">
        {/* Handbook codex shortcut */}
        <button
          onClick={() => {
            audio.playSelect();
            setIsHandbookOpen(true);
          }}
          className="w-full sm:w-auto px-5 py-3.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/20 text-slate-300 hover:text-indigo-400 hover:bg-slate-900/60 transition-all rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 group"
        >
          <BookOpen className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span>展開球體奧義圖鑑</span>
        </button>

        {/* Satisfying Random Select */}
        <button
          onClick={handleRandomSelect}
          className="w-full sm:w-auto px-5 py-3.5 bg-slate-900/45 border border-slate-800 hover:border-yellow-500/20 text-slate-300 hover:text-yellow-400 hover:bg-slate-900/60 transition-all rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 group"
        >
          <Dices className="w-4 h-4 text-yellow-400 group-hover:rotate-12 transition-transform" />
          <span>隨機宿命配核 (Random)</span>
        </button>

        {/* Start Game main launch trigger with giant visual glow feedback */}
        {isTournamentActive ? (
          <button
            onClick={() => {
              if (tournamentParticipants.length === 8) {
                onStartTournament(tournamentParticipants);
              } else {
                audio.playSelect();
              }
            }}
            disabled={tournamentParticipants.length !== 8}
            id="initiate-tournament-action-btn"
            className={`w-full sm:w-auto px-10 py-4.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-black hover:from-amber-400 hover:to-yellow-400 hover:shadow-yellow-500/30 transition-all rounded-2.5xl text-sm flex items-center justify-center gap-3 cursor-pointer shadow-xl border border-yellow-300/30 active:scale-98 relative group overflow-hidden ${
              tournamentParticipants.length !== 8 ? 'opacity-40 cursor-not-allowed filter grayscale' : ''
            }`}
          >
            {/* Neon animated glare */}
            <span className="absolute left-[-100%] top-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:left-[100%] transition-all duration-1000" />
            
            <Trophy className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide uppercase">
              {tournamentParticipants.length !== 8 
                ? `請配置 8 位參賽主將 (${tournamentParticipants.length}/8)` 
                : tournamentType === 'points'
                  ? '🏆 啟動八人球體積分對決賽'
                  : '🏆 啟動八強錦標淘汰賽'
              }
            </span>
          </button>
        ) : (
          <button
            onClick={onConfirmBattle}
            id="initiate-battle-action-btn"
            className="w-full sm:w-auto px-10 py-4.5 bg-gradient-to-r from-indigo-600 to-violet-550 text-white font-black hover:from-indigo-500 hover:to-violet-500 transition-all rounded-2.5xl text-sm flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-indigo-600/15 border border-indigo-400/25 active:scale-98 relative group overflow-hidden"
          >
            {/* Neon animated glare */}
            <span className="absolute left-[-100%] top-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[100%] transition-all duration-1000" />
            
            <Swords className="w-5 h-5 text-indigo-200 group-hover:rotate-6 transition-transform" />
            <span className="tracking-wide uppercase">投放載體 • 加載並開戰對決</span>
          </button>
        )}
      </div>

      {/* 🔮 Interactive Multi-Version Patch Notes Modal Window */}
      {isPatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          {/* Main Modal Shell */}
          <div className="w-full max-w-3xl max-h-[85vh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2.5xl border border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-slate-100 relative">
            {/* Ambient Background Glow inside dialog */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur w-full shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black px-2 py-0.5 rounded font-mono tracking-wider">PATCH NOTES</span>
                  <h3 className="text-sm sm:text-base font-black text-slate-100">
                    星艦重力決戰：平衡性更新日誌
                  </h3>
                </div>
              </div>
              <button
                onClick={() => {
                  audio.playSelect();
                  setIsPatchModalOpen(false);
                }}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Core Modal Content containing version sidebar and main details panel */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              {/* Version Navigation Left Rail */}
              <div className="w-24 sm:w-36 bg-slate-950 border-r border-slate-850/60 flex flex-col gap-1 p-2 overflow-y-auto shrink-0 scrollbar-none">
                <span className="text-[9px] font-black text-slate-500 px-2 py-1 select-none uppercase tracking-wider block text-left">
                  歷史版本
                </span>
                {PATCH_LOGS.map((patch, idx) => {
                  const isCur = idx === selectedPatchIndex;
                  return (
                    <button
                      key={patch.version}
                      onClick={() => {
                        audio.playSelect();
                        setSelectedPatchIndex(idx);
                      }}
                      className={`w-full px-2.5 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isCur
                          ? 'bg-indigo-950/45 border-indigo-500/40 text-indigo-300 font-extrabold shadow-sm'
                          : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200 border-none'
                      }`}
                    >
                      <div className="text-xs font-black font-mono leading-tight">{patch.version}</div>
                      <div className="text-[10px] text-slate-500 mt-1 leading-none">{patch.date}</div>
                    </button>
                  );
                })}
              </div>

              {/* Main Update Log Details */}
              <div className="flex-1 flex flex-col p-4 sm:p-5 overflow-y-auto scrollbar-none min-w-0">
                {(() => {
                  const p = PATCH_LOGS[selectedPatchIndex];
                  return (
                    <div className="flex flex-col gap-4 text-left">
                      {/* Patch Title info */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 font-mono">
                          <span>RELEASE DATE: {p.date}</span>
                          <span>•</span>
                          <span>VERSION: {p.version}</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-slate-100 tracking-tight mt-1">
                          {p.title}
                        </h4>
                      </div>

                      {/* Updates Highlights summary card */}
                      <div className="bg-slate-950/60 border border-slate-850/50 p-3 sm:p-4 rounded-xl relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60" />
                        <h5 className="text-[10px] sm:text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-yellow-450" />
                          <span>更新亮點 (Highlights)</span>
                        </h5>
                        <ul className="space-y-1.5 text-[11px] sm:text-[12px] text-slate-300 font-medium list-none pl-0">
                          {p.highlights.map((hl, i) => (
                            <li key={i} className="flex items-start gap-1 pb-1 border-b border-indigo-950/10 last:border-0 leading-normal">
                              <span className="text-emerald-400 select-none shrink-0 mt-0.5">•</span>
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Detailed Individual character balance parameters list */}
                      <div className="space-y-3.5">
                        <h5 className="text-[10px] sm:text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                          <span>具體平衡參數變更 (Balance Alterations)</span>
                        </h5>
                        {p.adjustments.map((adj) => (
                          <div
                            key={adj.characterId}
                            className={`border rounded-xl p-3 sm:p-4 flex flex-col gap-2 relative bg-slate-950/40 ${
                              adj.type === 'buff'
                                ? 'border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.02)]'
                                : adj.type === 'nerf'
                                  ? 'border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.02)]'
                                  : 'border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-bold">
                                  <CharacterVectorIcon characterId={adj.characterId} className="w-5 h-5 animate-dragBreathing" />
                                </div>
                                <div className="text-left">
                                  <span className="text-[10px] font-mono text-slate-500 block leading-none mb-0.5">CHARACTER</span>
                                  <span className="text-xs font-extrabold text-slate-100">{adj.characterName}</span>
                                </div>
                              </div>
                              
                              <span className={`text-[9px] font-black font-mono px-2 py-0.5 rounded-full border ${
                                adj.type === 'buff'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : adj.type === 'nerf'
                                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                              }`}>
                                {adj.type === 'buff' ? '🟢 BUFF 上調' : adj.type === 'nerf' ? '🔴 NERF 削弱' : '🔵 ADJUST 調整'}
                              </span>
                            </div>

                            <div className="text-left mt-1">
                              <span className="text-[10px] text-indigo-300 font-extrabold block">【{adj.title}】</span>
                              <p className="text-[11px] text-slate-400 leading-normal font-medium mt-0.5">{adj.description}</p>
                            </div>

                            {/* Stat comparison key-value lists */}
                            {adj.details && adj.details.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 border-t border-slate-905/30 pt-2 text-[10px] font-mono">
                                {adj.details.map((det, dIdx) => (
                                  <div key={dIdx} className="bg-slate-900/45 border border-slate-850/60 p-1.5 px-2 rounded-lg flex items-center justify-between gap-3 text-left">
                                    <span className="text-slate-400 font-bold truncate shrink-0 max-w-[120px]">{det.stat}</span>
                                    <div className="flex items-center gap-1 text-right ml-auto">
                                      <span className="text-slate-500 line-through truncate">{det.before}</span>
                                      <span className="text-slate-600">→</span>
                                      <span className={`font-black ${
                                        adj.type === 'buff' ? 'text-emerald-400' : adj.type === 'nerf' ? 'text-red-400' : 'text-indigo-400'
                                      } truncate`}>{det.after}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-mono text-slate-500 font-medium">
                星艦引力核心數據庫 • 每週主動校對計量儀
              </span>
              <button
                onClick={() => {
                  audio.playSelect();
                  setIsPatchModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-black text-slate-100 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl hover:text-white transition-all cursor-pointer"
              >
                確認並返回選角
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
