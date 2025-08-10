// ******************************* LESSA *********************************
// 🌐 Flag global de depuración
const DEBUG_MODE = true;

/**
 * Imprime en consola si está activado el modo depuración.
 * Acepta múltiples argumentos como cxonsole.log.
 * @param  {...any} args 
 */
function debugLog(...args) {
  if (DEBUG_MODE) {
    console.log("[DEBUG]", ...args);
  }
}

// lessa.js
/**
 * Clase LESSA
 * 
 * Función principal:
 *  - Procesar el lenguaje de señas captado por video y convertirlo en texto.
 *
 * Componentes UI:
 *  - Interactúa con un elemento de video (o stream) para mostrar el reconocimiento.
 *  - Actualiza un contenedor de texto (por ejemplo, "text-container") con el resultado.
 */
// ******************************* LESSA *********************************
class LESSA {
  /**
   * @param {Console} console   — instancia de tu consola para mensajes
   * @param {HTMLDivElement} videoElement
   * @param {HTMLDivElement} textContainer
   */
  constructor(console, videoElement, textContainer) {
    this.console = console;
    this.videoElement = videoElement;
    this.textContainer = textContainer;

    this.isActive = false;
    this.fullTranscript = "";
    
    // ** INICIO DE CAMBIOS PARA EL MOCK **
    this.mockInterval = null; // Para guardar la referencia al setInterval
    this.mockSentences = [
      "El lenguaje de señas es una forma hermosa y compleja de comunicación visual.",
      "BridgeLink aspira a ser una herramienta inclusiva que conecte a las personas.",
      "La comunicación efectiva es clave para la comprensión mutua entre todos.",
      "Nuestra tecnología busca romper barreras y facilitar la interacción diaria.",
      "Gracias por probar el módulo LESSA, esperamos que sea de gran utilidad."
    ];
    this.sentenceIndex = 0;
    this.wordIndex = 0;
    // ** FIN DE CAMBIOS PARA EL MOCK **
  }

  initialize() {
    // No se necesita nada aquí para la simulación.
  }

  start() {
    // ** INICIO DE CAMBIOS PARA EL MOCK **
    console.log("[MOCK LESSA] Iniciando simulación de LESSA.");
    this.isActive = true;
    this.fullTranscript = "";
    this.textContainer.textContent = "";

    // Simula la recepción de una nueva palabra cada 800ms
    this.sentenceIndex = Math.floor(Math.random() * this.mockSentences.length);
    const currentSentence = this.mockSentences[this.sentenceIndex].split(" ");

    this.mockInterval = setInterval(() => {
      if (!this.isActive || this.wordIndex >= currentSentence.length) {
        clearInterval(this.mockInterval);
        this.mockInterval = null;
        this.isActive = false;
        console.log(`[MOCK LESSA] Simulación LESSA finalizada. Transcripción: "${this.fullTranscript}"`);
        return;
      }

      const word = currentSentence[this.wordIndex];
      this.fullTranscript = (this.fullTranscript + " " + word).trim();
      
      // Simula la actualización del buffer en la UI
      this.textContainer.textContent = this.fullTranscript;

      console.log(`[MOCK LESSA] Palabra reconocida: ${word}. Transcripción actual: "${this.fullTranscript}"`);
      this.wordIndex++;
    }, 800);
    // ** FIN DE CAMBIOS PARA EL MOCK **
  }

  stop() {
    // ** INICIO DE CAMBIOS PARA EL MOCK **
    console.log("[MOCK LESSA] Deteniendo simulación de LESSA.");
    if (this.mockInterval) {
      clearInterval(this.mockInterval); // Detiene el bucle de simulación
      this.mockInterval = null;
    }
    this.isActive = false;
    console.log(`[MOCK LESSA] Transcripción final devuelta: "${this.fullTranscript}"`);
    return this.fullTranscript; // Devuelve el texto acumulado
    // ** FIN DE CAMBIOS PARA EL MOCK **
  }
}

  

// ******************************* Voice *********************************

// Gestiona todo el proceso de reconocimiento de voz en el navegador, utilizando la API Web Speech 
class Voice {
  /**
   * @param {HTMLElement} bufferElement - Elemento donde se acumulará la transcripción.
   */
  constructor(bufferElement) {
    this.bufferElement = bufferElement;
    this.isActive = false;
    this.fullTranscript = "";
    // ** INICIO DE CAMBIOS PARA EL MOCK **
    this.mockInterval = null;
    this.mockSentences = [
      "Hola, ¿en qué puedo ayudarte hoy?",
      "Estoy listo para escuchar tus mensajes.",
      "Puedes comenzar a hablar cuando quieras.",
      "Procesando tu solicitud, por favor espera.",
      "Entendido. ¿Hay algo más en lo que pueda asistirte?"
    ];
    this.sentenceIndex = 0;
    this.wordIndex = 0;
    // ** FIN DE CAMBIOS PARA EL MOCK **
  }

