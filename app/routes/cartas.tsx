import { useEffect, useState } from "react";
import CardDialog, {
  type Card,
  CLASS_COLORS,
  CLASSES,
} from "../components/card-dialog";
import ConfirmDialog from "../components/confirm-dialog";
import { useAppContext } from "./layout";
import type { Route } from "./+types/cartas";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Cartas — HearthStone Card Manager" }];
}

const PER_PAGE = 10;

export default function CartasPage() {
  const { cards, deck, addToDeck, saveCard, deleteCard } = useAppContext();
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterType, setFilterType] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search, filterClass, filterType]);

  const filtered = cards.filter((c) => {
    const q = search.toLowerCase();
    if (q && !c.name.toLowerCase().includes(q) && !c.id.toLowerCase().includes(q))
      return false;
    if (filterClass && c.cardClass !== filterClass) return false;
    if (filterType && c.cardType !== filterType) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex pt-20">
      <aside className="fixed flex flex-col gap-4 p-6 overflow-y-auto h-screen w-70 left-0 top-0 pt-24 bg-[#0f131f] border-r border-primary/10 shadow-2xl z-40">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-primary mb-1">
            <span className="material-symbols-outlined">filter_list</span>
            <h2 className="font-headline text-xl font-bold uppercase tracking-tighter">
              Filtros
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant italic">Refinar grimório</p>
        </div>

        <div className="space-y-6">
          <div className="group">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2 font-bold">
              Pesquisa Arcana
            </label>
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-container-lowest border-b border-outline-variant focus:border-primary text-sm py-2 px-0 transition-all placeholder:text-on-surface-variant/40 outline-none"
                placeholder="Buscar por ID ou Nome..."
                type="text"
              />
              <span className="material-symbols-outlined absolute right-0 top-2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors text-lg">
                search
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2 font-bold">
              Classe de Poder
            </label>
            <div className="relative flex items-center">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full bg-surface-container-low border-b border-outline-variant focus:border-primary text-sm py-2 px-0 transition-all appearance-none cursor-pointer outline-none text-on-surface pr-5"
              >
                <option value="">Todas</option>
                {CLASSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {filterClass && (
                <button
                  onClick={() => setFilterClass("")}
                  className="absolute right-0 text-on-surface-variant/50 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2 font-bold">
              Tipo de Entidade
            </label>
            <div className="relative flex items-center">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-surface-container-low border-b border-outline-variant focus:border-primary text-sm py-2 px-0 transition-all appearance-none cursor-pointer outline-none text-on-surface pr-5"
              >
                <option value="">Todos</option>
                <option value="Magia">Magia</option>
                <option value="Criatura">Criatura</option>
              </select>
              {filterType && (
                <button
                  onClick={() => setFilterType("")}
                  className="absolute right-0 text-on-surface-variant/50 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => { setSearch(""); setFilterClass(""); setFilterType(""); }}
          className="mt-auto border border-outline-variant/30 text-on-surface-variant text-[10px] uppercase font-bold py-3 hover:bg-white/5 hover:text-primary transition-all tracking-[0.2em]"
        >
          Limpar Filtros
        </button>
      </aside>

      <main className="ml-70 flex-1 p-8">
        <div className="flex justify-end mb-8">
          <button
            onClick={() => { setEditingCard(null); setDialogOpen(true); }}
            className="gold-gradient-btn text-on-primary-fixed font-bold py-2 px-6 rounded-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>Nova Carta
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-panel p-6 border-l-2 border-primary shadow-xl group hover:scale-[1.02] transition-transform cursor-default">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
                  Total de Cartas
                </p>
                <h3 className="text-4xl font-headline text-primary">
                  {cards.length.toLocaleString("pt-BR")}
                </h3>
              </div>
              <span className="material-symbols-outlined text-primary/30 text-4xl group-hover:text-primary transition-colors">
                layers
              </span>
            </div>
          </div>
          <div className="glass-panel p-6 border-l-2 border-secondary shadow-xl group hover:scale-[1.02] transition-transform cursor-default">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
                  Magias
                </p>
                <h3 className="text-4xl font-headline text-secondary">
                  {cards.filter((c) => c.cardType === "Magia").length.toLocaleString("pt-BR")}
                </h3>
              </div>
              <span className="material-symbols-outlined text-secondary/30 text-4xl group-hover:text-secondary transition-colors">
                auto_fix_high
              </span>
            </div>
          </div>
          <div className="glass-panel p-6 border-l-2 border-tertiary shadow-xl group hover:scale-[1.02] transition-transform cursor-default">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
                  Criaturas
                </p>
                <h3 className="text-4xl font-headline text-tertiary">
                  {cards.filter((c) => c.cardType === "Criatura").length.toLocaleString("pt-BR")}
                </h3>
              </div>
              <span className="material-symbols-outlined text-tertiary/30 text-4xl group-hover:text-tertiary transition-colors">
                pets
              </span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden border border-white/5">
          {rows.length === 0 ? (
            <div className="p-16 text-center">
              <span
                className="material-symbols-outlined block mb-4 text-outline/30"
                style={{ fontSize: "64px" }}
              >
                layers_clear
              </span>
              <p className="text-lg font-headline text-outline">Nenhuma carta encontrada</p>
              <p className="text-sm mt-2 text-on-surface-variant/60">
                {cards.length === 0
                  ? 'Clique em "Nova Carta" para começar.'
                  : "Tente ajustar os filtros."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest/50 text-on-surface-variant border-b border-outline-variant/20">
                  {["ID", "Nome", "Classe", "Tipo", "Mana", "Ataque", "Defesa", "Ações"].map((h) => (
                    <th key={h} className="px-6 py-4 text-[12px] uppercase font-bold text-center">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {rows.map((card) => {
                  const color = CLASS_COLORS[card.cardClass] ?? "#d0c6b1";
                  const copiesInDeck = deck.filter((id) => id === card.id).length;
                  return (
                    <tr key={card.id} className="row-hover transition-colors">
                      <td className="px-6 py-5 text-sm font-mono text-on-surface-variant/70 text-center">
                        {card.id}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <div
                            className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
                            style={{ background: `${color}22` }}
                          >
                            <span className="material-symbols-outlined text-base" style={{ color }}>
                              {card.cardType === "Magia" ? "auto_fix_high" : "swords"}
                            </span>
                          </div>
                          <span className="font-headline text-lg text-on-surface">{card.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className="px-3 py-1 text-[10px] font-bold uppercase rounded-full border"
                          style={{ background: `${color}1a`, color, borderColor: `${color}33` }}
                        >
                          {card.cardClass}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${
                            card.cardType === "Magia"
                              ? "bg-blue-500/10 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)]"
                              : "bg-orange-500/10 text-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.2)]"
                          }`}
                        >
                          {card.cardType}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-1 text-blue-400">
                          <span className="material-symbols-outlined text-lg">water_drop</span>
                          <span className="font-headline font-bold text-xl">{card.manaCost ?? 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-lg">swords</span>
                          <span className="font-headline font-bold text-xl">{card.attack}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className={`flex items-center justify-center gap-1 ${card.defense > 0 ? "text-on-tertiary-container" : "text-on-surface-variant/30"}`}>
                          <span className="material-symbols-outlined text-lg">shield</span>
                          <span className="font-headline font-bold text-xl">{card.defense}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => addToDeck(card.id)}
                            title={`Adicionar ao baralho (${copiesInDeck}/2)`}
                            className={`p-2 transition-colors ${copiesInDeck >= 2 ? "text-blue-400/40 cursor-not-allowed" : "text-on-surface-variant hover:text-blue-400"}`}
                            disabled={copiesInDeck >= 2}
                          >
                            <span className="material-symbols-outlined">library_add</span>
                          </button>
                          <button
                            onClick={() => { setEditingCard(card); setDialogOpen(true); }}
                            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => setDeletingCardId(card.id)}
                            className="p-2 text-on-surface-variant hover:text-error transition-colors"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="mt-8 flex justify-between items-center text-on-surface-variant font-label text-xs">
            <div>
              Mostrando{" "}
              <span className="text-on-surface font-bold">
                {(currentPage - 1) * PER_PAGE + 1}–
                {Math.min(currentPage * PER_PAGE, filtered.length)}
              </span>{" "}
              de{" "}
              <span className="text-on-surface font-bold">
                {filtered.length.toLocaleString("pt-BR")}
              </span>{" "}
              entradas
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-sm bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {pages.map((p, i) =>
                p === "..." ? (
                  <span key={`e${i}`} className="px-1">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 rounded-sm flex items-center justify-center font-bold transition-colors ${
                      currentPage === p
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-surface-container hover:bg-surface-container-high"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-sm bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <CardDialog
        isOpen={dialogOpen}
        editCard={editingCard}
        onClose={() => setDialogOpen(false)}
        onSave={(card) => { saveCard(card); setDialogOpen(false); }}
      />

      <ConfirmDialog
        isOpen={deletingCardId !== null}
        title="Deletar Carta"
        message="Tem certeza que deseja remover esta carta do grimório? Essa ação não pode ser desfeita."
        onConfirm={() => { deleteCard(deletingCardId!); setDeletingCardId(null); }}
        onCancel={() => setDeletingCardId(null)}
      />
    </div>
  );
}
