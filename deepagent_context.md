## 1 Project Snapshot  

• **Project name:** Vividness in Visual Imagery Matching (ViVIM)  
  The public repository is hosted at <https://github.com/negatoscope/ViVIM> (current tag `v0.9.3`).  

• **One-sentence goal:** Develop, validate, and publish a fully open, web-based psychophysical task that maps the
  multidimensional structure of offline visual experiences, together with a preregistered manuscript, analysis pipeline,
  and anonymised dataset.  

• **Primary domain:** Experimental psychology, web software, and data science.  

• **Current delivery model:**  
  The experiment runs as a self-contained static site (`index.html` + `images/`) that is auto-deployed on every push to
  the `main` branch via Abacus.AI static-site hosting; the latest build is always reachable at  
  <https://vivim-staging.abacus.ai>.  

• **Source-control expectations for DeepAgent:**  
  1. Clone the repo read-only for analysis; when editing, create branch `deepagent/refinement-step5`.  
  2. Run the test suite (`npm run lint && npx playwright test`) in the container; abort if any check fails.  
  3. If tests pass, commit changes, push the branch, and open a pull-request targeting `main`.  
  4. Attach lint reports, Playwright screenshots, and the live staging URL to the PR description.  

• **Short-term objectives (next two weeks):**  
  – Complete **Step 5: Final minor tweaks and text changes** in `index.html`, then merge to `main`.  
  – Submit the finalised ethics documents (Memoria, Solicitud, Consentimiento Informado) to the university committee.  
  – Update the Stage 1 Registered Report manuscript with the final power-analysis numbers and submit to
    *Neuroscience of Consciousness*.  

• **Mid-term objectives (3–6 months):**  
  – Obtain full ethics approval and Stage 1 in-principle acceptance.  
  – Recruit and test N = 70 participants with the refined task; data flow relies on the existing Google Apps Script →  
    Google Sheets backend.  

• **Long-term objectives (publication phase):**  
  – Execute the preregistered analysis plan and the exploratory Qualia-Structure RDM analysis in `analyze_data.py`.  
  – Submit and publish the Stage 2 manuscript; release the ViVIM toolkit and anonymised dataset on OSF.  

• **Acceptance criteria:**  
  A task refinement branch merged and deployed without test regressions; ethics documents received by the committee;
  Stage 1 manuscript formally submitted; post-refinement build verified to load, collect, and log data correctly; and all
  subsequent deliverables tracked through GitHub milestones.

## 3 Current State of Work
### 3.1 Completed so far
- **Core Application Development:** A feature-complete, stable prototype of the ViVIM task (`index.html`) has been built
  using vanilla HTML, CSS, and JavaScript. It is ready for data collection.
- **Stimulus Generation:** A Python script (`gmic_image_generator.py`) to systematically create all image variants has
  been completed.
- **Analysis Pipeline:** A Python script (`analyze_data.py`) to fetch, clean, transform, and analyse the data from
  Google Sheets is complete.
- **Pilot Study:** A pilot study with N=11 participants was successfully conducted to validate the task, gather
  feedback, and estimate effect sizes.
- **Pilot Analysis & Power Analysis:** The pilot data was fully analysed, confirming the viability of the core
  hypotheses and providing the basis for a formal power analysis determining a sample size of N=70.
- **Manuscript & Ethics Drafts:** A strong draft of the Introduction and Methods for a Stage 1 Registered Report exists.
  Initial drafts of all required ethics documents have been prepared.

### 3.2 Partially done / in progress
- **Application Refinement:** We are in the final stages of implementing a multi-step plan to refine `index.html`
  based on pilot feedback. We have just completed **Step 4 (Major Instructional Overhaul)**.

### 3.3 Still outstanding / blocked
- **Final Manuscript Updates:** The manuscript needs to be updated with the results of the final power analysis and any
  procedural changes from the current refinement phase. **Owner:** User. **Blockers:** None.
