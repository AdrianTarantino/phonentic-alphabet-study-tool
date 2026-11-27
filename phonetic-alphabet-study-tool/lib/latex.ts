import { IPA_CATEGORIES } from "./ipa";

const TIE = "͡";

// Simple commands (\name) -> symbol, built from the table data.
const COMMANDS = new Map<string, string>();
for (const category of IPA_CATEGORIES) {
  for (const { symbol, latex } of category.symbols) {
    const m = latex?.match(/^\\([A-Za-z]+)$/);
    if (m) COMMANDS.set(m[1], symbol);
  }
}

const COMMAND_NAMES = [...COMMANDS.keys()];

function isPrefixOfLongerCommand(name: string): boolean {
  return COMMAND_NAMES.some((c) => c.length > name.length && c.startsWith(name));
}

/**
 * Replaces tipa-style LaTeX commands with IPA symbols.
 *
 * A command converts as soon as no longer command starts with it, or once any
 * non-letter follows it. A trailing `{}` ends a command and is removed, as in
 * LaTeX (e.g. `\ae{}b` -> `æb`). Also supports `\t{ab}` (tie bar) and `\c{c}`.
 */
export function latexToIpa(input: string): string {
  let text = input
    .replace(/\\c\{c\}/g, "ç")
    .replace(/\\t\{(\S)(\S)\}/gu, (_, a: string, b: string) => a + TIE + b);

  text = text.replace(
    /\\([A-Za-z]+)(\{\})?/g,
    (match, name: string, braces: string | undefined, offset: number, whole: string) => {
      const ended = Boolean(braces) || offset + match.length < whole.length;
      if (COMMANDS.has(name) && (ended || !isPrefixOfLongerCommand(name))) {
        return COMMANDS.get(name)!;
      }
      if (!ended && isPrefixOfLongerCommand(name)) return match; // still typing
      // The letters run past a command, e.g. "\ox" -> "øx".
      for (let i = name.length - 1; i > 0; i--) {
        const head = name.slice(0, i);
        if (COMMANDS.has(head)) return COMMANDS.get(head)! + name.slice(i) + (braces ?? "");
      }
      return match;
    },
  );
  return text;
}