  initialize() {
    // No se necesita nada aquí para la simulación.
  }

  start() {
    console.log("[MOCK VOICE] Iniciando simulación de reconocimiento de voz.");
    this.isActive = true;
    this.fullTranscript = "";
    this.bufferElement.textContent = "";
    this.sentenceIndex = Math.floor(Math.random() * this.mockSentences.length); // Elige una frase aleatoria
    this.wordIndex = 0;

    const currentSentence = this.mockSentences[this.sentenceIndex].split(" ");

    this.mockInterval = setInterval(() => {
      if (!this.isActive || this.wordIndex >= currentSentence.length) {
        clearInterval(this.mockInterval);
        this.mockInterval = null;
        this.isActive = false;
        console.log(`[MOCK VOICE] Simulación de voz finalizada. Transcripción: "${this.fullTranscript}"`);
        return;
      }

      const word = currentSentence[this.wordIndex];
      this.fullTranscript = (this.fullTranscript + " " + word).trim();
      this.bufferElement.textContent = this.fullTranscript;
      console.log(`[MOCK VOICE] Palabra reconocida: ${word}. Transcripción actual: "${this.fullTranscript}"`);
      this.wordIndex++;
    }, 500); // Simula una palabra cada 500ms
  }

  stop() {
    console.log("[MOCK VOICE] Deteniendo simulación de reconocimiento de voz.");
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
    this.isActive = false;
    return this.fullTranscript;
  }

  getTranscription() {
    return this.fullTranscript;
  }
}


// ******************************* TTS *********************************
/**
 * Clase TTS para manejo de texto a voz (Text To Speech) de manera robusta.
 */
class TTS {
  /**
   * Crea una instancia de TTS.
   * @param {Object} [config={}] - Configuración de la síntesis de voz.
   * @param {string} [config.lang='es-US'] - Código de idioma (e.g. 'es-ES', 'en-US').
   * @param {number} [config.rate=1.2] - Velocidad de la voz. 1 = normal.
   * @param {number} [config.pitch=1] - Tono de la voz. 1 = tono normal.
   * @param {number} [config.volume=1] - Volumen de la voz. Entre 0 y 1.
   * @param {string|null} [config.voiceName=null] - Nombre específico de la voz a utilizar (opcional).
   */
  constructor({ lang = 'es-US', rate = 1.2, pitch = 1, volume = 1, voiceName = null } = {}) {
    this.synth = window.speechSynthesis;
    this.lang = lang;
    this.rate = rate;
    this.pitch = pitch;
    this.volume = volume;
    this.voiceName = voiceName; // Nombre específico de la voz (opcional)
    
    this.voice = null; 
    this.isSpeaking = false; 
    this._currentUtterance = null; 

    // Carga inicial de voces (asincrónica). 
    // Se suscribe a onvoiceschanged para asegurar que, cuando las voces estén disponibles,
    // se seleccione la adecuada.
    this._loadVoices();
  }

  /**
   * Método interno para cargar y asignar la voz según this.lang y this.voiceName.
   * Si no se encuentra la voz con el nombre especificado, se usa una disponible que coincida con this.lang.
   * Maneja el caso en que getVoices() todavía no está disponible.
   */
  _loadVoices() {
    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      if (this.voiceName) {
        // Intentamos encontrar la voz por nombre
        const voiceByName = voices.find(v => v.name === this.voiceName);
        if (voiceByName) {
          this.voice = voiceByName;
        } else {
          console.error(`Voz con el nombre "${this.voiceName}" no encontrada. Se usará voz basada en el idioma "${this.lang}".`);
          this.voice = voices.find(v => v.lang === this.lang) || voices[0];
        }
      } else {
        // Selecciona la voz que coincida con el idioma especificado,
        // o usa la primera disponible si no encuentra coincidencia exacta.
        this.voice = voices.find(v => v.lang === this.lang) || voices[0];
      }
    } else {
      // Si no hay voces cargadas aún, esperamos al evento onvoiceschanged.
      this.synth.onvoiceschanged = () => {
        const updatedVoices = this.synth.getVoices();
        if (this.voiceName) {
          const voiceByName = updatedVoices.find(v => v.name === this.voiceName);
          if (voiceByName) {
            this.voice = voiceByName;
          } else {
            console.error(`Voz con el nombre "${this.voiceName}" no encontrada en voiceschanged. Se usará voz basada en el idioma "${this.lang}".`);
            this.voice = updatedVoices.find(v => v.lang === this.lang) || updatedVoices[0];
          }
        } else {
          this.voice = updatedVoices.find(v => v.lang === this.lang) || updatedVoices[0];
        }
      };
    }
  }

  /**
   * Detiene cualquier reproducción de voz en curso.
   * Llama a speechSynthesis.cancel() y actualiza el estado.
   */
  stop() {
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this._currentUtterance = null;
  }

  /**
   * Reproduce el mensaje de texto usando la síntesis de voz.
   * Cancela cualquier reproducción en curso para evitar superposiciones.
   *
   * @param {string} message - Mensaje a reproducir.
   * @returns {Promise<void>} Promesa que se resuelve al finalizar o cancelarse la reproducción.
   *                          Se rechaza si ocurre un error distinto a 'canceled', 'interrupted' o 'not-allowed'.
   */
  speak(message) {
    // Cancela si hay algo en curso, para evitar conflictos de concurrencia.
    if (this.synth.speaking || this.synth.pending) {
      this.stop();
    }

    return new Promise((resolve, reject) => {
      // Esperamos un pequeño intervalo para asegurar que el cancel() anterior haya tomado efecto.
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(message);

        // Ajustes de voz
        utterance.lang = this.lang;
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;
        utterance.volume = this.volume;
        if (this.voice) {
          utterance.voice = this.voice;
        }

        // Control de estado
        utterance.onstart = () => {
          this.isSpeaking = true;
          this._currentUtterance = utterance;
        };

        utterance.onend = () => {
          this.isSpeaking = false;
          this._currentUtterance = null;
          resolve();
        };

        utterance.onerror = (event) => {
          this.isSpeaking = false;
          this._currentUtterance = null;
          // Algunos errores se manejan como finalización "normal".
          if (['canceled', 'interrupted', 'not-allowed'].includes(event.error)) {
            resolve();
          } else {
            reject(event.error);
          }
        };

        // Llamada a TTS
        this.synth.speak(utterance);
      }, 100);
    });
  }
}


