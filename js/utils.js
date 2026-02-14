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

function getVariantImagePath(baseImageId, paramKey, level) {
    // If the parameter is an attention check, we need to get an image from a REAL parameter's folder.
    // We can just default to using the 'brightness' folder for this purpose.
    const folderParam =
        paramKey === "attention_check" ? "brightness" : paramKey;

    const levelStr = level < 10 ? "0" + level : level.toString();

    // Construct the path using the corrected folder parameter.
    return `${IMAGE_BASE_FOLDER}/${folderParam}/${baseImageId}_${folderParam}_${levelStr}${IMAGE_EXTENSION}`;
}

function getOriginalImagePath(originalFilename) {
    return `${IMAGE_BASE_FOLDER}/originals/${originalFilename}`;
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

    // 1. Show the loading overlay and disable the continue button
    if (continueBtn) continueBtn.disabled = true;
    loadingOverlay.classList.remove('hidden');
    progressBar.style.width = '0%';
    loadingText.textContent = "Loading Demos...";

    // 2. Create the list of all image URLs needed for the demos
    let urlsToPreload = [];
    // We need to access DEMO_PARAMS. Since it was defined in index.html, we need to make sure it's available.
    // It was NOT in config.js. I need to add it to config.js or define it here.
    // It relies on getVariantImagePath, so it fits here or in config.js.
    // I'll assume it's in config.js (I missed it in the previous step, I will add it).

    // Wait, I missed DEMO_PARAMS in config.js. I need to add it.
    // For now I will define it locally or assume it's global.
    // I'll fix config.js in a moment.

    // RE-DEFINING DEMO_PARAMS HERE TEMPORARILY OR GLOBALLY IF IT WAS MISSED
    const DEMO_PARAMS_LOCAL = [
        { key: "brightness", image: getVariantImagePath("tutorial", "brightness", 11) },
        { key: "contrast", image: getVariantImagePath("tutorial", "contrast", 11) },
        { key: "saturation", image: getVariantImagePath("tutorial", "saturation", 11) },
        { key: "clarity", image: getVariantImagePath("tutorial", "clarity", 11) },
        { key: "detailedness", image: getVariantImagePath("tutorial", "detailedness", 11) },
        { key: "precision", image: getVariantImagePath("tutorial", "precision", 11) },
    ];

    DEMO_PARAMS_LOCAL.forEach(demo => {
        // For each demo, we need all 21 variants for its slider
        for (let level = 1; level <= 21; level++) {
            urlsToPreload.push(getVariantImagePath('tutorial', demo.key, level));
        }
    });

    // 3. Preload all images and update the progress bar
    let loadedCount = 0;
    const totalToLoad = urlsToPreload.length;

    for (const url of urlsToPreload) {
        try {
            await preloadImage(url);
            loadedCount++;
            const percent = Math.round((loadedCount / totalToLoad) * 100);
            progressBar.style.width = `${percent}%`;
        } catch (error) {
            console.warn(`Could not preload demo image: ${url}`, error);
            loadedCount++; // Increment anyway to not get stuck
        }
    }

    // 4. Hide overlay and proceed to the first demo
    loadingText.textContent = "Loading complete!";
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        if (continueBtn) continueBtn.disabled = false;
        // Now that everything is loaded, start the demos
        if (advanceCallback) advanceCallback();
    }, 250);
}

