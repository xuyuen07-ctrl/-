import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { CHARACTERS } from './characters';
import { Character, GameStatus } from './types';
import { CharacterSelectionScreen } from './components/CharacterSelectionScreen';
import { BattleArena, BattleStats } from './components/BattleArena';
import { Handbook } from './components/Handbook';
import { CharacterVectorIcon } from './components/CharacterVectorIcon';
import { ChampionCoronation } from './components/ChampionCoronation';
import { audio } from './utils/audio';
import { 
  Swords, 
  Trophy, 
  Clock, 
  Zap, 
  Heart, 
  Github, 
  Sparkles, 
  Timer, 
  TrendingUp, 
  RotateCcw,
  RefreshCw,
  BookOpen,
  Shield,
  Settings,
  Sliders,
  CloudSun,
  Activity,
  Minimize2,
  Wind,
  Users
} from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState<GameStatus>('SELECTING');
  // Indices selected for character sheets
  const [p1Index, setP1Index] = useState<number>(0); // Default to Vampire (index 0)
  const [p2Index, setP2Index] = useState<number>(1); // Default to Mud (index 1)
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [isPortalEnabled, setIsPortalEnabled] = useState<boolean>(false);
  const [isTournamentActive, setIsTournamentActive] = useState<boolean>(false);
  const [tournamentParticipants, setTournamentParticipants] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7]);
  const [tournament, setTournament] = useState<{
    isActive: boolean;
    participants: number[];
    round: 'quarters' | 'semis' | 'finals' | 'complete' | null;
    matchIndex: number;
    quartersMatches: number[][];
    semisMatches: number[][];
    finalsMatch: number[];
    winnersQuarters: number[];
    winnersSemis: number[];
    champion: number | null;
    currentSeriesWins: { p1: number; p2: number };
    quartersScores: { p1: number; p2: number }[];
    semisScores: { p1: number; p2: number }[];
    finalsScore: { p1: number; p2: number };
  }>({
    isActive: false,
    participants: [0, 1, 2, 3, 4, 5, 6, 7],
    round: null,
    matchIndex: 0,
    quartersMatches: [],
    semisMatches: [],
    finalsMatch: [],
    winnersQuarters: [],
    winnersSemis: [],
    champion: null,
    currentSeriesWins: { p1: 0, p2: 0 },
    quartersScores: [{ p1: 0, p2: 0 }, { p1: 0, p2: 0 }, { p1: 0, p2: 0 }, { p1: 0, p2: 0 }],
    semisScores: [{ p1: 0, p2: 0 }, { p1: 0, p2: 0 }],
    finalsScore: { p1: 0, p2: 0 }
  });
  const [tournamentCountdown, setTournamentCountdown] = useState<number | null>(null);
  const [showCoronation, setShowCoronation] = useState<boolean>(false);

  const [tournamentType, setTournamentType] = useState<'elimination' | 'points'>('elimination');
  const [pointsChartMode, setPointsChartMode] = useState<'points' | 'rank'>('points');
  const [pointsTour, setPointsTour] = useState<{
    isActive: boolean;
    participants: number[];
    currentRound: number;
    currentMatchIndex: number;
    scores: { [charIdx: number]: number };
    firstPlacesCount: { [charIdx: number]: number };
    fifthRoundPlacements: { [charIdx: number]: number };
    roundPairings: number[][][];
    roundRawResults: Array<{
      round: number;
      winner: number;
      loser: number;
      winnerPerformance: number;
      loserPerformance: number;
      stats: BattleStats;
    }>;
    scoreHistory: Array<{ [charIdx: number]: number }>;
  }>({
    isActive: false,
    participants: [],
    currentRound: 1,
    currentMatchIndex: 0,
    scores: {},
    firstPlacesCount: {},
    fifthRoundPlacements: {},
    roundPairings: [],
    roundRawResults: [],
    scoreHistory: []
  });

  const pointsTourRef = useRef(pointsTour);
  useEffect(() => {
    pointsTourRef.current = pointsTour;
  }, [pointsTour]);

  const [tournamentLogs, setTournamentLogs] = useState<Array<{
    id: string;
    round: string;
    matchNumber: number;
    p1Name: string;
    p2Name: string;
    winnerName: string;
    p1Damage: number;
    p2Damage: number;
  }>>([]);

  const tournamentRef = useRef(tournament);
  useEffect(() => {
    tournamentRef.current = tournament;
  }, [tournament]);

  const [isEnvironmentEnabled, setIsEnvironmentEnabled] = useState<boolean>(false);
  const [isShrinkingArenaEnabled, setIsShrinkingArenaEnabled] = useState<boolean>(false);
  const [isWindVortexEnabled, setIsWindVortexEnabled] = useState<boolean>(false);
  const [isTwoVsTwoMode, setIsTwoVsTwoMode] = useState<boolean>(false);
  const [p1PartnerIndex, setP1PartnerIndex] = useState<number>(2); // Default to Blaze (index 2)
  const [p2PartnerIndex, setP2PartnerIndex] = useState<number>(3); // Default to Storm (index 3)
  const [customSpeedLimit, setCustomSpeedLimit] = useState<number>(20.50);
  const [isHandbookOpen, setIsHandbookOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [battleSpeed, setBattleSpeed] = useState<number>(1);

  // Artistic Customization states
  const [visualPreset, setVisualPreset] = useState<'classic' | 'cosmic' | 'neon'>('classic');
  const [trailStyle, setTrailStyle] = useState<'sparkle' | 'laser' | 'pixel'>('sparkle');
  const [glowPower, setGlowPower] = useState<'delicate' | 'radiant' | 'ultra'>('radiant');

  // Automatically scroll to the battle layout when status changes to 'BATTLE'
  useEffect(() => {
    if (status === 'BATTLE') {
      const timer = setTimeout(() => {
        const el = document.getElementById('battle-section-root');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Victory game states
  const [winner, setWinner] = useState<'p1' | 'p2' | null>(null);
  const [sessionStats, setSessionStats] = useState<BattleStats | null>(null);
  const [resultsTab, setResultsTab] = useState<'offense' | 'defense' | 'honors'>('offense');

  const p1Character = CHARACTERS[p1Index];
  const p1PartnerCharacter = CHARACTERS[p1PartnerIndex];
  const p2Character = CHARACTERS[p2Index];
  const p2PartnerCharacter = CHARACTERS[p2PartnerIndex];

  // Prevent duplicate character selections inside the same team
  const handleSelectP1 = (idx: number) => {
    setP1Index(idx);
    if (isTwoVsTwoMode && idx === p1PartnerIndex) {
      setP1PartnerIndex((idx + 1) % CHARACTERS.length);
    }
  };

  const handleSelectP1Partner = (idx: number) => {
    if (idx === p1Index) {
      setP1PartnerIndex((idx + 1) % CHARACTERS.length);
    } else {
      setP1PartnerIndex(idx);
    }
  };

  const handleSelectP2 = (idx: number) => {
    setP2Index(idx);
    if (isTwoVsTwoMode && idx === p2PartnerIndex) {
      setP2PartnerIndex((idx + 1) % CHARACTERS.length);
    }
  };

  const handleSelectP2Partner = (idx: number) => {
    if (idx === p2Index) {
      setP2PartnerIndex((idx + 1) % CHARACTERS.length);
    } else {
      setP2PartnerIndex(idx);
    }
  };

  const handleStartBattle = () => {
    audio.playSelect();
    audio.playCollision();
    // Reset stats
    setWinner(null);
    setSessionStats(null);
    setIsPlaying(true);
    setBattleSpeed(1);
    setStatus('BATTLE');

    // Instant direct viewport scroll
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    setTimeout(() => {
      const el = document.getElementById('battle-section-root');
      if (el) {
        el.scrollIntoView({ behavior: 'instant' as any, block: 'start' });
      }
    }, 0);
  };

  const handleStartTournament = (selectedIndices: number[]) => {
    // Uniquify selected indices and validate bounds
    let uniqueIndices = Array.from(new Set(selectedIndices)).filter(idx => idx >= 0 && idx < CHARACTERS.length);
    
    // Auto-pad with unselected unique characters to reach exactly 8
    if (uniqueIndices.length < 8) {
      const pool = Array.from({ length: CHARACTERS.length }, (_, i) => i);
      const remaining = pool.filter(i => !uniqueIndices.includes(i));
      uniqueIndices = [...uniqueIndices, ...remaining].slice(0, 8);
    } else {
      uniqueIndices = uniqueIndices.slice(0, 8);
    }

    // Shuffle the 8 participants to randomize match brackets as requested
    const shuffled = [...uniqueIndices];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const finalIndices = shuffled;
    
    // Clear logs upon tournament reset
    setTournamentLogs([]);
    setShowCoronation(false);

    if (tournamentType === 'points') {
      const p = finalIndices;
      // Symmetric Round-Robin pairing subset minimizing duplicate match repetition
      const pairings = [
        // Round 1
        [[p[0], p[1]], [p[2], p[3]], [p[4], p[5]], [p[6], p[7]]],
        // Round 2
        [[p[0], p[2]], [p[1], p[3]], [p[4], p[6]], [p[5], p[7]]],
        // Round 3
        [[p[0], p[4]], [p[1], p[5]], [p[2], p[6]], [p[3], p[7]]],
        // Round 4
        [[p[0], p[6]], [p[1], p[7]], [p[2], p[4]], [p[3], p[5]]],
        // Round 5
        [[p[0], p[7]], [p[1], p[6]], [p[2], p[5]], [p[3], p[4]]]
      ];

      const initialScores: { [key: number]: number } = {};
      const initialFirstPlaces: { [key: number]: number } = {};
      const initialFifthPlacements: { [key: number]: number } = {};
      finalIndices.forEach(idx => {
        initialScores[idx] = 0;
        initialFirstPlaces[idx] = 0;
        initialFifthPlacements[idx] = 9;
      });

      setPointsTour({
        isActive: true,
        participants: finalIndices,
        currentRound: 1,
        currentMatchIndex: 0,
        scores: initialScores,
        firstPlacesCount: initialFirstPlaces,
        fifthRoundPlacements: initialFifthPlacements,
        roundPairings: pairings,
        roundRawResults: [],
        scoreHistory: [{ ...initialScores }]
      });

      setTournament(prev => ({
        ...prev,
        isActive: false // Deactivate normal tour just in case
      }));

      // Automatically load Match 0 of Round 1!
      setP1Index(pairings[0][0][0]);
      setP2Index(pairings[0][0][1]);
      setIsTwoVsTwoMode(false); // Clean 1v1 battle
    } else {
      // Create Quarters pairings
      const quarters = [
        [finalIndices[0], finalIndices[1]],
        [finalIndices[2], finalIndices[3]],
        [finalIndices[4], finalIndices[5]],
        [finalIndices[6], finalIndices[7]]
      ];

      setPointsTour(prev => ({
        ...prev,
        isActive: false // Deactivate points tour
      }));

      setTournament({
        isActive: true,
        participants: finalIndices,
        round: 'quarters',
        matchIndex: 0,
        quartersMatches: quarters,
        semisMatches: [],
        finalsMatch: [],
        winnersQuarters: [],
        winnersSemis: [],
        champion: null,
        currentSeriesWins: { p1: 0, p2: 0 },
        quartersScores: [{ p1: 0, p2: 0 }, { p1: 0, p2: 0 }, { p1: 0, p2: 0 }, { p1: 0, p2: 0 }],
        semisScores: [{ p1: 0, p2: 0 }, { p1: 0, p2: 0 }],
        finalsScore: { p1: 0, p2: 0 }
      });

      // Automatically load Match 0 of Quarters!
      setP1Index(quarters[0][0]);
      setP2Index(quarters[0][1]);
      setIsTwoVsTwoMode(false); // Clean 1v1 battle
    }

    // Play battle!
    audio.playSelect();
    audio.playCollision();
    
    setWinner(null);
    setSessionStats(null);
    setIsPlaying(true);
    setBattleSpeed(1);
    setStatus('BATTLE');

    // Instant direct viewport scroll
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    setTimeout(() => {
      const el = document.getElementById('battle-section-root');
      if (el) {
        el.scrollIntoView({ behavior: 'instant' as any, block: 'start' });
      }
    }, 0);
  };

  const handleGameOver = (winningSide: 'p1' | 'p2', stats: BattleStats) => {
    setWinner(winningSide);
    setSessionStats(stats);
    setResultsTab('offense');
    setStatus('GAME_OVER');

    if (tournamentType === 'points') {
      const pt = pointsTourRef.current;
      if (pt.isActive) {
        const currentPair = pt.roundPairings[pt.currentRound - 1]?.[pt.currentMatchIndex];
        if (currentPair) {
          const p1Idx = currentPair[0];
          const p2Idx = currentPair[1];
          const isP1Winner = winningSide === 'p1';
          const winnerId = isP1Winner ? p1Idx : p2Idx;
          const loserId = isP1Winner ? p2Idx : p1Idx;

          // Performance scoring metrics for placement determination
          const winnerDmg = isP1Winner ? stats.p1DamageDealt : stats.p2DamageDealt;
          const winnerSpeed = isP1Winner ? stats.p1MaxSpeed : stats.p2MaxSpeed;
          const winnerBounces = isP1Winner ? stats.p1Bounces : stats.p2Bounces;
          const winnerPerformance = winnerDmg * 1.5 + winnerSpeed + winnerBounces * 0.5;

          const loserDmg = isP1Winner ? stats.p2DamageDealt : stats.p1DamageDealt;
          const loserSpeed = isP1Winner ? stats.p2MaxSpeed : stats.p1MaxSpeed;
          const loserBounces = isP1Winner ? stats.p2Bounces : stats.p1Bounces;
          const loserPerformance = loserDmg * 1.5 + loserSpeed + loserBounces * 0.5;

          // Real-time Match Logger
          try {
            const char1 = CHARACTERS[p1Idx];
            const char2 = CHARACTERS[p2Idx];
            const winnerChar = CHARACTERS[winnerId];
            const roundLabel = `積分賽第 ${pt.currentRound} 局`;
            const matchNum = pt.currentMatchIndex + 1;
            const newLog = {
              id: `${roundLabel}_${matchNum}_${Date.now()}`,
              round: roundLabel,
              matchNumber: matchNum,
              p1Name: char1.name,
              p2Name: char2.name,
              winnerName: winnerChar.name,
              p1Damage: stats?.p1DamageDealt || 0,
              p2Damage: stats?.p2DamageDealt || 0,
            };
            setTournamentLogs(prev => {
              if (prev.some(l => l.round === roundLabel && l.matchNumber === matchNum)) {
                return prev;
              }
              return [newLog, ...prev];
            });
          } catch (e) {
            console.error("Match logging failed", e);
          }

          const matchResult = {
            round: pt.currentRound,
            winner: winnerId,
            loser: loserId,
            winnerPerformance,
            loserPerformance,
            stats
          };

          setPointsTour(prev => {
            const currentRoundResults = [...prev.roundRawResults, matchResult];
            
            if (prev.currentMatchIndex === 3) {
              // End of the round! Distribute points!
              const roundWinners = currentRoundResults.map(r => ({ charIdx: r.winner, performance: r.winnerPerformance }));
              const roundLosers = currentRoundResults.map(r => ({ charIdx: r.loser, performance: r.loserPerformance }));

              // Sort desc based on performance
              roundWinners.sort((a, b) => b.performance - a.performance);
              roundLosers.sort((a, b) => b.performance - a.performance);

              const roundRankings = [
                roundWinners[0].charIdx,
                roundWinners[1].charIdx,
                roundWinners[2].charIdx,
                roundWinners[3].charIdx,
                roundLosers[0].charIdx,
                roundLosers[1].charIdx,
                roundLosers[2].charIdx,
                roundLosers[3].charIdx
              ];

              const ptDistribution = [7, 6, 5, 4, 3, 2, 2, 1];
              const nextScores = { ...prev.scores };
              const nextFirstPlaces = { ...prev.firstPlacesCount };
              const nextFifthPlacements = { ...prev.fifthRoundPlacements };

              roundRankings.forEach((idx, rankIdx) => {
                const pts = ptDistribution[rankIdx];
                nextScores[idx] = (nextScores[idx] || 0) + pts;
                if (rankIdx === 0) {
                  nextFirstPlaces[idx] = (nextFirstPlaces[idx] || 0) + 1;
                }
                if (prev.currentRound === 5) {
                  nextFifthPlacements[idx] = rankIdx + 1;
                }
              });

              const nextHistory = [...(prev.scoreHistory || []), { ...nextScores }];

              if (prev.currentRound === 5) {
                // All 5 rounds are done! Show Coronation Champion!
                setShowCoronation(true);
                return {
                  ...prev,
                  scores: nextScores,
                  firstPlacesCount: nextFirstPlaces,
                  fifthRoundPlacements: nextFifthPlacements,
                  roundRawResults: currentRoundResults,
                  currentMatchIndex: 4, // Complete state mark
                  scoreHistory: nextHistory
                };
              } else {
                return {
                  ...prev,
                  scores: nextScores,
                  firstPlacesCount: nextFirstPlaces,
                  fifthRoundPlacements: nextFifthPlacements,
                  roundRawResults: [],
                  currentRound: prev.currentRound + 1,
                  currentMatchIndex: 0,
                  scoreHistory: nextHistory
                };
              }
            } else {
              return {
                ...prev,
                roundRawResults: currentRoundResults,
                currentMatchIndex: prev.currentMatchIndex + 1
              };
            }
          });
        }
      }
    } else {
      if (tournament.isActive) {
        // Determine participant index that won
        let currentPair: number[] = [];
        if (tournament.round === 'quarters') {
          currentPair = tournament.quartersMatches[tournament.matchIndex];
        } else if (tournament.round === 'semis') {
          currentPair = tournament.semisMatches[tournament.matchIndex];
        } else if (tournament.round === 'finals') {
          currentPair = tournament.finalsMatch;
        }

        if (currentPair.length === 2) {
          const winnerCharIdx = winningSide === 'p1' ? currentPair[0] : currentPair[1];
          
          // Log match results
          try {
            const char1 = CHARACTERS[currentPair[0]];
            const char2 = CHARACTERS[currentPair[1]];
            const winnerChar = CHARACTERS[winnerCharIdx];
            const roundLabel = tournament.round === 'quarters' ? '8強淘汰賽' : tournament.round === 'semis' ? '半決賽' : '總決賽';
            const matchNum = tournament.matchIndex + 1;
            const newLog = {
              id: `${roundLabel}_${matchNum}_${Date.now()}`,
              round: roundLabel,
              matchNumber: matchNum,
              p1Name: char1.name,
              p2Name: char2.name,
              winnerName: winnerChar.name,
              p1Damage: stats?.p1DamageDealt || 0,
              p2Damage: stats?.p2DamageDealt || 0,
            };
            setTournamentLogs(prev => {
              if (prev.some(l => l.round === roundLabel && l.matchNumber === matchNum)) {
                return prev;
              }
              return [newLog, ...prev];
            });
          } catch (e) {
            console.error("Failed to write tournament log:", e);
          }
          
          setTournament(prev => {
            // In a Single Elimination (BO1) format, the winner of this match immediately advances.
            const isP1Winner = winningSide === 'p1';
            const nextSeriesWins = {
              p1: isP1Winner ? 1 : 0,
              p2: isP1Winner ? 0 : 1
            };

            // Update scores for this matchup in historical records so bracket graphics can render them
            const nextQuartersScores = [...prev.quartersScores];
            const nextSemisScores = [...prev.semisScores];
            let nextFinalsScore = { ...prev.finalsScore };

            if (prev.round === 'quarters') {
              nextQuartersScores[prev.matchIndex] = nextSeriesWins;
            } else if (prev.round === 'semis') {
              nextSemisScores[prev.matchIndex] = nextSeriesWins;
            } else if (prev.round === 'finals') {
              nextFinalsScore = nextSeriesWins;
            }

            const seriesWinnerCharIdx = isP1Winner ? currentPair[0] : currentPair[1];
            const resetSeriesWins = { p1: 0, p2: 0 };

            if (prev.round === 'quarters') {
              const nextWinners = [...prev.winnersQuarters, seriesWinnerCharIdx];
              if (nextWinners.length === 4) {
                const semis = [
                  [nextWinners[0], nextWinners[1]],
                  [nextWinners[2], nextWinners[3]]
                ];
                return {
                  ...prev,
                  winnersQuarters: nextWinners,
                  round: 'semis',
                  matchIndex: 0,
                  semisMatches: semis,
                  currentSeriesWins: resetSeriesWins,
                  quartersScores: nextQuartersScores
                };
              } else {
                return {
                  ...prev,
                  winnersQuarters: nextWinners,
                  matchIndex: prev.matchIndex + 1,
                  currentSeriesWins: resetSeriesWins,
                  quartersScores: nextQuartersScores
                };
              }
            } else if (prev.round === 'semis') {
              const nextWinners = [...prev.winnersSemis, seriesWinnerCharIdx];
              if (nextWinners.length === 2) {
                const finalMatch = [nextWinners[0], nextWinners[1]];
                return {
                  ...prev,
                  winnersSemis: nextWinners,
                  round: 'finals',
                  matchIndex: 0,
                  finalsMatch: finalMatch,
                  currentSeriesWins: resetSeriesWins,
                  semisScores: nextSemisScores
                };
              } else {
                return {
                  ...prev,
                  winnersSemis: nextWinners,
                  matchIndex: prev.matchIndex + 1,
                  currentSeriesWins: resetSeriesWins,
                  semisScores: nextSemisScores
                };
              }
            } else if (prev.round === 'finals') {
              setShowCoronation(true);
              return {
                ...prev,
                round: 'complete',
                champion: seriesWinnerCharIdx,
                currentSeriesWins: resetSeriesWins,
                finalsScore: nextFinalsScore
              };
            }
            return prev;
          });
        }
      }
    }
  };

  const handleLaunchNextTournamentMatch = () => {
    audio.playSelect();
    audio.playCollision();

    // Check what matchup to load
    let nextP1 = 0;
    let nextP2 = 0;

    if (tournamentType === 'points') {
      const pt = pointsTourRef.current;
      if (!pt.isActive) return;
      const pair = pt.roundPairings[pt.currentRound - 1]?.[pt.currentMatchIndex];
      if (pair) {
        nextP1 = pair[0];
        nextP2 = pair[1];
      } else {
        return; // Complete!
      }
    } else {
      // Use current tournament state ref to resolve stale closure issues completely
      const currentTour = tournamentRef.current;
      if (currentTour.round === 'quarters') {
        const pair = currentTour.quartersMatches[currentTour.matchIndex];
        if (pair) {
          nextP1 = pair[0];
          nextP2 = pair[1];
        }
      } else if (currentTour.round === 'semis') {
        const pair = currentTour.semisMatches[currentTour.matchIndex];
        if (pair) {
          nextP1 = pair[0];
          nextP2 = pair[1];
        }
      } else if (currentTour.round === 'finals') {
        const pair = currentTour.finalsMatch;
        if (pair) {
          nextP1 = pair[0];
          nextP2 = pair[1];
        }
      } else {
        return; // Already complete
      }
    }

    // Make sure index references are set
    setP1Index(nextP1);
    setP2Index(nextP2);
    setWinner(null);
    setSessionStats(null);
    setIsPlaying(true);
    setBattleSpeed(1);
    setStatus('BATTLE');

    // Instant direct viewport scroll
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    setTimeout(() => {
      const el = document.getElementById('battle-section-root');
      if (el) {
        el.scrollIntoView({ behavior: 'instant' as any, block: 'start' });
      }
    }, 0);
  };

  useEffect(() => {
    if (status === 'GAME_OVER') {
      if (tournament.isActive && tournament.round !== 'complete' && tournament.round !== null) {
        setTournamentCountdown(3);
      } else if (tournamentType === 'points' && pointsTour.isActive && pointsTour.currentMatchIndex < 4) {
        setTournamentCountdown(3);
      } else {
        setTournamentCountdown(null);
      }
    } else {
      setTournamentCountdown(null);
    }
  }, [status, tournament.isActive, tournament.round, tournament.matchIndex, tournamentType, pointsTour.isActive, pointsTour.currentMatchIndex]);

  useEffect(() => {
    if (tournamentCountdown === null) return;
    if (tournamentCountdown <= 0) {
      setTournamentCountdown(null);
      handleLaunchNextTournamentMatch();
      return;
    }
    const t = setTimeout(() => {
      setTournamentCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(t);
  }, [tournamentCountdown]);

  const handleRestartBattle = () => {
    audio.playSelect();
    setResultsTab('offense');
    setStatus('BATTLE');
  };

  // Scroll to focus the battle screen when battle starts / resets
  useEffect(() => {
    if (status === 'BATTLE') {
      const scrollTimer = setTimeout(() => {
        // Scroll window to top instantly
        window.scrollTo({ top: 0, behavior: 'instant' as any });
        
        // Find and scroll the main element or root wrapper if exists
        const mainEl = document.querySelector('main');
        if (mainEl) {
          mainEl.scrollTo({ top: 0, behavior: 'instant' as any });
        }
        
        // Attempt to focus on the battle canvas or viewport specifically
        const canvasContainer = document.getElementById('battle-canvas-container');
        if (canvasContainer) {
          canvasContainer.scrollIntoView({ behavior: 'instant' as any, block: 'center' });
        }
      }, 0);
      return () => clearTimeout(scrollTimer);
    }
  }, [status]);

  const getChampionIndex = () => {
    if (tournamentType === 'points') {
      const pList = [...pointsTour.participants];
      if (pList.length === 0) return null;
      pList.sort((a, b) => {
        const scoreA = pointsTour.scores[a] || 0;
        const scoreB = pointsTour.scores[b] || 0;
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        const firstsA = pointsTour.firstPlacesCount[a] || 0;
        const firstsB = pointsTour.firstPlacesCount[b] || 0;
        if (firstsB !== firstsA) {
          return firstsB - firstsA;
        }
        const fifthA = pointsTour.fifthRoundPlacements[a] || 9;
        const fifthB = pointsTour.fifthRoundPlacements[b] || 9;
        return fifthA - fifthB; 
      });
      return pList[0];
    }
    return tournament.champion;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Upper Navigation Header Bar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo Name Section representing Arena literal boundaries */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 shadow-inner">
              <Swords className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div className="absolute inset-0 rounded-xl bg-indigo-500/5 blur-sm" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300">
                基礎球體對戰
              </h1>
              <span className="text-[10px] font-bold font-mono text-indigo-400/90 tracking-wider">
                SPHERE BATTLE ARENA
              </span>
            </div>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audio.playSelect();
                setIsHandbookOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800 text-xs font-black text-slate-200 transition-all cursor-pointer shadow-lg active:scale-95 group"
            >
              <BookOpen className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>檢視奧義圖鑑</span>
            </button>
            <div className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-400 font-mono font-bold hidden sm:block">
              版本 1.1.0 (實時競技)
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Dashboard */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col justify-center overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {/* State A: Character Selector Board (1v1角色選擇戰鬥) */}
          {status === 'SELECTING' && (
            <motion.div
              key="selecting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
              className="w-full"
            >
              <CharacterSelectionScreen
                characters={CHARACTERS}
                p1Index={p1Index}
                p2Index={p2Index}
                p1PartnerIndex={p1PartnerIndex}
                p2PartnerIndex={p2PartnerIndex}
                onSelectP1={handleSelectP1}
                onSelectP1Partner={handleSelectP1Partner}
                onSelectP2={handleSelectP2}
                onSelectP2Partner={handleSelectP2Partner}
                onConfirmBattle={handleStartBattle}
                isCustomMode={isCustomMode}
                setIsCustomMode={setIsCustomMode}
                isEnvironmentEnabled={isEnvironmentEnabled}
                setIsEnvironmentEnabled={setIsEnvironmentEnabled}
                isShrinkingArenaEnabled={isShrinkingArenaEnabled}
                setIsShrinkingArenaEnabled={setIsShrinkingArenaEnabled}
                isWindVortexEnabled={isWindVortexEnabled}
                setIsWindVortexEnabled={setIsWindVortexEnabled}
                isPortalEnabled={isPortalEnabled}
                setIsPortalEnabled={setIsPortalEnabled}
                isTournamentActive={isTournamentActive}
                setIsTournamentActive={setIsTournamentActive}
                tournamentParticipants={tournamentParticipants}
                setTournamentParticipants={setTournamentParticipants}
                onStartTournament={handleStartTournament}
                customSpeedLimit={customSpeedLimit}
                setCustomSpeedLimit={setCustomSpeedLimit}
                visualPreset={visualPreset}
                setVisualPreset={setVisualPreset}
                trailStyle={trailStyle}
                setTrailStyle={setTrailStyle}
                glowPower={glowPower}
                setGlowPower={setGlowPower}
                setIsHandbookOpen={setIsHandbookOpen}
                isTwoVsTwoMode={isTwoVsTwoMode}
                setIsTwoVsTwoMode={setIsTwoVsTwoMode}
                tournamentType={tournamentType}
                setTournamentType={setTournamentType}
              />
            </motion.div>
          )}

          {/* State B: Active Combat Battlefield (現場競技場與動作反彈) */}
          {status === 'BATTLE' && (
            <motion.div
              key="battle"
              id="battle-section-root"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
              className="w-full flex justify-center"
            >
              <div className={isTwoVsTwoMode ? "max-w-5xl mx-auto w-full" : "max-w-3xl mx-auto w-full"}>
                <BattleArena
                  p1Char={p1Character}
                  p2Char={p2Character}
                  isTwoVsTwoMode={isTwoVsTwoMode}
                  p1PartnerChar={p1PartnerCharacter}
                  p2PartnerChar={p2PartnerCharacter}
                  isCustomMode={isCustomMode}
                  isEnvironmentEnabled={isEnvironmentEnabled}
                  isShrinkingArenaEnabled={isShrinkingArenaEnabled}
                  isWindVortexEnabled={isWindVortexEnabled}
                  isPortalEnabled={isPortalEnabled}
                  customSpeedLimit={customSpeedLimit}
                  visualPreset={visualPreset}
                  trailStyle={trailStyle}
                  glowPower={glowPower}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  battleSpeed={battleSpeed}
                  setBattleSpeed={setBattleSpeed}
                  setIsHandbookOpen={setIsHandbookOpen}
                  onGameOver={handleGameOver}
                  onBackToMenu={() => {
                    audio.playSelect();
                    // Reset tournament if active
                    setTournament(prev => ({ ...prev, isActive: false, round: null }));
                    setStatus('SELECTING');
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* State C: Endgame Winner Display (贏家顯示勝利 染患停止這場戰鬥) */}
          {status === 'GAME_OVER' && winner && sessionStats && (() => {
            const p1Total = sessionStats.p1DamageDealt || 0;
            const p2Total = sessionStats.p2DamageDealt || 0;
            
            // Calculate normal vs skill damages
            const p1Norm = sessionStats.p1NormalDamageDealt || 0;
            const p1Skill = sessionStats.p1SkillDamageDealt || 0;
            const p1Sum = p1Norm + p1Skill || 1;
            const p1NormPct = Math.round((p1Norm / p1Sum) * 100);
            const p1SkillPct = Math.round((p1Skill / p1Sum) * 100);

            const p2Norm = sessionStats.p2NormalDamageDealt || 0;
            const p2Skill = sessionStats.p2SkillDamageDealt || 0;
            const p2Sum = p2Norm + p2Skill || 1;
            const p2NormPct = Math.round((p2Norm / p2Sum) * 100);
            const p2SkillPct = Math.round((p2Skill / p2Sum) * 100);

            // Maximum damage for comparison bars
            const maxDamage = Math.max(p1Total, p2Total, 1);

            // Dynamic honors title accolade generator
            const getBattleAccolade = (isP1: boolean) => {
              const myTotal = isP1 ? p1Total : p2Total;
              const stats = sessionStats;
              const myHealing = isP1 ? stats.p1Healing : stats.p2Healing;
              const myMaxHit = isP1 ? stats.p1MaxSingleHit : stats.p2MaxSingleHit;
              const mySpeed = isP1 ? stats.p1MaxSpeed : stats.p2MaxSpeed;
              const myShield = isP1 ? stats.p1ShieldAbsorbed : stats.p2ShieldAbsorbed;
              const isWin = isP1 ? winner === 'p1' : winner === 'p2';

              if (myMaxHit > 25.0) return { title: '奧能毀滅神', desc: '打出了超越極限的恐怖單次奧術碎擊！', border: 'border-rose-500/30 text-rose-400 bg-rose-500/5' };
              if (myHealing > 40.0) return { title: '生命大祭司', desc: '戰鬥中召喚無盡生命靈泉，精準修復本體創傷！', border: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' };
              if (mySpeed > 28.0) return { title: '超弦風暴', desc: '瞬時速度突破次元束縛，如魅影風暴横掃戰場！', border: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5' };
              if (myShield !== undefined && myShield > 35.0) return { title: '嘆息之牆', desc: '精妙運作奧能護盾，全數吸收化解海量致命打擊！', border: 'border-sky-500/30 text-sky-400 bg-sky-500/5' };
              if (isWin) return { title: '不敗凱旋戰首', desc: '完美掌控攻防節奏，以絕對姿態贏得榮光對決！', border: 'border-amber-500/30 text-amber-400 bg-amber-500/5' };
              return { title: '堅韌不屈鬥魂', desc: '即使身處終末劣境，依然燃燒靈魂戰至最後一刻！', border: 'border-slate-500/30 text-slate-400 bg-slate-500/5' };
            };

            return (
              <motion.div
                key="game_over"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="w-full max-w-4xl mx-auto py-2 sm:py-6 animate-fadeIn"
              >
                <div className="flex flex-col items-center justify-center text-center font-sans">
                  {/* Round Completed Trophy Ring */}
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full scale-110" />
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900 border-2 border-yellow-500/40 shadow-inner">
                      <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-lg animate-bounce" />
                      <Sparkles className="absolute top-1 right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-black text-yellow-500 tracking-widest uppercase mb-1">
                    勝利終局完成 (VICTORY MATCH CONCLUDED)
                  </span>
                  
                  <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-50 to-slate-200 tracking-tight mb-2 uppercase">
                    英雄對決 · 戰後結算大廳
                  </h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                    兩大主將陣营交鋒完畢，以下為本局的對戰指標、物理碰撞及奧術釋放佔比對照。
                  </p>

                  {/* General Game Stats Bar */}
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-slate-900/60 border border-slate-800/80 p-3 px-5 rounded-2xl mb-5 font-mono text-xs text-slate-400 max-w-lg mx-auto">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span>對峙時長: <strong className="text-slate-200">{sessionStats.duration.toFixed(1)}s</strong></span>
                    </div>
                    <span className="text-slate-700">|</span>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span>物理碰擊: <strong className="text-slate-200">{sessionStats.collisions} 次</strong></span>
                    </div>
                  </div>

                  {/* Tournament Interactive Points / League Board Layout */}
                  {tournamentType === 'points' && pointsTour.isActive && (() => {
                    const getSortedPointsParticipants = () => {
                      const pList = [...pointsTour.participants];
                      pList.sort((a, b) => {
                        const scoreA = pointsTour.scores[a] || 0;
                        const scoreB = pointsTour.scores[b] || 0;
                        if (scoreB !== scoreA) {
                          return scoreB - scoreA;
                        }
                        // Condition 1: most 1st places count
                        const firstsA = pointsTour.firstPlacesCount[a] || 0;
                        const firstsB = pointsTour.firstPlacesCount[b] || 0;
                        if (firstsB !== firstsA) {
                          return firstsB - firstsA;
                        }
                        // Condition 2: 5th round placements (lower placement index is better, e.g. 1st is best, 9 is default)
                        const fifthA = pointsTour.fifthRoundPlacements[a] || 9;
                        const fifthB = pointsTour.fifthRoundPlacements[b] || 9;
                        return fifthA - fifthB; 
                      });
                      return pList;
                    };

                    return (
                      <div className="w-full bg-slate-900/40 border border-slate-800/80 p-5 rounded-3xl mb-6 shadow-inner relative overflow-hidden text-left font-sans animate-fadeIn">
                        {/* Ambient tournament background flare */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full" />
                        
                        <div className="text-center mb-5">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-[10px] text-yellow-400 font-black tracking-wider uppercase mb-2 select-none font-sans">
                            🏆 8 人球體對決個人積分聯賽 (BO5)
                          </div>
                          <h3 className="text-sm font-black text-slate-200">
                            {pointsTour.currentMatchIndex === 4 
                              ? '🏆 個人積分賽事已全部順利完成！' 
                              : `當前錦標進度：第 ${pointsTour.currentRound} / 5 局 [第 ${pointsTour.currentMatchIndex + 1} / 4 場對戰]`}
                          </h3>

                          {/* Interactive Stage Tracker */}
                          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-lg mx-auto bg-slate-950/80 rounded-xl border border-slate-900/60 px-3 py-2 font-mono text-[9px] shadow-sm">
                            <span className="text-slate-500 font-bold tracking-widest uppercase mr-1">局數進度:</span>
                            {[1, 2, 3, 4, 5].map(roundNum => {
                              const isCompleted = roundNum < pointsTour.currentRound || (pointsTour.currentRound === 5 && pointsTour.currentMatchIndex === 4);
                              const isActive = roundNum === pointsTour.currentRound && pointsTour.currentMatchIndex < 4;
                              return (
                                <div key={`points-round-${roundNum}`} className="flex items-center gap-1">
                                  <div 
                                    className={`px-2 py-0.5 rounded font-extrabold select-none transition-all ${
                                      isCompleted 
                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold' 
                                        : isActive 
                                          ? 'bg-yellow-500 text-slate-950 border border-yellow-400 font-black animate-pulse' 
                                          : 'bg-slate-900 text-slate-500 border border-slate-950'
                                    }`}
                                  >
                                    第 {roundNum} 局
                                  </div>
                                  {roundNum < 5 && <div className={`w-1.5 h-[1.5px] ${isCompleted ? 'bg-emerald-500/40' : 'bg-slate-900'}`} />}
                                </div>
                              );
                            })}
                          </div>

                          {/* Match Progression info & automatic timer countdown */}
                          {tournamentCountdown !== null && pointsTour.currentMatchIndex < 4 && (
                            <div className="mt-4 flex flex-col items-center gap-1.5 max-w-xs mx-auto">
                              <span className="text-[10px] font-bold text-yellow-500 font-mono animate-pulse">
                                ⏳ {tournamentCountdown} 秒後將自動開啟下一輪對決...
                              </span>
                              <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-yellow-500" 
                                  initial={{ width: '100%' }}
                                  animate={{ width: '0%' }}
                                  transition={{ duration: tournamentCountdown, ease: 'linear' }}
                                  key={`countdown-points-${pointsTour.currentRound}-${pointsTour.currentMatchIndex}-${tournamentCountdown}`}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Flex layout containing Match Info and Standings Leaderboard */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left text-xs text-slate-300">
                          
                          {/* LEFT COLUMN: Matches of the Current Round */}
                          <div className="md:col-span-12 lg:col-span-5 space-y-3 bg-slate-950/60 p-4 rounded-2.5xl border border-slate-900 shadow-xl">
                            <span className="text-[10px] font-mono font-black text-slate-400 block tracking-wider uppercase border-b border-slate-900 pb-2">
                              ⚔️ 第 {pointsTour.currentRound} 局 本輪對決排班 (4場對決)
                            </span>
                            
                            <div className="space-y-2">
                              {pointsTour.roundPairings[pointsTour.currentRound - 1]?.map((pair, pIdx) => {
                                const isCurrent = pointsTour.currentMatchIndex === pIdx && pointsTour.currentMatchIndex < 4;
                                const isCompleted = pIdx < pointsTour.currentMatchIndex;
                                const charA = CHARACTERS[pair[0]];
                                const charB = CHARACTERS[pair[1]];

                                return (
                                  <div 
                                    key={`rt-match-${pIdx}`}
                                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                                      isCurrent 
                                        ? 'border-yellow-500 bg-yellow-500/5 shadow-[0_0_12px_rgba(234,179,8,0.25)] scale-102 font-bold'
                                        : isCompleted
                                          ? 'border-emerald-500/10 bg-emerald-500/2 opacity-75'
                                          : 'border-slate-900 opacity-60'
                                    }`}
                                  >
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[9px] font-mono text-slate-500">場次 {pIdx + 1} / 4</span>
                                      <div className="flex items-center gap-1.5 text-[10.5px]">
                                        <span className="text-slate-300 font-bold truncate max-w-[75px]">{charA?.name || '無'}</span>
                                        <span className="text-slate-600 px-0.5 text-[8.5px]">VS</span>
                                        <span className="text-slate-300 font-bold truncate max-w-[75px]">{charB?.name || '無'}</span>
                                      </div>
                                    </div>
                                    <div>
                                      {isCompleted ? (
                                        <span className="text-[9px] font-bold bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded-lg">
                                          已擊破
                                        </span>
                                      ) : isCurrent ? (
                                        <span className="text-[9px] font-extrabold bg-yellow-500 text-slate-950 px-2 py-0.5 rounded-lg animate-pulse">
                                          交鋒中
                                        </span>
                                      ) : (
                                        <span className="text-[9px] font-semibold bg-slate-900 text-slate-500 px-2 py-0.5 rounded-lg">
                                          排隊中
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* RIGHT COLUMN: Standing Leaderboard */}
                          <div className="md:col-span-12 lg:col-span-7 space-y-3 bg-slate-950/60 p-4 rounded-2.5xl border border-slate-900 shadow-xl">
                            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                              <span className="text-[10px] font-mono font-black text-slate-300 tracking-wider uppercase flex items-center gap-1.5 text-slate-400">
                                📊 8位選手實時總積分榜 ({pointsTour.currentMatchIndex === 4 ? "最終局結算" : "實時" } Standings)
                              </span>
                              <span className="text-[8.5px] font-mono text-slate-500">
                                BO5 打滿五局
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {getSortedPointsParticipants().map((charIdx, rank) => {
                                const char = CHARACTERS[charIdx];
                                const score = pointsTour.scores[charIdx] || 0;
                                const wins = pointsTour.firstPlacesCount[charIdx] || 0;
                                const fifthPlacementVal = pointsTour.fifthRoundPlacements[charIdx];
                                
                                const fifthLabel = fifthPlacementVal && fifthPlacementVal <= 8 ? `第5局名次: ${fifthPlacementVal}` : '';

                                let rankGlow = "text-slate-400";
                                let bgStyle = "bg-slate-900/30 border-slate-900/80";
                                if (rank === 0) {
                                  rankGlow = "text-yellow-400 font-black";
                                  bgStyle = "bg-yellow-500/5 border-yellow-500/25 shadow-[0_0_10px_rgba(234,179,8,0.1)]";
                                } else if (rank === 1) {
                                  rankGlow = "text-slate-200 font-extrabold";
                                  bgStyle = "bg-slate-300/5 border-slate-300/10";
                                } else if (rank === 2) {
                                  rankGlow = "text-amber-600 font-bold";
                                  bgStyle = "bg-amber-700/5 border-amber-700/10";
                                }

                                return (
                                  <div 
                                    key={`rt-rank-${charIdx}`}
                                    className={`flex items-center justify-between p-2 rounded-xl border text-[10.5px] transition-all hover:border-slate-700/40 ${bgStyle}`}
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <span className={`w-4 text-center font-mono font-black text-[11px] ${rankGlow}`}>
                                        {rank + 1}
                                      </span>
                                      <CharacterVectorIcon characterId={char?.id} className="w-5 h-5 shrink-0" />
                                      <div className="flex flex-col min-w-0">
                                        <span className="font-extrabold text-slate-200 truncate">{char?.name || '無'}</span>
                                        <span className="text-[8.5px] text-slate-500 font-mono leading-none mt-0.5 whitespace-nowrap">
                                          首名: <strong className="text-yellow-500">{wins}次</strong> {fifthLabel && ` • ${fifthLabel}`}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 shrink-0 ml-1 font-mono">
                                      <span className="font-black text-yellow-500 text-xs">{score}</span>
                                      <span className="text-[8px] text-slate-500">pts</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            <div className="text-[8px] text-slate-500 leading-relaxed font-mono pt-1.5 text-center border-t border-slate-900/60 flex items-center justify-center gap-3">
                              <span>第 1 名: 7分 / 2名: 6分 / 3名: 5分 / 4名: 4分 / 5名: 3分 / 6~7名: 2分 / 8名: 1分</span>
                            </div>
                          </div>

                          {/* TREND HISTORY LINE CHART */}
                          <div className="md:col-span-12 bg-slate-950/70 p-5 rounded-2.5xl border border-slate-900 shadow-2xl space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-900">
                              <div className="space-y-1">
                                <h4 className="text-xs font-mono font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                                  📈 聯賽賽程積分增長與排名變化趨勢
                                </h4>
                                <p className="text-[10px] text-slate-500">
                                  實時追蹤 8 位球體選手在 BO5 聯賽各階段的比分與戰力爬升軌跡。
                                </p>
                              </div>
                              
                              {/* Chart Mode Toggle Switch */}
                              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                                <button
                                  onClick={() => setPointsChartMode('points')}
                                  className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                                    pointsChartMode === 'points'
                                      ? 'bg-indigo-600 text-white shadow-md'
                                      : 'text-slate-400 hover:text-slate-200'
                                  }`}
                                >
                                  積分增長
                                </button>
                                <button
                                  onClick={() => setPointsChartMode('rank')}
                                  className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                                    pointsChartMode === 'rank'
                                      ? 'bg-indigo-600 text-white shadow-md'
                                      : 'text-slate-400 hover:text-slate-200'
                                  }`}
                                >
                                  排名起伏
                                </button>
                              </div>
                            </div>

                            {/* Recharts Component block */}
                            {(() => {
                              // Sub-helper to get ranking at each stage safely
                              const getRankAtStage = (historyObj: { [charIdx: number]: number }, charIdx: number) => {
                                const sorted = [...pointsTour.participants].sort((a, b) => {
                                  const scoreA = historyObj[a] || 0;
                                  const scoreB = historyObj[b] || 0;
                                  if (scoreB !== scoreA) return scoreB - scoreA;
                                  // Tiebreaker
                                  return a - b;
                                });
                                return sorted.indexOf(charIdx) + 1;
                              };

                              // Map history array to recharts items
                              const data = (pointsTour.scoreHistory || []).map((historyObj, stageIdx) => {
                                const name = stageIdx === 0 ? "初始" : `第 ${stageIdx} 局`;
                                const item: any = { name };
                                pointsTour.participants.forEach(charIdx => {
                                  const char = CHARACTERS[charIdx];
                                  if (char) {
                                    item[`${char.id}_points`] = historyObj[charIdx] || 0;
                                    item[`${char.id}_rank`] = getRankAtStage(historyObj, charIdx);
                                  }
                                });
                                return item;
                              });

                              // Custom tooltip component
                              const CustomTooltip = ({ active, payload, label }: any) => {
                                if (active && payload && payload.length) {
                                  // Sort payload to show leader on top in tooltip
                                  const sortedPayload = [...payload].sort((a: any, b: any) => {
                                    if (pointsChartMode === 'points') {
                                      return b.value - a.value;
                                    } else {
                                      return a.value - b.value;
                                    }
                                  });

                                  return (
                                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl font-sans text-xs space-y-1.5">
                                      <div className="font-extrabold text-slate-300 border-b border-slate-900 pb-1 mb-1">
                                        {label} 結算
                                      </div>
                                      <div className="space-y-1">
                                        {sortedPayload.map((entry: any) => {
                                          const charName = entry.name;
                                          const value = entry.value;
                                          return (
                                            <div key={charName} className="flex items-center justify-between gap-6">
                                              <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                <span className="font-semibold text-slate-300">{charName}</span>
                                              </div>
                                              <span className="font-mono font-bold text-slate-200">
                                                {pointsChartMode === 'points' ? `${value} pts` : `第 ${value} 名`}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              };

                              return (
                                <div className="w-full h-72 sm:h-80 bg-slate-950/40 p-2 rounded-xl">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                      data={data}
                                      margin={{ top: 15, right: 25, left: -20, bottom: 5 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" />
                                      <XAxis 
                                        dataKey="name" 
                                        stroke="#64748b" 
                                        fontSize={10} 
                                        tickLine={false}
                                      />
                                      <YAxis
                                        stroke="#64748b"
                                        fontSize={10}
                                        tickLine={false}
                                        domain={pointsChartMode === 'points' ? [0, 'auto'] : [1, 8]}
                                        reversed={pointsChartMode === 'rank'}
                                        tickCount={pointsChartMode === 'points' ? undefined : 8}
                                        allowDecimals={false}
                                      />
                                      <Tooltip content={<CustomTooltip />} />
                                      <Legend 
                                        wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                                        iconSize={8}
                                      />
                                      {pointsTour.participants.map(charIdx => {
                                        const char = CHARACTERS[charIdx];
                                        if (!char) return null;
                                        return (
                                          <Line
                                            key={char.id}
                                            type="monotone"
                                            dataKey={pointsChartMode === 'points' ? `${char.id}_points` : `${char.id}_rank`}
                                            name={char.name}
                                            stroke={char.color}
                                            activeDot={{ r: 5 }}
                                            strokeWidth={2.2}
                                            dot={{ r: 3 }}
                                          />
                                        );
                                      })}
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              );
                            })()}
                          </div>

                        </div>
                      </div>
                    );
                  })()}

                  {/* Tournament Single Elimination Interactive Bracket Layout */}
                  {tournament.isActive && (
                    <div className="w-full bg-slate-900/40 border border-slate-800/80 p-5 rounded-3xl mb-6 shadow-inner relative overflow-hidden">
                      {/* Ambient tournament background flare */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full" />
                      
                      <div className="text-center mb-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-[10px] text-yellow-400 font-black tracking-wider uppercase mb-2 select-none font-sans">
                          🏆 8強淘汰賽星空戰圖
                        </div>
                        <h3 className="text-sm font-black text-slate-200">
                          {tournament.round === 'quarters' && `8強淘汰賽 [第 ${tournament.matchIndex + 1} / 4 組]  •  單場淘汰制 (BO1)`}
                          {tournament.round === 'semis' && `半決賽 [第 ${tournament.matchIndex + 1} / 2 組]  •  單場淘汰制 (BO1)`}
                          {tournament.round === 'finals' && `總決賽  •  單場淘汰制 (BO1)`}
                          {tournament.round === 'complete' && `本屆錦標賽圓滿落幕`}
                        </h3>

                        {/* Interactive Arena Timeline Tracker */}
                        <div className="flex items-center justify-between max-w-sm mx-auto mt-4 px-3 py-2 bg-slate-950/80 rounded-xl border border-slate-900/60 font-mono text-[9px] shadow-sm">
                          <span className="text-slate-500 font-bold tracking-widest uppercase">STAGE PROGRESS:</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 7 }).map((_, stageIdx) => {
                              let currentOverall = 0;
                              if (tournament.round === 'quarters') currentOverall = tournament.matchIndex;
                              else if (tournament.round === 'semis') currentOverall = 4 + tournament.matchIndex;
                              else if (tournament.round === 'finals') currentOverall = 6;
                              else if (tournament.round === 'complete') currentOverall = 7;

                              const isCompleted = stageIdx < currentOverall;
                              const isActive = stageIdx === currentOverall && tournament.round !== 'complete';
                              
                              let label = '';
                              if (stageIdx < 4) label = `Q${stageIdx + 1}`;
                              else if (stageIdx < 6) label = `S${stageIdx - 3}`;
                              else label = 'F';

                              return (
                                <div key={`stage-dot-${stageIdx}`} className="flex items-center gap-1">
                                  <div 
                                    className={`px-1.5 py-0.5 rounded-md font-extrabold select-none transition-all ${
                                      isCompleted 
                                        ? 'bg-emerald-500/15 text-emerald-405 border border-emerald-500/30 font-bold' 
                                        : isActive 
                                          ? 'bg-yellow-500 text-slate-950 border border-yellow-400 font-black animate-pulse scale-105' 
                                          : 'bg-slate-900 text-slate-500 border border-slate-950'
                                    }`}
                                    title={stageIdx < 4 ? `八強對決 #${stageIdx+1}` : stageIdx < 6 ? `四強準決賽 #${stageIdx-3}` : '錦標總決賽'}
                                  >
                                    {label}
                                  </div>
                                  {stageIdx < 6 && <div className={`w-1.5 h-[1.5px] ${isCompleted ? 'bg-emerald-500/40' : 'bg-slate-900'}`} />}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {tournamentCountdown !== null && (
                          <div className="mt-3.5 flex flex-col items-center gap-1.5 max-w-xs mx-auto">
                            <span className="text-[10px] font-bold text-yellow-500 font-mono animate-pulse">
                              ⏳ {tournamentCountdown} 秒後將自動開啟下一輪對決...
                            </span>
                            <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-yellow-500" 
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: tournamentCountdown, ease: 'linear' }}
                                key={`countdown-${tournament.round}-${tournament.matchIndex}-${tournamentCountdown}`}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Tree Structure Columns */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative font-sans text-[11px] text-left">
                        
                        {/* COLUMN 1: Quarters (首輪 8強) */}
                        <div className="flex flex-col gap-3 justify-around">
                          <div className="text-center text-[10px] text-slate-500 font-bold tracking-wider mb-1 uppercase font-mono border-b border-slate-900 pb-1">8強淘汰賽</div>
                          {[0, 1, 2, 3].map(mIdx => {
                            const pair = tournament.quartersMatches[mIdx] || [];
                            const charA = CHARACTERS[pair[0]];
                            const charB = CHARACTERS[pair[1]];
                            const winnerIndex = tournament.winnersQuarters[mIdx];
                            const score = tournament.quartersScores[mIdx] || { p1: 0, p2: 0 };
                            
                            const isCurrent = tournament.round === 'quarters' && tournament.matchIndex === mIdx;
                            
                            return (
                              <div 
                                key={`q-match-${mIdx}`} 
                                className={`p-2 rounded-xl border bg-slate-950/90 flex flex-col gap-1 transition-all ${
                                  isCurrent 
                                    ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.25)] scale-102 bg-yellow-500/5' 
                                    : 'border-slate-900 opacity-80'
                                }`}
                              >
                                <div className="flex items-center justify-between font-mono text-[9px] mb-0.5">
                                  <span className="text-slate-600 font-bold">MATCH {mIdx + 1} (單場淘汰)</span>
                                  <span className="bg-indigo-950 text-indigo-400 font-extrabold px-1 rounded border border-indigo-700/20">
                                    {score.p1} : {score.p2}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {/* Competitor A */}
                                  <div className={`flex items-center gap-1.5 p-1 rounded text-[10px] ${winnerIndex !== undefined && winnerIndex === pair[0] ? 'bg-emerald-500/10 text-emerald-400 font-extrabold' : winnerIndex !== undefined ? 'line-through text-slate-600 opacity-50' : 'text-slate-300'}`}>
                                    <CharacterVectorIcon characterId={charA?.id} className="w-4 h-4 shrink-0" />
                                    <span className="truncate flex-1 font-medium">{charA?.name || '無'}</span>
                                    {winnerIndex !== undefined && winnerIndex === pair[0] && <span className="text-[10px] font-mono font-black text-emerald-400">WIN</span>}
                                  </div>
                                  {/* Competitor B */}
                                  <div className={`flex items-center gap-1.5 p-1 rounded text-[10px] ${winnerIndex !== undefined && winnerIndex === pair[1] ? 'bg-emerald-500/10 text-emerald-400 font-extrabold' : winnerIndex !== undefined ? 'line-through text-slate-600 opacity-50' : 'text-slate-300'}`}>
                                    <CharacterVectorIcon characterId={charB?.id} className="w-4 h-4 shrink-0" />
                                    <span className="truncate flex-1 font-medium">{charB?.name || '無'}</span>
                                    {winnerIndex !== undefined && winnerIndex === pair[1] && <span className="text-[10px] font-mono font-black text-emerald-400">WIN</span>}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* COLUMN 2: Semis (準決賽 4強) */}
                        <div className="flex flex-col gap-3 justify-around">
                          <div className="text-center text-[10px] text-slate-500 font-bold tracking-wider mb-1 uppercase font-mono border-b border-slate-900 pb-1">半決賽</div>
                          {[0, 1].map(mIdx => {
                            const pair = tournament.semisMatches[mIdx] || [];
                            const charA = CHARACTERS[pair[0]];
                            const charB = CHARACTERS[pair[1]];
                            const winnerIndex = tournament.winnersSemis[mIdx];
                            const score = tournament.semisScores[mIdx] || { p1: 0, p2: 0 };
                            
                            const isCurrent = tournament.round === 'semis' && tournament.matchIndex === mIdx;
                            const isLocked = !pair.length;
                            
                            return (
                              <div 
                                key={`s-match-${mIdx}`} 
                                className={`p-2 rounded-xl border bg-slate-950/90 flex flex-col gap-1 transition-all ${
                                  isLocked 
                                    ? 'border-slate-950/10 bg-slate-950/10 opacity-30' 
                                    : isCurrent 
                                      ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.25)] scale-102 bg-yellow-500/5' 
                                      : 'border-slate-900 opacity-85'
                                }`}
                              >
                                <div className="flex items-center justify-between font-mono text-[9px] mb-0.5">
                                  <span className="text-slate-600 font-bold">SEMI {mIdx + 1} (單場淘汰)</span>
                                  {!isLocked && (
                                    <span className="bg-indigo-950 text-indigo-400 font-extrabold px-1 rounded border border-indigo-700/20">
                                      {score.p1} : {score.p2}
                                    </span>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  {/* Competitor A */}
                                  <div className={`flex items-center gap-1.5 p-1 rounded text-[10px] ${winnerIndex !== undefined && winnerIndex === pair[0] ? 'bg-emerald-500/10 text-emerald-400 font-extrabold font-sans' : winnerIndex !== undefined ? 'line-through text-slate-600 opacity-50' : 'text-slate-300'}`}>
                                    {charA ? <CharacterVectorIcon characterId={charA.id} className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4 border border-dashed border-slate-800 rounded-full shrink-0" />}
                                    <span className="truncate flex-1 font-medium">{charA?.name || '等待首輪戰報'}</span>
                                    {winnerIndex !== undefined && winnerIndex === pair[0] && <span className="text-[10px] font-mono font-black text-emerald-410">WIN</span>}
                                  </div>
                                  {/* Competitor B */}
                                  <div className={`flex items-center gap-1.5 p-1 rounded text-[10px] ${winnerIndex !== undefined && winnerIndex === pair[1] ? 'bg-emerald-500/10 text-emerald-400 font-extrabold font-sans' : winnerIndex !== undefined ? 'line-through text-slate-600 opacity-50' : 'text-slate-300'}`}>
                                    {charB ? <CharacterVectorIcon characterId={charB.id} className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4 border border-dashed border-slate-800 rounded-full shrink-0" />}
                                    <span className="truncate flex-1 font-medium">{charB?.name || '等待首輪戰報'}</span>
                                    {winnerIndex !== undefined && winnerIndex === pair[1] && <span className="text-[10px] font-mono font-black text-emerald-410">WIN</span>}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* COLUMN 3: Finals (總決賽) */}
                        <div className="flex flex-col gap-3 justify-around">
                          <div className="text-center text-[10px] text-slate-500 font-bold tracking-wider mb-1 uppercase font-mono border-b border-slate-900 pb-1">總決賽</div>
                          {(() => {
                            const pair = tournament.finalsMatch || [];
                            const charA = CHARACTERS[pair[0]];
                            const charB = CHARACTERS[pair[1]];
                            const champion = tournament.champion;
                            const score = tournament.finalsScore || { p1: 0, p2: 0 };
                            
                            const isCurrent = tournament.round === 'finals';
                            const isLocked = !pair.length;
                            
                            return (
                              <div 
                                className={`p-2.5 rounded-xl border bg-slate-950/90 flex flex-col gap-1.5 transition-all ${
                                  isLocked 
                                    ? 'border-slate-955/10 bg-slate-950/10 opacity-30' 
                                    : isCurrent 
                                      ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.25)] scale-102 bg-yellow-500/5' 
                                      : 'border-slate-900 opacity-90'
                                }`}
                              >
                                <div className="flex items-center justify-between font-mono text-[9px] mb-0.5">
                                  <span className="text-slate-600 font-bold">FINALS (總決賽)</span>
                                  {!isLocked && (
                                    <span className="bg-indigo-950 text-indigo-400 font-extrabold px-1 rounded border border-indigo-700/20">
                                      {score.p1} : {score.p2}
                                    </span>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  {/* Competitor A */}
                                  <div className={`flex items-center gap-1.5 p-1 rounded text-[10px] ${champion !== null && champion === pair[0] ? 'bg-emerald-500/10 text-emerald-400 font-extrabold' : champion !== null ? 'line-through text-slate-600 opacity-50' : 'text-slate-300'}`}>
                                    {charA ? <CharacterVectorIcon characterId={charA.id} className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4 border border-dashed border-slate-800 rounded-full shrink-0" />}
                                    <span className="truncate flex-1 font-medium">{charA?.name || '準決賽勝出'}</span>
                                    {champion !== null && champion === pair[0] && <span className="text-[10px] font-mono font-black text-emerald-400">WIN</span>}
                                  </div>
                                  {/* Competitor B */}
                                  <div className={`flex items-center gap-1.5 p-1 rounded text-[10px] ${champion !== null && champion === pair[1] ? 'bg-emerald-500/10 text-emerald-400 font-extrabold' : champion !== null ? 'line-through text-slate-600 opacity-50' : 'text-slate-300'}`}>
                                    {charB ? <CharacterVectorIcon characterId={charB.id} className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4 border border-dashed border-slate-800 rounded-full shrink-0" />}
                                    <span className="truncate flex-1 font-medium">{charB?.name || '準決賽勝出'}</span>
                                    {champion !== null && champion === pair[1] && <span className="text-[10px] font-mono font-black text-emerald-400">WIN</span>}
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* COLUMN 4: Ultimate Champion (榮耀衛冕總冠軍) */}
                        <div className="flex flex-col gap-3 justify-around items-center">
                          <div className="text-center text-[10px] text-yellow-500 font-bold tracking-wider mb-1 uppercase font-mono border-b border-slate-900 pb-1 w-full">錦標賽霸主</div>
                          {(() => {
                            const champIdx = tournament.round === 'complete' ? tournament.champion : null;
                            const champChar = champIdx !== null ? CHARACTERS[champIdx] : null;
                            
                            return (
                              <div 
                                onClick={() => {
                                  if (champChar) {
                                    audio.playSelect();
                                    setShowCoronation(true);
                                  }
                                }}
                                className={`p-3 rounded-xl border bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center text-center gap-2 transition-all w-full ${
                                champChar 
                                  ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] animate-pulse cursor-pointer hover:border-yellow-400 hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.45)] active:scale-98' 
                                  : 'border-slate-900/60 opacity-40'
                              }`}>
                                {champChar ? (
                                  <>
                                    <div className="relative w-11 h-11 bg-slate-950 border-2 border-yellow-500 rounded-full flex items-center justify-center">
                                      <CharacterVectorIcon characterId={champChar.id} className="w-8 h-8" />
                                      <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-yellow-400 animate-bounce" />
                                    </div>
                                    <div className="leading-tight">
                                      <h4 className="text-xs font-black text-yellow-405">{champChar.name}</h4>
                                      <span className="text-[8px] text-slate-500 leading-normal block italic">{champChar.title}</span>
                                    </div>
                                    <div className="px-2 py-0.5 bg-yellow-500 text-slate-950 text-[8px] font-extrabold rounded uppercase tracking-wider font-mono">
                                      CHAMPION
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-9 h-9 rounded-full border-2 border-dashed border-slate-850 flex items-center justify-center text-slate-700 text-sm">
                                      🏆
                                    </div>
                                    <span className="text-[9px] text-slate-600 font-bold block max-w-16 leading-normal">等待王者登基</span>
                                  </>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                      </div>

                      {tournamentLogs.length > 0 && (
                        <div className="mt-8 p-4 rounded-2xl bg-slate-950/80 border border-slate-900 text-left">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 mb-3">
                            <h3 className="text-xs font-black font-mono text-cyan-450 tracking-wider flex items-center gap-1.5 uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                              🏆 錦標賽對決歷史戰報 (HISTORIC RECORD)
                            </h3>
                            <span className="text-[10px] text-slate-550 font-mono font-bold">已登錄 - {tournamentLogs.length} 場對決</span>
                          </div>
                          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                            {tournamentLogs.map((log) => (
                              <div key={log.id} className="p-2 sm:p-2.5 rounded-lg bg-slate-900/60 border border-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono hover:bg-slate-900 transition-colors">
                                <div className="flex items-center gap-2">
                                  <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold text-[9px] shrink-0 border border-cyan-900/40">
                                    {log.round}
                                  </span>
                                  <span className="text-slate-550 font-bold shrink-0">MATCH #{log.matchNumber}</span>
                                  <span className="text-slate-300 font-extrabold">{log.p1Name}</span>
                                  <span className="text-slate-600">VS</span>
                                  <span className="text-slate-300 font-extrabold">{log.p2Name}</span>
                                </div>
                                <div className="flex items-center gap-2.5 sm:self-end">
                                  <span className="text-[9px] text-slate-500">
                                    傷害: {log.p1Damage.toFixed(0)}p / {log.p2Damage.toFixed(0)}p
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-405 text-[10px] font-black border border-yellow-500/20 shrink-0">
                                    👑 {log.winnerName} 勝出
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* LOL-Style Interactive Tab Filter Selector */}
                  <div className="flex items-center justify-center p-1 bg-slate-950/60 border border-slate-800/80 rounded-2xl gap-1 mb-6 max-w-md w-full mx-auto font-mono text-[11px] font-black">
                    <button
                      onClick={() => { audio.playSelect(); setResultsTab('offense'); }}
                      className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        resultsTab === 'offense' 
                          ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold shadow' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                      }`}
                    >
                      <span>⚔️ 火力輸出</span>
                    </button>
                    <button
                      onClick={() => { audio.playSelect(); setResultsTab('defense'); }}
                      className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        resultsTab === 'defense' 
                          ? 'bg-sky-500/15 border border-sky-500/30 text-sky-400 font-bold shadow' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                      }`}
                    >
                      <span>🛡️ 防禦恢復</span>
                    </button>
                    <button
                      onClick={() => { audio.playSelect(); setResultsTab('honors'); }}
                      className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        resultsTab === 'honors' 
                          ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold shadow' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                      }`}
                    >
                      <span>👑 榮譽勳位</span>
                    </button>
                  </div>

                  {/* LOL-Style Dual Scoreboard Side-by-Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8 text-left">
                    {/* Card 1: Player 1 (Blue Arena Side) */}
                    <div className={`relative rounded-3xl bg-slate-900/75 border-2 backdrop-blur-md p-5 sm:p-6 shadow-2xl flex flex-col justify-between transition-all duration-300 ${
                      winner === 'p1' 
                        ? 'border-sky-500/60 shadow-sky-500/5' 
                        : 'border-slate-850 shadow-black/40'
                    }`}>
                      {/* Victory/Defeat Banner Tag */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none bg-slate-950 border transition-colors" style={{
                        borderColor: winner === 'p1' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(100, 116, 139, 0.3)',
                        color: winner === 'p1' ? '#38bdf8' : '#64748b'
                      }}>
                        {winner === 'p1' ? (
                          <>
                            <Trophy className="w-3 h-3 text-yellow-400 inline animate-bounce" />
                            <span>VICTORY 勝利</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" />
                            <span>DEFEAT 戰敗</span>
                          </>
                        )}
                      </div>

                      {/* Hero details */}
                      <div className="mb-5">
                        <span className="text-[10px] font-mono font-bold text-sky-400 tracking-wider uppercase">P1 BLUE COMMANDER</span>
                        <div className="flex items-center gap-3.5 mt-2">
                          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-slate-800 flex items-center justify-center shadow-inner shrink-0">
                            <CharacterVectorIcon characterId={p1Character.id} className="w-10 h-10" />
                            {winner === 'p1' && (
                              <span className="absolute -top-1.5 -left-1.5 bg-yellow-500 text-slate-950 text-[8px] font-extrabold px-1 py-0.5 rounded shadow uppercase tracking-wide flex items-center justify-center border border-white/25 select-none font-sans">
                                👑 WIN
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-100 tracking-tight flex items-center gap-2">
                              <span>{p1Character.name}</span>
                              <span className="text-[9px] font-bold bg-slate-950/60 text-sky-300 border border-sky-950/80 px-2 py-0.5 rounded shrink-0 leading-normal">
                                {p1Character.role === 'tank' && '堅毅坦克'}
                                {p1Character.role === 'fighter' && '獵魔戰士'}
                                {p1Character.role === 'assassin' && '爆發刺客'}
                                {p1Character.role === 'mage' && '奧術法師'}
                                {p1Character.role === 'shooter' && '遠程射手'}
                                {p1Character.role === 'support' && '命運輔助'}
                              </span>
                            </h3>
                            <p className="text-[11px] font-semibold text-slate-500 italic mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-xs">
                              「{p1Character.title}」
                            </p>
                          </div>
                        </div>

                        {isTwoVsTwoMode && (
                          <div className="flex items-center gap-2 mt-3.5 p-1.5 px-3 rounded-xl bg-slate-950/50 border border-slate-900/80 text-[11px]">
                            <span className="text-slate-500 font-bold shrink-0 text-[10px]">精選盟友：</span>
                            <div className="flex items-center gap-1.5 overflow-hidden font-sans">
                              <CharacterVectorIcon characterId={p1PartnerCharacter.id} className="w-4 h-4 text-sky-400 shrink-0" />
                              <span className="font-extrabold text-slate-300 truncate">{p1PartnerCharacter.name}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Graphical statistics comparison based on active tab selector */}
                      <div className="space-y-4 border-t border-slate-850 pt-4 min-h-[195px] flex flex-col justify-between">
                        <AnimatePresence mode="wait">
                          {resultsTab === 'offense' && (
                            <motion.div
                              key="p1_offense"
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="space-y-4"
                            >
                              {/* Total damage dealt bar */}
                              <div>
                                <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                                  <span className="font-semibold text-slate-300">總輸出傷害額 (Total Dealt)</span>
                                  <span className="font-mono font-bold text-sky-400">{p1Total.toFixed(1)} pt</span>
                                </div>
                                <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900/80">
                                  <div 
                                    className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full transition-all duration-500" 
                                    style={{ width: `${(p1Total / maxDamage) * 100}%` }}
                                  />
                                </div>
                              </div>

                              {/* Segmented ratio bar */}
                              <div className="space-y-2 pt-1 border-t border-dashed border-slate-800/40">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                                  ⚡ 輸出佔比圖 (BASIC vs SKILL RATIO)
                                </span>
                                
                                <div className="relative w-full h-7 rounded-xl bg-slate-950 overflow-hidden border border-slate-850 flex font-mono font-mono">
                                  {p1NormPct > 0 && (
                                    <div 
                                      className="h-full bg-gradient-to-r from-amber-600 to-amber-500 flex items-center pl-3 text-[9px] font-black text-slate-950 transition-all duration-500"
                                      style={{ width: `${p1NormPct}%` }}
                                    >
                                      <span className="truncate">⚔️ 普攻 {p1NormPct}%</span>
                                    </div>
                                  )}
                                  {p1SkillPct > 0 && (
                                    <div 
                                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-end pr-3 text-[9px] font-black text-white transition-all duration-500"
                                      style={{ width: `${p1SkillPct}%` }}
                                    >
                                      <span className="truncate">🔮 技能 {p1SkillPct}%</span>
                                    </div>
                                  )}
                                  {p1NormPct === 0 && p1SkillPct === 0 && (
                                    <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-705 font-black">
                                      NO DAMAGE RECORDED
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-0.5">
                                  <span className="flex items-center gap-1 opacity-90">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                                    <span>撞擊普攻: <strong className="text-slate-200">{p1Norm.toFixed(1)} pt</strong></span>
                                  </span>
                                  <span className="flex items-center gap-1 opacity-90">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
                                    <span>奧術技能: <strong className="text-slate-200">{p1Skill.toFixed(1)} pt</strong></span>
                                  </span>
                                </div>
                              </div>

                              {/* Burst and Critical counts */}
                              <div className="grid grid-cols-2 gap-2 font-mono">
                                <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl flex flex-col justify-center">
                                  <span className="text-[9px] text-slate-500 font-bold uppercase">最高單擊傷害 (PEAK)</span>
                                  <span className="text-amber-400 font-bold text-xs mt-0.5 flex items-center gap-1">
                                    <Swords className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                    <span>{sessionStats.p1MaxSingleHit > 0 ? `${sessionStats.p1MaxSingleHit.toFixed(1)} pt` : '0.0 pt'}</span>
                                  </span>
                                </div>
                                <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl flex flex-col justify-center">
                                  <span className="text-[9px] text-slate-500 font-bold uppercase">致命暴擊次數</span>
                                  <span className="text-rose-450 font-bold text-xs mt-0.5 flex items-center gap-1">
                                    <Zap className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                    <span>{sessionStats.p1CritStrikes || 0} 次</span>
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {resultsTab === 'defense' && (() => {
                            const p1Healing = sessionStats.p1Healing || 0;
                            const p2Healing = sessionStats.p2Healing || 0;
                            const maxHealing = Math.max(p1Healing, p2Healing, 1);

                            const p1Shield = sessionStats.p1ShieldAbsorbed || 0;
                            const p2Shield = sessionStats.p2ShieldAbsorbed || 0;
                            const maxShield = Math.max(p1Shield, p2Shield, 1);

                            return (
                              <motion.div
                                key="p1_defense"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                              >
                                {/* Healing recovery bar */}
                                <div>
                                  <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                                    <span className="font-semibold text-slate-300">防禦治癒修復 (Healing Done)</span>
                                    <span className="font-mono font-bold text-emerald-400">+{p1Healing.toFixed(1)} pt</span>
                                  </div>
                                  <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900/80">
                                    <div 
                                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500" 
                                      style={{ width: `${(p1Healing / maxHealing) * 100}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Shield absorb bar */}
                                <div>
                                  <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                                    <span className="font-semibold text-slate-300">護盾抵消防衛 (Shield Absorbed)</span>
                                    <span className="font-mono font-bold text-sky-405">{p1Shield.toFixed(1)} pt</span>
                                  </div>
                                  <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900/80">
                                    <div 
                                      className="h-full bg-gradient-to-r from-sky-600 to-sky-450 rounded-full transition-all duration-500" 
                                      style={{ width: `${(p1Shield / maxShield) * 100}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Bounces and Dodge maneuvers */}
                                <div className="grid grid-cols-2 gap-2 font-mono">
                                  <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl flex flex-col justify-center">
                                    <span className="text-[9px] text-slate-500 font-bold uppercase">移形閃避技</span>
                                    <span className="text-violet-400 font-bold text-xs mt-0.5 flex items-center gap-1">
                                      <Activity className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                                      <span>{sessionStats.p1DodgeCount || 0} 次</span>
                                    </span>
                                  </div>
                                  <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl flex flex-col justify-center">
                                    <span className="text-[9px] text-slate-500 font-bold uppercase">戰場彈跳數</span>
                                    <span className="text-cyan-405 font-bold text-xs mt-0.5 flex items-center gap-1">
                                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                      <span>{sessionStats.p1Bounces || 0} 次</span>
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })()}

                          {resultsTab === 'honors' && (() => {
                            const accolade = getBattleAccolade(true);
                            return (
                              <motion.div
                                key="p1_honors"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                              >
                                <div className="grid grid-cols-2 gap-2.5 font-mono">
                                  <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl">
                                    <span className="text-[9px] text-slate-500 font-bold uppercase block">奧術施放次數</span>
                                    <span className="text-indigo-400 font-bold text-xs mt-0.5 flex items-center gap-1">
                                      <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                      <span>{sessionStats.p1SkillCasts || 0} 次</span>
                                    </span>
                                  </div>
                                  <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl">
                                    <span className="text-[9px] text-slate-500 font-bold uppercase block">瞬時最高移速</span>
                                    <span className="text-amber-400 font-bold text-xs mt-0.5 flex items-center gap-1">
                                      <TrendingUp className="w-3.5 h-3.5 text-amber-550 shrink-0" />
                                      <span>{(sessionStats.p1MaxSpeed || 0).toFixed(1)} px/s</span>
                                    </span>
                                  </div>
                                </div>

                                {/* Accolade Title Banner */}
                                <div className={`p-3 rounded-2xl border backdrop-blur-sm shadow-sm text-[11px] font-mono ${accolade.border}`}>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-0.5">取得戰後勳稱 (BATTLE ACCOLADE)</span>
                                  <div className="font-extrabold text-xs flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                                    <span>{accolade.title}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-1 font-sans leading-relaxed">{accolade.desc}</p>
                                </div>
                              </motion.div>
                            );
                          })()}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Card 2: Player 2 (Red Arena Side) */}
                    <div className={`relative rounded-3xl bg-slate-900/75 border-2 backdrop-blur-md p-5 sm:p-6 shadow-2xl flex flex-col justify-between transition-all duration-300 ${
                      winner === 'p2' 
                        ? 'border-orange-500/60 shadow-orange-500/5' 
                        : 'border-slate-850 shadow-black/40'
                    }`}>
                      {/* Victory/Defeat Banner Tag */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none bg-slate-950 border transition-colors" style={{
                        borderColor: winner === 'p2' ? 'rgba(249, 115, 22, 0.4)' : 'rgba(100, 116, 139, 0.3)',
                        color: winner === 'p2' ? '#f97316' : '#64748b'
                      }}>
                        {winner === 'p2' ? (
                          <>
                            <Trophy className="w-3 h-3 text-yellow-400 inline animate-bounce" />
                            <span>VICTORY 勝利</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" />
                            <span>DEFEAT 戰敗</span>
                          </>
                        )}
                      </div>

                      {/* Hero details */}
                      <div className="mb-5">
                        <span className="text-[10px] font-mono font-bold text-orange-400 tracking-wider uppercase">P2 RED COMMANDER</span>
                        <div className="flex items-center gap-3.5 mt-2">
                          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-slate-800 flex items-center justify-center shadow-inner shrink-0">
                            <CharacterVectorIcon characterId={p2Character.id} className="w-10 h-10" />
                            {winner === 'p2' && (
                              <span className="absolute -top-1.5 -left-1.5 bg-yellow-500 text-slate-950 text-[8px] font-extrabold px-1 py-0.5 rounded shadow uppercase tracking-wide flex items-center justify-center border border-white/25 select-none font-sans">
                                👑 WIN
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-100 tracking-tight flex items-center gap-2">
                              <span>{p2Character.name}</span>
                              <span className="text-[9px] font-bold bg-slate-950/60 text-orange-300 border border-orange-950/80 px-2 py-0.5 rounded shrink-0 leading-normal">
                                {p2Character.role === 'tank' && '堅毅坦克'}
                                {p2Character.role === 'fighter' && '獵魔戰士'}
                                {p2Character.role === 'assassin' && '爆發刺客'}
                                {p2Character.role === 'mage' && '奧術法師'}
                                {p2Character.role === 'shooter' && '遠程射手'}
                                {p2Character.role === 'support' && '命運輔助'}
                              </span>
                            </h3>
                            <p className="text-[11px] font-semibold text-slate-500 italic mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-xs">
                              「{p2Character.title}」
                            </p>
                          </div>
                        </div>

                        {isTwoVsTwoMode && (
                          <div className="flex items-center gap-2 mt-3.5 p-1.5 px-3 rounded-xl bg-slate-950/50 border border-slate-900/80 text-[11px]">
                            <span className="text-slate-500 font-bold shrink-0 text-[10px]">精選盟友：</span>
                            <div className="flex items-center gap-1.5 overflow-hidden font-sans">
                              <CharacterVectorIcon characterId={p2PartnerCharacter.id} className="w-4 h-4 text-orange-400 shrink-0" />
                              <span className="font-extrabold text-slate-300 truncate">{p2PartnerCharacter.name}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Graphical statistics comparison based on active tab selector */}
                      <div className="space-y-4 border-t border-slate-850 pt-4 min-h-[195px] flex flex-col justify-between">
                        <AnimatePresence mode="wait">
                          {resultsTab === 'offense' && (
                            <motion.div
                              key="p2_offense"
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="space-y-4"
                            >
                              {/* Total damage dealt bar */}
                              <div>
                                <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                                  <span className="font-semibold text-slate-300">總輸出傷害額 (Total Dealt)</span>
                                  <span className="font-mono font-bold text-orange-450">{p2Total.toFixed(1)} pt</span>
                                </div>
                                <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900/80">
                                  <div 
                                    className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-500" 
                                    style={{ width: `${(p2Total / maxDamage) * 100}%` }}
                                  />
                                </div>
                              </div>

                              {/* Segmented ratio bar */}
                              <div className="space-y-2 pt-1 border-t border-dashed border-slate-800/40">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                                  ⚡ 輸出佔比圖 (BASIC vs SKILL RATIO)
                                </span>
                                
                                <div className="relative w-full h-7 rounded-xl bg-slate-950 overflow-hidden border border-slate-850 flex font-mono font-mono">
                                  {p2NormPct > 0 && (
                                    <div 
                                      className="h-full bg-gradient-to-r from-amber-600 to-amber-500 flex items-center pl-3 text-[9px] font-black text-slate-950 transition-all duration-500"
                                      style={{ width: `${p2NormPct}%` }}
                                    >
                                      <span className="truncate">⚔️ 普攻 {p2NormPct}%</span>
                                    </div>
                                  )}
                                  {p2SkillPct > 0 && (
                                    <div 
                                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-end pr-3 text-[9px] font-black text-white transition-all duration-500"
                                      style={{ width: `${p2SkillPct}%` }}
                                    >
                                      <span className="truncate">🔮 技能 {p2SkillPct}%</span>
                                    </div>
                                  )}
                                  {p2NormPct === 0 && p2SkillPct === 0 && (
                                    <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-705 font-black">
                                      NO DAMAGE RECORDED
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-0.5">
                                  <span className="flex items-center gap-1 opacity-90">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                                    <span>撞擊普攻: <strong className="text-slate-200">{p2Norm.toFixed(1)} pt</strong></span>
                                  </span>
                                  <span className="flex items-center gap-1 opacity-90">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
                                    <span>奧術技能: <strong className="text-slate-200">{p2Skill.toFixed(1)} pt</strong></span>
                                  </span>
                                </div>
                              </div>

                              {/* Burst and Critical counts */}
                              <div className="grid grid-cols-2 gap-2 font-mono">
                                <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl flex flex-col justify-center">
                                  <span className="text-[9px] text-slate-500 font-bold uppercase">最高單擊傷害 (PEAK)</span>
                                  <span className="text-amber-400 font-bold text-xs mt-0.5 flex items-center gap-1">
                                    <Swords className="w-3.5 h-3.5 text-amber-550 shrink-0" />
                                    <span>{sessionStats.p2MaxSingleHit > 0 ? `${sessionStats.p2MaxSingleHit.toFixed(1)} pt` : '0.0 pt'}</span>
                                  </span>
                                </div>
                                <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl flex flex-col justify-center">
                                  <span className="text-[9px] text-slate-500 font-bold uppercase">致命暴擊次數</span>
                                  <span className="text-rose-450 font-bold text-xs mt-0.5 flex items-center gap-1">
                                    <Zap className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                    <span>{sessionStats.p2CritStrikes || 0} 次</span>
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {resultsTab === 'defense' && (() => {
                            const p1Healing = sessionStats.p1Healing || 0;
                            const p2Healing = sessionStats.p2Healing || 0;
                            const maxHealing = Math.max(p1Healing, p2Healing, 1);

                            const p1Shield = sessionStats.p1ShieldAbsorbed || 0;
                            const p2Shield = sessionStats.p2ShieldAbsorbed || 0;
                            const maxShield = Math.max(p1Shield, p2Shield, 1);

                            return (
                              <motion.div
                                key="p2_defense"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                              >
                                {/* Healing recovery bar */}
                                <div>
                                  <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                                    <span className="font-semibold text-slate-300">防禦治癒修復 (Healing Done)</span>
                                    <span className="font-mono font-bold text-emerald-400">+{p2Healing.toFixed(1)} pt</span>
                                  </div>
                                  <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900/80">
                                    <div 
                                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500" 
                                      style={{ width: `${(p2Healing / maxHealing) * 100}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Shield absorb bar */}
                                <div>
                                  <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                                    <span className="font-semibold text-slate-300">護盾抵消防衛 (Shield Absorbed)</span>
                                    <span className="font-mono font-bold text-sky-405">{p2Shield.toFixed(1)} pt</span>
                                  </div>
                                  <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900/80">
                                    <div 
                                      className="h-full bg-gradient-to-r from-sky-600 to-sky-450 rounded-full transition-all duration-500" 
                                      style={{ width: `${(p2Shield / maxShield) * 100}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Bounces and Dodge maneuvers */}
                                <div className="grid grid-cols-2 gap-2 font-mono">
                                  <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl flex flex-col justify-center">
                                    <span className="text-[9px] text-slate-500 font-bold uppercase">移形閃避技</span>
                                    <span className="text-violet-400 font-bold text-xs mt-0.5 flex items-center gap-1">
                                      <Activity className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                                      <span>{sessionStats.p2DodgeCount || 0} 次</span>
                                    </span>
                                  </div>
                                  <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl flex flex-col justify-center">
                                    <span className="text-[9px] text-slate-500 font-bold uppercase">戰場彈跳數</span>
                                    <span className="text-cyan-405 font-bold text-xs mt-0.5 flex items-center gap-1">
                                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                      <span>{sessionStats.p2Bounces || 0} 次</span>
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })()}

                          {resultsTab === 'honors' && (() => {
                            const accolade = getBattleAccolade(false);
                            return (
                              <motion.div
                                key="p2_honors"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                              >
                                <div className="grid grid-cols-2 gap-2.5 font-mono">
                                  <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl">
                                    <span className="text-[9px] text-slate-500 font-bold uppercase block">奧術施放次數</span>
                                    <span className="text-indigo-400 font-bold text-xs mt-0.5 flex items-center gap-1">
                                      <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                      <span>{sessionStats.p2SkillCasts || 0} 次</span>
                                    </span>
                                  </div>
                                  <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl">
                                    <span className="text-[9px] text-slate-500 font-bold uppercase block">瞬時最高移速</span>
                                    <span className="text-amber-400 font-bold text-xs mt-0.5 flex items-center gap-1">
                                      <TrendingUp className="w-3.5 h-3.5 text-amber-550 shrink-0" />
                                      <span>{(sessionStats.p2MaxSpeed || 0).toFixed(1)} px/s</span>
                                    </span>
                                  </div>
                                </div>

                                {/* Accolade Title Banner */}
                                <div className={`p-3 rounded-2xl border backdrop-blur-sm shadow-sm text-[11px] font-mono ${accolade.border}`}>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-0.5">取得戰後勳稱 (BATTLE ACCOLADE)</span>
                                  <div className="font-extrabold text-xs flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                                    <span>{accolade.title}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-1 font-sans leading-relaxed">{accolade.desc}</p>
                                </div>
                              </motion.div>
                            );
                          })()}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* CTA action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    {tournamentType === 'points' && pointsTour.isActive ? (
                      pointsTour.currentMatchIndex === 4 ? (
                        <button
                          onClick={() => {
                            audio.playSelect();
                            setPointsTour(prev => ({ ...prev, isActive: false }));
                            setStatus('SELECTING');
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black shadow-lg shadow-yellow-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
                        >
                          <Trophy className="w-4 h-4 animate-bounce" />
                          <span>加冕積分聯賽冠軍！返回重新選角</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setTournamentCountdown(null);
                              handleLaunchNextTournamentMatch();
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-550 text-slate-950 text-xs font-black shadow-lg shadow-yellow-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
                          >
                            <Swords className="w-4 h-4" />
                            <span>立即開啟下一輪對決</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              audio.playSelect();
                              setPointsTour(prev => ({ ...prev, isActive: false }));
                              setStatus('SELECTING');
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Minimize2 className="w-4 h-4" />
                            <span>中途退賽回主菜單</span>
                          </button>
                        </>
                      )
                    ) : tournament.isActive ? (
                      tournament.round === 'complete' ? (
                        <button
                          onClick={() => {
                            audio.playSelect();
                            setTournament(prev => ({ ...prev, isActive: false, round: null }));
                            setStatus('SELECTING');
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-slate-100 text-xs font-black shadow-lg shadow-yellow-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
                        >
                          <Trophy className="w-4 h-4 animate-bounce" />
                          <span>加冕英雄！返回重新選角</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setTournamentCountdown(null);
                              handleLaunchNextTournamentMatch();
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-550 text-slate-950 text-xs font-black shadow-lg shadow-yellow-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
                          >
                            <Swords className="w-4 h-4" />
                            <span>立即開啟下一輪對決</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              audio.playSelect();
                              setTournament(prev => ({ ...prev, isActive: false, round: null }));
                              setStatus('SELECTING');
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Minimize2 className="w-4 h-4" />
                            <span>中途退賽回主菜單</span>
                          </button>
                        </>
                      )
                    ) : (
                      <>
                        <button
                          onClick={handleRestartBattle}
                          id="rematch-confront-btn"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-slate-100 text-xs font-black shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4 animate-spin-slow" />
                          <span>原陣容再戰一回合</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            audio.playSelect();
                            setStatus('SELECTING');
                          }}
                          id="reselect-lobby-btn"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>返回重新選角</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })() as any}
        </AnimatePresence>
      </main>

      {/* Modern Compact Site Footer representing zero telemetry bounds */}
      <footer className="border-t border-slate-950 bg-slate-950 py-5">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600 font-medium font-sans">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>基礎球體對戰競技場</span>
            <span>|</span>
            <span className="text-slate-500">彈性物理、專屬被動奧義</span>
          </div>
          <div>
            100% 瀏覽器本地運作模擬系統 (無伺服器耗損)
          </div>
        </div>
      </footer>

      {/* Handbook overlays */}
      {isHandbookOpen && (
        <Handbook 
          onClose={() => setIsHandbookOpen(false)} 
          inBattle={status === 'BATTLE'}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          battleSpeed={battleSpeed}
          setBattleSpeed={setBattleSpeed}
          onBackToMenu={() => {
            audio.playSelect();
            localStorage.removeItem('sphere_battle_score_p1');
            localStorage.removeItem('sphere_battle_score_p2');
            localStorage.removeItem('sphere_battle_round');
            setStatus('SELECTING');
            setIsHandbookOpen(false);
          }}
        />
      )}

      {/* Champion Coronation Scene Overlay */}
      {showCoronation && getChampionIndex() !== null && (
        <ChampionCoronation
          championIndex={getChampionIndex()!}
          onClose={() => setShowCoronation(false)}
          onRestart={() => {
            audio.playSelect();
            setShowCoronation(false);
            setTournament(prev => ({ ...prev, isActive: false, round: null }));
            setPointsTour(prev => ({ ...prev, isActive: false }));
            setStatus('SELECTING');
          }}
        />
      )}
    </div>
  );
}
