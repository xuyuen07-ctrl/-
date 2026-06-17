import React from 'react';

interface SkillVectorIconProps {
  characterId: string;
  className?: string;
  size?: number | string;
}

export const SkillVectorIcon: React.FC<SkillVectorIconProps> = ({
  characterId,
  className = '',
  size = '100%',
}) => {
  const commonClasses = `inline-block shrink-0 transition-transform duration-300 hover:scale-105 ${className}`;

  if (characterId === 'vampire') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="vampSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="vampSkillFang" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#fca5a5" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#vampSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#4c0519" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3By" />
        <path d="M 50 15 L 43 32 L 50 28 L 57 32 Z" fill="#ef4444" opacity="0.3" />
        {/* Drops of Blood */}
        <path d="M50 62 C50 65, 47 68, 47 71 C47 74, 50 77, 50 77 C50 77, 53 74, 53 71 C53 68, 50 65, 50 62 Z" fill="#fb7185" />
        <path d="M37 50 C37 52, 35 54, 35 56 C35 58, 37 60, 37 60 C37 60, 39 58, 39 56 C39 54, 37 52, 37 50 Z" fill="#f43f5e" />
        <path d="M63 50 C63 52, 61 54, 61 56 C61 58, 63 60, 63 60 C63 60, 65 58, 65 56 C65 54, 63 52, 63 50 Z" fill="#f43f5e" />
        {/* Vampire Sharp Fangs */}
        <path d="M36 34 L43 36 L40 55 Z" fill="url(#vampSkillFang)" stroke="#ef4444" strokeWidth="1" />
        <path d="M64 34 L57 36 L60 55 Z" fill="url(#vampSkillFang)" stroke="#ef4444" strokeWidth="1" />
        {/* Swooping bite slash trace */}
        <path d="M26 40 C34 48, 66 48, 74 40" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M22 45 C32 55, 68 55, 78 45" stroke="#ffe4e6" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      </svg>
    );
  }

  if (characterId === 'mud') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="mudSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eab308" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#451a03" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mudBrick" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#mudSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#1c1917" stroke="#ca8a04" strokeWidth="2" />
        {/* Clay Mud Splatter background */}
        <path d="M30 35 Q40 25, 48 38 T65 32 Q75 42, 62 55 T65 75 Q45 80, 42 63 T22 65 Q18 45, 30 35 Z" fill="#78350f" fillOpacity="0.4" />
        {/* Rock cracks */}
        <path d="M50 22 L50 78 M22 50 L78 50 M30 30 L70 70 M30 70 L70 30" stroke="#b45309" strokeWidth="1" strokeDasharray="4 4" />
        {/* Entangling Feet chains / Mud blocks */}
        <rect x="42" y="42" width="16" height="16" rx="3" fill="url(#mudBrick)" stroke="#ca8a04" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="3" fill="#fef08a animate-pulse" />
        {/* Ground impact ripples */}
        <path d="M 28 50 C 28 35, 72 35, 72 50 C 72 65, 28 65, 28 50" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 6" />
        <path d="M 33 50 C 33 40, 67 40, 67 50 C 67 60, 33 60, 33 50" stroke="#ca8a04" strokeWidth="1.2" />
      </svg>
    );
  }

  if (characterId === 'blaze') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="blazeSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#450a0a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fireBall" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="40%" stopColor="#ea580c" />
            <stop offset="80%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#blazeSkillGlow)" opacity="0.9" />
        <circle cx="50" cy="50" r="38" fill="#450a0a" stroke="#f97316" strokeWidth="2.2" />
        {/* Outer bursting flares */}
        <path d="M50 12 L54 26 L68 18 L58 30 L78 32 L62 40 L84 50 L64 54 L78 68 L58 60 L68 82 L54 68 L50 88 L46 68 L32 82 L42 60 L22 68 L36 54 L16 50 L36 40 L22 32 L42 30 L32 18 L46 26 Z" fill="url(#fireBall)" />
        {/* Core fiery star */}
        <polygon points="50 32, 55 45, 68 45, 58 53, 62 66, 50 58, 38 66, 42 53, 32 45, 45 45" fill="#facc15" stroke="#f97316" strokeWidth="1" />
        <circle cx="50" cy="50" r="6" fill="#ffffff" className="animate-pulse" />
      </svg>
    );
  }

  if (characterId === 'lightning') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="lightSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#lightSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#082f49" stroke="#60a5fa" strokeWidth="2" />
        {/* Wind whirlwind swirls */}
        <path d="M26 36 C40 22, 60 22, 74 36 C78 42, 68 50, 50 50 C32 50, 22 42, 26 36 Z" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 4" fill="none" />
        <path d="M74 64 C60 78, 40 78, 26 64 C22 58, 32 50, 50 50 C68 50, 78 58, 74 64 Z" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 4" fill="none" />
        {/* Central Crackling Lightning Bolt */}
        <path d="M58 18 L34 46 L49 46 L38 82 L70 48 L52 48 Z" fill="url(#boltGrad)" stroke="#60a5fa" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="50" cy="46" r="3.2" fill="#ffffff animate-pulse" />
      </svg>
    );
  }

  if (characterId === 'dice') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="diceSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#450a0a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="neonDice1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="neonDice2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#diceSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
        {/* Cosmic destiny orbits */}
        <ellipse cx="50" cy="50" rx="34" ry="10" stroke="#f472b6" strokeWidth="1.2" strokeDasharray="6 2" transform="rotate(-30 50 50)" />
        <ellipse cx="50" cy="50" rx="34" ry="10" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="6 2" transform="rotate(30 50 50)" />
        {/* Isometric Die 1 */}
        <g transform="translate(30, 42)">
          <polygon points="12 0, 24 6, 24 18, 12 24, 0 18, 0 6" fill="url(#neonDice1)" stroke="#d8b4fe" strokeWidth="1" />
          <polygon points="12 12, 24 6, 12 0, 0 6" fill="#faf5ff" opacity="0.3" />
          <circle cx="12" cy="6" r="1.8" fill="#581c87" />
          <circle cx="6" cy="14" r="1.5" fill="#581c87" />
          <circle cx="18" cy="14" r="1.5" fill="#581c87" />
        </g>
        {/* Isometric Die 2 */}
        <g transform="translate(48, 28)">
          <polygon points="12 0, 24 6, 24 18, 12 24, 0 18, 0 6" fill="url(#neonDice2)" stroke="#fde047" strokeWidth="1" />
          <polygon points="12 12, 24 6, 12 0, 0 6" fill="#fef9c3" opacity="0.3" />
          <circle cx="6" cy="6" r="1.5" fill="#713f12" />
          <circle cx="18" cy="6" r="1.5" fill="#713f12" />
          <circle cx="12" cy="12" r="1.8" fill="#ef4444" /> {/* Red luck spot */}
          <circle cx="6" cy="18" r="1.5" fill="#713f12" />
          <circle cx="18" cy="18" r="1.5" fill="#713f12" />
        </g>
      </svg>
    );
  }

  if (characterId === 'gravity') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="gravSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#4f46e5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#312e81" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#gravSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#030712" stroke="#6366f1" strokeWidth="2" />
        {/* Space fabric grid distortion */}
        <path d="M 50 14 A 36 36 0 0 1 86 50 M 50 86 A 36 36 0 0 1 14 50" stroke="#312e81" strokeWidth="1.5" />
        {/* Spiral wormhole coils */}
        <path d="M50 50 A2 2 0 0 1 52 52 A5 5 0 0 1 45 54 A9 9 0 0 1 40 45 A14 14 0 0 1 50 35 A20 20 0 0 1 70 50 A26 26 0 0 1 50 76 A31 31 0 0 1 19 50" stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
        {/* Event horizon dark gravity singularity */}
        <circle cx="50" cy="50" r="12" fill="#000000" stroke="#818cf8" strokeWidth="2" />
        <circle cx="50" cy="50" r="7" fill="#000000" className="animate-pulse" />
        {/* Sparkling star pull */}
        <circle cx="35" cy="40" r="1.5" fill="#ffffff" />
        <circle cx="65" cy="42" r="1.5" fill="#ffffff" />
        <circle cx="48" cy="62" r="1.2" fill="#818cf8" />
      </svg>
    );
  }

  if (characterId === 'phantom') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="phanSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e879f9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4c0519" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mirrorShard" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#f472b6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#phanSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#180025" stroke="#e879f9" strokeWidth="2" />
        {/* Divided space barrier */}
        <line x1="50" y1="14" x2="50" y2="86" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4 4" />
        {/* Left mirror split, Right phantom outline */}
        <path d="M44 26 L26 44 L38 52 L22 64 L44 74 Z" fill="url(#mirrorShard)" stroke="#f472b6" strokeWidth="1.5" />
        <path d="M56 26 L74 44 L62 52 L78 64 L56 74 Z" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" />
        {/* Entangled crystal centers */}
        <polygon points="34 46, 38 50, 34 54, 30 50" fill="#ffffff" />
        <polygon points="66 46, 70 50, 66 54, 62 50" fill="#a5b4fc" opacity="0.8" />
      </svg>
    );
  }

  if (characterId === 'cat') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="catSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2e1065" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pawSwords" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#faf5ff" />
            <stop offset="45%" stopColor="#d8b4fe" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#catSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#1e1b4b" stroke="#d8b4fe" strokeWidth="2" />
        {/* Cat geometric head silhouette backdrop */}
        <path d="M40 34 L32 18 L48 28 Z" fill="#4c1d95" opacity="0.4" />
        <path d="M60 34 L68 18 L52 28 Z" fill="#4c1d95" opacity="0.4" />
        {/* Triple glowing slash marks of Cat Claw */}
        <path d="M24 64 C28 42, 42 28, 64 24" stroke="url(#pawSwords)" strokeWidth="4" strokeLinecap="round" />
        <path d="M32 72 Q46 44, 72 32" stroke="url(#pawSwords)" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M40 80 C54 62, 68 48, 80 40" stroke="#fbcfe8" strokeWidth="2.5" strokeLinecap="round" />
        {/* Sparkling pink stars of impact */}
        <polygon points="68 28, 72 31, 69 35, 65 32" fill="#f472b6" />
        <polygon points="44 48, 48 50, 45 54, 41 52" fill="#f472b6" />
      </svg>
    );
  }

  if (characterId === 'snake') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="snakeSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="snakeShadow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#snakeSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#022c22" stroke="#10b981" strokeWidth="2" />
        {/* Snake foods */}
        <circle cx="34" cy="30" r="4.5" fill="#fb7185" stroke="#991b1b" strokeWidth="1" className="animate-pulse" />
        <circle cx="68" cy="36" r="3.5" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
        <circle cx="48" cy="68" r="4" fill="#a7f3d0" stroke="#047857" strokeWidth="1" />
        {/* Dynamic Slithering Snake Shadow Wave */}
        <path d="M18 52 Q32 32, 45 52 T70 48 T84 52" stroke="url(#snakeShadow)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M18 52 Q32 32, 45 52 T70 48 T84 52" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 3" fill="none" />
        {/* Poisonous Green Eye glow */}
        <circle cx="78" cy="46" r="1.5" fill="#ca8a04" />
      </svg>
    );
  }

  if (characterId === 'grid9') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="grid9SkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#grid9SkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#0f172a" stroke="#d97706" strokeWidth="2" />
        {/* Processor Grid matrix layout */}
        <rect x="25" y="25" width="50" height="50" rx="4" fill="none" stroke="#ca8a04" strokeWidth="2" />
        {/* Horizontal & vertical lines */}
        <line x1="25" y1="41" x2="75" y2="41" stroke="#ca8a04" strokeWidth="1.2" />
        <line x1="25" y1="59" x2="75" y2="59" stroke="#ca8a04" strokeWidth="1.2" />
        <line x1="41" y1="25" x2="41" y2="75" stroke="#ca8a04" strokeWidth="1.2" />
        <line x1="59" y1="25" x2="59" y2="75" stroke="#ca8a04" strokeWidth="1.2" />
        {/* Matrix glowing elements */}
        <rect x="44" y="28" width="12" height="10" rx="1" fill="#fef08a" opacity="0.9" className="animate-pulse" />
        <rect x="28" y="44" width="10" height="12" rx="1" fill="#b45309" opacity="0.9" />
        <rect x="62" y="44" width="10" height="12" rx="1" fill="#b45309" opacity="0.9" />
        <rect x="44" y="62" width="12" height="10" rx="1" fill="#fef08a" opacity="0.9" className="animate-pulse" />
        {/* Center lucky "5" core node */}
        <circle cx="50" cy="50" r="6" fill="#fbbf24" stroke="#7c2d12" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="2.5" fill="#ffffff" />
      </svg>
    );
  }

  if (characterId === 'water_dragon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="waterSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fluidDrop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#waterSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
        {/* Circular flowing ocean waves */}
        <circle cx="50" cy="50" r="30" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6 3" fill="none" />
        <circle cx="50" cy="50" r="24" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3 4" fill="none" />
        {/* Swirling water curls */}
        <path d="M24 50 Q31 38, 50 38 T76 50 T62 62 T50 50" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Large cosmic teardrop Aqua Pearl */}
        <path d="M50 25 C54 34, 66 38, 66 48 C66 56, 58 64, 50 64 C42 64, 34 56, 34 48 C34 38, 46 34, 50 25 Z" fill="url(#fluidDrop)" stroke="#0ea5e9" strokeWidth="1" />
        <circle cx="50" cy="52" r="3" fill="#ffffff" className="animate-pulse" />
      </svg>
    );
  }

  if (characterId === 'whip') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="whipSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#whipSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
        {/* Whiplash thorns in concentric rays */}
        <circle cx="50" cy="50" r="32" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 6" fill="none" opacity="0.6" />
        {/* Coiled Whip Thorns trail */}
        <path d="M50 20 C65 20, 78 30, 78 48 C78 64, 54 75, 42 63 C33 53, 33 40, 50 50" stroke="#f3e8ff" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M50 20 C65 20, 78 30, 78 48 C78 64, 54 75, 42 63 C33 53, 33 40, 50 50" stroke="#c084fc" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="8 4" fill="none" />
        {/* Pointy Rhombus whip tip */}
        <polygon points="50 22, 53 17, 50 12, 47 17" fill="#ebd5ff" stroke="#a855f7" strokeWidth="1" />
        {/* Impact sparkles */}
        <circle cx="68" cy="28" r="1.5" fill="#ffffff" />
        <circle cx="34" cy="58" r="1.5" fill="#f472b6" />
      </svg>
    );
  }

  if (characterId === 'cosmic_mage') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="cmSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#cmSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#171717" stroke="#22d3ee" strokeWidth="2" />
        {/* Celestial orbital rings cage */}
        <circle cx="50" cy="50" r="31" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
        <rect x="30" y="30" width="40" height="40" rx="3" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="6 2" transform="rotate(45 50 50)" fill="none" />
        <rect x="34" y="34" width="32" height="32" rx="2" stroke="#67e8f9" strokeWidth="1.2" transform="rotate(15 50 50)" fill="none" opacity="0.75" />
        {/* Central glowing core node */}
        <polygon points="50 36, 54 46, 64 50, 54 54, 50 64, 46 54, 36 50, 46 46" fill="#ffffff animate-pulse" />
        <circle cx="50" cy="50" r="2.5" fill="#0891b2" />
      </svg>
    );
  }

  if (characterId === 'conductor') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="condSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="punchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#db2777" />
            <stop offset="100%" stopColor="#9d174d" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#condSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#0c1020" stroke="#3b82f6" strokeWidth="2" />
        {/* Rail lines */}
        <path d="M 20 75 C 38 68, 62 68, 80 75" stroke="#475569" strokeWidth="3" fill="none" strokeLinecap="round" />
        <line x1="33" y1="71" x2="35" y2="76" stroke="#1e293b" strokeWidth="2.5" />
        <line x1="50" y1="69" x2="50" y2="74" stroke="#1e293b" strokeWidth="2.5" />
        <line x1="67" y1="71" x2="65" y2="76" stroke="#1e293b" strokeWidth="2.5" />
        {/* Ticket being punched */}
        <rect x="28" y="22" width="44" height="28" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" transform="rotate(-15 50 36)" />
        {/* PUNCH HOLES */}
        <circle cx="40" cy="30" r="3.2" fill="#0c1020" stroke="#ca8a04" strokeWidth="0.8" />
        <circle cx="60" cy="36" r="3.2" fill="#0c1020" stroke="#ca8a04" strokeWidth="0.8" />
        {/* Ticket text lines */}
        <line x1="38" y1="36" x2="52" y2="40" stroke="#ca8a04" strokeWidth="1" opacity="0.6" />
        <line x1="36" y1="42" x2="54" y2="46" stroke="#ca8a04" strokeWidth="1" opacity="0.6" />
        {/* Laser punching spark */}
        <g transform="translate(56, 33) rotate(-15 4 4)">
          <path d="M4 0 L6 3 L9 4 L6 5 L4 8 L2 5 L0 4 L2 3 Z" fill="#ef4444 animate-pulse" />
        </g>
      </svg>
    );
  }

  if (characterId === 'wind_eagle') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="weSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#134e4a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="eagleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#99f6e4" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#115e59" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#weSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#042f2c" stroke="#14b8a6" strokeWidth="2" />
        {/* Crosswise Kite lines */}
        <line x1="22" y1="22" x2="78" y2="78" stroke="#115e59" strokeWidth="1.2" strokeDasharray="3 3" />
        <line x1="22" y1="78" x2="78" y2="22" stroke="#115e59" strokeWidth="1.2" strokeDasharray="3 3" />
        {/* Soaring wind vectors */}
        <path d="M19 62 Q31 72, 50 50 T81 38" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75" />
        {/* Wind Eagle flight shape */}
        <path d="M50 24 L66 38 L54 44 L50 63 L46 44 L34 38 Z" fill="url(#eagleGrad)" stroke="#99f6e4" strokeWidth="1.5" />
        {/* Flying Kite tail strands */}
        <path d="M50 63 Q46 72, 42 78 M50 63 Q50 74, 50 82 M50 63 Q54 72, 58 78" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      </svg>
    );
  }

  if (characterId === 'explorer') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="expSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="roadBar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#expSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
        {/* Grid lines */}
        <circle cx="50" cy="50" r="30" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 4" fill="none" />
        {/* Warning Hazard Stripes */}
        <rect x="24" y="38" width="52" height="18" rx="2" fill="url(#roadBar)" stroke="#000055" strokeWidth="0.5" transform="rotate(-10 50 47)" />
        {/* Yellow-Black stripes inside barricade */}
        <g transform="rotate(-10 50 47)">
          <path d="M28 38 L34 38 L28 56 L34 56 M34 38 L40 38 L34 56 L40 56 M44 38 L50 38 L44 56 L50 56 M54 38 L60 38 L54 56 L60 56 M64 38 L70 38 L64 56 L70 56" stroke="#18181b" strokeWidth="3" />
        </g>
        {/* Support feet on sides */}
        <rect x="20" y="32" width="6" height="30" rx="1.5" fill="#52525b" stroke="#27272a" strokeWidth="1" />
        <rect x="74" y="32" width="6" height="30" rx="1.5" fill="#52525b" stroke="#27272a" strokeWidth="1" />
        {/* Blinking top yellow danger beacons */}
        <circle cx="23" cy="27" r="3.2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" className="animate-pulse" />
        <circle cx="77" cy="27" r="3.2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" className="animate-pulse" />
      </svg>
    );
  }

  if (characterId === 'silent') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="silentSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#silentSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#111827" stroke="#14b8a6" strokeWidth="2" />
        <circle cx="50" cy="50" r="32" stroke="#0f766e" strokeWidth="1" strokeDasharray="3 5" fill="none" />
        {/* Shrouded hood outline */}
        <path d="M50 20 C32 20, 26 38, 28 54 C30 68, 42 78, 50 78 C58 78, 70 68, 72 54 C74 38, 68 20, 50 20 Z" fill="#1f2937" stroke="#042f2e" strokeWidth="1.5" />
        {/* Dark mask core inside hood */}
        <path d="M50 28 C38 28, 34 38, 36 50 Q42 66, 50 66 Q58 66, 64 50 C66 38, 62 28, 50 28 Z" fill="#030712" />
        {/* Silent mist/dust waves */}
        <path d="M14 50 Q32 38, 50 50 T86 50" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
        {/* Piercing calm teal eyes */}
        <line x1="41" y1="44" x2="46" y2="44" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
        <line x1="59" y1="44" x2="54" y2="44" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
        <circle cx="43.5" cy="44" r="0.8" fill="#ffffff" />
        <circle cx="56.5" cy="44" r="0.8" fill="#ffffff" />
      </svg>
    );
  }

  if (characterId === 'flash_bird') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="fbSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#450a0a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="birdFlash" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#fbSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#450f00" stroke="#ef4444" strokeWidth="2" />
        {/* Supersonic speed rays */}
        <line x1="16" y1="16" x2="42" y2="42" stroke="#ca8a04" strokeWidth="1.8" />
        <line x1="20" y1="36" x2="44" y2="48" stroke="#ca8a04" strokeWidth="1.2" strokeDasharray="3 3" />
        <line x1="36" y1="20" x2="48" y2="44" stroke="#ca8a04" strokeWidth="1.2" strokeDasharray="3 3" />
        {/* Flying bullet beak strike shape (閃光鳥尖喙) */}
        <path d="M38 38 L82 50 L38 62 L48 50 Z" fill="url(#birdFlash)" stroke="#ea580c" strokeWidth="1.5" strokeLinejoin="round" />
        <ellipse cx="52" cy="50" rx="7.5" ry="3.5" fill="#fef08a" transform="rotate(15 52 50)" />
        <circle cx="52" cy="50" r="1.5" fill="#b91c1c" />
        {/* Fire blast engine exhaust flares */}
        <path d="M38 38 C32 32, 22 36, 16 32 C22 42, 28 46, 38 50 C28 54, 22 58, 16 68 C22 64, 32 68, 38 62" fill="#ef4444" opacity="0.6" />
      </svg>
    );
  }

  // Fallback icon for newer/miscellaneous heroes (harvey, poke, lie, etc.)
  let secondaryColor = '#e2e8f0';
  let primaryColor = '#475569';
  let titleLetter = '★';

  if (characterId === 'harvey') {
    primaryColor = '#15803d';
    secondaryColor = '#65a30d';
    titleLetter = '⛺';
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="harveySkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#65a30d" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#14532d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sleepingBag" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bef264" />
            <stop offset="50%" stopColor="#65a30d" />
            <stop offset="100%" stopColor="#1e3a1e" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#harveySkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#0f2911" stroke="#84cc16" strokeWidth="2" />
        {/* Rolling stars */}
        <polygon points="34 26, 36 30, 40 30, 37 33, 38 37, 34 35, 30 37, 31 33, 28 30, 32 30" fill="#fef08a" className="animate-pulse" />
        <polygon points="68 64, 70 68, 74 68, 71 71, 72 75, 68 73, 64 75, 65 71, 62 68, 66 68" fill="#fef08a" />
        {/* Plump Harvey sleeping bag rolling shape */}
        <rect x="22" y="38" width="56" height="24" rx="12" fill="url(#sleepingBag)" stroke="#d9f99d" strokeWidth="2.0" transform="rotate(-12 50 50)" />
        {/* Sleeping bag cords/lines */}
        <line x1="34" y1="41" x2="32" y2="51" stroke="#d9f99d" strokeWidth="1.5" />
        <line x1="44" y1="39" x2="42" y2="49" stroke="#d9f99d" strokeWidth="1.5" />
        <line x1="54" y1="37" x2="52" y2="47" stroke="#d9f99d" strokeWidth="1.5" />
        <line x1="64" y1="35" x2="62" y2="45" stroke="#d9f99d" strokeWidth="1.5" />
      </svg>
    );
  }

  if (characterId === 'poke') {
    primaryColor = '#0369a1';
    secondaryColor = '#38bdf8';
    titleLetter = '⚓';
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="pokeSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#pokeSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#082f49" stroke="#0ea5e9" strokeWidth="2" />
        {/* Water wave rings */}
        <circle cx="50" cy="50" r="32" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" fill="none" />
        <circle cx="50" cy="50" r="26" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="5 5" fill="none" />
        {/* Fishing Mesh Net */}
        <path d="M 24 50 C 24 32, 76 32, 76 50 C 76 68, 24 68, 24 50 Z" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 2" fill="none" />
        <path d="M 32 50 C 32 38, 68 38, 68 50 C 68 62, 32 62, 32 50 Z" stroke="#e0f2fe" strokeWidth="1.5" strokeDasharray="2 4" fill="none" />
        {/* Diagonal fishing net grid lines */}
        <line x1="24" y1="50" x2="76" y2="50" stroke="#0ea5e9" strokeWidth="0.8" opacity="0.6" />
        <line x1="50" y1="33" x2="50" y2="67" stroke="#0ea5e9" strokeWidth="0.8" opacity="0.6" />
        {/* Splashing core dew water droplets */}
        <circle cx="50" cy="50" r="3.5" fill="#ffffff animate-pulse" />
        <circle cx="42" cy="46" r="2" fill="#7dd3fc" />
        <circle cx="58" cy="54" r="2" fill="#7dd3fc" />
      </svg>
    );
  }

  if (characterId === 'angel') {
    primaryColor = '#f59e0b';
    secondaryColor = '#fef08a';
    titleLetter = '👼';
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="angelSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="angelFeatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#angelSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#451a03" stroke="#fbbf24" strokeWidth="2.2" />
        
        {/* Divine ray cross background */}
        <line x1="50" y1="14" x2="50" y2="86" stroke="rgba(254, 240, 138, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="14" y1="50" x2="86" y2="50" stroke="rgba(254, 240, 138, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Wings of Holy light surrounding center */}
        <path d="M22 34 C25 24, 38 22, 44 32 C42 41, 35 48, 26 44 Z" fill="url(#angelFeatherGrad)" stroke="#fcd34d" strokeWidth="1" />
        <path d="M78 34 C75 24, 62 22, 56 32 C58 41, 65 48, 74 44 Z" fill="url(#angelFeatherGrad)" stroke="#fcd34d" strokeWidth="1" />

        {/* Column of Divine light shooting down */}
        <polygon points="43 14, 57 14, 62 86, 38 86" fill="rgba(255, 255, 255, 0.35)" />
        <polygon points="47 14, 53 14, 55 86, 45 86" fill="rgba(255, 255, 255, 0.75)" />

        {/* Golden Crown / Halo in middle */}
        <ellipse cx="50" cy="46" rx="14" ry="4" stroke="#ffffff" strokeWidth="1.8" fill="none" />
        <ellipse cx="50" cy="46" rx="10" ry="2.5" stroke="#fcd34d" strokeWidth="1.2" fill="none" />

        {/* central high intensity core */}
        <circle cx="50" cy="46" r="3.5" fill="#ffffff" className="animate-pulse" />
      </svg>
    );
  }

  if (characterId === 'lie') {
    primaryColor = '#ca8a04';
    secondaryColor = '#fef08a';
    titleLetter = '⚔️';
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="lieSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#451a03" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ancientSpear" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#lieSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#2d1d00" stroke="#ca8a04" strokeWidth="2" />
        {/* Sonic thrust wave lines */}
        <path d="M18 18 L40 40 M24 16 L44 36 M16 24 L36 44" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
        {/* Ancient cloud spear head (cloud piercer spear) */}
        <g transform="translate(18, 18) rotate(45)">
          {/* Spear shaft */}
          <line x1="0" y1="40" x2="0" y2="14" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
          {/* Spear blade */}
          <path d="M-5 14 L0 0 L5 14 L0 24 Z" fill="url(#ancientSpear)" stroke="#ca8a04" strokeWidth="1.2" />
          {/* Crimson decorative tassel */}
          <path d="M-3 16 C-3 20, 3 20, 3 16" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.5" />
        </g>
        {/* Critical impact explosion rays */}
        <polygon points="70 24, 75 22, 73 28, 67 27" fill="#fbbf24" className="animate-pulse" />
        <polygon points="62 44, 68 45, 65 51, 59 47" fill="#fbbf24" />
      </svg>
    );
  }

  if (characterId === 'botanist') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
        <defs>
          <radialGradient id="botanistSkillGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#14532d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="boLeaf" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#botanistSkillGlow)" />
        <circle cx="50" cy="50" r="38" fill="#14532d" stroke="#22c55e" strokeWidth="2" />
        <path d="M22 50 C22 34.5, 34.5 22, 50 22 C65.5 22, 78 34.5, 78 50 C78 65.5, 65.5 78, 50 78" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 4" />
        <path d="M50 25 C65 35, 65 60, 50 75 C35 60, 35 35, 50 25 Z" fill="url(#boLeaf)" stroke="#15803d" strokeWidth="1.5" />
        <path d="M50 25 L50 75" stroke="#14532d" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 40 Q55 35, 58 36" stroke="#14532d" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50 50 Q45 45, 42 46" stroke="#14532d" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50 60 Q55 55, 58 56" stroke="#14532d" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="50" cy="25" r="3.5" fill="#facc15" />
        <circle cx="62" cy="45" r="2.5" fill="#facc15" />
        <circle cx="38" cy="50" r="2.5" fill="#facc15" />
      </svg>
    );
  }

  // Generalized fallback icon
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClasses}>
      <circle cx="50" cy="50" r="48" fill={secondaryColor} fillOpacity="0.1" />
      <circle cx="50" cy="50" r="38" fill={primaryColor} stroke={secondaryColor} strokeWidth="2" />
      <text x="50" y="52" fill={secondaryColor} fontSize="22" fontWeight="black" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">
        {titleLetter}
      </text>
      <circle cx="50" cy="50" r="30" stroke={secondaryColor} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
};
