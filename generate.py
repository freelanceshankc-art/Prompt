#!/usr/bin/env python3
"""
Facebook Reels Prompt Generator - Python CLI

Usage:
  Interactive mode:    python generate.py
  One-shot mode:       python generate.py --niche fitness --mood cinematic --lighting "golden hour"
  With custom detail:  python generate.py -n food -m luxurious -l "soft studio" -c "with truffle shavings"
  List niches:         python generate.py --list

Requires only the Python standard library (3.7+).
"""
import argparse
import json
import random
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
DATA_FILE = SCRIPT_DIR / "niches.json"


# ANSI colors (auto-disabled if not a TTY)
class C:
    if sys.stdout.isatty():
        CYAN = "\033[96m"
        MAGENTA = "\033[95m"
        YELLOW = "\033[93m"
        GREEN = "\033[92m"
        BOLD = "\033[1m"
        DIM = "\033[2m"
        RESET = "\033[0m"
    else:
        CYAN = MAGENTA = YELLOW = GREEN = BOLD = DIM = RESET = ""


def load_data():
    if not DATA_FILE.exists():
        print(f"Error: {DATA_FILE} not found.", file=sys.stderr)
        sys.exit(1)
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def list_niches(data):
    print(f"\n{C.BOLD}{C.CYAN}Available niches:{C.RESET}\n")
    for key, n in data["niches"].items():
        print(f"  {C.GREEN}{key:<12}{C.RESET} {n['label']}")
    print(f"\n{C.BOLD}Moods:{C.RESET}    {', '.join(data['moods'])}")
    print(f"{C.BOLD}Lighting:{C.RESET} {', '.join(data['lighting'])}\n")


def prompt_choice(label, options, default_idx=0):
    print(f"\n{C.BOLD}{C.CYAN}{label}{C.RESET}")
    for i, opt in enumerate(options, 1):
        marker = f"{C.DIM}(default){C.RESET}" if i - 1 == default_idx else ""
        print(f"  {C.GREEN}{i}.{C.RESET} {opt} {marker}")
    while True:
        choice = input(f"\n{C.YELLOW}Enter number [1-{len(options)}]:{C.RESET} ").strip()
        if not choice:
            return options[default_idx]
        if choice.isdigit() and 1 <= int(choice) <= len(options):
            return options[int(choice) - 1]
        print(f"{C.YELLOW}Invalid choice. Try again.{C.RESET}")


def interactive(data):
    print(f"\n{C.BOLD}{C.MAGENTA}=== Facebook Reels Prompt Generator ==={C.RESET}")

    niche_keys = list(data["niches"].keys())
    niche_labels = [data["niches"][k]["label"] for k in niche_keys]
    niche_label = prompt_choice("Choose a niche:", niche_labels)
    niche_key = niche_keys[niche_labels.index(niche_label)]

    mood = prompt_choice("Choose a mood:", data["moods"])
    lighting = prompt_choice("Choose a lighting style:", data["lighting"])

    custom = input(f"\n{C.YELLOW}Custom detail (optional, press Enter to skip):{C.RESET} ").strip()

    return niche_key, mood, lighting, custom


def build_prompts(data, niche_key, mood, lighting, custom):
    n = data["niches"][niche_key]
    custom_add = f", {custom}" if custom else ""

    t2i = (
        f"{n['subject']}{custom_add}, {n['environment']}, "
        f"{mood} photorealistic style, {lighting} lighting, "
        f"{n['camera']}, {data['baseSuffix']}"
    )
    i2v = (
        f"{n['cameraMove']}, {n['motion']}, natural physics, "
        f"smooth motion, {mood} mood, 5 second duration, no morphing artifacts"
    )
    hook = random.choice(n["hooks"])
    return n["label"], t2i, i2v, hook


def render(label, t2i, i2v, hook):
    bar = "=" * 70
    print(f"\n{C.BOLD}{C.MAGENTA}{bar}{C.RESET}")
    print(f"{C.BOLD}Niche:{C.RESET} {label}")
    print(f"{C.BOLD}{C.MAGENTA}{bar}{C.RESET}\n")

    print(f"{C.BOLD}{C.CYAN}[T2I] Text-to-Image Prompt{C.RESET}")
    print(f"{C.GREEN}{t2i}{C.RESET}\n")

    print(f"{C.BOLD}{C.CYAN}[I2V] Image-to-Video Prompt{C.RESET}")
    print(f"{C.GREEN}{i2v}{C.RESET}\n")

    print(f"{C.BOLD}{C.CYAN}Caption Hook{C.RESET}")
    print(f"{C.YELLOW}{hook}{C.RESET}\n")

    print(f"{C.DIM}Tip: Use the T2I prompt in Midjourney/Leonardo/FLUX,")
    print(f"     then take the image into Runway/Kling/Pika with the I2V prompt.{C.RESET}\n")


def save_to_file(label, t2i, i2v, hook, path):
    content = (
        f"# Reels Prompt — {label}\n\n"
        f"## Text-to-Image\n```\n{t2i}\n```\n\n"
        f"## Image-to-Video\n```\n{i2v}\n```\n\n"
        f"## Caption Hook\n> {hook}\n"
    )
    Path(path).write_text(content, encoding="utf-8")
    print(f"{C.GREEN}Saved to {path}{C.RESET}\n")


def main():
    parser = argparse.ArgumentParser(
        description="Generate Facebook Reels prompts (T2I + I2V) for any niche.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("-n", "--niche", help="Niche key (e.g. fitness, food, fashion)")
    parser.add_argument("-m", "--mood", help="Mood/vibe (e.g. cinematic, energetic)")
    parser.add_argument("-l", "--lighting", help="Lighting style (e.g. golden hour, neon)")
    parser.add_argument("-c", "--custom", default="", help="Optional custom detail")
    parser.add_argument("--list", action="store_true", help="List all available niches")
    parser.add_argument("-o", "--output", help="Save the result to a markdown file")
    args = parser.parse_args()

    data = load_data()

    if args.list:
        list_niches(data)
        return

    if args.niche and args.mood and args.lighting:
        if args.niche not in data["niches"]:
            print(f"Error: unknown niche '{args.niche}'. Run --list to see options.", file=sys.stderr)
            sys.exit(1)
        niche_key, mood, lighting, custom = args.niche, args.mood, args.lighting, args.custom
    else:
        niche_key, mood, lighting, custom = interactive(data)

    label, t2i, i2v, hook = build_prompts(data, niche_key, mood, lighting, custom)
    render(label, t2i, i2v, hook)

    if args.output:
        save_to_file(label, t2i, i2v, hook, args.output)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nCancelled.")
        sys.exit(0)
