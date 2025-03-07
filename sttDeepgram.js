const { Deepgram } = require('@deepgram/sdk');
const fs = require('fs');
const DG_API_KEY = '10fddb399e5cef757fc3105507eff92e74a1ca4e'; // <-- Reemplaza con tu API Key real

async function transcribirDeepgram(audioPath) {
  const deepgram = new Deepgram(DG_API_KEY);

  // Leemos el archivo de audio
  const audioBuffer = fs.readFileSync(audioPath);

  // Llamamos a la API de Deepgram
  const response = await deepgram.transcription.preRecorded(
    { buffer: audioBuffer, mimetype: 'audio/webm' }, // Ajusta si cambias el formato
    { language: 'es' } // Idioma español
  );

  // La transcripción final
  const transcript = response.results.channels[0].alternatives[0].transcript;
  return transcript;
}

module.exports = { transcribirDeepgram };
