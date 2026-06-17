import React, { useRef, useState } from 'react';
import { Character } from '../types';
import { Sparkles, Activity, Shield, Flame, Trash2, ShieldAlert } from 'lucide-react';
import { CharacterVectorIcon } from './CharacterVectorIcon';

interface CharacterCardProps {
  character: Character;
  isActive: boolean;
  onSelect: () => void;
  roleLabel: string; // e.g., "Player 1 (藍方)"
  borderColor: string;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isActive,
  onSelect,
  roleLabel,
  borderColor,
}) => {
  // Let's analyze details
  return (
    <div
      onClick={onSelect}
      id={`char-card-${character.id}`}
      className={`relative w-full overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
        isActive
          ? `bg-slate-900/95 ${borderColor} shadow-lg scale-[1.02]`
          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 scale-[0.98]'
      }`}
    >
      {/* Decorative colored glow on top */}
      <div 
        className="absolute top-0 left-0 right-0 h-1.5 opacity-80"
        style={{ backgroundColor: character.color }}
      />

      <div className="p-5 flex flex-col justify-between h-full min-h-[360px]">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-800/80 text-yellow-500 border border-slate-700">
              {roleLabel}
            </span>
            <span className="text-sm font-mono text-slate-500 font-bold">
              HP: {character.initialHp}
            </span>
          </div>

          <div className="flex items-center gap-3.5 mb-4">
            <div 
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800/80 border text-center border-slate-700/60 p-1"
              style={{ boxShadow: isActive ? `0 0 15px ${character.color}33` : 'none' }}
            >
              <CharacterVectorIcon characterId={character.id} className="w-11 h-11" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                {character.name}
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                {character.title}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-400 leading-relaxed min-h-[48px] mb-4">
            {character.skillDesc}
          </p>

          <hr className="border-slate-800 mb-4" />

          {/* Skill detail info */}
          <div className="bg-slate-950/75 rounded-xl p-3 border border-slate-800/60 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: character.color }}>
              <Sparkles className="w-3.5 h-3.5 font-bold" />
              <span>被動技能：{character.skillName}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal mb-1.5">
              {character.detailedDesc}
            </p>
          </div>

          {character.subSkillName && (
            <div className="bg-slate-950/75 rounded-xl p-3 border border-red-500/10 mb-2 bg-gradient-to-br from-slate-950 via-slate-950 to-red-950/15">
              <div className="flex items-center gap-1.5 text-xs font-bold mb-1.5 text-emerald-400">
                <Flame className="w-3.5 h-3.5 font-bold" />
                <span>小技能：{character.subSkillName}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                {character.subSkillDesc}
              </p>
            </div>
          )}
        </div>

        {/* Status Metrics */}
        <div>
          <div className="grid grid-cols-2 gap-2 text-[11px] mt-4 font-mono">
            <div className="flex items-center gap-1.5 text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-800/30">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>速度: {(character.speed * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-800/30">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>重量: {(character.mass * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Active indicator */}
          <div className="mt-4 flex justify-end">
            {isActive ? (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                已就緒 (Ready)
              </span>
            ) : (
              <span className="text-[11px] text-slate-600">點擊選擇</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
