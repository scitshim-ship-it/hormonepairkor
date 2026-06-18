import React, { useState, useEffect } from "react";
import { Brain, Activity, RotateCcw, Users, Home } from "lucide-react";

const PATHWAYS = [
  ["뇌하수체", "생장호르몬", "뼈와 근육의 생장을 촉진함"],
  ["뇌하수체", "갑상샘 자극 호르몬", "갑상샘을 자극함"],
  ["뇌하수체", "항이뇨 호르몬", "콩팥에서 물의 재흡수를 촉진함"],
  ["갑상샘", "티록신", "세포 호흡을 촉진함"],
  ["부신", "아드레날린", "심장 박동이 빨라지게 함"],
  ["이자", "인슐린", "혈당량을 낮춤"],
  ["이자", "글루카곤", "혈당량을 높임"],
  ["난소", "에스트로젠", "여성의 신체적 특징이 나타나게 함"],
  ["정소", "테스토스테론", "남성의 신체적 특징이 나타나게 함"],
];

const INITIAL_DECK = [
  { type: "gland", text: "뇌하수체" },
  { type: "gland", text: "뇌하수체" },
  { type: "gland", text: "뇌하수체" },
  { type: "gland", text: "갑상샘" },
  { type: "gland", text: "부신" },
  { type: "gland", text: "이자" },
  { type: "gland", text: "이자" },
  { type: "gland", text: "난소" },
  { type: "gland", text: "정소" },
  { type: "hormone", text: "생장호르몬" },
  { type: "hormone", text: "갑상샘 자극 호르몬" },
  { type: "hormone", text: "항이뇨 호르몬" },
  { type: "hormone", text: "티록신" },
  { type: "hormone", text: "아드레날린" },
  { type: "hormone", text: "인슐린" },
  { type: "hormone", text: "글루카곤" },
  { type: "hormone", text: "에스트로젠" },
  { type: "hormone", text: "테스토스테론" },
  { type: "function", text: "뼈와 근육의 생장을 촉진함" },
  { type: "function", text: "갑상샘을 자극함" },
  { type: "function", text: "콩팥에서 물의 재흡수를 촉진함" },
  { type: "function", text: "세포 호흡을 촉진함" },
  { type: "function", text: "심장 박동이 빨라지게 함" },
  { type: "function", text: "혈당량을 낮춤" },
  { type: "function", text: "혈당량을 높임" },
  { type: "function", text: "여성의 신체적 특징이 나타나게 함" },
  { type: "function", text: "남성의 신체적 특징이 나타나게 함" },
];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.map((card, idx) => ({ ...card, id: idx, isMatched: false }));
};

