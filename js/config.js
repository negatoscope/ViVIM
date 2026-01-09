// --- CONFIGURATION AND CONSTANTS ---

// Debug Flags
const DEBUG_SHOW_RESULTS = false; // Set to true to show results for debugging
const DEBUG_SKIP_BREAK_TIMER = false; // Set to false for real participants

// Keyboard Navigation
const KEYBOARD_INPUTS_ENABLED = true;
const KEYBOARD_FOCUS_CLASS = "keyboard-focus";

// Task Settings
const BREAK_DURATION_SECONDS = 120; // Standard break duration
const MAX_BREAK_EXTENSION_MINUTES = 5;
const FINE_TUNE_RANGE = 3;
const IMAGE_BASE_FOLDER = "images";
const IMAGE_EXTENSION = ".jpg";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwkcpn2kATIjVlfgGAT6um4sN2LOcTU6Qde2vj8mKzd19VtfVxHynh3KR-qMBuNeanSkQ/exec";

// Language Strings
const LANG_STRINGS = {
  en: {
    // --- Existing Strings ---
    mainMenuTitle: "Vividness in Visual Imagery Matching (ViVIM) Task",
    mainMenuWelcome: `
<p>This application is a research tool designed to measure the qualities of visual imagery. It was created by Luis Eudave at the University of Navarra.</p>
<p>You can use this interface to test the <b>Vividness in Visual Imagery Matching (ViVIM) Task</b> and the <b>Vividness of Visual Imagery Questionnaire (VVIQ-2)</b>.</p>
<p>This project is open source. You can find the code and documentation at the <a href="https://github.com/negatoscope/VIM_prototype" target="_blank">GitHub repository</a>.</p>
`,
    testParamButton: "ViVIM Task Tutorial",
    startTaskButton: "Start ViVIM Task",
    paramSelectorTitle: "Select Quality to Test",
    conditionInstructionTitle: "Instructions: {condition} Task",
    trialContinueButton: "Continue",
    holdImagePrompt_recall:
      "Please keep the image you just saw in your mind. Press Continue when ready.",
    holdImagePrompt_imagine:
      "Once you have formed a clear mental image of the scene as instructed, press Continue.",
    vimGeneralInstruction:
      "Please keep the image of your {sceneType} in your mind.",
    vimCoarsePrompt:
      "Select the image that best represents the overall level for",
    coarseButtonLow: "Low",
    coarseButtonMid: "Medium",
    coarseButtonHigh: "High",
    coarsePreviewText: "Hover over buttons to preview, click to select.",
    fineTunePrompt: "Now, fine-tune your selection for",
    selectedLevelLabel: "Selected Level:",
    backToCoarseButton: "Back to Coarse Selection",
    confirmLevelButton: "Confirm This Level",
    backToMenuButton: "Back to Main Menu",
    exitTaskButton: "Back to Main Menu (Exit Task)",
    exitConfirmMessage:
      "Are you sure you want to exit the current task and return to the main menu? Progress will be lost.",
    resultsTitle: "Trial Results",
    downloadResultsButton: "Download Results",
    confidencePrompt: "How confident are you in your selection?",
    likertLabelLow: "Not at all confident",
    likertLabelHigh: "Completely confident",
    confirmConfidenceButton: "Confirm Confidence",
    // --- New Onboarding Strings ---
    welcomeTitle: "Instructions",
    welcomeInstructions: `
<p>Thank you for participating in this important study on the nature of mental imagery. Our objective is to better understand the different visual qualities that make up our internal experiences, such as memories and imagination.</p>
<p>In this task, you will be asked to generate various mental images and then use a set of visual tools to match what you experienced. You will also be asked to complete a standardized questionnaire about your imagery abilities.</p>
<p>The entire session takes approximately 40 minutes to complete. It is very important that you complete it in one single session without major interruptions. There will be two scheduled opportunities to take a short break. Please ensure you are in a quiet environment where you can focus.</p>
`,
    calibrationTitle: "Screen Calibration",
    calibrationInstructions: "To ensure the best experience, please set your screen brightness to the maximum level, or increase it until you can clearly distinguish the dark grey circle below from the black background.",
    continueButton: "Continue",
    howToTitle: "How the Task Works",
    howToStep1:
      `<p>In each trial, you will follow a simple two-phase process: First, you will be asked to generate an image in your mind based on a prompt. Second, you will adjust an image on the screen to try to match the qualities of your mental image, along with a rating of how confident you were in that match. Here are the details for each phase: </p>
      <b>1. Generate an Image:</b> Based on the instruction, you will either remember a photo you just saw, recall a personal memory, or imagine a new scene. We encourage you to <b>close your eyes</b> for this step to help you focus. Try to form the image as you naturally would, and once you have a clear impression, <b>hold that image in your mind.</b>`,
    howToStep2:
      "<b>Step 2: Match the Image Quality.</b> You will then adjust an image on the screen to match the visual qualities of your mental image.",
    howToStep3:
      "<b>Step 3: Rate Your Confidence.</b> After each adjustment, you will rate how confident you are in your choice.",
    paramIntroTitle: "How the Task Works",
    paramIntroText:
      `<b>2. Match the Image:</b> With the mental image in mind, you will open your eyes. Your task will be to adjust an image on the screen, using buttons and a slider, until it best matches the visual qualities (like brightness, clarity, etc.) of the image in your head. The next few screens will provide an explanation of each quality along with an interactive demonstration of each one.`,
    paramDemoTitleTemplate: "Quality {X} of 6: {paramName}",
    paramDemoTextTemplate: "This refers to {paramDescription}",
    practiceIntroTitle: "Putting It All Together: A Practice Round",
    practiceIntroText: `
          <p>
              Now that you are familiar with the different visual qualities, you will complete one full practice rating for <b>Brightness</b>.
          </p>
          <p>
              <b>1. Coarse Selection:</b> First, you will choose a general level (Low, Medium, or High).<br><br>
              <b>2. Fine-Tuning:</b> Next, you will use a slider to make a more precise match.<br><br>
              <b>3. Confidence Rating:</b> Finally, you will rate how confident you were in your match.
          </p>
          <p>We understand that the image on the screen may not perfectly match the visual qualities of the image in your mind's eye. Your goal is not to find an exact replica, but to make the <b>best possible approximation</b>. Please choose the settings that feel closest to your internal experience.</p>
      `,
    tutorialPromptTitle: "Practice Trial: Instructions",
    tutorialPromptText: "For this practice trial, please: <b>IMAGINE a father playing with this infant son at a park.</b><br><br>Please close your eyes to form a clear and stable mental image. When you have it, open your eyes and press Continue.",
    tutorialVimInstruction: "This is a practice round. Please try to match the <b>Brightness</b> of the mental image you are holding in your mind.",
    startPracticeButton: "Continue",
    readyTitle: "Practice Complete",
    readyText:
      "You have completed all instructions and practice. The main experiment will now begin. There will be 12 trials, plus 3 attention checks.",
    startExperimentButton: "Start Experiment",
    breakTitle: "Take a Short Break",
    breakText:
      "You have completed a block of trials. You must wait 120 seconds before continuing. Use this time to look away from the display, stand and stretch, or relax. If you need more time you may extend the break up to 5 minutes. When you are ready, press Continue.",
    noInfoLabel: "I have no clear impression of this quality.",
    blinkNowPrompt: "Blink Now",
    perceptualIntroTitle: "Source 1: Remembering a Photo",
    perceptualIntroText: "In some trials, you will be shown a photograph for a very brief moment. Your task is to hold the <b>very first mental impression</b> of that photo in your mind after it disappears. Try to match your ratings to that initial mental image, even if your memory seems to update or change later on.",
    episodicIntroTitle: "Source 2: Recalling a Personal Memory",
    episodicIntroText: "In other trials, you will be asked to recall a <b>personal memory from your own life</b>. This should be an event you experienced or a place you know well. The goal is to bring a specific, personal past experience to your mind's eye.",
    imaginationIntroTitle: "Source 3: Imagining a New Scene",
    imaginationIntroText: "Finally, in some trials, you will be asked to <b>construct a new scene in your mind</b> that is not from a specific memory. Think of this as creating a generic or prototypical image based on the description provided.",
    flowIntroTitle: "The Rating Process",
    flowIntroText: "For each of the six visual qualities, you will perform a simple three-step rating to best match your mental image:",
    approximationIntroTitle: "An Important Note",
    approximationIntroText: "We understand that the image on the screen may not be a perfect replica of the image in your mind's eye. Your goal is not to find an exact match, but to choose the settings that feel like the <b>best possible approximation</b> of your internal experience.",
    quizTitle: "Knowledge Check",
    quizInstructions: "Please answer the following questions to confirm you have understood the instructions.",
    quizErrorMessage: "One or more answers are incorrect. Please review your selections and the instructions if needed.",
    quizSuccessMessage: "Correct! Please remember: <b>Remembering</b> is retrieving a past experience, while <b>Imagining</b> is creating a new one. Always adjust the image to match your mental impression.",
    quizQuestions: [
      {
        question: "When you are asked to recall a <b>personal memory</b>, what kind of image should you bring to mind?",
        options: [
          "A generic scene that I construct myself.",
          "An event I personally experienced or a place I know well.",
          "The photograph I was just shown by the application."
        ],
        correctAnswerIndex: 1 // The second option is correct
      },
      {
        question: "What is the main goal when adjusting the image on the screen?",
        options: [
          "To create the most beautiful or interesting image possible.",
          "To make a perfect, pixel-for-pixel replica of my mental image.",
          "To choose the settings that feel like the best possible approximation of my mental image."
        ],
        correctAnswerIndex: 2 // The third option is correct
      }
    ],
    vviqCheckboxLabel: "Include VVIQ-2"
  },
  es: {
    // --- Existing Strings ---
    mainMenuTitle: "Tarea de Igualación de Viveza de Imágenes Visuales (IVIV)",
    mainMenuWelcome: `
<p>Esta aplicación es una herramienta de investigación diseñada para medir las cualidades de la imaginación visual. Ha sido creada por Luis Eudave en la Universidad de Navarra.</p>
<p>Puede utilizar esta interfaz para probar la <b>Tarea de Igualación de Viveza de Imágenes Visuales (IVIV)</b> y el <b>Cuestionario de Viveza de la Imaginación Visual (VVIQ-2)</b>.</p>
<p>Este proyecto es de código abierto. Puede encontrar el código y la documentación en el <a href="https://github.com/negatoscope/ViVIM" target="_blank">repositorio de GitHub</a>.</p>
`,
    testParamButton: "Tutorial Tarea IVIV",
    startTaskButton: "Comenzar Tarea IVIV",
    paramSelectorTitle: "Seleccione el Cualidad a Probar",
    conditionInstructionTitle: "Instrucciones: Tarea de {condition}",
    trialContinueButton: "Continuar",
    holdImagePrompt_recall:
      "Por favor, mantenga la imagen que acaba de ver en su mente. Presione Continuar cuando esté listo/a.",
    holdImagePrompt_imagine:
      "Una vez que haya formado una imagen mental clara de la escena como se le indicó, presione Continuar.",
    vimGeneralInstruction:
      "Por favor, mantenga la imagen de su {sceneType} en su mente.",
    vimCoarsePrompt:
      "Seleccione la imagen que mejor represente el nivel general para",
    coarseButtonLow: "Bajo",
    coarseButtonMid: "Medio",
    coarseButtonHigh: "Alto",
    coarsePreviewText:
      "Pase el cursor sobre los botones para previsualizar, haga clic para seleccionar.",
    fineTunePrompt: "Ahora, ajuste su selección para",
    selectedLevelLabel: "Nivel Seleccionado:",
    backToCoarseButton: "Volver a Selección General",
    confirmLevelButton: "Confirmar este Nivel",
    backToMenuButton: "Volver al Menú Principal",
    exitTaskButton: "Volver al Menú Principal (Salir de la Tarea)",
    exitConfirmMessage:
      "¿Está seguro/a de que desea salir de la tarea actual y volver al menú principal? El progreso se perderá.",
    resultsTitle: "Resultados de los Ensayos",
    downloadResultsButton: "Descargar Resultados",
    confidencePrompt: "¿Qué tan seguro/a está de su selección?",
    likertLabelLow: "Nada seguro/a",
    likertLabelHigh: "Completamente seguro/a",
    confirmConfidenceButton: "Confirmar Confianza",
    // --- New Onboarding Strings ---
    welcomeTitle: "Instrucciones",
    welcomeInstructions: `
<p>Gracias por participar en este importante estudio sobre la naturaleza de la imaginación mental. Nuestro objetivo es comprender mejor las diferentes cualidades visuales que componen nuestras experiencias internas, como los recuerdos y la imaginación.</p>
<p>En esta tarea, se le pedirá que genere varias imágenes mentales y que luego utilice una serie de herramientas visuales para igualar lo que ha experimentado. También se le pedirá que complete un cuestionario estandarizado sobre sus habilidades de imaginación.</p>
<p>La sesión completa dura aproximadamente 40 minutos. Es muy importante que la complete en una única sesión sin interrupciones importantes. Habrá dos oportunidades programadas para tomar un breve descanso. Por favor, asegúrese de estar en un entorno tranquilo donde pueda concentrarse.</p>
`,
    calibrationTitle: "Calibración de Pantalla",
    calibrationInstructions: "Para asegurar la mejor experiencia, por favor ajuste el brillo de su pantalla al máximo, o auméntelo hasta que pueda distinguir claramente el círculo gris oscuro de abajo del fondo negro.",
    continueButton: "Continuar",
    howToTitle: "Cómo Funciona la Tarea",
    howToStep1:
      `<p>En cada ensayo, seguirá un sencillo proceso de dos fases: Primero, se le pedirá que genere una imagen en su mente basándose en una instrucción. Segundo, ajustará una imagen en la pantalla para intentar que coincida con las cualidades de su imagen mental, incluyendo una valoración sobre qué tan seguro/a está de su decisión. Aquí están los detalles de cada paso: </p>
      <b>1. Generar una Imagen:</b> Basándose en la instrucción, deberá recordar una foto que acaba de ver, evocar un recuerdo personal o imaginar una escena nueva. Le animamos a <b>cerrar los ojos</b> en este paso para ayudarle a concentrarse. Intente formar la imagen de la manera más natural para usted y, una vez que tenga una impresión clara, <b>mantenga esa imagen en su mente.</b>`,
    howToStep2:
      "<b>Paso 2: Igualar la Calidad de la Imagen.</b> Luego, ajustará una imagen en la pantalla para que coincida con las cualidades visuales de su imagen mental.",
    howToStep3:
      "<b>Paso 3: Calificar su Confianza.</b> Después de cada ajuste, calificará qué tan seguro/a está de su elección.",
    paramIntroTitle: "Cómo Funciona la Tarea",
    paramIntroText:
      `<b>2. Igualar la Imagen:</b> Con la imagen mental en mente, abrirá los ojos. Su tarea será ajustar una imagen en la pantalla, usando botones y un deslizador, hasta que coincida lo mejor posible con las cualidades visuales (como el brillo, el desenfoque, etc.) de la imagen en su cabeza. A continuación se le ofrecerán una explicación y una demostración interactiva de cada una de estas cualidades.`,
    paramDemoTitleTemplate: "Cualidad {X} de 6: {paramName}",
    paramDemoTextTemplate: "Esto se refiere a {paramDescription}",
    practiceIntroTitle: "Poniéndolo Todo Junto: Una Ronda de Práctica",
    practiceIntroText: `
          <p>
              Ahora que se ha familiarizado con las diferentes cualidades visuales, completará una ronda de prueba completa para el parámetro de <b>Brillo</b>.
          </p>
          <p>
              <b>1. Selección General:</b> Primero, elegirá un nivel general (Bajo, Medio o Alto).<br><br>
              <b>2. Ajuste Fino:</b> Luego, usará un deslizador para hacer un ajuste más preciso.<br><br>
              <b>3. Calificación de Confianza:</b> Finalmente, calificará qué tan seguro/a estaba de su ajuste.
          </p>
          <p>Entendemos que la imagen en la pantalla puede no coincidir perfectamente con las cualidades visuales de la imagen en su mente. Su objetivo no es encontrar una réplica exacta, sino realizar la <b>mejor aproximación posible</b>. Por favor, elija los ajustes que sienta más cercanos a su experiencia interna.</p>
      `,
    tutorialPromptTitle: "Ensayo de Práctica: Instrucciones",
    tutorialPromptText: "Para este ensayo de práctica, por favor: <b>IMAGINE un padre jugando con su hijo pequeño en un parque.</b><br><br>Por favor, cierre los ojos para formar una imagen clara y estable. Cuando la tenga, abra los ojos y presione Continuar.",
    tutorialVimInstruction: "Esta es una ronda de práctica. Por favor, intente igualar el <b>Brillo</b> de la imagen mental que tiene en su mente.",
    startPracticeButton: "Continuar",
    readyTitle: "Práctica Completada",
    readyText:
      "Ha completado las instrucciones y la práctica. El experimento principal comenzará ahora. Habrá 12 ensayos, más 3 pruebas de atención.",
    startExperimentButton: "Comenzar Experimento",
    breakTitle: "Tome un Breve Descanso",
    breakText:
      "Ha completado un bloque de ensayos. Debe esperar 120 segundos antes de continuar. Utilice este tiempo para apartar la vista de la pantalla, ponerse de pie y estirarse, o relajarse. Si necesita más tiempo, puede ampliar la pausa hasta un máximo de 5 minutos. Cuando esté listo, pulse «Continuar».",
    noInfoLabel: "No tengo una impresión clara de esta cualidad.",
    blinkNowPrompt: "Parpadee Ahora",
    perceptualIntroTitle: "Fuente 1: Recordar una Foto",
    perceptualIntroText: "En algunos ensayos, se le mostrará una fotografía por un instante muy breve. Su tarea es mantener en su mente la <b>primera impresión mental</b> de esa foto después de que desaparezca. Intente que sus ajustes coincidan con esa imagen mental inicial, incluso si su memoria parece actualizarse o cambiar más tarde.",
    episodicIntroTitle: "Fuente 2: Rememorar un Recuerdo Personal",
    episodicIntroText: "En otros ensayos, se le pedirá que rememore un <b>recuerdo personal de su propia vida</b>. Debe ser un evento que usted experimentó o un lugar que conoce bien. El objetivo es traer a su ojo mental una experiencia pasada, específica y personal.",
    imaginationIntroTitle: "Fuente 3: Imaginar una Escena Nueva",
    imaginationIntroText: "Finalmente, en algunos ensayos, se le pedirá que <b>construya una escena nueva en su mente</b> que no provenga de un recuerdo específico. Piense en esto como crear una imagen genérica o prototípica basada en la descripción proporcionada.",
    flowIntroTitle: "El Proceso de Calificación",
    flowIntroText: "Para cada una de las seis cualidades visuales, realizará una calificación en tres sencillos pasos para que coincida lo mejor posible con su imagen mental:",
    approximationIntroTitle: "Una Nota Importante",
    approximationIntroText: "Entendemos que la imagen en la pantalla puede no ser una réplica perfecta de la imagen en su mente. Su objetivo no es encontrar una coincidencia exacta, sino elegir los ajustes que sienta que son la <b>mejor aproximación posible</b> a su experiencia interna.",
    quizTitle: "Prueba de Comprensión",
    quizInstructions: "Por favor, responda a las siguientes preguntas para confirmar que ha entendido las instrucciones.",
    quizErrorMessage: "Una o más respuestas son incorrectas. Por favor, revise sus selecciones y las instrucciones si es necesario.",
    quizSuccessMessage: "¡Correcto! Por favor, recuerde: <b>Rememorar</b> es recuperar una experiencia pasada, mientras que <b>Imaginar</b> es crear una nueva. Ajuste siempre la imagen para que coincida con su impresión mental.",
    quizQuestions: [
      {
        question: "Cuando se le pida que rememore un <b>recuerdo personal</b>, ¿qué tipo de imagen debe traer a su mente?",
        options: [
          "Una escena genérica que yo mismo/a construya.",
          "Un evento que yo experimenté personalmente o un lugar que conozco bien.",
          "La fotografía que la aplicación me acaba de mostrar."
        ],
        correctAnswerIndex: 1 // La segunda opción es la correcta
      },
      {
        question: "What is the main goal when adjusting the image on the screen?",
        options: [
          "Crear la imagen más bonita o interesante posible.",
          "Hacer una réplica perfecta, píxel por píxel, de mi imagen mental.",
          "Elegir los ajustes que se sientan como la mejor aproximación posible a mi imagen mental."
        ],
        correctAnswerIndex: 2 // La tercera opción es la correcta
      }
    ],
    vviqCheckboxLabel: "Incluir VVIQ-2"
  },
};