// ******************************* Console *********************************

class Console {
  /**
   * Constructor de la clase Console.
   * @param {HTMLElement} domElement - Elemento del DOM que actúa como consola.
   * @param {TTS|null} [ttsInstance=null] - Instancia de la clase TTS para sintetizar voz. Opcional.
   * @param {boolean} [muted=false] - Indica si la consola debe iniciar en modo silenciado.
   */ 
  constructor(domElement, ttsInstance = null, muted = false) {
    if (!domElement) {
      throw new Error("Debe proporcionar un elemento del DOM para la consola.");
    }
    this.consoleElement = domElement;
    this.tts = ttsInstance;
    this.abortController = null;
    this.muted = muted;

  }

  /**
   * Muestra el mensaje en la consola letra por letra, y reproduce el mensaje por voz
   * si no está silenciado y se asignó una instancia de TTS.
   * Esta versión lanza la animación de texto de forma asíncrona sin bloquear el flujo,
   * PERO devuelve una promesa que se resuelve cuando la reproducción de TTS finaliza (si aplica).
   * @param {string} message - Mensaje a mostrar.
   * @param {boolean} [mute] - Opcional: fuerza el modo silencio. Si no se pasa, se usa la propiedad interna.
   * @returns {Promise<void>} Una promesa que se resuelve cuando el TTS termina, o inmediatamente si no hay TTS/está muteado.
   */
  async setConsoleState(message, mute) {
    // Si no se especifica, se utiliza la propiedad interna.
    mute = (mute === undefined) ? this.muted : mute;

    // Cancelar cualquier ejecución previa.
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    debugLog("Se coloca estado de consola con: " + message);
    // Limpiar contenido anterior ANTES de iniciar animación/TTS.
    this.consoleElement.textContent = "";

    let ttsPromise = Promise.resolve(); // Iniciamos con una promesa resuelta por defecto

    // Reproducir el mensaje usando TTS si no está silenciado y se asignó la instancia.
    if (!mute && this.tts) {
      // Guardamos la promesa retornada por speak
      ttsPromise = this.tts.speak(message).catch(error => {
        console.error("Error en síntesis de voz en Console:", error);
        // Aunque falle el TTS, no queremos bloquear el flujo, así que resolvemos.
        return Promise.resolve();
      });
    } else {
      if (mute) debugLog("Console está silenciado.");
      if (!this.tts) debugLog("No hay instancia de TTS asignada a Console.");
      debugLog("No se reproducirá el mensaje de voz por TTS.");
    }

    // Lanzamos la animación en un proceso separado para que no bloquee el flujo.
    this._startTextAnimation(message, signal); // Esta función es async pero no la esperamos aquí

    // Devolvemos la promesa del TTS para que quien llame pueda esperarla si necesita.
    return ttsPromise;
  }

