# phonentic-alphabet-study-tool

## Colours

[Realtime Colours](https://www.realtimecolors.com/?colors=f5f7ea-070803-cddda0-2e813f-59c399&fonts=Inter-Inter)

| Category | Hex Code |
| ---------- | -------- |
| Text | #f5f7ea |
| Background | #070803 |
| Primary | #cddda0 |
| Secondary | #2e813f | 
| Accent | #59c399 |
## Typing IPA with LaTeX

The input accepts commands from the LaTeX [`tipa`](https://ctan.org/pkg/tipa) package, e.g. `\textschwa` → ə, `\textesh` → ʃ, `\ae` → æ, `\t{ts}` → t͡s, `\c{c}` → ç. Hover a table cell to see its command.
A command turns into its symbol as soon as it can't be the start of a longer command, or when the next character is typed. End it with `{}` to join it to letters, e.g. `\ae{}b` → æb.

## Audio

Pressing Enter calls `speakIpa` in `phonetic-alphabet-study-tool/lib/speech.ts`. Browsers' built-in speech synthesis reads text, not IPA, so a speech engine that accepts phonemes still needs to be connected there.
