import React from 'react';
import { X, Keyboard, Smartphone, Sparkles, ArrowRight } from 'lucide-react';

interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
            <Keyboard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white font-['Fredoka']">
              Como Jogar & Controles
            </h3>
            <p className="text-xs text-slate-400">
              Jogue confortavelmente no teclado do computador ou com os botões de toque na tela do celular!
            </p>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Keyboard className="w-4 h-4" />
            <span>Teclado (Computador)</span>
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">Andar para Esquerda / Direita</span>
              <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 font-mono text-white font-bold">
                ← → ou A / D
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">Pular / Pulo Duplo</span>
              <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 font-mono text-white font-bold">
                Espaço ou ↑ / W
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">Latido do Bidu / Farejar</span>
              <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 font-mono text-purple-300 font-bold">
                Z ou Enter / J
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">Pausar Jogo</span>
              <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 font-mono text-white font-bold">
                P ou Esc
              </span>
            </div>
          </div>
        </div>

        {/* Mobile / Touch Controls */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4" />
            <span>Celular / Telas Sensíveis ao Toque</span>
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            Botões virtuais aparecem automaticamente abaixo do jogo: <b>Setas direcionais</b> à esquerda, botão verde <b>PULAR</b> à direita e botão roxo <b>BIDU</b> para acionar o latido especial.
          </p>
        </div>

        {/* Pro Tips */}
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <b>Dica de Ouro:</b> Pule em cima dos slimes e inimigos para eliminá-los e ganhar um impulso no ar! Chame o cãozinho Bidu perto de moedas para atraí-las.
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              onClose();
              onStartGame();
            }}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-2"
          >
            <span>Iniciar Aventura</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