  /**
   * Inicia la animación del texto de forma asíncrona (no bloqueante).
   * @param {string} message - Mensaje a animar.
   * @param {AbortSignal} signal - Señal para abortar la animación.
   */
  async _startTextAnimation(message, signal) {
    try {
      // Mostrar el mensaje letra por letra.
      for (let i = 0; i <= message.length; i++) {
        if (signal.aborted) return;
        this.consoleElement.textContent = message.slice(0, i);
        await new Promise(resolve => setTimeout(resolve, 20));
      }

      // Bucle para agregar y quitar puntos al final (puedes ajustar o detener este loop según tu lógica)
      let dots = "";
      while (!signal.aborted) {
        this.consoleElement.textContent = message + dots;
        dots = dots.length < 2 ? dots + "." : "";
        await new Promise(resolve => setTimeout(resolve, 350));
      }
    } catch (error) {
      if (error.message === "Ejecución cancelada") {
        debugLog("La animación fue cancelada.");
      } else {
        console.error("Error en la animación de consola:", error);
      }
    }
  }

  /**
   * Limpia el contenido de la consola.
   */
  clear() {
    // Cancelar cualquier ejecución previa al limpiar.
    if (this.abortController) {
        this.abortController.abort();
        this.abortController = null; // Resetearlo
    }
    // Detener TTS si estaba hablando
    if (this.tts && this.tts.isSpeaking) {
        this.tts.stop();
    }
    if (this.consoleElement) {
      this.consoleElement.textContent = "";
    }
  }
}


// ******************************* Chat *********************************

class MessageElement {
  /**
   * @param {Message} message    - Instancia de Message
   */
  constructor(message) {
    this.message = message;
    this.simplifiedMode = message.simplifiedMode;
    this.element = this._createElement();
  }

  /**
   * Crea el nodo HTML que representará el mensaje.
   * @returns {HTMLElement}
   */
  _createElement() {
    const wrapper = document.createElement('div');
    wrapper.className = 'message';
    if (!this.message.leftSide) wrapper.classList.add('message--reverse');

    const content = document.createElement('div');
    content.className = 'message__content';
    wrapper.appendChild(content);

    // Contenido estructurado / simplificado
    if (this.simplifiedMode) {
      const structured = document.createElement('div');
      structured.className = 'message__structured--simplified-mode';
      structured.textContent = this.message.content.structured;
      content.appendChild(structured);

      const simplified = document.createElement('div');
      simplified.className = 'message__simplified';
      simplified.textContent = this.message.content.simplified;
      content.appendChild(simplified);
    } else {
      const structured = document.createElement('div');
      structured.className = 'message__structured';
      structured.textContent = this.message.content.structured;
      content.appendChild(structured);
    }

    // Botón TTS
    const ttsBtn = document.createElement('button');
    ttsBtn.className = 'message__tts';
    ttsBtn.textContent = '🔊';
    ttsBtn.onclick = () => this._onTTSClick();
    wrapper.appendChild(ttsBtn);

    return wrapper;
  }

  /**
   * Manejador del clic en TTS: inicia el flujo TTS para este mensaje.
   */
  _onTTSClick() {
    const ctx = {
      structuredContent: this.message.content.structured || this.message.content.raw
    };
    // Inicia el flujo reutilizando StepTTS
    MessageTTSFlow.start(ctx).catch(err => console.error('Error en MessageTTSFlow:', err));
  }

  /**
   * Alterna entre modo simplificado y completo.
   * @param {boolean} simplified
   */
  toggleMode(simplified) {
    this.simplifiedMode = simplified;
    this.message.simplifiedMode = simplified;
    // Reconstruir contenido
    const content = this.element.querySelector('.message__content');
    content.innerHTML = '';
    if (simplified) {
      const structured = document.createElement('div');
      structured.className = 'message__structured--simplified-mode';
      structured.textContent = this.message.content.structured;
      content.appendChild(structured);

      const simplifiedEl = document.createElement('div');
      simplifiedEl.className = 'message__simplified';
      simplifiedEl.textContent = this.message.content.simplified;
      content.appendChild(simplifiedEl);
    } else {
      const structured = document.createElement('div');
      structured.className = 'message__structured';
      structured.textContent = this.message.content.structured;
      content.appendChild(structured);
    }
  }

  /**
   * Devuelve el nodo DOM generado.
   * @returns {HTMLElement}
   */
  getElement() {
    return this.element;
  }
}

class Message {
  constructor({ id, time, simplifiedMode, leftSide, content }) {
    this.id = id;
    this.time = time;
    this.simplifiedMode = simplifiedMode;
    this.leftSide = leftSide;
    this.content = {
      raw: content.raw,
      structured: content.structured,
      simplified: content.simplified
    };
  }
}


class Chat {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.chatElement - Elemento del chat (contenedor de los mensajes).
   * @param {Message[]} options.messages - Mensajes a mostrar en el chat.
   */
  constructor({ chatElement, messages}) {
    this.chat = chatElement;
    this.messages = messages;
    this.messageElements = []; // <--- AÑADIR: Almacena las instancias de MessageElement
  
    this.wasOverflowing = this.chat.scrollHeight > this.chat.clientHeight;

    // Cargamos los mensajes

  }

  scrollToBottom() {
    this.chat.scrollTop = this.chat.scrollHeight;
  }

