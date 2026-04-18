// --- UTILITY FUNCTIONS ---

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " ")).toUpperCase();
}

// Removing old variant image path logic

function getOriginalImagePath(originalFilename) {
    return `${IMAGE_BASE_FOLDER}/originals/${originalFilename}`;
}

function getVariantImagePath(baseId, paramKey, level) {
    const paddedLevel = level.toString().padStart(2, '0');
    return `${IMAGE_BASE_FOLDER}/${paramKey}/${baseId}_${paramKey}_${paddedLevel}.webp`;
}

// --- Smart Preloader Module ---

function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function preloadDemoAssets(advanceCallback) {
    const loadingOverlay = document.getElementById("loadingOverlay");
    const progressBar = document.getElementById("progressBar");
    const loadingText = document.getElementById("loadingText");
    const continueBtn = document.getElementById('startDemosBtn');

    if (continueBtn) continueBtn.disabled = true;
    loadingOverlay.classList.remove('hidden');
    progressBar.style.width = '0%';
    loadingText.textContent = "Loading Demos...";

    try {
        await preloadImage(getOriginalImagePath("tutorial.webp"));
        progressBar.style.width = `100%`;
    } catch (error) {
        console.warn(`Could not preload demo image`, error);
    }

    loadingText.textContent = "Loading complete!";
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        if (continueBtn) continueBtn.disabled = false;
        if (advanceCallback) advanceCallback();
    }, 250);
}

async function preloadTrialAssets(trialData, showOverlay = true) {
    if (state.preloadedTrials.has(trialData.trial_id)) return Promise.resolve();

    const loadingOverlay = document.getElementById("loadingOverlay");
    const progressBar = document.getElementById("progressBar");
    const loadingText = document.getElementById("loadingText");
    const continueBtn = document.getElementById("startTrialFromInstructionsBtn");

    if (showOverlay) {
        if (continueBtn) continueBtn.disabled = true;
        loadingOverlay.classList.remove("hidden");
        progressBar.style.width = "0%";
        loadingText.textContent = "Loading...";
    }

    let urlsToPreload = [];
    if (trialData.condition === "perceptual_recall" && trialData.original_image_filename) {
        urlsToPreload.push(getOriginalImagePath(trialData.original_image_filename));
    } else {
        urlsToPreload.push(getOriginalImagePath(`${trialData.base_image_id}.webp`));
    }

    let loadedCount = 0;
    for (const url of urlsToPreload) {
        try {
            await preloadImage(url);
            loadedCount++;
            if (showOverlay) {
                progressBar.style.width = `${Math.round((loadedCount / urlsToPreload.length) * 100)}%`;
            }
        } catch (error) {
            console.warn(`Could not preload image: ${url}`, error);
            loadedCount++;
        }
    }

    state.preloadedTrials.add(trialData.trial_id);

    if (showOverlay) {
        loadingText.textContent = "Loading complete!";
        setTimeout(() => {
            loadingOverlay.classList.add("hidden");
            if (continueBtn) continueBtn.disabled = false;
        }, 250);
    }
}

// --- ENGINE LOGIC ---

function setupSVGPosterizeFilter(N) {
    // Use a persistent inline SVG directly in the document for reliable filter id resolution
    const filterId = `svg-posterize-${N}`;
    if (document.getElementById(filterId)) {
        return `url(#${filterId})`;
    }

    let svgEl = document.getElementById("svgFiltersContainer");
    if (!svgEl) {
        svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgEl.id = "svgFiltersContainer";
        svgEl.setAttribute("width", "0");
        svgEl.setAttribute("height", "0");
        svgEl.style.position = "absolute";
        svgEl.style.overflow = "hidden";
        document.body.insertBefore(svgEl, document.body.firstChild);
    }

    if (N >= 256) return false; // Full precision: no filter needed

    const step = 1.0 / (N - 1);
    const tableValues = [];
    for (let i = 0; i < N; i++) {
        tableValues.push((i * step).toFixed(4));
    }
    const tableStr = tableValues.join(" ");

    const filterEl = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filterEl.id = filterId;

    const transfer = document.createElementNS("http://www.w3.org/2000/svg", "feComponentTransfer");
    ["feFuncR", "feFuncG", "feFuncB"].forEach(tag => {
        const fn = document.createElementNS("http://www.w3.org/2000/svg", tag);
        fn.setAttribute("type", "discrete");
        fn.setAttribute("tableValues", tableStr);
        transfer.appendChild(fn);
    });
    filterEl.appendChild(transfer);
    svgEl.appendChild(filterEl);

    return `url(#${filterId})`;
}

