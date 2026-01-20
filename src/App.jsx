import { useEffect, useState } from "react";

const emojis = ["🐶","🐱","🐰","🐼","🐻","🦊","🐹","🐨"];


export default function App() {
  const [cards, setCards] = useState([]);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [lock, setLock] = useState(false);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);

  const shuffleCards = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((value, id) => ({ id, value }));

    setCards(shuffled);
    setFirst(null);
    setSecond(null);
    setMatched([]);
    setLock(false);
    setAttempts(0);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  const handleClick = (card) => {
    if (lock || matched.includes(card.id)) return;
    if (first && first.id === card.id) return;

    if (!first) {
      setFirst(card);
    } else if (!second) {
      setSecond(card);
      setLock(true);
      setAttempts((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (first && second) {
      if (first.value === second.value) {
        setMatched((prev) => [...prev, first.id, second.id]);
      }

      setTimeout(() => {
        setFirst(null);
        setSecond(null);
        setLock(false);
      }, 800);
    }
  }, [first, second]);

  const isFlipped = (card) =>
    card.id === first?.id ||
    card.id === second?.id ||
    matched.includes(card.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold mb-4 text-pink-400">
        🦫 Memory Game
      </h1>

      <div className="mb-6 text-indigo-200">
        Attempts: <span className="font-bold text-white">{attempts}</span>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-sm w-full">
        {cards.map((card) => {
          const flipped = isFlipped(card);
          const isMatched = matched.includes(card.id);

          return (
            <button
              key={card.id}
              onClick={() => handleClick(card)}
              className={`aspect-square rounded-xl flex items-center justify-center text-4xl transition-all duration-300
                ${
                  flipped
                    ? "bg-white scale-100"
                    : "bg-indigo-600 hover:bg-indigo-500 scale-95"
                }
                ${isMatched ? "opacity-40" : ""}
              `}
            >
              {flipped ? card.value : "❓"}
            </button>
          );
        })}
      </div>

      {matched.length === cards.length && cards.length > 0 && (
        <p className="mt-6 text-green-400 text-xl font-bold">
          🎉 All  matched!
        </p>
      )}

      <button
        onClick={shuffleCards}
        className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold"
      >
        Restart
      </button>
    </div>
  );
}
