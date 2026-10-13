/**
 * As Aventuras de Nena e Pepê - HRCLN Games
 * Jogo oficial de plataforma e aventura
 */

import React, { useState, useEffect } from 'react';
import { CharacterId, HighScoreRecord, StageInfo } from './types/game';
import { STAGES_METADATA } from './game/levels';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CharacterShowcase } from './components/CharacterShowcase';
import { StagesGallery } from './components/StagesGallery';
import { SpecialItemsCatalog } from './components/SpecialItemsCatalog';
import { GameFeaturesList } from './components/GameFeaturesList';
import { PlatformerCanvas } from './game/PlatformerCanvas';
import { ControlsModal } from './components/ControlsModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { OtherGamesModal } from './components/OtherGamesModal';
import { soundManager } from './audio/soundManager';
import { Gamepad2, Star, Sparkles, Trophy, Heart, ArrowRight, Play } from 'lucide-react';

const INITIAL_SCORES: HighScoreRecord[] = [];

export default function App() {
  // App views: 'HUB' or 'PLAYING'
  const [viewMode, setViewMode] = useState<'HUB' | 'PLAYING'>('HUB');
  const [currentTab, setCurrentTab] = useState<'home' | 'games' | 'ranking' | 'profile'>('home');

  // Player Selection & Progress
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>('nena');
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [stages, setStages] = useState<StageInfo[]>(() => {
    const saved = localStorage.getItem('hrcln_stages_progress');
    if (saved) {
      try {
        // Only restore progress fields; assets/metadata always come from the current build
        const parsed = JSON.parse(saved) as Partial<StageInfo>[];
        return STAGES_METADATA.map((meta) => {
          const old = parsed.find((p) => p.id === meta.id);
          return old
            ? {
                ...meta,
                unlocked: meta.unlocked || !!old.unlocked,
                starsCollected: old.starsCollected ?? 0,
                bestScore: old.bestScore ?? 0,
              }
            : meta;
        });
      } catch {
        // fallback
      }
    }
    return STAGES_METADATA;
  });

  // Global Player stats
  const [totalCoins, setTotalCoins] = useState<number>(() => {
    return parseInt(localStorage.getItem('hrcln_coins') || '0', 10);
  });
  const [totalStars, setTotalStars] = useState<number>(() => {
    return stages.reduce((acc, s) => acc + s.starsCollected, 0);
  });
  const [lives, setLives] = useState<number>(3);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  // High Scores
  const [leaderboard, setLeaderboard] = useState<HighScoreRecord[]>(() => {
    const saved = localStorage.getItem('hrcln_leaderboard');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_SCORES;
  });

  // Modals
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [otherGameModal, setOtherGameModal] = useState<string | null>(null);

  // Victory / Game Over states
  const [victoryData, setVictoryData] = useState<{
    isOpen: boolean;
    stageId: number;
    stageTitle: string;
    score: number;
    coins: number;
    stars: number;
    timeSec: number;
  }>({
    isOpen: false,
    stageId: 1,
    stageTitle: '',
    score: 0,
    coins: 0,
    stars: 0,
    timeSec: 0,
  });

  const [gameOverData, setGameOverData] = useState({
    isOpen: false,
  });

  const [pendingScore, setPendingScore] = useState<{
    score: number;
    stageId: number;
    stars: number;
    coins: number;
  } | null>(null);

  // Save progress to local storage
  useEffect(() => {
    localStorage.setItem('hrcln_stages_progress', JSON.stringify(stages));
    setTotalStars(stages.reduce((acc, s) => acc + s.starsCollected, 0));
  }, [stages]);

  useEffect(() => {
    localStorage.setItem('hrcln_coins', totalCoins.toString());
  }, [totalCoins]);

  useEffect(() => {
    localStorage.setItem('hrcln_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  const handleStartGame = (stageId = activeStageId) => {
    const stage = stages.find((item) => item.id === stageId);
    if (!stage?.unlocked) {
      setActiveStageId(stages.find((item) => item.unlocked)?.id ?? 1);
      return;
    }
    setActiveStageId(stageId);
    setViewMode('PLAYING');
    setVictoryData((prev) => ({ ...prev, isOpen: false }));
    setGameOverData({ isOpen: false });
  };

  const handleStageClear = (data: { score: number; coins: number; stars: number; timeSec: number }) => {
    const curStage = stages.find((s) => s.id === activeStageId) || stages[0];

    // Unlock next stage & update stars
    setStages((prev) =>
      prev.map((s) => {
        if (s.id === activeStageId) {
          return {
            ...s,
            starsCollected: Math.max(s.starsCollected, data.stars),
            bestScore: Math.max(s.bestScore, data.score),
          };
        }
        if (s.id === activeStageId + 1) {
          return {
            ...s,
            unlocked: true,
          };
        }
        return s;
      })
    );

    setTotalCoins((prev) => prev + data.coins);
    setPendingScore({
      score: data.score,
      stageId: activeStageId,
      stars: data.stars,
      coins: data.coins,
    });

    setVictoryData({
      isOpen: true,
      stageId: activeStageId,
      stageTitle: curStage.title,
      score: data.score,
      coins: data.coins,
      stars: data.stars,
      timeSec: data.timeSec,
    });
  };

  const handleGameOver = () => {
    setGameOverData({ isOpen: true });
  };

  const handleNextStage = () => {
    setVictoryData((prev) => ({ ...prev, isOpen: false }));
    if (activeStageId < 5) {
      handleStartGame(activeStageId + 1);
    } else {
      setViewMode('HUB');
    }
  };

  const handleAddHighScore = (playerName: string) => {
    if (!pendingScore) return;
    const curStage = stages.find((s) => s.id === pendingScore.stageId);
    const newRecord: HighScoreRecord = {
      id: Date.now().toString(),
      playerName,
      character: selectedCharacter,
      stageName: curStage?.title || `Fase ${pendingScore.stageId}`,
      stageId: pendingScore.stageId,
      score: pendingScore.score,
      coins: pendingScore.coins,
      stars: pendingScore.stars,
      date: 'Agora',
    };

    setLeaderboard((prev) => [newRecord, ...prev].sort((a, b) => b.score - a.score).slice(0, 15));
    setPendingScore(null);
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab === 'ranking') {
            setIsLeaderboardOpen(true);
          } else if (tab === 'games') {
            setViewMode('HUB');
          }
        }}
        starsCount={totalStars}
        coinsCount={totalCoins}
        livesCount={lives}
        currentPhase={activeStageId}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        onStartGame={() => handleStartGame(activeStageId)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8">
        {/* Active Game View */}
        {viewMode === 'PLAYING' ? (
          <div className="w-full flex flex-col gap-4">
            <PlatformerCanvas
              stageId={activeStageId}
              characterId={selectedCharacter}
              bgImageUrl={stages.find((s) => s.id === activeStageId)?.bgImage}
              onExit={() => {
                setViewMode('HUB');
                soundManager.stopMusic();
              }}
              onStageClear={handleStageClear}
              onGameOver={handleGameOver}
            />

            {/* Quick in-game helper footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Personagem Atual:</span>
                <span className="text-amber-400 font-semibold capitalize">
                  {selectedCharacter === 'nena' ? 'Nena' : selectedCharacter === 'pepe' ? 'Pepê' : 'Nena, Pepê & Bidu'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span>Dica: Pressione <b>P</b> para pausar a qualquer momento.</span>
                <button
                  onClick={() => setIsControlsOpen(true)}
                  className="text-blue-400 hover:text-blue-300 underline font-semibold"
                >
                  Ver todos os comandos
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Hub / Main Menu View */
          <>
            {/* Hero Banner Showcase */}
            <HeroSection
              onPlay={() => handleStartGame(activeStageId)}
              onOpenControls={() => setIsControlsOpen(true)}
              onOpenDetails={() => {
                const el = document.getElementById('personagens-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectOtherGame={(title) => setOtherGameModal(title)}
            />

            {/* Character Selection */}
            <div id="personagens-section">
              <CharacterShowcase
                selectedCharacter={selectedCharacter}
                onSelectCharacter={(char) => setSelectedCharacter(char)}
              />
            </div>

            {/* 5 Stages Selection */}
            <div>
              <StagesGallery
                stages={stages}
                selectedStageId={activeStageId}
                onSelectStage={(id) => setActiveStageId(id)}
                onPlayStage={(id) => handleStartGame(id)}
              />
            </div>

            {/* Special Items Catalog */}
            <div>
              <SpecialItemsCatalog />
            </div>

            {/* Game Features Checklist */}
            <div>
              <GameFeaturesList />
            </div>
          </>
        )}
      </main>

      {/* Footer matching inspirational footer quote in mockup */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-['Fredoka'] text-sm text-white">
            <Gamepad2 className="w-4 h-4 text-blue-500" />
            <span>HRCLN-GAMES</span>
            <span className="text-slate-600 font-sans">·</span>
            <span className="text-xs text-slate-400 font-sans">Jogos que inspiram</span>
          </div>

          <p className="italic text-slate-300 font-medium text-center">
            &quot;Grandes aventuras começam com pequenas escolhas...&quot;
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleStartGame(1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600/30 transition-colors font-semibold"
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Jogue agora e faça parte dessa aventura!</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <ControlsModal
        isOpen={isControlsOpen}
        onClose={() => setIsControlsOpen(false)}
        onStartGame={() => handleStartGame(activeStageId)}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        scores={leaderboard}
        onAddScore={handleAddHighScore}
        pendingScore={pendingScore}
      />

      <OtherGamesModal
        isOpen={Boolean(otherGameModal)}
        onClose={() => setOtherGameModal(null)}
        selectedTitle={otherGameModal || ''}
        onPlayNena={() => handleStartGame(activeStageId)}
      />

      <VictoryModal
        isOpen={victoryData.isOpen}
        stageId={victoryData.stageId}
        stageTitle={victoryData.stageTitle}
        score={victoryData.score}
        coins={victoryData.coins}
        stars={victoryData.stars}
        timeSec={victoryData.timeSec}
        hasNextStage={activeStageId < 5}
        onNextStage={handleNextStage}
        onReplay={() => handleStartGame(activeStageId)}
        onHome={() => {
          setVictoryData((prev) => ({ ...prev, isOpen: false }));
          setViewMode('HUB');
        }}
      />

      <GameOverModal
        isOpen={gameOverData.isOpen}
        onRetry={() => {
          setGameOverData({ isOpen: false });
          handleStartGame(activeStageId);
        }}
        onHome={() => {
          setGameOverData({ isOpen: false });
          setViewMode('HUB');
        }}
      />
    </div>
  );
}
