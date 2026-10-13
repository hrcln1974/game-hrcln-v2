import React from 'react';
import { X, Play, Sparkles, Gamepad2, ArrowRight } from 'lucide-react';

interface OtherGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTitle: string;
  onPlayNena: () => void;
}

export const OtherGamesModal: React.FC<OtherGamesModalProps> = ({
  isOpen,
  onClose,
  selectedTitle,
  onPlayNena,
}) => {
  if (!isOpen) return null;

  const gamesData: Record<string, { desc: string; genre: string; emoji: string; status: string; features: string[] }> = {
    'Mundo dos Dinossauros': {
      desc: 'Embarque em uma incrível jornada jurássica! Explore florestas primitivas, desvie de T-Rex e faça amizade com Tricerátopos herbívoros.',
      genre: 'Aventura 3D & Sobrevivência Leve',
      emoji: '🦖',
      status: 'Em Produção · Breve na HRCLN-GAMES',
      features: ['Mais de 12 espécies de dinossauros', 'Modo fóssil e escavação', 'Puzzles com pegadas ancestrais'],
    },
    'Corrida Espacial': {
      desc: 'Pilote naves supersônicas através de cinturões de asteroides, portais de hiperespaço e anéis planetários em alta velocidade!',
      genre: 'Corrida Futurista & Ação Cósmica',
      emoji: '🚀',
      status: 'Em Produção · Breve na HRCLN-GAMES',
      features: ['Circuitos interestelares', 'Upgrades de turbinas e propulsores', 'Trilha sonora synthwave'],
    },
    'Puzzle Kids': {
      desc: 'Desafios relaxantes e inteligentes com blocos coloridos, labirintos lógicos e quebra-cabeças pensados para toda a família.',
      genre: 'Raciocínio & Quebra-Cabeça Educativo',
      emoji: '🧩',
      status: 'Em Produção · Breve na HRCLN-GAMES',
      features: ['100+ desafios graduais', 'Desenvolvimento de lógica espacial', 'Músicas relaxantes'],
    },
  };

  const game = gamesData[selectedTitle] || gamesData['Mundo dos Dinossauros'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-4xl shadow-inner">
            {game.emoji}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
              {game.genre}
            </span>
            <h3 className="text-2xl font-black text-white font-['Fredoka']">
              {selectedTitle}
            </h3>
            <span className="text-xs font-semibold text-amber-400">
              {game.status}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          {game.desc}
        </p>

        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Destaques do Jogo:
          </h4>
          <div className="space-y-1.5">
            {game.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 flex items-center justify-between">
          <span>O jogo principal <b>As Aventuras de Nena e Pepê</b> já está 100% disponível para jogar!</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            Voltar
          </button>
          <button
            onClick={() => {
              onClose();
              onPlayNena();
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Jogar Nena e Pepê</span>
          </button>
        </div>
      </div>
    </div>
  );
};
