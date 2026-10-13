import React, { useState } from 'react';
import { HighScoreRecord } from '../types/game';
import { Trophy, Star, Coins, Medal, Calendar, User, X } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  scores: HighScoreRecord[];
  onAddScore: (name: string) => void;
  pendingScore?: { score: number; stageId: number; stars: number; coins: number } | null;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  scores,
  onAddScore,
  pendingScore,
}) => {
  const [playerNameInput, setPlayerNameInput] = useState('');

  if (!isOpen) return null;

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerNameInput.trim()) {
      onAddScore(playerNameInput.trim());
      setPlayerNameInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white font-['Fredoka']">
              Ranking & Conquistas
            </h3>
            <p className="text-xs text-slate-400">
              Os melhores exploradores de Nena e Pepê no HRCLN-GAMES!
            </p>
          </div>
        </div>

        {/* Input form if player just finished a run */}
        {pendingScore && (
          <form
            onSubmit={handleSubmitScore}
            className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/50 flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="flex-1 text-xs">
              <span className="font-bold text-emerald-400">Novo Recorde Registrado!</span>
              <p className="text-slate-300">
                Pontuação: <b className="text-white">{pendingScore.score}</b> · Estrelas:{' '}
                <b className="text-amber-400">{pendingScore.stars}</b>
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Seu nome..."
                maxLength={18}
                value={playerNameInput}
                onChange={(e) => setPlayerNameInput(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 flex-1 sm:w-36"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap"
              >
                Salvar
              </button>
            </div>
          </form>
        )}

        {/* Leaderboard Table */}
        <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60 uppercase font-black tracking-wider text-[10px]">
                <th className="py-3 px-4">Posição</th>
                <th className="py-3 px-4">Jogador</th>
                <th className="py-3 px-4">Fase</th>
                <th className="py-3 px-4 text-center">⭐</th>
                <th className="py-3 px-4 text-center">🪙</th>
                <th className="py-3 px-4 text-right">Pontos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {scores.map((rec, index) => (
                <tr key={rec.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold font-mono">
                    {index === 0 && <span className="text-amber-400">🥇 1º</span>}
                    {index === 1 && <span className="text-slate-300">🥈 2º</span>}
                    {index === 2 && <span className="text-amber-600">🥉 3º</span>}
                    {index > 2 && <span className="text-slate-500">{index + 1}º</span>}
                  </td>
                  <td className="py-3 px-4 font-bold flex items-center gap-2">
                    <span>{rec.playerName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 capitalize">
                      {rec.character}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{rec.stageName}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-amber-400">
                    {rec.stars}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-yellow-400">
                    {rec.coins}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 tabular-nums">
                    {rec.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>* Recordes salvos localmente no seu navegador.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
