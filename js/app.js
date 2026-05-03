// --- DOM ELEMENTS ---
const dom = {
    accessDeniedScreen: document.getElementById("accessDeniedScreen"),
    mainMenu: document.getElementById("mainMenu"),
    welcomeScreen: document.getElementById("welcomeScreen"),
    visualCalibrationScreen: document.getElementById("visualCalibrationScreen"),
    howToScreen: document.getElementById("howToScreen"),
    paramIntroScreen: document.getElementById("paramIntroScreen"),
    paramDemoScreen: document.getElementById("paramDemoScreen"),
    practiceIntroScreen: document.getElementById("practiceIntroScreen"),
    tutorialPromptScreen: document.getElementById("tutorialPromptScreen"),
    readyScreen: document.getElementById("readyScreen"),
    parameterSelector: document.getElementById("parameterSelector"),
    conditionInstructionScreen: document.getElementById("conditionInstructionScreen"),
    preVimScreenContainer: document.getElementById("preVimScreenContainer"),
    vimTaskInterface: document.getElementById("vimTaskInterface"),
    resultsDisplay: document.getElementById("resultsDisplay"),
    breakScreen: document.getElementById("breakScreen"),
    vviqScreen: document.getElementById("vviqScreen"),
    quizScreen: document.getElementById("quizScreen"),

    // Intro Screens
    perceptualRecallIntroScreen: document.getElementById("perceptualRecallIntroScreen"),
    episodicRecallIntroScreen: document.getElementById("episodicRecallIntroScreen"),
    sceneImaginationIntroScreen: document.getElementById("sceneImaginationIntroScreen"),
    approximationIntroScreen: document.getElementById("approximationIntroScreen"),

    // Buttons
    startActualTaskBtn: document.getElementById("startActualTaskBtn"),
    testParameterBtn: document.getElementById("testParameterBtn"),
    startDemosBtn: document.getElementById("startDemosBtn"),
    nextDemoBtn: document.getElementById("nextDemoBtn"),
    prevDemoBtn: document.getElementById("prevDemoBtn"),
    startExperimentBtn: document.getElementById("startExperimentBtn"),
    downloadResultsBtn: document.getElementById("downloadResultsBtn"),
    backToMenuFromResultsBtn: document.getElementById("backToMenuFromResultsBtn"),
    confirmConfidenceBtn: document.getElementById('confirmConfidenceBtn'),
    confirmFinalVerificationBtn: document.getElementById('confirmFinalVerificationBtn'),
    backToMenuFromTaskBtn: document.getElementById('backToMenuFromTaskBtn'),
    testVVIQBtn: document.getElementById("testVVIQBtn"),
    backToMenuFromTestSelectBtn: document.getElementById("backToMenuFromTestSelectBtn"),
    testDataUploadBtn: document.getElementById("testDataUploadBtn"),

    // VIM Interface
    coarseStep: document.getElementById("coarseStep"),
    fineTuneStep: document.getElementById("fineTuneStep"),
    confidenceStep: document.getElementById("confidenceStep"),
    paramDemoSlider: document.getElementById("paramDemoSlider"),
    paramDemoImg: document.getElementById("paramDemoImg"),
    fineTuneSlider: document.getElementById("fineTuneSlider"),
    fineTuneImg: document.getElementById("fineTuneImg"),

    // Progress
    globalProgressBar: document.getElementById("globalProgressBar"),
    globalProgressContainer: document.getElementById("globalProgressContainer"),

    // Other
    loadingOverlay: document.getElementById("loadingOverlay"),
    saveStatus: document.getElementById("saveStatus"),

    // Prolific Completion
    // Onboarding
    welcomeContinueBtn: document.getElementById('welcomeContinueBtn'),
    // Consent
    consentScreen: document.getElementById('consentScreen'),
    consentCheckboxes: document.querySelectorAll('.consent-check'),
    consentContinueBtn: document.getElementById('consentContinueBtn'),
    // Prolific
    prolificCompletionSection: document.getElementById("prolificCompletionSection"),
    completionCodeDisplay: document.getElementById("completionCodeDisplay"),
    countdownSeconds: document.getElementById("countdownSeconds"),
    manualRedirectLink: document.getElementById("manualRedirectLink"),
    loadingText: document.getElementById("loadingText"),
    progressBar: document.getElementById("progressBar"),
    resultsList: document.getElementById("resultsList"),
    resultsTitle: document.querySelector('#resultsDisplay [data-lang-key="resultsTitle"]'),
    demographicsScreen: document.getElementById("demographicsScreen"),
    demographicsContinueBtn: document.getElementById("demographicsContinueBtn")
};

// --- ONBOARDING FLOW ---
const ONBOARDING_FLOW = [
    'welcomeScreen',
    'consentScreen',
    'visualCalibrationScreen',
    'cardCalibrationScreen',
    'demographicsScreen',
    'howToScreen',
    'perceptualRecallIntroScreen',
    'episodicRecallIntroScreen',
    'sceneImaginationIntroScreen',
    'paramIntroScreen',
    'preloadDemos',
    'paramDemos',
    'practiceIntroScreen',
    'approximationIntroScreen',
    'quizScreen',
    'tutorialPromptScreen',
    'practiceTrial',
    'readyScreen'
];

function showDiv(divElement) {
    if (!divElement) {
        console.warn("[showDiv] Called with null/undefined element");
        return;
    }
    console.log(`[UI] Showing screen: ${divElement.id}`);

    // Hide ONLY the main screen containers
    const containers = document.querySelectorAll('.main-container, .split-container');
    containers.forEach(c => c.classList.add('hidden'));

    // Show the target screen
    divElement.classList.remove('hidden');

    // Language selector visibility (only on main menu)
    const langSelector = document.getElementById("languageSelector");
    if (langSelector) {
        if (divElement.id === "mainMenu" || divElement === dom.mainMenu) {
            langSelector.classList.remove("hidden");
        } else {
            langSelector.classList.add("hidden");
        }
    }
}

// --- INITIALIZATION ---

document.addEventListener("DOMContentLoaded", () => {
    state.reset();

    // --- CHECK FOR VALID SESSION BACKUP (Crash Recovery) ---
    const backup = state.loadFromLocalStorage();
    if (backup) {
        console.log('[Resume] Valid session backup found. Restoring state...');
        state.restoreFromBackup(backup);

        // Resume to the correct point in the task
        if (state.currentSessionTrials.length > 0 && state.currentGlobalTrialIndex < state.currentSessionTrials.length) {
            setLanguage(state.currentLanguage || "en");
            // Resume directly to the condition instructions for the current trial
            console.log(`[Resume] Resuming at trial ${state.currentGlobalTrialIndex + 1}/${state.currentSessionTrials.length}`);
            showConditionInstructions(state.currentSessionTrials[state.currentGlobalTrialIndex]);
            setupEventListeners();
            return; // Skip the normal boot sequence
        }
    }

    // --- PROLIFIC INTEGRATION: Parse URL Parameters ---
    state.prolificPID = getUrlParameter("PROLIFIC_PID");
    state.studyID = getUrlParameter("STUDY_ID");
    state.sessionID = getUrlParameter("SESSION_ID");

    setLanguage("en");

    // Check screen size immediately and on every resize
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    // Check for demo mode
    state.isDemoMode = getUrlParameter("mode") === "DEMO";

    // If Prolific PID is present, bypass Main Menu
    if (state.prolificPID) {
        state.isProlificRun = true;
        console.log("Prolific Participant Detected:", state.prolificPID);
        showDiv(dom.welcomeScreen);
    } else if (state.isDemoMode) {
        console.log("Demo mode active — data submission suppressed.");
        showDiv(dom.welcomeScreen);
    } else if (getUrlParameter("admin") === ADMIN_KEY) {
        showDiv(dom.mainMenu);
    } else {
        showDiv(dom.accessDeniedScreen);
    }

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) document.body.classList.add("touch-device");

    setupEventListeners();
});

function setupEventListeners() {
    // Main Menu
    dom.startActualTaskBtn.addEventListener('click', startOnboarding);
    dom.testParameterBtn.addEventListener('click', () => {
        populateParameterSelector();
        showDiv(dom.parameterSelector);
    });

    // Synthetic Data Test Button
    const testDataBtn = document.getElementById("testDataUploadBtn");
    if (testDataBtn) {
        testDataBtn.addEventListener("click", runSyntheticDataTest);
    }

    if (dom.testVVIQBtn) {
        dom.testVVIQBtn.addEventListener('click', () => {
            startVVIQ();
        });
    }
    if (dom.backToMenuFromTestSelectBtn) {
        dom.backToMenuFromTestSelectBtn.addEventListener('click', () => {
            showDiv(dom.mainMenu);
        });
    }

    if (dom.manualRedirectLink) {
        dom.manualRedirectLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = PROLIFIC_COMPLETION_URL;
        });
    }

    // Demographics
    if (dom.demographicsContinueBtn) {
        dom.demographicsContinueBtn.addEventListener('click', handleDemographicsSubmit);
    }

    if (dom.confirmConfidenceBtn) {
        dom.confirmConfidenceBtn.addEventListener('click', handleConfirmConfidence);
    }

    if (dom.confirmFinalVerificationBtn) {
        dom.confirmFinalVerificationBtn.addEventListener('click', handleConfirmFinalVerification);
    }

    // Calibration
    // Calibration
    document.querySelectorAll('.calibration-choice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const response = e.target.dataset.response || e.target.parentElement.dataset.response; // Handle click on text inside button
            handleCalibrationResponse(response);
        });
    });

    document.getElementById('calibrationRetryBtn').addEventListener('click', () => {
        startVisualCalibration();
    });

    // Consolidated Onboarding Navigation
    const onboardingBtns = [
        {
            id: 'welcomeContinueBtn', action: () => {
                document.documentElement.requestFullscreen().catch(e => console.log("FS error", e));
                advanceOnboarding(); // Correctly advance state
            }
        },
        {
            id: 'consentContinueBtn', action: () => {
                startVisualCalibration();
                advanceOnboarding();
            }
        },
        { id: 'calibrationContinueBtn', action: () => advanceOnboarding() },
        { id: 'perceptualIntroContinueBtn', action: () => advanceOnboarding() },
        { id: 'episodicIntroContinueBtn', action: () => advanceOnboarding() },
        { id: 'imaginationIntroContinueBtn', action: () => advanceOnboarding() },
        { id: 'approximationIntroContinueBtn', action: () => advanceOnboarding() },
        { id: 'howToContinueBtn', action: () => advanceOnboarding() },
        { id: 'paramIntroContinueBtn', action: () => advanceOnboarding() },
        { id: 'practiceIntroContinueBtn', action: () => advanceOnboarding() },
        { id: 'tutorialStartBtn', action: () => advanceOnboarding() },
        {
            id: 'cardCalibContinueBtn', action: () => {
                // Compute target image width immediately after card calibration is confirmed
                const excluded = computeVisualAngleScaling();
                if (!excluded) {
                    // Apply immediately so demo, tutorial, and practice screens
                    // all use the calibrated panel width, not just the main task.
                    applyVisualAngleScaling();
                    advanceOnboarding();
                }
            }
        }
    ];

    onboardingBtns.forEach(cfg => {
        const btn = document.getElementById(cfg.id);
        if (btn) {
            // Remove any potential old listeners (to fix double-click issues)
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => {
                console.log(`[Interaction] Button ${cfg.id} clicked.`);
                cfg.action();
            });
            // Update dom object references
            if (dom[cfg.id]) dom[cfg.id] = newBtn;
        }
    });



    // Consent Screen checkboxes
    dom.consentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', checkConsentStatus);
    });

    // Start Experiment Button
    if (dom.startExperimentBtn) {
        dom.startExperimentBtn.addEventListener('click', startActualTask);
    }

    // Demo Navigation
    dom.nextDemoBtn.addEventListener('click', () => {
        state.currentDemoIndex++;
        displayDemoScreen();
    });

    dom.prevDemoBtn.addEventListener('click', () => {
        if (state.currentDemoIndex > 0) {
            state.currentDemoIndex--;
            displayDemoScreen();
        }
    });

    // Parameter Demo Slider (FIXED LEAK)
    // We attach the listener ONCE here, instead of inside startParameterDemos
    dom.paramDemoSlider.addEventListener("input", updateDemoImage);

    // Quiz
    const quizContinueBtn = document.getElementById('quizContinueBtn');
    if (quizContinueBtn) {
        quizContinueBtn.addEventListener('click', handleQuizSubmit);
    }

    const quizQuestionsContainer = document.getElementById('quizQuestionsContainer');
    if (quizQuestionsContainer) {
        quizQuestionsContainer.addEventListener('change', () => {
            document.getElementById('quizErrorMessage').classList.add('hidden');
            document.getElementById('quizSuccessMessage').classList.add('hidden');
            quizContinueBtn.classList.remove('hidden');
        });
    }

    // VIM Interface
    document.getElementById("startTrialFromInstructionsBtn").addEventListener("click", handleStartTrial);
    document.getElementById("holdImageContinueBtn").addEventListener("click", handleHoldImageContinue);

    // Coarse Step
    document.querySelectorAll("#coarseStep button[data-level-key]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const key = e.target.closest("button").dataset.levelKey;
            const level = PARAMETERS[state.currentParameterKey].coarse[key];
            setupFineTuneStepVim(level);
        });

        // Hover listeners for preview
        btn.addEventListener("mouseenter", (e) => {
            const key = e.target.closest("button").dataset.levelKey;
            const level = PARAMETERS[state.currentParameterKey].coarse[key];
            updateCoarsePreviewImage(level);
        });

        btn.addEventListener("mouseleave", () => {
            const previewImg = document.getElementById("coarsePreviewImg");
            previewImg.classList.add("hidden");
            document.querySelector("#coarseImageDisplay .preview-instruction").classList.remove("hidden");
        });
    });

    document.getElementById("noInfoBtn").addEventListener("click", handleNoInfoSelection);

    // Fine Tune Step
    document.getElementById("backToCoarseBtn").addEventListener("click", () => {
        setupCoarseStepVim();
    });

    document.getElementById("confirmSelectionBtn").addEventListener("click", handleConfirmSelection);

    dom.fineTuneSlider.addEventListener("input", (e) => {
        if (!state.hasMovedSlider) {
            state.hasMovedSlider = true;
            const confirmBtn = document.getElementById("confirmSelectionBtn");
            confirmBtn.disabled = false;
            confirmBtn.classList.remove("disabled-button");
        }
        updateFineTuneImageVim(e.target.value);
    });

    // Confidence Step
    document.getElementById("confidenceSlider").addEventListener("input", (e) => {
        document.getElementById("confidenceValueDisplay").textContent = e.target.value;
    });

    document.getElementById("confirmConfidenceBtn").addEventListener("click", handleConfirmConfidence);

    // Results
    dom.downloadResultsBtn.addEventListener("click", downloadResults);
    dom.backToMenuFromResultsBtn.addEventListener("click", () => {
        if (confirm(LANG_STRINGS[state.currentLanguage].exitConfirmMessage)) {
            state.reset();
            showDiv(dom.mainMenu);
        }
    });

    // Language Selector
    document.querySelectorAll("#languageSelector button").forEach(btn => {
        btn.addEventListener("click", (e) => {
            setLanguage(e.target.dataset.lang);
        });
    });
}

