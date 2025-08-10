// ******************************* DOM *********************************
// --- AÑADIR VARIABLE DE ESTADO GLOBAL AL INICIO DEL ARCHIVO ---
let isSimplifiedMode = true;
// --- AÑADIR NUEVAS VARIABLES DE ESTADO ---
let shouldAutoplayLessa = true;
let shouldAutoplayVoice = true;

// ******************************* DOM *********************************
document.addEventListener('DOMContentLoaded', () => {
    App(); //APP
    fsm.transitionTo(STATES.AWAIT);
    setupGlobalKeydownListeners();
    AppManagers.voice.initialize();
    AppManagers.chat.loadMessages([
        new Message({
            id: 1,
            time: new Date().toLocaleTimeString(),
            simplifiedMode: isSimplifiedMode,
            leftSide: true,
            content: {
                raw: "¡Hola! Soy BridgeLink, tu asistente de comunicación.",
                structured: "¡Hola! Soy BridgeLink, tu asistente de comunicación.",
                simplified: "Hola. BridgeLink. Asistente."
            }
        }),
        new Message({
            id: 2,
            time: new Date().toLocaleTimeString(),
            simplifiedMode: isSimplifiedMode,
            leftSide: false,
            content: {
                raw: "¿Cómo estás?",
                structured: "¿Cómo estás?",
                simplified: "¿Cómo estás?"
            }
        }),
        new Message({
            id: 3,
            time: new Date().toLocaleTimeString(),
            simplifiedMode: isSimplifiedMode,
            leftSide: true,
            content: {
                raw: "Estoy muy bien, gracias. ¿En qué puedo ayudarte hoy?",
                structured: "Estoy muy bien, gracias. ¿En qué puedo ayudarte hoy?",
                simplified: "Yo. Bien. ¿Ayudar hoy?"
            }
        }),
        new Message({
            id: 4,
            time: new Date().toLocaleTimeString(),
            simplifiedMode: isSimplifiedMode,
            leftSide: false,
            content: {
                raw: "¡Eso es genial! ¿Has trabajado en algún proyecto interesante últimamente?",
                structured: "¡Eso es genial! ¿Has trabajado en algún proyecto interesante últimamente?",
                simplified: "¡Genial! ¿Proyectos interesantes?"
            }
        }),
        new Message({
            id: 5,
            time: new Date().toLocaleTimeString(),
            simplifiedMode: isSimplifiedMode,
            leftSide: true,
            content: {
                raw: "Sí, actualmente trabajo en una aplicación que traduce lenguaje de señas a texto en tiempo real.",
                structured: "Sí, actualmente trabajo en una aplicación que traduce lenguaje de señas a texto en tiempo real.",
                simplified: "Yo. Trabajar app. Traducir señas a texto. Tiempo real."
            }
        }),
        new Message({
            id: 6,
            time: new Date().toLocaleTimeString(),
            simplifiedMode: isSimplifiedMode,
            leftSide: false,
            content: {
                raw: "¡Wow! Eso suena muy útil. ¿Cómo logras hacer eso?",
                structured: "¡Wow! Eso suena muy útil. ¿Cómo logras hacer eso?",
                simplified: "¡Wow! ¿Cómo hacer?"
            }
        }),
        new Message({
            id: 7,
            time: new Date().toLocaleTimeString(),
            simplifiedMode: isSimplifiedMode,
            leftSide: true,
            content: {
                raw: "Sí, actualmente trabajo en una aplicación que traduce lenguaje de señas a texto en tiempo real.",
                structured: "Sí, actualmente trabajo en una aplicación que traduce lenguaje de señas a texto en tiempo real.",
                simplified: "Yo. Trabajar app. Traducir señas a texto. Tiempo real."
            }
        }),
        new Message({
            id: 8,
            time: new Date().toLocaleTimeString(),
            simplifiedMode: isSimplifiedMode,
            leftSide: false,
            content: {
                raw: "¡Wow! Eso suena muy útil. ¿Cómo logras hacer eso?",
                structured: "¡Wow! Eso suena muy útil. ¿Cómo logras hacer eso?",
                simplified: "¡Wow! ¿Cómo hacer?"
            }
        })
    ]);
    
    // --- GESTIÓN DE CHECKBOXES ---
    const simplifiedModeToggle = document.getElementById('simplified-mode-toggle');
    const autoplayLessaToggle = document.getElementById('autoplay-lessa-toggle');
    const autoplayVoiceToggle = document.getElementById('autoplay-voice-toggle');
    const interfaceVoiceToggle = document.getElementById('interface-voice-toggle');

    // Sincronizar estado inicial al cargar la página
    isSimplifiedMode = simplifiedModeToggle.checked;
    shouldAutoplayLessa = autoplayLessaToggle.checked;
    shouldAutoplayVoice = autoplayVoiceToggle.checked;
    AppManagers.console.muted = !interfaceVoiceToggle.checked; // La propiedad es `muted`, por eso se niega
    
    // Listeners para los cambios
    simplifiedModeToggle.addEventListener('change', () => {
        isSimplifiedMode = simplifiedModeToggle.checked;
        AppManagers.chat.setSimplifiedMode(isSimplifiedMode);
    });

    autoplayLessaToggle.addEventListener('change', () => {
        shouldAutoplayLessa = autoplayLessaToggle.checked;
    });

    autoplayVoiceToggle.addEventListener('change', () => {
        shouldAutoplayVoice = autoplayVoiceToggle.checked;
    });

    interfaceVoiceToggle.addEventListener('change', () => {
        // Si el toggle está activo, la consola NO está muteada.
        AppManagers.console.muted = !interfaceVoiceToggle.checked;
        debugLog(`Voz de interfaz Muteada: ${AppManagers.console.muted}`);
    });
    // --- FIN GESTIÓN DE CHECKBOXES ---

    const leftButton = DOMElements.buttons.left;
    const rightButton = DOMElements.buttons.right;

    // Get the modal elements
    const infoModal = document.getElementById('infoModal');
    const previewLink = document.getElementById('preview-link');
    const closeButton = infoModal.querySelector('.close-button');

    // Open the modal when the preview link is clicked
    if (previewLink) {
        previewLink.addEventListener('click', (event) => {
            event.preventDefault();
            infoModal.style.display = 'block';
        });
    }

    // Close the modal when the close button is clicked
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            infoModal.style.display = 'none';
        });
    }

    // Close the modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === infoModal) {
            infoModal.style.display = 'none';
        }
    });
  
    // Voz (botรณn derecho)
    rightButton.addEventListener('click', () => {
      if (fsm.getCurrentState() === STATES.AWAIT) {
        FlowNewVoiceMessage.start().catch(error => {
          console.error("Error en flujo voz:", error);
          if (fsm.getCurrentState() !== STATES.AWAIT) {
            fsm.transitionTo(STATES.AWAIT);
          }
        });
      }
    });
  
    // LESSA (botรณn izquierdo)
    leftButton.addEventListener('click', () => {
      if (fsm.getCurrentState() === STATES.AWAIT) {
        FlowNewLessaMessage.start().catch(error => {
          console.error("Error en flujo LESSA:", error);
          if (fsm.getCurrentState() !== STATES.AWAIT) {
            fsm.transitionTo(STATES.AWAIT);
          }
        });
      }
    });


  });
  