- **Ethics Submission:** Final documents need to be submitted to the university ethics committee. **Owner:** User.
  **Blockers:** None.
- **Stage 1 Submission:** Manuscript needs to be submitted to the journal. **Owner:** User. **Blockers:** Completion of
  application refinements and manuscript updates.
- **Main Data Collection:** **Blocked** by ethics approval and Stage 1 in-principle acceptance.

## 4 Asset Inventory

| Path | Type | Purpose | Notes |
|---|---|---|---|
| `index.html` | HTML | The core, self-contained web application for the ViVIM experiment. | In refinement. |
| `analyze_data.py` | Python | Fetches, processes, and performs all statistical analyses on the data. | Assumes data schema in 4.1. |
| `gmic_image_generator.py`| Python | Generates the 21-level image stimuli for all 6 parameters. | Completed. |
| `images/` | Folder | Contains all stimulus images and instructional diagrams. | Needs asset renaming (`blurriness`->`clarity`). |
| `docs/manuscript.md` | Markdown | Draft of the Stage 1 Registered Report. | In progress. |
| `docs/ethics/` | Folder | Contains all documents for ethics committee submission. | In progress. |

### 4.1 Data Schema
The `index.html` application sends data to the Google Sheet in a long format. The resulting CSV that `analyze_data.py`
consumes is expected to have the following columns for each parameter rating:
- `sessionID`: Unique identifier for the participant session.
- `trial_id`: Identifier for the trial (e.g., `main_1`, `VVIQ`).
- `condition`: `perceptual_recall`, `episodic_recall`, or `scene_imagination`.
- `image_id`: The base image used for the trial (e.g., `image01`).
- `parameter`: The quality being rated (e.g., `clarity`, `brightness`).
- `selected_level`: The final numeric rating (1-21) or `'no_info'`.
- `confidence`: The confidence rating (1-7).
- `rt`: The response time in ms for that parameter.
- `generation_rt`: The imagery generation/holding time for that trial.
- `vviq_1`, `vviq_2`, ... `vviq_32`: Columns for VVIQ responses.

## 5 Environment & Dependencies
- **Runtime versions:** Python 3.9+, Modern Web Browser (Chrome, Firefox).
- **Third-party libraries:** Create a `requirements.txt` file via `pip freeze > requirements.txt`. Expects `pandas`
  and `scipy`.
- **Hardware or GPU needs:** None.
- **Install / build commands:** `pip install -r requirements.txt`

### 5.1 Full Project Setup Workflow
1.  **(First time only) Install Dependencies:** Run `pip install pandas scipy`. Install the G'MIC command-line tool.
2.  **(First time only) Generate Stimuli:** Run `python gmic_image_generator.py` to create the full set of image variants
    in the `images/` directory.
3.  **(First time only) Set up Data Backend:**
    - Create a new Google Sheet.
    - Create a new Google Apps Script, paste in the provided script code, and deploy as a web app with anonymous access.
    - Copy the web app URL into the `GOOGLE_SCRIPT_URL` constant in `index.html`.
    - Copy the Google Sheet's CSV export URL into the `GOOGLE_SHEET_URL` constant in `analyze_data.py`.
4.  **Host the Experiment:** Serve `index.html` and the `images/` folder on a web server (e.g., GitHub Pages).
5.  **Collect Data:** Participants access the URL and complete the task. Data is automatically sent to the Google Sheet.
6.  **Analyze Data:** Run `python analyze_data.py` to fetch the latest data and generate the full results report.

## 6 Configuration & Secrets (placeholders only)
```javascript
// In index.html
const GOOGLE_SCRIPT_URL = "<URL_OF_GOOGLE_APPS_SCRIPT_FOR_DATA_SUBMISSION>";
``````python
# In analyze_data.py
GOOGLE_SHEET_URL = "<EXPORT_URL_OF_GOOGLE_SHEET_CONTAINING_DATA>";
```

## 7 External Services
- **Google Apps Script / Google Sheets:** Receives anonymous participant data via POST requests from the web application and
  writes it to a Google Sheet.
