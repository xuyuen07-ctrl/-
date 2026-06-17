import React, { useEffect, useRef } from 'react';
import { Character } from '../types';
import { X, Activity, Shield, Flame, Sparkles, Heart } from 'lucide-react';
import { audio } from '../utils/audio';
import { CharacterVectorIcon } from './CharacterVectorIcon';

interface SkillPreviewModalProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
}

export const SkillPreviewModal: React.FC<SkillPreviewModalProps> = ({
  character,
  isOpen,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Handle Esc key to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // High-fidelity animation simulation engine
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI Canvas adjust
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId: number;
    let frameCount = 0;

    // Particles system for preview simulation
    interface SimParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      radius: number;
      life: number;
      maxLife: number;
      type: 'blood' | 'dust' | 'fire' | 'lightning' | 'push' | 'spark';
    }
    let simParticles: SimParticle[] = [];

    // Floating text items
    interface FloatingText {
      text: string;
      x: number;
      y: number;
      color: string;
      life: number;
    }
    let floatingTexts: FloatingText[] = [];

    // Main animation loop
    const render = () => {
      frameCount = (frameCount + 1) % 270; // 4.5 seconds loop at 60fps

      const width = rect.width;
      const height = rect.height;

      // Clear with elegant deep slate gradient background representation
      ctx.fillStyle = '#020617'; // slate-950
      ctx.fillRect(0, 0, width, height);

      // Draw subtle tech-grid overlay background
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.15)'; // slate-700
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw visual play context status line
      ctx.font = 'bold 9px font-mono, monospace, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'left';
      ctx.fillText('技能模擬即時演示 (SIMULATED CONTEXT)', 15, 20);

      // Animation parameters
      const casterRadius = 24;
      const targetRadius = 24;
      const centerY = height / 2;

      let casterX = 60;
      let targetX = width - 70;
      let alpha = 1.0;

      // Stage Timeline Logic
      // 0 - 80: Approach
      // 80 - 180: Skill active & contact interactions
      // 180 - 230: Post-impact separation & cooldown drift
      // 230 - 270: Fade out / reset
      let stateName = '就緒中 (Standby)';
      let activePhase = 'approach';

      if (frameCount < 80) {
        activePhase = 'approach';
        stateName = '突擊衝鋒...';
        const progress = frameCount / 80;
        // Ease-in approach
        const startX = 50;
        const collisionX = targetX - casterRadius - targetRadius;
        casterX = startX + (collisionX - startX) * (progress * progress);
      } else if (frameCount < 170) {
        activePhase = 'active';
        stateName = '[小技能強效觸發中!]';
        casterX = targetX - casterRadius - targetRadius;
      } else if (frameCount < 230) {
        activePhase = 'cooldown';
        stateName = '技能消退 & 進入冷卻';
        // Bounce back slightly and settle
        const collisionX = targetX - casterRadius - targetRadius;
        const progress = (frameCount - 170) / 60;
        casterX = collisionX - Math.sin(progress * Math.PI) * 15;
      } else {
        activePhase = 'fade';
        stateName = '刷新生命重置...';
        casterX = targetX - casterRadius - targetRadius;
        alpha = Math.max(0, 1.0 - (frameCount - 230) / 40);
      }

      ctx.save();
      ctx.globalAlpha = alpha;

      // Handle active skill simulations & spawn particles
      if (activePhase === 'active') {
        const collisionXPoint = casterX + casterRadius;

        // VAMPIRE SIMULATION
        if (character.id === 'vampire') {
          // 1. Vampire Siphon & Bite Arc (60 degree sector, 2.2x radius)
          const rangeRadius = casterRadius * 2.2;
          const startAngle = -Math.PI / 6;
          const endAngle = Math.PI / 6;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(casterX, centerY);
          ctx.arc(casterX, centerY, rangeRadius, startAngle, endAngle);
          ctx.closePath();

          // Siphon glow fill
          const grad = ctx.createRadialGradient(casterX, centerY, casterRadius, casterX, centerY, rangeRadius);
          grad.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
          grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();

          // Vampire siphoning blood bond lines
          ctx.save();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3.5;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ef4444';
          ctx.beginPath();
          ctx.moveTo(casterX, centerY);

          const segments = 10;
          const dx = targetX - casterX;
          for (let i = 1; i <= segments; i++) {
            const rx = i / segments;
            const px = casterX + dx * rx;
            const py = centerY + Math.sin(rx * Math.PI * 4 + Date.now() * 0.02) * 5;
            ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.restore();

          // Spawn persistent blood particles
          if (frameCount % 6 === 0) {
            simParticles.push({
              x: targetX,
              y: centerY + (Math.random() * 16 - 8),
              vx: -3.5 - Math.random() * 2,
              vy: Math.random() * 2 - 1,
              color: '#ef4444',
              radius: Math.random() * 2 + 1.5,
              life: 1.0,
              maxLife: 0.5,
              type: 'blood',
            });
          }

          // Damage & Healing tickers
          if (frameCount % 24 === 0) {
            floatingTexts.push({
              text: '+1.5 HP 吸血',
              x: casterX - 10,
              y: centerY - 25,
              color: '#10b981',
              life: 1.0,
            });
            floatingTexts.push({
              text: '-1.5 噬血緊咬!',
              x: targetX - 5,
              y: centerY - 25,
              color: '#ef4444',
              life: 1.0,
            });
          }
        }

        // MUD SIMULATION
        if (character.id === 'mud') {
          const mudRadius = casterRadius * 1.5;
          
          // Draw mud area puddle under collision
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(collisionXPoint, centerY + 8, mudRadius, mudRadius * 0.4, 0, 0, Math.PI * 2);
          const mudGrad = ctx.createRadialGradient(collisionXPoint, centerY + 8, 10, collisionXPoint, centerY + 8, mudRadius);
          mudGrad.addColorStop(0, 'rgba(180, 83, 9, 0.5)');
          mudGrad.addColorStop(0.7, 'rgba(146, 64, 14, 0.25)');
          mudGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
          ctx.fillStyle = mudGrad;
          ctx.fill();

          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([2, 2]);
          ctx.stroke();
          ctx.restore();

          // Soil splashing particles
          if (frameCount % 5 === 0) {
            simParticles.push({
              x: collisionXPoint + (Math.random() * 10 - 5),
              y: centerY + (Math.random() * 10 - 5),
              vx: Math.random() * 4 - 2,
              vy: -2 - Math.random() * 3,
              color: '#b45309',
              radius: Math.random() * 3 + 1.5,
              life: 1.0,
              maxLife: 0.7,
              type: 'dust',
            });
          }

          // Stiff Feet Lock indicators on the target
          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 9px font-sans, sans-serif';
          ctx.fillText('🔒 限速 4% 減速生效中', targetX - 40, centerY - 32);

          if (frameCount === 82) {
            floatingTexts.push({
              text: '泥沼纏足!',
              x: casterX,
              y: centerY - 25,
              color: '#fbbf24',
              life: 1.2,
            });
            floatingTexts.push({
              text: '-2.0 HP',
              x: targetX,
              y: centerY - 25,
              color: '#fbbf24',
              life: 1.2,
            });
          }
        }

        // BLAZE SIMULATION
        if (character.id === 'blaze') {
          const flameRadius = casterRadius * 2.2;

          // Draw flame expansion zone
          ctx.save();
          ctx.beginPath();
          ctx.arc(casterX, centerY, flameRadius, 0, Math.PI * 2);
          const fireGrad = ctx.createRadialGradient(casterX, centerY, casterRadius, casterX, centerY, flameRadius);
          fireGrad.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
          fireGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.25)');
          fireGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = fireGrad;
          ctx.fill();

          // Animated expanding ripple ring
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.6 + Math.sin(Date.now() * 0.02) * 0.2})`;
          ctx.lineWidth = 3.0;
          ctx.stroke();
          ctx.restore();

          // Spark particles
          if (frameCount % 4 === 0) {
            simParticles.push({
              x: casterX + (Math.random() * 40 - 20),
              y: centerY + (Math.random() * 40 - 20),
              vx: (Math.random() * 6 - 3),
              vy: (Math.random() * 6 - 3),
              color: Math.random() < 0.5 ? '#ef4444' : '#f97316',
              radius: Math.random() * 3.5 + 1.5,
              life: 1.0,
              maxLife: 0.6,
              type: 'fire',
            });
          }

          // Damage ticking text
          if (frameCount % 18 === 0) {
            floatingTexts.push({
              text: '-1.5 爆燃',
              x: targetX,
              y: centerY - 25 - (Math.random() * 5),
              color: '#f97316',
              life: 0.8,
            });
          }

          if (frameCount === 82) {
            floatingTexts.push({
              text: '瞬間爆燃!',
              x: casterX,
              y: centerY - 32,
              color: '#f97316',
              life: 1.2,
            });
          }
        }

        // STORM (LIGHTNING) SIMULATION
        if (character.id === 'lightning') {
          const stormRadius = casterRadius * 1.6;

          // Push animation for target ball during active phase
          const pushProgress = (frameCount - 80) / 90; // 0.0 to 1.0
          // Opponent gets repelled/flung outward to the right
          targetX = (width - 70) + (pushProgress * 55);

          // Render rotating wind cyclone screen
          ctx.save();
          ctx.beginPath();
          ctx.arc(casterX, centerY, stormRadius, 0, Math.PI * 2);
          const stormGrad = ctx.createRadialGradient(casterX, centerY, casterRadius, casterX, centerY, stormRadius);
          stormGrad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
          stormGrad.addColorStop(0.7, 'rgba(34, 211, 238, 0.15)');
          stormGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
          ctx.fillStyle = stormGrad;
          ctx.fill();

          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 3.0;
          ctx.setLineDash([10, 5]);
          ctx.arc(casterX, centerY, stormRadius, -Date.now() * 0.045, -Date.now() * 0.045 + Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Electric cyan sparkles
          if (frameCount % 5 === 0) {
            simParticles.push({
              x: casterX + (Math.random() * 32 - 16),
              y: centerY + (Math.random() * 32 - 16),
              vx: Math.random() * 5 - 2.5,
              vy: Math.random() * 5 - 2.5,
              color: '#22d3ee',
              radius: Math.random() * 3 + 1,
              life: 1.0,
              maxLife: 0.5,
              type: 'lightning',
            });
          }

          // Dizzy signs over target
          ctx.fillStyle = '#eab308';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('擊退 + 麻痺中', targetX, centerY - 32);

          if (frameCount === 82) {
            floatingTexts.push({
              text: '強力亂流 (彈飛!)',
              x: casterX,
              y: centerY - 28,
              color: '#06b6d4',
              life: 1.3,
            });
          }
        } else if (character.id === 'dice') {
          const domainRadius = casterRadius * 1.5;

          // Let the first 35 frames be the rolling state, next 55 frames be the effect state!
          const stateTime = frameCount - 80; // 0 to 90
          const isRollingVal = stateTime < 35; // first 35 frames are rolling

          // Flashing cycling number 1, 2, 3
          if (isRollingVal) {
            const num = Math.floor(stateTime / 5) % 3 + 1;
            ctx.save();
            ctx.font = 'bold 20px font-mono, sans-serif';
            ctx.fillStyle = '#cbd5e1';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#94a3b8';
            ctx.fillText(`${num}`, casterX, centerY - casterRadius - 15);
            ctx.restore();

            // Shifting rainbow field
            ctx.save();
            ctx.beginPath();
            ctx.arc(casterX, centerY, domainRadius, 0, Math.PI * 2);
            const cols = ['rgba(251, 191, 36, 0.15)', 'rgba(34, 197, 94, 0.15)', 'rgba(239, 68, 68, 0.15)'];
            ctx.fillStyle = cols[Math.floor(stateTime / 8) % cols.length];
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.restore();
          } else {
            // Decided effect stage! We cycle among Outcomes (Gravity, Reverse, Jackpot) based on timestamp
            const outcome = (Math.floor(Date.now() / 4500) % 3) + 1;
            
            let name = '';
            let ringColor = '';
            let glowColor = '';
            let textLabel = '';

            if (outcome === 1) {
              name = '重力 (Gravity)';
              ringColor = '#eab308'; // yellow
              glowColor = 'rgba(234, 179, 8, 0.35)';
              textLabel = '[敵方移速 -60% / 反彈減弱 50%]';
              
              // Apply slow visuals to target
              ctx.fillStyle = ringColor;
              ctx.font = 'bold 11px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('緩速 & 重力束縛', targetX, centerY - 28);
            } else if (outcome === 2) {
              name = '反向 (Reverse)';
              ringColor = '#22c55e'; // green
              glowColor = 'rgba(34, 197, 94, 0.35)';
              textLabel = '[移動方向完全翻轉！]';

              // Target moves back and forth quickly to demonstrate flip
              const deltaPhase = Math.sin((frameCount - 110) * 0.18) * 15;
              targetX = (width - 70) + deltaPhase;

              ctx.fillStyle = ringColor;
              ctx.font = 'bold 11px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('混亂反向', targetX, centerY - 28);
            } else if (outcome === 3) {
              name = '大彩頭 (Jackpot)';
              ringColor = '#ef4444'; // red
              glowColor = 'rgba(239, 68, 68, 0.35)';
              textLabel = '[CD 歸零直接重置為 0 秒！]';

              ctx.fillStyle = ringColor;
              ctx.font = 'bold 11px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('幸運大彩頭!', casterX, centerY - casterRadius - 38);
            }

            // Draw Decided Domain Circle
            ctx.save();
            ctx.beginPath();
            ctx.arc(casterX, centerY, domainRadius, 0, Math.PI * 2);
            const diceGlow = ctx.createRadialGradient(casterX, centerY, casterRadius, casterX, centerY, domainRadius);
            diceGlow.addColorStop(0, glowColor);
            diceGlow.addColorStop(0.7, ringColor + '11');
            diceGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = diceGlow;
            ctx.fill();

            ctx.strokeStyle = ringColor;
            ctx.lineWidth = 3.0;
            ctx.shadowColor = ringColor;
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.restore();

            // Display Number above ball
            ctx.save();
            ctx.font = 'bold 22px font-mono, sans-serif';
            ctx.fillStyle = ringColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.shadowBlur = 10;
            ctx.shadowColor = ringColor;
            ctx.fillText(`${outcome}`, casterX, centerY - casterRadius - 15);
            ctx.restore();

            // Display text announcement once
            if (frameCount === 116) {
              floatingTexts.push({
                text: `判決: ${name}`,
                x: casterX,
                y: centerY - 45,
                color: ringColor,
                life: 1.5,
              });
              floatingTexts.push({
                text: textLabel,
                x: width / 2,
                y: centerY + casterRadius + 40,
                color: '#f8fafc',
                life: 1.5,
              });
            }
          }
        } else if (character.id === 'whip') {
          // Whip Girl Simulation: Two Phases
          // Active phase duration: 90 frames (approx 1.5s in modal)
          const stateTime = frameCount - 80; // 0 to 90
          ctx.save();
          if (stateTime < 45) {
            // Phase 1: Straight Strike (0 to 45 frames)
            // Draw long silver line projecting to target
            const startX = casterX;
            const endX = targetX;
            ctx.shadowColor = '#e2e8f0';
            ctx.shadowBlur = 10;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3.0;
            ctx.beginPath();
            ctx.moveTo(startX, centerY);
            // Draw a straight but slightly vibrant line
            const segments = 8;
            for (let i = 0; i <= segments; i++) {
              const t = i / segments;
              const x = startX + (endX - startX) * t;
              const y = centerY + Math.sin(t * Math.PI + stateTime * 0.5) * 4;
              ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Rhombus tip at target
            ctx.fillStyle = '#f1f5f9';
            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(endX, centerY);
            ctx.lineTo(endX - 8, centerY - 5);
            ctx.lineTo(endX - 16, centerY);
            ctx.lineTo(endX - 8, centerY + 5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // On frame 15, trigger strike hit particle and floating text
            if (stateTime === 15) {
              floatingTexts.push({
                text: '💥 迅鞭突刺! -2.30',
                x: targetX,
                y: centerY - 28,
                color: '#ec4899',
                life: 1.2,
              });
              // spawn particles
              for (let i = 0; i < 8; i++) {
                simParticles.push({
                  x: targetX,
                  y: centerY,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  radius: 3 + Math.random() * 3,
                  maxLife: 0.8,
                  life: 0.8,
                  color: '#ebd5ff',
                  type: 'dust',
                });
              }
            }
          } else {
            // Phase 2: Ring Sweep (45 to 90 frames)
            const sweepTime = stateTime - 45;
            const angle = sweepTime * 0.25;
            ctx.strokeStyle = '#d8b4fe';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            // Draw an expanding spiral wave around caster
            const maxRadius = casterRadius + sweepTime * 1.8;
            for (let i = 0; i <= 15; i++) {
              const t = i / 15;
              const currAngle = angle + t * Math.PI * 1.8;
              const currR = casterRadius + (maxRadius - casterRadius) * t;
              ctx.lineTo(casterX + Math.cos(currAngle) * currR, centerY + Math.sin(currAngle) * currR);
            }
            ctx.stroke();

            // On frame 55, trigger range sweep hit/floating text
            if (stateTime === 55) {
              floatingTexts.push({
                text: '💫 環形橫掃! -1.93',
                x: targetX,
                y: centerY - 28,
                color: '#c084fc',
                life: 1.2,
              });
              for (let i = 0; i < 10; i++) {
                simParticles.push({
                  x: targetX,
                  y: centerY,
                  vx: (Math.random() - 0.3) * 5,
                  vy: (Math.random() - 0.5) * 3,
                  radius: 2 + Math.random() * 4,
                  maxLife: 0.9,
                  life: 0.9,
                  color: '#a855f7',
                  type: 'dust',
                });
              }
            }
          }
          ctx.restore();
        } else if (character.id === 'cosmic_mage') {
          // Cosmic Mage Simulation: Accumulate Stars, then unleash Star Torrent / Star Fall
          const stateTime = frameCount - 80; // 0 to 90
          ctx.save();
          
          if (stateTime < 30) {
            // Phase 1: Casting Star Bullet & Star Blade
            ctx.fillStyle = '#67e8f9';
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 8;
            
            // Star bullet flying towards target
            const bulletProgress = Math.max(0, stateTime) / 30;
            const bx = casterX + (targetX - casterX) * bulletProgress;
            ctx.beginPath();
            ctx.arc(bx, centerY, 5, 0, Math.PI * 2);
            ctx.fill();
            
            if (stateTime === 15) {
              floatingTexts.push({
                text: '✨ 星彈爆破! -1.30',
                x: targetX,
                y: centerY - 25,
                color: '#22d3ee',
                life: 1.2
              });
              
              for (let i = 0; i < 6; i++) {
                simParticles.push({
                  x: targetX,
                  y: centerY,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  radius: 2 + Math.random() * 2,
                  maxLife: 0.6,
                  life: 0.6,
                  color: '#67e8f9',
                  type: 'spark'
                });
              }
            }
          } else if (stateTime < 60) {
            // Phase 2: Channeled Star Chain and Star Fall warning
            
            // Draw electric star chain lock connecting to target
            ctx.strokeStyle = '#c084fc';
            ctx.lineWidth = 2.0;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(casterX, centerY);
            ctx.lineTo(targetX, centerY);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Spinning warning circle at target feet
            ctx.strokeStyle = '#f472b6';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.arc(targetX, centerY, 35, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            
            if (stateTime === 45) {
              floatingTexts.push({
                text: '⛓️ 星鏈束縛! -1.40 (定身)',
                x: targetX,
                y: centerY - 25,
                color: '#a78bfa',
                life: 1.2
              });
            }
          } else {
            // Phase 3: Fallen meteorite impact!
            const impactTime = stateTime - 60;
            
            // Meteorite falling and exploding on target
            if (impactTime < 15) {
              const my = centerY - 100 + impactTime * 6;
              const mx = targetX - 50 + impactTime * 3;
              
              const mGlow = ctx.createRadialGradient(mx, my, 1, mx, my, 12);
              mGlow.addColorStop(0, '#ffffff');
              mGlow.addColorStop(0.5, '#f472b6');
              mGlow.addColorStop(1, 'rgba(244, 114, 182, 0)');
              ctx.fillStyle = mGlow;
              ctx.beginPath();
              ctx.arc(mx, my, 12, 0, Math.PI * 2);
              ctx.fill();
            }
            
            if (stateTime === 75) {
              floatingTexts.push({
                text: '☄️ 星隕墜地! -2.40 (強力擊飛)',
                x: targetX,
                y: centerY - 25,
                color: '#f472b6',
                life: 1.5
              });
              
              for (let i = 0; i < 15; i++) {
                simParticles.push({
                  x: targetX,
                  y: centerY,
                  vx: (Math.random() - 0.5) * 8,
                  vy: -1 * (Math.random() * 5 + 3), // ejections fly upwards
                  radius: 3 + Math.random() * 3,
                  maxLife: 1.0,
                  life: 1.0,
                  color: '#fb7185',
                  type: 'spark'
                });
              }
            }
          }
          ctx.restore();
        }
      }

      // Draw Target (Opponent Ball) (Classic Gray Punchbag)
      ctx.beginPath();
      ctx.arc(targetX, centerY, targetRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#475569'; // slate-600 dummy ball
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Dummy inner brand
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px font-sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Target', targetX, centerY + 1);

      // Draw Caster Character Ball
      ctx.beginPath();
      ctx.arc(casterX, centerY, casterRadius, 0, Math.PI * 2);
      ctx.fillStyle = character.color;
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3.0;
      ctx.stroke();

      // Caster glow ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(casterX, centerY, casterRadius - 3.5, 0, Math.PI * 2);
      ctx.stroke();

      // Internal ball Emoji icon representation
      if (character.id === 'dice') {
        const size = casterRadius * 1.1;
        const half = size / 2;
        ctx.save();
        ctx.fillStyle = '#f8fafc'; // light gray-white
        ctx.strokeStyle = '#cbd5e1'; // border slate-300
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const rx = casterX - half;
        const ry = centerY - half;
        const radius = 4;
        ctx.roundRect ? ctx.roundRect(rx, ry, size, size, radius) : ctx.rect(rx, ry, size, size);
        ctx.fill();
        ctx.stroke();

        // Standard pips! Since it's a standard dice, let's show 5 pips on it
        const d = size * 0.25;
        const pipRadius = size * 0.08;
        ctx.fillStyle = '#334155'; // deep slate
        const pips = [
          { dx: 0, dy: 0 },
          { dx: -d, dy: -d },
          { dx: d, dy: -d },
          { dx: -d, dy: d },
          { dx: d, dy: d },
        ];
        pips.forEach(p => {
          ctx.beginPath();
          ctx.arc(casterX + p.dx, centerY + p.dy, pipRadius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      } else {
        // --- Custom Vector Art replaces Emojis to optimize preview appearance ---
        ctx.save();
        const cx = casterX;
        const cy = centerY - 1.5; // placed slightly higher
        
        if (character.id === 'vampire') {
          // Stylized Vampire Wing/Bat Crest
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#7f1d1d';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 6);
          
          ctx.bezierCurveTo(cx - 2, cy - 8, cx - 8, cy - 8, cx - 12, cy - 4);
          ctx.bezierCurveTo(cx - 9, cy - 1, cx - 5, cy - 1, cx - 2, cy + 1);
          ctx.bezierCurveTo(cx - 4, cy + 4, cx - 1, cy + 6, cx, cy + 8); // Center tail point
          
          ctx.bezierCurveTo(cx + 1, cy + 6, cx + 4, cy + 4, cx + 2, cy + 1);
          ctx.bezierCurveTo(cx + 5, cy - 1, cx + 9, cy - 1, cx + 12, cy - 4);
          ctx.bezierCurveTo(cx + 8, cy - 8, cx + 2, cy - 8, cx, cy - 6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Sharp red/white fangs in center area
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(cx - 2, cy + 1);
          ctx.lineTo(cx - 1, cy + 3);
          ctx.lineTo(cx, cy + 1);
          ctx.closePath();
          ctx.moveTo(cx, cy + 1);
          ctx.lineTo(cx + 1, cy + 3);
          ctx.lineTo(cx + 2, cy + 1);
          ctx.closePath();
          ctx.fill();
        } 
        else if (character.id === 'mud') {
          // Ancient earthen stone prism
          ctx.fillStyle = '#d97706';
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 1.2;
          
          ctx.beginPath();
          ctx.moveTo(cx, cy - 8);
          ctx.lineTo(cx + 7, cy - 4);
          ctx.lineTo(cx + 7, cy + 3);
          ctx.lineTo(cx, cy + 7);
          ctx.lineTo(cx - 7, cy + 3);
          ctx.lineTo(cx - 7, cy - 4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Inner gold rune path
          ctx.strokeStyle = '#fef3c7';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(cx - 4, cy - 1);
          ctx.lineTo(cx, cy - 3);
          ctx.lineTo(cx, cy + 3);
          ctx.lineTo(cx + 4, cy + 1.5);
          ctx.stroke();
        } 
        else if (character.id === 'blaze') {
          // Flame shape
          const fireGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, 8);
          fireGrad.addColorStop(0, '#fef08a');
          fireGrad.addColorStop(0.4, '#f97316');
          fireGrad.addColorStop(1, '#dc2626');
          
          ctx.fillStyle = fireGrad;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 10);
          ctx.quadraticCurveTo(cx + 7, cy - 2, cx + 5, cy + 5);
          ctx.quadraticCurveTo(cx, cy + 9, cx - 5, cy + 5);
          ctx.quadraticCurveTo(cx - 7, cy - 2, cx, cy - 10);
          ctx.closePath();
          ctx.fill();
        } 
        else if (character.id === 'lightning') {
          // Electrified energy swirls
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 2.0;
          ctx.lineCap = 'round';
          const spin = performance.now() * 0.005;
          
          ctx.beginPath();
          ctx.arc(cx, cy, 6, spin, spin + Math.PI * 0.9);
          ctx.stroke();

          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, 4, spin + Math.PI, spin + Math.PI * 1.9);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx, cy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        else if (character.id === 'whip') {
          // Draw Fog Purple core with curled silver-white whip
          ctx.fillStyle = '#a855f7';
          ctx.strokeStyle = '#ebd5ff';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(cx, cy, 6.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Curled silver thread around
          ctx.strokeStyle = '#f1f5f9';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, 9.5, -Math.PI / 4, Math.PI * 1.4);
          ctx.stroke();

          // Rhombus tip
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(cx + 8, cy - 8);
          ctx.lineTo(cx + 10, cy - 6);
          ctx.lineTo(cx + 8, cy - 4);
          ctx.lineTo(cx + 6, cy - 6);
          ctx.closePath();
          ctx.fill();
        }
        else if (character.id === 'cosmic_mage') {
          // Cool crescent star emblem
          ctx.fillStyle = '#67e8f9'; // Bright cyan
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 6;
          
          // Draw crescent moon
          ctx.beginPath();
          ctx.arc(cx - 3, cy, 7, -Math.PI / 2, Math.PI / 2, false);
          ctx.arc(cx - 1, cy, 7, Math.PI / 2, -Math.PI / 2, true);
          ctx.closePath();
          ctx.fill();
          
          // Draw 4-point star on the right side
          const sx = cx + 5;
          const sy = cy - 2;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(sx, sy - 5);
          ctx.quadraticCurveTo(sx, sy, sx + 5, sy);
          ctx.quadraticCurveTo(sx, sy, sx, sy + 5);
          ctx.quadraticCurveTo(sx, sy, sx - 5, sy);
          ctx.quadraticCurveTo(sx, sy, sx, sy - 5);
          ctx.closePath();
          ctx.fill();
          
          ctx.shadowBlur = 0; // reset
        }
        ctx.restore();
      }

      // Process and Draw Sim particles
      simParticles.forEach((p) => {
        p.life -= 0.016; // subtract delta frame approx
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, p.radius * (p.life / p.maxLife)), 0, Math.PI * 2);
        ctx.fillStyle = p.color;

        // Enhance effects lighting glows
        if (p.type === 'fire') {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#f97316';
        } else if (p.type === 'lightning') {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#22d3ee';
        } else if (p.type === 'blood') {
          ctx.shadowBlur = 5;
          ctx.shadowColor = '#ef4444';
        }

        ctx.fill();
        ctx.restore();
      });
      simParticles = simParticles.filter((p) => p.life > 0);

      // Render Floating texts
      floatingTexts.forEach((t) => {
        t.life -= 0.016;
        t.y -= 0.5; // slow scroll up

        ctx.font = 'bold 9.5px font-sans, sans-serif';
        ctx.fillStyle = t.color;
        ctx.globalAlpha = Math.min(1.0, t.life * 2.5) * alpha;
        ctx.textAlign = 'center';
        ctx.fillText(t.text, t.x, t.y);
      });
      floatingTexts = floatingTexts.filter((t) => t.life > 0);

      ctx.restore(); // restore globalAlpha/matrix

      // Render bottom visual timeline info
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(15, height - 25, width - 30, 8);
      
      const barFillProgress = frameCount / 270;
      ctx.fillStyle = character.color;
      ctx.fillRect(15, height - 25, (width - 30) * barFillProgress, 8);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 9px font-mono, monospace, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`階段狀態：${stateName}`, 15, height - 10);
      ctx.textAlign = 'right';
      ctx.fillText(`${(frameCount / 60).toFixed(1)}s / 4.5s`, width - 15, height - 10);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, character]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={() => {
        audio.playSelect();
        onClose();
      }}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <div 
        id="preview-popup-box"
        className="relative w-full max-w-lg md:max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col md:flex-row gap-5 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => {
            audio.playSelect();
            onClose();
          }}
          className="absolute top-4 right-4 z-40 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Interative Canvas Simulation */}
        <div className="w-full md:w-1/2 flex flex-col gap-2">
          <div className="text-sm font-semibold text-slate-350 tracking-wide font-sans mb-1 text-left flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span>動態小技能施展示意圖</span>
          </div>
          <div className="w-full aspect-[4/3] min-h-[200px] max-h-[250px] md:max-h-full rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-950 shadow-inner">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
          <p className="text-[10px] text-slate-500 leading-normal text-left">
            碰撞觸發：當冷卻狀態結束後，角色碰撞敵方會自動釋放。當敵方逃脫攻擊時將提前結束並進入冷卻。
          </p>
        </div>

        {/* Right Side: Skill Parameter Specifications */}
        <div className="w-full md:w-1/2 flex flex-col justify-between" id="preview-text-container">
          <div>
            {/* Header: Name & titles */}
            <div className="flex items-center gap-3 mb-3 text-left">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner flex-shrink-0 p-1">
                <CharacterVectorIcon characterId={character.id} className="w-11 h-11" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-100 flex items-center gap-1.5">
                  {character.name} <span className="text-xs px-2 py-0.5 rounded-md font-bold text-slate-300 border border-slate-700 bg-slate-800">{character.title}</span>
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-1">物理核心戰鬥機型機制詳解</p>
              </div>
            </div>

            {/* Quick Metrics Progress bar panel */}
            <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/80 mb-4 flex flex-col gap-2.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span>機體屬性規格</span>
              </div>
              
              {/* Stat 1: Initial HP */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">生命值 (Initial HP)</span>
                  <span className="text-slate-200 font-bold">{character.initialHp} Pts</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(character.initialHp / 100) * 100}%` }} />
                </div>
              </div>

              {/* Stat 2: Moving Speed */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">基礎速度 (Movement Speed)</span>
                  <span className="text-slate-200 font-bold">{(character.speed * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${(character.speed / 1.5) * 100}%` }} />
                </div>
              </div>

              {/* Stat 3: Weight/Mass */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">機體重量 (Mass / Momentum)</span>
                  <span className="text-slate-200 font-bold">{(character.mass * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(character.mass / 2.0) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Passive Skill Details */}
            <div className="bg-slate-950/75 rounded-2xl p-3.5 border border-slate-800/80 text-left mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: character.color }}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>被動防護機制：{character.skillName}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                {character.detailedDesc}
              </p>
            </div>

            {/* Special Sub-skill Details */}
            {character.subSkillName && (
              <div className="bg-[#ef4444]/5 rounded-2xl p-3.5 border border-red-500/10 text-left bg-gradient-to-br from-slate-950 via-slate-950 to-red-950/10">
                <div className="flex items-center gap-1.5 text-xs font-extrabold mb-1.5 text-emerald-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>專屬小技能：{character.subSkillName}</span>
                </div>
                <p className="text-[11px] text-slate-350 leading-normal font-sans">
                  {character.subSkillDesc || '沿用碰撞即時觸發自動釋放機制。'}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                audio.playSelect();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all hover:scale-[1.01] active:scale-95 border border-slate-700"
            >
              已了解機制 (確定)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