// --- ONBOARDING LOGIC ---

function startOnboarding() {
    state.onboardingStep = 0;
    state.currentDemoIndex = 0;
    runOnboardingStep();
}

function checkConsentStatus() {
    const allChecked = Array.from(dom.consentCheckboxes).every(cb => cb.checked);
    dom.consentContinueBtn.disabled = !allChecked;
}

function advanceOnboarding() {
    state.onboardingStep++;
    console.log(`[Flow] Advancing to step ${state.onboardingStep}: ${ONBOARDING_FLOW[state.onboardingStep]}`);
    runOnboardingStep();
}

function runOnboardingStep() {
    const currentStepName = ONBOARDING_FLOW[state.onboardingStep];
    console.log(`Running Onboarding Step: ${currentStepName} `);

    if (currentStepName === 'tutorialPromptScreen') {
        const iconEl = document.getElementById('tutorialPromptIcon');
        if (iconEl && ICONS.scene_imagination) iconEl.src = ICONS.scene_imagination;
        showDiv(dom.tutorialPromptScreen);
    } else if (currentStepName === 'demographicsScreen') {
        populateDemographicsScreen();
        showDiv(dom.demographicsScreen);
    } else if (currentStepName === 'quizScreen') {
        populateQuizScreen();
        showDiv(dom.quizScreen);
    } else if (currentStepName === 'howToScreen') {
        document.getElementById('sourceDiagramImg').src = `images/instructions/image_source_diagram_${state.currentLanguage}.webp`;
        showDiv(dom.howToScreen);
    } else if (currentStepName === 'paramIntroScreen') {
        document.getElementById('qualitiesDiagramImg').src = `images/instructions/visual_qualities_diagram_${state.currentLanguage}.webp`;
        showDiv(dom.paramIntroScreen);
    } else if (currentStepName === 'practiceIntroScreen') {
        document.getElementById('flowDiagramImg').src = `images/instructions/rating_flow_diagram_${state.currentLanguage}.png`;
        showDiv(dom.practiceIntroScreen);
    } else if (currentStepName === 'visualCalibrationScreen') {
        startVisualCalibration();
        showDiv(dom.visualCalibrationScreen);
    } else if (currentStepName === 'cardCalibrationScreen') {
        startCardCalibration();
        showDiv(document.getElementById('cardCalibrationScreen'));
    } else if (currentStepName && currentStepName.endsWith('Screen')) {
        showDiv(document.getElementById(currentStepName));
    } else if (currentStepName === 'preloadDemos') {
        preloadDemoAssets(() => {
            // Advance automatically when done
            advanceOnboarding();
        });
    } else if (currentStepName === 'paramDemos') {
        startParameterDemos();
    } else if (currentStepName === 'practiceTrial') {
        startTutorial();
    }
}

function startParameterDemos() {
    state.currentDemoIndex = 0;
    displayDemoScreen();
}

function displayDemoScreen() {
    if (state.currentDemoIndex < 6) { // 6 demos
        // We need to reconstruct DEMO_PARAMS locally or access it if we exported it.
        // Since I defined it in utils.js locally, I can't access it here easily unless I export it.
        // I should have exported it.
        // For now, I'll redefine the keys since that's all I need.
        const demoKeys = ["brightness", "contrast", "saturation", "clarity", "detailedness", "precision"];
        const key = demoKeys[state.currentDemoIndex];
        const paramConfig = PARAMETERS[key];
        const lang = state.currentLanguage;

        const paramDemoIcon = document.getElementById('paramDemoIcon');
        if (ICONS[key]) {
            paramDemoIcon.src = ICONS[key];
            paramDemoIcon.style.display = 'block';
        } else {
            paramDemoIcon.style.display = 'none';
        }

        document.getElementById('paramDemoTitle').textContent = `${lang === 'en' ? 'Quality' : 'Cualidad'} ${state.currentDemoIndex + 1} ${lang === 'en' ? 'of' : 'de'} 6: ${paramConfig.name[lang]} `;
        document.getElementById('paramDemoText').innerHTML = paramConfig.instructions.demo[lang];

        dom.paramDemoSlider.value = 11;
        updateDemoImage();

        // Show/Hide Prev Button
        if (state.currentDemoIndex > 0) {
            dom.prevDemoBtn.classList.remove('hidden');
        } else {
            dom.prevDemoBtn.classList.add('hidden');
        }

        showDiv(dom.paramDemoScreen);
    } else {
        advanceOnboarding();
    }
}

function updateDemoImage() {
    const demoKeys = ["brightness", "contrast", "saturation", "clarity", "detailedness", "precision"];
    const key = demoKeys[state.currentDemoIndex];
    const level = parseInt(dom.paramDemoSlider.value, 10);

    // Use dynamic SVG filter engine for demos as well
    const imgEl = dom.paramDemoImg;
    const canvasEl = document.getElementById('paramDemoCanvas');

    const originalSrc = getOriginalImagePath("tutorial.webp");
    if (imgEl.src !== originalSrc) {
        imgEl.src = originalSrc;
        console.log("[Demo] Loading tutorial base image");
    }

    const demoLevels = { ...state.engineLevels };
    demoLevels[key] = level;

    // Apply the filters dynamically
    applyFiltersToElement(imgEl, canvasEl, demoLevels, key, false);
}

// --- QUIZ LOGIC ---

function populateQuizScreen() {
    state.quizPassed = false;
    const questionsContainer = document.getElementById('quizQuestionsContainer');
    if (!questionsContainer) return;

    questionsContainer.innerHTML = '';
    const lang = state.currentLanguage;
    const questions = LANG_STRINGS[lang].quizQuestions;

    questions.forEach((qData, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.style.marginTop = '20px';

        const questionText = document.createElement('p');
        questionText.innerHTML = `<b>${qIndex + 1}.</b> ${qData.question}`;
        questionDiv.appendChild(questionText);

        const optionsDiv = document.createElement('div');
        optionsDiv.style.marginLeft = '20px';
        qData.options.forEach((optionText, oIndex) => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '5px';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `quizQ${qIndex}`;
            radio.value = oIndex;

            label.appendChild(radio);
            label.append(` ${optionText} `);
            optionsDiv.appendChild(label);
        });
        questionDiv.appendChild(optionsDiv);
        questionsContainer.appendChild(questionDiv);
    });
}

function handleQuizSubmit() {
    const lang = state.currentLanguage;
    const questions = LANG_STRINGS[lang].quizQuestions;
    const errorMessage = document.getElementById('quizErrorMessage');
    let allCorrect = true;

    questions.forEach((qData, qIndex) => {
        const selectedOption = document.querySelector(`input[name="quizQ${qIndex}"]:checked`);
        if (!selectedOption || parseInt(selectedOption.value) !== qData.correctAnswerIndex) {
            allCorrect = false;
        }
    });

    const continueBtn = document.getElementById('quizContinueBtn');

    // Check if already passed and user clicked "Continue"
    if (state.quizPassed) {
        advanceOnboarding();
        return;
    }

    if (allCorrect) {
        state.quizPassed = true;
        errorMessage.classList.add('hidden');
        const successMessage = document.getElementById('quizSuccessMessage');
        successMessage.innerHTML = LANG_STRINGS[lang].quizSuccessMessage;
        successMessage.classList.remove('hidden');

        // Change button to "Continue" manually (and ensure it stays visible)
        continueBtn.textContent = LANG_STRINGS[lang].continueButton;
        continueBtn.classList.remove('hidden');
    } else {
        document.getElementById('quizSuccessMessage').classList.add('hidden');
        errorMessage.textContent = LANG_STRINGS[lang].quizErrorMessage;
        errorMessage.classList.remove('hidden');

        // Ensure button is "Check Answers"
        continueBtn.textContent = LANG_STRINGS[lang].quizCheckButton;
        continueBtn.classList.remove('hidden');
    }
}

// --- DEMOGRAPHICS LOGIC ---

