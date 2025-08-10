// ********************************** STEPS ************************************

const StepEscucharVoz = new Step({
    name: "EscucharVoz",
    onEnter: async (ctx) => {
        // 1) Transición visual al estado VOICE (la UI se prepara)
        fsm.transitionTo(STATES.VOICE);
        const buttons = fsm.getCurrentButtons();

        // Verificar que los botones esperados existen
        if (!buttons.confirm || !buttons.cancel) {
            console.error("Error: Botones Confirmar/Cancelar no definidos para el estado VOICE.");
            // Limpiar consola por si acaso antes de error
            AppManagers.console.clear();
            throw new FlowErrorException("Configuración de UI inválida para el estado VOICE.");
        }

        // --- INICIO: Secuencia de Audio SIN grabación activa ---
        try {
            // 2) Poner mensaje en consola y REPRODUCIRLO (TTS). Esperar a que TERMINE el TTS.
            //    El micrófono está IMPLÍCITAMENTE MUTEADO porque AppManagers.voice.start() aún no se ha llamado.
            // const consoleMessage = "Escuchando voz."; // Mensaje que quieres reproducir
            // debugLog("Reproduciendo mensaje de consola...");
            // await AppManagers.console.setConsoleState(consoleMessage, false); // false = no muteado, retorna Promise del TTS
            //debugLog("Mensaje de consola reproducido.");

            // 3) Reproducir sonido de notificación. Esperar a que TERMINE.
            debugLog("Reproduciendo sonido de notificación...");
            await playAudio('/static/audio/notificacion.mp3'); // Usa la ruta correcta
            debugLog("Sonido de notificación reproducido.");

            // 4) INICIAR la grabación de voz AHORA, después de todos los sonidos.
            debugLog("Iniciando grabación de voz...");
            AppManagers.voice.start();
            debugLog("Grabación de voz iniciada.");

        } catch (error) {
            console.error("Error durante la secuencia de audio previa a la grabación:", error);
            AppManagers.console.clear(); // Limpiar consola en caso de error
            // Puedes decidir si cancelar el flujo o mostrar un mensaje de error específico
            if (error instanceof FlowErrorException) { // Si el error ya es de flujo
                 throw error;
            } else {
                 throw new FlowErrorException("Error al preparar la grabación: " + (error.message || error));
            }
        }
        // --- FIN: Secuencia de Audio ---

        // 5) AHORA SÍ: Esperar interacción del usuario (Confirmar/Cancelar) mientras graba.
        await new Promise((resolve, reject) => {
            // Limpiar listeners previos por si acaso (aunque configureButton ya lo hace internamente)
            buttons.confirm.onclick = null;
            buttons.cancel.onclick = null;

            // Asignar nuevos listeners
            buttons.confirm.onclick = () => {
                debugLog("Botón Confirmar presionado.");
                ctx.transcript = AppManagers.voice.stop(); // Detener grabación al confirmar
                debugLog("Transcripción obtenida:", ctx.transcript);
                // Limpiar listeners para evitar clics accidentales después
                buttons.confirm.onclick = null;
                buttons.cancel.onclick = null;
                resolve(); // Continuar el flujo
            };

            buttons.cancel.onclick = () => {
                debugLog("Botón Cancelar presionado.");
                AppManagers.voice.stop(); // Detener grabación al cancelar
                // Limpiar listeners
                buttons.confirm.onclick = null;
                buttons.cancel.onclick = null;
                AppManagers.console.clear(); // Limpiar consola al cancelar
                reject(new FlowCancelException()); // Cancelar el flujo
            };
        });
        // La promesa se resolvió (confirmar) o rechazó (cancelar)
    },
    onExit: async (ctx) => {
        // onExit se ejecuta después de que onEnter haya terminado (ya sea por resolve o reject manejado por el Flow).
        // Asegurarse de que la consola esté limpia al salir del paso, independientemente de cómo se salga.
        // Aunque el cancel ya lo hace, ponerlo aquí puede ser una salvaguarda.
         AppManagers.console.clear();
        debugLog("Saliendo de StepEscucharVoz. Contexto final:", ctx);
        return ctx; // Devolver el contexto actualizado (con ctx.transcript si se confirmó)
    }
});

  
const StepProcesarEntrada = new Step({
    name: "ProcesarEntrada",
  
    onEnter: async (ctx) => {
      // 1) Estado visual LOADING
      fsm.transitionTo(STATES.LOADING);
  
      // 2) Llamar al backend para limpiar texto
      try {
        const cleanData = await requestToServer('/text_cleaning', 'GET', {
          raw_text: ctx.transcript
        });

        debugLog(cleanData);

        ctx.structuredContent = cleanData['structured-message'] ?? ctx.transcript;
        ctx.simplifiedContent = cleanData['simplified-message'] ?? ctx.structuredContent; // Si no hay simplificado, usamos el estructurado como fallback
        
        debugLog("Contexto en recien limpiado:", ctx);


      } catch (error) {
        ctx.structuredContent = ctx.transcript;
        ctx.simplifiedContent = ctx.transcript; // O un mensaje de error adecuado
        throw new FlowErrorException(error.message);
      }
    },
  
    onExit: (ctx) => {
      // 3) Agregar mensaje al Chat
      debugLog("Mensaje alineado al lado izquierdo:", ctx.messageLeftSide);
      debugLog("Message", ctx);
      AppManagers.chat.addMessage(new Message({
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        // --- CAMBIO AQUÍ ---
        simplifiedMode: isSimplifiedMode, // Usar la variable global
        leftSide: ctx.messageLeftSide ?? false,
        content: {
          raw: ctx.transcript,
          structured: ctx.structuredContent, // El texto estructurado
          simplified: ctx.simplifiedContent  // El texto simplificado
        }
      }));
  
      // 4) Retornar el contexto actualizado
      return ctx;
    }
  });
  
  // Recibe un ctx que incluye el texto a reproducir y reproduce el contenido.
  const StepTTS = new Step({
    name: "TTS",
    onEnter: async (ctx) => {
      fsm.transitionTo(STATES.TTS);
      const textToSpeak = ctx.structuredContent ?? ctx.transcript;
      try {
        // Se utiliza la instancia TTS robusta para reproducir el mensaje.
        await AppManagers.tts.speak(textToSpeak);
      } catch (error) {
        throw new FlowErrorException(error.message);
      }
    }
  });
  

