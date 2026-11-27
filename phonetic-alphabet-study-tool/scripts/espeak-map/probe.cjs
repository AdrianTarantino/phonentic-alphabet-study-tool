// Asks eSpeak NG which IPA each phoneme code of each voice produces.
// Usage (with public/espeak served at http://localhost:3124):
//   node probe.cjs jobs.json probe.json
// jobs.json: [{ voice, table, names: [phoneme codes] }], with the codes taken
// from the phoneme tables in eSpeak NG's phsource/ directory.
const { chromium } = require('playwright'); const fs=require('fs');
(async () => {
  const jobs = JSON.parse(fs.readFileSync(process.argv[2]));
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:3124/espeak/espeak-ng.js');
  const res = await p.evaluate(async (jobs) => {
    const { default: E } = await import('/espeak/espeak-ng.js');
    const run = async (args) => { const l=[]; await E({arguments:args, print:s=>l.push(s), printErr:s=>l.push('ERR '+s)}); return l; };
    const out = [];
    for (const j of jobs) {
      const r = { voice: j.voice, table: j.table, map: {}, mismatch: 0, err: null };
      for (let i = 0; i < j.names.length; i += 40) {
        const chunk = j.names.slice(i, i + 40);
        const lines = await run(['-q','--ipa','-v',j.voice,'[['+chunk.join(' ')+']]']);
        if (lines.some(x=>x.startsWith('ERR'))) { r.err = lines.join('|').slice(0,200); break; }
        const words = lines.join(' ').trim().split(/\s+/);
        if (words.length === chunk.length) chunk.forEach((n,k)=> r.map[n]=words[k]);
        else { r.mismatch++;
          for (const n of chunk) { const w=(await run(['-q','--ipa','-v',j.voice,'[['+n+']]'])).join(' ').trim(); r.map[n]=w; } }
      }
      out.push(r);
    }
    return out;
  }, jobs);
  fs.writeFileSync(process.argv[3], JSON.stringify(res));
  await b.close();
})();