  checkScroll() {
    const isOverflowing = this.chat.scrollHeight > this.chat.clientHeight;
    // Si se genera overflow y no estaba previamente, baja al final
    if (isOverflowing && !this.wasOverflowing) {
      this.scrollToBottom();
    }
    this.wasOverflowing = isOverflowing;
  }

  init() {
    // Al cargar la página
    this.loadMessages();
    window.addEventListener('load', () => requestAnimationFrame(() => this.checkScroll()));
    
    // Cada vez que se modifique el DOM dentro del chat
    const observer = new MutationObserver(() => this.checkScroll());
    observer.observe(this.chat, { childList: true, subtree: true });
    // Al redimensionar la ventana
    window.addEventListener('resize', () => this.checkScroll());
  }

  loadMessages(message) {
    // Modificar para usar el método addMessage que ahora guarda los elementos
    this.messages.forEach((msg) => this.addMessage(msg) );
  }

  /**
   * Agrega un mensaje al chat, usando MessageElement para la representación.
   * @param {Message} message
   */
  addMessage(message) {
    const msgElem = new MessageElement(message);
    this.messageElements.push(msgElem); // <--- AÑADIR: Guardar la instancia del elemento
    this.chat.appendChild(msgElem.getElement());
    // Desplazarse al final tras añadir
    requestAnimationFrame(() => this.scrollToBottom());
  }

  /**
   * NUEVO MÉTODO: Alterna el modo simplificado para todos los mensajes.
   * @param {boolean} isSimplified - El nuevo estado del modo simplificado.
   */
  setSimplifiedMode(isSimplified) {
    this.messageElements.forEach(msgElem => {
      msgElem.toggleMode(isSimplified);
    });
  }

  } // Fin de la clase Chat

// ******************************* Sidebar *********************************

// Clase para manejar la visibilidad del aside (barra lateral)
class Sidebar {
  /**
   * Clase para gestionar el aside.
   * @param {HTMLElement} sidebarElement - Elemento aside a mostrar u ocultar.
   * @param {HTMLElement} showBtn - Botón para mostrar el aside.
   * @param {HTMLElement} hideBtn - Botón para ocultar el aside.
   */
  constructor(sidebarElement, showBtn, hideBtn) {
    this.sidebarElement = sidebarElement;
    this.showBtn = showBtn;
    this.hideBtn = hideBtn;
  }

  init() {
    // Define un evento de click para el botón de mostrar el aside
    this.showBtn.addEventListener('click', () => this.toggleSidebar());
    // Define un evento de click para el botón de ocultar el aside
    this.hideBtn.addEventListener('click', () => this.toggleSidebar());
  }

  /**
   * Alterna la visibilidad del sidebar.
   */
  toggleSidebar() {
    if (this.sidebarElement.classList.contains('aside--hidden')) {
      this.showSidebar();
    } else {
      this.hideSidebar();
    }
  }

  /**
   * Muestra el sidebar.
   */
  showSidebar() {
    this.sidebarElement.classList.remove('aside--hidden');
    this.showBtn.style.display = 'none';
  }
  
  /**
   * Oculta el sidebar.
   */
  hideSidebar() {
    this.sidebarElement.classList.add('aside--hidden');
    this.showBtn.style.display = 'inline-flex';
  }
}


// ******************************* Popover *********************************

// Clase para manejar el popover de configuración
class Popover {
  /**
   * @param {HTMLElement} configBtn - Botón que activa el popover.
   * @param {HTMLElement} popoverMenu - Elemento del menú popover.
  */
  constructor(configBtn, popoverMenu) {
      this.configBtn = configBtn;
      this.popoverMenu = popoverMenu;
  }

  init() {
      // Alterna el popover al hacer click en el botón
      this.configBtn.addEventListener('click', () => this.togglePopover());
      // Cierra el popover si se hace click fuera del menú
      window.addEventListener('click', (e) => {
      if (!this.popoverMenu.contains(e.target) && e.target !== this.configBtn) {
          this.popoverMenu.classList.remove('popover-menu--active');
      }
      });
  }

  togglePopover() {
      this.popoverMenu.classList.toggle('popover-menu--active');
    }
}

// ******************************* WEBCAM *********************************

class WebcamManager {
  /**
   * @param {Object} options
   * @param {HTMLVideoElement} options.videoPlayer - Elemento donde se muestra la transmisión.
   * @param {HTMLElement} options.video - Contenedor que activa/desactiva la transmisión.
   */
  constructor({ videoPlayer, video }) {
    this.videoPlayer = videoPlayer;
    this.video = video;
    this.webcamStream = null;
  }

