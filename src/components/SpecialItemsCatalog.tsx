import React from 'react';
import { Coins, Star, Heart, FlaskConical, PackageOpen } from 'lucide-react';

export const SpecialItemsCatalog: React.FC = () => {
  const items = [
    {
      name: 'Moedas',
      benefit: '+ pontos',
      icon: <Coins className="w-8 h-8 text-yellow-400" />,
      bg: 'bg-yellow-500/10 border-yellow-500/30',
      description: 'Espalhadas por todas as fases. A cada 50 moedas, ganhe 1 vida extra!',
    },
    {
      name: 'Estrelas',
      benefit: '+ vida extra',
      icon: <Star className="w-8 h-8 fill-amber-400 text-amber-400" />,
      bg: 'bg-amber-500/10 border-amber-500/30',
      description: '3 estrelas escondidas em cada fase para os aventureiros mais atentos!',
    },
    {
      name: 'Corações',
      benefit: '+ vidas',
      icon: <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />,
      bg: 'bg-rose-500/10 border-rose-500/30',
      description: 'Recupere a saúde imediatamente para prosseguir na exploração.',
    },
    {
      name: 'Poções',
      benefit: '+ habilidades',
      icon: <FlaskConical className="w-8 h-8 text-cyan-400" />,
      bg: 'bg-cyan-500/10 border-cyan-500/30',
      description: 'Concedem Super Salto, Corrida Supersônica ou Escudo Mágico temporário.',
    },
    {
      name: 'Tesouros',
      benefit: '+ bônus',
      icon: <PackageOpen className="w-8 h-8 text-orange-400" />,
      bg: 'bg-orange-500/10 border-orange-500/30',
      description: 'Baús dourados secretos guardando centenas de pontos e surpresas.',
    },
  ];

  return (
    <section className="w-full flex flex-col gap-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-['Fredoka']">
          Itens Especiais
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Colete power-ups e itens mágicos ao longo de cada jornada para ampliar suas forças.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {items.map((item) => (
          <div
            key={item.name}
            className={`p-4 rounded-2xl border ${item.bg} bg-slate-900/60 flex flex-col items-center text-center hover:scale-103 transition-transform`}
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center shadow-inner mb-3">
              {item.icon}
            </div>

            <h4 className="text-sm font-black text-white font-['Fredoka']">
              {item.name}
            </h4>

            <span className="text-xs font-bold text-amber-300 mt-0.5">
              {item.benefit}
            </span>

            <p className="text-[11px] text-slate-400 mt-2 leading-tight">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
