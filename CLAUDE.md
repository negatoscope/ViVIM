# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ViVIM (Vividness in Visual Imagery Matching)** is a web-based psychophysical research task that measures multidimensional qualities of visual imagery across three conditions: Perceptual Recall, Episodic Recall, and Scene Imagination. Built for academic research at the University of Navarra, it collects data via Prolific and stores responses in Google Sheets. The project is a Stage 1 Registered Report targeting *Neuroscience of Consciousness*.

**Current status:** The app is feature-complete. The manuscript and cover letter are nearly finished. Remaining work before submission: final manuscript review, end-to-end Prolific validation test, small pilot (n=10), and OSF preregistration setup. See `VIM_documentation/carogar_to_dos.md` for the full prioritized task list.

## Tech Stack

Pure vanilla HTML/CSS/JavaScript — no build system, no bundler, no npm. The app is a static site auto-deployed to Abacus.AI on push to `main`.

## Running Locally

```bash
python -m http.server 8000
# Open http://localhost:8000
```

To simulate a Prolific participant session:
```
http://localhost:8000?PROLIFIC_PID=test123&STUDY_ID=study456&SESSION_ID=sess789
```

## Architecture

Four JS modules loaded by `index.html` (no ES module imports — all globals):

- **`js/config.js`** (~1000 lines) — All constants, debug flags, 6 parameter definitions (brightness, contrast, saturation, clarity, detailedness, color precision), `IMAGE_DATA` array (12 stimuli), `LANG_STRINGS` (EN/ES translations), VVIQ-2 questionnaire data, and external service URLs (Google Apps Script, Prolific).

- **`js/state.js`** (~175 lines) — Single global `state` object. Holds session identity, trial progress, calibration data, and all collected responses. Implements crash recovery via `saveToLocalStorage()` / `loadFromLocalStorage()` with context-aware TTL (5 minutes for Prolific sessions, 10 seconds for debug/main menu).

- **`js/utils.js`** (~315 lines) — Stateless helpers: `shuffleArray()` (Fisher-Yates), `getUrlParameter()` (Prolific ID parsing), `getVariantImagePath()` / `getOriginalImagePath()` (image path builders), `preloadImage()`, `preloadDemoAssets()`.

- **`js/app.js`** (~1900 lines) — All application logic. DOM references cached in a `dom` object at the top. Screen navigation via `showDiv()` (hides all screens, shows target). Contains the full onboarding flow (17+ steps), trial execution loop, the 3-step VIM rating interface, VVIQ-2 questionnaire, and data submission.

## Key Patterns

**Screen management:** The UI is a set of `<div>` screens toggled with `showDiv()`. Each screen is shown/hidden via a `.hidden` CSS class. There is no router.

**Onboarding order:** Welcome → Consent → Calibration (Müller-Lyer) → Demographics → How-to / Condition intros → Parameter demos → Practice intro → Flow intro → Approximation intro → Quiz → Tutorial prompt → Practice trial → Ready screen → Main task.

**Trial flow (per image):** Condition instruction → Fixation (2000ms) → [Image display 900ms for perceptual recall only] → Blank (600ms) → Blink prompt (1000ms) → Hold-in-mind instruction → 6 parameter ratings (each: Coarse [Low/Mid/High] → Fine-tune slider [1-7 within range] → Confidence Likert [1-7]).

**Counterbalancing:** Three Latin Square sets (A/B/C) control condition assignment per image. Set is fetched from the Google Apps Script backend, with fallback to URL param or hash-based assignment.

**Localization:** HTML elements use `data-lang-key` attributes. `setLanguage(lang)` iterates all tagged elements and sets text from `LANG_STRINGS[lang]`.

**Data flow:** Trial responses accumulate in `state.allCollectedResponses`. Each completed trial is also sent to Google Sheets in real-time via `saveTrialToServer()` (fire-and-forget). A final batch POST happens at task completion via `sendDataToGoogleSheet()`. Local JSON download is also available.

**Crash recovery:** State auto-saves to localStorage after each completed parameter. On page load, checks for a valid backup (within TTL) and resumes at the current trial. TTL is determined by URL: Prolific sessions get 5 minutes, main menu sessions get 10 seconds.

## Conditions

The manuscript uses "Perceptual Recall" (not "Visual Working Memory") for the condition where participants view a photo briefly and recall it. The code uses `perceptual_recall` internally. The three conditions are:
- `perceptual_recall` — short-term recall of a just-perceived stimulus (900ms image display)
- `episodic_recall` — retrieval of autobiographical memories
- `scene_imagination` — constructive generation of novel scenes

## Image Assets

12 base images × 6 parameters × 21 levels = ~1,512 WEBP variant files under `images/{parameter}/`. Naming convention: `{image_id}_{parameter}_{level:02d}.webp` (e.g., `image01_brightness_04.webp`). Originals are in `images/originals/`.

## Debug Flags (in config.js)

- `DEBUG_SHOW_RESULTS` — Skip to results screen
- `DEBUG_SKIP_BREAK_TIMER` — Skip break countdown between trials
- `KEYBOARD_INPUTS_ENABLED` — Toggle keyboard navigation

## Pre-deployment Checklist

- [ ] Replace `PROLIFIC_COMPLETION_URL` placeholder (`cc=YOUR_CODE_HERE`) in `config.js` with the real Prolific completion code
- [ ] Same placeholder is hardcoded in calibration failure redirect (`app.js:841`) — update there too

## Data Analysis

`analyze_data.py` fetches data from Google Sheets and runs the analysis pipeline. Image variants are generated by `gmic_image_generator.py` using G'MIC CLI.

## Important Constraints

- All participant data must remain strictly anonymous (no names, no IPs)
- The app targets desktop browsers only; a landscape orientation overlay blocks mobile use
- The Google Apps Script URL in `config.js` is the live data endpoint — do not change it without coordination
- Attention check trials are embedded within 3 of the 12 main trials (randomized placement), not separate trials
- "No clear impression" responses are stored as `'no_info'` string — converted to minimum vividness at the analysis stage