// Paso para LESSA usando WebSocket
const StepEscucharLessa = new Step({
  name: "EscucharLessa",
  onEnter: async (ctx) => {
    fsm.transitionTo(STATES.LESSA);
    const buttons = fsm.getCurrentButtons();
    if (!buttons.confirm || !buttons.cancel) {
      throw new FlowErrorException("Botones Confirm/Cancel no definidos para LESSA.");
    }

    // iniciar LESSA
    AppManagers.lessa.start();

    // esperar Confirm o Cancel
    await new Promise((resolve, reject) => {
      buttons.confirm.onclick = () => {
        buttons.confirm.onclick = null;
        buttons.cancel.onclick = null;
        ctx.transcript = AppManagers.lessa.stop();
        resolve();
      };
      buttons.cancel.onclick = () => {
        buttons.confirm.onclick = null;
        buttons.cancel.onclick = null;
        AppManagers.lessa.stop();
        reject(new FlowCancelException());
      };
    });
  },
  onExit: async (ctx) => ctx
});


// ********************************** FLOWS ************************************
// ********************************** FLOWS (refactorizadas) ************************************


// Flujo para manejar nuevos mensajes de voz
const FlowNewVoiceMessage = new Flow({
  name: "NewVoiceMessage",
  state: STATES.AWAIT,
  onEnter: async function (ctx) {
    // Inicialización de contexto
    ctx.transcript = null;
    ctx.structuredContent = null;
    ctx.messageLeftSide = false;
    ctx.simplifiedContent = null;

    // Secuencia de pasos
    ctx = await StepEscucharVoz.start(ctx);
    ctx = await StepProcesarEntrada.start(ctx);
    
    // --- CAMBIO AQUÍ: Autoplay condicional ---
    if (shouldAutoplayVoice) {
        await StepTTS.start(ctx);
    }
  },
  onError: async (error, ctx) => {
    console.error("[FlowNewVoiceMessage] Error:", error, ctx);
  }
});

// Flujo para manejar nuevos mensajes de señas (LESSA)
const FlowNewLessaMessage = new Flow({
  name: "NewLessaMessage",
  state: STATES.AWAIT,
  onEnter: async function (ctx) {
    ctx.transcript = null;
    ctx.structuredContent = null;
    ctx.messageLeftSide = true;

    ctx = await StepEscucharLessa.start(ctx);
    ctx = await StepProcesarEntrada.start(ctx);
    
    // --- CAMBIO AQUÍ: Autoplay condicional ---
    if (shouldAutoplayLessa) {
        await StepTTS.start(ctx);
    }
  },
  onError: async (error, ctx) => {
    console.error("[FlowNewLessaMessage] Error:", error, ctx);
  }
});

// Flujo para reproducir TTS de mensajes ya existentes
const MessageTTSFlow = new Flow({
  name: "MessageTTSFlow",
  state: STATES.AWAIT,
  onEnter: async function (ctx) {
    // Asume que ctx.structuredContent ya está poblado
    await StepTTS.start(ctx);
  },
  onError: async (error, ctx) => {
    console.error("[MessageTTSFlow] Error:", error, ctx);
  }
});

// Ejemplo de flujo con branching
const NombreFlujo = new Flow({
  name: "NombreFlujo",
  state: STATES.AWAIT,
  onEnter: async function (ctx) {
    ctx.valor = null;
    ctx = await Step1.start(ctx);
    ctx = await Step2.start(ctx);
    // ... más pasos si es necesario
    // Para branch específico:
    // if (condición) this.branch('miBranch', 'motivo');
  },
  onBranch: async (branch, ctx) => {
    console.log("Branch ejecutado:", branch, ctx);
  },
  onError: async (error, ctx) => {
    console.error("[NombreFlujo] Error:", error, ctx);
  }
});
