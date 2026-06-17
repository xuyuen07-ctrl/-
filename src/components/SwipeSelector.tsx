import React, { useRef, useState, TouchEvent } from 'react';
import { Character } from '../types';
import { CharacterCard } from './CharacterCard';
import { ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';
import { audio } from '../utils/audio';
import { SkillPreviewModal } from './SkillPreviewModal';

interface SwipeSelectorProps {
  characters: Character[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  roleLabel: string;
  borderColor: string;
}

export const SwipeSelector: React.FC<SwipeSelectorProps> = ({
  characters,
  selectedIndex,
  onSelect,
  roleLabel,
  borderColor,
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Minimum swipe distance to trigger change
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const handlePrev = () => {
    audio.playSelect();
    const nextIndex = selectedIndex === 0 ? characters.length - 1 : selectedIndex - 1;
    onSelect(nextIndex);
  };

  const handleNext = () => {
    audio.playSelect();
    const nextIndex = selectedIndex === characters.length - 1 ? 0 : selectedIndex + 1;
    onSelect(nextIndex);
  };

  const activeChar = characters[selectedIndex];

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      {/* Mobile Swipe Instructions banner */}
      <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium mb-2.5 font-mono">
        <Eye className="w-3 h-3 animate-pulse" />
        <span>手機可左右滑動卡片切換角色</span>
      </span>

      {/* Main Container with arrows */}
      <div className="relative w-full flex items-center justify-between gap-1">
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          id={`${roleLabel.replace(/\s+/g, '-').toLowerCase()}-prev-btn`}
          className="absolute left-[-24px] z-20 flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700 pointer-events-auto transition-transform hover:scale-110 active:scale-95"
          aria-label="Previous Character"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Card Arena Box with Swipe Listeners */}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="w-full relative select-none"
        >
          <CharacterCard
            character={activeChar}
            isActive={true}
            onSelect={() => {}}
            roleLabel={roleLabel}
            borderColor={borderColor}
          />
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          id={`${roleLabel.replace(/\s+/g, '-').toLowerCase()}-next-btn`}
          className="absolute right-[-24px] z-20 flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700 pointer-events-auto transition-transform hover:scale-110 active:scale-95"
          aria-label="Next Character"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Playable dynamic preview trigger button */}
      <button
        onClick={() => {
          audio.playSelect();
          setIsPreviewOpen(true);
        }}
        id={`preview-trigger-btn-${activeChar.id}`}
        className="mt-3.5 flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-950/40 via-slate-900/90 to-slate-950/40 hover:from-slate-900/60 hover:to-slate-900/60 border border-slate-800 hover:border-indigo-500/20 text-xs font-black text-indigo-400 hover:text-indigo-300 rounded-2xl transition-all shadow-md select-none w-full active:scale-95 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] group"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:animate-pulse transition-transform group-hover:scale-110" />
        <span>觀看「{activeChar.name}」技能動態演示與參數</span>
      </button>

      {/* Indicator Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {characters.map((char, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={char.id}
              onClick={() => {
                audio.playSelect();
                onSelect(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                isSelected 
                  ? 'w-6 bg-yellow-400' 
                  : 'w-2 bg-slate-800 hover:bg-slate-700'
              }`}
              style={{
                backgroundColor: isSelected ? char.color : undefined
              }}
              aria-label={`Select character ${char.name}`}
            />
          );
        })}
      </div>

      {/* Render the skill dynamic preview modal */}
      <SkillPreviewModal
        character={activeChar}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};