async function preloadTrialAssets(trialData, showOverlay = true) {
    if (state.preloadedTrials.has(trialData.trial_id)) return Promise.resolve();

    const loadingOverlay = document.getElementById("loadingOverlay");
    const progressBar = document.getElementById("progressBar");
    const loadingText = document.getElementById("loadingText");
    const continueBtn = document.getElementById("startTrialFromInstructionsBtn");

    // 1. Show the loading overlay and disable the continue button if requested
    if (showOverlay) {
        if (continueBtn) continueBtn.disabled = true;
        loadingOverlay.classList.remove("hidden");
        progressBar.style.width = "0%";
        loadingText.textContent = "Loading...";
    }

    // 2. Create the list of all image URLs needed for this trial
    let urlsToPreload = [];

    // For perceptual recall, the original image is the most important
    if (trialData.condition === "perceptual_recall") {
        urlsToPreload.push(
            getOriginalImagePath(trialData.original_image_filename)
        );
    }

    // Add ALL parameter images (1-21) for all real parameters
    const realParameters = Object.keys(PARAMETERS).filter(
        (p) => p !== "attention_check"
    );
    realParameters.forEach((paramKey) => {
        for (let level = 1; level <= 21; level++) {
            urlsToPreload.push(
                getVariantImagePath(trialData.base_image_id, paramKey, level)
            );
        }
    });

    // 3. Preload all images and update the progress bar if overlay is visible
    let loadedCount = 0;
    const totalToLoad = urlsToPreload.length;

    for (const url of urlsToPreload) {
        try {
            await preloadImage(url);
            loadedCount++;
            if (showOverlay) {
                const percent = Math.round((loadedCount / totalToLoad) * 100);
                progressBar.style.width = `${percent}%`;
            }
        } catch (error) {
            console.warn(`Could not preload image: ${url}`, error);
            loadedCount++;
        }
    }

    // Mark as preloaded
    state.preloadedTrials.add(trialData.trial_id);

    // 4. Hide overlay and re-enable the button if overlay was shown
    if (showOverlay) {
        loadingText.textContent = "Loading complete!";
        setTimeout(() => {
            loadingOverlay.classList.add("hidden");
            if (continueBtn) continueBtn.disabled = false;
        }, 250);
    }
}

// --- UI Management ---

function showDiv(divToShowIdOrElement) {
    // List of all possible screen IDs
    const allScreenIds = [
        "mainMenu",
        "welcomeScreen",
        "consentScreen",
        "visualCalibrationScreen",
        "demographicsScreen",
        "howToScreen",
        "perceptualRecallIntroScreen",
        "episodicRecallIntroScreen",
        "sceneImaginationIntroScreen",
        "flowIntroScreen",
        "approximationIntroScreen",
        "quizScreen",
        "paramIntroScreen",
        "paramDemoScreen",
        "practiceIntroScreen",
        "tutorialPromptScreen",
        "readyScreen",
        "parameterSelector",
        "conditionInstructionScreen",
        "preVimScreenContainer",
        "vimTaskInterface",
        "vviqScreen",
        "resultsDisplay",
        "breakScreen",
    ];

    // Resolve the element to show
    let divToShow = divToShowIdOrElement;
    if (typeof divToShowIdOrElement === 'string') {
        divToShow = document.getElementById(divToShowIdOrElement);
    }

    // 1. Unconditionally hide every single screen.
    allScreenIds.forEach((id) => {
        const div = document.getElementById(id);
        if (div) div.classList.add("hidden");
    });

    // 2. Clear any lingering keyboard focus from the previous screen.
    if (typeof clearAllFocus === 'function') {
        clearAllFocus();
    }

    const langSelector = document.getElementById("languageSelector");

    // 3. If a specific screen was requested, show it.
    if (divToShow) {
        divToShow.classList.remove("hidden");

        // Check if the screen being shown is the main menu
        if (divToShow.id === "mainMenu") {
            if (langSelector) langSelector.classList.remove("hidden"); // Show language buttons
            if (typeof setupMainMenuFocus === 'function') setupMainMenuFocus();
        } else {
            if (langSelector) langSelector.classList.add("hidden"); // Hide language buttons on all other screens
        }

        // --- Handle setting initial focus for the new screen ---
        if (divToShow.id === "parameterSelector") {
            if (typeof setupParameterSelectorFocus === 'function') setupParameterSelectorFocus();
        } else if (divToShow.id === "conditionInstructionScreen") {
            // We need to access state or global variables here if we want to be precise,
            // but for now we can just find the button.
            const btn = document.getElementById("startTrialFromInstructionsBtn");
            if (btn && typeof updateKeyboardFocus === 'function') {
                // We need to set currentFocusableElements in state
                state.currentFocusableElements = [btn];
                updateKeyboardFocus(0);
            }
        } else if (divToShow.id === "vimTaskInterface") {
            const coarseStepDiv = document.getElementById("coarseStep");
            if (coarseStepDiv && !coarseStepDiv.classList.contains("hidden")) {
                if (typeof setupCoarseStepFocus === 'function') setupCoarseStepFocus();
            }
        }
    } else {
        // If we are hiding everything (e.g., in-between states), also hide the selector
        if (langSelector) langSelector.classList.add("hidden");
    }
}

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
