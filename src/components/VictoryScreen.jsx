import React, { useEffect, useState } from 'react';
import { Trophy, Star, Award, Medal, RotateCcw, Sparkles, ListOrdered } from 'lucide-react';

const VictoryScreen = ({ players, onRestart }) => {
  const [highScores, setHighScores] = useState([]);

  // Calculate trophy and standing
  const getTrophyDetails = (score) => {
    if (score >= 450) {
      return {
        name: 'Troféu Ouro Cinco Estrelas ⭐🏆',
        color: 'text-yellow-300',
        bgColor: 'bg-yellow-500',
        badge: '🏆',
      };
    } else if (score >= 300) {
      return {
        name: 'Troféu Ouro 🥇',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-600',
        badge: '🥇',
      };
    } else if (score >= 180) {
      return {
        name: 'Troféu Prata 🥈',
        color: 'text-slate-300',
        bgColor: 'bg-slate-500',
        badge: '🥈',
      };
    } else {
      return {
        name: 'Troféu Bronze 🥉',
        color: 'text-amber-600',
        bgColor: 'bg-amber-700',
        badge: '🥉',
      };
    }
  };

  // Sort players by score descending to find the winner
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  useEffect(() => {
    // Load and update high scores in local storage
    const stored = JSON.parse(localStorage.getItem('campori_high_scores') || '[]');
    
    // Add current game's scores to the history pool
    const newEntries = players.map(p => ({
      name: p.name,
      club: p.club,
      score: p.score,
      date: new Date().toLocaleDateString('pt-BR'),
    }));

    const combined = [...stored, ...newEntries];
    // Sort and keep top 5
    combined.sort((a, b) => b.score - a.score);
    const topFive = combined.slice(0, 5);

    localStorage.setItem('campori_high_scores', JSON.stringify(topFive));
    setHighScores(topFive);
  }, [players]);

  const winnerTrophy = getTrophyDetails(winner.score);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full p-4 bg-desbrava-blue relative overflow-y-auto pb-12">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
         <div className="absolute top-10 left-10 text-yellow-300 animate-pulse"><Star size={40} /></div>
         <div className="absolute bottom-20 right-20 text-yellow-300 animate-pulse delay-100"><Star size={60} /></div>
         <div className="absolute top-40 right-10 text-yellow-300 animate-pulse delay-300"><Star size={30} /></div>
      </div>

      <div className="z-10 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 flex flex-col items-center text-center mt-4">
        
        <div className="flex items-center gap-1.5 text-desbrava-yellow mb-2 animate-bounce">
          <Sparkles size={20} />
          <h1 className="text-3xl font-black uppercase tracking-widest text-desbrava-blue">Vitória!</h1>
          <Sparkles size={20} />
        </div>
        <p className="text-desbrava-brown text-sm mb-6 font-extrabold uppercase tracking-wider">Acampamento Concluído</p>

        {/* Winner Spotlight */}
        <div className="w-full bg-desbrava-green/10 border-2 border-desbrava-yellow rounded-2xl p-4 mb-6 flex flex-col items-center shadow-inner relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-desbrava-yellow/10 rounded-full blur-xl pointer-events-none" />
          <div className={`p-4 rounded-full ${winnerTrophy.bgColor} shadow-lg mb-3`}>
            <Trophy size={40} className="text-white" />
          </div>
          <span className="text-[10px] font-black uppercase bg-desbrava-yellow text-desbrava-blue px-2 py-0.5 rounded-full mb-1">
            Grande Campeão
          </span>
          <h2 className="text-xl font-black text-desbrava-blue">{winner.name}</h2>
          <p className="text-xs font-bold text-slate-500 mb-2">{winner.club}</p>
          <span className="text-2xl font-black text-amber-600">{winner.score} PUP</span>
          <span className={`text-xs font-black mt-1 ${winnerTrophy.color}`}>{winnerTrophy.name}</span>
        </div>

        {/* Dynamic Standing List of Current Game */}
        <div className="w-full mb-6 text-left">
          <h3 className="text-xs font-black text-desbrava-blue uppercase mb-2 flex items-center gap-1">
            <ListOrdered size={14} /> Classificação da Partida
          </h3>
          <div className="flex flex-col gap-2">
            {sortedPlayers.map((player, idx) => {
              const trophy = getTrophyDetails(player.score);
              return (
                <div 
                  key={player.id} 
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    idx === 0 
                      ? 'bg-desbrava-yellow/10 border-desbrava-yellow' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-400 w-5">#{idx + 1}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${player.color}`}>
                      {player.name.substring(0, 1).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-xs text-slate-800">{player.name}</span>
                      <span className="text-[9px] font-semibold text-slate-500">{player.club}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-xs font-black text-desbrava-blue">{player.score} PUP</span>
                    <span className="text-sm" title={trophy.name}>{trophy.badge}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Persistent Local Ranking (Top 5 Ever) */}
        <div className="w-full mb-8 text-left border-t border-slate-200 pt-4">
          <h3 className="text-xs font-black text-desbrava-blue uppercase mb-2 flex items-center gap-1">
            <Trophy size={14} className="text-desbrava-yellow fill-desbrava-yellow" /> Recordes do Campori (Top 5)
          </h3>
          <div className="flex flex-col gap-1.5">
            {highScores.map((score, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-amber-600 font-extrabold">#{idx + 1}</span>
                  <span>{score.name}</span>
                  <span className="text-[10px] font-normal text-slate-400">({score.club})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-desbrava-blue">{score.score} PUP</span>
                  <span className="text-[9px] text-slate-400">{score.date}</span>
                </div>
              </div>
            ))}
            {highScores.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center">Nenhum recorde registrado ainda.</p>
            )}
          </div>
        </div>

        {/* Restart Button */}
        <button 
          onClick={onRestart}
          className="w-full bg-desbrava-yellow hover:bg-yellow-400 text-desbrava-blue font-black py-4 rounded-xl shadow-xl transition-transform active:scale-95 uppercase tracking-wide flex justify-center items-center gap-2 border-b-4 border-yellow-600"
        >
          <RotateCcw size={20} /> Reiniciar Novo Acampamento
        </button>
      </div>
    </div>
  );
};

export default VictoryScreen;