function populateDemographicsScreen() {
    const lang = state.currentLanguage;
    const strings = LANG_STRINGS[lang].demographics;

    // Set static text
    document.getElementById('demoTitle').textContent = strings.title;
    document.getElementById('demoAgeLabel').textContent = strings.ageLabel;
    document.getElementById('demoGenderLabel').textContent = strings.genderLabel;
    document.getElementById('demoEducationLabel').textContent = strings.educationLabel;
    document.getElementById('demoOccupationLabel').textContent = strings.occupationLabel;
    document.getElementById('demographicsContinueBtn').textContent = strings.continueButton;
    document.getElementById('demoGenderOtherInput').placeholder = strings.otherPlaceholder;
    document.getElementById('demoOccupationOtherInput').placeholder = strings.otherPlaceholder;

    // Populate Selects
    populateSelect('demoGenderSelect', strings.genderOptions);
    populateSelect('demoEducationSelect', strings.educationOptions);
    populateSelect('demoOccupationSelect', strings.occupationOptions);

    // Add change listeners for "Other" fields
    setupDemographicsListeners();
}

function populateSelect(elementId, options) {
    const select = document.getElementById(elementId);
    select.innerHTML = '<option value="" disabled selected>Select...</option>';

    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
    });
}

function setupDemographicsListeners() {
    // Gender Other Toggle
    const genderSelect = document.getElementById('demoGenderSelect');
    genderSelect.onchange = () => {
        const val = genderSelect.value;
        const lang = state.currentLanguage;
        // Logic: "Other" is always the last option
        const options = LANG_STRINGS[lang].demographics.genderOptions;
        const otherString = options[options.length - 1];

        const isOther = val === otherString || val === "Other" || val === "Otro";
        const container = document.getElementById('demoGenderOtherContainer');
        if (isOther) container.classList.remove('hidden');
        else container.classList.add('hidden');
    };

    // Occupation Other Toggle
    const occSelect = document.getElementById('demoOccupationSelect');
    occSelect.onchange = () => {
        const val = occSelect.value;
        const lang = state.currentLanguage;
        const options = LANG_STRINGS[lang].demographics.occupationOptions;
        const otherString = options[options.length - 1];

        const isOther = val === otherString || val === "Other" || val === "Otro";
        const container = document.getElementById('demoOccupationOtherContainer');
        if (isOther) container.classList.remove('hidden');
        else container.classList.add('hidden');
    };
}

function handleDemographicsSubmit() {
    const genderSelect = document.getElementById('demoGenderSelect');
    const genderOtherInput = document.getElementById('demoGenderOtherInput');
    const ageInput = document.getElementById('demoAgeInput');
    const eduSelect = document.getElementById('demoEducationSelect');
    const occSelect = document.getElementById('demoOccupationSelect');
    const occOtherInput = document.getElementById('demoOccupationOtherInput');
    const errorMsg = document.getElementById('demoErrorMessage');

    // Validation
    let isValid = true;

    // Age
    if (!ageInput.value || ageInput.value < 18 || ageInput.value > 99) isValid = false;

    // Gender
    if (!genderSelect.value) isValid = false;
    else if (!document.getElementById('demoGenderOtherContainer').classList.contains('hidden') && !genderOtherInput.value.trim()) isValid = false;

    // Education
    if (!eduSelect.value) isValid = false;

    // Occupation
    if (!occSelect.value) isValid = false;
    else if (!document.getElementById('demoOccupationOtherContainer').classList.contains('hidden') && !occOtherInput.value.trim()) isValid = false;

    if (!isValid) {
        errorMsg.classList.remove('hidden');
        errorMsg.textContent = state.currentLanguage === 'en' ? "Please answer all questions to continue." : "Por favor conteste todas las preguntas para continuar.";
        return;
    }

    // Save Data
    state.demographics = {
        age: ageInput.value,
        gender: document.getElementById('demoGenderOtherContainer').classList.contains('hidden') ? genderSelect.value : `Other: ${genderOtherInput.value} `,
        education: eduSelect.value,
        occupation: document.getElementById('demoOccupationOtherContainer').classList.contains('hidden') ? occSelect.value : `Other: ${occOtherInput.value} `
    };

    console.log("Demographics saved:", state.demographics);

    // Hide error
    errorMsg.classList.add('hidden');

    advanceOnboarding();
}

// --- CALIBRATION LOGIC ---

function startVisualCalibration() {
    state.calibrationAttempts = 0;
    state.calibrationConsecutiveCorrect = 0;
    state.calibrationTotalWrong = 0;
    state.calibrationLog = [];

    const feedback = document.getElementById('calibrationFeedback');
    const retryBtn = document.getElementById('calibrationRetryBtn');
    const continueBtn = document.getElementById('calibrationContinueBtn');
    const buttonsContainer = document.getElementById('calibrationButtons');
    const canvasContainer = document.getElementById('calibrationCanvasContainer');

    feedback.classList.add('hidden');
    feedback.classList.remove('error', 'success');
    retryBtn.classList.add('hidden');
    continueBtn.classList.add('hidden');
    buttonsContainer.classList.remove('hidden');
    canvasContainer.classList.remove('hidden');

    drawMullerLyer();
}

function drawMullerLyer() {
    const canvas = document.getElementById('calibrationCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#080808';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const centerX = canvas.width / 2;
    const yPositions = [100, 250, 400, 550];
    const SHORT = 200;
    const LONG = 280;
    const finLen = 30;
    const finAng = Math.PI / 6;

    state.longerLinePosition = Math.floor(Math.random() * 4);

    for (let i = 0; i < 4; i++) {
        const len = (i === state.longerLinePosition) ? LONG : SHORT;
        drawCalibrationLine(ctx, centerX, yPositions[i], len, finLen, finAng);
    }
}

function drawCalibrationLine(ctx, cx, y, length, finLen, finAng) {
    const half = length / 2;
    const x1 = cx - half;
    const x2 = cx + half;
    const dx = finLen * Math.cos(finAng);
    const dy = finLen * Math.sin(finAng);

    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();

    // Draw fins (Standard Muller-Lyer)
    ctx.beginPath();
    ctx.moveTo(x1, y); ctx.lineTo(x1 - dx, y - dy);
    ctx.moveTo(x1, y); ctx.lineTo(x1 - dx, y + dy);
    ctx.moveTo(x2, y); ctx.lineTo(x2 + dx, y - dy);
    ctx.moveTo(x2, y); ctx.lineTo(x2 + dx, y + dy);
    ctx.stroke();
}

function handleCalibrationResponse(response) {
    const feedback = document.getElementById('calibrationFeedback');
    const retryBtn = document.getElementById('calibrationRetryBtn');
    const continueBtn = document.getElementById('calibrationContinueBtn');
    const buttonsContainer = document.getElementById('calibrationButtons');
    const lang = state.currentLanguage;

    const correctAnswer = state.longerLinePosition.toString();
    const isCorrect = (response === correctAnswer);

    state.calibrationLog.push({
        attempt: state.calibrationConsecutiveCorrect + state.calibrationTotalWrong + 1,
        response: response,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        longerLinePosition: state.longerLinePosition,
        timestamp: Date.now()
    });

    console.log('[Calibration] User response:', response, '| Correct answer:', correctAnswer, '| Result:', isCorrect ? 'CORRECT' : 'WRONG');

    if (isCorrect) {
        state.calibrationConsecutiveCorrect++;
        if (state.calibrationConsecutiveCorrect >= 2) {
            state.calibrationSuccess = true;
            feedback.textContent = lang === 'en'
                ? 'Correct! Your screen is properly calibrated.'
                : '¡Correcto! Tu pantalla está correctamente calibrada.';
            feedback.classList.remove('hidden', 'error');
            feedback.classList.add('success');
            buttonsContainer.classList.add('hidden');
            continueBtn.classList.remove('hidden');
        } else {
            drawMullerLyer();
            feedback.textContent = lang === 'en' ? "Correct! One more time to confirm." : "¡Correcto! Una vez más para confirmar.";
            feedback.classList.remove('hidden', 'error');
            feedback.classList.add('success');
        }
    } else {
        state.calibrationTotalWrong++;
        state.calibrationConsecutiveCorrect = 0;

        if (state.calibrationTotalWrong >= 4) {
            state.calibrationSuccess = false;
            const baseMsg = lang === 'en'
                ? LANG_STRINGS.en.calibrationFailed
                : LANG_STRINGS.es.calibrationFailed;
            const redirectMsg = lang === 'en'
                ? " Redirecting to Prolific..."
                : " Redirigiendo a Prolific...";
            feedback.textContent = baseMsg + redirectMsg;
            feedback.classList.remove('hidden', 'success');
            feedback.classList.add('error');
            buttonsContainer.classList.add('hidden');

            if (!state.isDemoMode) {
                console.log('[Calibration] Screening failure. Sending data silently...');
                sendDataToGoogleSheet(true);
                setTimeout(() => {
                    window.location.href = "https://app.prolific.com/submissions/complete?cc=YOUR_CODE_HERE";
                }, 5000);
            }
        } else {
            feedback.textContent = lang === 'en'
                ? LANG_STRINGS.en.calibrationRetry
                : LANG_STRINGS.es.calibrationRetry;
            feedback.classList.remove('hidden', 'success');
            feedback.classList.add('error');
            buttonsContainer.classList.add('hidden');
            retryBtn.classList.remove('hidden');
        }
    }
}

// --- TASK LOGIC ---

async function startActualTask() {
    // Prevent double-clicks
    if (dom.startExperimentBtn) {
        dom.startExperimentBtn.disabled = true;
        dom.startExperimentBtn.classList.add('disabled-button');
        dom.startExperimentBtn.textContent = LANG_STRINGS[state.currentLanguage].pleaseWait || "Please wait...";
    }

    state.reset();
    state.currentTaskMode = "actual_task_full";
    // Apply the calibrated image panel width before any trial renders
    applyVisualAngleScaling();
    state.sessionID = Date.now();
    state.participantID = generateParticipantID();
    console.log("Participant ID:", state.participantID);

    // --- Fetch Latin Square Set from Backend ---
    let requestedSet = getUrlParameter("set"); // Check URL override first
    if (!requestedSet) {
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, { method: "GET" });
            const result = await response.json();
            requestedSet = result.set || "A";
            console.log("Assigned Set from backend:", requestedSet);
        } catch (error) {
            console.warn("Could not fetch set from backend, using fallback.", error);
            // Fallback: Use hash of Prolific PID or random
            const pid = getUrlParameter("PROLIFIC_PID");
            if (pid) {
                const hash = pid.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
                requestedSet = ["A", "B", "C"][hash % 3];
            } else {
                requestedSet = ["A", "B", "C"][Math.floor(Math.random() * 3)];
            }
            console.log("Fallback Set:", requestedSet);
        }
    }

    const generated = createTrialList(requestedSet);
    state.currentSessionTrials = constrainedShuffle(generated.trials);
    state.assignedSet = generated.usedSet; // Store for data submission

    // Add attention checks
    const attentionCheckCount = 3;
    let indices = Array.from(Array(state.currentSessionTrials.length).keys());
    let shuffledIndices = shuffleArray(indices);
    let attentionCheckIndices = shuffledIndices.slice(0, attentionCheckCount);
    attentionCheckIndices.forEach((index) => {
        state.currentSessionTrials[index].has_attention_check = true;
    });
    // Note: We do NOT shuffle again after adding attention checks to preserve the constrained order.

    // Setup Progress
    state.completedSteps = 0;
    state.totalSteps = 6 * 12 + 3; // 6 params * 12 trials + 3 attention checks

    // Check VVIQ checkbox
    const vviqCheckbox = document.getElementById("vviqCheckbox");
    state.vviqEnabled = vviqCheckbox ? vviqCheckbox.checked : true;

    if (state.vviqEnabled) {
        state.totalSteps += 32;
    }

    dom.globalProgressContainer.classList.remove("hidden");
    state.currentGlobalTrialIndex = 0;
    state.allCollectedResponses = [];

    showConditionInstructions(state.currentSessionTrials[0]);
}