- **GitHub Pages:** Hosts the `index.html` file, making the experiment publicly accessible.

## 8 Known Constraints & Risks
- **Data Privacy:** All data collection must remain strictly anonymous. The current design adheres to this.
- **Participant Fatigue:** The experiment duration (~40 mins) requires careful instructional design and scheduled breaks
  (already implemented) to maintain data quality.
- **Peer Review:** The project's progression is dependent on a successful Stage 1 review for the Registered Report.

## 9 Theoretical Overview & Hypotheses
This project is designed to test the theoretical framework of Fazekas et al. (2020), which deconstructs the phenomenal
quality of "vividness" into two primary, modality-general dimensions:
1.  **Subjective Intensity:** The salience or force of an experience, determined by prothetic qualities. We operationalize
    this with `Brightness`, `Contrast`, and `Saturation`.
2.  **Subjective Specificity:** The determinacy and level of detail of an experience, determined by metathetic qualities.
    We operationalize this with `Clarity` (the inverse of blurriness), `Detailedness`, and `Color Precision`.

The ViVIM task measures these six dimensions to compare three distinct forms of offline perception: Perceptual Recall (a
proxy for visual working memory), Episodic Recall (autobiographical memory), and Scene Imagination (voluntary construction).

**Primary Hypotheses:**
- **H1 (Vividness Hierarchy):** We predict a main effect of condition. Perceptual Recall will yield the highest
  fidelity scores (for Specificity), followed by Episodic Recall, with Scene Imagination yielding the lowest scores.
- **H2 (Dissociation of Dimensions):** We predict that Subjective Intensity and Subjective Specificity are dissociable,
  evidenced by distinct patterns of results for their respective composite scores across the three conditions.
- **H3 (Convergent Validity):** We predict that a composite "Total Vividness" score from the ViVIM task will show a
  significant, positive correlation with participants' total VVIQ-2 scores.

An exploratory goal is to analyze the data through the **Qualia Structure** framework (related to IIT), by constructing
Representational Dissimilarity Matrices (RDMs) from the 6D response vectors to map the relational geometry of these
phenomenal states.

## 10 Key Design Decisions & Rationale
- **Six-Parameter Model:** The choice of parameters is a direct operationalization of the Fazekas et al. (2020) framework.
- **`Clarity` over `Blurriness`:** `blurriness` was inverted to `clarity` based on pilot feedback to harmonize the
  directionality of all Specificity parameters (higher is "better"), simplifying analysis and participant understanding.
- **Perceptual Recall Design:** Pilot data confirmed this condition is a valid proxy for mnemonic judgment.
- **Afterimage Reduction Protocol:** The Perceptual Recall procedure was refined (mid-gray background, 900ms presentation,
  ISI with jitter) to minimize contamination from retinal afterimages and better isolate the short-term memory component.
- **Qualia Structure / RDM Analysis:** This planned exploratory analysis aims to frame the results in terms of the relational
  geometry of phenomenal states, connecting the project to foundational theories of consciousness.

## 11 Desired Deliverables from DeepAgent
- Continue the collaborative, step-by-step process of refining the `index.html` application based on the established plan.
- Assist in drafting and refining sections of the Stage 1 Registered Report manuscript, ensuring consistency with the
  finalised experimental design.
- Provide consultation on advanced data analysis strategies (e.g., Qualia Structure/RDM analysis) and interpretation of
  results.

## 12 References & Previous Conversations
- The primary source of truth is the conversation log leading to the creation of this document.
- **Theoretical Frameworks:**
  - Fazekas, P., Nemeth, G., & Overgaard, M. (2020).
  - The Qualia Structure project (N. Tsuchiya) and Integrated Information Theory (IIT).

## 13 Next-Step Guidance
- Review the `Partially done / in progress` section (3.2) to understand the last completed action.
- Prompt the user to begin **Step 5: Final Minor Tweaks and Text Changes**, which is the final step in the established
  application refinement plan.