  async startWebcam() {
    const constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        aspectRatio: 16 / 9
      },
      audio: false
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoPlayer.srcObject = stream;
      this.webcamStream = stream;
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
    }
  }

  stopWebcam() {
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach(track => track.stop());
      this.videoPlayer.srcObject = null;
      this.webcamStream = null;
    }
  }

  toggleVideo() {
    this.video.classList.toggle('video--active');
    if (this.video.classList.contains('video--active')) {
      this.startWebcam();
    } else {
      this.stopWebcam();
    }
  }
}

// ******************************* Gestión de Flujo *********************************
/**
 * Clase Step
 * 
 * Representa un paso individual dentro de un flujo.
 * Los pasos se diseñan para ser "cajas negras" reutilizables; es decir, se les pasa un contexto,
 * realizan su tarea y devuelven (o modifican) dicho contexto.
 */
class Step {
  /**
   * Crea una instancia de Step.
   * 
   * @param {Object} param0 - Parámetros de configuración.
   * @param {string} param0.name - Nombre identificador del Step.
   * @param {Function} [param0.onEnter] - Función que se ejecuta al ingresar al paso. Recibe el contexto (ctx).
   * @param {Function} [param0.onExit] - Función que se ejecuta al salir del paso. Recibe el contexto (ctx) y puede retornar información.
   */
  constructor({ name, onEnter, onExit }) {
    this.name = name;
    // Asigna las funciones o usa funciones por defecto si no se proporcionan.
    this.onEnter = onEnter || function (ctx) {};
    this.onExit = onExit || function (ctx) {};
  }

  /**
   * Ejecuta el Step.
   * 
   * El método start recibe un objeto context y:
   *   1. Ejecuta la función onEnter(context) para iniciar la lógica del paso.
   *   2. Una vez completada onEnter, ejecuta onExit(context) para finalizar el paso.
   *   3. Retorna lo que devuelva onExit, de modo que el Flow pueda utilizar el resultado.
   * 
   * @param {Object} context - Objeto con el estado o datos compartidos entre pasos.
   * @returns {Promise<*>} Resultado devuelto por onExit, que puede ser utilizado por el controlador del flujo.
   */
  async start(context) {
    await this.onEnter(context);
    const result = await this.onExit(context);
    return result;
  }
}

/**
 * Excepciones específicas para control de flujo
 */
class FlowCancelException extends Error {
  constructor(message = "Flow cancelled") {
    super(message);
    this.name = "FlowCancelException";
  }
}

class FlowErrorException extends Error {
  constructor(message = "Flow error") {
    super(message);
    this.name = "FlowErrorException";
  }
}

class FlowInterruptionException extends Error {
  constructor(message = "Flow interrupted") {
    super(message);
    this.name = "FlowInterruptionException";
  }
}

class FlowBranchException extends Error {
  /**
   * @param {string} branch - Identificador del branch
   * @param {string} [message]
   */
  constructor(branch, message = "Flow branch") {
    super(message);
    this.name = "FlowBranchException";
    this.branch = branch;
  }
}

/**
 * Clase Flow
 * 
 * Representa el controlador de un flujo de ejecución, que puede estar compuesto de varios Steps
 * y/o de lógica personalizada en forma de callbacks. Su funcionalidad principal es orquestar la secuencia
 * de acciones (por ejemplo, escuchar voz, procesar entrada, reproducir TTS, etc.) en un flujo.
 */
class Flow {
  /** Flow actualmente en ejecución */
  static currentFlow = null;

  /**
   * @param {Object} config
   * @param {string} config.name               - Nombre del flujo
   * @param {StateUI|null} [config.state]     - Estado al que volver
   * @param {Function} config.onEnter          - async (ctx) => void
   * @param {Function} [config.onBranch]       - async (branch, ctx) => void
   * @param {Function} [config.onExit]         - async (ctx) => void
   * @param {Function} [config.onCancel]       - async (ctx) => void
   * @param {Function} [config.onError]        - async (error, ctx) => void
   * @param {Function} [config.onInterruption] - async (ctx) => void
   */
  constructor({
    name,
    state = null,
    onEnter,
    onBranch = async () => {},
    onExit = async () => {},
    onCancel = async () => {},
    onError = async () => {},
    onInterruption = async () => {}
  }) {
    this.name = name;
    this._returnState = state;
    this.onEnter = onEnter;
    this.onBranch = onBranch;
    this.onExit = onExit;
    this.onCancel = onCancel;
    this.onError = onError;
    this.onInterruption = onInterruption;
    this._ctx = {};
  }