// --- Constrained Shuffle ---
// Shuffles trials ensuring no more than 2 consecutive trials of the same condition.
function constrainedShuffle(trials, maxAttempts = 1000) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const shuffled = shuffleArray(trials);
        if (isValidSequence(shuffled)) {
            console.log("Constrained shuffle succeeded on attempt:", attempt + 1);
            return shuffled;
        }
    }
    // If we couldn't find a valid sequence after maxAttempts, return a simple shuffle
    console.warn("Constrained shuffle failed after", maxAttempts, "attempts. Returning simple shuffle.");
    return shuffleArray(trials);
}

function isValidSequence(trials) {
    for (let i = 2; i < trials.length; i++) {
        if (
            trials[i].condition === trials[i - 1].condition &&
            trials[i].condition === trials[i - 2].condition
        ) {
            return false; // 3 in a row of the same condition
        }
    }
    return true;
}


function createTrialList(set = "A") {
    const conditions = ["perceptual_recall", "episodic_recall", "scene_imagination"];
    const indoorImages = IMAGE_DATA.filter((img) => img.type === "indoor");
    const outdoorImages = IMAGE_DATA.filter((img) => img.type === "outdoor");

    const groupAssignments = { A: [0, 1, 2], B: [1, 2, 0], C: [2, 0, 1] };
    const effectiveSet = groupAssignments[set.toUpperCase()] ? set.toUpperCase() : "A";
    const assignment = groupAssignments[effectiveSet];

    let trialList = [];
    let trialCounter = 1;
    conditions.forEach((condition, i) => {
        const groupIndex = assignment[i];
        const indoorGroup = indoorImages.slice(groupIndex * 2, groupIndex * 2 + 2);
        const outdoorGroup = outdoorImages.slice(groupIndex * 2, groupIndex * 2 + 2);

        [...indoorGroup, ...outdoorGroup].forEach((img) => {
            let instruction = condition === "perceptual_recall"
                ? { en: "You will be briefly shown a photograph. Pay close attention and try to hold the image in your mind after it disappears. Focus on your very first mental impression.", es: "Se le mostrará brevemente una fotografía. Preste mucha atención e intente retener la imagen en su mente después de que desaparezca. Concéntrese en su primera impresión mental." }
                : img.prompts[condition];

            trialList.push({
                trial_id: `main_${trialCounter++} `,
                condition: condition,
                base_image_id: img.id,
                original_image_filename: img.filename,
                condition_instruction: instruction,
                has_attention_check: false,
            });
        });
    });
    return { trials: trialList, usedSet: effectiveSet };
}

function showConditionInstructions(trialData) {
    state.currentTrialData = trialData;
    state.currentTrialResponses = {
        trial_id: trialData.trial_id,
        condition: trialData.condition,
        image_id: trialData.base_image_id,
        parameter_responses: {}
    };

    if (trialData.condition === 'episodic_recall' || trialData.condition === 'scene_imagination') {
        state.generationStartTime = Date.now();
    }

    const conditionIcon = document.getElementById("conditionIcon");
    if (ICONS[trialData.condition]) {
        conditionIcon.src = ICONS[trialData.condition];
        conditionIcon.style.display = "block";
    } else {
        conditionIcon.style.display = "none";
    }

    const lang = state.currentLanguage;
    const conditionName = {
        en: trialData.condition === "perceptual_recall" ? "Remember Photo" : trialData.condition === "episodic_recall" ? "Recall Memory" : "Imagine Scene",
        es: trialData.condition === "perceptual_recall" ? "Recordar Foto" : trialData.condition === "episodic_recall" ? "Rememorar Recuerdo" : "Imaginar Escena",
    }[lang];

    let titlePrefix = state.currentTaskMode === "test" ? "Test Mode" : `${state.currentGlobalTrialIndex + 1} / ${state.currentSessionTrials.length}`;
    document.getElementById("conditionInstructionTitle").textContent = `${titlePrefix}: ${conditionName}`;
    document.getElementById("conditionInstructionText").innerHTML = trialData.condition_instruction[lang];

    showDiv(dom.conditionInstructionScreen);
    document.getElementById("startTrialFromInstructionsBtn").classList.remove("hidden");

    // If already preloaded, we don't need to show the overlay
    const shouldShowOverlay = !state.preloadedTrials.has(trialData.trial_id);
    preloadTrialAssets(trialData, shouldShowOverlay);
}

function triggerNextTrialPreload() {
    const nextTrialIndex = state.currentGlobalTrialIndex + 1;
    if (nextTrialIndex < state.currentSessionTrials.length) {
        const nextTrial = state.currentSessionTrials[nextTrialIndex];
        console.log(`Starting background preload for trial: ${nextTrial.trial_id}`);
        preloadTrialAssets(nextTrial, false); // false = showOverlay
    }
}

function handleStartTrial() {
    if (!state.currentTrialData) return;

    if (state.generationStartTime) {
        state.currentTrialResponses.generation_rt = Date.now() - state.generationStartTime;
        state.generationStartTime = null;
    }

    if (state.currentTrialData.condition === "perceptual_recall") {
        startPreVimPhase(state.currentTrialData);
    } else {
        beginVimRating();
    }

    // Trigger preload for the NEXT trial in background
    triggerNextTrialPreload();
}

function startPreVimPhase(trialData) {
    showDiv(dom.preVimScreenContainer);

    const fixation = document.getElementById("fixationScreen");
    const imageScreen = document.getElementById("preVimImageScreenDiv");
    const holdScreen = document.getElementById("holdImageInstructionScreen");
    const blinkScreen = document.getElementById("blinkPromptScreen");
    const originalImg = document.getElementById("originalImageDisplay");

    // 1. Show Fixation (2s)
    fixation.classList.remove("hidden");
    imageScreen.classList.add("hidden");
    holdScreen.classList.add("hidden");
    blinkScreen.classList.add("hidden");
    originalImg.src = getOriginalImagePath(trialData.original_image_filename);

    setTimeout(() => {
        // 2. Show Image (5s)
        fixation.classList.add("hidden");
        imageScreen.classList.remove("hidden");
        console.log("[Flow] Showing perceptual recall target image");

        setTimeout(() => {
            // 3. Clear Image, Start Generation / Blink
            imageScreen.classList.add("hidden");
            originalImg.src = "";
            state.generationStartTime = Date.now();

            // 4. Show Blink Prompt (1s)
            blinkScreen.classList.remove("hidden");
            setTimeout(() => {
                blinkScreen.classList.add("hidden");
                // 5. Show Hold Instruction
                const lang = state.currentLanguage;
                document.getElementById("holdImagePrompt").textContent = LANG_STRINGS[lang].holdImagePrompt_recall;
                holdScreen.classList.remove("hidden");
                document.getElementById("holdImageContinueBtn").classList.remove("hidden");
            }, 1000);
        }, 900); // 900ms exposure
    }, 2000); // 2s fixation
}

function handleHoldImageContinue() {
    document.getElementById("holdImageContinueBtn").classList.add("hidden");
    if (state.generationStartTime) {
        state.currentTrialResponses.generation_rt = Date.now() - state.generationStartTime;
        state.generationStartTime = null;
    }
    beginVimRating();
}

function beginVimRating() {
    if (state.currentTaskMode === "tutorial") {
        state.actualTaskOrder = ["brightness", "clarity"];
    } else if (state.currentTaskMode === "test") {
        state.actualTaskOrder = [state.currentParameterKey];
    } else {
        const realParameters = Object.keys(PARAMETERS).filter(p => p !== "attention_check");
        let parametersForThisTrial = shuffleArray(realParameters);

        if (state.currentTrialData.has_attention_check) {
            const attentionVariants = PARAMETERS.attention_check.variants;
            const randomIndex = Math.floor(Math.random() * attentionVariants.length);
            state.currentTrialData.attention_check_variant = attentionVariants[randomIndex];
            parametersForThisTrial.push("attention_check");
        }
        state.actualTaskOrder = parametersForThisTrial;
    }

    const lang = state.currentLanguage;
    const sceneTypeKey = state.currentTrialData.condition === "perceptual_recall" ? "recalled photo" : state.currentTrialData.condition === "Practice" ? "practice image" : "mental scene";
    const sceneTypeString = {
        en: sceneTypeKey,
        es: sceneTypeKey.replace("photo", "foto").replace("image", "imagen").replace("scene", "escena"),
    }[lang];

    document.getElementById("vimGeneralInstruction").textContent = LANG_STRINGS[lang].vimGeneralInstruction.replace("{sceneType}", sceneTypeString);

    showDiv(dom.vimTaskInterface);

    // Explicitly hide pre-vim screens to prevent overlap
    dom.preVimScreenContainer.classList.add("hidden");
    document.getElementById("conditionInstructionScreen").classList.add("hidden");

    state.currentParameterIndexInTask = 0;

    // Initialize trial responses if not already set (fixes tutorial mode crash)
    if (!state.currentTrialResponses) {
        state.currentTrialResponses = {
            trial_id: state.currentTrialData?.trial_id || 'tutorial',
            condition: state.currentTrialData?.condition || 'tutorial',
            image_id: state.currentTrialData?.base_image_id || 'tutorial_image',
            parameter_responses: {}
        };
    }

    state.finalMatchRating = null;
    state.engineLevels = { brightness: 11, contrast: 11, saturation: 11, clarity: 21, precision: 21, detailedness: 21 };

    let originalFilename = state.currentTrialData.base_image_id + ".webp";
    if (state.currentTrialData.condition === "perceptual_recall" && state.currentTrialData.original_image_filename) {
        originalFilename = state.currentTrialData.original_image_filename;
    }
    const hiddenImg = document.getElementById("trialOriginalImgHidden");
    if (hiddenImg) hiddenImg.src = getOriginalImagePath(originalFilename);

    loadNextParameterInVim();
}

function loadNextParameterInVim() {
    if (state.currentParameterIndexInTask < state.actualTaskOrder.length) {
        state.currentParameterKey = state.actualTaskOrder[state.currentParameterIndexInTask];
        state.currentParameterConfig = PARAMETERS[state.currentParameterKey];
        setupCoarseStepVim();
    } else {
        // Check if ALL parameters were responded to with "no_info"
        const allNoInfo = Object.values(state.currentTrialResponses.parameter_responses).every(r => r.level === 'no_info');

        // Show combined image rating screen before finishing (task OR practice)
        if (state.finalMatchRating === null && !allNoInfo) {
            showFinalVerificationStep();
            return;
        } else if (allNoInfo) {
            // Skip the rating if there's no data to connect it to
            state.finalMatchRating = 'skipped';
        }

        // Trial Finished
        if (state.currentTaskMode === "actual_task_full") {
            if (!state.currentTrialData.is_attention_check) {
                state.allCollectedResponses.push({ ...state.currentTrialResponses });
                // --- REAL-TIME SAVE: Send this completed trial to server ---
                if (!state.isDemoMode) saveTrialToServer(state.currentTrialResponses);
            }
        }

        if (state.currentTaskMode === "tutorial") {
            if (state.finalMatchRating === null) {
                showFinalVerificationStep();
            } else {
                showReadyScreen();
            }
            return;
        }

        if (state.currentTaskMode === "test") {
            showDiv(dom.parameterSelector);
            return;
        }

        // Check for Break
        const trialsCompleted = state.currentGlobalTrialIndex + 1;
        if (state.currentTaskMode === "actual_task_full" && (trialsCompleted === 4 || trialsCompleted === 8)) {
            showBreakScreen(() => {
                state.currentGlobalTrialIndex++;
                showConditionInstructions(state.currentSessionTrials[state.currentGlobalTrialIndex]);
            });
            return;
        }

        state.currentGlobalTrialIndex++;
        if (state.currentGlobalTrialIndex < state.currentSessionTrials.length) {
            showConditionInstructions(state.currentSessionTrials[state.currentGlobalTrialIndex]);
        } else {
            displayFullResults();
        }
    }
}