const PARAMETERS = {
  brightness: {
    name: { en: "Brightness", es: "Brillo" }, levels: 21, coarse: { low: 4, mid: 11, high: 18 },
    instructions: {
      demo: {
        en: `How <b>bright or dim</b> the scene appeared in your mind. <p>In the interactive demo, notice how moving the slider changes the image from dark (<b>Low Brightness</b>) to bright (<b>High Brightness</b>).</p><p>Use your mouse or arrow keys to move the slider.</p>`,
        es: `Qué tan <b>brillante u oscuro</b> parecía la escena en su mente. <p>En la demostración interactiva, observe cómo al mover el deslizador la imagen cambia de oscura (<b>Bajo Brillo</b>) a brillante (<b>Alto Brillo</b>).</p>`
      },
      tutorial: {
        coarse: { en: "Use your mouse or Arrow + Enter keys to select the button (Low, Medium, or High) that best represents the overall <b>Brightness</b> of your mental image. <p>Notice that if you have no clear impression of such quality (in this case Brightness), you may choose so.</p>", es: "Usando el ratón o las flechas del teclado y la tecla Intro, seleccione el botón (Bajo, Medio o Alto) que mejor represente el <b>Brillo</b> general de su imagen mental. <p>Si no tuviera una impresión clara de la cualidad en cuestión (en este caso Brillo), puede seleccionar la opción correspondiente.</p>" },
        fineTune: { en: "Now, use your mouse or Arrow + Enter keys to move the slider to fine-tune the <b>Brightness</b> for a more precise match. <p>You may also go back to Coarse selection by clicking the button or pressing the Backspace key</p>", es: "Ahora, use el ratón o las flechas del teclado y la tecla Intro para mover el deslizador para ajustar el <b>Brillo</b> de forma más precisa. <p>También es posible retroceder a la selección anterior haciendo click en el botón o pulsando la tecla Retroceso.</p>" },
        confidence: {
          en: "Finally, please rate how confident you are that the image you adjusted is a good match for your mental image.",
          es: "Finalmente, por favor califique qué tan seguro/a está de que la imagen que ajustó se corresponde con su imagen mental."
        }
      },
      task: {
        coarse: { en: "First, select the button (Low, Medium, or High) that best represents the overall <b>Brightness</b> of your mental image.", es: "Primero, seleccione el botón (Bajo, Medio o Alto) que mejor represente el <b>Brillo</b> general de su imagen mental." },
        fineTune: { en: "Now, use the slider to fine-tune the <b>Brightness</b> for a more precise match.", es: "Ahora, use el deslizador para ajustar el <b>Brillo</b> de forma más precisa." }
      }
    }
  },
  contrast: {
    name: { en: "Contrast", es: "Contraste" }, levels: 21, coarse: { low: 4, mid: 11, high: 18 },
    instructions: {
      demo: {
        en: `The difference between the <b>light and dark</b> areas of the scene in your mind. <p>In the interactive demo, notice how moving the slider changes the image from washed out (<b>Low Contrast</b>) to stark and defined (<b>High Contrast</b>).</p>`,
        es: `La diferencia entre las áreas <b>claras y oscuras</b> de la escena en su mente. <p>En la demostración interactiva, observe cómo al mover el deslizador la imagen cambia de tener un aspecto lavado (<b>Bajo Contraste</b>) a uno nítido y definido (<b>Alto Contraste</b>).</p>`
      },
      tutorial: {
        coarse: { en: "PRACTICE: First, select the button (Low, Medium, or High) that best represents the overall <b>Contrast</b> of your mental image.", es: "PRÁCTICA: Primero, seleccione el botón (Bajo, Medio o Alto) que mejor represente el <b>Contraste</b> general de su imagen mental." },
        fineTune: { en: "PRACTICE: Great! Now, use the slider to fine-tune the <b>Contrast</b> for a more precise match.", es: "PRÁCTICA: ¡Genial! Ahora, use el deslizador para ajustar el <b>Contraste</b> de forma más precisa." }
      },
      task: {
        coarse: { en: "First, select the button (Low, Medium, or High) that best represents the overall <b>Contrast</b> of your mental image.", es: "Primero, seleccione el botón (Bajo, Medio o Alto) que mejor represente el <b>Contraste</b> general de su imagen mental." },
        fineTune: { en: "Now, use the slider to fine-tune the <b>Contrast</b> for a more precise match.", es: "Ahora, use el deslizador para ajustar el <b>Contraste</b> de forma más precisa." }
      }
    }
  },
  saturation: {
    name: { en: "Saturation", es: "Saturación" }, levels: 21, coarse: { low: 4, mid: 11, high: 18 },
    instructions: {
      demo: {
        en: `How <b>colorful or muted</b> the scene appeared in your mind. <p>In the interactive demo, notice how moving the slider changes the image from grayscale (<b>Low Saturation</b>) to intensely colorful (<b>High Saturation</b>).</p>`,
        es: `Qué tan <b>colorida o apagada</b> parecía la escena en su mente. <p>En la demostración interactiva, observe cómo al mover el deslizador la imagen cambia de una escala de grises (<b>Baja Saturación</b>) a colores intensos (<b>Alta Saturación</b>).</p>`
      },
      tutorial: {
        coarse: { en: "PRACTICE: First, select the button (Low, Medium, or High) that best represents the overall <b>Saturation</b> of your mental image.", es: "PRÁCTICA: Primero, seleccione el botón (Bajo, Medio o Alto) que mejor represente la <b>Saturación</b> general de su imagen mental." },
        fineTune: { en: "PRACTICE: Great! Now, use the slider to fine-tune the <b>Saturation</b> for a more precise match.", es: "PRÁCTICA: ¡Genial! Ahora, use el deslizador para ajustar la <b>Saturación</b> de forma más precisa." }
      },
      task: {
        coarse: { en: "First, select the button (Low, Medium, or High) that best represents the overall <b>Saturation</b> of your mental image.", es: "Primero, seleccione el botón (Bajo, Medio o Alto) que mejor represente la <b>Saturación</b> general de su imagen mental." },
        fineTune: { en: "Now, use the slider to fine-tune the <b>Saturation</b> for a more precise match.", es: "Ahora, use el deslizador para ajustar la <b>Saturación</b> de forma más precisa." }
      }
    }
  },
  clarity: {
    name: { en: "Clarity", es: "Nitidez" }, levels: 21, coarse: { low: 4, mid: 11, high: 18 },
    instructions: {
      demo: {
        en: `How <b>clear and sharp</b> or <b>blurry and out-of-focus</b> the scene was in your mind. <p>In the interactive demo, notice how moving the slider changes the image from blurry and indistinct (<b>Low Clarity</b>) to sharp and perfectly focused (<b>High Clarity</b>).</p>`,
        es: `Qué tan <b>nítida y enfocada</b> o <b>borrosa y desenfocada</b> estaba la escena en su mente. <p>En la demostración interactiva, observe cómo al mover el deslizador la imagen cambia de borrosa e indistinta (<b>Baja Nitidez</b>) a nítida y perfectamente enfocada (<b>Alta Nitidez</b>).</p>`
      },
      tutorial: {
        coarse: { en: "PRACTICE: First, select the button (Low, Medium, or High) that best represents the overall <b>Clarity</b> of your mental image.", es: "PRÁCTICA: Primero, seleccione el botón (Bajo, Medio o Alto) que mejor represente la <b>Nitidez</b> general de su imagen mental." },
        fineTune: { en: "PRACTICE: Great! Now, use the slider to fine-tune the <b>Clarity</b> for a more precise match.", es: "PRÁCTICA: ¡Genial! Ahora, use el deslizador para ajustar la <b>Nitidez</b> de forma más precisa." }
      },
      task: {
        coarse: { en: "First, select the button (Low, Medium, or High) that best represents the overall <b>Clarity</b> of your mental image.", es: "Primero, seleccione el botón (Bajo, Medio o Alto) que mejor represente la <b>Nitidez</b> general de su imagen mental." },
        fineTune: { en: "Now, use the slider to fine-tune the <b>Clarity</b> for a more precise match.", es: "Ahora, use el deslizador para ajustar la <b>Nitidez</b> de forma más precisa." }
      }
    }
  },
  detailedness: {
    name: { en: "Detailedness", es: "Nivel de Detalle" }, levels: 21, coarse: { low: 4, mid: 11, high: 18 },
    instructions: {
      demo: {
        en: `The amount of <b>fine-grained detail and texture</b> present in the scene in your mind. <p>In the interactive demo, notice how moving the slider changes the image from one with less objects, outlines and little detail (<b>Low Detail</b>) to one with more objects and detailed textures (<b>High Detail</b>).</p>`,
        es: `La cantidad de <b>detalles finos y texturas</b> presentes en la escena en su mente. <p>En la demostración interactiva, observe cómo al mover el deslizador la imagen cambia de una con pocos objetos, border y detalle (<b>Bajo Detalle</b>) a una con más objetos con texturas detalladas (<b>Alto Detalle</b>).</p>`
      },
      tutorial: {
        coarse: { en: "PRACTICE: First, select the button (Low, Medium, or High) that best represents the overall <b>Detailedness</b> of your mental image.", es: "PRÁCTICA: Primero, seleccione el botón (Bajo, Medio o Alto) que mejor represente el <b>Nivel de Detalle</b> general de su imagen mental." },
        fineTune: { en: "PRACTICE: Great! Now, use the slider to fine-tune the <b>Detailedness</b> for a more precise match.", es: "PRÁCTICA: ¡Genial! Ahora, use el deslizador para ajustar el <b>Nivel de Detalle</b> de forma más precisa." }
      },
      task: {
        coarse: { en: "First, select the button (Low, Medium, or High) that best represents the overall <b>Detailedness</b> of your mental image.", es: "Primero, seleccione el botón (Bajo, Medio o Alto) que mejor represente el <b>Nivel de Detalle</b> general de su imagen mental." },
        fineTune: { en: "Now, use the slider to fine-tune the <b>Detailedness</b> for a more precise match.", es: "Ahora, use el deslizador para ajustar el <b>Nivel de Detalle</b> de forma más precisa." }
      }
    }
  },
  precision: {
    name: { en: "Color Precision", es: "Precisión de Color" }, levels: 21, coarse: { low: 4, mid: 11, high: 18 },
    instructions: {
      demo: {
        en: `How <b>specific or ambiguous</b> the colors were in your mind. <p>In the interactive demo, notice how moving the slider changes the image from having few, blocky colors (<b>Low Precision</b>) to having many subtle shades and gradients (<b>High Precision</b>).</p>`,
        es: `Qué tan <b>específicos o ambiguos</b> eran los colores en su mente. <p>En la demostración interactiva, observe cómo al mover el deslizador la imagen cambia de tener pocos colores sólidos (<b>Baja Precisión</b>) a tener muchos tonos y gradientes sutiles (<b>Alta Precisión</b>).</p>`
      },
      tutorial: {
        coarse: { en: "PRACTICE: First, select the button (Low, Medium, or High) that best represents the overall <b>Color Precision</b> of your mental image.", es: "PRÁCTICA: Primero, seleccione el botón (Bajo, Medio o Alto) que mejor represente la <b>Precisión de Color</b> general de su imagen mental." },
        fineTune: { en: "PRACTICE: Great! Now, use the slider to fine-tune the <b>Color Precision</b> for a more precise match.", es: "PRÁCTICA: ¡Genial! Ahora, use el deslizador para ajustar la <b>Precisión de Color</b> de forma más precisa." }
      },
      task: {
        coarse: { en: "First, select the button (Low, Medium, or High) that best represents the overall <b>Color Precision</b> of your mental image.", es: "Primero, seleccione el botón (Bajo, Medio o Alto) que mejor represente la <b>Precisión de Color</b> general de su imagen mental." },
        fineTune: { en: "Now, use the slider to fine-tune the <b>Color Precision</b> for a more precise match.", es: "Ahora, use el deslizador para ajustar la <b>Precisión de Color</b> de forma más precisa." }
      }
    }
  },
  attention_check: {
    name: { en: "Attention Check", es: "Prueba de Atención" },
    levels: 21,
    coarse: { low: 4, mid: 11, high: 18 },
    variants: [
      {
        id: 0,
        correct_coarse: 'low',
        correct_fine_slider_val: 7, // Slider all the way to the right
        instructions: {
          coarse: { en: "For this attention check, please select the <b>'Low'</b> button.", es: "Para esta prueba de atención, por favor seleccione el botón <b>'Bajo'</b>." },
          fineTune: { en: "Now, please move the slider <b>all the way to the right</b> and click 'Confirm'.", es: "Ahora, por favor mueva el deslizador <b>completamente hacia la derecha</b> y haga clic en 'Confirmar'." }
        }
      },
      {
        id: 1,
        correct_coarse: 'mid',
        correct_fine_slider_val: 1, // Slider all the way to the left
        instructions: {
          coarse: { en: "For this attention check, please select the <b>'Medium'</b> button.", es: "Para esta prueba de atención, por favor seleccione el botón <b>'Medio'</b>." },
          fineTune: { en: "Now, please move the slider <b>all the way to the left</b> and click 'Confirm'.", es: "Ahora, por favor mueva el deslizador <b>completamente hacia la izquierda</b> y haga clic en 'Confirmar'." }
        }
      },
      {
        id: 2,
        correct_coarse: 'high',
        correct_fine_slider_val: 1, // Slider all the way to the left
        instructions: {
          coarse: { en: "For this attention check, please select the <b>'High'</b> button.", es: "Para esta prueba de atención, por favor seleccione el botón <b>'Alto'</b>." },
          fineTune: { en: "Now, please move the slider <b>all the way to the left</b> and click 'Confirm'.", es: "Ahora, por favor mueva el deslizador <b>completamente hacia la izquierda</b> y haga clic en 'Confirmar'." }
        }
      }
    ]
  }
};

