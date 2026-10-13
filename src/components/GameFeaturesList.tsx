import React from 'react';
import {
  Layers,
  Award,
  Heart,
  KeyRound,
  Flag,
  Music,
  Smartphone,
  Sparkles,
} from 'lucide-react';

export const GameFeaturesList: React.FC = () => {
  const features = [
    { icon: <Layers className="w-4 h-4 text-blue-400" />, text: '5 fases emocionantes' },
    { icon: <Award className="w-4 h-4 text-yellow-400" />, text: 'Sistema de pontuação e recordes' },
    { icon: <Heart className="w-4 h-4 text-red-400" />, text: 'Vidas e corações recuperáveis' },
    { icon: <KeyRound className="w-4 h-4 text-amber-400" />, text: 'Itens, baús e segredos ocultos' },
    { icon: <Flag className="w-4 h-4 text-emerald-400" />, text: 'Checkpoints com bandeiras salvas' },
    { icon: <Music className="w-4 h-4 text-purple-400" />, text: 'Sons e músicas originais sintetizados' },
    { icon: <Smartphone className="w-4 h-4 text-cyan-400" />, text: 'Compatível com celular e computador' },
  ];

  return (
    <section className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
      <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>Recursos do Jogo</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-semibold text-slate-200"
          >
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
              {feat.icon}
            </div>
            <span>{feat.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