  /**
   * Inicia el flujo y maneja interrupciones de flujos previos.
   * @param {Object} [ctx={}] - Contexto inicial
   */
  async start(ctx = {}) {
    // Si hay flujo previo, interrumpirlo (sin retorno al state)

    if (Flow.currentFlow != null) {
      debugLog(`Interrumpiendo flujo previo \"${Flow.currentFlow.name}\".`);
      Flow.currentFlow._finish();
    }
    else {
      Flow.currentFlow = this;
      this._ctx = ctx;

      try {
        await this.onEnter(this._ctx);
        await this._finishWithReturn();
      } catch (error) {
        if (error instanceof FlowBranchException) {
          await this.onBranch(error.branch, this._ctx);
          await this._finishWithReturn();
        } else if (error instanceof FlowCancelException) {
          await this.onCancel(this._ctx);
          await this._finishWithReturn();
        } else if (error instanceof FlowErrorException) {
          await this.onError(error, this._ctx);
          await this._finishWithReturn();
        } else if (error instanceof FlowInterruptionException) {
          await this.onInterruption(this._ctx);
          await this._finish();
        } else {
          await this.onError(error, this._ctx);
          await this._finishWithReturn();
        }
      } finally {
        if (Flow.currentFlow === this) Flow.currentFlow = null;
      }
    }
    
  }

  /**
   * Dispara una rama de flujo.
   * @param {string} branch
   * @param {string} [message]
   */
  branch(branch, message) {
    throw new FlowBranchException(branch, message);
  }

  /**
   * Cancela el flujo.
   * @param {string} [message]
   */
  cancel(message) {
    throw new FlowCancelException(message);
  }

  /**
   * Señala un error en el flujo.
   * @param {string} [message]
   */
  error(message) {
    throw new FlowErrorException(message);
  }

  /**
   * Interno: fuerza interrupción sin retorno (lanza excepción).
   * @param {string} [message]
   * @private
   */
  _throwInterruption(message) {
    throw new FlowInterruptionException(message);
  }

  /**
   * Finaliza con retorno al state configurado.
   * @private
   */
  async _finishWithReturn() {
    if (this._returnState) {
      debugLog(`Flow \"${this.name}\" finished, returning to state \"${this._returnState.name}\".`);
      fsm.transitionTo(this._returnState, this._ctx);
    }
  }

  /**
   * Finaliza sin retorno.
   * @private
   */
  async _finish() {
    debugLog(`Flow \"${this.name}\" finished without return.`);
  }
}


// ******************************* Helper para Botones *************************

/**
 * Configura un botón de acción (izquierdo o derecho).
 * @param {HTMLElement} buttonElement - El elemento del botón (leftBtn o rightBtn).
 * @param {string} textContent - El texto a mostrar en el botón.
 * @param {string} cssClassSuffix - El sufijo de la clase CSS (ej: 'lessa', 'voice', 'cancel', 'unabled').
 * @param {boolean} enabled - True si el botón debe estar habilitado, false si no.
 */
function configureButton(buttonElement, textContent, cssClassSuffix, enabled) {
  if (!buttonElement) return;

  // 1. Limpiar clases anteriores y listeners
  buttonElement.className = 'action'; // Resetea a la clase base
  buttonElement.onclick = null; // ¡Importante! Elimina listeners anteriores

  // 2. Añadir nueva clase específica
  buttonElement.classList.add(`action--${cssClassSuffix}`);

  // 3. Establecer texto
  buttonElement.textContent = textContent;

  // 4. Habilitar/Deshabilitar
  buttonElement.disabled = !enabled;

  // 5. Asegurar cursor correcto (aunque CSS ya lo haga con --unabled)
  buttonElement.style.cursor = enabled ? 'pointer' : 'not-allowed';
}
  // ******************************* FSM *********************************

  class FSM {
    /**
     * @param {StateUI} initialState - Estado inicial (instancia de StateUI).
     * @param {Object} states - Diccionario de estados (enumerado).
     */
    constructor(initialState, states) {
      this.states = states;
      this.state = null;
      // Almacenará las referencias semánticas a los botones del estado actual
      this.currentButtons = {
        confirm: null,
        cancel: null,
        otherLeft: null, // Para botones que no son confirm/cancel
        otherRight: null
      };
      // No llamamos transitionTo aquí, se hará en main.js después de instanciar FSM
      // this.transitionTo(initialState);
    }
  
    /**
     * Transiciona a un nuevo estado.
     * @param {StateUI} newState - La instancia del estado al que transicionar.
     * @param {any} [incomingData=null] - Datos opcionales pasados al onEnter del nuevo estado.
     */
    transitionTo(newState, incomingData = null) {
      // Validación de transición (opcional pero recomendada)
/*       if (this.state && this.state.transitions && !this.state.transitions.includes(newState)) {
        console.warn(`Transición de "${this.state?.name}" a "${newState.name}" no está explícitamente permitida. Procediendo de todas formas.`);
        // O podrías lanzar un error:
        // throw new Error(`Transición de "${this.state?.name}" a "${newState.name}" no permitida.`);
      } */
  
      let outgoingData = null;
      const previousState = this.state;
  
      // Ejecutar onExit del estado anterior
      if (this.state?.onExit) {
        outgoingData = this.state.onExit();
      }
  
      this.state = newState;
      debugLog(`Estado actual: ${this.state.name}`);
  
      // Preparamos el paquete de datos para onEnter
      const transitionPayload = {
        from: previousState, // Puede ser null si es el primer estado
        data: incomingData ?? outgoingData // Prioriza datos entrantes
      };
  
      // Ejecutar onEnter del nuevo estado y almacenar las referencias de botones devueltas
      if (this.state.onEnter) {
        // onEnter ahora DEBE retornar el objeto de referencias de botones
        const buttonRefs = this.state.onEnter(transitionPayload);
        this.currentButtons = buttonRefs || { confirm: null, cancel: null, otherLeft: null, otherRight: null };
      } else {
          // Si un estado no tiene onEnter, reseteamos los botones
          this.currentButtons = { confirm: null, cancel: null, otherLeft: null, otherRight: null };
      }
    }
  
    /**
     * Devuelve las referencias semánticas a los botones configurados para el estado actual.
     * @returns {{confirm: HTMLElement|null, cancel: HTMLElement|null, otherLeft: HTMLElement|null, otherRight: HTMLElement|null}}
     */
    getCurrentButtons() {
      return this.currentButtons;
    }
  
    getCurrentState() {
      return this.state;
    }
  }
  

  class StateUI {
    /**
     * @param {string} name - Nombre del estado.
     * @param {StateUI[]} [transitions=[]] - Array de estados permitidos para transicionar.
     */
    constructor(name, transitions = []) {
      this.name = name;
      this.transitions = transitions; // ¡Importante asignar!
      // Funciones por defecto
      /**
       * @param {object} payload - Objeto con { from: StateUI|null, data: any }
       * @returns {{confirm: HTMLElement|null, cancel: HTMLElement|null, otherLeft: HTMLElement|null, otherRight: HTMLElement|null}} - Referencias semánticas a los botones.
       */
      this.onEnter = (payload) => {
          debugLog(`Entrando al estado: ${this.name}`);
          // Por defecto, un estado sin onEnter personalizado no retorna botones
          return { confirm: null, cancel: null, otherLeft: null, otherRight: null };
      };
      /**
       * @returns {any} - Datos que se pueden pasar al siguiente estado si no hay incomingData.
       */
      this.onExit = () => {
          debugLog(`Saliendo del estado: ${this.name}`);
          return null; // Por defecto no retorna datos
      };
    }
  }

