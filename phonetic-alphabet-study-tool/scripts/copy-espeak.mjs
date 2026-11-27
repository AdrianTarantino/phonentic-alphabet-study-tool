// Copies the eSpeak NG WebAssembly build into public/ so the browser can load
// it on demand instead of bundling 18 MB into the page. Runs on npm install,
// and before npm run dev / npm run build.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const src = `${root}node_modules/espeak-ng/dist/`;
const dest = `${root}public/espeak/`;

if (!existsSync(src)) {
  console.error("The espeak-ng package is not installed. Run `npm install`, then try again.");
  process.exit(1);
}
mkdirSync(dest, { recursive: true });
for (const file of ["espeak-ng.js", "espeak-ng.wasm"]) cpSync(src + file, dest + file);
