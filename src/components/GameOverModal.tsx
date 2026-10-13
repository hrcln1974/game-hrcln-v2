import React from 'react';
import { Skull, RotateCcw, Home, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  onRetry: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onRetry,
  onHome,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-sm bg-slate-900 border border-rose-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center gap-5 ring-4 ring-rose-950/30 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-rose-950/60 border border-rose-800 flex items-center justify-center text-rose-400 shadow-xl">
          <Skull className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-2xl font-black text-white font-['Fredoka']">
            Fim de Jogo!
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Não desista! Toda grande jornada tem seus obstáculos. Tente novamente a partir do último checkpoint!
          </p>
        </div>

        <div className="w-full flex flex-col gap-2.5 pt-2">
          <button
            onClick={onRetry}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-black text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transform active:scale-98 transition-transform"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tentar Novamente</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Voltar ao Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