function setupCoarseStepVim() {
    const paramConfig = PARAMETERS[state.currentParameterKey];
    const lang = state.currentLanguage;

    const paramDisplay = document.getElementById('currentParamDisplay');
    paramDisplay.innerHTML = paramConfig.shortDesc
        ? `${paramConfig.name[lang]}<br><span class="param-short-desc">${paramConfig.shortDesc[lang]}</span>`
        : paramConfig.name[lang];

    let instructionText = '';
    if (state.currentTaskMode === 'tutorial') {
        instructionText = paramConfig.instructions.tutorial.coarse[lang];
    } else if (state.currentParameterKey === 'attention_check') {
        instructionText = state.currentTrialData.attention_check_variant.instructions.coarse[lang];
    } else {
        instructionText = paramConfig.instructions.task.coarse[lang];
    }

    document.getElementById("coarseParamName").innerHTML = instructionText;
    document.getElementById("fineTuneParamName").innerHTML = instructionText;

    const parameterIcon = document.getElementById("parameterIcon");
    if (ICONS[state.currentParameterKey]) {
        parameterIcon.src = ICONS[state.currentParameterKey];
        parameterIcon.style.display = "block";
    } else {
        parameterIcon.style.display = "none";
    }

    dom.coarseStep.classList.remove("hidden");
    dom.fineTuneStep.classList.add("hidden");
    dom.confidenceStep.classList.add("hidden");
    document.getElementById("finalVerificationStep").classList.add("hidden");

    // Hide ALL action buttons initially (Reset for new parameter/trial)
    document.getElementById("confirmSelectionBtn").classList.add("hidden");
    document.getElementById("confirmNoInfoBtn").classList.add("hidden");
    document.getElementById("confirmConfidenceBtn").classList.add("hidden");
    document.getElementById("confirmFinalVerificationBtn").classList.add("hidden");
    document.getElementById("backToCoarseBtn").classList.add("hidden");

    // Safety: Hide any onboarding buttons that might linger
    document.getElementById("tutorialStartBtn").classList.add("hidden");
    document.getElementById("howToContinueBtn").classList.add("hidden");
    document.getElementById("calibrationContinueBtn").classList.add("hidden");
    document.getElementById("holdImageContinueBtn").classList.add("hidden");
    document.getElementById("startTrialFromInstructionsBtn").classList.add("hidden");

    state.parameterStartTime = Date.now();

    // Reset Image Panel
    document.getElementById("coarseImageDisplay").classList.remove("hidden");
    document.getElementById("fineTuneImageDisplay").classList.add("hidden");
    document.getElementById("coarsePreviewImg").classList.add("hidden");
    const existingCanvas = document.getElementById("coarsePreviewCanvas");
    if (existingCanvas) existingCanvas.style.display = "none";
    document.querySelector("#coarseImageDisplay .preview-instruction").classList.remove("hidden");

    // Reset Buttons
    document.getElementById("fineTuneActionButtons").classList.add("hidden");
}

function setupFineTuneStepVim(coarseLevelValue) {
    state.currentCoarseSelectionLevel = coarseLevelValue;
    const paramConfig = PARAMETERS[state.currentParameterKey];
    const lang = state.currentLanguage;

    let instructionText = '';
    if (state.currentTaskMode === 'tutorial') {
        instructionText = paramConfig.instructions.tutorial.fineTune[lang];
    } else if (state.currentParameterKey === 'attention_check') {
        instructionText = state.currentTrialData.attention_check_variant.instructions.fineTune[lang];
    } else {
        instructionText = paramConfig.instructions.task.fineTune[lang];
    }
    document.getElementById("fineTuneParamName").innerHTML = instructionText;

    const totalParamLevels = paramConfig.levels;
    let minL, maxL;
    if (coarseLevelValue === paramConfig.coarse.low) { minL = 1; maxL = 7; }
    else if (coarseLevelValue === paramConfig.coarse.mid) { minL = 8; maxL = 14; }
    else { minL = 15; maxL = 21; }

    state.currentFineTuneRange = { min: minL, max: maxL };

    dom.fineTuneSlider.min = 0;
    dom.fineTuneSlider.max = 100;
    dom.fineTuneSlider.value = Math.floor(Math.random() * 101); // randomized to avoid anchoring

    updateFineTuneImageVim(dom.fineTuneSlider.value);

    dom.coarseStep.classList.add('hidden');
    dom.fineTuneStep.classList.remove('hidden');
    document.getElementById("finalVerificationStep").classList.add("hidden");

    // Switch Image Panel
    document.getElementById("coarseImageDisplay").classList.add("hidden");
    document.getElementById("fineTuneImageDisplay").classList.remove("hidden");

    // Switch Buttons
    // Switch Buttons
    document.getElementById("fineTuneActionButtons").classList.remove("hidden");
    document.getElementById("backToCoarseBtn").classList.remove("hidden");

    const confirmBtn = document.getElementById("confirmSelectionBtn");
    confirmBtn.classList.remove("hidden");

    state.hasMovedSlider = false;
    confirmBtn.disabled = true;
    confirmBtn.classList.add("disabled-button");

    // Explicitly hide any other navigation buttons from onboarding that might be lingering
    document.getElementById("calibrationContinueBtn").classList.add("hidden");
    document.getElementById("howToContinueBtn").classList.add("hidden");
    document.getElementById("tutorialStartBtn").classList.add("hidden");

    document.getElementById("confirmConfidenceBtn").classList.add("hidden");
    document.getElementById("confirmNoInfoBtn").classList.add("hidden");
}

function updateFineTuneImageVim(sliderValStr) {
    const sliderPos = parseFloat(sliderValStr); // 0 to 100
    const minL = state.currentFineTuneRange.min;
    const maxL = state.currentFineTuneRange.max;
    // Maps 0-100 to minL-maxL linearly
    const actualLevel = minL + ((maxL - minL) * (sliderPos / 100));

    if (actualLevel !== undefined && state.currentTrialData && state.currentParameterKey) {
        state.engineLevels[state.currentParameterKey] = actualLevel;

        const imgEl = document.getElementById("fineTuneImg");
        const canvasEl = document.getElementById("fineTuneCanvas");

        let originalFilename = state.currentTrialData.base_image_id + ".webp";
        if (state.currentTrialData.condition === "perceptual_recall" && state.currentTrialData.original_image_filename) {
            originalFilename = state.currentTrialData.original_image_filename;
        }

        const desiredSrc = getOriginalImagePath(originalFilename);
        if (imgEl.getAttribute("data-original-src") !== desiredSrc || state.currentTaskMode === 'tutorial') {
            imgEl.setAttribute("data-original-src", desiredSrc);
            imgEl.src = desiredSrc;
            console.log(`[Image] Loading tutorial image: ${desiredSrc}`);
        }

        applyFiltersToElement(imgEl, canvasEl, state.engineLevels, state.currentParameterKey, false);
        document.getElementById("fineTuneLevelDisplay").textContent = Math.round(sliderPos) + '%';
    }
}

function updateCoarsePreviewImage(level) {
    if (level !== undefined && state.currentTrialData && state.currentParameterKey) {
        const previewImg = document.getElementById("coarsePreviewImg");
        let originalFilename = state.currentTrialData.base_image_id + ".webp";
        if (state.currentTrialData.condition === "perceptual_recall" && state.currentTrialData.original_image_filename) {
            originalFilename = state.currentTrialData.original_image_filename;
        }

        const desiredSrc = getOriginalImagePath(originalFilename);
        if (previewImg.getAttribute("data-original-src") !== desiredSrc) {
            previewImg.setAttribute("data-original-src", desiredSrc);
            previewImg.src = desiredSrc;
        }

        const tempLevels = { ...state.engineLevels };
        tempLevels[state.currentParameterKey] = level;
        applyFiltersToElement(previewImg, null, tempLevels, state.currentParameterKey, false);

        previewImg.classList.remove("hidden");
        document.querySelector("#coarseImageDisplay .preview-instruction").classList.add("hidden");
    }
}

function handleNoInfoSelection() {
    state.choseNoInfo = true;
    if (!state.currentTrialResponses.parameter_responses) {
        state.currentTrialResponses.parameter_responses = {};
    }
    state.currentTrialResponses.parameter_responses[state.currentParameterKey] = {
        level: 'no_info',
    };
    dom.coarseStep.classList.add('hidden');
    showConfidenceStep();
}

function handleConfirmSelection() {
    const sliderPos = parseFloat(dom.fineTuneSlider.value);
    const minL = state.currentFineTuneRange.min;
    const maxL = state.currentFineTuneRange.max;
    const actualLevel = minL + ((maxL - minL) * (sliderPos / 100));

    // Normalize to a seamless 0-100 score using band-aware mapping.
    // Each coarse band (Low/Mid/High) maps to one contiguous third of the 0-100 range:
    // Low → 0–33, Mid → 33–67, High → 67–100.
    // This avoids the structural gaps (31-34, 66-69) that the old 1-21 linear mapping produced.
    const bandIndex = (minL === 1) ? 0 : (minL === 8) ? 1 : 2;
    const normalizedScore = Math.round((bandIndex + sliderPos / 100) / 3 * 100);

    if (!state.currentTrialResponses.parameter_responses) {
        state.currentTrialResponses.parameter_responses = {};
    }
    state.currentTrialResponses.parameter_responses[state.currentParameterKey] = {
        level: normalizedScore, // 0-100
        raw_level: actualLevel, // Keep raw for reference
        slider_position: sliderPos,
        coarse_selection: state.currentCoarseSelectionLevel
    };

    if (state.currentParameterKey === 'attention_check') {
        const responseTime = Date.now() - state.parameterStartTime;
        state.currentTrialResponses.parameter_responses[state.currentParameterKey].rt = responseTime;
        updateProgressBar();
        state.currentParameterIndexInTask++;
        loadNextParameterInVim();
    } else {
        showConfidenceStep();
    }
}

function showConfidenceStep() {
    dom.fineTuneStep.classList.add('hidden');
    dom.confidenceStep.classList.remove('hidden');
    document.getElementById("finalVerificationStep").classList.add("hidden");

    const lang = state.currentLanguage;
    let promptText = '';
    if (state.currentTaskMode === 'tutorial') {
        promptText = PARAMETERS[state.currentParameterKey].instructions.tutorial.confidence[lang];
    } else {
        promptText = LANG_STRINGS[lang].confidencePrompt;
    }
    document.getElementById("confidencePrompt").textContent = promptText;

    document.getElementById("confidenceSlider").value = Math.floor(Math.random() * 101); // randomized to avoid anchoring

    document.getElementById("fineTuneActionButtons").classList.remove("hidden");
    document.getElementById("backToCoarseBtn").classList.add("hidden");
    document.getElementById("confirmSelectionBtn").classList.add("hidden");
    document.getElementById("confirmNoInfoBtn").classList.add("hidden");
    document.getElementById("confirmConfidenceBtn").classList.remove("hidden");
    document.getElementById("confirmFinalVerificationBtn").classList.add("hidden");

    // Disable Confirm until slider is moved (anti-click-through guard)
    const confBtn = document.getElementById('confirmConfidenceBtn');
    confBtn.disabled = true;
    confBtn.classList.add('disabled-button');
    const confSlider = document.getElementById('confidenceSlider');
    const enableConfBtn = () => {
        confBtn.disabled = false;
        confBtn.classList.remove('disabled-button');
        confSlider.removeEventListener('input', enableConfBtn);
    };
    confSlider.addEventListener('input', enableConfBtn);
}

