"use client";

import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { IPA_CATEGORIES } from "@/lib/ipa";
import { finishLatex, latexToIpa } from "@/lib/latex";
import { speakIpa } from "@/lib/speech";

export default function Home() {
  const [text, setText] = useState("");
  const [activeId, setActiveId] = useState(IPA_CATEGORIES[0].id);
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const active = IPA_CATEGORIES.find((c) => c.id === activeId) ?? IPA_CATEGORIES[0];

  // Sets the value and moves the caret after React has rendered it.
  function setTextAndCaret(value: string, caret: number) {
    setText(value);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const caret = e.target.selectionStart ?? raw.length;
    const before = latexToIpa(raw.slice(0, caret));
    const after = latexToIpa(raw.slice(caret));
    setTextAndCaret(before + after, before.length);
    setStatus("");
  }

  function insertSymbol(symbol: string) {
    const el = inputRef.current;
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    const before = finishLatex(text.slice(0, start)) + symbol;
    setTextAndCaret(before + text.slice(end), before.length);
  }

  async function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    // Enter also ends a command still being typed, e.g. "\theta".
    const finished = finishLatex(text);
    if (finished !== text) setTextAndCaret(finished, finished.length);
    const ipa = finished.trim();
    if (!ipa) return;
    try {
      setStatus(`Playing /${ipa}/…`);
      const skipped = await speakIpa(ipa);
      setStatus(skipped.length ? `Skipped sounds the speech engine doesn't have: ${[...new Set(skipped)].join(" ")}` : "");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not play audio.");
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-8">
      <h1 className="text-center text-4xl font-medium text-text sm:text-5xl">
        Phonetic Alphabet Study Tool
      </h1>

      <input
        ref={inputRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type IPA using LaTeX or by table below"
        aria-label="IPA input. Press Enter to hear it."
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        className="ipa mt-6 w-full bg-transparent px-1 py-2 text-center text-2xl text-text outline-none placeholder:text-text/40 sm:text-left sm:text-3xl"
      />
      <p className="mt-1 text-sm text-text/50">
        End a LaTeX command with a space, e.g. <code>\theta</code> → θ. Press Enter to hear it.
      </p>
      <p className="mt-1 min-h-6 text-sm text-accent" role="status" aria-live="polite">
        {status}
      </p>

      <section className="mt-8 flex max-h-[50vh] flex-col rounded-xl bg-primary p-4 text-background sm:p-6">
        <div role="tablist" className="mb-4 flex shrink-0 flex-wrap justify-center gap-x-5 gap-y-2">
          {IPA_CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={c.id === activeId}
              onClick={() => setActiveId(c.id)}
              className={`cursor-pointer font-bold ${
                c.id === activeId ? "text-secondary underline underline-offset-4" : "hover:text-secondary"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="ipa-scroll min-h-0 overflow-y-scroll pr-2">
          <div className="grid grid-cols-4 border-l-2 border-t-2 border-background sm:grid-cols-6 md:grid-cols-8">
            {active.symbols.map((s) => (
              <button
                key={s.symbol}
                onClick={() => insertSymbol(s.symbol)}
                title={s.latex ? `${s.name} — ${s.latex}` : s.name}
                aria-label={`Insert ${s.symbol}, ${s.name}`}
                className="ipa flex h-16 cursor-pointer items-center justify-center border-r-2 border-b-2 border-background text-3xl transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none sm:text-4xl"
              >
                {s.display ?? s.symbol}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
