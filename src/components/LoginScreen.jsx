import React, { useState, useEffect } from 'react';
import { Tent, Users, User, Shield, Trophy, Star } from 'lucide-react';
import { getTopHighScores } from '../logic/firebase';

const LoginScreen = ({ onStart }) => {
  const [numPlayers, setNumPlayers] = useState(1);
  const [highScores, setHighScores] = useState([]);
  const [playersData, setPlayersData] = useState([
    { name: '', club: '' },
    { name: '', club: '' },
    { name: '', club: '' },
    { name: '', club: '' },
    { name: '', club: '' },
    { name: '', club: '' },
    { name: '', club: '' },
    { name: '', club: '' }
  ]);

  const playerColors = [
    { name: 'Vermelho', class: 'bg-red-500 text-white' },
    { name: 'Azul', class: 'bg-sky-500 text-white' },
    { name: 'Verde', class: 'bg-emerald-500 text-white' },
    { name: 'Amarelo', class: 'bg-yellow-400 text-desbrava-blue' },
    { name: 'Roxo', class: 'bg-purple-500 text-white' },
    { name: 'Laranja', class: 'bg-orange-500 text-white' },
    { name: 'Rosa', class: 'bg-pink-500 text-white' },
    { name: 'Ciano', class: 'bg-teal-500 text-white' }
  ];

  useEffect(() => {
    const fetchScores = async () => {
      const scores = await getTopHighScores();
      setHighScores(scores);
    };
    fetchScores();
  }, []);

  const handleNumPlayersChange = (num) => {
    setNumPlayers(num);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...playersData];
    updated[index][field] = value;
    setPlayersData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    for (let i = 0; i < numPlayers; i++) {
      const name = playersData[i].name.trim();
      const club = playersData[i].club.trim();
      if (!name || !club) {
        alert(`Atenção: Por favor, preencha o Nome e a Unidade/Clube de todos os jogadores ativos! (Erro no Jogador ${i + 1})`);
        return;
      }
    }

    // Build list of active players
    const activePlayers = [];
    for (let i = 0; i < numPlayers; i++) {
      activePlayers.push({
        id: i,
        name: playersData[i].name.trim(),
        club: playersData[i].club.trim(),
        score: 150,
        position: 0,
        color: playerColors[i].class,
        colorName: playerColors[i].name,
        finished: false
      });
    }

    onStart(activePlayers);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full p-4 bg-desbrava-green relative overflow-y-auto pb-12">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
      
      <div className="z-10 bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg border-b-8 border-desbrava-yellow mt-4">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-desbrava-yellow p-4 rounded-full mb-3 shadow-lg text-desbrava-blue animate-bounce">
            <Tent size={40} />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-desbrava-blue text-center mb-1 uppercase tracking-wider">
            Super Unidade
          </h1>
          <p className="text-desbrava-brown font-semibold text-sm">Campori de Tabuleiro</p>
        </div>

        {/* Player Count Selector */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-desbrava-blue mb-2 text-center flex items-center justify-center gap-2">
            <Users size={16} /> Quantidade de Jogadores (Até 8):
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumPlayersChange(num)}
                className={`py-2 rounded-xl font-bold text-sm transition-all border-b-2 active:scale-95 ${
                  numPlayers === num
                    ? 'bg-desbrava-yellow text-desbrava-blue border-yellow-600 scale-105'
                    : 'bg-desbrava-sand/40 text-slate-700 border-slate-300 hover:bg-desbrava-sand/60'
                }`}
              >
                {num} {num === 1 ? 'Jogador' : 'Jogadores'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="max-h-[300px] overflow-y-auto pr-2 flex flex-col gap-4 border-t border-b border-slate-200 py-4 scrollbar-thin">
            {Array.from({ length: numPlayers }).map((_, idx) => (
              <div key={idx} className="p-3 bg-desbrava-sand/20 rounded-xl border border-desbrava-sand/40">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-3 h-3 rounded-full ${playerColors[idx].class}`} />
                  <h3 className="font-extrabold text-xs uppercase text-desbrava-blue tracking-wider">
                    Jogador {idx + 1} ({playerColors[idx].name})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-desbrava-blue/80 uppercase mb-0.5 flex items-center gap-1">
                      <User size={10} /> Nome
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-1.5 rounded-lg border-2 border-slate-200 focus:border-desbrava-blue focus:outline-none transition-colors text-sm font-semibold text-slate-800"
                      placeholder={`Ex: Nome do Jogador ${idx + 1}`}
                      value={playersData[idx].name}
                      onChange={(e) => handleInputChange(idx, 'name', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-desbrava-blue/80 uppercase mb-0.5 flex items-center gap-1">
                      <Shield size={10} /> Unidade / Clube
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-1.5 rounded-lg border-2 border-slate-200 focus:border-desbrava-blue focus:outline-none transition-colors text-sm font-semibold text-slate-800"
                      placeholder="Ex: Unidade Estrela"
                      value={playersData[idx].club}
                      onChange={(e) => handleInputChange(idx, 'club', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="submit"
            className="w-full mt-2 bg-desbrava-yellow hover:bg-yellow-400 text-desbrava-blue font-black py-4 rounded-xl shadow-lg transition-transform active:scale-95 uppercase tracking-wider flex justify-center items-center gap-2 text-base border-b-4 border-yellow-600"
          >
            <Tent size={22} /> Iniciar Acampamento
          </button>
        </form>

        {/* Persistent Local Ranking (Top 100 Ever) on Login Screen */}
        {highScores.length > 0 && (
          <div className="w-full mt-6 border-t border-slate-200 pt-5 text-left">
            <h3 className="text-xs font-black text-desbrava-blue uppercase mb-3 flex items-center gap-1.5">
              <Trophy size={15} className="text-desbrava-yellow fill-desbrava-yellow" /> Recordes do Campori (Top 100)
            </h3>
            <div className="flex flex-col gap-1.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
              {highScores.map((score, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-xl bg-desbrava-sand/20 border border-desbrava-sand/40 text-xs font-bold text-slate-700 hover:bg-desbrava-sand/35 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className={`font-black w-5 text-center ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-600' : 'text-slate-400'}`}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </span>
                    <span className="font-extrabold text-slate-800">{score.name}</span>
                    <span className="text-[10px] font-normal text-slate-400">({score.club})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-desbrava-blue">{score.score} PUP</span>
                    <span className="text-[9px] font-normal text-slate-400">{score.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
