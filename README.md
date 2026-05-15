# Facebook Reels Prompt Generator

An interactive tool to generate AI-ready prompts for **text-to-image (T2I)** and **image-to-video (I2V)** content optimized for **Facebook Reels, Instagram Reels, TikTok, and YouTube Shorts**.

Pick a niche, choose a mood and lighting style, add a custom detail — get instant copy-paste prompts plus a viral caption hook.

---

## Features

- **12 niche templates**: Fitness, Food, Fashion, Motivation, Comedy, Travel, Beauty, Pets, Tech, Business, Real Estate, Education
- **Customizable mood & lighting** for unique results every time
- **Optional custom detail** input (clothing, props, location, etc.)
- **One-click copy** for both prompts and caption hooks
- **9:16 vertical optimized** with negative space for text overlays
- **Zero dependencies** — pure HTML/CSS/JS, runs in any browser

---

## How to Use

### Option 1: Use the Web App

1. Open `index.html` in any browser (double-click the file, or host it on GitHub Pages)
2. Select your **niche** from the dropdown
3. Pick a **mood** and **lighting style**
4. (Optional) Add a custom detail like *"wearing a red jacket"* or *"with cherry blossoms"*
5. Click **Generate Prompts**
6. Copy the T2I prompt, I2V prompt, and caption hook

### Option 2: Browse the Reference Doc

Open `master-prompts.md` for hand-crafted prompts for every niche in pure markdown — perfect for quick copy-paste.

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
├── index.html          # Interactive prompt generator (open in browser)
├── master-prompts.md   # Markdown reference of all niches
└── README.md           # This file
```

---

## License

Free to use for any creator. Build amazing Reels.