function handleConfirmConfidence() {
    const slider = document.getElementById("confidenceSlider");
    state.currentConfidenceSelection = parseInt(slider.value, 10);

    const responseTime = Date.now() - state.parameterStartTime;
    if (state.currentTrialResponses.parameter_responses[state.currentParameterKey]) {
        state.currentTrialResponses.parameter_responses[state.currentParameterKey].confidence = state.currentConfidenceSelection;
        state.currentTrialResponses.parameter_responses[state.currentParameterKey].rt = responseTime;
    }

    updateProgressBar();
    state.currentParameterIndexInTask++;
    state.saveToLocalStorage(); // Save progress after each parameter adjustment
    loadNextParameterInVim();
}

function showFinalVerificationStep() {
    dom.coarseStep.classList.add("hidden");
    dom.fineTuneStep.classList.add("hidden");
    dom.confidenceStep.classList.add("hidden");
    const stepEl = document.getElementById("finalVerificationStep");
    stepEl.classList.remove("hidden");

    document.getElementById("fineTuneActionButtons").classList.remove("hidden");
    document.getElementById("backToCoarseBtn").classList.add("hidden");
    document.getElementById("confirmSelectionBtn").classList.add("hidden");
    document.getElementById("confirmNoInfoBtn").classList.add("hidden");
    document.getElementById("confirmConfidenceBtn").classList.add("hidden");
    document.getElementById("confirmFinalVerificationBtn").classList.remove("hidden");

    // Enable interaction guard for final verification
    const finalBtn = document.getElementById('confirmFinalVerificationBtn');
    finalBtn.disabled = true;
    finalBtn.classList.add('disabled-button');
    const finalSlider = document.getElementById('finalVerificationSlider');
    const enableFinalBtn = () => {
        finalBtn.disabled = false;
        finalBtn.classList.remove('disabled-button');
        finalSlider.removeEventListener('input', enableFinalBtn);
    };
    finalSlider.addEventListener('input', enableFinalBtn);

    document.getElementById("coarseImageDisplay").classList.add("hidden");
    document.getElementById("fineTuneImageDisplay").classList.remove("hidden");

    const lang = state.currentLanguage;
    const headerTitle = document.getElementById('currentParamDisplay');
    const headerDesc = document.getElementById('fineTuneParamName');

    headerTitle.innerHTML = `${LANG_STRINGS[lang].finalVerificationTitle}<br><span class="param-short-desc">${LANG_STRINGS[lang].finalVerificationDesc}</span>`;
    headerDesc.innerHTML = LANG_STRINGS[lang].finalVerificationInstruction;

    const imgEl = document.getElementById("fineTuneImg");
    const canvasEl = document.getElementById("fineTuneCanvas");

    let originalFilename = state.currentTrialData.base_image_id + ".webp";
    if (state.currentTrialData.condition === "perceptual_recall" && state.currentTrialData.original_image_filename) {
        originalFilename = state.currentTrialData.original_image_filename;
    }

    // Fix Bug: Explicitly set the image source for the current trial
    const desiredSrc = getOriginalImagePath(originalFilename);
    imgEl.src = desiredSrc;
    imgEl.setAttribute("data-original-src", desiredSrc);

    applyFiltersToElement(imgEl, canvasEl, state.engineLevels, state.currentParameterKey, true);

    document.getElementById("finalVerificationSlider").value = 50;
}

function handleConfirmFinalVerification() {
    const slider = document.getElementById("finalVerificationSlider");
    state.finalMatchRating = parseInt(slider.value, 10);
    state.currentTrialResponses.final_match_rating = state.finalMatchRating;

    // Final save for the trial with the combined rating
    state.saveToLocalStorage();

    loadNextParameterInVim();
}

// --- RESULTS & SAVING ---

function displayFullResults() {
    // Start VVIQ or Finish
    // For simplicity, let's assume VVIQ is enabled.
    // I'll skip VVIQ implementation in this file for brevity if it's too long, 
    // but I should probably include it or put it in a separate module.
    // Given the size, I'll include a simplified VVIQ start.
    if (state.vviqEnabled) {
        startVVIQ();
    } else {
        collectAndFinish();
    }
}

// --- VVIQ LOGIC ---

function startVVIQ() {
    state.currentVVIQSceneIndex = 0;
    state.vviqInstructionStep = -1; // -1 = transition screen
    state.vviq_scores = [];
    populateVVIQScreen();
    showDiv(dom.vviqScreen);
}

function populateVVIQScreen() {
    const screen = dom.vviqScreen;
    screen.innerHTML = ''; // Clear previous content

    const lang = state.currentLanguage;
    const vviqData = VVIQ_DATA;

    // Header
    const h2 = document.createElement('h2');
    h2.textContent = "VVIQ-2";
    screen.appendChild(h2);

    // Transition screen (step -1): bridge between ViVIM task and VVIQ
    if (state.vviqInstructionStep === -1) {
        const transitionDiv = document.createElement('div');
        transitionDiv.className = 'instruction-content';
        const transitionText = lang === 'es'
            ? 'Has completado la tarea principal. A continuaci\u00f3n, te pediremos que completes un breve cuestionario sobre tu capacidad de imaginaci\u00f3n visual.'
            : 'You have completed the main task. Next, we will ask you to complete a short questionnaire about your visual imagery ability.';
        transitionDiv.innerHTML = `<p>${transitionText}</p>`;
        screen.appendChild(transitionDiv);

        const continueBtn = document.createElement('button');
        continueBtn.textContent = LANG_STRINGS[lang].continueButton;
        continueBtn.onclick = () => {
            state.vviqInstructionStep = 0;
            populateVVIQScreen();
        };
        screen.appendChild(continueBtn);
        return;
    }

    // Instructions (steps 0–3, only before first scene)
    if (state.currentVVIQSceneIndex === 0 && state.vviqInstructionStep <= 3) {
        const instKeys = ['inst_1', 'inst_2', 'inst_3', 'inst_4'];
        const currentKey = instKeys[state.vviqInstructionStep];

        if (currentKey) {
            const instructionsDiv = document.createElement('div');
            instructionsDiv.className = 'instruction-content';
            instructionsDiv.innerHTML = `<p>${vviqData.instructions[currentKey][lang]}</p>`;

            // Show the rating scale table on inst_2
            if (currentKey === 'inst_2') {
                let tableHTML = '<table class="vviq-rating-scale-table"><tbody>';
                vviqData.scale.forEach(s => {
                    tableHTML += `<tr><td><b>${s.score}</b></td><td>${s[lang]}</td></tr>`;
                });
                tableHTML += '</tbody></table>';
                instructionsDiv.innerHTML += tableHTML;
            }

            screen.appendChild(instructionsDiv);

            const startBtn = document.createElement('button');
            startBtn.textContent = LANG_STRINGS[lang].continueButton;
            startBtn.onclick = () => {
                if (state.vviqInstructionStep < 3) {
                    state.vviqInstructionStep++;
                    populateVVIQScreen();
                } else {
                    // Start scenes
                    renderVVIQScene(screen);
                }
            };
            screen.appendChild(startBtn);
        } else {
            renderVVIQScene(screen);
        }
    } else {
        renderVVIQScene(screen);
    }
}

function renderVVIQScene(container) {
    container.innerHTML = '';
    const lang = state.currentLanguage;
    const totalScenes = VVIQ_DATA.prompts.length;

    if (state.currentVVIQSceneIndex >= totalScenes) {
        collectAndFinish();
        return;
    }

    const promptData = VVIQ_DATA.prompts[state.currentVVIQSceneIndex];
    const promptText = promptData.prompt[lang];

    // Header
    const h2 = document.createElement('h2');
    h2.textContent = `VVIQ-2: ${lang === 'es' ? 'Escena' : 'Scene'} ${state.currentVVIQSceneIndex + 1} / ${totalScenes}`;
    container.appendChild(h2);

    // Scene prompt
    const promptDiv = document.createElement('div');
    promptDiv.className = 'instruction-content vviq-scene-prompt';
    promptDiv.innerHTML = `<p><em>${promptText}</em></p>`;
    container.appendChild(promptDiv);

    // Track selections for this scene
    const sceneSelections = [null, null, null, null];

    // Render each item with a discrete slider
    promptData.items.forEach((item, itemIdx) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'vviq-scene-item';

        // Item text
        const itemLabel = document.createElement('p');
        itemLabel.className = 'vviq-scene-item-text';
        itemLabel.innerHTML = `<b>${itemIdx + 1}.</b> ${item[lang]}`;
        itemDiv.appendChild(itemLabel);

        // Glider widget
        const gliderContainer = document.createElement('div');
        gliderContainer.className = 'vviq-glider-container';

        const track = document.createElement('div');
        track.className = 'vviq-glider-track';

        VVIQ_DATA.scale.forEach(scaleItem => {
            const point = document.createElement('button');
            point.type = 'button';
            point.className = 'vviq-glider-point';
            point.dataset.score = scaleItem.score;
            point.setAttribute('aria-label', `${scaleItem.score} - ${scaleItem[lang]}`);
            point.onclick = () => {
                // Deselect siblings
                track.querySelectorAll('.vviq-glider-point').forEach(p => p.classList.remove('selected'));
                point.classList.add('selected');
                sceneSelections[itemIdx] = scaleItem.score;
                // Enable continue button if all selected
                if (sceneSelections.every(s => s !== null)) {
                    continueBtn.disabled = false;
                }
            };
            track.appendChild(point);
        });
        gliderContainer.appendChild(track);

        // Labels row
        const labelsRow = document.createElement('div');
        labelsRow.className = 'vviq-glider-labels';
        VVIQ_DATA.scale.forEach(scaleItem => {
            const label = document.createElement('span');
            label.className = 'vviq-glider-label';
            label.textContent = `${scaleItem.score} - ${scaleItem[lang]}`;
            labelsRow.appendChild(label);
        });
        gliderContainer.appendChild(labelsRow);

        itemDiv.appendChild(gliderContainer);
        container.appendChild(itemDiv);
    });

    // Continue button
    const continueBtn = document.createElement('button');
    continueBtn.textContent = LANG_STRINGS[lang].continueButton;
    continueBtn.disabled = true;
    continueBtn.onclick = () => handleVVIQSceneSubmit(sceneSelections);
    container.appendChild(continueBtn);
}

function handleVVIQSceneSubmit(scores) {
    scores.forEach(score => {
        state.vviq_scores.push(score);
        updateProgressBar();
    });
    state.currentVVIQSceneIndex++;
    renderVVIQScene(dom.vviqScreen);
}

function collectAndFinish() {
    // Clear the backup since task is complete
    state.clearLocalStorage();
    showDiv(dom.resultsDisplay);

    // Manage UI based on run type
    if (state.isProlificRun) {
        // Hide "Task Complete / Trial Results" title if we have the Prolific success section
        if (dom.resultsTitle) dom.resultsTitle.classList.add("hidden");

        // Ensure results list is visible (user requested this stay)
        if (dom.resultsList) dom.resultsList.classList.remove("hidden");

        dom.downloadResultsBtn.disabled = true;
        dom.downloadResultsBtn.style.display = 'none';
    } else {
        if (dom.resultsTitle) dom.resultsTitle.classList.remove("hidden");
        if (dom.resultsList) dom.resultsList.classList.remove("hidden");

        dom.downloadResultsBtn.disabled = false;
        dom.downloadResultsBtn.style.display = 'inline-block';
    }

    if (!state.isDemoMode) {
        sendDataToGoogleSheet();
    }
}