// ******************************* KEYDOWNS *********************************

function setupGlobalKeydownListeners() {
    console.log("[DEBUG_KEYS] setupGlobalKeydownListeners llamada.");
    document.addEventListener('keydown', (event) => {
        const currentState = fsm.getCurrentState();
        // console.log(`[DEBUG_KEYS] Keydown global: ${event.key}, Estado FSM: ${currentState ? currentState.name : 'N/A'}`);

        if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            return;
        }
        
        let commandAction = null;
        let globalActionProcessed = false;

        switch (event.key) {
            case ' ':
                if (currentState === STATES.AWAIT) {
                    console.log("[DEBUG_KEYS] Barra espaciadora en AWAIT.");
                    if (DOMElements.buttons.right) {
                        event.preventDefault();
                        console.log("[DEBUG_KEYS] Simular clic en botรณn DERECHO (Voz).");
                        DOMElements.buttons.right.click();
                    } else {
                        console.error("[DEBUG_KEYS_ERROR] DOMElements.buttons.right no encontrado!");
                    }
                    globalActionProcessed = true;
                }
                break;
            case 'Backspace':
                if (currentState === STATES.AWAIT) {
                    console.log("[DEBUG_KEYS] Tecla Borrar en AWAIT.");
                    if (DOMElements.buttons.left) {
                        event.preventDefault();
                        console.log("[DEBUG_KEYS] Simular clic en botรณn IZQUIERDO (LESSA).");
                        DOMElements.buttons.left.click();
                    } else {
                        console.error("[DEBUG_KEYS_ERROR] DOMElements.buttons.left no encontrado!");
                    }
                    globalActionProcessed = true;
                }
                break;
            case 'Escape':
                console.log("[DEBUG_KEYS] Tecla Escape presionada.");
                const currentButtons = fsm.getCurrentButtons();
                if (currentButtons && currentButtons.cancel) {
                    event.preventDefault();
                    console.log("[DEBUG_KEYS] Botรณn Cancelar (currentButtons.cancel) disponible. Simulando click.");
                    currentButtons.cancel.click();
                } else {
                    console.log("[DEBUG_KEYS_WARN] No hay botรณn Cancelar (currentButtons.cancel) definido o accesible para el estado actual.");
                    if(!currentButtons) console.log("[DEBUG_KEYS_INFO] fsm.getCurrentButtons() retornรณ null o undefined.");
                    else console.log("[DEBUG_KEYS_INFO] currentButtons.cancel es: ", currentButtons.cancel);
                }
                globalActionProcessed = true; // Se considera procesada aunque no haya botรณn
                break;
            case 'Enter': // Nueva condiciรณn para la tecla Enter
                console.log("[DEBUG_KEYS] Tecla Enter presionada.");
                if (currentState === STATES.VOICE || currentState === STATES.LESSA) {
                    const currentButtonsEnter = fsm.getCurrentButtons();
                    if (currentButtonsEnter && currentButtonsEnter.confirm) {
                        event.preventDefault();
                        console.log(`[DEBUG_KEYS] Estado es ${currentState.name}. Botรณn Confirmar (currentButtonsEnter.confirm) disponible. Simulando click.`);
                        currentButtonsEnter.confirm.click();
                    } else {
                        console.log(`[DEBUG_KEYS_WARN] No hay botรณn Confirmar (currentButtonsEnter.confirm) definido o accesible para el estado ${currentState.name}.`);
                        if(!currentButtonsEnter) console.log("[DEBUG_KEYS_INFO] fsm.getCurrentButtons() retornรณ null o undefined.");
                        else console.log("[DEBUG_KEYS_INFO] currentButtonsEnter.confirm es: ", currentButtonsEnter.confirm);
                    }
                    globalActionProcessed = true;
                } else {
                    console.log(`[DEBUG_KEYS] Tecla Enter presionada pero el estado actual (${currentState ? currentState.name : 'N/A'}) no es VOICE ni LESSA.`);
                }
                break;
        }

        if (globalActionProcessed) {
            return; 
        }

        if (websocketManager && websocketManager.socket && websocketManager.socket.readyState === WebSocket.OPEN) {
            const lessaActiveStates = [STATES.LESSA_MESSAGE_STARTED, STATES.LESSA_MESSAGE_RECOGNIZED, STATES.LESSA];
            if (lessaActiveStates.includes(currentState)) {
                switch (event.key.toLowerCase()) {
                    case 'q': commandAction = 'q'; break;
                    case 'm': commandAction = 'm'; break;
                    case 'c': commandAction = 'c'; break;
                }
                if (commandAction) {
                    event.preventDefault();
                    console.log(`[DEBUG_KEYS] Comando LESSA a enviar: ${commandAction}`);
                    const message = { action: "lessa_command", payload: { command: commandAction } };
                    try {
                        websocketManager.socket.send(JSON.stringify(message));
                        console.log("[DEBUG_KEYS] Mensaje de comando LESSA enviado.");
                    } catch (e) {
                        console.error("[DEBUG_KEYS_ERROR] Error al enviar comando LESSA por websocket:", e);
                    }
                }
            }
        }
    });
}
console.log("[DEBUG_KEYS] main.js cargado. Asegรบrate que setupGlobalKeydownListeners() se llama en el momento adecuado.");
// ******************************* Event Management *********************************
