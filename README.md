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

Pressing Enter speaks the IPA with [eSpeak NG](https://github.com/espeak-ng/espeak-ng), compiled to WebAssembly (npm package [`espeak-ng`](https://www.npmjs.com/package/espeak-ng)). `npm install`, `npm run dev` and `npm run build` copy it into `public/espeak/`, and the browser loads it the first time you press Enter (about 18 MB).

eSpeak doesn't read IPA. It reads its own phoneme codes, and each language voice has its own set. `lib/espeak-map.json` lists, for each IPA sound, the code in each voice that eSpeak itself reports as that sound (via `--ipa`). It was generated with the scripts in `scripts/espeak-map/`. A word is spoken by the voice that can say the most of it, English voices first; if no single voice can say all of it, it is split between voices.

Symbols with no matching sound in this eSpeak build are skipped and listed under the input: the clicks (ʘ ǀ ǃ ǂ ǁ), the implosives ɓ ʄ ɠ ʛ, the ejective mark ʼ, and ɞ ɥ ɦ ɧ ɮ ɰ ɱ ɶ ɺ ʏ ʙ ʜ ʟ ʡ ʢ ⱱ ˑ. Affricates with no single eSpeak sound (such as b͡v or t͡θ) are played as their two parts.

eSpeak NG is licensed under GPL-3.0-or-later, which matters if you distribute this app.

## Hosting on GitHub Pages

`.github/workflows/deploy-pages.yml` builds the app as a static site (`output: "export"` in `next.config.ts`) and publishes it to GitHub Pages on every push to `main`.

One-time setup: in the repository on GitHub, go to **Settings → Pages**, and under **Build and deployment → Source** choose **GitHub Actions**. The site is then published at `https://<your-username>.github.io/phonentic-alphabet-study-tool/`.

To check the static build locally: `npm run build`, then `npm start` (serves `out/`). Locally the site runs from `/`; on Pages the workflow sets `PAGES_BASE_PATH` to the repository's sub-path.
