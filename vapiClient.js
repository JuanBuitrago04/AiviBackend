const axios = require('axios');
const { VAPI_API_KEY } = require('./config');

async function askVapiAI(question, context) {
    try {
        const response = await axios.post('https://api.vapi.ai/query', {
            assistantId: 'EL_ID_DE_TU_ASISTENTE', // Aquí pones tu assistantId real
            question,
            context
        }, {
            headers: { 'Authorization': `Bearer ${VAPI_API_KEY}` } // Aquí va tu API Key real
        });

        return response.data.answer;
    } catch (error) {
        console.error('Error en la solicitud a Vapi.ai:', error.response?.data || error.message);
        throw new Error('Error al consultar Vapi.ai');
    }
}

module.exports = { askVapiAI };