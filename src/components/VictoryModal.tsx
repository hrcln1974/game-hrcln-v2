import React from 'react';
import { Star, Coins, Trophy, Clock, ArrowRight, RotateCcw, Home } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  stageId: number;
  stageTitle: string;
  score: number;
  coins: number;
  stars: number;
  timeSec: number;
  hasNextStage: boolean;
  onNextStage: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  stageId,
  stageTitle,
  score,
  coins,
  stars,
  timeSec,
  hasNextStage,
  onNextStage,
  onReplay,
  onHome,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center gap-5 ring-4 ring-amber-500/20 animate-in fade-in zoom-in-95 duration-200">
        {/* Celebration Trophy Icon */}
        <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-950/50">
          <Trophy className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-widest text-amber-400">
            Fase Concluída com Sucesso!
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-['Fredoka'] mt-1">
            {stageTitle}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Excelente trabalho! Você e sua equipe superaram os desafios deste mundo!
          </p>
        </div>

        {/* Stars Achieved (1 to 3) */}
        <div className="flex items-center justify-center gap-3 py-2">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                starIdx <= stars
                  ? 'bg-amber-500/20 border-amber-400 text-amber-400 scale-110 shadow-lg shadow-amber-950/40'
                  : 'bg-slate-950/50 border-slate-800 text-slate-700'
              }`}
            >
              <Star className={`w-7 h-7 ${starIdx <= stars ? 'fill-amber-400' : ''}`} />
            </div>
          ))}
        </div>

        {/* Breakdown Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-2.5 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 text-xs">
          <div className="flex flex-col items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-yellow-400" /> Moedas
            </span>
            <span className="text-base font-black text-white font-mono mt-1 tabular-nums">
              {coins}
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-slate-800">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Tempo
            </span>
            <span className="text-base font-black text-white font-mono mt-1 tabular-nums">
              {timeSec}s
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Pontos
            </span>
            <span className="text-base font-black text-emerald-400 font-mono mt-1 tabular-nums">
              {score}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 pt-2">
          {hasNextStage ? (
            <button
              onClick={onNextStage}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-black text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transform active:scale-98 transition-transform"
            >
              <span>Próxima Fase</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-900/60 to-yellow-900/60 border border-amber-600 text-amber-200 text-xs font-bold">
              🎉 Parabéns! Você concluiu todas as 5 fases e salvou o reino!
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReplay}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Jogar Novamente</span>
            </button>
            <button
              onClick={onHome}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Menu Principal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
