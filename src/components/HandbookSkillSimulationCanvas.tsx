import React, { useState, useEffect, useRef } from 'react';
import { Character } from '../types';
import { CHARACTERS } from '../characters';
import { CharacterVectorIcon } from './CharacterVectorIcon';
import { audio } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
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
  Dribbble, 
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
  Activity
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

type TabType = 'characters' | 'items' | 'modes' | 'attributes' | 'controls';

// Sub-component to render identical high-fidelity vectors matching BattleArena drawing
// Upgraded dual-ball real-time 2D simulation canvas demonstrating characters' passive/active animations
export function HandbookSkillSimulationCanvas({ 
  char, 
  skillType, 
  skillPower, 
  counterType, 
  hasteCd 
}: { 
  char: Character; 
  skillType: 'passive' | 'active' | 'ultimate'; 
  skillPower: number; 
  counterType: 'neutral' | 'counter' | 'countered'; 
  hasteCd: number; 
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjust for High-DPI screens
    const dpr = window.devicePixelRatio || 1;
    let rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Watch for parent resize and dynamically update canvas coordinates
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const currentCtx = canvas.getContext('2d');
        if (currentCtx) {
          currentCtx.resetTransform();
          currentCtx.scale(dpr, dpr);
        }
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    let animId: number;
    let frameCount = 0;

    // Simulation particle pool
    interface SimParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      radius: number;
      life: number;
      maxLife: number;
      type: string;
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

    const render = () => {
      frameCount = (frameCount + 1) % 245; // 4.1s loop at 60fps

      const width = rect.width;
      const height = rect.height;

      // Draw gorgeous cosmic slate linear gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#090d1f'); // dark navy
      bgGrad.addColorStop(1, '#020617'); // deep slate-950
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Delicate vector HUD border accent inside canvas
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(4, 4, width - 8, height - 8);

      // Tech Grid overlay
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.12)';
      ctx.lineWidth = 0.5;
      const grid = 15;
      for (let x = 0; x < width; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Simulation timeline coordinates
      const cy = height / 2 - 4;
      const casterRadius = 23;
      const targetRadius = 23;

      let casterX = 45;
      let targetX = width - 55;
      let alpha = 1.0;

      let phase = 'approach'; // approach, active, recovery, reset
      let progress = 0;

      if (frameCount < 65) {
        phase = 'approach';
        progress = frameCount / 65;
        const targetCollisionX = targetX - casterRadius - targetRadius;
        // Ease-in approach curve
        casterX = 40 + (targetCollisionX - 40) * (progress * progress);
      } else if (frameCount < 145) {
        phase = 'active';
        progress = (frameCount - 65) / 80;
        casterX = targetX - casterRadius - targetRadius;
      } else if (frameCount < 205) {
        phase = 'recovery';
        progress = (frameCount - 145) / 60;
        const targetCollisionX = targetX - casterRadius - targetRadius;
        casterX = targetCollisionX - Math.sin(progress * Math.PI) * 14;
      } else {
        phase = 'reset';
        progress = (frameCount - 205) / 40;
        casterX = targetX - casterRadius - targetRadius;
        alpha = Math.max(0, 1.0 - progress);
      }

      ctx.save();
      ctx.globalAlpha = alpha;

      // Draw ambient light background glow for caster hero
      const glowRad = casterRadius + 18;
      const casterGlow = ctx.createRadialGradient(casterX, cy, casterRadius - 10, casterX, cy, glowRad);
      casterGlow.addColorStop(0, char.color);
      casterGlow.addColorStop(0.5, char.color + '40');
      casterGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = casterGlow;
      ctx.beginPath();
      ctx.arc(casterX, cy, glowRad, 0, Math.PI * 2);
      ctx.fill();

      // Calculation of damage based on inputs (multipliers & counter values)
      const multiplier = skillPower;
      const counterFactor = counterType === 'counter' ? 1.3 : counterType === 'countered' ? 0.8 : 1.0;
      const finalDmgFactor = multiplier * counterFactor;

      // Handle specific skill visual fx overlays during 'active' phase
      if (phase === 'active') {
        const contactX = casterX + casterRadius;

        // VAMPIRE
        if (char.id === 'vampire') {
          if (skillType === 'passive') {
            // Vampire passive siphon cone
            ctx.save();
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
            ctx.lineWidth = 2;
            ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
            ctx.beginPath();
            ctx.arc(casterX, cy, casterRadius * 1.9, -Math.PI/3, Math.PI/3);
            ctx.lineTo(casterX, cy);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.restore();

            // Siphon curly flow strands
            ctx.save();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(casterX, cy);
            ctx.bezierCurveTo(casterX + 20, cy - 10, targetX - 20, cy + 10, targetX, cy);
            ctx.stroke();
            ctx.restore();

            if (frameCount % 6 === 0) {
              simParticles.push({
                x: targetX,
                y: cy + (Math.random() * 16 - 8),
                vx: -3.8,
                vy: (Math.random() - 0.5) * 3,
                color: '#ef4444',
                radius: Math.random() * 2 + 1.5,
                life: 1.0,
                maxLife: 0.5,
                type: 'blood'
              });
            }

            if (frameCount === 67 || frameCount === 105) {
              const dmg = 1.8 * finalDmgFactor;
              floatingTexts.push({ text: `-${dmg.toFixed(2)} 嗜血絞噬`, x: targetX, y: cy - 25, color: '#ef4444', life: 1.0 });
              floatingTexts.push({ text: `+${dmg.toFixed(2)} 吸血`, x: casterX, y: cy - 25, color: '#10b981', life: 1.0 });
            }
          } else if (skillType === 'active') {
            // Vampire active Crack Fang lunge
            ctx.save();
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
            ctx.lineWidth = 4;
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#ef4444';
            ctx.beginPath();
            // Giant crimson fangs clawing dummy
            ctx.moveTo(targetX - 10, cy - 16);
            ctx.lineTo(targetX - 2, cy - 2);
            ctx.lineTo(targetX + 6, cy - 14);
            ctx.moveTo(targetX - 10, cy + 16);
            ctx.lineTo(targetX - 2, cy + 2);
            ctx.lineTo(targetX + 6, cy + 14);
            ctx.stroke();
            ctx.restore();

            if (frameCount % 3 === 0) {
              simParticles.push({
                x: targetX + (Math.random() * 24 - 12),
                y: cy + (Math.random() * 24 - 12),
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 5,
                color: '#f87171',
                radius: Math.random() * 3 + 1.5,
                life: 1.0,
                maxLife: 0.6,
                type: 'blood'
              });
            }

            if (frameCount === 67) {
              const dmg = 5.52 * finalDmgFactor;
              floatingTexts.push({ text: `💥-${dmg.toFixed(2)} 裂牙突刺!`, x: targetX, y: cy - 28, color: '#ef4444', life: 1.25 });
              floatingTexts.push({ text: `+${(dmg * 0.5).toFixed(2)} 吸血`, x: casterX, y: cy - 28, color: '#10b981', life: 1.25 });
            }
          } else {
            // Vampire Ultimate: Gothic Bat Swarm (蝠群夜襲)
            ctx.save();
            ctx.fillStyle = '#ef4444';
            // Draw bats moving to target
            for (let i = 0; i < 4; i++) {
              const bx = casterX + (targetX - casterX) * progress - 10 + Math.sin(frameCount * 0.2 + i) * 15;
              const by = cy + Math.sin(frameCount * 0.12 + i * 2) * 16;
              ctx.beginPath();
              ctx.moveTo(bx, by - 4);
              ctx.lineTo(bx - 6, by + 2);
              ctx.lineTo(bx + 6, by + 2);
              ctx.closePath();
              ctx.fill();
            }
            ctx.restore();

            if (frameCount % 4 === 0) {
              simParticles.push({
                x: targetX + (Math.random() * 20 - 10),
                y: cy + (Math.random() * 20 - 10),
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 3,
                color: '#b91c1c',
                radius: Math.random() * 2.5 + 1,
                life: 1.0,
                maxLife: 0.5,
                type: 'blood'
              });
            }

            if (frameCount === 67 || frameCount === 105) {
              const dmg = 3.0 * finalDmgFactor;
              floatingTexts.push({ text: `🦇-${dmg.toFixed(2)} 蝠群夜襲!`, x: targetX, y: cy - 28, color: '#ef4444', life: 1.25 });
              floatingTexts.push({ text: `🔒 對手HP偷取並降速20%`, x: targetX, y: cy - 14, color: '#f87171', life: 1.25 });
              floatingTexts.push({ text: `+${(dmg * 0.5).toFixed(2)} 汲取`, x: casterX, y: cy - 28, color: '#10b981', life: 1.25 });
            }
          }
        }

        // MUD
        if (char.id === 'mud') {
          if (skillType === 'passive') {
            // Mud flat puddle
            ctx.fillStyle = 'rgba(120, 53, 15, 0.4)';
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.ellipse(contactX, cy + 8, casterRadius * 1.5, casterRadius * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            if (frameCount % 6 === 0) {
              simParticles.push({
                x: contactX + (Math.random() * 24 - 12),
                y: cy + 6,
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 2 - 0.5,
                color: '#b45309',
                radius: Math.random() * 3 + 1,
                life: 1.0,
                maxLife: 0.5,
                type: 'dust'
              });
            }

            if (frameCount === 67) {
              const dmg = 2.0 * finalDmgFactor;
              floatingTexts.push({ text: `-${dmg.toFixed(2)} 泥濘沼澤`, x: targetX, y: cy - 25, color: '#d97706', life: 1.1 });
              floatingTexts.push({ text: `🔒 緩速常數 20%`, x: targetX, y: cy - 12, color: '#f59e0b', life: 1.1 });
            }
          } else if (skillType === 'active') {
            // Mud active feet lock puddle
            ctx.fillStyle = 'rgba(120, 53, 15, 0.65)';
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.ellipse(contactX, cy + 8, casterRadius * 2.2, casterRadius * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            if (frameCount % 3 === 0) {
              simParticles.push({
                x: contactX + (Math.random() * 36 - 18),
                y: cy + 8,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 3.5 - 1.2,
                color: '#92400e',
                radius: Math.random() * 4.5 + 1.5,
                life: 1.0,
                maxLife: 0.7,
                type: 'dust'
              });
            }

            if (frameCount === 67) {
              const dmg = 2.0 * finalDmgFactor;
              floatingTexts.push({ text: `🧱-${dmg.toFixed(2)} 泥沼纏足!`, x: targetX, y: cy - 28, color: '#fbbf24', life: 1.3 });
              floatingTexts.push({ text: `🔒 步覆維艱 (速降至 4%)`, x: targetX, y: cy - 14, color: '#f59e0b', life: 1.3 });
            }
          } else {
            // Mud Ultimate: Fractured Earth Pillar (大地崩裂石柱)
            // Sand ring at feet and huge spike
            ctx.save();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 2]);
            ctx.beginPath();
            ctx.ellipse(targetX, cy + 10, 24, 8, 0, 0, Math.PI*2);
            ctx.stroke();

            if (progress > 0.4) {
              // Draw stone pillar spiking up
              ctx.fillStyle = '#78350f';
              ctx.strokeStyle = '#d97706';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(targetX - 16, cy + 12);
              ctx.lineTo(targetX - 10, cy - 25);
              ctx.lineTo(targetX + 10, cy - 25);
              ctx.lineTo(targetX + 16, cy + 12);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }
            ctx.restore();

            if (frameCount % 3 === 0) {
              simParticles.push({
                x: targetX + (Math.random() * 30 - 15),
                y: cy + 10,
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 4 - 1,
                color: '#d97706',
                radius: Math.random() * 4 + 2,
                life: 1.0,
                maxLife: 0.6,
                type: 'dust'
              });
            }

            if (frameCount === 67) {
              const dmg = 4.0 * finalDmgFactor;
              floatingTexts.push({ text: `🪨-${dmg.toFixed(2)} 大地崩裂石柱!`, x: targetX, y: cy - 35, color: '#d97706', life: 1.3 });
              floatingTexts.push({ text: `💫 鈍擊眩暈僵直 1.0 秒`, x: targetX, y: cy - 20, color: '#f59e0b', life: 1.3 });
            }
          }
        }

        // BLAZE
        if (char.id === 'blaze') {
          if (skillType === 'passive') {
            const rad = casterRadius * 1.7;
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.arc(casterX, cy, rad, 0, Math.PI * 2);
            ctx.stroke();

            if (frameCount % 4 === 0) {
              simParticles.push({
                x: casterX + (Math.random() * 32 - 16),
                y: cy + (Math.random() * 32 - 16),
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 3 - 1,
                color: '#ea580c',
                radius: Math.random() * 3.5 + 1,
                life: 1.0,
                maxLife: 0.6,
                type: 'fire'
              });
            }

            if (frameCount % 18 === 0) {
              const dmg = 1.5 * finalDmgFactor;
              floatingTexts.push({ text: `-${dmg.toFixed(2)} 熾熱燃燒`, x: targetX, y: cy - 25, color: '#f97316', life: 0.8 });
            }
          } else if (skillType === 'active') {
            const rad = casterRadius * 2.5;
            ctx.save();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 4;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#dc2626';
            ctx.beginPath();
            ctx.arc(casterX, cy, rad, 0, Math.PI * 2);
            ctx.stroke();

            // giant fire gradient
            const fireFm = ctx.createRadialGradient(casterX, cy, casterRadius, casterX, cy, rad);
            fireFm.addColorStop(0, 'rgba(239, 68, 68, 0.55)');
            fireFm.addColorStop(0.6, 'rgba(249, 115, 22, 0.2)');
            fireFm.addColorStop(1, 'rgba(249, 115, 22, 0)');
            ctx.fillStyle = fireFm;
            ctx.fill();
            ctx.restore();

            if (frameCount % 3 === 0) {
              simParticles.push({
                x: casterX + (Math.random() * rad - rad/2),
                y: cy + (Math.random() * rad - rad/2),
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: Math.random() < 0.55 ? '#f97316' : '#ef4444',
                radius: Math.random() * 5 + 1.5,
                life: 1.0,
                maxLife: 0.7,
                type: 'fire'
              });
            }

            if (frameCount === 67) {
              const dmg = 3.0 * finalDmgFactor;
              floatingTexts.push({ text: `🔥-${dmg.toFixed(2)} 瞬間爆燃!`, x: targetX, y: cy - 28, color: '#f97316', life: 1.3 });
            }
          } else {
            // Blaze Ultimate: Meteor Magma Rain (流星熔岩落)
            // Falling blazing fireballs from sky
            ctx.save();
            const fallenCount = Math.floor(progress * 3);
            for (let i = 0; i <= fallenCount && i < 3; i++) {
              const fireballY = cy - 45 + progress * 70 - (i * 12);
              const fireballX = targetX - (15 - i * 15);
              ctx.beginPath();
              ctx.arc(fireballX, fireballY, 6, 0, Math.PI*2);
              ctx.fillStyle = '#ef4444';
              ctx.shadowBlur = 10;
              ctx.shadowColor = '#f97316';
              ctx.fill();
            }
            ctx.restore();

            if (frameCount % 3 === 0) {
              simParticles.push({
                x: targetX + (Math.random() * 32 - 16),
                y: cy + (Math.random() * 20 - 10),
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 4,
                color: '#f97316',
                radius: Math.random() * 4 + 1.5,
                life: 1.0,
                maxLife: 0.5,
                type: 'fire'
              });
            }

            if (frameCount === 67 || frameCount === 110) {
              const dmg = 4.5 * finalDmgFactor;
              floatingTexts.push({ text: `☄️-${dmg.toFixed(2)} 流星熔岩落!`, x: targetX, y: cy - 28, color: '#f97316', life: 1.35 });
              floatingTexts.push({ text: `🔥 molten 熔岩火海留存`, x: targetX, y: cy - 14, color: '#ef4444', life: 1.35 });
            }
          }
        }

        // LIGHTNING
        if (char.id === 'lightning') {
          if (skillType === 'passive') {
            const rad = casterRadius * 1.5;
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.arc(casterX, cy, rad, 0, Math.PI * 2);
            ctx.stroke();

            if (frameCount % 5 === 0) {
              simParticles.push({
                x: casterX + (Math.random() * 26 - 13),
                y: cy + (Math.random() * 26 - 13),
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                color: '#22d3ee',
                radius: Math.random() * 2.5 + 1,
                life: 1.0,
                maxLife: 0.5,
                type: 'lightning'
              });
            }

            if (frameCount === 67) {
              const dmg = 1.2 * finalDmgFactor;
              floatingTexts.push({ text: `-${dmg.toFixed(2)} 氣旋屏障`, x: targetX, y: cy - 25, color: '#06b6d4', life: 1.0 });
            }
          } else if (skillType === 'active') {
            // Turbo turbulence Hurricane
            const rad = casterRadius * 1.9;
            ctx.save();
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 3.5;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#06b6d4';
            ctx.setLineDash([8, 4]);
            ctx.beginPath();
            ctx.arc(casterX, cy, rad, -Date.now()*0.02, -Date.now()*0.02 + Math.PI*2);
            ctx.stroke();
            ctx.restore();

            // blow back distance!
            const blowDist = progress * 48;
            targetX = (width - 55) + blowDist;

            if (frameCount % 3 === 0) {
              simParticles.push({
                x: casterX + (Math.random() * rad - rad/2),
                y: cy + (Math.random() * rad - rad/2),
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: '#06b6d4',
                radius: Math.random() * 3.5 + 1.2,
                life: 1.0,
                maxLife: 0.6,
                type: 'lightning'
              });
            }

            if (frameCount === 67) {
              const dmg = 2.8 * finalDmgFactor;
              floatingTexts.push({ text: `🌀-${dmg.toFixed(2)} 強力亂流 (吹飛!)`, x: targetX - 5, y: cy - 28, color: '#06b6d4', life: 1.3 });
            }
          } else {
            // Lightning Ultimate: Heaven's Wrath Thunder (天劫狂雷打)
            ctx.save();
            // Blinking electricity cloud
            ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(targetX, cy - 40, 20, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();

            // Thunder laser strike down
            if (progress > 0.4) {
              ctx.strokeStyle = '#ffffff';
              ctx.shadowBlur = 15;
              ctx.shadowColor = '#22d3ee';
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.moveTo(targetX, cy - 40);
              ctx.lineTo(targetX - 6, cy - 15);
              ctx.lineTo(targetX + 8, cy + 5);
              ctx.stroke();
            }
            ctx.restore();

            if (frameCount % 3 === 0) {
              simParticles.push({
                x: targetX + (Math.random() * 24 - 12),
                y: cy + (Math.random() * 16 - 8),
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: '#22d3ee',
                radius: Math.random() * 3 + 1,
                life: 1.0,
                maxLife: 0.5,
                type: 'lightning'
              });
            }

            if (frameCount === 67) {
              const dmg = 3.5 * finalDmgFactor;
              floatingTexts.push({ text: `⚡-${dmg.toFixed(2)} 天劫狂雷打!`, x: targetX, y: cy - 28, color: '#06b6d4', life: 1.35 });
              floatingTexts.push({ text: `💥 大強度電磁擊退並感電`, x: targetX, y: cy - 14, color: '#22d3ee', life: 1.35 });
            }
          }
        }

        // DICE
        if (char.id === 'dice') {
          if (skillType === 'passive') {
            if (frameCount === 67) {
              const dmg = 2.4 * finalDmgFactor;
              floatingTexts.push({ text: `🎲-${dmg.toFixed(2)} 混沌骰擊!`, x: targetX, y: cy - 25, color: '#f1f5f9', life: 1.15 });
            }
          } else if (skillType === 'active') {
            // roll outcome simulation cycling
            const stateSec = Math.floor(Date.now() / 2500) % 3 + 1;
            ctx.save();
            ctx.font = 'black 15px font-mono, sans-serif';
            ctx.fillStyle = stateSec === 1 ? '#eab308' : stateSec === 2 ? '#22c55e' : '#ef4444';
            ctx.textAlign = 'center';
            ctx.fillText(`命運: [${stateSec} 點]`, casterX, cy - casterRadius - 12);
            ctx.restore();

            if (frameCount === 67) {
              const dmg = 2.4 * finalDmgFactor;
              if (stateSec === 1) {
                floatingTexts.push({ text: `🔒-[1] 負重引力 (速-60%)`, x: targetX, y: cy - 28, color: '#eab308', life: 1.35 });
              } else if (stateSec === 2) {
                floatingTexts.push({ text: `⇄-[2] 混沌顛倒反向`, x: targetX, y: cy - 28, color: '#22c55e', life: 1.35 });
              } else {
                floatingTexts.push({ text: `🎰-[3] CD 回收! (大彩頭)`, x: casterX, y: cy - 28, color: '#ef4444', life: 1.35 });
              }
            }
          } else {
            // Dice Ultimate: Scales of Paradox (真理天平)
            // Draw balancing scales in center
            ctx.save();
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(width / 2, cy - 20);
            ctx.lineTo(width / 2, cy + 20);
            ctx.moveTo(width / 2 - 25, cy - 10);
            ctx.lineTo(width / 2 + 25, cy - 10);
            ctx.stroke();
            ctx.restore();

            if (frameCount === 67) {
              const balanceMode = Math.random() < 0.5;
              if (balanceMode) {
                floatingTexts.push({ text: `⚖️ 「真理天平」百分比生命值均等重置!`, x: width/2, y: cy - 28, color: '#38bdf8', life: 1.5 });
              } else {
                const dmg = 3.0 * finalDmgFactor;
                floatingTexts.push({ text: `⚡ 隨機因果量子爆傷: -${dmg.toFixed(2)} HP`, x: targetX, y: cy - 28, color: '#cbd5e1', life: 1.5 });
              }
            }
          }
        }

        // GRAVITY
        if (char.id === 'gravity') {
          if (skillType === 'passive') {
            const rad = casterRadius * 1.8;
            ctx.strokeStyle = '#818cf8';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(casterX, cy, rad, 0, Math.PI * 2);
            ctx.stroke();

            // Pull dummy slowly
            targetX = (width - 55) - progress * 16;

            if (frameCount % 24 === 0) {
              const dmg = 1.0 * finalDmgFactor;
              floatingTexts.push({ text: `-${dmg.toFixed(2)} 宇宙輻射`, x: targetX, y: cy - 25, color: '#818cf8', life: 0.8 });
            }
          } else if (skillType === 'active') {
            const rad = casterRadius * 2.2;
            ctx.strokeStyle = '#4f46e5';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(casterX, cy, rad, 0, Math.PI * 2);
            ctx.stroke();

            // massive vacuum drag target inwards
            targetX = (width - 55) - progress * 42;

            if (frameCount === 67) {
              const dmg = 2.76 * finalDmgFactor;
              floatingTexts.push({ text: `🪐-${dmg.toFixed(2)} 重力裂縫能量崩塌`, x: targetX, y: cy - 28, color: '#818cf8', life: 1.3 });
              floatingTexts.push({ text: `🛡️ 2.5s 空間折疊無敵`, x: casterX, y: cy - 28, color: '#cbd5e1', life: 1.3 });
            }
          } else {
            // Gravity Ultimate: Tidal Singularity Wave (坍縮引力潮)
            // Big dark nebula vortex in the middle
            ctx.save();
            ctx.fillStyle = 'rgba(30, 27, 75, 0.4)';
            ctx.strokeStyle = '#818cf8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(width / 2, cy, 35, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(width / 2, cy, 20 + Math.sin(frameCount * 0.1) * 8, 0, Math.PI*2);
            ctx.strokeStyle = '#4f46e5';
            ctx.stroke();
            ctx.restore();

            // Sucking dummy to center
            targetX = (width - 55) - progress * 80;

            if (frameCount % 3 === 0) {
              simParticles.push({
                x: width/2 + (Math.random() * 60 - 30),
                y: cy + (Math.random() * 60 - 30),
                vx: (width/2 - casterX) * 0.05,
                vy: (cy - cy) * 0.05,
                color: '#6366f1',
                radius: Math.random() * 3 + 1,
                life: 1.0,
                maxLife: 0.4,
                type: 'void'
              });
            }

            if (frameCount === 67) {
              const dmg = 2.5 * finalDmgFactor;
              floatingTexts.push({ text: `🌀-${dmg.toFixed(2)} 坍縮引力潮汐爆縮!`, x: targetX, y: cy - 28, color: '#818cf8', life: 1.35 });
              floatingTexts.push({ text: `⚠️ 40% 深度引力阻尼減速`, x: targetX, y: cy - 14, color: '#4f46e5', life: 1.35 });
            }
          }
        }

        // PHANTOM
        if (char.id === 'phantom') {
          if (skillType === 'passive') {
            const cloneX = casterX + progress * 40;
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#c084fc';
            ctx.beginPath();
            ctx.arc(cloneX, cy, casterRadius - 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            if (frameCount === 67) {
              const dmg = 1.7 * finalDmgFactor;
              floatingTexts.push({ text: `👥-${dmg.toFixed(2)} 鏡像連攜割裂`, x: targetX, y: cy - 25, color: '#c084fc', life: 1.2 });
            }
          } else if (skillType === 'active') {
            if (frameCount === 67) {
              const dmg = 1.84 * finalDmgFactor;
              floatingTexts.push({ text: `👥-${dmg.toFixed(2)} 鏡像碎裂超載聚爆!`, x: targetX, y: cy - 28, color: '#a855f7', life: 1.3 });
            }
          } else {
            // Phantom Ultimate: Quantum Phase Displacement (量子隨機相移)
            // Laser beam connecting caster and target and swapping positions
            ctx.save();
            ctx.strokeStyle = '#c084fc';
            ctx.lineWidth = 3.5;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#a855f7';
            ctx.beginPath();
            ctx.moveTo(casterX, cy);
            ctx.lineTo(targetX, cy);
            ctx.stroke();
            ctx.restore();

            if (frameCount === 67) {
              const dmg = 3.6 * finalDmgFactor;
              // Float text for swap
              floatingTexts.push({ text: `⇄ 量子引爆：強制位置互換!`, x: (casterX + targetX)/2, y: cy - 30, color: '#c084fc', life: 1.4 });
              floatingTexts.push({ text: `💥-${dmg.toFixed(2)} 湮滅冷光高能重創`, x: targetX, y: cy - 15, color: '#a855f7', life: 1.4 });
            }
          }
        }

        // CAT
        if (char.id === 'cat') {
          if (skillType === 'passive') {
            const dodgeOffset = Math.sin(progress * Math.PI) * 28;
            ctx.save();
            // incoming hazard ball
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.arc(targetX - progress*65, cy + dodgeOffset/2, 6, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();

            if (frameCount === 67) {
              floatingTexts.push({ text: `🐱 靈貓飄跡閃避!`, x: casterX, y: cy - 25, color: '#ebd5ff', life: 1.2 });
              floatingTexts.push({ text: `⭐ 移速印記 +8% (可疊3層)`, x: casterX, y: cy - 12, color: '#f5d0fe', life: 1.2 });
            }
          } else if (skillType === 'active') {
            // Amethyst claw slash mark
            ctx.save();
            ctx.strokeStyle = '#c084fc';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#d8b4fe';
            ctx.beginPath();
            ctx.moveTo(targetX - 12, cy - 16);
            ctx.lineTo(targetX + 6, cy + 16);
            ctx.moveTo(targetX - 3, cy - 16);
            ctx.lineTo(targetX + 15, cy + 16);
            ctx.stroke();
            ctx.restore();

            if (frameCount === 67) {
              const dmg = 2.1 * finalDmgFactor;
              floatingTexts.push({ text: `🐾-${dmg.toFixed(2)} 幽爪絆擊! `, x: targetX, y: cy - 28, color: '#e9d5ff', life: 1.3 });
              floatingTexts.push({ text: `📉 對手慣性降低 30%`, x: targetX, y: cy - 14, color: '#ebd5ff', life: 1.3 });
            }
          } else {
            // Cat Ultimate: Catnip Illusion (夢幻貓薄荷)
            // Throwing pink spinning bottle
            ctx.save();
            const bx = casterX + (targetX - casterX) * progress;
            const by = cy - Math.sin(progress * Math.PI) * 25;
            ctx.translate(bx, by);
            ctx.rotate(frameCount * 0.15);
            ctx.fillStyle = '#f472b6';
            ctx.fillRect(-6, -6, 12, 12);
            ctx.restore();

            if (progress > 0.8) {
              // Expand pink cloud
              ctx.fillStyle = 'rgba(244, 114, 182, 0.25)';
              ctx.beginPath();
              ctx.arc(targetX, cy, 32, 0, Math.PI*2);
              ctx.fill();
            }

            if (frameCount % 4 === 0) {
              simParticles.push({
                x: targetX + (Math.random() * 24 - 12),
                y: cy + (Math.random() * 24 - 12),
                vx: (Math.random() - 0.5) * 1.5,
                vy: -Math.random() * 2,
                color: '#f472b6',
                radius: Math.random() * 4 + 1.5,
                life: 1.0,
                maxLife: 0.6,
                type: 'pink'
              });
            }

            if (frameCount === 67) {
              const dmg = 2.5 * finalDmgFactor;
              floatingTexts.push({ text: `🌸-${dmg.toFixed(2)} 夢幻貓薄荷引爆!`, x: targetX, y: cy - 28, color: '#f472b6', life: 1.4 });
              floatingTexts.push({ text: `🙃 指令顛倒且速度衰減 -35%`, x: targetX, y: cy - 14, color: '#f5d0fe', life: 1.4 });
            }
          }
        }

        // SNAKE
        if (char.id === 'snake') {
          if (skillType === 'passive') {
            // green segment nutriment
            ctx.save();
            if (progress < 0.35) {
              ctx.fillStyle = '#10b981';
              ctx.beginPath();
              ctx.arc(casterX + 45, cy - 10, 6, 0, Math.PI*2);
              ctx.fill();
            }
            ctx.restore();

            if (frameCount === 67) {
              floatingTexts.push({ text: `🐍 貪食能量！身體長度+1`, x: casterX, y: cy - 25, color: '#10b981', life: 1.2 });
              floatingTexts.push({ text: `💚 生命穩固恢復 +4HP`, x: casterX, y: cy - 12, color: '#34d399', life: 1.2 });
            }
          } else if (skillType === 'active') {
            // coil constrict
            ctx.save();
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 3.0;
            ctx.beginPath();
            ctx.arc(targetX, cy, targetRadius + 8, 0, Math.PI * 1.6);
            ctx.stroke();
            ctx.restore();

            if (frameCount === 67) {
              const dmg = 1.8 * finalDmgFactor;
              floatingTexts.push({ text: `🐍 爆發蛇影衝鋒 (1.8x傷害)`, x: casterX, y: cy - 28, color: '#10b981', life: 1.3 });
              floatingTexts.push({ text: `⛓️ 纏勒勒絞 -${dmg.toFixed(2)} (速降40%)`, x: targetX, y: cy - 28, color: '#34d399', life: 1.3 });
            }
          } else {
            // Snake Ultimate: Gilded Viper Pit (万蛇噬骨毒鳞网)
            // 4 poisonous scales throwing down
            ctx.save();
            ctx.fillStyle = '#10b981';
            for (let i = 0; i < 4; i++) {
              const px = casterX + (targetX - casterX) * progress - 15 + (i * 10);
              const py = cy - 20 + Math.sin(progress * Math.PI + i) * 12;
              ctx.beginPath();
              ctx.arc(px, py, 3, 0, Math.PI*2);
              ctx.fill();
            }

            if (progress > 0.7) {
              // Draw poisonous grid
              ctx.strokeStyle = '#059669';
              ctx.lineWidth = 1;
              ctx.beginPath();
              for (let x = targetX - 20; x <= targetX + 20; x += 10) {
                ctx.moveTo(x, cy - 20);
                ctx.lineTo(x, cy + 20);
              }
              for (let y = cy - 20; y <= cy + 20; y += 10) {
                ctx.moveTo(targetX - 20, y);
                ctx.lineTo(targetX + 20, y);
              }
              ctx.stroke();
            }
            ctx.restore();

            if (frameCount % 4 === 0) {
              simParticles.push({
                x: targetX + (Math.random() * 24 - 12),
                y: cy + (Math.random() * 24 - 12),
                vx: (Math.random() - 0.5) * 1.5,
                vy: Math.random() * 2,
                color: '#10b981',
                radius: Math.random() * 2 + 1,
                life: 1.0,
                maxLife: 0.5,
                type: 'poison'
              });
            }

            if (frameCount === 67 || frameCount === 105) {
              const dmg = 3.6 * finalDmgFactor;
              floatingTexts.push({ text: `🐍-毒鱗網結成! 承受-${dmg.toFixed(2)} 中毒`, x: targetX, y: cy - 28, color: '#10b981', life: 1.3 });
              floatingTexts.push({ text: `🧪 對手防護與重力削減 25%`, x: targetX, y: cy - 14, color: '#34d399', life: 1.3 });
            }
          }
        }

        // GRID9
        if (char.id === 'grid9') {
          if (skillType === 'passive') {
            ctx.save();
            ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
            ctx.fillRect(width - 95, cy - 40, 80, 80);
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 1;
            ctx.strokeRect(width - 95, cy - 40, 80, 80);
            ctx.font = 'bold 10px font-mono';
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('宮格 [ 5 ]', width - 85, cy - 25);
            ctx.restore();

            if (frameCount === 67) {
              const rawDmg = (7 + 5) * 0.40;
              const dmg = rawDmg * finalDmgFactor;
              floatingTexts.push({ text: `🔢 位標共振 (球面7 + 5號格)`, x: casterX, y: cy - 35, color: '#f59e0b', life: 1.35 });
              floatingTexts.push({ text: `💥-${dmg.toFixed(2)} 數位裂解響應`, x: targetX, y: cy - 25, color: '#fbbf24', life: 1.35 });
            }
          } else if (skillType === 'active') {
            ctx.save();
            ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
            ctx.fillRect(width - 95, cy - 40, 80, 80);
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(width - 95, cy - 40, 80, 80);
            ctx.restore();

            if (frameCount === 67) {
              const rawDmg = (7 + 5) * 0.80;
              const dmg = rawDmg * finalDmgFactor;
              floatingTexts.push({ text: `🔢 數陣爆擊 (奧義定格倍番)`, x: casterX, y: cy - 35, color: '#fbbf24', life: 1.35 });
              floatingTexts.push({ text: `⚡-${dmg.toFixed(2)} 雙倍數域裂變!`, x: targetX, y: cy - 25, color: '#f59e0b', life: 1.35 });
            }
          } else {
            // Grid9 Ultimate: Grid Lock Resonance (九九縱橫鎖網)
            // Cross grid locked golden
            ctx.save();
            ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.5;
            // Draw cross-shaped matrices
            ctx.fillRect(targetX - 40, cy - 10, 80, 20);
            ctx.fillRect(targetX - 10, cy - 40, 20, 80);
            ctx.strokeRect(targetX - 40, cy - 10, 80, 20);
            ctx.strokeRect(targetX - 10, cy - 40, 20, 80);
            ctx.restore();

            if (frameCount === 67) {
              const dmg = 4.5 * finalDmgFactor;
              floatingTexts.push({ text: `🔒 九宮縱橫天網縮減：-${dmg.toFixed(2)}`, x: targetX, y: cy - 28, color: '#fbbf24', life: 1.4 });
              floatingTexts.push({ text: `⚡ 十字合圍鎖死 50% 移速`, x: targetX, y: cy - 14, color: '#f59e0b', life: 1.4 });
            }
          }
        }

        // WATER DRAGON
        if (char.id === 'water_dragon') {
          if (skillType === 'passive') {
            ctx.save();
            const grad = ctx.createLinearGradient(casterX, cy, targetX, cy);
            grad.addColorStop(0, '#38bdf8');
            grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.55)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(casterX + casterRadius, cy - 6, targetX - casterX, 12);
            ctx.restore();

            if (frameCount % 5 === 0) {
              simParticles.push({
                x: casterX + casterRadius + Math.random() * 50,
                y: cy + (Math.random() * 12 - 6),
                vx: 4.2,
                vy: (Math.random() - 0.5) * 2,
                color: '#0ea5e9',
                radius: Math.random() * 2.5 + 1.5,
                life: 1.0,
                maxLife: 0.5,
                type: 'water'
              });
            }

            if (frameCount === 67 || frameCount === 105) {
              const dmg = 1.66 * finalDmgFactor;
              floatingTexts.push({ text: `🌊-${dmg.toFixed(2)} 噴射壓水柱`, x: targetX, y: cy - 25, color: '#38bdf8', life: 0.95 });
            }
          } else if (skillType === 'active') {
            // Dragon wave detonation sphere
            ctx.save();
            ctx.beginPath();
            ctx.arc(targetX, cy, targetRadius * 2.1, 0, Math.PI*2);
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
            ctx.fill();
            ctx.restore();

            if (frameCount % 3 === 0) {
              simParticles.push({
                x: targetX + (Math.random() * 36 - 18),
                y: cy + (Math.random() * 36 - 18),
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: '#38bdf8',
                radius: Math.random() * 4 + 1.5,
                life: 1.0,
                maxLife: 0.7,
                type: 'water'
              });
            }

            if (frameCount === 67) {
              const dmg = 3.31 * finalDmgFactor;
              floatingTexts.push({ text: `🐉-${dmg.toFixed(2)} 龍嘯大水爆!`, x: targetX, y: cy - 28, color: '#38bdf8', life: 1.3 });
              floatingTexts.push({ text: `💧 獲得3顆拾取精純水滴`, x: casterX, y: cy - 28, color: '#0ea5e9', life: 1.3 });
            }
          } else {
            // Water Dragon Ultimate: Tectonic Flood Surge (怒海驚濤巨浪)
            // Big water wall crossing
            ctx.save();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 3;
            const waveX = progress * width;
            ctx.fillRect(waveX - 10, 0, 20, height);
            ctx.beginPath();
            ctx.moveTo(waveX, 0);
            ctx.lineTo(waveX, height);
            ctx.stroke();
            ctx.restore();

            // Squeeze dummy to the right
            if (waveX > targetX - 25) {
              targetX = Math.min(width - 25, waveX + 25);
            }

            if (frameCount % 2 === 0) {
              simParticles.push({
                x: waveX + (Math.random() * 10 - 5),
                y: Math.random() * height,
                vx: 3,
                vy: (Math.random() - 0.5) * 2,
                color: '#0ea5e9',
                radius: Math.random() * 5 + 2,
                life: 1.0,
                maxLife: 0.4,
                type: 'water'
              });
            }

            if (frameCount === 67) {
              const dmg = 3.5 * finalDmgFactor;
              floatingTexts.push({ text: `🌊-${dmg.toFixed(2)} 怒海驚濤巨浪!`, x: targetX, y: cy - 28, color: '#38bdf8', life: 1.4 });
              floatingTexts.push({ text: `🌪️ 全屏海藍水牆強制推飛擊退`, x: targetX, y: cy - 14, color: '#0ea5e9', life: 1.4 });
            }
          }
        }

        // WHIP
        if (char.id === 'whip') {
          if (skillType === 'passive') {
            ctx.strokeStyle = '#d8b4fe';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(casterX, cy);
            ctx.lineTo(targetX, cy);
            ctx.stroke();

            if (frameCount === 67) {
              floatingTexts.push({ text: `⛓️ 長鞭重力削減 -22% 慣性`, x: targetX, y: cy - 25, color: '#c084fc', life: 1.3 });
              floatingTexts.push({ text: `🛡️ 自身彈飛擊退減弱 -25%`, x: casterX, y: cy - 25, color: '#ebd5ff', life: 1.3 });
            }
          } else if (skillType === 'active') {
            // Double whipping wave
            ctx.save();
            ctx.strokeStyle = '#f1f5f9';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(casterX, cy);
            const midX = (casterX + targetX) / 2;
            ctx.bezierCurveTo(midX, cy - 30, midX, cy + 30, targetX, cy);
            ctx.stroke();
            ctx.restore();

            if (frameCount === 67) {
              const dmg1 = 2.3 * finalDmgFactor;
              const dmg2 = 1.93 * finalDmgFactor;
              floatingTexts.push({ text: `💥 一段迅鞭突刺! -${dmg1.toFixed(2)}`, x: targetX, y: cy - 36, color: '#c084fc', life: 1.25 });
              floatingTexts.push({ text: `💫 二段環掃清場 -${dmg2.toFixed(2)}`, x: targetX, y: cy - 22, color: '#ebd5ff', life: 1.25 });
            }
          } else {
            // Whip Ultimate: Interstellar Net Edge (碎空銀絲矩陣)
            // Silver geometric net shield wrapping around caster repelling targets
            ctx.save();
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2.2;
            ctx.setLineDash([6, 3]);
            ctx.beginPath();
            ctx.arc(casterX, cy, 32, 0, Math.PI*2);
            ctx.stroke();
            ctx.restore();

            if (frameCount % 4 === 0) {
              simParticles.push({
                x: casterX + Math.sin(frameCount * 0.1) * 32,
                y: cy + Math.cos(frameCount * 0.1) * 32,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                color: '#cbd5e1',
                radius: 1.5,
                life: 1.0,
                maxLife: 0.5,
                type: 'silver'
              });
            }

            if (frameCount === 67) {
              const dmg = 2.8 * finalDmgFactor;
              floatingTexts.push({ text: `🚨 啟動「碎空銀絲矩陣」大盾反震!`, x: casterX, y: cy - 28, color: '#ebd5ff', life: 1.4 });
              floatingTexts.push({ text: `💥 抽打接觸敵軍: -${dmg.toFixed(2)} 並 130% 反衝推開`, x: targetX, y: cy - 28, color: '#c084fc', life: 1.4 });
            }
          }
        }

        // COSMIC MAGE
        if (char.id === 'cosmic_mage') {
          if (skillType === 'passive') {
            // Draw continuous star dust projectiles
            if (frameCount % 8 === 0) {
              simParticles.push({
                x: casterX + casterRadius,
                y: cy,
                vx: 4.5,
                vy: (Math.random() - 0.5) * 1.5,
                color: '#818cf8',
                radius: Math.random() * 2 + 1,
                life: 1.0,
                maxLife: 0.5,
                type: 'star'
              });
            }

            if (frameCount === 67 || frameCount === 105) {
              const dmg = 0.5 * finalDmgFactor;
              floatingTexts.push({ text: `🔮-${dmg.toFixed(2)} 星塵彈`, x: targetX, y: cy - 25, color: '#818cf8', life: 1.0 });
            }
          } else if (skillType === 'active') {
            // Black hole cage at target feet
            ctx.save();
            ctx.fillStyle = 'rgba(79, 70, 229, 0.25)';
            ctx.strokeStyle = '#4f46e5';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(targetX, cy + 8, targetRadius * 1.4, targetRadius * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Sucking aura lines
            ctx.strokeStyle = '#818cf8';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.ellipse(targetX, cy + 8, targetRadius * 1.8, targetRadius * 0.7, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            if (frameCount % 6 === 0) {
              simParticles.push({
                x: targetX + (Math.random() * 24 - 12),
                y: cy + 8,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -Math.random() * 2,
                color: '#818cf8',
                radius: Math.random() * 2 + 1,
                life: 1.0,
                maxLife: 0.5,
                type: 'void'
              });
            }

            if (frameCount === 67) {
              floatingTexts.push({ text: `🌀 黑洞囚籠 (控場減速中)`, x: targetX, y: cy - 25, color: '#818cf8', life: 1.2 });
            }
          } else { // ultimate
            // Astraea Beam falling from sky
            ctx.save();
            const beamW = 20;
            const grad = ctx.createLinearGradient(targetX - beamW/2, 0, targetX + beamW/2, 0);
            grad.addColorStop(0, 'rgba(251, 191, 36, 0)');
            grad.addColorStop(0.3, 'rgba(251, 191, 36, 0.75)');
            grad.addColorStop(0.5, '#ffffff');
            grad.addColorStop(0.7, 'rgba(251, 191, 36, 0.75)');
            grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(targetX - beamW, 0, beamW * 2, cy + targetRadius);
            ctx.restore();

            if (frameCount % 4 === 0) {
              simParticles.push({
                x: targetX + (Math.random() * 32 - 16),
                y: Math.random() * cy,
                vx: 0,
                vy: 5,
                color: '#fbbf24',
                radius: Math.random() * 2 + 1.5,
                life: 1.0,
                maxLife: 0.4,
                type: 'beam'
              });
            }

            if (frameCount === 67) {
              const dmg = 4.2 * finalDmgFactor;
              floatingTexts.push({ text: `✨-${dmg.toFixed(2)} 星光秩序重力射線!`, x: targetX, y: cy - 28, color: '#fbbf24', life: 1.3 });
              floatingTexts.push({ text: `🛡️ 消除敵方所有益處buff`, x: targetX, y: cy - 14, color: '#f59e0b', life: 1.3 });
            }
          }
        }

        // CONDUCTOR
        if (char.id === 'conductor') {
          if (skillType === 'passive') {
            // Passive railroad drawing + train running
            const roadY = cy + 10;
            // Draw track line
            ctx.save();
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(casterX, roadY);
            ctx.lineTo(targetX + 30, roadY);
            ctx.stroke();

            // sleepers
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.5)';
            ctx.lineWidth = 1.5;
            for (let rx = casterX; rx <= targetX + 30; rx += 15) {
              ctx.beginPath();
              ctx.moveTo(rx, roadY - 4);
              ctx.lineTo(rx, roadY + 4);
              ctx.stroke();
            }
            ctx.restore();

            // Train moving from casterX to targetX
            const progress = (frameCount % 60) / 60; // loop train movement
            const trainX = casterX + (targetX + 30 - casterX) * progress;
            ctx.save();
            ctx.fillStyle = '#94a3b8';
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 1.5;
            // Draw a cartoon steam train head
            ctx.beginPath();
            ctx.roundRect(trainX - 10, roadY - 8, 16, 12, 2);
            ctx.fill();
            ctx.stroke();
            // smoke stack
            ctx.fillStyle = '#475569';
            ctx.fillRect(trainX + 2, roadY - 12, 3, 4);
            ctx.restore();

            // Particle steam puffs
            if (frameCount % 6 === 0) {
              simParticles.push({
                x: trainX + 3,
                y: roadY - 13,
                vx: -0.5,
                vy: -0.6 - Math.random() * 0.8,
                color: 'rgba(219, 234, 254, 0.6)',
                radius: Math.random() * 2 + 1,
                life: 1.0,
                maxLife: 0.6,
                type: 'dust'
              });
            }

            // continuous damage floating text
            if (frameCount % 10 === 0 && Math.abs(trainX - targetX) < 18) {
              const dmgTick = 0.5 * finalDmgFactor; // micro damage for 0.1s tick
              floatingTexts.push({ text: `🚂-${dmgTick.toFixed(2)} 列車巡行!`, x: targetX, y: cy - 24, color: '#60a5fa', life: 0.6 });
            }
          } else if (skillType === 'active') {
            // Ticket punch: 45 degree sector, length 5
            ctx.save();
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
            ctx.beginPath();
            ctx.arc(casterX, cy, targetX - casterX, -Math.PI / 8, Math.PI / 8);
            ctx.lineTo(casterX, cy);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.restore();

            // Draw a ticking ticket symbol "🎫" or "無票！" locking circle
            if (frameCount > 40 && frameCount < 80) {
              ctx.save();
              ctx.strokeStyle = '#ef4444';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(targetX, cy, targetRadius * 1.5, 0, Math.PI * 2);
              ctx.stroke();
              // Cross lock lines
              ctx.beginPath();
              ctx.moveTo(targetX - 8, cy - 8);
              ctx.lineTo(targetX + 8, cy + 8);
              ctx.moveTo(targetX + 8, cy - 8);
              ctx.lineTo(targetX - 8, cy + 8);
              ctx.stroke();
              ctx.restore();
            }

            if (frameCount === 67) {
              const dmg = 8.0 * finalDmgFactor;
              floatingTexts.push({ text: `🎫 強制驗票! -${dmg.toFixed(2)}`, x: targetX, y: cy - 28, color: '#f59e0b', life: 1.3 });
              floatingTexts.push({ text: `🔒【無票】狀態：定身且禁位移!`, x: targetX, y: cy - 14, color: '#ef4444', life: 1.3 });
            }
          } else { // ultimate
            // Emergency Brake - coach domain
            const domainRad = 55;
            ctx.save();
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([4, 2]);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
            ctx.beginPath();
            ctx.arc(casterX + 35, cy, domainRad, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Draw barrier gates
            ctx.setLineDash([]);
            ctx.strokeStyle = '#1d4ed8';
            ctx.lineWidth = 1.5;
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
              const bx = casterX + 35 + Math.cos(a) * domainRad;
              const by = cy + Math.sin(a) * domainRad;
              ctx.beginPath();
              ctx.arc(bx, by, 3, 0, Math.PI * 2);
              ctx.fillStyle = '#fbbf24';
              ctx.fill();
              ctx.stroke();
            }
            ctx.restore();

            if (frameCount % 10 === 0) {
              simParticles.push({
                x: casterX + 35 + (Math.random() * 80 - 40),
                y: cy + (Math.random() * 80 - 40),
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                color: '#3b82f6',
                radius: Math.random() * 3 + 1,
                life: 1.0,
                maxLife: 0.8,
                type: 'spark'
              });
            }

            if (frameCount === 67) {
              const dps = 5.0 * finalDmgFactor;
              floatingTexts.push({ text: `📣 鳴笛啟動 - 緊急煞車·車廂領域!`, x: casterX + 30, y: cy - 32, color: '#60a5fa', life: 1.5 });
              floatingTexts.push({ text: `🛡️ 隊友獲 30點護盾 / 免疫減速`, x: casterX, y: cy - 18, color: '#10b981', life: 1.5 });
              floatingTexts.push({ text: `⚠️ 敵方每秒受 -${dps.toFixed(2)} / 速-30% 禁閃躲`, x: targetX, y: cy - 18, color: '#ef4444', life: 1.5 });
            }
          }
        }
      }

      // Draw Target dummy
      ctx.beginPath();
      ctx.arc(targetX, cy, targetRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b'; // slate-800
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 9px font-sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('擊打耙機', targetX, cy + 1);

      // Draw Caster Ball body
      let coreFill = '#0f172a';
      if (char.id === 'vampire') coreFill = '#450a0a';
      else if (char.id === 'mud') coreFill = '#451a03';
      else if (char.id === 'blaze') coreFill = '#7c2d12';
      else if (char.id === 'lightning') coreFill = '#083344';
      else if (char.id === 'dice') coreFill = '#f1f5f9';
      else if (char.id === 'gravity') coreFill = '#1e1b4b';
      else if (char.id === 'conductor') coreFill = '#0b1d3a';

      ctx.save();
      ctx.beginPath();
      ctx.arc(casterX, cy, casterRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreFill;
      ctx.fill();
      ctx.strokeStyle = char.color;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      // Inner vector graphic brandings inside caster to keep high design polish
      ctx.save();
      const vx = casterX;
      const vy = cy - 2.5;

      if (char.id === 'vampire') {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(vx, vy - 6);
        ctx.bezierCurveTo(vx - 2, vy - 9, vx - 8, vy - 9, vx - 11, vy - 4);
        ctx.bezierCurveTo(vx - 7, vy - 1, vx - 4, vy - 1, vx - 2, vy + 1);
        ctx.bezierCurveTo(vx - 3, vy + 3, vx - 1, vy + 5, vx, vy + 7);
        ctx.bezierCurveTo(vx + 1, vy + 5, vx + 3, vy + 3, vx + 2, vy + 1);
        ctx.bezierCurveTo(vx + 4, vy - 1, vx + 7, vy - 1, vx + 11, vy - 4);
        ctx.bezierCurveTo(vx + 8, vy - 9, vx + 2, vy - 9, vx, vy - 6);
        ctx.closePath();
        ctx.fill();
      } 
      else if (char.id === 'mud') {
        ctx.fillStyle = '#d97706';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(vx, vy - 7);
        ctx.lineTo(vx + 6, vy - 3);
        ctx.lineTo(vx + 6, vy + 3);
        ctx.lineTo(vx, vy + 7);
        ctx.lineTo(vx - 6, vy + 3);
        ctx.lineTo(vx - 6, vy - 3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } 
      else if (char.id === 'blaze') {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(vx, vy - 8);
        ctx.quadraticCurveTo(vx + 6, vy - 1, vx + 4, vy + 5);
        ctx.quadraticCurveTo(vx, vy + 8, vx - 4, vy + 5);
        ctx.quadraticCurveTo(vx - 6, vy - 1, vx, vy - 8);
        ctx.fill();
      } 
      else if (char.id === 'lightning') {
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(vx, vy, 4.5, 0, Math.PI * 1.5);
        ctx.stroke();
      } 
      else if (char.id === 'dice') {
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(vx, vy, 2, 0, Math.PI*2);
        ctx.fill();
      }
      else if (char.id === 'gravity') {
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(vx - 5, vy - 4);
        ctx.lineTo(vx, vy);
        ctx.lineTo(vx + 5, vy + 4);
        ctx.stroke();
      }
      else if (char.id === 'conductor') {
        // Draw miniature golden tracks inside caster core
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(vx - 6, vy - 1.5);
        ctx.lineTo(vx + 6, vy - 1.5);
        ctx.moveTo(vx - 6, vy + 1.5);
        ctx.lineTo(vx + 6, vy + 1.5);
        ctx.moveTo(vx - 3, vy - 3);
        ctx.lineTo(vx - 3, vy + 3);
        ctx.moveTo(vx + 3, vy - 3);
        ctx.lineTo(vx + 3, vy + 3);
        ctx.stroke();
      }
      ctx.restore();

      // Process and Draw Sim particles
      simParticles.forEach((p) => {
        p.life -= 0.016;
        p.x += p.vx;
        p.y += p.vy;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, p.radius * (p.life / p.maxLife)), 0, Math.PI * 2);
        ctx.fillStyle = p.color;

        if (p.type === 'fire') {
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#f97316';
        } else if (p.type === 'lightning') {
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#22d3ee';
        } else if (p.type === 'blood') {
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#ef4444';
        }

        ctx.fill();
        ctx.restore();
      });
      simParticles = simParticles.filter((p) => p.life > 0);

      // Render Floating texts
      floatingTexts.forEach((t) => {
        t.life -= 0.016;
        t.y -= 0.55;

        ctx.save();
        ctx.font = 'bold 9.5px font-sans, sans-serif';
        ctx.fillStyle = t.color;
        ctx.globalAlpha = Math.min(1.0, t.life * 2.5) * alpha;
        ctx.textAlign = 'center';
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();
      });
      floatingTexts = floatingTexts.filter((t) => t.life > 0);

      ctx.restore(); // restore globalAlpha/matrix

      // Render visual timeline bar
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(15, height - 18, width - 30, 4);
      
      const barFillProgress = frameCount / 245;
      ctx.fillStyle = char.color;
      ctx.fillRect(15, height - 18, (width - 30) * barFillProgress, 4);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 8.5px font-mono, monospace, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`沙盤狀態: ${phase === 'approach' ? '突擊中' : phase === 'active' ? '奧義激發' : '彈開消退'}`, 15, height - 7);
      ctx.textAlign = 'right';
      ctx.fillText(`${(frameCount / 60).toFixed(1)}s / 4.1s`, width - 15, height - 7);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [char, skillType, skillPower, counterType, hasteCd]);

  return (
    <div className="relative flex flex-col items-stretch bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden h-[250px] shadow-[0_0_25px_rgba(0,0,0,0.6)]">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
      {/* High-tech HUD Overlay */}
      <div className="absolute top-2.5 left-2.5 pointer-events-none flex flex-col gap-1 text-[9px] font-mono font-black">
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2 py-0.5 rounded text-indigo-400 backdrop-blur-sm text-left">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
          <span>動態模擬項：{char.name}</span>
        </div>
        <div className="text-[8px] bg-slate-950/70 border border-transparent px-2 text-slate-400 truncate max-w-[160px] text-left">
          屬性：{char.title}
        </div>
      </div>

      <div className="absolute top-2.5 right-2.5 pointer-events-none flex gap-1.5 text-[8px] font-mono">
        <span className="bg-slate-900/80 px-2 py-0.5 rounded text-emerald-400 border border-emerald-950">
          物理引擎: 正常
        </span>
        <span className="bg-slate-900/80 px-2 py-0.5 rounded text-indigo-400 border border-indigo-950">
          實時相軌
        </span>
      </div>
    </div>
  );
}

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
  const [isSkillShowcaseActive, setIsSkillShowcaseActive] = useState<boolean>(false);

  // Calibration state variables for skill real-time preview Adjusts
  const [selectedSkillType, setSelectedSkillType] = useState<'passive' | 'active' | 'ultimate'>('active');
  const [skillPower, setSkillPower] = useState<number>(1.0);
  const [counterType, setCounterType] = useState<'neutral' | 'counter' | 'countered'>('neutral');
  const [hasteCd, setHasteCd] = useState<number>(15);

  const selectedChar = CHARACTERS[selectedCharIndex];

  // Helper values for characteristics bars
  const statBars = (id: string) => {
    switch(id) {
      case 'vampire':
        return { hp: 70, speed: 65, mass: 45, area: '70% 前向' };
      case 'mud':
        return { hp: 80, speed: 45, mass: 90, area: '75% 範圍' };
      case 'blaze':
        return { hp: 80, speed: 75, mass: 65, area: '90% 燃燒' };
      case 'lightning':
        return { hp: 80, speed: 95, mass: 40, area: '85% 氣旋' };
      case 'gravity':
        return { hp: 85, speed: 80, mass: 125, area: '160% 引力' };
      case 'whip':
        return { hp: 95, speed: 115, mass: 28, area: '120% 靈鞭' };
      case 'conductor':
        return { hp: 100, speed: 60, mass: 105, area: '領域/軌道' };
      case 'dice':
      default:
        return { hp: 80, speed: 70, mass: 55, area: '95% 命運' };
    }
  };

  const currentStats = statBars(selectedChar.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 sm:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 selection:bg-indigo-500/30">
      {/* Container Card - Adaptive design: full screen on mobile, floating elegant modal on desktop */}
      <div className="relative w-full max-w-4xl bg-slate-900/95 sm:rounded-3xl border-0 sm:border border-slate-800 shadow-2xl flex flex-col overflow-hidden h-full sm:h-auto sm:max-h-[90vh] text-slate-100 animate-fadeIn">
        
        {/* Header Section */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
                {inBattle ? '戰局控制 & 奧義圖鑑' : '基礎球體對決：全能圖鑑系統'}
              </h2>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold font-mono">SPHERE LIFE-CYCLE PANEL & CODEX</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 sm:p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons bar - Scrollable ribbon with hidden scrollbar for ergonomics */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 p-2 gap-1.5 select-none overflow-x-auto scrollbar-none flex-nowrap shrink-0">
          {inBattle && (
            <button
              onClick={() => setActiveTab('controls')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 border ${
                activeTab === 'controls' 
                  ? 'bg-rose-600/95 text-white border-rose-500 shadow-lg shadow-rose-600/20' 
                  : 'text-rose-400 border-rose-950/40 bg-rose-950/5 hover:bg-rose-950/15'
              }`}
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
              <span>⚙️ 戰局即時控制</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('characters')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === 'characters' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>角色圖鑑</span>
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === 'items' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>戰場物品</span>
          </button>
          <button
            onClick={() => setActiveTab('modes')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === 'modes' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>遊戲模式</span>
          </button>
          <button
            onClick={() => setActiveTab('attributes')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === 'attributes' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>屬性克制</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0 bg-slate-900/20 pb-16 sm:pb-6">

          {/* TAB 0: REAL-TIME BATTLE SETTINGS */}
          {activeTab === 'controls' && inBattle && (
            <div className="space-y-6 text-left animate-fadeIn">
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 mb-4 shadow-inner">
                <span className="text-[10px] font-black text-rose-400 font-mono tracking-widest uppercase block mb-1">
                  ⚡ 實時對戰物理調頻控制面板
                </span>
                <p className="text-xs text-slate-400">
                  在這裡您可以隨時調整物理對決速度、暫停戰端或重新選擇戰隊英雄。所有的物理彈性碰撞與被動奧義都會實時適應。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Panel Part 1: Play/Pause controls */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4.5 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                      <span>戰場時間流速</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      暫停物理時間或立即恢復。暫停時您可以觀察戰局的微觀狀態。
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      audio.playSelect();
                      if (setIsPlaying) setIsPlaying(!isPlaying);
                    }}
                    className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs border transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-slate-900 border-slate-850 text-slate-300 hover:bg-slate-850 hover:text-white'
                        : 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-slate-300" />
                        <span>暫停戰鬥對峙</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white animate-pulse" />
                        <span>啟動/繼續戰鬥</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Panel Part 2: Speed Multipliers */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4.5 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <FastForward className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span>控制對戰快慢 (流速倍率)</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      調整物理與奧義更新速率，加速戰局可更快適配與結算。
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {([0.5, 1, 2, 4] as const).map((speed) => {
                      const isActive = battleSpeed === speed;
                      return (
                        <button
                          key={speed}
                          onClick={() => {
                            audio.playSelect();
                            if (setBattleSpeed) setBattleSpeed(speed);
                          }}
                          className={`py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer border ${
                            isActive
                              ? 'bg-amber-500 border-amber-400 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                              : 'bg-slate-900 border-slate-850 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                          }`}
                        >
                          {speed === 0.5 ? '0.5x 慢速' : speed === 1 ? '1x 原速' : speed === 2 ? '2x 快進' : '4x 極速'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Panel Part 3: Go Back / Re-select character */}
              <div className="bg-slate-950/50 border border-rose-900/20 hover:border-rose-900/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all mt-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                    <RotateCcw className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black text-rose-300 uppercase tracking-widest mb-0.5">
                      返回重新選擇角色
                    </h4>
                    <p className="text-[11px] text-slate-500 max-w-md leading-relaxed">
                      這將立刻中止當前回合、清空本次對峙的所有累計積分和戰績紀錄，並安全地返回角色大廳挑選新陣容。
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onBackToMenu) onBackToMenu();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-900/40 hover:bg-rose-900 border border-rose-800/80 hover:border-rose-600 text-rose-200 hover:text-white text-xs font-black transition-all cursor-pointer shadow-lg shadow-rose-950/50 flex items-center justify-center gap-1.5 active:scale-95 text-center shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>結束當局 & 重選角色</span>
                </button>
              </div>
            </div>
          )}
          
          {/* TAB 1: CHARACTERS HANDBOOK */}
          {activeTab === 'characters' && (
            <div className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6 items-stretch h-full">
              
              {/* Mobile horizontal character selector ribbon - Highly ergonomic thumb swiping */}
              <div className="flex md:hidden flex-col gap-1 shrink-0 pb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mb-1 block">球體英雄目錄 (向左滑動切換) ({CHARACTERS.length})</span>
                <div className="flex flex-row gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory shrink-0">
                  {CHARACTERS.map((char, index) => {
                    const isCur = index === selectedCharIndex;
                    return (
                      <button
                        key={char.id}
                        onClick={() => {
                          setSelectedCharIndex(index);
                          setIsSkillShowcaseActive(false);
                          try { audio.playSelect(); } catch(err){}
                        }}
                        className={`flex items-center gap-2 p-2 px-3 rounded-xl border text-left transition-all shrink-0 snap-center select-none cursor-pointer ${
                          isCur 
                            ? 'bg-slate-950 border-indigo-500 text-slate-100 shadow-md shadow-indigo-550/10' 
                            : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:bg-slate-850'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center p-0.5 border ${isCur ? 'bg-slate-900 border-indigo-500/30 text-white' : 'bg-slate-950 border-slate-850 text-slate-400'}`}>
                          <CharacterVectorIcon characterId={char.id} className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold leading-none">{char.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar directory list - visible only on desktop */}
              <div className="hidden md:flex md:col-span-4 flex-col gap-2 max-h-[300px] md:max-h-none overflow-y-auto pr-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mb-1 block">球體英雄目錄 ({CHARACTERS.length})</span>
                {CHARACTERS.map((char, index) => {
                  const isCur = index === selectedCharIndex;
                  return (
                    <button
                      key={char.id}
                      onClick={() => {
                        setSelectedCharIndex(index);
                        setIsSkillShowcaseActive(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all group cursor-pointer ${
                        isCur 
                          ? 'bg-slate-950 border-indigo-500 text-slate-100 shadow-md shadow-indigo-500/10' 
                          : 'bg-slate-900/60 border-slate-850 text-slate-300 hover:bg-slate-850 hover:border-slate-800'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-1 border ${isCur ? 'bg-slate-900 border-indigo-500/30 text-white' : 'bg-slate-950 border-slate-850 text-slate-400'}`}>
                        <CharacterVectorIcon characterId={char.id} className="w-8 h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-extrabold truncate">{char.name}</h4>
                          <span className="text-[9px] font-semibold text-slate-500 group-hover:text-slate-400 shrink-0 font-mono transition-colors">
                            {char.id === 'vampire' && '血影'}
                            {char.id === 'mud' && '磐石'}
                            {char.id === 'blaze' && '烈火'}
                            {char.id === 'lightning' && '風雷'}
                            {char.id === 'dice' && '混沌'}
                            {char.id === 'conductor' && '鐵道'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{char.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detail display panel */}
              <div className="md:col-span-8 bg-slate-950/40 border border-slate-850 rounded-2xl md:rounded-3xl p-3.5 sm:p-5 flex flex-col gap-4 sm:gap-5">
                
                {/* Upper Character Title Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3 sm:pb-4">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center p-0.5 sm:p-1 bg-slate-900 border border-slate-800 shadow shadow-indigo-500/10">
                      <CharacterVectorIcon characterId={selectedChar.id} className="w-8 h-8 sm:w-11 sm:h-11" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-100">{selectedChar.name}</h3>
                        <span className="text-[8px] sm:text-[9px] bg-slate-900 border border-slate-800 px-1.5 sm:px-2 py-0.5 rounded-full text-indigo-400 font-black tracking-wide font-mono uppercase">
                          {selectedChar.id}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 font-medium">{selectedChar.title}</p>
                    </div>
                  </div>

                  {/* Animation preview mode indicators */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-950 p-1.5 px-2.5 sm:px-3 rounded-xl border border-slate-800">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-bold">
                      <span className="inline md:hidden">動態物理沙盤就位 (點擊下方卡片更換)</span>
                      <span className="hidden md:inline">技能動態模擬已就緒：點選下方卡片切換並校對數值</span>
                    </span>
                  </div>
                </div>

                {/* Grid showing interactive canvas and specifications */}
                <div className="grid sm:grid-cols-2 gap-4 items-stretch">
                  {/* Canvas Visual Showcase */}
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] font-bold text-slate-400 bg-slate-950/60 p-2 px-3.5 rounded-xl border border-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
                        <span>即時戰術模擬沙盤 (LIVE SANDBOX)</span>
                      </span>
                      <span className="text-indigo-400 text-[9px] uppercase font-mono font-black tracking-wider">
                        {selectedSkillType === 'passive' ? '普攻與被動 ⚙️' : selectedSkillType === 'active' ? '戰術一技能 ⚡' : '無雙二技能 🔮'}
                      </span>
                    </div>

                    <HandbookSkillSimulationCanvas 
                      char={selectedChar} 
                      skillType={selectedSkillType} 
                      skillPower={skillPower} 
                      counterType={counterType} 
                      hasteCd={hasteCd} 
                    />

                    <span className="text-[9px] text-slate-500 text-center italic leading-relaxed font-sans block">
                      模擬真實剛體碰撞、力引信干涉。點擊下方被動奧義/主動技能卡片可實時切換
                    </span>
                  </div>



                  {/* Character stats bar */}
                  <div className="bg-slate-950/90 border border-slate-900 rounded-3xl p-4.5 flex flex-col justify-between font-mono">
                    <div>
                      <span className="text-[9.5px] font-bold text-slate-500 tracking-wider block border-b border-slate-900 pb-1.5 mb-2.5">戰略面板數據 (BASE STATISTICS)</span>
                      
                      {/* Stat Item HP */}
                      <div className="mb-2.5">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>初始生命值 (HP)</span>
                          <span className="text-slate-200 font-bold">{selectedChar.initialHp} HP</span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(selectedChar.initialHp / 100) * 100}%` }} />
                        </div>
                      </div>

                      {/* Stat Item Speed */}
                      <div className="mb-2.5">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>基礎移速 (Velocity)</span>
                          <span className="text-slate-200 font-bold">{currentStats.speed}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-400 rounded-full" style={{ width: `${currentStats.speed}%` }} />
                        </div>
                      </div>

                      {/* Stat Item Mass */}
                      <div className="mb-2.5">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>物理慣性慣量 (Weight)</span>
                          <span className="text-slate-200 font-bold">{currentStats.mass}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${currentStats.mass}%` }} />
                        </div>
                      </div>

                      {/* Stat Item Range */}
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>核心領域範圍</span>
                          <span className="text-slate-200 font-bold">{currentStats.area}</span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: '80%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="text-[9px] text-slate-500 font-sans italic mt-2 text-right">
                      * 初始屬性決定基底，實際傷害可由下方儀器進行動態演練校調
                    </div>
                  </div>
                </div>

                {/* Visual Calibration Control Panel */}
                <div className="bg-slate-950/70 border border-slate-850/60 rounded-3xl p-4.5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-indigo-400 animate-pulse" />
                      <span className="text-xs font-extrabold text-slate-200">實戰數值動態核算與校準儀 (DYNAMICAL MULTIPLIER CONTROLLER)</span>
                    </div>
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-md font-mono font-bold tracking-wider">校準常數活躍</span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 text-xs">
                    {/* Slider 1: Skill Power */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>技能威力 (Power Factor)</span>
                        <span className="text-amber-400 font-bold font-mono">{(skillPower * 100).toFixed(0)}%</span>
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
                        className="w-full accent-indigo-550 accent-indigo-500 bg-slate-900 rounded-lg appearance-none h-1.5 cursor-pointer"
                      />
                      <span className="text-[8.5px] text-slate-500 block leading-tight">調整彈射/爆炸核心基礎傷害與其特效能量粒子的擴散強度</span>
                    </div>

                    {/* Slider 2: Haste CD */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>冷卻急速 (Haste CD)</span>
                        <span className="text-emerald-400 font-bold font-mono">-{hasteCd}%</span>
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
                        className="w-full accent-emerald-550 accent-emerald-500 bg-slate-900 rounded-lg appearance-none h-1.5 cursor-pointer"
                      />
                      <span className="text-[8.5px] text-slate-500 block leading-tight">
                        CD極速壓縮: {((selectedChar.id === 'vampire' ? 14 : selectedChar.id === 'mud' ? 12 : selectedChar.id === 'blaze' ? 13 : selectedChar.id === 'lightning' ? 12 : selectedChar.id === 'conductor' ? 12 : 11) * (1 - hasteCd/100)).toFixed(1)}s (原:{selectedChar.id === 'vampire' ? '14' : selectedChar.id === 'mud' ? '12' : selectedChar.id === 'blaze' ? '13' : selectedChar.id === 'lightning' ? '12' : selectedChar.id === 'conductor' ? '12' : '11'}s)
                      </span>
                    </div>

                    {/* Selector 3: Combat Counters Toggles */}
                    <div className="space-y-1.5 text-left">
                      <span className="text-[11px] text-slate-400 block">屬性克制關係 (Elements Balance)</span>
                      <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button
                          onClick={() => {
                            setCounterType('counter');
                            try { audio.playSelect(); } catch(err){}
                          }}
                          className={`py-1 text-[9.5px] font-bold rounded transition-all cursor-pointer ${counterType === 'counter' ? 'bg-emerald-600/25 border border-emerald-500/50 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          克制
                        </button>
                        <button
                          onClick={() => {
                            setCounterType('neutral');
                            try { audio.playSelect(); } catch(err){}
                          }}
                          className={`py-1 text-[9.5px] font-bold rounded transition-all cursor-pointer ${counterType === 'neutral' ? 'bg-slate-850 border border-slate-750 text-slate-300' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          常態
                        </button>
                        <button
                          onClick={() => {
                            setCounterType('countered');
                            try { audio.playSelect(); } catch(err){}
                          }}
                          className={`py-1 text-[9.5px] font-bold rounded transition-all cursor-pointer ${counterType === 'countered' ? 'bg-rose-950/25 border border-rose-500/30 text-rose-400' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          被克
                        </button>
                      </div>
                      <span className="text-[8.5px] text-slate-500 block leading-tight">
                        當前係數: <strong className="text-slate-400 font-mono">{counterType === 'counter' ? '1.30x (克制增傷)' : counterType === 'countered' ? '0.80x (減損受壓)' : '1.00x'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Formula description / live calculator details block */}
                  <div className="bg-slate-900/50 border border-slate-900 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 font-mono gap-2">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-indigo-400" />
                      <span>沙盤實施傷害演練式：</span>
                    </span>
                    <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap">
                      <span className="text-indigo-400 font-black">
                        {selectedSkillType === 'passive' ? '普攻與被動' : selectedSkillType === 'active' ? '戰術一技能' : '二技能/大招'}
                      </span>
                      <span>=</span>
                      <span className="text-slate-400 font-bold">
                        {selectedSkillType === 'passive' 
                          ? (selectedChar.id === 'vampire' ? '1.80' : selectedChar.id === 'mud' ? '2.00' : selectedChar.id === 'blaze' ? '1.50' : selectedChar.id === 'lightning' ? '1.20' : selectedChar.id === 'dice' ? '2.40' : selectedChar.id === 'gravity' ? '1.00' : selectedChar.id === 'phantom' ? '1.70' : selectedChar.id === 'cat' ? '0.00' : selectedChar.id === 'snake' ? '0.20' : selectedChar.id === 'grid9' ? '4.80' : selectedChar.id === 'water_dragon' ? '1.66' : selectedChar.id === 'whip' ? '1.00' : selectedChar.id === 'conductor' ? '0.50' : '0.50')
                          : selectedSkillType === 'active'
                            ? (selectedChar.id === 'vampire' ? '5.52' : selectedChar.id === 'mud' ? '2.05' : selectedChar.id === 'blaze' ? '3.00' : selectedChar.id === 'lightning' ? '2.80' : selectedChar.id === 'dice' ? '2.40' : selectedChar.id === 'gravity' ? '2.76' : selectedChar.id === 'phantom' ? '1.84' : selectedChar.id === 'cat' ? '2.10' : selectedChar.id === 'snake' ? '1.80' : selectedChar.id === 'grid9' ? '9.60' : selectedChar.id === 'water_dragon' ? '3.31' : selectedChar.id === 'whip' ? '2.30' : selectedChar.id === 'conductor' ? '8.00' : '2.00')
                            : (selectedChar.id === 'vampire' ? '3.50' : selectedChar.id === 'mud' ? '4.00' : selectedChar.id === 'blaze' ? '4.50' : selectedChar.id === 'lightning' ? '3.50' : selectedChar.id === 'dice' ? '3.00' : selectedChar.id === 'gravity' ? '2.50' : selectedChar.id === 'phantom' ? '3.60' : selectedChar.id === 'cat' ? '2.50' : selectedChar.id === 'snake' ? '3.60' : selectedChar.id === 'grid9' ? '4.50' : selectedChar.id === 'water_dragon' ? '3.50' : selectedChar.id === 'whip' ? '2.80' : selectedChar.id === 'conductor' ? '5.00' : '4.20')
                        }
                      </span>
                      <span>×</span>
                      <span className="text-amber-400 font-bold">{skillPower.toFixed(1)} (威力)</span>
                      <span>×</span>
                      <span className="text-emerald-400 font-bold">
                        {counterType === 'counter' ? '1.30' : counterType === 'countered' ? '0.80' : '1.00'} (屬性)
                      </span>
                      <span>➔</span>
                      <span className="text-rose-400 font-black text-xs">
                        -{((
                          selectedSkillType === 'passive'
                            ? (selectedChar.id === 'vampire' ? 1.80 : selectedChar.id === 'mud' ? 2.00 : selectedChar.id === 'blaze' ? 1.50 : selectedChar.id === 'lightning' ? 1.20 : selectedChar.id === 'dice' ? 2.40 : selectedChar.id === 'gravity' ? 1.00 : selectedChar.id === 'phantom' ? 1.70 : selectedChar.id === 'cat' ? 0.00 : selectedChar.id === 'snake' ? 0.20 : selectedChar.id === 'grid9' ? 4.80 : selectedChar.id === 'water_dragon' ? 1.66 : selectedChar.id === 'whip' ? 1.00 : 0.50)
                            : selectedSkillType === 'active'
                              ? (selectedChar.id === 'vampire' ? 5.52 : selectedChar.id === 'mud' ? 2.05 : selectedChar.id === 'blaze' ? 3.00 : selectedChar.id === 'lightning' ? 2.80 : selectedChar.id === 'dice' ? 2.40 : selectedChar.id === 'gravity' ? 2.76 : selectedChar.id === 'phantom' ? 1.84 : selectedChar.id === 'cat' ? 2.10 : selectedChar.id === 'snake' ? 1.80 : selectedChar.id === 'grid9' ? 9.60 : selectedChar.id === 'water_dragon' ? 3.31 : selectedChar.id === 'whip' ? 2.30 : 2.00)
                              : (selectedChar.id === 'vampire' ? 3.50 : selectedChar.id === 'mud' ? 4.00 : selectedChar.id === 'blaze' ? 4.50 : selectedChar.id === 'lightning' ? 3.50 : selectedChar.id === 'dice' ? 3.00 : selectedChar.id === 'gravity' ? 2.50 : selectedChar.id === 'phantom' ? 3.60 : selectedChar.id === 'cat' ? 2.50 : selectedChar.id === 'snake' ? 3.60 : selectedChar.id === 'grid9' ? 4.50 : selectedChar.id === 'water_dragon' ? 3.50 : selectedChar.id === 'whip' ? 2.80 : 4.20)
                        ) * skillPower * (counterType === 'counter' ? 1.3 : counterType === 'countered' ? 0.8 : 1.0)).toFixed(2)} HP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Passive, Sub-skill, and Ultimate 2 Skill text definitions (一技能, 二技能, 普攻) */}
                <div className="space-y-4 pt-1 text-left">
                  {/* Skill 1: Basic Attack & Passive (普攻與被動) */}
                  <button
                    onClick={() => {
                      setSelectedSkillType('passive');
                      try { audio.playSelect(); } catch(err){}
                    }}
                    className={`w-full text-left p-4.5 rounded-2xl border transition-all relative block cursor-pointer select-none group outline-none ${
                      selectedSkillType === 'passive' 
                        ? 'bg-indigo-950/25 border-indigo-550 border-indigo-500 shadow-lg shadow-indigo-550/10' 
                        : 'bg-slate-905 bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-slate-900/40 pb-1">
                      <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-widest uppercase block">⚔️ 基礎普攻與碰撞被動：{selectedChar.skillName}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-slate-950/85 border border-indigo-500/10 text-indigo-400 font-mono px-2 py-0.5 rounded">
                          無CD
                        </span>
                        {selectedSkillType === 'passive' && (
                          <span className="text-[9px] bg-indigo-505 bg-indigo-500 text-white px-2.5 py-0.5 rounded-md font-black font-mono animate-pulse uppercase tracking-wide">
                            PREVIEWING
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedChar.detailedDesc}</p>
                    <span className="text-[9px] text-slate-500 font-semibold block mt-1.5">
                      💡 物理激發機制：基礎普攻。剛體受重力或切位移動撞擊敵方時自動觸發本門奧義。點擊本卡片即在沙盤中激活動態展示。
                    </span>
                  </button>

                  {/* Skill 2: Active Tactical Skill 1 (戰術一技能) */}
                  <button
                    onClick={() => {
                      setSelectedSkillType('active');
                      try { audio.playSelect(); } catch(err){}
                    }}
                    className={`w-full text-left p-4.5 rounded-2xl border transition-all relative block cursor-pointer select-none group outline-none ${
                      selectedSkillType === 'active' 
                        ? 'bg-amber-950/25 border-amber-550 border-amber-500 shadow-lg shadow-amber-550/10' 
                        : 'bg-slate-905 bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-slate-900/40 pb-1">
                      <span className="text-[10px] font-bold text-amber-400 font-mono tracking-widest uppercase block">⚡ 戰術特殊技能 (一技能)：{selectedChar.subSkillName || '特殊戰術技能'}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-amber-500/10 border border-amber-550/20 text-amber-400 font-mono px-2 py-0.5 rounded">
                          CD：{selectedChar.id === 'vampire' ? '14s' : selectedChar.id === 'mud' ? '12s' : selectedChar.id === 'blaze' ? '13s' : selectedChar.id === 'lightning' ? '12s' : selectedChar.id === 'conductor' ? '12s' : '11s'}
                        </span>
                        {selectedSkillType === 'active' && (
                          <span className="text-[9px] bg-amber-505 bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-md font-black font-mono animate-pulse uppercase tracking-wide">
                            PREVIEWING
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedChar.subSkillDesc}</p>
                    <span className="text-[9px] text-slate-500 font-semibold block mt-1.5">
                      💡 戰術操作機制：怒氣積攢高熱發射。拖曳發射特定屬性粒子爆裂，具備極強剛體反推。點擊本卡片調用沙盤模擬。
                    </span>
                  </button>

                  {/* Skill 3: Ultimate Skill 2 (奧義二技能/大招) */}
                  <button
                    onClick={() => {
                      setSelectedSkillType('ultimate');
                      try { audio.playSelect(); } catch(err){}
                    }}
                    className={`w-full text-left p-4.5 rounded-2xl border transition-all relative block cursor-pointer select-none group outline-none ${
                      selectedSkillType === 'ultimate' 
                        ? 'bg-purple-950/25 border-purple-550 border-purple-500 shadow-lg shadow-purple-550/10' 
                        : 'bg-slate-905 bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-slate-900/40 pb-1">
                      <span className="text-[10px] font-bold text-purple-400 font-mono tracking-widest uppercase block">🔮 終極技能 (二技能/奧義)：{selectedChar.skill2Name || '終極守護神技'}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-purple-500/10 border border-purple-550/20 text-purple-400 font-mono px-2 py-0.5 rounded">
                          CD：{selectedChar.id === 'vampire' ? '18s' : selectedChar.id === 'mud' ? '16s' : selectedChar.id === 'blaze' ? '17s' : selectedChar.id === 'lightning' ? '15s' : selectedChar.id === 'conductor' ? '25s' : '16s'}
                        </span>
                        {selectedSkillType === 'ultimate' && (
                          <span className="text-[9px] bg-purple-505 bg-purple-500 text-white px-2.5 py-0.5 rounded-md font-black font-mono animate-pulse uppercase tracking-wide">
                            PREVIEWING
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedChar.skill2DetailedDesc || selectedChar.skill2Desc || '高維太虛能爆：呼喚廣域元素磁暴，進行致命大半徑洗禮。'}</p>
                    <span className="text-[9px] text-slate-500 font-semibold block mt-1.5">
                      💡 奧義解碼機制：當遭遇群毆、生命值危怠時，手動解鎖釋放。對全屏產生維度常數壓制。點擊本卡片在沙盤中即時展示。
                    </span>
                  </button>

                  {/* Character Background Story */}
                  {selectedChar.story && (
                    <div className="p-4 bg-slate-950/80 border border-purple-500/15 rounded-2xl relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-indigo-500 before:to-purple-500">
                      <span className="text-[10px] font-bold text-purple-400 block mb-2">📜 英雄紀元與維度觀測報告</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line bg-slate-900/30 p-3 rounded-lg border border-slate-800/50">
                        {selectedChar.story}
                      </p>
                    </div>
                  )}

                  {/* Character Vocal Quotes */}
                  {selectedChar.quotes && (
                    <div className="p-4 bg-slate-950/80 border border-emerald-500/15 rounded-2xl relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-emerald-500 before:to-teal-500">
                      <span className="text-[10px] font-bold text-emerald-400 block mb-2.5">💬 專屬作戰語音台詞</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50">
                          <span className="text-[9px] font-bold text-slate-500 block mb-1">▶ 登場召喚</span>
                          <p className="text-xs text-emerald-400/90 font-medium italic">"{selectedChar.quotes.select}"</p>
                        </div>
                        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50">
                          <span className="text-[9px] font-bold text-slate-500 block mb-1">▶ 技能扣動</span>
                          <p className="text-xs text-amber-400/95 font-medium italic">"{selectedChar.quotes.subSkill}"</p>
                        </div>
                        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50">
                          <span className="text-[9px] font-bold text-slate-500 block mb-1">▶ 遭遇敗亡</span>
                          <p className="text-xs text-red-400/90 font-medium italic">"{selectedChar.quotes.defeat}"</p>
                        </div>
                        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50">
                          <span className="text-[9px] font-bold text-slate-500 block mb-1">▶ 凱旋獲勝</span>
                          <p className="text-xs text-indigo-400/90 font-medium italic">"{selectedChar.quotes.win || '承讓，這只是宇宙維度常數的微幅干涉結果。'}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BATTLEFIELD ITEMS */}
          {activeTab === 'items' && (
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              
              {/* Item 1: Resonant Crystal */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-3xl p-5 flex flex-col gap-3 min-h-[160px] relative hover:border-indigo-500/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-inner">
                    <Gem className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-200">戰場共振晶核 (Resonant Crystal)</h4>
                    <p className="text-[9px] text-slate-500 font-mono uppercase font-bold mt-0.5">Arena Resource Orb</p>
                  </div>
                </div>
                <div className="space-y-1.5 mt-1">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>外觀樣式：</strong>炫彩紫色的多面立體結晶。自帶由內而外緩慢擴張的紫色共鳴磁感光波及能量旋紋。
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>觸發效果：</strong>球體碰撞吞噬時，瞬間回補 <strong>25 點 HP</strong>（可突破生命上限），並對吞噬者施加 20% 反彈速度超載增益（可疊加，大幅度提高碰撞爆發破壞力）。
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>場內生成規則：</strong>戰局開啟後固定在第 4.0 秒於場中央或隨機空地生出第 1 顆，隨後每隔 4.0 秒循環重置生成，指引雙方戰略爭奪點。
                  </p>
                </div>
              </div>

              {/* Item 2: Mud Trap */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-3xl p-5 flex flex-col gap-3 min-h-[160px] relative hover:border-amber-500/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-900/10 border border-amber-900/30 flex items-center justify-center shadow-inner">
                    <Layers className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-200">黏濁泥濘沼澤 (Mud Puddle)</h4>
                    <p className="text-[9px] text-slate-500 font-mono uppercase font-bold mt-0.5">Terrain Hazard Puddle</p>
                  </div>
                </div>
                <div className="space-y-1.5 mt-1">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>外觀樣式：</strong>地表突顯的深褐色泥沼。具有黏滯的泥點波浪擴散與厚重暗沙特效。
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>觸發效果：</strong>當任何敵方球體踏入該泥沼圓形板塊時，被施加 <strong>極度緩速 (Muddy Slow)</strong>，且移動速度降至原有速度的 <strong>4% 基礎值</strong> （降速 96% 幾乎完全凍結移動），在混亂拉扯中極難逃脫隨之而來的重創！
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>場內生成規則：</strong>由「泥土 (Mud)」球體施放。常態下存在 0.2 秒即刻蒸發；高熱小技能 [泥沼纏足] 生成的加長版特厚泥潭，存在時長擴增至 <strong>1.2 秒</strong>。
                  </p>
                </div>
              </div>

              {/* Item 3: Flame shield */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-3xl p-5 flex flex-col gap-3 min-h-[160px] relative hover:border-orange-500/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shadow-inner">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-200">熾熱高壓火焰盾 (scorching fire Barrier)</h4>
                    <p className="text-[9px] text-slate-500 font-mono uppercase font-bold mt-0.5">Active Burn Aura Zone</p>
                  </div>
                </div>
                <div className="space-y-1.5 mt-1">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>外觀樣式：</strong>圍繞球體的高速盤旋烈火環。火光翻滾、具有高密度的紅黃色岩漿粒子往外噴湧。
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>觸發效果：</strong>對身處火焰環內的敵方球體造成高頻灼燒傷害，每 0.25 秒持續性扣減 HP。當處於 [瞬間爆燃] 狀態，火環半徑爆發膨脹至 <strong>2.2 倍</strong> 並打出超烈爆炎真傷，特效密度極速飆升。
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>場內生成規則：</strong>由「烈焰 (Blaze)」球體被動觸發或碰撞後召喚。常態維持 1.2 秒烈火，超頻燃燒模式下維持 0.4 秒。
                  </p>
                </div>
              </div>

              {/* Item 4: Cyclone Barrier */}
              <div className="bg-slate-950/45 border border-slate-850 rounded-3xl p-5 flex flex-col gap-3 min-h-[160px] relative hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-inner">
                    <Wind className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-200">狂暴氣旋障壁 (Cyclone Forcefield)</h4>
                    <p className="text-[9px] text-slate-500 font-mono uppercase font-bold mt-0.5">Atmospheric Cyclone Field</p>
                  </div>
                </div>
                <div className="space-y-1.5 mt-1">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>外觀樣式：</strong>淺青色高速狂飆同心旋轉風圈障壁。伴隨流動的白色氣流紋理、強電阻閃雷粒子。
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>觸發效果：</strong>敵方觸及陷入時受亂流風阻重度干涉（造成風屬性切割傷），在小技能 [強力亂流] 爆發激活時，障壁會額外注入 <strong>3.2 倍強烈排斥作用力</strong>，高速將敵方球體狂暴反彈震開，具有全角色最強橫的擊退戰術。
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>場內生成規則：</strong>由「風暴 (Lightning)」球體碰撞後在體表膨脹產出。持续時長固定 0.5 秒。
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: GAME MODES */}
          {activeTab === 'modes' && (
            <div className="space-y-5 text-left">
              
              {/* Standard physics mode card */}
              <div className="bg-slate-950/45 border border-slate-850 rounded-3xl p-5 space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-100 flex items-center gap-2">
                      標準對戰模式 (Standard Mode)
                      <span className="text-[9px] bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full font-mono uppercase">ACTIVE</span>
                    </h4>
                    <p className="text-[9px] text-slate-500 font-mono font-bold uppercase mt-0.5">Pure Mechanics Competitive</p>
                  </div>
                </div>
                <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    <strong>基本架構：</strong>標準 1對1 熱力學碰撞對決。兩款球體在 600×400 高端發光矩形物理邊界內自由撞擊，生命值降低至 0 點者當即落敗。
                  </p>
                  <p>
                    <strong>核心物理邏輯：</strong>使用剛體完全彈性非阻尼碰撞模型，碰撞後保留完美的能量與動量守恆。物理大小、半徑、速度完全按照角色的基礎固化引數運行。
                  </p>
                  <p>
                    <strong>特殊變動：</strong>標準戰鬥無任何随機環境天氣干擾。雙方的技能冷卻、碰撞傷害、小技能爆發全部維持底線平衡數值。
                  </p>
                </div>
              </div>

              {/* Custom Mutator mode card */}
              <div className="bg-slate-950/45 border border-indigo-500/25 rounded-3xl p-5 space-y-3.5 shadow-lg shadow-indigo-550/5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                    <Sliders className="w-5 h-5 text-indigo-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-100 flex items-center gap-2">
                      自定義局模式 (Custom Mutator Mode)
                      <span className="text-[9px] bg-indigo-600 border border-indigo-500 text-slate-100 px-2 py-0.5 rounded-full font-sans font-bold">MUTATOR ENABLED</span>
                    </h4>
                    <p className="text-[9px] text-slate-500 font-mono font-bold uppercase mt-0.5">Dynamic physics & weather variations</p>
                  </div>
                </div>
                <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                  
                  {/* Bullet 1 */}
                  <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <span className="text-[10px] font-bold text-indigo-400 block mb-1">📐 血量體積動態自動縮放體系</span>
                    <p className="text-[11px] text-slate-300">
                      解鎖該模式後，球體半徑將具備 <strong>「HP 逆向縮放特性」</strong>。當球體 HP 減損受傷時，其球體半徑與體積會等比例微幅變小（最多可縮水 35%）。
                      體量變小使角色在反彈遊走中其受擊面積顯著減小，獲得靈敏走位、躲避火線的高難度反打機制！
                    </p>
                  </div>

                  {/* Bullet 2 */}
                  <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <span className="text-[10px] font-bold text-emerald-400 block mb-1">🌍 戰場天氣變換體系</span>
                    <p className="text-[11px] text-slate-300">
                      戰局開啟後，<strong>每隔 15 秒</strong> 會在中央隨機輪值挑選全新天氣，對戰場施加強烈特效：
                    </p>
                    <ul className="list-disc pl-5 mt-1.5 space-y-1 text-[10.5px] text-slate-400">
                      <li><strong>暴擊狂瀾：</strong>全場瘋狂震顫，每次常規碰撞皆有 50% 核心機率蛻變為「雙重暴擊」，雙方各吃 -4.5 點重力反震真傷，打擊感爆棚！</li>
                      <li><strong>超量彈跳：</strong>反彈最大速度極限超頻。每次球體撞擊四周牆體，將外加額外 1% 連環移速增長上限，球速瘋狂疊加！</li>
                      <li><strong>極地泥潭：</strong>賽場正中央被極地冰泥沼地填滿。球體滑入中央會立刻面臨三倍巨大物理阻尼，降速重度拖泥帶水。</li>
                      <li><strong>痊癒極光：</strong>賽場被神聖綠色極光覆蓋。球體每隔 1.0s 特效自動緩存充能，每秒精準溫和恢復 0.5 點 HP，重新拉長雙方戰力續航線。</li>
                    </ul>
                  </div>

                  {/* Bullet 3 */}
                  <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <span className="text-[10px] font-bold text-amber-500 block mb-1">🚀 彈牆速度限制檔位</span>
                    <p className="text-[11px] text-slate-300">
                      可以隨時滑動或點按限制反彈移速硬上限。
                      設有 <strong>9.50% 標準安全檔位</strong> (利於思考預判反彈) 與 <strong>20.50% 超極限超載檔位</strong> (反彈頻繁快如流光暴雷、考驗極限反射神經)。
                    </p>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 4: ATTRIBUTE COUNTERING */}
          {activeTab === 'attributes' && (
            <div className="space-y-6 text-left">
              
              {/* pentagram custom panel */}
              <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center">
                
                {/* Visual relationship web diagram */}
                <div className="flex-shrink-0 w-full md:w-[320px] bg-slate-900/80 border border-slate-850 p-5 rounded-3xl flex flex-col items-center gap-4 relative overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full scale-75" />
                  <span className="text-[10px] font-black text-indigo-400 font-mono tracking-widest block mb-2 uppercase">屬性克制五星環 (PENTAGRAM ALIGNMENT)</span>
                  
                  {/* Simplified diagram visual map representation */}
                  <div className="space-y-2.5 w-full text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-900/60 text-slate-200">
                      <span className="font-extrabold text-amber-500">🟫 磐石 (泥土)</span>
                      <span className="text-[10px] text-slate-500">克制 ⚔️</span>
                      <span className="font-extrabold text-cyan-400">🌀 風雷 (風暴)</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-900/60 text-slate-200">
                      <span className="font-extrabold text-cyan-400">🌀 風雷 (風暴)</span>
                      <span className="text-[10px] text-slate-500">克制 ⚔️</span>
                      <span className="font-extrabold text-orange-400">🔥 烈火 (烈焰)</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-900/60 text-slate-200">
                      <span className="font-extrabold text-orange-400">🔥 烈火 (烈焰)</span>
                      <span className="text-[10px] text-slate-500">克制 ⚔️</span>
                      <span className="font-extrabold text-red-400">🩸 血影 (吸血鬼)</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-900/60 text-slate-200">
                      <span className="font-extrabold text-red-400">🩸 血影 (吸血鬼)</span>
                      <span className="text-[10px] text-slate-500">克制 ⚔️</span>
                      <span className="font-extrabold text-slate-400">🎲 混沌 (骰子)</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-900/60 text-slate-200">
                      <span className="font-extrabold text-slate-400">🎲 混沌 (骰子)</span>
                      <span className="text-[10px] text-slate-500">克制 ⚔️</span>
                      <span className="font-extrabold text-amber-500">🟫 磐石 (泥土)</span>
                    </div>
                  </div>

                  <span className="text-[9px] text-slate-500 text-center italic mt-2">
                    完美閉環克制鏈：所有屬性互相制肘，無絕對無敵角色。
                  </span>
                </div>

                {/* Explanations specs */}
                <div className="flex-grow space-y-4 font-sans text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400 mt-0.5 shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-100 mb-1">屬性相克數值干涉規則</h4>
                      <p className="leading-relaxed text-slate-400 text-[11px]">
                        克制關係在碰撞與核心被動奧義結算時發揮作用，用以增加戰略對弈查閱價值。
                        當屬性克制成功時，進攻方傷害總額增益倍率高達 <strong>1.30 倍</strong>；
                        同時受克制防守方對進攻方造成的反震傷害降低至僅 <strong>0.80 倍</strong> 阻抗。
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/60 my-3" />

                  {/* Description of lore relationships */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider block font-mono">🌟 克制內在世界觀考據 (LORE)</span>
                    
                    <div className="grid sm:grid-cols-2 gap-3.5 text-[11px] leading-relaxed">
                      
                      <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-2xl">
                        <span className="font-bold text-amber-500 block mb-0.5">磐石 克 風雷</span>
                        <p className="text-slate-400">大地能完全導走一切高壓電流與閃雷，且密實黃沙磐石重擊極易撕碎阻絕流體狂風氣旋。</p>
                      </div>

                      <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-2xl">
                        <span className="font-bold text-cyan-400 block mb-0.5">風雷 克 烈火</span>
                        <p className="text-slate-400">高空強烈氣流與龍捲風暴能無情吹滅一切凡間烈火、強行抽乾氧源，閃雷暴雨更能消解高熱。</p>
                      </div>

                      <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-2xl">
                        <span className="font-bold text-orange-400 block mb-0.5">烈火 克 血影</span>
                        <p className="text-slate-400">邪魅污血蝙蝠懼怕高溫，燃燒烈焰具有無上的高熱與焚化力，能蒸發洗禮猩紅領域的吸血魔氣。</p>
                      </div>

                      <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-2xl">
                        <span className="font-bold text-red-400 block mb-0.5">血影 克 混沌</span>
                        <p className="text-slate-400">混沌骰運充滿虛幻不定，但其生命能被猩紅領主直接用獠牙完全牢制並吞噬攫取，無法發揮機率。</p>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
              
              <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-[10px] text-indigo-400/85 text-center font-mono">
                💡 註：在相同屬性的同類對手鏡像對決中，不觸發任何增傷克制；維持 1.00 倍公平數值。
              </div>

            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/80 text-[10.5px] text-slate-500">
          <span>球體圖鑑版本: v1.1.2026-06 (最新同步)</span>
          <span>提供高畫質 Canvas 現場物理還原效果 & 屬性評估</span>
        </div>

      </div>
    </div>
  );
}
