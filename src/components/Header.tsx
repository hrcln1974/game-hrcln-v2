import React from 'react';
import { Gamepad2, Volume2, VolumeX, Star, Coins, Heart } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface HeaderProps {
  currentTab: 'home' | 'games' | 'ranking' | 'profile';
  onTabChange: (tab: 'home' | 'games' | 'ranking' | 'profile') => void;
  starsCount: number;
  coinsCount: number;
  livesCount: number;
  currentPhase: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onStartGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  starsCount,
  coinsCount,
  livesCount,
  currentPhase,
  isMuted,
  onToggleSound,
  onStartGame,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Lockup: HRCLN-GAMES */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-900/40 group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white flex items-center gap-1 font-['Fredoka']">
              HRCLN<span className="text-blue-400">-GAMES</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Jogos que inspiram
            </span>
          </div>
        </div>

        {/* Global Player Counters */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-bold">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-amber-400" />
            <span className="tabular-nums font-mono">{starsCount}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-yellow-400">
            <Coins className="w-4 h-4" />
            <span className="tabular-nums font-mono">{coinsCount}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-rose-400">
            <Heart className="w-4 h-4 fill-rose-500" />
            <span className="tabular-nums font-mono">{livesCount}</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-blue-400 font-semibold px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-800/50">
            Fase {currentPhase}
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 text-sm font-semibold">
          <button
            onClick={() => onTabChange('home')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'home'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => onTabChange('games')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'games'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Jogos
          </button>
          <button
            onClick={() => onTabChange('ranking')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'ranking'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Ranking
          </button>
          <button
            onClick={() => onTabChange('profile')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'profile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Perfil
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            aria-label="Controle de Som"
            title={isMuted ? 'Ativar som' : 'Silenciar som'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
          <button
            onClick={onStartGame}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-xs shadow-md shadow-emerald-900/30 transition-transform active:scale-95"
          >
            Jogar Agora
          </button>
        </div>
      </div>
    </header>
  );
};