function getInterpolatedValue(paramArray, levelFloat) {
    const clamped = Math.max(1, Math.min(21, levelFloat));
    const lowerIdx = Math.floor(clamped) - 1;
    let upperIdx = Math.ceil(clamped) - 1;
    if (upperIdx >= paramArray.length) upperIdx = paramArray.length - 1;
    
    const weight = clamped - Math.floor(clamped);
    if (lowerIdx === upperIdx) return paramArray[lowerIdx];
    return paramArray[lowerIdx] * (1 - weight) + paramArray[upperIdx] * weight;
}

function applyFiltersToElement(imgEl, canvasEl, levels, activeParam, combinedMode) {
    // Provide a default config if any level is missing
    const defaultLevels = { brightness: 11, contrast: 11, saturation: 11, clarity: 21, precision: 21, detailedness: 21 };
    const cur = { ...defaultLevels, ...levels };

    const bValRaw = getInterpolatedValue(PARAM_VALUES.brightness, cur.brightness);
    const cValRaw = getInterpolatedValue(PARAM_VALUES.contrast, cur.contrast);
    const sVal = getInterpolatedValue(PARAM_VALUES.saturation, cur.saturation);
    const blurVal = getInterpolatedValue(PARAM_VALUES.clarity, cur.clarity);
    const dP1 = getInterpolatedValue(PARAM_VALUES.detailedness_p1, cur.detailedness);
    const dP2 = getInterpolatedValue(PARAM_VALUES.detailedness_p2, cur.detailedness);

    // Apply necessary mathematical scaling matching filter_test.html
    const bVal = 1 + (bValRaw / 100);
    const cVal = 1 + (cValRaw / 100);
    const dBri = 1 + (dP1 / 33);
    const dCon = 1 + (dP2 / 100);

    imgEl.style.display = 'block';
    if (canvasEl) canvasEl.style.display = 'none';

    let filterString = 'none';
    
    // Core Engine values
    const filterB = `brightness(${bVal.toFixed(3)})`;
    const filterC = `contrast(${cVal.toFixed(3)})`;
    const filterS = `saturate(${sVal})`;
    const filterBlur = `blur(${blurVal}px)`;
    const filterD = `brightness(${dBri.toFixed(3)}) contrast(${dCon.toFixed(3)})`;

    let filterP = '';
    const N = Math.round(getInterpolatedValue(PARAM_VALUES.precision, cur.precision));
    const svgUrl = setupSVGPosterizeFilter(N);
    if (svgUrl) {
        filterP = svgUrl;
    }

    if (combinedMode) {
        // Apply all filters linearly
        filterString = `${filterB} ${filterC} ${filterS} ${filterBlur} ${filterD}`;
        if (filterP) filterString += ` ${filterP}`;
    } else {
        if (activeParam === 'brightness')        filterString = filterB;
        else if (activeParam === 'contrast')     filterString = filterC;
        else if (activeParam === 'saturation')   filterString = filterS;
        else if (activeParam === 'clarity')      filterString = filterBlur;
        else if (activeParam === 'detailedness') filterString = `saturate(0) ${filterD}`;
        else if (activeParam === 'precision')    filterString = filterP || 'none';
        else if (activeParam === 'attention_check') filterString = filterB;
        else filterString = 'none';
    }

    imgEl.style.filter = filterString;
}

// --- UI Management ---

// showDiv logic moved to app.js

function setLanguage(lang) {
    state.currentLanguage = lang; // Update state
    document.getElementById("htmlTag").lang = lang;

    document.querySelectorAll("#languageSelector button").forEach((btn) => {
        btn.classList.toggle("active-lang", btn.dataset.lang === lang);
    });

    document.querySelectorAll("[data-lang-key]").forEach((el) => {
        const key = el.dataset.langKey;
        if (
            LANG_STRINGS[state.currentLanguage] &&
            LANG_STRINGS[state.currentLanguage][key]
        ) {
            el.innerHTML = LANG_STRINGS[state.currentLanguage][key];
        }
    });
}

function updateProgressBar() {
    // We need to access totalSteps and completedSteps. 
    // These are not in state yet? I should check state.js
    // I didn't put totalSteps/completedSteps in TaskState. I should add them.
    // For now I'll assume they are in state or globals.
    // I'll check state.js... I missed them.
    // I will add them to state.js in the next step or just use state.completedSteps if I add them.

    // Let's assume I'll add them to state.
    if (!state.totalSteps || state.totalSteps === 0) return;

    state.completedSteps++;
    const percent = (state.completedSteps / state.totalSteps) * 100;

    const bar = document.getElementById("globalProgressBar");
    if (bar) {
        bar.style.width = `${percent}%`;
    }
}

function generateParticipantID(length = 6) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "P-";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