// --- REAL-TIME TRIAL SAVING ---
// Sends a single completed trial to the server asynchronously.
// This is 'fire-and-forget' to avoid blocking the task flow.
async function saveTrialToServer(trialData) {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_SCRIPT_URL_HERE") {
        console.log('[RealTimeSave] GOOGLE_SCRIPT_URL not configured. Skipping server save.');
        return;
    }

    const dataToPost = {
        participantID: state.participantID || "P-DEBUG",
        sessionID: state.sessionID || Date.now(),
        prolific_pid: state.prolificPID || "",
        study_id: state.studyID || "",
        session_id: state.sessionID || "",
        assigned_set: state.assignedSet || "N/A",
        is_intermediate: true, // Flag for the backend
        vim_results: [trialData] // Send only this one trial
    };

    const params = new URLSearchParams();
    params.append("data", JSON.stringify(dataToPost));

    try {
        console.log(`[RealTimeSave] Sending trial ${trialData.trial_id} to server...`);
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: params
        });
        if (response.ok) {
            console.log(`[RealTimeSave] Trial ${trialData.trial_id} saved successfully.`);
        } else {
            console.warn(`[RealTimeSave] Server responded with status ${response.status}. Trial ${trialData.trial_id} may not be saved.`);
        }
    } catch (error) {
        console.warn(`[RealTimeSave] Network error for trial ${trialData.trial_id}:`, error.message);
        // Silently fail. The full dataset will be sent at the end.
    }
}

async function sendDataToGoogleSheet(isSilent = false) {
    const dataToPost = {
        participantID: state.participantID || "P-DEBUG",
        sessionID: state.sessionID || Date.now(),
        prolific_pid: state.prolificPID || "",
        study_id: state.studyID || "",
        session_id: state.sessionID || "",
        assigned_set: state.assignedSet || "N/A", // Latin Square set
        demographics: state.demographics,
        calibration_log: state.calibrationLog, // Calibration attempts (success/fail)
        vim_results: state.allCollectedResponses,
        break_data: state.breakData,
        vviq_scores: state.vviq_scores
    };

    window.finalDataForDownload = dataToPost;

    const params = new URLSearchParams();
    params.append("data", JSON.stringify(dataToPost));

    let crawlInterval;

    if (!isSilent) {
        // Show Loading Overlay with smooth progress crawl
        dom.loadingOverlay.classList.remove("hidden");
        dom.loadingText.textContent = "Transferring data, please wait.";

        let currentProgress = 0;
        dom.progressBar.style.width = "0%";

        // Initial jump
        setTimeout(() => { dom.progressBar.style.width = "10%"; currentProgress = 10; }, 50);

        crawlInterval = setInterval(() => {
            if (currentProgress < 92) {
                currentProgress += Math.random() * 4;
                dom.progressBar.style.width = `${currentProgress}%`;
            }
        }, 400);
    }

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: params
        });

        const result = await response.json();

        if (result.result === "success") {
            if (!isSilent) {
                clearInterval(crawlInterval);
                dom.progressBar.style.width = "100%";
                dom.loadingText.textContent = "Success!";

                setTimeout(() => {
                    dom.loadingOverlay.classList.add("hidden");
                    showProlificCompletion();
                }, 1000);
            } else {
                console.log("[SilentSave] Data saved successfully.");
            }
        } else {
            throw new Error("Server responded with error");
        }
    } catch (error) {
        // Special case: Failed to fetch on a POST to Google Apps Script often means a CORS/Redirect issue, 
        // even though the data was successfully received by the script.
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            console.warn("CORS/Redirect issue detected, but data was likely sent successfully.");
            if (!isSilent) {
                clearInterval(crawlInterval);
                dom.progressBar.style.width = "100%";
                dom.loadingText.textContent = "Data sent successfully (CORS bypass)";
                setTimeout(() => {
                    dom.loadingOverlay.classList.add("hidden");
                    showProlificCompletion();
                }, 1500);
            }
            return; // Success
        }

        if (!isSilent) {
            clearInterval(crawlInterval);
            console.error("Data save failed:", error);
            dom.loadingText.textContent = "Error saving data. Please download your results manually.";

            // Ensure download is enabled on failure
            dom.downloadResultsBtn.disabled = false;
            dom.downloadResultsBtn.style.display = 'inline-block';

            setTimeout(() => {
                dom.loadingOverlay.classList.add("hidden");
            }, 3000);
        } else {
            console.warn("[SilentSave] Background save failed:", error);
        }
    }
}