export default function App() {
  const [gameMode, setGameMode] = useState(null); // null(선택화면), '2p', '4p'
  const [totalPlayers, setTotalPlayers] = useState(2);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({});
  const [message, setMessage] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const handleStartGame = (mode) => {
    const players = mode === "2p" ? 2 : mode === "3p" ? 3 : 4;
    const initialScores = {};
    for (let i = 1; i <= players; i++) initialScores[i] = 0;

    // 3인용과 4인용일 경우 카드를 2배로 늘림 (54장)
    const deckToUse =
      mode === "3p" || mode === "4p"
        ? [...INITIAL_DECK, ...INITIAL_DECK]
        : INITIAL_DECK;

    setGameMode(mode);
    setTotalPlayers(players);
    setCards(shuffleArray(deckToUse));
    setFlippedIndices([]);
    setCurrentPlayer(1);
    setScores(initialScores);
    setMessage(`게임을 시작합니다! 1번 플레이어 먼저 카드를 2장 뒤집어주세요.`);
    setIsLocked(false);
    setGameOver(false);
  };

  const goHome = () => {
    setGameMode(null);
  };

  const isValidMatch = (selectedCards) => {
    const types = selectedCards.map((c) => c.type);
    const uniqueTypes = new Set(types);
    if (uniqueTypes.size !== selectedCards.length) return false;

    const selectedTexts = selectedCards.map((c) => c.text);
    return PATHWAYS.some((pathway) =>
      selectedTexts.every((text) => pathway.includes(text))
    );
  };

  const handleCardClick = (index) => {
    if (isLocked) return;
    if (cards[index].isMatched) return;
    if (flippedIndices.includes(index)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    const selectedCards = newFlipped.map((idx) => cards[idx]);

    // 2장 뒤집었을 때
    if (newFlipped.length === 2) {
      if (isValidMatch(selectedCards)) {
        setMessage("✨ 연관된 카드입니다! 세 번째 카드를 뽑으세요.");
      } else {
        setMessage("❌ 연관이 없습니다. 차례가 넘어갑니다.");
        setIsLocked(true);
        setTimeout(() => {
          setFlippedIndices([]);
          const nextPlayer = (currentPlayer % totalPlayers) + 1;
          setCurrentPlayer(nextPlayer);
          setMessage(`플레이어 ${nextPlayer}의 차례입니다.`);
          setIsLocked(false);
        }, 2000);
      }
    }
    // 3장 뒤집었을 때
    else if (newFlipped.length === 3) {
      if (isValidMatch(selectedCards)) {
        setMessage("🎉 정답입니다! 세트를 획득하고 한 번 더 진행합니다.");
        setIsLocked(true);
        setTimeout(() => {
          const newCards = [...cards];
          newFlipped.forEach((idx) => {
            newCards[idx].isMatched = true;
          });
          setCards(newCards);

          const newScores = {
            ...scores,
            [currentPlayer]: scores[currentPlayer] + 1,
          };
          setScores(newScores);
          setFlippedIndices([]);
          setIsLocked(false);

          if (newCards.every((c) => c.isMatched)) {
            setGameOver(true);
            const maxScore = Math.max(...Object.values(newScores));
            const winners = Object.keys(newScores).filter(
              (p) => newScores[p] === maxScore
            );

            if (winners.length > 1) {
              setMessage(
                `게임 종료! 무승부입니다! (플레이어 ${winners.join(
                  ", "
                )} 공동 우승)`
              );
            } else {
              setMessage(`🏆 게임 종료! 플레이어 ${winners[0]} 승리!`);
            }
          } else {
            setMessage(
              `연속 진행! 플레이어 ${currentPlayer}, 다음 카드를 뽑으세요.`
            );
          }
        }, 1500);
      } else {
        setMessage("❌ 세 번째 카드가 연관이 없습니다. 차례가 넘어갑니다.");
        setIsLocked(true);
        setTimeout(() => {
          setFlippedIndices([]);
          const nextPlayer = (currentPlayer % totalPlayers) + 1;
          setCurrentPlayer(nextPlayer);
          setMessage(`플레이어 ${nextPlayer}의 차례입니다.`);
          setIsLocked(false);
        }, 2000);
      }
    }
  };

  const getCardStyle = (type) => {
    switch (type) {
      case "gland":
        return "bg-blue-100 border-blue-400 text-blue-800";
      case "hormone":
        return "bg-pink-100 border-pink-400 text-pink-800";
      case "function":
        return "bg-amber-100 border-amber-400 text-amber-800";
      default:
        return "bg-gray-100 border-gray-400 text-gray-800";
    }
  };

  const getCardLabel = (type) => {
    switch (type) {
      case "gland":
        return "내분비샘";
      case "hormone":
        return "호르몬";
      case "function":
        return "기능";
      default:
        return "";
    }
  };

  const getPlayerColor = (playerNum) => {
    switch (playerNum) {
      case 1:
        return {
          border: "border-indigo-500",
          bg: "bg-indigo-50",
          text: "text-indigo-600",
        };
      case 2:
        return {
          border: "border-rose-500",
          bg: "bg-rose-50",
          text: "text-rose-600",
        };
      case 3:
        return {
          border: "border-emerald-500",
          bg: "bg-emerald-50",
          text: "text-emerald-600",
        };
      case 4:
        return {
          border: "border-amber-500",
          bg: "bg-amber-50",
          text: "text-amber-600",
        };
      default:
        return {
          border: "border-gray-500",
          bg: "bg-gray-50",
          text: "text-gray-600",
        };
    }
  };

  // 1. 시작 화면 (모드 선택)
  if (!gameMode) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <Brain className="w-20 h-20 text-indigo-600" />
            <Activity className="w-20 h-20 text-rose-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">
            호르몬 짝맞추기
          </h1>
          <p className="text-lg text-slate-600 mb-12">
            내분비샘, 호르몬, 기능을 연결하여 가장 많은 세트를 완성하세요!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <button
              onClick={() => handleStartGame("2p")}
              className="group flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-indigo-50 border-4 border-slate-200 hover:border-indigo-500 rounded-2xl transition-all"
            >
              <Users className="w-10 h-10 text-slate-400 group-hover:text-indigo-500 mb-4" />
              <h2 className="text-xl font-bold text-slate-700 group-hover:text-indigo-700 mb-2">
                2인 플레이
              </h2>
              <p className="text-sm text-slate-500">기본 모드 (27장)</p>
            </button>

            <button
              onClick={() => handleStartGame("3p")}
              className="group flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-emerald-50 border-4 border-slate-200 hover:border-emerald-500 rounded-2xl transition-all"
            >
              <div className="flex gap-1 mb-4">
                <Users className="w-10 h-10 text-slate-400 group-hover:text-emerald-500" />
                <Users className="w-10 h-10 text-slate-400 group-hover:text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-700 group-hover:text-emerald-700 mb-2">
                3인 플레이
              </h2>
              <p className="text-sm text-slate-500">확장 모드 (54장)</p>
            </button>

            <button
              onClick={() => handleStartGame("4p")}
              className="group flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-rose-50 border-4 border-slate-200 hover:border-rose-500 rounded-2xl transition-all"
            >
              <div className="flex gap-1 mb-4">
                <Users className="w-8 h-8 text-slate-400 group-hover:text-rose-500" />
                <Users className="w-8 h-8 text-slate-400 group-hover:text-rose-500" />
                <Users className="w-8 h-8 text-slate-400 group-hover:text-rose-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-700 group-hover:text-rose-700 mb-2">
                4인 플레이
              </h2>
              <p className="text-sm text-slate-500">확장 모드 (54장)</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. 메인 게임 화면
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <header className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <button
            onClick={goHome}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors font-bold"
          >
            <Home className="w-5 h-5" />
            메뉴로
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
            <Brain className="w-8 h-8 text-indigo-600" />
            호르몬 짝맞추기 (
            {gameMode === "2p"
              ? "2인용"
              : gameMode === "3p"
              ? "3인용"
              : "4인용"}
            )
          </h1>
          <div className="w-24 hidden md:block"></div>{" "}
          {/* 균형을 위한 빈 공간 */}
        </header>

        {/* Scoreboard - 플레이어 인원수에 따라 동적 렌더링 */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-6">
          {Object.keys(scores).map((playerNum) => {
            const pNum = parseInt(playerNum);
            const isCurrent = currentPlayer === pNum;
            const colors = getPlayerColor(pNum);

            return (
              <div
                key={pNum}
                className={`p-3 md:p-4 rounded-xl border-4 w-32 md:w-40 text-center transition-all ${
                  isCurrent
                    ? `${colors.border} ${colors.bg} shadow-lg scale-105`
                    : "border-transparent bg-white shadow"
                }`}
              >
                <h2 className="text-sm md:text-lg font-bold text-slate-700">
                  플레이어 {pNum}
                </h2>
                <p
                  className={`text-2xl md:text-3xl font-black ${
                    isCurrent ? colors.text : "text-slate-600"
                  }`}
                >
                  {scores[pNum]}{" "}
                  <span className="text-xs md:text-sm font-normal text-slate-500">
                    세트
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Message Box */}
        <div
          className={`p-3 md:p-4 mb-6 md:mb-8 rounded-lg text-center font-bold text-base md:text-lg shadow-sm ${
            gameOver
              ? "bg-amber-200 text-amber-900"
              : "bg-white border-2 border-slate-200 text-slate-700"
          }`}
        >
          {message}
        </div>

        {/* Game Board - 54장일 경우 카드가 작아지도록 촘촘한 그리드 구성 */}
        <div
          className={`grid gap-2 md:gap-3 perspective-1000 ${
            gameMode === "2p"
              ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9"
              : "grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-9"
          }`}
        >
          {cards.map((card, index) => {
            const isFlipped = flippedIndices.includes(index) || card.isMatched;

            return (
              <div
                key={card.id}
                className={`relative w-full ${
                  gameMode !== "2p"
                    ? "aspect-[3/4] md:aspect-square lg:aspect-[3/4]"
                    : "aspect-[3/4]"
                } cursor-pointer transition-transform duration-500 transform-style-3d ${
                  isFlipped ? "rotate-y-180" : "hover:-translate-y-1"
                }`}
                onClick={() => handleCardClick(index)}
              >
                {/* Front of card */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl border-2 shadow-sm flex flex-col justify-between p-1.5 md:p-2 ${getCardStyle(
                    card.type
                  )} ${card.isMatched ? "opacity-40" : "opacity-100"}`}
                >
                  <div className="text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-wider opacity-70">
                    {getCardLabel(card.type)}
                  </div>
                  <div className="flex-grow flex items-center justify-center text-center">
                    <span
                      className={`font-bold leading-tight break-keep ${
                        gameMode !== "2p"
                          ? "text-xs md:text-[13px] lg:text-sm"
                          : "text-sm md:text-base"
                      }`}
                    >
                      {card.text}
                    </span>
                  </div>
                </div>

                {/* Back of card */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-sm border-2 border-slate-500 flex flex-col items-center justify-center p-1 md:p-2 hover:border-slate-400 transition-colors">
                  <div
                    className={`border-2 border-slate-400 rounded-full opacity-50 flex items-center justify-center mb-1 ${
                      gameMode !== "2p"
                        ? "w-5 h-5 md:w-6 md:h-6"
                        : "w-6 h-6 md:w-8 md:h-8"
                    }`}
                  >
                    <span className="text-slate-400 text-xs font-bold">?</span>
                  </div>
                  <span
                    className={`text-slate-200 font-bold tracking-widest text-center break-keep ${
                      gameMode !== "2p" ? "text-xs" : "text-sm md:text-base"
                    }`}
                  >
                    {getCardLabel(card.type)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Restart Button */}
        {gameOver && (
          <div className="mt-10 mb-10 flex justify-center gap-4">
            <button
              onClick={() => handleStartGame(gameMode)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg shadow-lg transition-transform hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              다시하기
            </button>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `,
        }}
      />
    </div>
  );
}
