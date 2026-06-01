# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**ViVIM (Vividness in Visual Imagery Matching)** is a web-based psychophysical research task that measures multidimensional qualities of visual imagery across three conditions: Perceptual Recall, Episodic Recall, and Scene Imagination. Built for academic research at the University of Navarra, it collects data via Prolific and stores responses in Google Sheets.

**Current status (2026-06-01):** Stage 1 Registered Report **accepted** at *Neuroscience of Consciousness*. In preparation for Stage 2 data collection. Remaining work: Prolific pilot (5–10 participants), data collection (N=70, optional stopping from N=60), automated Bayesian analysis pipeline.

## Deployment

- **Live site:** `https://www.luiseudave.com/ViVIM/` (GitHub Pages, custom domain)
- **Repository:** `github.com/negatoscope/ViVIM` — push to `main` triggers automatic redeployment
- **Test/admin URL:** `https://www.luiseudave.com/ViVIM/?admin=vivim2025`
- **Prolific study URL pattern:** `https://www.luiseudave.com/ViVIM/?PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}`

## Tech Stack

Pure vanilla HTML/CSS/JavaScript — no build system, no bundler, no npm. The app is a static site.

## Running Locally

```bash
# Using Bun (preferred)
bunx serve . --listen 8000

# Or Python fallback
python3 -m http.server 8000
```

To simulate a Prolific participant session:
```
http://localhost:8000?PROLIFIC_PID=test123&STUDY_ID=study456&SESSION_ID=sess789
```

Admin/test mode (skips some production checks):
```
http://localhost:8000?admin=vivim2025
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

12 base images in `images/originals/`. Parameter variant images (brightness, contrast, etc.) are **NOT stored as files** — the engine generates them in real-time via CSS filters and Canvas rendering. Only originals and `images/instructions/` are on disk.

## Data Analysis

```bash
# Live analysis from Google Sheets
python3 analyze_data.py

# Automated Bayesian monitoring (run when N ≥ 60)
bun run tools/vivim-monitor.ts           # live Sheets data
bun run tools/vivim-monitor.ts --local   # test with VIVIM_pilot_data.csv
```

`analysis_pipeline.R` contains the full Bayesian analysis with optional stopping rule (BF > 6 or < 1/6 for all 4 criteria; hard stop N=150).

## Prolific Configuration

- **Completion code (success):** `C168B2T5`
- **Completion code (calibration failure / screened out):** `CLBIA383`
- **Google Apps Script endpoint:** set in `js/config.js` as `GOOGLE_APPS_SCRIPT_URL` — do not change without coordination
- **Google Sheets data URL:** `https://docs.google.com/spreadsheets/d/1DmUF3NcYdlHPqYfa4kIMSLx5XTkdNDA_Qsz_fsGOawI/export?format=csv`

## Debug Flags (in config.js)

- `DEBUG_SHOW_RESULTS` — Skip to results screen
- `DEBUG_SKIP_BREAK_TIMER` — Skip break countdown between trials
- `KEYBOARD_INPUTS_ENABLED` — Toggle keyboard navigation

## Pre-deployment Checklist

- [x] Stage 1 RR accepted
- [ ] Insert real Prolific completion code `C168B2T5` in `config.js` (`PROLIFIC_COMPLETION_URL`)
- [ ] Insert screened-out code in `app.js` ~line 841 (calibration failure redirect)
- [ ] Pilot study (5–10 Prolific participants) — verify full workflow and data integrity
- [ ] Push to `main` when ready to launch

## Important Constraints

- All participant data must remain strictly anonymous (no names, no IPs)
- The app targets desktop browsers only; a landscape orientation overlay blocks mobile use
- The Google Apps Script URL in `config.js` is the live data endpoint — do not change it without coordination
- Attention check trials are embedded within 3 of the 12 main trials (randomized placement), not separate trials
- "No clear impression" responses are stored as `'no_info'` string — converted to minimum vividness at the analysis stage
