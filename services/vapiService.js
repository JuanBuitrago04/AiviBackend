const axios = require('axios');

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_BASE_URL = 'https://api.vapi.ai';

const vapiClient = axios.create({
  baseURL: VAPI_BASE_URL,
  headers: {
    Authorization: `Bearer ${VAPI_API_KEY}`
  }
});

/**
 * ✅ Actualiza el system prompt de un asistente en vapi.ai
 * @param {string} assistantId - El ID del asistente
 * @param {string} text - El texto extraído del PDF
 */
async function updateAssistantSystemPrompt(assistantId, text) {
  try {
    const body = {
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Eres un asistente que responde preguntas sobre este texto:\n\n${text}`
          }
        ]
      },
      firstMessage: "¡Hola! Puedo responderte preguntas sobre el PDF que acabas de subir."
    };

    const response = await vapiClient.patch(`/assistant/${assistantId}`, body);
    return response.data;
  } catch (error) {
    console.error('❌ Error actualizando asistente:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  updateAssistantSystemPrompt
};
