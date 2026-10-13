import React from 'react';
import { StageInfo } from '../types/game';
import { Lock, Star, Play, Sparkles } from 'lucide-react';

interface StagesGalleryProps {
  stages: StageInfo[];
  selectedStageId: number;
  onSelectStage: (stageId: number) => void;
  onPlayStage: (stageId: number) => void;
}

export const StagesGallery: React.FC<StagesGalleryProps> = ({
  stages,
  selectedStageId,
  onSelectStage,
  onPlayStage,
}) => {
  return (
    <section className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Fredoka']">
            Fases do jogo
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            5 mundos encantados com gráficos temáticos, mecânicas exclusivas e chefão final!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {stages.map((stg) => {
          const isSelected = selectedStageId === stg.id;

          return (
            <div
              key={stg.id}
              onClick={() => { if (stg.unlocked) onSelectStage(stg.id); }}
              className={`group relative p-3 rounded-2xl cursor-pointer transition-all border flex flex-col items-center text-center ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 shadow-xl ring-2 ring-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              } ${!stg.unlocked ? 'opacity-65 cursor-not-allowed' : ''}`}
            >
              {/* Circular Stage Thumbnail matching mockup circular icons */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-slate-700 group-hover:border-amber-400 transition-colors shadow-lg">
                <img
                  src={stg.bgImage}
                  alt={`Cenário de ${stg.title}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Lock Overlay if locked */}
                {!stg.unlocked && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center text-slate-400">
                    <Lock className="w-7 h-7 text-amber-500" />
                  </div>
                )}

                {/* Play Hover Overlay if unlocked */}
                {stg.unlocked && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayStage(stg.id);
                    }}
                    className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* Stage Title */}
              <div className="mt-3 flex flex-col items-center">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  {stg.name}
                </span>
                <h4 className="text-sm font-black text-white font-['Fredoka'] line-clamp-1">
                  {stg.title}
                </h4>
              </div>

              {/* Stars Earned */}
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-3.5 h-3.5 ${
                      starIdx <= stg.starsCollected
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Boss indicator on Stage 5 */}
              {stg.isBossStage && (
                <span className="mt-1 px-2 py-0.5 rounded-full bg-red-950/80 border border-red-800 text-[10px] font-bold text-red-300">
                  Chefe Dragão
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
