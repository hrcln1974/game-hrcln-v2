import React from 'react';
import { CharacterId } from '../types/game';
import { CHARACTERS } from '../game/characters';
import { Check, Sparkles, Zap, Heart, Shield, Award } from 'lucide-react';

interface CharacterShowcaseProps {
  selectedCharacter: CharacterId;
  onSelectCharacter: (id: CharacterId) => void;
}

export const CharacterShowcase: React.FC<CharacterShowcaseProps> = ({
  selectedCharacter,
  onSelectCharacter,
}) => {
  return (
    <section className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Fredoka']">
            Conheça os personagens
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Escolha seu protagonista favorito ou jogue com a equipe completa com o cãozinho Bidu!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Nena */}
        <div
          onClick={() => onSelectCharacter('nena')}
          className={`relative p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
            selectedCharacter === 'nena'
              ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/50 ring-2 ring-rose-500/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          {selectedCharacter === 'nena' && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase flex items-center gap-1">
              <Check className="w-3 h-3" /> Selecionada
            </div>
          )}

          <div className="flex items-start gap-4">
            {/* Visual avatar circle with Nena styling */}
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md overflow-hidden shrink-0 border-2 border-rose-300/40">
              <div className="flex flex-col items-center">
                {/* Stylized face illustration */}
                <span className="text-3xl">👧🏽</span>
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-lg font-black text-white font-['Fredoka'] flex items-center gap-2">
                Nena
              </h3>
              <span className="text-xs font-semibold text-rose-400">A Exploradora Ágil</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Corajosa, inteligente e ágil. Sempre pronta para novas descobertas!
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Habilidade Especial:</span>
              <span className="text-rose-300 font-bold">Pulo Duplo Ágil</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: '95%' }} />
            </div>
          </div>
        </div>

        {/* Pepê */}
        <div
          onClick={() => onSelectCharacter('pepe')}
          className={`relative p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
            selectedCharacter === 'pepe'
              ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-950/50 ring-2 ring-blue-500/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          {selectedCharacter === 'pepe' && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase flex items-center gap-1">
              <Check className="w-3 h-3" /> Selecionado
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md overflow-hidden shrink-0 border-2 border-blue-300/40">
              <span className="text-3xl">👦🏽</span>
            </div>

            <div className="flex flex-col">
              <h3 className="text-lg font-black text-white font-['Fredoka']">
                Pepê
              </h3>
              <span className="text-xs font-semibold text-blue-400">O Aventureiro Destemido</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Divertido, destemido e cheio de energia. Topa qualquer desafio!
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Habilidade Especial:</span>
              <span className="text-blue-300 font-bold">Super Salto & Força</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '92%' }} />
            </div>
          </div>
        </div>

        {/* Bidu (Companheiro Fiel & Equipe Dupla) */}
        <div
          onClick={() => onSelectCharacter('duo')}
          className={`relative p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
            selectedCharacter === 'duo'
              ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/50 ring-2 ring-amber-500/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          {selectedCharacter === 'duo' && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase flex items-center gap-1">
              <Check className="w-3 h-3" /> Selecionado
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md overflow-hidden shrink-0 border-2 border-amber-300/40">
              <span className="text-3xl">🐶</span>
            </div>

            <div className="flex flex-col">
              <h3 className="text-lg font-black text-white font-['Fredoka']">
                Bidu & Dupla
              </h3>
              <span className="text-xs font-semibold text-amber-400">Companheiro Fiel</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Nosso companheiro fiel. Encontra segredos e ajuda nas missões!
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Habilidade Especial:</span>
              <span className="text-amber-300 font-bold">Farejar & Latido Protetor</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '98%' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
