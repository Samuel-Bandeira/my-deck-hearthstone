import { Link } from "react-router";
import { CLASS_COLORS } from "../components/card-dialog";
import { useAppContext } from "./layout";
import type { Route } from "./+types/deck";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Baralho — HearthStone Card Manager" }];
}

const MAX_DECK_SIZE = 30;
const MAX_COPIES_PER_CARD = 2;

export default function BaralhoPage() {
  const { cards, deck, addToDeck, removeFromDeck, clearDeck } = useAppContext();

  const deckCountById = deck.reduce<Record<string, number>>((acc, id) => {
    acc[id] = (acc[id] ?? 0) + 1;
    return acc;
  }, {});

  const uniqueDeckCards = Object.keys(deckCountById)
    .map((id) => cards.find((c) => c.id === id))
    .filter(Boolean)
    .sort((a, b) => (a!.manaCost ?? 0) - (b!.manaCost ?? 0)) as NonNullable<
    (typeof cards)[number]
  >[];

  const totalMana = deck
    .map((id) => cards.find((c) => c.id === id))
    .reduce((s, c) => s + (c?.manaCost ?? 0), 0);

  if (deck.length === 0) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-screen gap-4 text-center">
        <span
          className="material-symbols-outlined text-outline/30"
          style={{ fontSize: "72px" }}
        >
          style
        </span>
        <p className="text-xl font-headline text-outline">Baralho vazio</p>
        <p className="text-sm text-on-surface-variant/60">
          Vá para{" "}
          <Link
            to="/"
            className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Cartas
          </Link>{" "}
          e use o botão{" "}
          <span className="material-symbols-outlined text-sm align-middle text-blue-400">
            library_add
          </span>{" "}
          para montar seu baralho.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-6 border-l-2 border-primary shadow-xl">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
            Cartas no Baralho
          </p>
          <div className="flex items-end gap-2">
            <h3
              className={`text-4xl font-headline ${deck.length >= MAX_DECK_SIZE ? "text-red-400" : "text-primary"}`}
            >
              {deck.length}
            </h3>
            <span className="text-on-surface-variant text-lg mb-1">
              / {MAX_DECK_SIZE}
            </span>
          </div>
        </div>
        <div className="glass-panel p-6 border-l-2 border-blue-500 shadow-xl">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
            Custo Total de Mana
          </p>
          <h3 className="text-4xl font-headline text-blue-400">{totalMana}</h3>
        </div>
        <div className="glass-panel p-6 border-l-2 border-secondary shadow-xl">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
            Cartas Únicas
          </p>
          <h3 className="text-4xl font-headline text-secondary">
            {uniqueDeckCards.length}
          </h3>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-white/5">
        <div className="px-6 py-4 bg-surface-container-lowest/50 border-b border-outline-variant/20 flex items-center justify-between">
          <span className="text-[12px] uppercase font-bold text-on-surface-variant tracking-widest">
            Cartas ordenadas por custo de mana
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-on-surface-variant/50">
              Máx. {MAX_COPIES_PER_CARD} cópias por carta
            </span>
            <button
              onClick={clearDeck}
              className="flex items-center gap-1 text-[10px] uppercase font-bold text-on-surface-variant hover:text-error transition-colors tracking-widest"
            >
              <span className="material-symbols-outlined text-sm">
                delete_sweep
              </span>
              Limpar
            </button>
          </div>
        </div>
        <div className="divide-y divide-outline-variant/10">
          {uniqueDeckCards.map((card) => {
            const color = CLASS_COLORS[card.cardClass] ?? "#d0c6b1";
            const copies = deckCountById[card.id] ?? 0;
            return (
              <div
                key={card.id}
                className="flex items-center gap-4 px-6 py-4 row-hover transition-colors"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-500/10 border border-blue-500/20">
                  <span className="font-headline font-bold text-blue-400 text-sm">
                    {card.manaCost ?? 0}
                  </span>
                </div>

                <div
                  className="w-1 h-8 rounded-full shrink-0"
                  style={{ background: color }}
                />

                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
                  style={{ background: `${color}22` }}
                >
                  <span
                    className="material-symbols-outlined text-base"
                    style={{ color }}
                  >
                    {card.cardType === "Magia" ? "auto_fix_high" : "swords"}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="font-headline text-base text-on-surface">
                    {card.name}
                  </span>
                  <span
                    className="ml-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border"
                    style={{
                      background: `${color}1a`,
                      color,
                      borderColor: `${color}33`,
                    }}
                  >
                    {card.cardClass}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-primary shrink-0">
                  <span className="material-symbols-outlined text-sm">
                    swords
                  </span>
                  <span className="font-headline font-bold">{card.attack}</span>
                </div>
                <div className="flex items-center gap-1 text-on-tertiary-container shrink-0">
                  <span className="material-symbols-outlined text-sm">
                    shield
                  </span>
                  <span className="font-headline font-bold">
                    {card.defense}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {Array.from({ length: copies }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const idx = deck.lastIndexOf(card.id);
                        removeFromDeck(idx);
                      }}
                      title="Remover uma cópia"
                      className="w-6 h-6 rounded bg-primary/10 border border-primary/20 hover:bg-error/10 hover:border-error/30 transition-colors flex items-center justify-center group"
                    >
                      <span className="material-symbols-outlined text-xs text-primary group-hover:text-error transition-colors">
                        close
                      </span>
                    </button>
                  ))}
                  {copies < MAX_COPIES_PER_CARD && (
                    <button
                      onClick={() => addToDeck(card.id)}
                      title="Adicionar cópia"
                      className="w-6 h-6 rounded bg-surface-container border border-outline-variant/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-colors flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-xs text-on-surface-variant">
                        add
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
