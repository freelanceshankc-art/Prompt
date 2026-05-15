# Facebook Reels Prompt Generator

Generate AI-ready prompts for **text-to-image (T2I)** and **image-to-video (I2V)** content optimized for **Facebook Reels, Instagram Reels, TikTok, and YouTube Shorts**.

Pick a niche → choose a mood and lighting style → add a custom detail → get instant copy-paste prompts plus a viral caption hook.

---

## Three Ways to Use It

| Tool | Best For | How to Run |
|------|----------|------------|
| `index.html` | Visual users, mobile-friendly | Open in any browser |
| `generate.py` | Terminal users, automation, scripting | `python generate.py` |
| `generate.js` | Node.js users, integration into apps | `node generate.js` |
| `master-prompts.md` | Quick copy-paste reference | Read directly on GitHub |

All three tools share the same data source: **`niches.json`** — edit one file, update everywhere.

---

## Features

- **12 niche templates**: Fitness, Food, Fashion, Motivation, Comedy, Travel, Beauty, Pets, Tech, Business, Real Estate, Education
- **Customizable mood & lighting** for unique results every run
- **Optional custom detail** input (clothing, props, location, etc.)
- **Random viral caption hooks** per niche
- **9:16 vertical optimized** with negative space for text overlays
- **Zero dependencies** — pure HTML/CSS/JS, Python stdlib, Node stdlib

---

## 1. Web App (`index.html`)

Open `index.html` in any browser. Or host it on GitHub Pages:

1. Repo Settings → Pages → Source: `main` branch, root folder
2. Live at `https://<username>.github.io/Prompt/`

The web app loads `niches.json` if served, or falls back to embedded data when opened as a local file.

---

## 2. Python CLI (`generate.py`)

Requires Python 3.7+ (no pip install needed).

```bash
# Interactive mode (recommended for first-time users)
python generate.py

# One-shot mode
python generate.py --niche fitness --mood cinematic --lighting "golden hour"

# With custom detail
python generate.py -n food -m luxurious -l "soft studio" -c "with truffle shavings"

# Save to file
python generate.py -n travel -m calm -l "golden hour" -o my-reel.md

# List all niches
python generate.py --list
```

---

## 3. Node.js CLI (`generate.js`)

Requires Node.js 14+ (zero dependencies).

```bash
# Interactive mode
node generate.js

# One-shot mode
node generate.js --niche fashion --mood dramatic --lighting "neon"

# With custom detail and save
node generate.js -n beauty -m luxurious -l "soft studio" -c "rose gold tones" -o reel.md

# List all niches
node generate.js --list
```

---

## Workflow: From Prompt to Reel

```
1. T2I Prompt  →  Midjourney / Leonardo.ai / FLUX / Stable Diffusion  →  Image
2. Image       →  Runway Gen-3 / Kling / Pika / Luma Dream Machine    →  Video clip
3. Video clip  →  CapCut / InShot                                     →  Add caption hook + trending audio
4. Export 9:16 →  Upload to Facebook Reels
```

---

## Recommended AI Tools

| Stage | Free / Affordable | Premium |
|-------|------------------|---------|
| **Text-to-Image** | Leonardo.ai, Bing Image Creator, SDXL | Midjourney, FLUX Pro |
| **Image-to-Video** | Pika, Luma Dream Machine (free tier) | Runway Gen-3, Kling Pro, Sora |
| **Editing** | CapCut, InShot | Adobe Premiere, DaVinci Resolve |

---

## Customizing the Niches

Want to add your own niche or tweak existing ones? Just edit **`niches.json`**:

```json
{
  "niches": {
    "yourNicheKey": {
      "label": "Your Niche Name",
      "subject": "main subject description",
      "environment": "where the scene takes place",
      "camera": "camera and lens specs",
      "motion": "what moves in the video",
      "cameraMove": "how the camera moves",
      "hooks": ["Caption 1", "Caption 2", "Caption 3"]
    }
  }
}
```

All three tools (web, Python, Node) will pick up your changes automatically.

---

## Pro Tips

1. **Hook in frame 1** — the first frame must stop the scroll
2. **Leave 20% headroom** at top for caption text
3. **High-contrast subjects** read better on mobile screens
4. **Keep I2V prompts simple** — too many motion instructions cause AI artifacts
5. **Trending audio** beats silent Reels every time
6. **Post consistently** — algorithm rewards 1-3 Reels per day
7. **Test thumbnails** — the cover frame matters as much as the video

---

## File Structure

```
Prompt/
├── index.html          # Interactive web app
├── generate.py         # Python CLI
├── generate.js         # Node.js CLI
├── niches.json         # Shared data source for all generators
├── master-prompts.md   # Markdown reference of all niches
└── README.md           # This file
```

---

## License

Free to use for any creator. Build amazing Reels.
