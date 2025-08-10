

// ******************************* Element *********************************
// EN engine.js (o en un archivo de utilidades si tienes uno)

/**
 * Reproduce un archivo de audio y devuelve una promesa que se resuelve cuando termina.
 * @param {string} url - La ruta al archivo de audio (ej. 'audio/notificacion.mp3').
 * @returns {Promise<void>}
 */
function playAudio(url) {
  // Asegurarse de que la URL sea relativa a la raíz del proyecto para la demo estática
  const relativeUrl = url.replace('/static/', ''); 
  return new Promise((resolve, reject) => {
    const audio = new Audio(relativeUrl);

    // Handler para cuando el audio termina correctamente
    audio.onended = () => {
      debugLog(`Audio ${url} finalizado.`);
      resolve();
    };

    // Handler para errores durante la carga o reproducción
    audio.onerror = (e) => {
      // 'e' es un MediaErrorEvent, el error está en e.target.error
      let errorMsg = `Error al reproducir ${url}`;
      if (audio.error) {
          switch (audio.error.code) {
              case MediaError.MEDIA_ERR_ABORTED:
                  errorMsg += ': Reproducción abortada.';
                  break;
              case MediaError.MEDIA_ERR_NETWORK:
                  errorMsg += ': Error de red.';
                  break;
              case MediaError.MEDIA_ERR_DECODE:
                  errorMsg += ': Error de decodificación.';
                  break;
              case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                  errorMsg += ': Fuente no soportada o no encontrada.';
                  break;
              default:
                  errorMsg += ': Error desconocido.';
                  break;
          }
          console.error(errorMsg, audio.error);
          reject(new Error(errorMsg));
      } else {
           console.error(errorMsg, e);
           reject(new Error(`${errorMsg}: Evento de error sin objeto MediaError.`));
      }
    };

    // Intenta reproducir el audio. Puede fallar si el navegador bloquea
    // la reproducción automática sin interacción del usuario.
    audio.play().catch(error => {
        console.error(`Error al iniciar la reproducción de ${url}:`, error);
        reject(error); // Rechaza la promesa si play() falla directamente
    });
  });
}

// ... resto del código de engine.js (Steps, Flows, etc.) ...

// HTML State Templates
const stateTemplates = {
  await_state: () => {
    const container = document.createElement('div');
    container.classList.add('await');

    const circle1 = document.createElement('div');
    circle1.classList.add('await_circle', 'await_circle1');

    const circle2 = document.createElement('div');
    circle2.classList.add('await_circle', 'await_circle2');

    container.appendChild(circle1);
    container.appendChild(circle2);
    return container;
  },

  lessa_state: () => {
    const container = document.createElement('div');
    container.classList.add('animation_container');

    const circle1 = document.createElement('div');
    circle1.classList.add('video_circle_record', 'video_circle_1');

    const circle2 = document.createElement('div');
    circle2.classList.add('video_circle_record', 'video_circle_2');

    const circle3 = document.createElement('div');
    circle3.classList.add('video_circle_record', 'video_circle_3');

    container.appendChild(circle1);
    container.appendChild(circle2);
    container.appendChild(circle3);
    return container;
  },

  loading_state: () => {
    const container = document.createElement('div');
    container.classList.add('loading');

    const circle1 = document.createElement('div');
    circle1.classList.add('circle', 'circle1');

    const circle2 = document.createElement('div');
    circle2.classList.add('circle', 'circle2');

    container.appendChild(circle1);
    container.appendChild(circle2);
    return container;
  },

  tts_state: () => {
    const container = document.createElement('div');
    container.classList.add('animation_container');

    const bar1 = document.createElement('div');
    bar1.classList.add('sound_bar', 'sound_bar1');

    const bar2 = document.createElement('div');
    bar2.classList.add('sound_bar', 'sound_bar2');

    const bar3 = document.createElement('div');
    bar3.classList.add('sound_bar', 'sound_bar3');

    const bar4 = document.createElement('div');
    bar4.classList.add('sound_bar', 'sound_bar4');

    container.appendChild(bar1);
    container.appendChild(bar2);
    container.appendChild(bar3);
    container.appendChild(bar4);
    return container;
  },

  voice_state: () => {
    const container = document.createElement('div');
    container.classList.add('animation_container');

    const circle1 = document.createElement('div');
    circle1.classList.add('voice_circle_record', 'voice_circle_1');

    const circle2 = document.createElement('div');
    circle2.classList.add('voice_circle_record', 'voice_circle_2');

    const circle3 = document.createElement('div');
    circle3.classList.add('voice_circle_record', 'voice_circle_3');

    container.appendChild(circle1);
    container.appendChild(circle2);
    container.appendChild(circle3);
    return container;
  }
};

// ******************************* Chat *********************************

