class TaskState {
    constructor() {
        this.reset();
    }

    reset() {
        this.currentSessionTrials = [];
        this.currentGlobalTrialIndex = 0;
        this.currentTrialData = null;
        this.currentTrialResponses = {};
        this.allCollectedResponses = [];
        this.quizPassed = false;
        this.sliderToActualLevelMap = [];

        this.breakData = [];
        this.vviq_scores = [];
        this.vviqEnabled = true; // Default to true, will be updated from UI
        this.vviqInstructionStep = 0;

        this.currentConfidenceSelection = null;
        this.hasMovedSlider = false;

        // Keyboard focus state
        this.currentFocusableElements = [];
        this.currentFocusedIndex = -1;

        // Timers
        this.generationStartTime = null;
        this.parameterStartTime = null;

        console.log("TaskState reset.");
    }
}

// Create a global instance
const state = new TaskState();