function showProlificCompletion() {
    if (!state.isProlificRun || state.isDemoMode) return;

    // Extract code from PROLIFIC_COMPLETION_URL
    const codeMatch = PROLIFIC_COMPLETION_URL.match(/cc=([^&#]*)/);
    const code = codeMatch ? codeMatch[1] : "N/A";

    dom.completionCodeDisplay.textContent = code;
    dom.manualRedirectLink.href = PROLIFIC_COMPLETION_URL;
    dom.prolificCompletionSection.classList.remove("hidden");

    let secondsLeft = 20;
    dom.countdownSeconds.textContent = secondsLeft;

    if (state.redirectionInterval) clearInterval(state.redirectionInterval);

    state.redirectionInterval = setInterval(() => {
        secondsLeft--;
        dom.countdownSeconds.textContent = secondsLeft;
        if (secondsLeft <= 0) {
            clearInterval(state.redirectionInterval);
            window.location.href = PROLIFIC_COMPLETION_URL;
        }
    }, 1000);
}

// --- DEBUG / TEST FUNCTIONS ---

function runSyntheticDataTest() {
    state.reset();
    state.isProlificRun = true;

    // Synthetic Demographics
    state.demographics = {
        age: 25,
        gender: "Non-binary",
        education: "Bachelor's degree",
        occupation: "Arts, Design, Entertainment, Sports, & Media"
    };

    // Capture real Prolific IDs if present, otherwise use synthetic ones
    state.prolificPID = getUrlParameter("PROLIFIC_PID") || "SYNTHETIC_PID_" + Math.floor(Math.random() * 1000);
    state.studyID = getUrlParameter("STUDY_ID") || "SYNTHETIC_STUDY";
    state.sessionID = getUrlParameter("SESSION_ID") || "SYNTHETIC_SESS_" + Date.now();
    state.participantID = "P-SYNTHETIC";

    generateSyntheticData();

    // Jump straight to upload
    collectAndFinish();
}

function generateSyntheticData() {
    // 1. Synthetic VIM Results (15 trials)
    const conditions = ["perceptual_recall", "episodic_recall", "scene_imagination"];
    const params = Object.keys(PARAMETERS).filter(p => p !== "attention_check");

    for (let i = 1; i <= 15; i++) {
        const condition = conditions[i % conditions.length];
        const trial = {
            trial_id: `synthetic_${i}`,
            condition: condition,
            image_id: "image01",
            generation_rt: 5000 + Math.random() * 5000,
            parameter_responses: {}
        };

        params.forEach(p => {
            trial.parameter_responses[p] = {
                level: Math.floor(Math.random() * 101), // 0-100 score
                confidence: Math.floor(Math.random() * 101), // 0-100 score
                rt: 2000 + Math.random() * 3000
            };
        });

        // Add the new final match rating (0-100)
        trial.final_match_rating = Math.floor(Math.random() * 101);

        state.allCollectedResponses.push(trial);
    }

    // 2. Synthetic Break Data
    state.breakData.push({
        start: Date.now() - 300000,
        end: Date.now() - 180000,
        duration: 120000,
        rt: 120000,
        after_trial: 4
    });
    state.breakData.push({
        start: Date.now() - 120000,
        end: Date.now() - 60000,
        duration: 60000,
        rt: 60000,
        after_trial: 8
    });

    // 3. Synthetic VVIQ Scores (32 items)
    for (let i = 0; i < 32; i++) {
        state.vviq_scores.push(Math.floor(Math.random() * 5) + 1);
    }

    console.log("Synthetic data generated:", state);
}

function downloadResults() {
    const data = window.finalDataForDownload;
    if (!data) return;
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // Use participant ID if available, otherwise session ID
    const filenameID = state.participantID || state.sessionID;
    a.download = `ViVIM_results_${filenameID}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function startTutorial() {
    state.currentTaskMode = "tutorial";
    state.currentTrialData = {
        trial_id: "TutorialRun",
        condition: "Practice",
        base_image_id: "tutorial",
    };
    beginVimRating();
    state.completedSteps = 0;
    state.totalSteps = 1;
    dom.globalProgressContainer.classList.remove("hidden");
}

function populateParameterSelector() {
    const container = document.getElementById("paramButtonsContainer");
    container.innerHTML = '';
    const realParameters = Object.keys(PARAMETERS).filter(key => key !== 'attention_check');
    realParameters.forEach(key => {
        const button = document.createElement('button');
        button.className = 'param-icon-button';
        button.innerHTML = `<img src="${ICONS[key]}" alt="${PARAMETERS[key].name[state.currentLanguage]}"><span>${PARAMETERS[key].name[state.currentLanguage]}</span>`;
        button.addEventListener('click', () => startParameterTest(key));
        container.appendChild(button);
    });
}

function startParameterTest(paramKey) {
    state.reset();
    state.currentTaskMode = "test";
    state.currentParameterKey = paramKey;
    state.currentParameterConfig = PARAMETERS[paramKey];
    state.currentTrialData = { trial_id: "TestRun", condition: "Parameter Test", base_image_id: "image01" };
    beginVimRating();
}

function showBreakScreen(callback) {
    showDiv(dom.breakScreen);

    const btn = document.getElementById("breakContinueBtn");
    const timerDisplay = document.getElementById("breakTimerDisplay");

    // Record break start
    const breakStart = Date.now();
    let timerInterval = null;

    // Helper to finish break
    const finishBreak = () => {
        if (timerInterval) clearInterval(timerInterval);
        document.removeEventListener('keydown', skipListener);

        // Record break end
        const duration = Date.now() - breakStart;
        state.breakData.push({
            start: breakStart,
            end: Date.now(),
            duration: duration,
            rt: duration,
            after_trial: state.currentGlobalTrialIndex
        });
        callback();
    };

    // Skip listener (press 'S' to skip)
    const skipListener = (e) => {
        if (e.key === 's' || e.key === 'S') {
            finishBreak();
        }
    };
    document.addEventListener('keydown', skipListener);

    if (DEBUG_SKIP_BREAK_TIMER) {
        btn.disabled = false;
        btn.textContent = LANG_STRINGS[state.currentLanguage].continueButton;
        timerDisplay.textContent = "DEBUG MODE: Timer Skipped";
        btn.onclick = finishBreak;
    } else {
        // Normal Break Timer
        btn.disabled = true;
        let timeLeft = BREAK_DURATION_SECONDS;

        const updateTimer = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                btn.disabled = false;
                btn.textContent = LANG_STRINGS[state.currentLanguage].continueButton;
                timerDisplay.textContent = "0:00";
            }
            timeLeft--;
        };

        updateTimer(); // Initial call
        timerInterval = setInterval(updateTimer, 1000);
        btn.onclick = finishBreak;
    }
}

function showReadyScreen() {
    const readyScreenDiv = dom.readyScreen;
    readyScreenDiv.querySelector('[data-lang-key="readyTitle"]').textContent = LANG_STRINGS[state.currentLanguage].readyTitle;
    readyScreenDiv.querySelector('[data-lang-key="readyText"]').textContent = LANG_STRINGS[state.currentLanguage].readyText;
    readyScreenDiv.querySelector('[data-lang-key="startExperimentButton"]').textContent = LANG_STRINGS[state.currentLanguage].startExperimentButton;
    showDiv(readyScreenDiv);
}

// =============================================================================
// SCREEN SIZE CHECK
// =============================================================================

const MIN_VIEWPORT_WIDTH = 1024;

function checkScreenSize() {
    const overlay = document.getElementById('screenSizeOverlay');
    if (!overlay) return;
    if (window.innerWidth < MIN_VIEWPORT_WIDTH) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

// =============================================================================
// CREDIT CARD CALIBRATION
// =============================================================================

const CREDIT_CARD_WIDTH_MM = 85.6;
const CARD_INITIAL_WIDTH_PX = 300;
const CARD_MIN_WIDTH_PX = 150;  // below ~60 PPI — implausibly large/low-res display
const CARD_MAX_WIDTH_PX = 850;  // above ~300 PPI — implausibly small/very-high-res display

let _cardIsDragging = false;
let _cardDragStartX = 0;
let _cardStartWidth = 0;

function startCardCalibration() {
    const rect = document.getElementById('cardCalibRect');
    rect.style.width = CARD_INITIAL_WIDTH_PX + 'px';

    document.getElementById('cardCalibFeedback').textContent = '';
    document.getElementById('cardCalibFeedback').style.color = '#333';
    document.getElementById('cardCalibRecommendation').classList.add('hidden');
    document.getElementById('cardCalibContinueBtn').disabled = true;

    // Re-bind handle listeners cleanly (clone to remove any old listeners)
    const oldHandle = document.getElementById('cardCalibHandle');
    const newHandle = oldHandle.cloneNode(true);
    oldHandle.parentNode.replaceChild(newHandle, oldHandle);

    newHandle.addEventListener('mousedown', _onCardMouseDown);
    newHandle.addEventListener('touchstart', _onCardTouchStart, { passive: false });

    // Update text for current language
    const lang = state.currentLanguage;
    const titleEl = document.querySelector('#cardCalibrationScreen h2');
    if (titleEl) titleEl.innerHTML = LANG_STRINGS[lang].cardCalibTitle;
    const instrEl = document.querySelector('#cardCalibrationScreen [data-lang-key="cardCalibInstructions"]');
    if (instrEl) instrEl.innerHTML = LANG_STRINGS[lang].cardCalibInstructions;
}

function _onCardMouseDown(e) {
    e.preventDefault();
    _cardIsDragging = true;
    _cardDragStartX = e.clientX;
    _cardStartWidth = document.getElementById('cardCalibRect').getBoundingClientRect().width;
    document.addEventListener('mousemove', _onCardMouseMove);
    document.addEventListener('mouseup', _onCardMouseUp);
}

function _onCardMouseMove(e) {
    if (!_cardIsDragging) return;
    _updateCardWidth(e.clientX);
}

function _onCardMouseUp() {
    _cardIsDragging = false;
    document.removeEventListener('mousemove', _onCardMouseMove);
    document.removeEventListener('mouseup', _onCardMouseUp);
}

function _onCardTouchStart(e) {
    e.preventDefault();
    _cardIsDragging = true;
    _cardDragStartX = e.touches[0].clientX;
    _cardStartWidth = document.getElementById('cardCalibRect').getBoundingClientRect().width;
    document.addEventListener('touchmove', _onCardTouchMove, { passive: false });
    document.addEventListener('touchend', _onCardTouchEnd);
}

function _onCardTouchMove(e) {
    e.preventDefault();
    if (!_cardIsDragging) return;
    _updateCardWidth(e.touches[0].clientX);
}

function _onCardTouchEnd() {
    _cardIsDragging = false;
    document.removeEventListener('touchmove', _onCardTouchMove);
    document.removeEventListener('touchend', _onCardTouchEnd);
}

function _updateCardWidth(currentClientX) {
    const dx = currentClientX - _cardDragStartX;
    const newWidth = Math.max(CARD_MIN_WIDTH_PX, Math.min(CARD_MAX_WIDTH_PX, _cardStartWidth + dx));
    document.getElementById('cardCalibRect').style.width = newWidth + 'px';
    _updateCardCalibFeedback(newWidth);
}

function _updateCardCalibFeedback(cssWidthPx) {
    const feedbackEl = document.getElementById('cardCalibFeedback');
    const recEl = document.getElementById('cardCalibRecommendation');
    const continueBtn = document.getElementById('cardCalibContinueBtn');

    const dpr = window.devicePixelRatio || 1;
    // Physical pixels per mm: CSS px × device pixel ratio / card width in mm
    const physPixelsPerMm = (cssWidthPx * dpr) / CREDIT_CARD_WIDTH_MM;
    const physPPI = physPixelsPerMm * 25.4;

    // Validate plausible PPI range (60–300 covers almost all real displays)
    if (physPPI < 60 || physPPI > 310) {
        feedbackEl.textContent = 'This size looks unusual — please try again with a real credit or debit card.';
        feedbackEl.style.color = '#b00';
        recEl.classList.add('hidden');
        continueBtn.disabled = true;
        return;
    }

    // Estimate screen diagonal from screen pixel dimensions + calibrated PPI
    const screenWidthMm  = (screen.width  * dpr) / physPixelsPerMm;
    const screenHeightMm = (screen.height * dpr) / physPixelsPerMm;
    const screenDiagIn   = Math.sqrt(screenWidthMm ** 2 + screenHeightMm ** 2) / 25.4;

    // Warn if screen appears unusually small
    if (screenDiagIn < 10) {
        feedbackEl.textContent = `Estimated screen: ${screenDiagIn.toFixed(1)}". This may be too small — if this is wrong, please re-adjust the rectangle.`;
        feedbackEl.style.color = '#b06000';
    } else {
        feedbackEl.textContent = `Estimated screen size: ${screenDiagIn.toFixed(1)}" diagonal.`;
        feedbackEl.style.color = '#333';
    }

    // Save to state
    state.screenCalibration = {
        pixelsPerMm: physPixelsPerMm,
        devicePixelRatio: dpr,
        estimatedScreenDiagonalInches: Math.round(screenDiagIn * 10) / 10,
        cardWidthCSSPx: cssWidthPx
    };

    // Show viewing distance recommendation
    recEl.innerHTML = `<b>Viewing distance recommendation:</b> Based on your screen, please sit approximately <b>60&nbsp;cm</b> (arm's length) from your display throughout the experiment. This is important for ensuring consistent image quality across participants.`;
    recEl.classList.remove('hidden');

    continueBtn.disabled = false;
}

// =============================================================================
// VISUAL ANGLE SCALING
// =============================================================================

// Target: images subtend 20° of visual angle at 60 cm viewing distance.
// Physical width = 2 × 600mm × tan(10°) ≈ 211.6 mm
const VA_TARGET_ANGLE_DEG   = 20;
const VA_VIEWING_DISTANCE_MM = 600;
const VA_TARGET_PHYSICAL_MM  = 2 * VA_VIEWING_DISTANCE_MM * Math.tan((VA_TARGET_ANGLE_DEG / 2) * (Math.PI / 180));
// ≈ 211.6 mm

const VA_MIN_PX = 600;  // below this: image too small for reliable quality judgements
const VA_MAX_PX = 1400; // clamp ceiling for very dense screens that still fit in viewport
const VA_CONTROLS_WIDTH_PX = 420; // controls panel (400px) + gap (20px)

/**
 * Called immediately after the card calibration Continue button is pressed.
 * Derives the target image panel width from the calibrated CSS pixels-per-mm,
 * validates it, and stores it in state.screenCalibration.
 *
 * @returns {boolean} true if the participant is excluded (implausible setup), false otherwise.
 */
function computeVisualAngleScaling() {
    if (!state.screenCalibration || !state.screenCalibration.cardWidthCSSPx) {
        console.warn('[VA] No card calibration found — skipping visual angle scaling.');
        return false;
    }

    const cssPixelsPerMm = state.screenCalibration.cardWidthCSSPx / 85.6;
    const rawTargetPx = Math.round(VA_TARGET_PHYSICAL_MM * cssPixelsPerMm);
    const availablePx = window.innerWidth - VA_CONTROLS_WIDTH_PX;

    console.log(`[VA] cssPixelsPerMm=${cssPixelsPerMm.toFixed(3)}, rawTargetPx=${rawTargetPx}, availablePx=${availablePx}`);

    // Exclude if image cannot meet the minimum size for reliable quality judgements
    if (rawTargetPx < VA_MIN_PX) {
        console.warn(`[VA] Excluded: rawTargetPx=${rawTargetPx} < VA_MIN_PX=${VA_MIN_PX} (screen too small/low-density).`);
        _showScreenExclusionMessage(rawTargetPx, 'small');
        return true;
    }

    // Exclude only if the image physically cannot fit alongside the controls panel
    if (rawTargetPx > availablePx) {
        console.warn(`[VA] Excluded: rawTargetPx=${rawTargetPx} > availablePx=${availablePx} (layout overflow).`);
        _showScreenExclusionMessage(rawTargetPx, 'overflow');
        return true;
    }

    // For valid but very dense screens (rawTargetPx > VA_MAX_PX but fits in viewport),
    // clamp to VA_MAX_PX rather than excluding. The image will be slightly narrower than
    // the true 20° target, but the participant has a good screen.
    const targetPx = Math.min(rawTargetPx, VA_MAX_PX);
    if (rawTargetPx > VA_MAX_PX) {
        console.log(`[VA] High-density screen: rawTargetPx=${rawTargetPx} clamped to ${VA_MAX_PX}px.`);
    }

    state.screenCalibration.targetImageWidthPx = targetPx;
    state.screenCalibration.rawTargetImageWidthPx = rawTargetPx;
    state.screenCalibration.visualAngleDeg = VA_TARGET_ANGLE_DEG;

    return false; // proceed normally
}

/**
 * Shows a friendly exclusion screen when the participant's screen setup is
 * outside the valid range. Prolific participants are redirected to return their
 * submission.
 */
function _showScreenExclusionMessage(targetPx, reason) {
    const overlay = document.getElementById('screenSizeOverlay');
    if (!overlay) return;

    let message;
    if (reason === 'small') {
        message = `Based on your screen calibration, your display is too small or low-resolution 
            to present the study images at the minimum size required for reliable visual quality 
            judgements (computed image width: ${targetPx}px; minimum required: ${VA_MIN_PX}px).`;
    } else {
        // overflow: target image is wider than available viewport space
        const available = window.innerWidth - VA_CONTROLS_WIDTH_PX;
        message = `Based on your screen calibration, the study images would be wider 
            (${targetPx}px) than the available display area (${available}px) on your current 
            browser window. Please try expanding your browser to full screen and refreshing, 
            or use a different display.`;
    }

    overlay.querySelector('.orientation-message').innerHTML = `
        <span style="font-size:48px;">&#9888;</span>
        <p style="font-size:1.2em; font-weight:bold; margin-bottom:10px;">
            Your screen setup is not compatible with this study.
        </p>
        <p>${message}</p>
        <p>
            If you are participating via Prolific, please <b>return your submission</b>.
            We apologise for the inconvenience.
        </p>`;
    overlay.style.display = 'flex';
}

/**
 * Applies the calibrated image panel width to the DOM.
 * Sets the CSS custom property --vim-image-width and adds the
 * .image-panel--calibrated modifier class to the image panel.
 *
 * Must be called before the first trial renders.
 */
function applyVisualAngleScaling() {
    if (!state.screenCalibration || !state.screenCalibration.targetImageWidthPx) {
        console.warn('[VA] No target image width available — using default flex:1 layout.');
        return;
    }

    const targetPx = state.screenCalibration.targetImageWidthPx;
    document.documentElement.style.setProperty('--vim-image-width', targetPx + 'px');

    // There are multiple .image-panel elements in the DOM (paramDemoScreen,
    // preVimScreenContainer, vimTaskInterface). Target all of them.
    const panels = document.querySelectorAll('.image-panel');
    panels.forEach(panel => panel.classList.add('image-panel--calibrated'));
    console.log(`[VA] ${panels.length} image panel(s) fixed to ${targetPx}px (≈${VA_TARGET_ANGLE_DEG}° at ${VA_VIEWING_DISTANCE_MM / 10}cm).`);
}
