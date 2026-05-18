import React, { useState } from 'react';
import { HelpCircle, AlertTriangle, Tent, CheckCircle, XCircle, Dumbbell, Brain, Heart, Trophy } from 'lucide-react';

const ModalEvent = ({ event, onClose }) => {
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null);

  const isQuiz = event.type === 'QUIZ' || event.type === 'CHECKPOINT';
  const data = event.data;

  let bgColor = 'bg-white';
  let headerColor = 'bg-slate-800';
  let title = '';
  let icon = null;

  if (event.type === 'PENALTY') {
    headerColor = 'bg-red-600';
    title = 'Inspeção / Penalidade';
    icon = <AlertTriangle className="text-white" size={28} />;
  } else if (event.type === 'BONUS') {
    headerColor = 'bg-desbrava-green';
    title = 'Rotina do Acampamento';
    icon = <Tent className="text-white" size={28} />;
  } else if (event.type === 'CHECKPOINT') {
    headerColor = 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 animate-pulse';
    title = 'Portal de Especialidade';
    icon = <Trophy className="text-white fill-white animate-bounce" size={28} />;
  } else if (isQuiz) {
    // Dynamic styling based on Quiz Category
    if (data.categoria === 'FÍSICO') {
      headerColor = 'bg-amber-600';
      title = 'Quiz Físico';
      icon = <Dumbbell className="text-white" size={28} />;
    } else if (data.categoria === 'MENTAL') {
      headerColor = 'bg-blue-600';
      title = 'Quiz Mental';
      icon = <Brain className="text-white" size={28} />;
    } else if (data.categoria === 'ESPIRITUAL') {
      headerColor = 'bg-purple-600';
      title = 'Quiz Espiritual';
      icon = <Heart className="text-white" size={28} />;
    } else {
      headerColor = 'bg-desbrava-blue';
      title = 'Quiz Técnico';
      icon = <HelpCircle className="text-white" size={28} />;
    }
  }

  const handleContinue = () => {
    if (!isQuiz) {
      onClose({ pupChange: data.pupChange, stepChange: data.stepChange, playAgain: data.playAgain });
    } else {
      onClose({ pupChange: isCorrect ? 50 : -15, stepChange: 0 });
    }
  };

  const handleAnswer = (index) => {
    if (answered) return;
    setAnswered(true);
    setSelectedOpt(index);
    if (index === data.correta) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col ${bgColor} animate-in zoom-in-95 duration-200`}>
        
        <div className={`${headerColor} p-4 flex items-center gap-3 justify-center shadow`}>
          {icon}
          <h2 className="text-white font-black text-sm uppercase tracking-wider">{title}</h2>
        </div>

        <div className="p-6 text-center text-slate-800 font-semibold text-base md:text-lg leading-relaxed flex-1 flex flex-col justify-center max-h-[350px] overflow-y-auto">
          {isQuiz ? (
            <div className="flex flex-col gap-4 w-full">
              {event.type === 'CHECKPOINT' ? (
                <span className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-800 rounded-full font-black text-[10px] uppercase tracking-widest self-center shadow-sm">
                  ⭐ Portal de Especialidade: Casa {data.checkpoint} ⭐
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Categoria: {data.categoria}
                </span>
              )}
              <p className="font-extrabold text-lg text-slate-800 leading-snug">{data.pergunta}</p>
              
              {data.imagem && (
                <div className="my-1 w-full flex justify-center bg-slate-50 py-2 rounded-xl border border-slate-100 shadow-sm relative min-h-[120px]">
                  <img 
                    src={data.imagem.startsWith('http') ? `https://wsrv.nl/?url=${encodeURIComponent(data.imagem)}` : data.imagem} 
                    alt="Imagem da Pergunta" 
                    className="h-28 md:h-32 object-contain relative z-10"
                    onError={(e) => {
                      // Fallback if proxy fails
                      e.target.onerror = null;
                      e.target.src = data.imagem;
                    }}
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 mt-2 w-full text-left">
                {data.opcoes.map((opt, idx) => {
                  let btnColor = "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300";
                  if (answered) {
                    if (idx === data.correta) {
                      btnColor = "bg-green-500 text-white border-green-600";
                    } else if (idx === selectedOpt) {
                      btnColor = "bg-red-500 text-white border-red-600";
                    } else {
                      btnColor = "bg-slate-100 text-slate-450 border-slate-200 opacity-50";
                    }
                  }

                  return (
                    <button 
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={answered}
                      className={`px-4 py-2.5 rounded-xl border-b-4 font-extrabold text-xs transition-all active:scale-95 ${btnColor}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div className={`mt-3 p-3 rounded-xl flex items-center justify-center gap-2 font-black text-sm animate-bounce ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  {isCorrect ? 'Correto! +50 PUP' : 'Incorreto! -15 PUP'}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="font-extrabold text-slate-800 leading-snug">{data.text}</p>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {data.pupChange !== 0 && (
                  <span className={`px-2 py-0.5 rounded text-xs font-black ${data.pupChange > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {data.pupChange > 0 ? `+${data.pupChange}` : data.pupChange} PUP
                  </span>
                )}
                {data.stepChange !== 0 && (
                  <span className={`px-2 py-0.5 rounded text-xs font-black ${data.stepChange > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {data.stepChange > 0 ? `Avança ${data.stepChange}` : `Volta ${Math.abs(data.stepChange)}`} {Math.abs(data.stepChange) === 1 ? 'casa' : 'casas'}
                  </span>
                )}
                {data.playAgain && (
                  <span className="px-2 py-0.5 rounded text-xs font-black bg-desbrava-yellow/20 text-desbrava-blue">
                    Joga Novamente!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button 
            onClick={handleContinue}
            disabled={isQuiz && !answered}
            className={`w-full py-3.5 rounded-xl font-black text-sm shadow-md transition-all uppercase tracking-wider border-b-4
              ${(isQuiz && !answered) 
                ? 'bg-slate-350 text-slate-500 cursor-not-allowed border-slate-500' 
                : 'bg-desbrava-yellow text-desbrava-blue hover:bg-yellow-400 border-yellow-600 active:scale-95'}`}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEvent;
