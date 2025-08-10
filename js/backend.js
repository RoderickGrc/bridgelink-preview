/**
 * SIMULACIÓN DE SOLICITUD AL BACKEND.
 * En lugar de hacer una llamada fetch, simula una respuesta del servidor.
 * @param {string} view - La "vista" a la que se llama (ej: '/text_cleaning').
 * @param {string} method - Método HTTP (ignorado en el mock, pero se mantiene por compatibilidad).
 * @param {Object|null} params - Datos enviados (ej: { raw_text: "..." }).
 * @returns {Promise<Object>} Una promesa que resuelve con la respuesta JSON simulada.
 */
async function requestToServer(view, method = 'GET', params = null) {
  console.log(`[MOCK BACKEND] Se llamó a requestToServer con:`, { view, method, params });

  // Simula una demora de red de 500ms a 1s.
  const delay = 500 + Math.random() * 500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Lógica de simulación basada en la `view`
  switch (view) {
    case '/text_cleaning':
      if (params && params.raw_text) {
        const rawText = params.raw_text;
        // Simula una limpieza y simplificación básica.
        const structuredMessage = `${rawText.trim()}.`; // Add period for structured message
        let simplifiedMessage = rawText.trim().toLowerCase();

        // Remove common connectors and articles for simplification
        simplifiedMessage = simplifiedMessage.replace(/\b(el|la|los|las|un|una|unos|unas|de|del|a|al|y|o|pero|por|para|con|sin|sobre|en|entre|hacia|hasta|desde|durante|mediante|según|tras)\b/g, '');
        simplifiedMessage = simplifiedMessage.replace(/\s\s+/g, ' ').trim(); // Remove extra spaces

        // Keep it concise, maybe first few words
        simplifiedMessage = simplifiedMessage.split(' ').slice(0, 6).join(' ');
        simplifiedMessage = simplifiedMessage.charAt(0).toUpperCase() + simplifiedMessage.slice(1); // Capitalize first letter
        simplifiedMessage += '.'; // Add period
        
        console.log(`[MOCK BACKEND] Devolviendo datos simulados para /text_cleaning.`);
        return Promise.resolve({
          'structured-message': structuredMessage,
          'simplified-message': simplifiedMessage
        });
      } else {
        console.error("[MOCK BACKEND] /text_cleaning fue llamado sin raw_text.");
        return Promise.reject(new Error("Texto raw no proporcionado en la simulación."));
      }

    // Puedes añadir más casos 'case' aquí si hubiera otras llamadas API.
    
    default:
      console.error(`[MOCK BACKEND] La vista "${view}" no tiene una simulación definida.`);
      return Promise.reject(new Error(`Vista no encontrada en la simulación: ${view}`));
  }
}
