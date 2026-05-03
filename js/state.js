const state = {
    // Session
    sessionID: null,
    participantID: null,
    currentTaskMode: null,
    currentLanguage: "en",

    // Prolific
    prolificPID: null,
    studyID: null,
    isProlificRun: false,
    isDemoMode: false,
    assignedSet: null, // Latin Square set (A, B, or C)

    // Calibration
    calibrationConsecutiveCorrect: 0,
    calibrationTotalWrong: 0,
    longerLinePosition: null,
    calibrationLog: [], // Track all attempts for data analysis

    // Onboarding
    onboardingStep: 0,
    currentDemoIndex: 0,
    quizPassed: false,

    // Trial
    currentSessionTrials: [],
    currentGlobalTrialIndex: 0,
    currentTrialData: null,
    currentTrialResponses: null,
    allCollectedResponses: [],
    finalMatchRating: null,
    engineLevels: {},

    // Parameter
    currentParameterKey: null,
    currentParameterIndexInTask: 0,
    actualTaskOrder: [],
    hasMovedSlider: false,

    // Timing
    generationStartTime: null,
    parameterStartTime: null,

    // Progress
    completedSteps: 0,
    totalSteps: 0,

    // Preloading
    preloadedTrials: new Set(),

    // Demographics
    demographics: null,

    // Breaks
    breakData: [],

    // VVIQ
    vviq_scores: [],
    vviqEnabled: true,

    // Screen calibration (credit card)
    screenCalibration: null, // { pixelsPerMm, devicePixelRatio, estimatedScreenDiagonalInches, cardWidthCSSPx }

    reset() {
        this.sessionID = null;
        this.participantID = null;
        this.currentTaskMode = null;
        this.calibrationConsecutiveCorrect = 0;
        this.calibrationTotalWrong = 0;
        this.longerLinePosition = null;
        this.assignedSet = null;
        this.onboardingStep = 0;
        this.currentDemoIndex = 0;
        this.quizPassed = false;
        this.currentSessionTrials = [];
        this.currentGlobalTrialIndex = 0;
        this.currentTrialData = null;
        this.currentTrialResponses = null;
        this.allCollectedResponses = [];
        this.finalMatchRating = null;
        this.engineLevels = {};
        this.currentParameterKey = null;
        this.currentParameterIndexInTask = 0;
        this.actualTaskOrder = [];
        this.hasMovedSlider = false;
        this.breakData = [];
        this.vviq_scores = [];
        // Note: screenCalibration is intentionally NOT reset here.
        // It is set during onboarding and describes the physical display session,
        // not the task run. It must persist into startActualTask().

        // Keyboard focus state
        this.currentFocusableElements = [];
        this.currentFocusedIndex = -1;

        // Timers
        this.generationStartTime = null;
        this.parameterStartTime = null;
        this.totalSteps = 0;
        this.completedSteps = 0;

        console.log("State reset.");
    },

    // --- LOCAL STORAGE FOR CRASH RECOVERY ---
    LOCAL_STORAGE_KEY: 'vim_session_backup',
    SESSION_TTL_MS: 5 * 60 * 1000, // 5 minutes for Prolific sessions
    DEBUG_TTL_MS: 10 * 1000, // 10 seconds for debug/main menu sessions

    getSessionTTL() {
        // Prolific participants always have PROLIFIC_PID in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const isProlific = urlParams.has('PROLIFIC_PID') && urlParams.get('PROLIFIC_PID') !== '';
        return isProlific ? this.SESSION_TTL_MS : this.DEBUG_TTL_MS;
    },

    saveToLocalStorage() {
        const backup = {
            timestamp: Date.now(),
            sessionID: this.sessionID,
            prolificPID: this.prolificPID,
            studyID: this.studyID,
            isProlificRun: this.isProlificRun,
            assignedSet: this.assignedSet,
            onboardingStep: this.onboardingStep,
            quizPassed: this.quizPassed,
            currentSessionTrials: this.currentSessionTrials,
            currentGlobalTrialIndex: this.currentGlobalTrialIndex,
            currentTrialData: this.currentTrialData,
            currentTrialResponses: this.currentTrialResponses,
            allCollectedResponses: this.allCollectedResponses,
            finalMatchRating: this.finalMatchRating,
            engineLevels: this.engineLevels,
            currentParameterKey: this.currentParameterKey,
            currentParameterIndexInTask: this.currentParameterIndexInTask,
            actualTaskOrder: this.actualTaskOrder,
            demographics: this.demographics,
            calibrationSuccess: this.calibrationSuccess
        };
        try {
            localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(backup));
            console.log('[LocalStorage] State saved.');
        } catch (e) {
            console.warn('[LocalStorage] Save failed:', e);
        }
    },

    loadFromLocalStorage() {
        try {
            const raw = localStorage.getItem(this.LOCAL_STORAGE_KEY);
            if (!raw) return null;

            const backup = JSON.parse(raw);
            const age = Date.now() - backup.timestamp;

            if (age > this.getSessionTTL()) {
                console.log(`[LocalStorage] Backup expired (age: ${Math.round(age / 1000)}s). Clearing.`);
                this.clearLocalStorage();
                return null;
            }

            console.log(`[LocalStorage] Valid backup found (age: ${Math.round(age / 1000)}s).`);
            return backup;
        } catch (e) {
            console.warn('[LocalStorage] Load failed:', e);
            return null;
        }
    },

    restoreFromBackup(backup) {
        this.sessionID = backup.sessionID;
        this.prolificPID = backup.prolificPID;
        this.studyID = backup.studyID;
        this.isProlificRun = backup.isProlificRun;
        this.assignedSet = backup.assignedSet;
        this.onboardingStep = backup.onboardingStep;
        this.quizPassed = backup.quizPassed;
        this.currentSessionTrials = backup.currentSessionTrials;
        this.currentGlobalTrialIndex = backup.currentGlobalTrialIndex;
        this.currentTrialData = backup.currentTrialData;
        this.currentTrialResponses = backup.currentTrialResponses;
        this.allCollectedResponses = backup.allCollectedResponses;
        this.finalMatchRating = backup.finalMatchRating;
        this.engineLevels = backup.engineLevels || {};
        this.currentParameterKey = backup.currentParameterKey;
        this.currentParameterIndexInTask = backup.currentParameterIndexInTask;
        this.actualTaskOrder = backup.actualTaskOrder;
        this.demographics = backup.demographics;
        this.calibrationSuccess = backup.calibrationSuccess;
        console.log('[LocalStorage] State restored from backup.');
    },

    clearLocalStorage() {
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
        console.log('[LocalStorage] Backup cleared.');
    }
};
