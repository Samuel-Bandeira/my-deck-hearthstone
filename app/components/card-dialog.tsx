import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export const CLASSES = [
  "Mago",
  "Paladino",
  "Caçador",
  "Druida",
  "Qualquer",
] as const;

export type CardClass = (typeof CLASSES)[number];
export type CardType = "Criatura" | "Magia";

export interface Card {
  id: string;
  name: string;
  description: string;
  cardClass: CardClass;
  cardType: CardType;
  manaCost: number;
  attack: number;
  defense: number;
}

export const CLASS_COLORS: Record<CardClass, string> = {
  Mago: "#9333ea",
  Paladino: "#eab308",
  Caçador: "#22c55e",
  Druida: "#a16207",
  Qualquer: "#d0c6b1",
};

interface CardDialogProps {
  isOpen: boolean;
  editCard: Card | null;
  onClose: () => void;
  onSave: (card: Card) => void;
}

interface StatStepperProps {
  icon: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
}

function StatStepper({ icon, label, value, onChange, max = 12 }: StatStepperProps) {
  return (
    <div className="space-y-3">
      <label className="font-label text-xs uppercase text-on-surface-variant tracking-tighter flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">{icon}</span>
        {label}
      </label>
      <div className="flex items-center justify-between bg-surface-container-lowest p-2 rounded-xl border border-outline-variant/20">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-primary transition-colors"
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
        <span className="text-2xl font-headline font-bold text-on-surface w-8 text-center">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-primary transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
    </div>
  );
}

function CardPreview({
  name,
  description,
  cardClass,
  cardType,
  manaCost,
  attack,
  defense,
}: Omit<Card, "id">) {
  const color = CLASS_COLORS[cardClass];

  return (
    <div className="w-full md:w-[360px] bg-surface-container-low flex flex-col items-center justify-center p-8 relative overflow-hidden shrink-0">
      <div
        className="absolute inset-0 blur-[100px] pointer-events-none"
        style={{ background: `${color}18` }}
      />
      <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-8 font-label relative z-10">
        Visualização do Grimório
      </p>
      <div className="relative w-64 h-80 group cursor-default">
        <div
          className="absolute -inset-2 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: `${color}33` }}
        />
        <div className="relative h-full w-full card-frame rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
          <div className="absolute top-2 left-2 w-12 h-12 z-20 flex items-center justify-center">
            <div className="mana-gem w-full h-full absolute" />
            <span className="relative z-30 font-headline font-bold text-2xl text-white drop-shadow-md">
              {manaCost}
            </span>
          </div>
          <div
            className="h-48 w-full relative overflow-hidden flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${color}2a 0%, #0f131f 100%)`,
            }}
          >
            <span
              className="material-symbols-outlined opacity-25"
              style={{
                fontSize: "80px",
                color,
                fontVariationSettings: "'FILL' 1",
              }}
            >
              {cardType === "Magia" ? "auto_fix_high" : "swords"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f131f] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 w-full px-2 py-1 bg-[#4d4636]/90 backdrop-blur-sm border-y border-primary/30 -rotate-1 translate-y-2 z-10">
              <h3 className="text-center font-headline text-lg font-bold text-primary truncate tracking-tight">
                {name || "Nome da Carta"}
              </h3>
            </div>
          </div>
          <div className="flex-1 p-4 pt-6 flex flex-col items-center justify-center text-center overflow-hidden">
            <p className="text-xs text-on-surface-variant font-body leading-tight italic line-clamp-3">
              {description
                ? `"${description}"`
                : '"Descreva os poderes desta carta..."'}
            </p>
          </div>
          <div className="absolute bottom-[-10px] left-0 w-full px-2 flex justify-between z-20">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-outline drop-shadow-xl"
                style={{ fontSize: "56px", fontVariationSettings: "'FILL' 1" }}
              >
                swords
              </span>
              <span className="absolute z-10 font-headline font-black text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {attack}
              </span>
            </div>
            <div className="relative w-14 h-14 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-outline drop-shadow-xl"
                style={{ fontSize: "56px", fontVariationSettings: "'FILL' 1" }}
              >
                shield
              </span>
              <span className="absolute z-10 font-headline font-black text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {defense}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center gap-2 text-center max-w-[200px] relative z-10">
        <span className="text-[10px] font-label text-on-surface-variant/60 uppercase tracking-tighter">
          Tipo da Carta
        </span>
        <span
          className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
          style={{
            background: `${color}1a`,
            color,
            borderColor: `${color}33`,
          }}
        >
          {cardClass} • {cardType}
        </span>
      </div>
    </div>
  );
}