// ******************************* DOMElements *********************************

const DOMElements = {
  config: {
    button: document.getElementById('config-btn'),
    popoverMenu: document.getElementById('popover-menu')
  },
  sidebar: {
    container: document.querySelector('.aside'),
    showBtn: document.getElementById('showAsideBtn'),
    hideBtn: document.getElementById('hideAsideBtn')
  },
  video: {
    container: document.getElementById('video'),
    player: document.getElementById('video-player')
  },
  chat: {
    container: document.querySelector('.chat')
  },
  buttons: {
    left: document.getElementById('leftBtn'),
    right: document.getElementById('rightBtn')
},
  display: {
    console: document.getElementById('console'),
    state: document.getElementById('stateContainer'),
    buffer: document.getElementById('buffer')
  }
};

// ******************************* AppManagers *********************************

// Primero, creamos las instancias de forma independiente.
const sidebarManager = new Sidebar(
  DOMElements.sidebar.container,
  DOMElements.sidebar.showBtn,
  DOMElements.sidebar.hideBtn
);

const webcamManager = new WebcamManager({
  videoPlayer: DOMElements.video.player,
  video: DOMElements.video.container
});

const popoverManager = new Popover(
  DOMElements.config.button,
  DOMElements.config.popoverMenu
);

const chatManager = new Chat({
  chatElement: DOMElements.chat.container,
  messages: []
});

let defaultTTS = new TTS({
  voiceName: 'Microsoft Sabina - Spanish (Mexico)',
  lang: 'es-MX',
  rate: 1.5,
  pitch: 0.2,
  volume: 1
});


// Instancia de Console, que recibe la instancia ttsSystem.
const consoleManager = new Console(DOMElements.display.console, defaultTTS);

// Instancia de Voice.
const voiceManager = new Voice(DOMElements.display.buffer);

const lessaManager = new LESSA(consoleManager, DOMElements.video.container, DOMElements.display.buffer);

// Finalmente, organizamos el objeto AppManagers asignando las variables creadas.
const AppManagers = {
  sidebar: sidebarManager,
  webcam: webcamManager,
  popover: popoverManager,
  chat: chatManager,
  console: consoleManager,
  tts: defaultTTS,
  voice: voiceManager,
  lessa: lessaManager
};


async function testTTS(message) {
  debugLog("Para "+ defaultTTS.lang)
  debugLog("Inicia reproducción ************")
  await defaultTTS.speak(message);
  debugLog("Finaliza reproducción ************")
  debugLog("Comienza reproducción ************")
  await defaultTTS.speak(message);
  debugLog("Finaliza reproducción ************")
}