const IMAGE_DATA = [
  // --- INDOOR IMAGES (6) ---
  {
    id: "image01",
    type: "indoor",
    filename: "image01.jpg",
    prompts: {
      episodic_recall: {
        en: "<b>RECALL a time you were relaxing with friends or family in a living room</b>. <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>REMEMORA una vez que te estabas relajando con amigos o familiares en un salón</b>. <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
      scene_imagination: {
        en: "<b>IMAGINE a decorated living room with people sitting on a sofa</b>. <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>IMAGINA el salón de una casa, decorado, con gente sentada en un sofá</b>. <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
    },
  },
  {
    id: "image03",
    type: "indoor",
    filename: "image03.jpg",
    prompts: {
      episodic_recall: {
        en: "<b>RECALL an empty classroom from a school you attended.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>REMEMORA un aula vacía de un colegio al que fuiste.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
      scene_imagination: {
        en: "<b>IMAGINE an empty classroom, with chairs, desks, and a blackboard.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>IMAGINA un aula vacía, con sillas, pupitres y una pizarra.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
    },
  },
  {
    id: "image04",
    type: "indoor",
    filename: "image04.jpg",
    prompts: {
      episodic_recall: {
        en: "<b>RECALL a time you were shopping for groceries in a busy supermarket you know well.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>REMEMORA una vez que estabas haciendo la compra en un supermercado concurrido que conoces bien.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
      scene_imagination: {
        en: "<b>IMAGINE a busy supermarket with people shopping for groceries.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>IMAGINA un supermercado concurrido con gente haciendo la compra.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
    },
  },
  {
    id: "image08",
    type: "indoor",
    filename: "image08.jpg",
    prompts: {
      episodic_recall: {
        en: "<b>RECALL looking for something in a specific aisle of a supermarket you know well.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>REMEMORA buscar algo en un pasillo específico de un supermercado que conoces bien.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
      scene_imagination: {
        en: "<b>IMAGINE a supermarket aisle with shelves full of products.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>IMAGINA un pasillo de supermercado con estanterías llenas de productos.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
    },
  },
  {
    id: "image09",
    type: "indoor",
    filename: "image09.jpg",
    prompts: {
      episodic_recall: {
        en: "<b>RECALL the living room of a place where you have lived.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>REMEMORA el salón de un lugar en el que has vivido.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
      scene_imagination: {
        en: "<b>IMAGINE a cozy living room with a sofa and a table.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>IMAGINA un salón acogedor con un sofá y una mesa.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
    },
  },
  {
    id: "image12",
    type: "indoor",
    filename: "image12.jpg",
    prompts: {
      episodic_recall: {
        en: "<b>RECALL being in a full classroom during a lesson at a school you attended.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>REMEMORA estar en un aula llena durante una clase en un colegio al que fuiste.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
      scene_imagination: {
        en: "<b>IMAGINE a classroom full of students listening to their teacher.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>IMAGINA un aula llena de estudiantes escuchando a su profesor/a.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los los ojos y presione Continuar.",
      },
    },
  },
  // --- OUTDOOR IMAGES (6) ---
  {
    id: "image02",
    type: "outdoor",
    filename: "image02.jpg",
    prompts: {
      episodic_recall: {
        en: "<b>RECALL walking down an empty street early in the morning in a city you know well.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>REMEMORA caminar temprano por la mañana por una calle vacía de una ciudad que conoces bien.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
      scene_imagination: {
        en: "<b>IMAGINE an empty street in a historic European city, early in the morning.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>IMAGINA una calle vacía en una ciudad histórica europea, temprano por la mañana.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
    },
  },
  {
    id: "image05",
    type: "outdoor",
    filename: "image05.jpg",
    prompts: {
      episodic_recall: {
        en: "<b>RECALL being on a quiet beach that you have visited before.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>REMEMORA estar en una playa tranquila que hayas visitado antes.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
      scene_imagination: {
        en: "<b>IMAGINE a remote, scenic beach with a cliff or waterfall.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>IMAGINA estar en una playa remota y pintoresca con un acantilado o una cascada.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
    },
  },
  {
    id: "image06",
    type: "outdoor",
    filename: "image06.jpg",
    prompts: {
      episodic_recall: {
        en: "<b>RECALL a time you visited a botanical garden or a park with many different types of plants.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>REMEMORA una vez que visitaste un jardín botánico o un parque con muchos tipos de plantas diferentes.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
      scene_imagination: {
        en: "<b>IMAGINE a lush, green botanical garden with a variety of trees and plants.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>IMAGINA un jardín botánico frondoso y verde con una variedad de árboles y plantas.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
    },
  },
  {
    id: "image07",
    type: "outdoor",
    filename: "image07.jpg",
    prompts: {
      episodic_recall: {
        en: "<b>RECALL a time you saw someone walking in a park you know well.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>REMEMORA una vez que viste a alguien paseando por un parque que conoces bien.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
      scene_imagination: {
        en: "<b>IMAGINE a person walking through a park during autumn.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>IMAGINA una persona caminando por un parque en otoño.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
    },
  },
  {
    id: "image10",
    type: "outdoor",
    filename: "image10.jpg",
    prompts: {
      episodic_recall: {
        en: "<b>RECALL a time you were waiting to cross a busy street in a city you know well.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>REMEMORA una vez que estabas esperando para cruzar una calle concurrida en una ciudad que conoces bien.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
      scene_imagination: {
        en: "<b>IMAGINE a crowd of people crossing a busy street in a large city.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>IMAGINA una multitud de gente cruzando una calle concurrida en una gran ciudad.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
    },
  },
  {
    id: "image11",
    type: "outdoor",
    filename: "image11.jpg",
    prompts: {
      episodic_recall: {
        en: "<b>RECALL a child you know playing on a beach.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>REMEMORA un niño/a que conoces jugando en la playa.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
      scene_imagination: {
        en: "<b>IMAGINE a young child playing on a sandy beach.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>IMAGINA un niño/a pequeño/a jugando en una playa de arena.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
    },
  },
];

const ICONS = {
  perceptual_recall: "images/instructions/icon_perceptual.png",
  episodic_recall: "images/instructions/icon_memory.png",
  scene_imagination: "images/instructions/icon_imagination.png",
  brightness: "images/instructions/icon_brightness.png",
  contrast: "images/instructions/icon_contrast.png",
  saturation: "images/instructions/icon_saturation.png",
  clarity: "images/instructions/icon_clarity.png",
  detailedness: "images/instructions/icon_detailedness.png",
  precision: "images/instructions/icon_precision.png",
  //attention_check: 'images/instructions/icon_attention.png' // Assumes you have an icon for this
};

const VVIQ_DATA = {
  instructions: {
    inst_1: {
      en: "Visual imagery refers to the ability to visualize, that is, the ability to form mental pictures, or to 'see in the mind's eye'. Marked individual differences are found in the strength and clarity of reported visual imagery and these differences are of considerable psychological interest.",
      es: 'La imaginación visual se refiere a la capacidad de visualizar, es decir, la habilidad de formar imágenes mentales o de "ver con los ojos de la mente". Existen diferencias individuales marcadas en cuanto a la intensidad y claridad con que las personas experimentan estas imágenes, y dichas diferencias son de gran interés psicológico.',
    },
    inst_2: {
      en: "The aim of this test is to determine the vividness of your visual imagery. The items of the test will possibly bring certain images to your mind. You are asked to rate the vividness of each image by reference to the five-point scale given below. For example, if your image is 'vague and dim', then give it a rating of 2.",
      es: 'El objetivo de este cuestionario es evaluar la viveza de tu imaginación visual. Los ítems del test pueden evocarte ciertas imágenes. Se te pide que califiques la viveza de cada imagen utilizando la escala de cinco puntos que se presenta a continuación. Por ejemplo, si la imagen que formas es "vaga y borrosa", asígnale una puntuación de 2.',
    },
    inst_3: {
      en: "Before you turn to the items, familiarize yourself with the different categories on the rating scale. Throughout the test, refer to the rating scale when judging the vividness of each image. Try to do each item separately, independent of how you may have done other items.",
      es: "Antes de comenzar con los ítems, familiarízate con las categorías de la escala de calificación. A lo largo del cuestionario, consulta esta escala cada vez que evalúes la viveza de una imagen. Intenta responder cada ítem por separado, de forma independiente de cómo hayas respondido los anteriores.",
    },
    inst_4: {
      en: 'This test consists of 32 items to be imaged with your eyes closed. When we say "eyes closed", we mean the question is read, you close your eyes, an image is formed with them closed, and then open them to write the score. Try to score each item separately and independently of how you scored the other items.',
      es: 'Este test consta de 32 ítems, que deberás imaginar con los ojos cerrados. Cuando decimos "los ojos cerrados", significa que debes leer el enunciado, cerrar los ojos, formar la imagen mental con los ojos cerrados, y luego abrirlos para anotar tu puntuación. Intenta calificar cada ítem de forma independiente de los demás.',
    },
  },
  scale: [
    {
      score: 5,
      en: "Perfectly clear and as vivid as real seeing",
      es: "Perfectamente clara y tan viva como si estuvieses viendo el objeto",
    },
    {
      score: 4,
      en: "Clear and reasonably vivid",
      es: "Clara y bastante viva",
    },
    {
      score: 3,
      en: "Moderately clear and vivid",
      es: "Moderadamente clara y viva",
    },
    { score: 2, en: "Vague and dim", es: "Vaga y borrosa" },
    {
      score: 1,
      en: 'No image at all, you only "know" that you are thinking of the object',
      es: 'Ninguna imagen, tú sólo "sabes" lo que estás pensando del objeto',
    },
  ],
  prompts: [
    {
      prompt: {
        en: "Think of some relative or friend whom you frequently see (but who is not with you at present) and consider carefully the picture that comes before your mind's eye.",
        es: "Piensa en algún pariente o amigo al que ves frecuentemente (pero que no está contigo ahora). Considera la imagen que te viene a la cabeza.",
      },
      items: [
        {
          en: "The outline of the face, head, shoulders and body.",
          es: "El contorno de la cara, cabeza, hombros y cuerpo.",
        },
        {
          en: "Characteristic posture, gesture, movement, etc.",
          es: "Las posturas características de la cabeza, ademanes corporales, etc.",
        },
        {
          en: "The precise carriage, length of step, etc., in walking.",
          es: "El modo exacto de andar, la longitud del paso, etc., cuando pasea.",
        },
        {
          en: "The different colours worn in clothes.",
          es: "Los diferentes colores que utiliza en su ropa habitual.",
        },
      ],
    },
    {
      prompt: {
        en: "Visualise a rising sun. Consider the picture that comes before your mind's eye.",
        es: "Piensa en un sol naciente. Considera la imagen que te viene a la cabeza.",
      },
      items: [
        {
          en: "The sun rising above the horizon into a hazy sky.",
          es: "El sol está naciendo sobre el horizonte en el cielo nebuloso.",
        },
        {
          en: "The sky clears and surrounds the sun with blueness.",
          es: "El cielo está claro y rodea al sol con su azul.",
        },
        {
          en: "Clouds. A storm blows up with flashes of lightning.",
          es: "Nubes. Una tormenta hace explosión, con destellos de relámpago.",
        },
        { en: "A rainbow appears.", es: "Aparece un arco iris." },
      ],
    },
    {
      prompt: {
        en: "Think of the front of a shop which you often go to. Consider the picture that comes before your mind's eye.",
        es: "Piensa en la fachada de la tienda a la que tú vas a menudo. Considera la imagen que te viene a la cabeza.",
      },
      items: [
        {
          en: "The overall appearance of the shop from the opposite side of the road.",
          es: "El aspecto total de la tienda desde la acera de enfrente.",
        },
        {
          en: "A window display including colours, shapes, and details of the items for sale.",
          es: "Un escaparate, con los colores, formas y detalles de los productos expuestos.",
        },
        {
          en: "You are near the entrance. The colour, shape, and details of the door.",
          es: "Tú estás cerca de la entrada. El color, forma y detalles de la puerta.",
        },
        {
          en: "You enter the shop and go to the counter. The assistant serves you.",
          es: "Tú entras en la tienda y vas al mostrador. El vendedor te sirve.",
        },
      ],
    },
    {
      prompt: {
        en: "Think of a countryside scene which includes trees, mountains, and a lake. Consider the picture that comes before your mind's eye.",
        es: "Piensa en una escena de campo que tenga árboles, montañas y un lago. Considera la imagen que te viene a la cabeza.",
      },
      items: [
        {
          en: "The contours of the landscape.",
          es: "Los contornos del paisaje.",
        },
        {
          en: "The colour and shape of the trees.",
          es: "El color y forma de los árboles.",
        },
        {
          en: "The colour and shape of the lake.",
          es: "El color y forma del lago.",
        },
        {
          en: "A strong wind blows through the trees and over the lake causing ripples.",
          es: "Un fuerte viento sopla sobre los árboles y el lago, causando ondulaciones.",
        },
      ],
    },
    {
      prompt: {
        en: "Imagine that a friend or relative is driving you at great speed on a motorway. Consider the picture that comes before your mind's eye.",
        es: "Piensa que un familiar o amigo te está llevando en coche a gran velocidad por una autopista. Considera la imagen que te viene a la cabeza.",
      },
      items: [
        {
          en: "The overall appearance of fast-moving traffic around your car.",
          es: "Observa el denso tráfico que circula a gran velocidad alrededor de vuestro coche.",
        },
        {
          en: "Your car overtakes and you see worried expressions on other drivers' faces.",
          es: "Vuestro coche adelanta. Ves preocupación en la cara del conductor y de la gente de otros vehículos.",
        },
        {
          en: "A large truck flashes headlights and your car pulls aside.",
          es: "Un gran camión te da las luces largas. Tu coche se echa a un lado.",
        },
        {
          en: "A broken-down car with flashing lights and a woman on the phone.",
          es: "Un vehículo averiado fuera de la carretera. Conductora preocupada llama por teléfono.",
        },
      ],
    },
    {
      prompt: {
        en: "Visualise a beach on a hot summer day. Consider the picture that comes before your mind's eye.",
        es: "Piensa en una playa en un caluroso día de verano. Considera la imagen que te viene a la cabeza.",
      },
      items: [
        {
          en: "The appearance and colour of the sea, waves, and sky.",
          es: "La apariencia global y el color del agua, el reventar de las olas y el cielo.",
        },
        {
          en: "Swimmers playing with a brightly coloured beach ball.",
          es: "Los bañistas nadan y chapotean. Algunos juegan con una pelota de playa de colores brillantes.",
        },
        {
          en: "An ocean liner on the horizon trailing smoke.",
          es: "Un transatlántico cruza el horizonte dejando una estela de humo.",
        },
        {
          en: "A colourful hot-air balloon floats overhead and passengers wave.",
          es: "Un bonito globo hinchable pasa por encima. Los pasajeros saludan.",
        },
      ],
    },
    {
      prompt: {
        en: "Visualise a railway station. Consider the picture that comes before your mind's eye.",
        es: "Piensa en una estación de tren. Considera la imagen que te viene a la cabeza.",
      },
      items: [
        {
          en: "The overall appearance of the station from the front entrance.",
          es: "La apariencia general de la estación mirando frente a la entrada principal.",
        },
        {
          en: "Walking through the hall: its colour, shape, and details.",
          es: "Caminas por la estación. Color, forma y detalles del hall de entrada.",
        },
        {
          en: "Approaching the ticket counter and buying a ticket.",
          es: "Te acercas a las taquillas, vas a la ventanilla libre y compras tu billete.",
        },
        {
          en: "On the platform: watching passengers and boarding the train.",
          es: "Caminas por el andén. Observas pasajeros y vías. Llega un tren y te subes.",
        },
      ],
    },
    {
      prompt: {
        en: "Visualise a garden with lawns, trees, flowers, and shrubs. Consider the picture that comes before your mind's eye.",
        es: "Finalmente, piensa en un jardín con césped, árboles, flores y arbustos. Considera la imagen que te viene a la cabeza.",
      },
      items: [
        {
          en: "The general layout and appearance of the garden.",
          es: "El aspecto general y la disposición del jardín.",
        },
        {
          en: "The colour and shape of trees and bushes.",
          es: "El color y la forma de los árboles y arbustos.",
        },
        {
          en: "The colour and appearance of the flowers.",
          es: "El color y aspecto de las flores.",
        },
        {
          en: "Birds on the lawn pecking for food.",
          es: "Algunos pájaros se posan en el césped y comienzan a picotear.",
        },
      ],
    },
  ],
};
