#!/usr/bin/env node
/**
 * Facebook Reels Prompt Generator - Node.js CLI
 *
 * Usage:
 *   Interactive mode:   node generate.js
 *   One-shot mode:      node generate.js --niche fitness --mood cinematic --lighting "golden hour"
 *   With custom detail: node generate.js -n food -m luxurious -l "soft studio" -c "with truffle shavings"
 *   List niches:        node generate.js --list
 *
 * Zero dependencies. Requires Node.js 14+.
 */
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const DATA_FILE = path.join(__dirname, "niches.json");

const isTTY = process.stdout.isTTY;
const C = isTTY
  ? {
      cyan: "\x1b[96m", magenta: "\x1b[95m", yellow: "\x1b[93m",
      green: "\x1b[92m", bold: "\x1b[1m", dim: "\x1b[2m", reset: "\x1b[0m",
    }
  : { cyan: "", magenta: "", yellow: "", green: "", bold: "", dim: "", reset: "" };

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`Error: ${DATA_FILE} not found.`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function parseArgs(argv) {
  const args = { custom: "" };
  const aliases = { n: "niche", m: "mood", l: "lighting", c: "custom", o: "output" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--list") { args.list = true; continue; }
    if (a.startsWith("--")) {
      const key = a.slice(2);
      args[key] = argv[++i];
    } else if (a.startsWith("-")) {
      const key = aliases[a.slice(1)] || a.slice(1);
      args[key] = argv[++i];
    }
  }
  return args;
}

function listNiches(data) {
  console.log(`\n${C.bold}${C.cyan}Available niches:${C.reset}\n`);
  Object.entries(data.niches).forEach(([key, n]) => {
    console.log(`  ${C.green}${key.padEnd(12)}${C.reset} ${n.label}`);
  });
  console.log(`\n${C.bold}Moods:${C.reset}    ${data.moods.join(", ")}`);
  console.log(`${C.bold}Lighting:${C.reset} ${data.lighting.join(", ")}\n`);
}

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, ans => resolve(ans.trim())));
}

async function promptChoice(rl, label, options, defaultIdx = 0) {
  console.log(`\n${C.bold}${C.cyan}${label}${C.reset}`);
  options.forEach((opt, i) => {
    const marker = i === defaultIdx ? `${C.dim}(default)${C.reset}` : "";
    console.log(`  ${C.green}${i + 1}.${C.reset} ${opt} ${marker}`);
  });
  while (true) {
    const choice = await ask(rl, `\n${C.yellow}Enter number [1-${options.length}]:${C.reset} `);
    if (!choice) return options[defaultIdx];
    const num = parseInt(choice, 10);
    if (Number.isInteger(num) && num >= 1 && num <= options.length) return options[num - 1];
    console.log(`${C.yellow}Invalid choice. Try again.${C.reset}`);
  }
}

async function interactive(data) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log(`\n${C.bold}${C.magenta}=== Facebook Reels Prompt Generator ===${C.reset}`);

  const nicheKeys = Object.keys(data.niches);
  const nicheLabels = nicheKeys.map(k => data.niches[k].label);
  const nicheLabel = await promptChoice(rl, "Choose a niche:", nicheLabels);
  const nicheKey = nicheKeys[nicheLabels.indexOf(nicheLabel)];

  const mood = await promptChoice(rl, "Choose a mood:", data.moods);
  const lighting = await promptChoice(rl, "Choose a lighting style:", data.lighting);
  const custom = await ask(rl, `\n${C.yellow}Custom detail (optional, press Enter to skip):${C.reset} `);

  rl.close();
  return { nicheKey, mood, lighting, custom };
}

function buildPrompts(data, nicheKey, mood, lighting, custom) {
  const n = data.niches[nicheKey];
  const customAdd = custom ? `, ${custom}` : "";
  const t2i = `${n.subject}${customAdd}, ${n.environment}, ${mood} photorealistic style, ${lighting} lighting, ${n.camera}, ${data.baseSuffix}`;
  const i2v = `${n.cameraMove}, ${n.motion}, natural physics, smooth motion, ${mood} mood, 5 second duration, no morphing artifacts`;
  const hook = n.hooks[Math.floor(Math.random() * n.hooks.length)];
  return { label: n.label, t2i, i2v, hook };
}

function render({ label, t2i, i2v, hook }) {
  const bar = "=".repeat(70);
  console.log(`\n${C.bold}${C.magenta}${bar}${C.reset}`);
  console.log(`${C.bold}Niche:${C.reset} ${label}`);
  console.log(`${C.bold}${C.magenta}${bar}${C.reset}\n`);

  console.log(`${C.bold}${C.cyan}[T2I] Text-to-Image Prompt${C.reset}`);
  console.log(`${C.green}${t2i}${C.reset}\n`);

  console.log(`${C.bold}${C.cyan}[I2V] Image-to-Video Prompt${C.reset}`);
  console.log(`${C.green}${i2v}${C.reset}\n`);

  console.log(`${C.bold}${C.cyan}Caption Hook${C.reset}`);
  console.log(`${C.yellow}${hook}${C.reset}\n`);

  console.log(`${C.dim}Tip: Use the T2I prompt in Midjourney/Leonardo/FLUX,`);
  console.log(`     then take the image into Runway/Kling/Pika with the I2V prompt.${C.reset}\n`);
}

function saveToFile({ label, t2i, i2v, hook }, outPath) {
  const content =
`# Reels Prompt — ${label}

## Text-to-Image
\`\`\`
${t2i}
\`\`\`

## Image-to-Video
\`\`\`
${i2v}
\`\`\`

## Caption Hook
> ${hook}
`;
  fs.writeFileSync(outPath, content, "utf-8");
  console.log(`${C.green}Saved to ${outPath}${C.reset}\n`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const data = loadData();

  if (args.list) { listNiches(data); return; }

  let nicheKey, mood, lighting, custom;
  if (args.niche && args.mood && args.lighting) {
    if (!data.niches[args.niche]) {
      console.error(`Error: unknown niche '${args.niche}'. Run --list to see options.`);
      process.exit(1);
    }
    ({ niche: nicheKey, mood, lighting, custom = "" } = args);
    nicheKey = args.niche;
  } else {
    ({ nicheKey, mood, lighting, custom } = await interactive(data));
  }

  const result = buildPrompts(data, nicheKey, mood, lighting, custom);
  render(result);
  if (args.output) saveToFile(result, args.output);
}

main().catch(err => {
  if (err.code === "ERR_USE_AFTER_CLOSE") return;
  console.error(err);
  process.exit(1);
});