// Clase principal de la aplicación que instancia y conecta los demás componentes
function App() {
  // Sidebar ahora recibe los parámetros de forma individual: sidebarElement, showBtn, hideBtn
  AppManagers.sidebar.init()

  // Popover recibe los parámetros de forma individual: configBtn, popoverMenu
  AppManagers.popover.init()

  // Chat espera un objeto con chatElement y un array de mensajes (se pasa un array vacío por defecto)
  AppManagers.chat.messages = loadMessages();
  AppManagers.chat.init();

  // Gestión de eventos: tecla para alternar la transmisión del video
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 't') {
      e.preventDefault();
      AppManagers.webcam.toggleVideo();
    }
  });
}

function loadMessages(){
  // Se cargan mensajes genéricos.
  const messages = [
    new Message({
      id: 1,
      time: new Date().toLocaleTimeString(),
      simplifiedMode: true,
      leftSide: true,
      content: {
        raw: "Hola, estudio en la Universidad de El Salvador. Estoy en la carrera de Ingeniería Informática y me apasionan las computadoras.",
        structured: "Hola, estudio en la Universidad de El Salvador. Estoy en la carrera de Ingeniería Informática y me apasionan las computadoras.",
        simplified: "Yo estudiar Universidad El Salvador. Estudiar Ingeniería Informática. Yo amor computadora."
      }
    }),
    new Message({
      id: 2,
      time: new Date().toLocaleTimeString(),
      simplifiedMode: true,
      leftSide: false,
      content: {
        raw: "¿Podrías repetir la última parte? No escuché bien lo que dijiste sobre tu carrera.",
        structured: "¿Podrías repetir la última parte? No escuché bien lo que dijiste sobre tu carrera.",
        simplified: "Repetir última parte. No escuchar bien carrera."
      }
    }),
    new Message({
      id: 3,
      time: new Date().toLocaleTimeString(),
      simplifiedMode: true,
      leftSide: true,
      content: {
        raw: "Claro, dije que estudio Ingeniería Informática. Me gusta mucho programar y resolver problemas con computadoras.",
        structured: "Claro, dije que estudio Ingeniería Informática. Me gusta mucho programar y resolver problemas con computadoras.",
        simplified: "Yo estudiar Ingeniería Informática. Gustar programar. Resolver problema computadora."
      }
    }),
    new Message({
      id: 4,
      time: new Date().toLocaleTimeString(),
      simplifiedMode: true,
      leftSide: false,
      content: {
        raw: "¡Eso es genial! ¿Has trabajado en algún proyecto interesante últimamente?",
        structured: "¡Eso es genial! ¿Has trabajado en algún proyecto interesante últimamente?",
        simplified: "Genial. Tú tener proyecto interesante reciente?"
      }
    }),
    new Message({
      id: 5,
      time: new Date().toLocaleTimeString(),
      simplifiedMode: true,
      leftSide: true,
      content: {
        raw: "Sí, actualmente trabajo en una aplicación que traduce lenguaje de señas a texto en tiempo real.",
        structured: "Sí, actualmente trabajo en una aplicación que traduce lenguaje de señas a texto en tiempo real.",
        simplified: "Yo trabajar app traducir señas a texto tiempo real."
      }
    }),
    new Message({
      id: 6,
      time: new Date().toLocaleTimeString(),
      simplifiedMode: true,
      leftSide: false,
      content: {
        raw: "¡Wow! Eso suena muy útil. ¿Cómo logras hacer eso?",
        structured: "¡Wow! Eso suena muy útil. ¿Cómo logras hacer eso?",
        simplified: "Wow. Sonar útil. Cómo hacer eso?"
      }
    }),
    new Message({
      id: 7,
      time: new Date().toLocaleTimeString(),
      simplifiedMode: true,
      leftSide: true,
      content: {
        raw: "Sí, actualmente trabajo en una aplicación que traduce lenguaje de señas a texto en tiempo real.",
        structured: "Sí, actualmente trabajo en una aplicación que traduce lenguaje de señas a texto en tiempo real.",
        simplified: "Yo trabajar app traducir señas a texto tiempo real."
      }
    }),
    new Message({
      id: 8,
      time: new Date().toLocaleTimeString(),
      simplifiedMode: true,
      leftSide: false,
      content: {
        raw: "¡Wow! Eso suena muy útil. ¿Cómo logras hacer eso?",
        structured: "¡Wow! Eso suena muy útil. ¿Cómo logras hacer eso?",
        simplified: "Wow. Sonar útil. Cómo hacer eso?"
      }
    })
  ];
  return messages;
}

// ******************************* Console *********************************  



// ******************************* Sidebar *********************************


// ******************************* Popover *********************************

// ******************************* Console *********************************  


// ******************************* StateUI *********************************


// Creamos un enumerado/diccionario para acceder a los estados
const STATES = {
  INACTIVE: new StateUI("inactive"),
  AWAIT: new StateUI("await"),
  VOICE: new StateUI("voice"),
  LESSA: new StateUI("lessa"),
  LOADING: new StateUI("loading"),
  TTS: new StateUI("tts")
};

