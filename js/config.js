// --- CONFIGURATION AND CONSTANTS ---

// Debug Flags
const DEBUG_SHOW_RESULTS = false; // Set to true to show results for debugging
const DEBUG_SKIP_BREAK_TIMER = false; // Set to false for real participants

// Keyboard Navigation
const KEYBOARD_INPUTS_ENABLED = true;
const KEYBOARD_FOCUS_CLASS = "keyboard-focus";

// Admin Access
const ADMIN_KEY = "VIVIM2025"; // URL param ?admin=vivim2025 to access main menu

// Task Settings
const BREAK_DURATION_SECONDS = 60; // Standard break duration
const FINE_TUNE_RANGE = 3;
const IMAGE_BASE_FOLDER = "images";
const IMAGE_EXTENSION = ".webp";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwkcpn2kATIjVlfgGAT6um4sN2LOcTU6Qde2vj8mKzd19VtfVxHynh3KR-qMBuNeanSkQ/exec";
const PROLIFIC_COMPLETION_URL = "https://app.prolific.com/submissions/complete?cc=YOUR_CODE_HERE";

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
    resultsTitle: "Task Complete",
    downloadResultsButton: "Download Results",
    confidencePrompt: "How confident are you in your selection?",
    likertLabelLow: "Not at all confident",
    likertLabelHigh: "Completely confident",
    confirmConfidenceButton: "Confirm Confidence",
    // --- Consent Strings ---
    consentTitle: "Participant Information Sheet",
    consentBody: `
<h3>PARTICIPANT INFORMATION SHEET v2</h3>
<h4>Visual Imagery Vividness Assessment</h4>

<p>You are invited to participate in a research study titled “Visual Imagery Vividness Assessment.” In this study, we seek to better understand the qualities that define our internal visual experiences, such as memories or images created with our imagination. The goal is to validate a new scientific tool that allows us to quantitatively and precisely measure characteristics such as brightness, level of detail, or sharpness of these mental images. Your participation will help us understand how the brain constructs these experiences so fundamental to human cognition.</p>

<h4>Procedures</h4>
<p>Recruitment for this study is conducted via Prolific. Before starting, you will be asked for some demographic data. Upon beginning, you will be guided through a detailed instruction phase to familiarize yourself with the task. The main experiment consists of a series of trials where you will first be asked to generate an image in your mind (e.g., remembering a photo you just saw, evoking a personal memory, or imagining a new scene). Then, with that image in mind, you will adjust an image on the screen using buttons and sliders until it matches the qualities of your internal experience (color, lighting, details, etc.) as closely as possible. After each adjustment, you will be asked to rate your confidence level.</p>
<p>Before starting, you will be asked some brief demographic questions. Upon completing the main task, you will answer a standardized questionnaire about your general imagery abilities (VVIQ-2). The study takes approximately 40 minutes in total.</p>

<h4>Risks and Benefits of Participating</h4>
<p>You will be compensated for your participation with €7.80 via Prolific, once the validity of your submission has been verified. This study includes questions to evaluate your attention and response patterns to avoid invalid data. If you do not answer the attention questions correctly, your participation will be returned.</p>
<p>Participation in this study carries no significant risks beyond those associated with normal computer use for a similar period (possible visual fatigue or tiredness). The study includes two mandatory breaks to minimize these discomforts.</p>
<p>If you feel any discomfort, or in any other circumstance, you may stop and/or leave the study at any time, without explanation, questioning, or consequences. Data will only be collected if you complete the study.</p>

<h4>Confidentiality and Data Sharing</h4>
<p>The information collected in this study is anonymous. Your name or any personal or behavioral information that makes your identification possible is not recorded.</p>
<p>Data collected in this project will initially be stored on a local server accessible only to the principal investigator. In the future, this anonymized data will be deposited in online repositories to be shared with other researchers for research purposes.</p>
<p>Please note that your data will be completely anonymous, meaning you cannot request its deletion once you have completed the study, as there will be no way to know which data is yours.</p>

<h4>Voluntary Nature of the Study</h4>
<p>Participation in this study is voluntary. Your decision to participate or not will not affect your current or future relationships with the University of Navarra. If you decide to participate, you are free not to answer any question or to leave the study at any time.</p>

<h4>Contact</h4>
<p>This study is being conducted by Dr. Luis Eudave, researcher and professor in the Department of Psychology at the School of Education and Psychology, University of Navarra. If you wish to receive more information about the project or clarify any doubts, you may write to the email address leudave@unav.es</p>
    `,
    consentCheck1: "I am over 18 years old and have the capacity to give consent.",
    consentCheck2: "I understand that my participation is voluntary and anonymous. No personal data will be collected by the research team.",
    consentCheck3: "I have read the information about the research project and have no doubts about the implications of my participation.",
    consentCheck4: "I agree to participate in this study.",
    consentButton: "Agree and Continue",

    // --- New Onboarding Strings ---
    welcomeTitle: "Welcome",
    welcomeInstructions: `
<p>Thank you for participating in this important study on the nature of mental imagery. Our objective is to better understand the different visual qualities that make up our internal experiences, such as memories and imagination.</p>
<p>In this task, you will be asked to generate various mental images and then use a set of visual tools to match what you experienced. You will also be asked to complete a standardized questionnaire about your imagery abilities.</p>
<p><b>Before we begin, please ensure you are in a quiet and dimly lit environment.</b> Lowering ambient lighting will help you focus on your mental images and reduce glare on your screen, which is essential for accurate ratings.</p>
<p>The entire session takes approximately 40 minutes to complete. It is very important that you complete it in one single session without major interruptions. There will be two short breaks spaced evenly throughout the session.</p>
`,
    calibrationTitle: "Screen Calibration",
    calibrationInstructions: "To ensure the best experience, please set your screen brightness to the maximum level (or near maximum) and <b>reduce ambient lighting</b>. You should increase brightness until you can clearly see the dark grey lines in the box below. Then, select which line appears longer.",
    calibrationPrompt: "Which horizontal line is longer?",
    topLonger: "Top line is longer",
    bottomLonger: "Bottom line is longer",
    bothEqual: "Both are equal",
    retryButton: "Try Again",
    continueButton: "Continue",
    // Failure feedback
    calibrationFailed: "Calibration failed. You have been screened out. Please return your participation on Prolific.",
    calibrationRetry: "Incorrect. Please increase your screen brightness significantly, reduce ambient lighting (glare), and try again. (Attempt 1 of 2)",
    howToTitle: "How the Task Works",
    howToStep1:
      `<p>In each trial, you will follow a simple two-phase process: First, you will be asked to generate an image in your mind based on a prompt. Second, you will adjust an image on the screen to try to match the qualities of your mental image, along with a rating of how confident you were in that match. Here are the details for each phase: </p>
      <b>Generate an Image:</b> Based on the instruction, you will either remember a photo you just saw, recall a personal memory, or imagine a new scene. We encourage you to <b>close your eyes</b> for this step to help you focus. Try to form the image as you naturally would, and once you have a clear impression, <b>hold that image in your mind.</b>`,
    howToStep2:
      "<b>Step 2: Match the Image Quality.</b> You will then adjust an image on the screen to match the visual qualities of your mental image.",
    howToStep3:
      "<b>Step 3: Rate Your Confidence.</b> After each adjustment, you will rate how confident you are in your choice.",
    paramIntroTitle: "How the Task Works",
    paramIntroText:
      `<b>Match the Image:</b> With the mental image in mind, you will open your eyes. Your task will be to adjust an image on the screen, using buttons and a slider, until it best matches the visual qualities (like brightness, clarity, etc.) of the image in your head. The next few screens will provide an explanation of each quality along with an interactive demonstration of each one.`,
    paramDemoTitleTemplate: "Quality {X} of 6: {paramName}",
    paramDemoTextTemplate: "This refers to {paramDescription}",
    practiceIntroTitle: "Putting It All Together: A Practice Round",
    practiceIntroText: `
          <p>
              Now that you are familiar with the different visual qualities, you will complete one full practice rating for <b>Brightness</b>.
          </p>
          <p>
          <p>
              <b>1. Coarse Selection:</b> First, you will choose a general level (Low, Medium, or High). If you have no clear impression of a particular quality, you may indicate so as well.<br><br>
              <b>2. Fine-Tuning:</b> Next, you will use a slider to make a more precise match.<br><br>
              <b>3. Confidence Rating:</b> Finally, you will rate how confident you were in your match.
          </p>
      `,
    tutorialPromptTitle: "Practice Trial: Instructions",
    tutorialPromptText: "For this practice trial, please: <b>IMAGINE a father playing with this infant son at a park.</b><br><br>Please close your eyes to form a clear and stable mental image. When you have it, open your eyes and press Continue.",
    tutorialVimInstruction: "This is a practice round. Please try to match the <b>Brightness</b> of the mental image you are holding in your mind.",
    startPracticeButton: "Continue",
    readyTitle: "Practice Complete",
    readyText:
      "You have completed all instructions and practice. The main experiment will now begin. There will be 12 trials. Some will include a brief attention check at random points throughout the session.",
    startExperimentButton: "Start Experiment",
    pleaseWait: "Please wait...",
    breakTitle: "Take a Short Break",
    breakText:
      "You have completed a block of trials. Please take at least 60 seconds to rest. Use this time to look away from the display, stand and stretch, or relax. Feel free to take longer if you need to. When you are ready, press Continue.",
    noInfoLabel: "I have no clear impression of this quality.",
    blinkNowPrompt: "Blink Now",
    perceptualIntroTitle: "Source 1: Remembering a Photo",
    perceptualIntroText: "In some trials, you will be shown a photograph for a very brief moment. Your task is to hold the <b>very first mental impression</b> of that photo in your mind after it disappears. Try to match your ratings to that initial mental image, even if your memory seems to update or change later on.",
    episodicIntroTitle: "Source 2: Recalling a Personal Memory",
    episodicIntroText: "In other trials, you will be asked to recall a <b>personal memory from your own life</b>. This should be an event you experienced or a place you know well. The goal is to bring a specific, personal past experience to your mind's eye.",
    imaginationIntroTitle: "Source 3: Imagining a New Scene",
    imaginationIntroText: "Finally, in some trials, you will be asked to <b>construct a new scene in your mind</b> that is not from a specific memory. Think of this as creating a generic or prototypical image based on the description provided.<br><br><b>Please note:</b> When asked to <i>recall</i>, retrieve an actual past experience. When asked to <i>imagine</i>, create a new scene — do not rely on a specific memory.",
    flowIntroTitle: "The Rating Process",
    flowIntroText: "For each of the six visual qualities, you will perform a simple three-step rating to best match your mental image:",
    approximationIntroTitle: "An Important Note",
    approximationIntroText: "We understand that the image on the screen may not be a perfect replica of the image in your mind's eye. Your goal is not to find an exact match, but to choose the settings that feel like the <b>best possible approximation</b> of your internal experience.",
    quizTitle: "Knowledge Check",
    quizInstructions: "Please answer the following questions to confirm you have understood the instructions.",
    quizErrorMessage: "One or more answers are incorrect. Please review your selections and the instructions if needed.",
    quizSuccessMessage: "Correct! Please remember: <b>Remembering</b> is retrieving a past experience, while <b>Imagining</b> is creating a new one. Always adjust the image to match your mental impression.",
    quizCheckButton: "Check Answers",
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
    vviqCheckboxLabel: "Include VVIQ-2",
    demographics: {
      title: "Demographic Information",
      ageLabel: "1. What is your age?",
      genderLabel: "2. To which gender identity do you most identify?",
      educationLabel: "3. What is the highest degree or level of school you have completed?",
      occupationLabel: "4. Which category best describes your primary field of occupation or study?",
      genderOptions: ["Female", "Male", "Non-binary", "Prefer not to say", "Other"],
      educationOptions: [
        "Less than high school",
        "High school graduate",
        "Some college or vocational training",
        "Bachelor's degree",
        "Master's degree",
        "Doctorate (PhD, MD, etc.)",
        "Prefer not to say"
      ],
      occupationOptions: [
        "Arts, Design, Entertainment, Sports, & Media",
        "Science, Technology, Engineering, & Mathematics (STEM)",
        "Business, Management, & Finance",
        "Education & Social Services",
        "Healthcare",
        "Legal",
        "Trades & Manual Labor",
        "Student (not yet specialized)",
        "Unemployed or Retired",
        "Other"
      ],
      otherPlaceholder: "Please specify",
      continueButton: "Continue"
    }
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
    resultsTitle: "Tarea completada",
    downloadResultsButton: "Descargar Resultados",
    confidencePrompt: "¿Qué tan seguro/a está de su selección?",
    likertLabelLow: "Nada seguro/a",
    likertLabelHigh: "Completamente seguro/a",
    confirmConfidenceButton: "Confirmar Confianza",
    testParamButton: "Prueba de Parámetro (Debug)",

    // --- Consent Strings (ES) ---
    consentTitle: "Hoja de Información para el Participante",
    consentBody: `
<h3>HOJA DE INFORMACIÓN PARA EL PARTICIPANTE v2</h3>
<h4>Evaluación de la Viveza de las Imágenes Mentales Visuales</h4>

<p>Se le invita a participar en un estudio de investigación denominado “Evaluación de la Viveza de las Imágenes Mentales Visuales”. En este estudio buscamos comprender mejor las cualidades que definen nuestras experiencias visuales internas, como los recuerdos o las imágenes que creamos con nuestra imaginación. El objetivo es validar una nueva herramienta científica que nos permita medir de forma cuantitativa y precisa características como el brillo, el nivel de detalle o la nitidez de estas imágenes mentales. Su participación nos ayudará a entender cómo el cerebro construye estas experiencias tan fundamentales para la cognición humana.</p>

<h4>Procedimientos</h4>
<p>El reclutamiento para este estudio se llevará a cabo a través de Prolific. Antes de iniciar, se le preguntará por algunos datos demográficos. Al comenzar, se le guiará a través de una fase de instrucciones detalladas para familiarizarse con la tarea. El experimento principal consiste en una serie de pruebas en los que primero se le pedirá que genere una imagen en su mente (por ejemplo, recordar una foto que acaba de ver, evocar una memoria personal o imaginar una escena nueva). A continuación, con esa imagen en mente, ajustará una imagen en la pantalla utilizando unos botones y deslizadores hasta que coincida lo mejor posible con las cualidades de su experiencia interna (color, iluminación, detalles, etc.). Tras cada ajuste, se le pedirá que valore su nivel de confianza.</p>
<p>Antes de comenzar, se le harán unas breves preguntas demográficas. Al finalizar la tarea principal, deberá responder a un cuestionario estandarizado sobre sus habilidades generales de imaginación (VVIQ-2). En total, el estudio tiene una duración aproximada de 40 minutos.</p>

<h4>Riesgos y beneficios de participar en el estudio</h4>
<p>Usted será compensado por su participación con €7.80 a través de Prolific, una vez que se haya corroborado la validez del envío. Este estudio cuenta con preguntas que evaluarán su atención y su forma de contestar con el objetivo de evitar datos inválidos. En caso de no responder correctamente a las preguntas atencionales, su participación será devuelta.</p>
<p>La participación en este estudio no conlleva riesgos significativos más allá de los asociados al uso normal de un ordenador durante un periodo de tiempo similar (posible fatiga visual o cansancio). El estudio incluye dos descansos obligatorios para minimizar estas molestias.</p>
<p>En caso de sentir cualquier tipo de incomodidad, y en cualquier otra circunstancia, usted podrá detener y/o abandonar el estudio en cualquier momento, sin necesidad de dar explicaciones, sin cuestionamientos ni consecuencias por ello. Los datos serán recolectados únicamente si usted completa el estudio.</p>

<h4>Confidencialidad e intercambio de datos</h4>
<p>La información recolectada en este estudio es anónima. No se registra su nombre ni ninguna información personal o conductual que haga posible su identificación.</p>
<p>Los datos recogidos en este proyecto serán almacenados en un primer momento en un servidor local al que sólo tendrá acceso el investigador principal de este estudio. En un futuro, estos datos anonimizados serán depositados en repositorios online, con la finalidad de ser compartidos con otros investigadores con fines de investigación.</p>
<p>Tenga en cuenta que sus datos serán completamente anónimos, lo que significa que no puede solicitar que se eliminen una vez que haya completado el estudio, porque no habrá forma de saber cuáles son sus datos.</p>

<h4>Naturaleza voluntaria del estudio</h4>
<p>La participación en este estudio es voluntaria. Su decisión de participar o no participar no afectará sus relaciones actuales o futuras con la Universidad de Navarra. Si decide participar, es libre de no responder a ninguna pregunta o abandonar el estudio en cualquier momento.</p>

<h4>Contacto</h4>
<p>Este estudio está siendo realizado por el Dr. Luis Eudave, investigador y profesor del Departamento de Psicología de la Facultad de Educación y Psicología en la Universidad de Navarra. Si desea recibir más información sobre el proyecto o aclarar cualquier duda, puede escribir al correo electrónico leudave@unav.es</p>
    `,
    consentCheck1: "Soy mayor de 18 años y tengo la capacidad de dar consentimiento.",
    consentCheck2: "Entiendo que mi participación es voluntaria y anónima. Ningún dato personal será recogido por el equipo de investigación.",
    consentCheck3: "He leído la información sobre el proyecto de investigación y no tengo dudas sobre la implicación de mi participación.",
    consentCheck4: "Acepto participar en este estudio.",
    consentButton: "Acepto y Continúo",

    welcomeTitle: "Bienvenido/a",
    welcomeInstructions: `
<p>Gracias por participar en este importante estudio sobre la naturaleza de la imaginación mental. Nuestro objetivo es comprender mejor las diferentes cualidades visuales que componen nuestras experiencias internas, como los recuerdos y la imaginación.</p>
<p>En esta tarea, se le pedirá que genere varias imágenes mentales y que luego utilice una serie de herramientas visuales para igualar lo que ha experimentado. También se le pedirá que complete un cuestionario estandarizado sobre sus habilidades de imaginación.</p>
<p><b>Antes de comenzar, por favor asegúrese de estar en un entorno tranquilo y con luz tenue.</b> Reducir la iluminación ambiental le ayudará a concentrarse en sus imágenes mentales y a reducir los reflejos en la pantalla, lo cual es esencial para obtener valoraciones precisas.</p>
<p>La sesión completa dura aproximadamente 40 minutes. Es muy importante que la complete en una única sesión sin interrupciones importantes. Habrá dos breves descansos distribuidos de manera uniforme a lo largo de la sesión.</p>
`,
    calibrationTitle: "Calibración de Pantalla",
    calibrationInstructions: "Para asegurar la mejor experiencia, por favor ajuste el brillo de su pantalla al máximo (o cerca del máximo) y <b>reduzca la iluminación ambiental</b>. Debe aumentar el brillo hasta que pueda ver claramente las líneas gris oscuro en el recuadro de abajo. Después, seleccione qué línea parece más larga.",
    calibrationPrompt: "¿Qué línea horizontal es más larga?",
    topLonger: "La línea de arriba es más larga",
    bottomLonger: "La línea de abajo es más larga",
    bothEqual: "Ambas son iguales",
    retryButton: "Intentar de Nuevo",
    continueButton: "Continuar",
    // Failure feedback
    calibrationFailed: "Calibración fallida. Ha sido descartado del estudio. Por favor devuelva su participación en Prolific.",
    calibrationRetry: "Incorrecto. Por favor aumenta significativamente el brillo de tu pantalla, reduce la iluminación ambiental (reflejos) e intenta de nuevo. (Intento 1 de 2)",
    howToTitle: "Cómo Funciona la Tarea",
    howToStep1:
      `<p>En cada ensayo, seguirá un sencillo proceso de dos fases: Primero, se le pedirá que genere una imagen en su mente basándose en una instrucción. Segundo, ajustará una imagen en la pantalla para intentar que coincida con las cualidades de su imagen mental, incluyendo una valoración sobre qué tan seguro/a está de su decisión. Aquí están los detalles de cada paso: </p>
      <b>Generar una Imagen:</b> Basándose en la instrucción, deberá recordar una foto que acaba de ver, evocar un recuerdo personal o imaginar una escena nueva. Le animamos a <b>cerrar los ojos</b> en este paso para ayudarle a concentrarse. Intente formar la imagen de la manera más natural para usted y, una vez que tenga una impresión clara, <b>mantenga esa imagen en su mente.</b>`,
    howToStep2:
      "<b>Paso 2: Igualar la Calidad de la Imagen.</b> Luego, ajustará una imagen en la pantalla para que coincida con las cualidades visuales de su imagen mental.",
    howToStep3:
      "<b>Paso 3: Calificar su Confianza.</b> Después de cada ajuste, calificará qué tan seguro/a está de su elección.",
    paramIntroTitle: "Cómo Funciona la Tarea",
    paramIntroText:
      `<b>Igualar la Imagen:</b> Con la imagen mental en mente, abrirá los ojos. Su tarea será ajustar una imagen en la pantalla, usando botones y un deslizador, hasta que coincida lo mejor posible con las cualidades visuales (como el brillo, el desenfoque, etc.) de la imagen en su cabeza. A continuación se le ofrecerán una explicación y una demostración interactiva de cada una de estas cualidades.`,
    paramDemoTitleTemplate: "Cualidad {X} de 6: {paramName}",
    paramDemoTextTemplate: "Esto se refiere a {paramDescription}",
    practiceIntroTitle: "Poniéndolo Todo Junto: Una Ronda de Práctica",
    practiceIntroText: `
          <p>
              Ahora que se ha familiarizado con las diferentes cualidades visuales, completará una ronda de prueba completa para el parámetro de <b>Brillo</b>.
          </p>
          <p>
              <b>1. Selección General:</b> Primero, elegirá un nivel general (Bajo, Medio o Alto). Si no tiene una impresión clara de una cualidad en particular, también puede indicarlo.<br><br>
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
      "Ha completado las instrucciones y la práctica. El experimento principal comenzará ahora. Habrá 12 ensayos. Algunos incluirán una breve prueba de atención en puntos aleatorios a lo largo de la sesión.",
    startExperimentButton: "Comenzar Experimento",
    pleaseWait: "Por favor, espere...",
    breakTitle: "Tome un Breve Descanso",
    breakText:
      "Ha completado un bloque de ensayos. Por favor, descanse al menos 60 segundos. Utilice este tiempo para apartar la vista de la pantalla, ponerse de pie y estirarse, o relajarse. Si lo necesita, puede tomarse más tiempo. Cuando esté listo/a, pulse «Continuar».",
    noInfoLabel: "No tengo una impresión clara de esta cualidad.",
    blinkNowPrompt: "Parpadee Ahora",
    perceptualIntroTitle: "Fuente 1: Recordar una Foto",
    perceptualIntroText: "En algunos ensayos, se le mostrará una fotografía por un instante muy breve. Su tarea es mantener en su mente la <b>primera impresión mental</b> de esa foto después de que desaparezca. Intente que sus ajustes coincidan con esa imagen mental inicial, incluso si su memoria parece actualizarse o cambiar más tarde.",
    episodicIntroTitle: "Fuente 2: Rememorar un Recuerdo Personal",
    episodicIntroText: "En otros ensayos, se le pedirá que rememore un <b>recuerdo personal de su propia vida</b>. Debe ser un evento que usted experimentó o un lugar que conoce bien. El objetivo es traer a su ojo mental una experiencia pasada, específica y personal.",
    imaginationIntroTitle: "Fuente 3: Imaginar una Escena Nueva",
    imaginationIntroText: "Finalmente, en algunos ensayos, se le pedirá que <b>construya una escena nueva en su mente</b> que no provenga de un recuerdo específico. Piense en esto como crear una imagen genérica o prototípica basada en la descripción proporcionada.<br><br><b>Nota importante:</b> Cuando se le pida <i>recordar</i>, recupere una experiencia pasada real. Cuando se le pida <i>imaginar</i>, cree una escena nueva — no se base en un recuerdo específico.",
    flowIntroTitle: "El Proceso de Calificación",
    flowIntroText: "Para cada una de las seis cualidades visuales, realizará una calificación en tres sencillos pasos para que coincida lo mejor posible con su imagen mental:",
    approximationIntroTitle: "Una Nota Importante",
    approximationIntroText: "Entendemos que la imagen en la pantalla puede no ser una réplica perfecta de la imagen en su mente. Su objetivo no es encontrar una coincidencia exacta, sino elegir los ajustes que sienta que son la <b>mejor aproximación posible</b> a su experiencia interna.",
    quizTitle: "Prueba de Comprensión",
    quizInstructions: "Por favor, responda a las siguientes preguntas para confirmar que ha entendido las instrucciones.",
    quizErrorMessage: "Una o más respuestas son incorrectas. Por favor, revise sus selecciones y las instrucciones si es necesario.",
    quizSuccessMessage: "¡Correcto! Por favor, recuerde: <b>Rememorar</b> es recuperar una experiencia pasada, mientras que <b>Imaginar</b> es crear una nueva. Ajuste siempre la imagen para que coincida con su impresión mental.",
    quizCheckButton: "Comprobar Respuestas",
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
        question: "¿Cuál es el objetivo principal al ajustar la imagen en la pantalla?",
        options: [
          "Crear la imagen más bonita o interesante posible.",
          "Hacer una réplica perfecta, píxel por píxel, de mi imagen mental.",
          "Elegir los ajustes que se sientan como la mejor aproximación posible a mi imagen mental."
        ],
        correctAnswerIndex: 2 // La tercera opción es la correcta
      }
    ],
    vviqCheckboxLabel: "Incluir VVIQ-2",
    demographics: {
      title: "Información Demográfica",
      ageLabel: "1. ¿Cuál es tu edad?",
      genderLabel: "2. ¿Con qué identidad de género te identificas más?",
      educationLabel: "3. ¿Cuál es el nivel de estudios más alto que has completado?",
      occupationLabel: "4. ¿Qué categoría describe mejor su campo de ocupación o estudio principal?",
      genderOptions: ["Mujer", "Hombre", "No binario", "Prefiero no decirlo", "Otro"],
      educationOptions: [
        "Menos de secundaria",
        "Graduado escolar o Bachillerato",
        "Formación profesional o estudios universitarios incompletos",
        "Grado universitario",
        "Máster",
        "Doctorado",
        "Prefiero no decirlo"
      ],
      occupationOptions: [
        "Artes, Diseño, Entretenimiento, Deportes y Medios",
        "Ciencia, Tecnología, Ingeniería y Matemáticas (STEM)",
        "Negocios, Gestión y Finanzas",
        "Educación y Servicios Sociales",
        "Salud",
        "Legal",
        "Oficios y Trabajo Manual",
        "Estudiante (aún sin especializar)",
        "Desempleado o Jubilado",
        "Otro"
      ],
      otherPlaceholder: "Especifique",
      continueButton: "Continuar"
    }
  },
};

const PARAMETERS = {
  brightness: {
    name: { en: "Brightness", es: "Brillo" },
    shortDesc: { en: "How bright or dim the scene appeared", es: "Qué tan brillante u oscura pareció la escena" },
    levels: 21, coarse: { low: 4, mid: 11, high: 18 },
    instructions: {
      demo: {
        en: `How <b>bright or dim</b> the scene appeared in your mind. <p>In the interactive demo, notice how moving the slider changes the image from dark (<b>Low Brightness</b>) to bright (<b>High Brightness</b>).</p><p>Move the slider to see the effect.</p>`,
        es: `Qué tan <b>brillante u oscuro</b> parecía la escena en su mente. <p>En la demostración interactiva, observe cómo al mover el deslizador la imagen cambia de oscura (<b>Bajo Brillo</b>) a brillante (<b>Alto Brillo</b>).</p>`
      },
      tutorial: {
        coarse: { en: "Select the button (Low, Medium, or High) that best represents the overall <b>Brightness</b> of your mental image. <p>Notice that if you have no clear impression of such quality (in this case Brightness), you may choose so.</p>", es: "Seleccione el botón (Bajo, Medio o Alto) que mejor represente el <b>Brillo</b> general de su imagen mental. <p>Si no tuviera una impresión clara de la cualidad en cuestión (en este caso Brillo), puede seleccionar la opción correspondiente.</p>" },
        fineTune: { en: "Now, move the slider to fine-tune the <b>Brightness</b> for a more precise match. <p>You may also go back to Coarse selection by clicking the button.</p>", es: "Ahora, mueva el deslizador para ajustar el <b>Brillo</b> de forma más precisa. <p>También es posible retroceder a la selección anterior haciendo click en el botón.</p>" },
        confidence: {
          en: "Finally, please rate how confident you are that the image you adjusted is a good match for your mental image.",
          es: "Finalmente, por favor califique qué tan seguro/a está de que la imagen que ajustó se corresponde con su imagen mental."
        }
      },
      task: {
        coarse: { en: "Select the overall <b>Brightness</b> of your mental image.", es: "Seleccione el <b>Brillo</b> general de su imagen mental." },
        fineTune: { en: "Fine-tune the <b>Brightness</b>.", es: "Ajuste el <b>Brillo</b>." }
      }
    }
  },
  contrast: {
    name: { en: "Contrast", es: "Contraste" },
    shortDesc: { en: "The difference between light and dark areas", es: "La diferencia entre las áreas claras y oscuras" },
    levels: 21, coarse: { low: 4, mid: 11, high: 18 },
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
        coarse: { en: "Select the overall <b>Contrast</b> of your mental image.", es: "Seleccione el <b>Contraste</b> general de su imagen mental." },
        fineTune: { en: "Fine-tune the <b>Contrast</b>.", es: "Ajuste el <b>Contraste</b>." }
      }
    }
  },
  saturation: {
    name: { en: "Saturation", es: "Saturación" },
    shortDesc: { en: "How colorful or muted the scene appeared", es: "Qué tan colorida o apagada pareció la escena" },
    levels: 21, coarse: { low: 4, mid: 11, high: 18 },
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
        coarse: { en: "Select the overall <b>Saturation</b> of your mental image.", es: "Seleccione la <b>Saturación</b> general de su imagen mental." },
        fineTune: { en: "Fine-tune the <b>Saturation</b>.", es: "Ajuste la <b>Saturación</b>." }
      }
    }
  },
  clarity: {
    name: { en: "Clarity", es: "Nitidez" },
    shortDesc: { en: "How sharp or blurry the scene appeared", es: "Qué tan nítida o borrosa pareció la escena" },
    levels: 21, coarse: { low: 4, mid: 11, high: 18 },
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
        coarse: { en: "Select the overall <b>Clarity</b> of your mental image.", es: "Seleccione la <b>Nitidez</b> general de su imagen mental." },
        fineTune: { en: "Fine-tune the <b>Clarity</b>.", es: "Ajuste la <b>Nitidez</b>." }
      }
    }
  },
  detailedness: {
    name: { en: "Detailedness", es: "Nivel de Detalle" },
    shortDesc: { en: "The amount of fine detail and texture present", es: "La cantidad de detalle fino y textura presente" },
    levels: 21, coarse: { low: 4, mid: 11, high: 18 },
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
        coarse: { en: "Select the overall <b>Detailedness</b> of your mental image.", es: "Seleccione el <b>Nivel de Detalle</b> general de su imagen mental." },
        fineTune: { en: "Fine-tune the <b>Detailedness</b>.", es: "Ajuste el <b>Nivel de Detalle</b>." }
      }
    }
  },
  precision: {
    name: { en: "Color Precision", es: "Precisión de Color" },
    shortDesc: { en: "How specific or ambiguous the colors were", es: "Qué tan específicos o ambiguos fueron los colores" },
    levels: 21, coarse: { low: 4, mid: 11, high: 18 },
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
        coarse: { en: "Select the overall <b>Color Precision</b> of your mental image.", es: "Seleccione la <b>Precisión de Color</b> general de su imagen mental." },
        fineTune: { en: "Fine-tune the <b>Color Precision</b>.", es: "Ajuste la <b>Precisión de Color</b>." }
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
    filename: "image01.webp",
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
    filename: "image03.webp",
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
    filename: "image04.webp",
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
    filename: "image08.webp",
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
    filename: "image09.webp",
    prompts: {
      episodic_recall: {
        en: "<b>RECALL the living room of a place where you have lived.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>REMEMORA el salón de un lugar en el que has vivido.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
      scene_imagination: {
        en: "<b>IMAGINE a cozy living room with an armchair and a small table.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>IMAGINA un salón acogedor con un sillón y una mesa pequeña.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
    },
  },
  {
    id: "image12",
    type: "indoor",
    filename: "image12.webp",
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
    filename: "image02.webp",
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
    filename: "image05.webp",
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
    filename: "image06.webp",
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
    filename: "image07.webp",
    prompts: {
      episodic_recall: {
        en: "<b>RECALL seeing a child walking in a park you know well.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>REMEMORA haber visto a un niño/a caminando por un parque que conoces bien.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
      scene_imagination: {
        en: "<b>IMAGINE a child walking through a park during autumn.</b> <p></p>Close your eyes to form a clear image. When you have it, open your eyes and press Continue.",
        es: "<b>IMAGINA un niño/a caminando por un parque en otoño.</b> <p></p>Cierre los ojos para formar una imagen clara. Cuando la tenga, abra los ojos y presione Continuar.",
      },
    },
  },
  {
    id: "image10",
    type: "outdoor",
    filename: "image10.webp",
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
    filename: "image11.webp",
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
  perceptual_recall: "images/instructions/icon_perceptual.webp",
  episodic_recall: "images/instructions/icon_memory.webp",
  scene_imagination: "images/instructions/icon_imagination.webp",
  brightness: "images/instructions/icon_brightness.webp",
  contrast: "images/instructions/icon_contrast.webp",
  saturation: "images/instructions/icon_saturation.webp",
  clarity: "images/instructions/icon_clarity.webp",
  detailedness: "images/instructions/icon_detailedness.webp",
  precision: "images/instructions/icon_precision.webp",
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
