import React from 'react';
import heroImage from '../assets/images/nena_pepe_hero_1791850063598.jpg';
import { Play, Settings2, Sparkles, Compass, Search, Trophy, ShieldCheck, Users, Gamepad2 } from 'lucide-react';

interface HeroSectionProps {
  onPlay: () => void;
  onOpenControls: () => void;
  onOpenDetails: () => void;
  onSelectOtherGame: (gameTitle: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPlay,
  onOpenControls,
  onOpenDetails,
  onSelectOtherGame,
}) => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
      {/* Background Hero Banner */}
      <div className="relative min-h-[440px] md:min-h-[500px] w-full flex flex-col justify-between p-6 sm:p-10">
        <img
          src={heroImage}
          alt="As Aventuras de Nena e Pepê"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-90 filter"
        />

        {/* Ambient Dark Gradient Scrim for perfect text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/70" />

        {/* Top Badges & Pills */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Lançamento Oficial HRCLN Games</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-900/80 backdrop-blur-md border border-blue-700 text-xs font-semibold text-blue-200">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              5 Fases
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-900/80 backdrop-blur-md border border-indigo-700 text-xs font-semibold text-indigo-200">
              <Gamepad2 className="w-3.5 h-3.5" />
              Aventura de plataforma
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-900/80 backdrop-blur-md border border-emerald-700 text-xs font-semibold text-emerald-200">
              <Users className="w-3.5 h-3.5" />
              Família
            </span>
          </div>
        </div>

        {/* Center / Bottom Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mt-12 sm:mt-20">
          <div className="lg:col-span-8 flex flex-col items-start gap-3">
            {/* Exploration tags on left */}
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-1 rounded-md bg-amber-800/80 border border-amber-600/60 text-amber-200 text-[11px] font-black uppercase tracking-wider">
                Explorar
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-800/80 border border-amber-600/60 text-amber-200 text-[11px] font-black uppercase tracking-wider">
                Descobrir
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-800/80 border border-amber-600/60 text-amber-200 text-[11px] font-black uppercase tracking-wider">
                Vencer
              </span>
            </div>

            {/* Main Game Title matching mockup logo */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-['Fredoka'] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
              As Aventuras de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400">Nena e Pepê</span>
            </h1>

            <div className="px-4 py-1.5 rounded-xl bg-blue-950/80 border border-blue-700/80 text-blue-200 font-black text-xs sm:text-sm tracking-wide shadow-md">
              JOGO DE PLATAFORMA • 5 FASES • MUITA DIVERSÃO
            </div>

            <p className="text-sm sm:text-base text-slate-200 max-w-xl font-medium leading-relaxed drop-shadow-md">
              Uma jornada cheia de desafios, magia e muitas surpresas. Ao lado do cãozinho Bidu, explore bosques misteriosos, ilhas flutuantes e vença o Dragão das Sombras!
            </p>

            <p className="italic text-amber-300/90 text-xs sm:text-sm font-semibold">
              &quot;Juntos, eles vão viver uma grande aventura!&quot;
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onPlay}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 text-white font-black text-base shadow-xl shadow-emerald-950/60 flex items-center gap-2.5 transform hover:scale-105 active:scale-95 transition-all border border-emerald-300/40"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                </div>
                <span>JOGAR AGORA</span>
              </button>

              <button
                onClick={onOpenControls}
                className="px-6 py-3.5 rounded-2xl bg-blue-600/90 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-950/40 flex items-center gap-2 border border-blue-400/40 hover:scale-102 transition-transform"
              >
                <Settings2 className="w-4 h-4" />
                <span>CONTROLES</span>
              </button>

              <button
                onClick={onOpenDetails}
                className="px-5 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-colors"
              >
                DETALHES
              </button>
            </div>
          </div>

          {/* Quick Launcher Card Strip (Outros Jogos from top-right) */}
          <div className="lg:col-span-4 bg-slate-950/85 backdrop-blur-md rounded-2xl p-4 border border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Biblioteca HRCLN-GAMES</span>
              <span className="text-[10px] text-blue-400 font-semibold">4 Jogos</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative p-2 rounded-xl bg-slate-900 border border-amber-500/50 flex flex-col gap-1 cursor-pointer hover:bg-slate-800/80 transition-colors">
                <span className="absolute -top-2 right-2 px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full uppercase">
                  Destaque
                </span>
                <span className="text-xs font-bold text-white mt-1">Nena e Pepê</span>
                <span className="text-[10px] text-slate-400">Aventura 2D/3D</span>
              </div>

              <div
                onClick={() => onSelectOtherGame('Mundo dos Dinossauros')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1 cursor-pointer hover:bg-slate-800 transition-colors group"
              >
                <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">Dinossauros</span>
                <span className="text-[10px] text-slate-400">Exploração Jurássica</span>
              </div>

              <div
                onClick={() => onSelectOtherGame('Corrida Espacial')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1 cursor-pointer hover:bg-slate-800 transition-colors group"
              >
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-400">Corrida Espacial</span>
                <span className="text-[10px] text-slate-400">Naves & Galáxias</span>
              </div>

              <div
                onClick={() => onSelectOtherGame('Puzzle Kids')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1 cursor-pointer hover:bg-slate-800 transition-colors group"
              >
                <span className="text-xs font-bold text-slate-200 group-hover:text-pink-400">Puzzle Kids</span>
                <span className="text-[10px] text-slate-400">Lógica e Desafios</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