// Definimos las transiciones permitidas para cada estado
/* STATES.AWAIT.transitions = [STATES.VOICE, STATES.LESSA, STATES.LOADING, STATES.TTS];
STATES.VOICE.transitions = [STATES.AWAIT, STATES.LOADING];
STATES.LESSA.transitions = [STATES.AWAIT, STATES.LOADING];
STATES.LOADING.transitions = [STATES.AWAIT, STATES.TTS];
STATES.TTS.transitions = [STATES.AWAIT];
STATES.INACTIVE.transitions = [STATES.AWAIT]; */

const fsm = new FSM(STATES.INACTIVE,STATES);

STATES.INACTIVE.onExit = () => {
  // Podría retornar algo si fuera necesario al iniciar
  return null;
};

STATES.AWAIT.onEnter = () => {
AppManagers.console.setConsoleState('Esperando interacción.');
DOMElements.display.state.innerHTML = stateTemplates.await_state().outerHTML;

DOMElements.display.buffer.textContent = ''; // Limpiar el buffer al entrar en AWAIT

// Configurar botones para AWAIT
configureButton(DOMElements.buttons.left, 'Nuevo Mensaje LESSA', 'lessa', true);
configureButton(DOMElements.buttons.right, 'Nuevo Mensaje Voz', 'voice', true);

// Devolver referencias semánticas (ninguno es confirm/cancel aquí)
return {
    confirm: null,
    cancel: null,
    otherLeft: DOMElements.buttons.left, // Se podría mapear a 'startLessa' si se quisiera
    otherRight: DOMElements.buttons.right // Se podría mapear a 'startVoice'
};
};

STATES.LESSA.onEnter = () => {
  AppManagers.console.setConsoleState('Iniciando módulo de video LESSA.');
  // AppManagers.webcam.toggleVideo(); // Asumiendo que quieres activar la cámara aquí
  DOMElements.display.state.innerHTML = stateTemplates.lessa_state().outerHTML; // Usar la animación correcta

  // Configurar botones para LESSA
  configureButton(DOMElements.buttons.left, 'Confirmar', 'lessa', true); // Confirmar es el izquierdo
  configureButton(DOMElements.buttons.right, 'Cancelar', 'cancel', true); // Cancelar es el derecho

  // Devolver referencias semánticas
  return {
      confirm: DOMElements.buttons.left,
      cancel: DOMElements.buttons.right,
      otherLeft: null,
      otherRight: null
  };
};

STATES.LESSA.onExit = () => {
// Asegurarse de apagar la cámara al salir, si se encendió en onEnter
if (AppManagers.webcam.webcamStream) {
    AppManagers.webcam.stopWebcam();
    // Asegurarse que el contenedor del video se oculte si es necesario
     if (DOMElements.video.container.classList.contains('video--active')) {
         DOMElements.video.container.classList.remove('video--active');
     }
}
// Limpiar buffer si es necesario
// DOMElements.display.buffer.textContent = '';
};

STATES.VOICE.onEnter = () => {
AppManagers.tts.stop(); // Detener TTS si estaba hablando
AppManagers.console.setConsoleState('Grabando voz...', true); // Mute = true
DOMElements.display.state.innerHTML = stateTemplates.voice_state().outerHTML;

// Configurar botones para VOICE
configureButton(DOMElements.buttons.left, 'Cancelar', 'cancel', true); // Cancelar es el izquierdo
configureButton(DOMElements.buttons.right, 'Confirmar', 'voice', true); // Confirmar es el derecho

// Devolver referencias semánticas
return {
    confirm: DOMElements.buttons.right,
    cancel: DOMElements.buttons.left,
    otherLeft: null,
    otherRight: null
};
};


STATES.VOICE.onExit = () => {
};

STATES.LOADING.onEnter = async () => {
DOMElements.display.state.innerHTML = stateTemplates.loading_state().outerHTML;
AppManagers.console.setConsoleState("Procesando información...");

// Configurar botones para LOADING (ambos deshabilitados)
configureButton(DOMElements.buttons.left, '', 'unabled', false);
configureButton(DOMElements.buttons.right, '', 'unabled', false);

// Devolver referencias semánticas (ninguno activo)
return {
    confirm: null,
    cancel: null,
    otherLeft: DOMElements.buttons.left, // Aún referencian los elementos, pero están deshabilitados
    otherRight: DOMElements.buttons.right
};
};

STATES.TTS.onEnter = async ({ from, data }) => {
DOMElements.display.state.innerHTML = stateTemplates.tts_state().outerHTML;
// La consola se actualiza en modo mute para evitar duplicidad en la síntesis.
AppManagers.console.setConsoleState("Reproduciendo audio...", true); // Mute = true

// Configurar botones para TTS (ambos deshabilitados)
configureButton(DOMElements.buttons.left, '', 'unabled', false);
configureButton(DOMElements.buttons.right, '', 'unabled', false);

// Devolver referencias semánticas (ninguno activo)
return {
    confirm: null,
    cancel: null,
    otherLeft: DOMElements.buttons.left,
    otherRight: DOMElements.buttons.right
};
};
