import { IPA_CATEGORIES } from "./ipa";

const TIE = "͡";

// Simple commands (\name) -> symbol, built from the table data (tipa names).
const COMMANDS = new Map<string, string>();
for (const category of IPA_CATEGORIES) {
  for (const { symbol, latex } of category.symbols) {
    const m = latex?.match(/^\\([A-Za-z]+)$/);
    if (m) COMMANDS.set(m[1], symbol);
  }
}

// Standard LaTeX Greek letter names, mapped to the IPA symbol people mean by
// them. IPA uses Latin ɸ for \phi, ɣ for \gamma, ɛ for \epsilon and ʊ for
// \upsilon rather than the Greek letters.
const GREEK_ALIASES: Record<string, string> = {
  theta: "θ",
  beta: "β",
  chi: "χ",
  phi: "ɸ",
  gamma: "ɣ",
  epsilon: "ɛ",
  varepsilon: "ɛ",
  upsilon: "ʊ",
};
for (const [name, symbol] of Object.entries(GREEK_ALIASES)) {
  if (!COMMANDS.has(name)) COMMANDS.set(name, symbol);
}

/**
 * Replaces LaTeX commands with IPA symbols, following LaTeX's rules for where
 * a command name ends:
 * - a space or `{}` ends it and is removed: `\theta ` -> `θ`, `\ae{}b` -> `æb`
 * - any other non-letter ends it and is kept: `\theta\ae ` -> `θæ`
 * A command at the very end of the text is left alone, since it may still be
 * being typed. Also supports `\t{ab}` (tie bar) and `\c{c}` (ç).
 */
export function latexToIpa(input: string): string {
  return input
    .replace(/\\c\{c\}/g, "ç")
    .replace(/\\t\{(\S)(\S)\}/gu, (_, a: string, b: string) => a + TIE + b)
    .replace(
      /\\([A-Za-z]+)(\{\}| )?/g,
      (match, name: string, sep: string | undefined, offset: number, whole: string) => {
        const ended = Boolean(sep) || offset + match.length < whole.length;
        return ended && COMMANDS.has(name) ? COMMANDS.get(name)! : match;
      },
    );
}

/** Like latexToIpa, but also converts a command at the very end of the text. */
export function finishLatex(input: string): string {
  const out = latexToIpa(input + " ");
  return out.endsWith(" ") ? out.slice(0, -1) : out;
}