export default function CardDialog({
  isOpen,
  editCard,
  onClose,
  onSave,
}: CardDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cardClass, setCardClass] = useState<CardClass>("Mago");
  const [cardType, setCardType] = useState<CardType>("Criatura");
  const [manaCost, setManaCost] = useState(1);
  const [attack, setAttack] = useState(1);
  const [defense, setDefense] = useState(1);

  useEffect(() => {
    if (!isOpen) return;
    if (editCard) {
      setName(editCard.name);
      setDescription(editCard.description);
      setCardClass(editCard.cardClass);
      setCardType(editCard.cardType);
      setManaCost(editCard.manaCost ?? 1);
      setAttack(editCard.attack);
      setDefense(editCard.defense);
    } else {
      setName("");
      setDescription("");
      setCardClass("Qualquer");
      setCardType("Criatura");
      setManaCost(1);
      setAttack(1);
      setDefense(1);
    }
  }, [isOpen, editCard]);

  if (!isOpen) return null;

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      id: editCard?.id ?? "",
      name: name.trim(),
      description: description.trim(),
      cardClass,
      cardType,
      manaCost,
      attack,
      defense,
    });
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-panel w-full max-w-[900px] max-h-[92vh] overflow-hidden border border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors z-[110]"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
        <div className="flex-1 p-8 overflow-y-auto border-r border-outline-variant/30 flex flex-col">
          <header className="mb-8">
            <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight">
              {editCard ? "Editar Carta" : "Nova Carta"}
            </h2>
            <p className="text-on-surface-variant font-label text-sm uppercase tracking-widest mt-1">
              {editCard
                ? "Modificando entidade do grimório"
                : "Invocando uma nova entidade ao grimório"}
            </p>
          </header>
          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="font-label text-xs uppercase text-on-surface-variant tracking-tighter">
                Nome do Recipiente
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-outline-variant focus:border-primary text-lg py-2 transition-all outline-none placeholder:text-on-surface-variant/40"
                placeholder="Ex: Arquimago do Caos"
                type="text"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase text-on-surface-variant tracking-tighter">
                Inscrição Arcana (Efeito)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 focus:border-primary/50 rounded-lg p-3 text-sm transition-all resize-none placeholder:text-on-surface-variant/40 outline-none"
                placeholder="Descreva os poderes e maldições desta carta..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label text-xs uppercase text-on-surface-variant tracking-tighter">
                  Linhagem (Classe)
                </label>
                <select
                  value={cardClass}
                  onChange={(e) => setCardClass(e.target.value as CardClass)}
                  className="w-full bg-surface-container-high border border-outline-variant/20 hover:border-primary/40 px-4 py-3 rounded-lg text-sm transition-all cursor-pointer outline-none text-on-surface"
                >
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-label text-xs uppercase text-on-surface-variant tracking-tighter">
                  Essência (Tipo)
                </label>
                <div className="flex p-1 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
                  {(["Criatura", "Magia"] as CardType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCardType(t)}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all ${
                        cardType === t
                          ? "bg-primary text-on-primary shadow-lg"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-4">
              <StatStepper
                icon="water_drop"
                label="Custo de Mana"
                value={manaCost}
                onChange={setManaCost}
                max={10}
              />
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <StatStepper
                icon="swords"
                label="Poder de Ataque"
                value={attack}
                onChange={setAttack}
                max={10}
              />
              <StatStepper
                icon="shield"
                label="Resistência"
                value={defense}
                onChange={setDefense}
                max={10}
              />
            </div>
          </div>
          <div className="mt-12 flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border border-outline-variant/30 hover:bg-white/5 transition-all"
            >
              Cancelar Ritual
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-[1.5] py-4 text-xs font-bold uppercase tracking-widest bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0_4px_20px_rgba(230,195,88,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Salvar Carta
            </button>
          </div>
        </div>
        <CardPreview
          name={name}
          description={description}
          cardClass={cardClass}
          cardType={cardType}
          manaCost={manaCost}
          attack={attack}
          defense={defense}
        />
      </div>
    </div>,
    document.body,
  );
}
