import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character } from '../types';
import { CHARACTERS } from '../characters';
import { CharacterVectorIcon } from './CharacterVectorIcon';
import { Trophy, Sparkles, Crown, ArrowRight, RefreshCw, BookOpen, Volume2, Shield } from 'lucide-react';
import { audio } from '../utils/audio';

interface ChampionCoronationProps {
  championIndex: number;
  onClose: () => void;
  onRestart: () => void;
}

export const ChampionCoronation: React.FC<ChampionCoronationProps> = ({
  championIndex,
  onClose,
  onRestart,
}) => {
  const champion: Character = CHARACTERS[championIndex];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showStoryDetail, setShowStoryDetail] = useState(false);

  // Play epic win audio cue when the screen is mounted
  useEffect(() => {
    try {
      audio.playWin();
    } catch (e) {
      console.warn("Could not play win sound:", e);
    }
  }, []);

  // Gold spark / confetti canvas particle rain
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Support screen resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = window.innerWidth;
      height = canvasRef.current.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class representing golden crowns and celestial sparkles
    interface Spark {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      rotSpeed: number;
      color: string;
      opacity: number;
      type: 'circle' | 'star' | 'glitter';
    }

    const sparks: Spark[] = [];
    const colors = [
      '#fbbf24', // Amber 400
      '#f59e0b', // Amber 500
      '#fcd34d', // Amber 300
      '#fffbeb', // Amber 50
      '#eab308', // Yellow 500
      '#ffffff', // White gleam
    ];

    // Spawn initial particles
    for (let i = 0; i < 90; i++) {
      sparks.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 5 + 2,
        speedY: Math.random() * 2 + 1,
        speedX: Math.random() * 1.5 - 0.75,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: Math.random() * 0.04 - 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.8 + 0.2,
        type: Math.random() < 0.4 ? 'star' : Math.random() < 0.7 ? 'circle' : 'glitter',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background ambient rays
      const pulseFactor = Math.sin(performance.now() * 0.001) * 0.15 + 1;
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.65 * pulseFactor
      );
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
      gradient.addColorStop(0.5, 'rgba(6, 10, 23, 0.95)');
      gradient.addColorStop(1, '#020617');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw celestial beams radiating from center
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(performance.now() * 0.00004);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.03)';
      ctx.lineWidth = 1.5;
      const rays = 18;
      for (let i = 0; i < rays; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(
          Math.cos((i * Math.PI * 2) / rays) * Math.max(width, height),
          Math.sin((i * Math.PI * 2) / rays) * Math.max(width, height)
        );
        ctx.stroke();
      }
      ctx.restore();

      // Render sparkles and falling gold star confetti
      sparks.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.type === 'star') {
          // Draw standard 4-point sparkle star
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.lineTo(0, p.size * 2);
            ctx.lineTo(p.size * 0.3, 0);
          }
          ctx.closePath();
          ctx.fill();
        } else if (p.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Diamond / Glitter
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.5);
          ctx.lineTo(p.size, 0);
          ctx.lineTo(0, p.size * 1.5);
          ctx.lineTo(-p.size, 0);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();

        // Update physics
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        // Reset particle on bottom exit
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
          p.speedY = Math.random() * 2 + 1;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div id="champion-coronation-overlay" className="fixed inset-0 z-[1000] overflow-hidden flex flex-col justify-between select-none">
      {/* Background Canvas Effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Top Banner: Cosmic Title */}
      <div className="relative text-center pt-8 px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-[10px] md:text-xs text-yellow-400 font-mono font-black uppercase tracking-widest"
        >
          <Trophy className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span>錦標賽至高殿堂 (TOURNAMENT CHAMPION CLIMAX)</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6, type: 'spring', stiffness: 80 }}
          className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-50 via-yellow-250 to-amber-200 uppercase font-sans drop-shadow-md"
        >
          👑 傳奇總冠軍登基 👑
        </motion.h1>
      </div>

      {/* Center: Major Closeup and Title Celebration Card */}
      <div className="relative flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 max-w-5xl w-full mx-auto px-6 py-4 z-10 overflow-y-auto scrollbar-none">
        
        {/* Left Side: Avatar Panel with rotating halo */}
        <div className="relative flex items-center justify-center shrink-0">
          {/* Pulsing Light halo backdrop */}
          <div className="absolute w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />

          {/* Rotating Celestial Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute w-64 h-64 border-2 border-dashed border-yellow-500/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute w-72 h-72 border-2 border-dashed border-amber-500/10 rounded-full"
          />

          {/* Golden hexagonal pedestal pedestal backdrop */}
          <div className="absolute bottom-[-10px] w-48 h-6 bg-slate-900 border border-yellow-500/40 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-[9px] font-mono font-extrabold text-yellow-400 tracking-widest uppercase">
              DEIFIED CHAMPION
            </span>
          </div>

          {/* Crown on very top */}
          <motion.div
            initial={{ scale: 0, y: -60, rotate: -25 }}
            animate={{ scale: 1, y: -105, rotate: 0 }}
            transition={{ delay: 0.45, duration: 0.8, type: 'spring' }}
            className="absolute z-30 drop-shadow-[0_4px_10px_rgba(234,179,8,0.5)]"
          >
            <Crown className="w-16 h-16 text-yellow-400 animate-bounce" style={{ animationDuration: '3s' }} />
          </motion.div>

          {/* Giant Character Circular Crest Frame */}
          <motion.div
            initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.75, type: 'spring' }}
            className="relative w-52 h-52 md:w-60 md:h-60 rounded-full border-4 border-yellow-500 p-2 text-center flex items-center justify-center bg-slate-950/90 shadow-[0_0_50px_rgba(234,179,8,0.25)] group hover:scale-102 transition-transform"
          >
            <CharacterVectorIcon characterId={champion.id} className="w-full h-full animate-pulse" />
            
            {/* Soft gloss filter */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-full pointer-events-none" />
          </motion.div>
        </div>

        {/* Right Side: Identity information panel */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left text-slate-100 max-w-lg">
          {/* Role badge */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mb-3 px-3 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-bold font-mono text-yellow-400 flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-yellow-500" />
            <span>【 {champion.roleName} 】</span>
            <span className="text-slate-600 font-medium">|</span>
            <span>HP: {champion.initialHp}</span>
          </motion.div>

          {/* Huge Character Name Display */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl md:text-5xl font-black tracking-tight text-white flex items-center gap-3 drop-shadow"
          >
            {champion.name}
          </motion.h2>

          {/* Exclusive Title Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-3.5 px-4 py-2 border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent rounded-xl text-yellow-405 font-bold text-sm md:text-base tracking-wide flex items-center gap-2 shadow-inner"
          >
            <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{champion.title}</span>
          </motion.div>

          {/* Triumphant Voice Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-900 leading-relaxed text-xs text-yellow-100/90 italic relative max-w-sm"
          >
            <div className="absolute top-[-8px] left-4 px-1 py-0.5 bg-yellow-600 text-slate-950 rounded text-[8px] font-black font-mono">
              TRIUMPHANT QUOTE
            </div>
            <p className="font-sans">
              {champion.quotes?.win || '「我的戰鬥數據，已攀登至宇宙最初始解的終極密碼。」'}
            </p>
          </motion.div>

          {/* Narrative Story summary section */}
          <div className="mt-5 w-full text-left">
            <button
              onClick={() => {
                audio.playSelect();
                setShowStoryDetail(!showStoryDetail);
              }}
              className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showStoryDetail ? '收起傲世列傳背景' : '翻閱角色奧祕列傳'}</span>
              <ArrowRight className={`w-3 h-3 transition-transform ${showStoryDetail ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {showStoryDetail && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2.5 p-3 rounded-lg bg-slate-900/60 border border-slate-950/80 overflow-hidden"
                >
                  <p className="text-[11px] text-slate-400 leading-relaxed max-h-24 overflow-y-auto pr-1">
                    {champion.story}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Option Navigation Toolbar Panel */}
      <div className="relative border-t border-slate-900/60 bg-slate-950/85 backdrop-blur-md py-6 px-4 z-10">
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-center">
          
          {/* Action 1: Dismiss view to review brackets / statistics */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full sm:flex-1 py-3 px-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-300 hover:text-slate-100 text-xs font-black tracking-wider transition-all cursor-pointer shadow-md"
          >
            <span>📊 詳閱終局對戰報告</span>
          </motion.button>

          {/* Action 2: Trigger Restart to Selecing screen */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full sm:flex-1 py-3 px-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-405 hover:to-amber-405 text-slate-950 text-xs font-black tracking-wider shadow-lg shadow-yellow-500/15 cursor-pointer transition-all"
          >
            <RefreshCw className="w-4 h-4 text-slate-950" />
            <span>🔄 開啟新一屆錦標賽</span>
          </motion.button>
          
        </div>
      </div>
    </div>
  );
};
