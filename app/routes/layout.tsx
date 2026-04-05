import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useOutletContext } from "react-router";
import { v4 as uuidv4 } from "uuid";
import type { Card } from "../components/card-dialog";
import { SEED_CARDS } from "../data/seeds";

const MAX_DECK_SIZE = 30;
const MAX_COPIES_PER_CARD = 2;

export type AppContext = {
  cards: Card[];
  deck: string[];
  addToDeck: (cardId: string) => void;
  removeFromDeck: (index: number) => void;
  clearDeck: () => void;
  saveCard: (card: Card) => void;
  deleteCard: (cardId: string) => void;
};

export function useAppContext() {
  return useOutletContext<AppContext>();
}

export default function AppLayout() {
  const [cards, setCards] = useState<Card[]>([]);
  const [deck, setDeck] = useState<string[]>([]);
  const [deckNotification, setDeckNotification] = useState<string | null>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      try {
        const saved = localStorage.getItem("hs-cards");
        setCards(saved ? JSON.parse(saved) : SEED_CARDS);
        const savedDeck = localStorage.getItem("hs-deck");
        if (savedDeck) setDeck(JSON.parse(savedDeck));
      } catch {}
      return;
    }
    localStorage.setItem("hs-cards", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    if (firstRender.current) return;
    localStorage.setItem("hs-deck", JSON.stringify(deck));
  }, [deck]);

  function showNotification(msg: string) {
    setDeckNotification(msg);
    setTimeout(() => setDeckNotification(null), 3000);
  }

  function addToDeck(cardId: string) {
    if (deck.length >= MAX_DECK_SIZE) {
      showNotification(`Baralho cheio! Máximo de ${MAX_DECK_SIZE} cartas.`);
      return;
    }
    if (deck.filter((id) => id === cardId).length >= MAX_COPIES_PER_CARD) {
      showNotification(
        `Já existem ${MAX_COPIES_PER_CARD} cópias desta carta no baralho.`,
      );
      return;
    }
    setDeck((prev) => [...prev, cardId]);
  }

  function removeFromDeck(index: number) {
    setDeck((prev) => prev.filter((_, i) => i !== index));
  }

  function saveCard(card: Card) {
    setCards((prev) => {
      if (card.id && prev.some((c) => c.id === card.id)) {
        return prev.map((c) => (c.id === card.id ? card : c));
      }
      const id = `HS-${uuidv4().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
      return [{ ...card, id }, ...prev];
    });
  }

  function clearDeck() {
    setDeck([]);
  }

  function deleteCard(cardId: string) {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    setDeck((prev) => prev.filter((id) => id !== cardId));
  }

  const context: AppContext = {
    cards,
    deck,
    addToDeck,
    removeFromDeck,
    clearDeck,
    saveCard,
    deleteCard,
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen overflow-x-hidden">
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-[#0f131f]/80 backdrop-blur-xl border-b border-primary/15 shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}
            >
              style
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary drop-shadow-[0_0_8px_rgba(230,195,88,0.4)] font-headline tracking-wide">
              HearthStone Card Manager
            </h1>
            <p className="text-xs text-on-surface-variant font-label uppercase tracking-widest opacity-70">
              Gerenciador de Cartas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded text-sm font-bold uppercase tracking-widest transition-all ${
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`
            }
          >
            <span className="material-symbols-outlined text-base">layers</span>
            Cartas
          </NavLink>

          <NavLink
            to="/deck"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded text-sm font-bold uppercase tracking-widest transition-all ${
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`
            }
          >
            <span className="material-symbols-outlined text-base">stack</span>
            Baralho
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                deck.length >= MAX_DECK_SIZE
                  ? "bg-red-500/20 text-red-400"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {deck.length}
            </span>
          </NavLink>
        </div>
      </header>

      <Outlet context={context} />

      {deckNotification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-200 bg-surface-container border border-error/40 text-error px-6 py-3 rounded-lg shadow-xl text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-base">warning</span>
          {deckNotification}
        </div>
      )}
    </div>
  );
}
