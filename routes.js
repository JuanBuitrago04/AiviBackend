// routes.js
const express = require('express');
const multer = require('multer');
const { extractTextFromPDF } = require('./pdfProcessor');
const { askVapiAI } = require('./vapiClient');
const { transcribirDeepgram } = require('./sttDeepgram'); // <-- Función para STT

const router = express.Router();
const upload = multer({ dest: 'backend/uploads/' });

// Ruta para subir PDF
router.post('/upload', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }
    const text = await extractTextFromPDF(req.file.path);
    res.json({ text });
});

// Ruta para hacer preguntas a la IA
router.post('/ask', async (req, res) => {
    const { question, context } = req.body;
    if (!question || !context) {
        return res.status(400).json({ error: 'Falta pregunta o contexto' });
    }
    
    try {
        const answer = await askVapiAI(question, context);
        res.json({ answer });
    } catch (error) {
        console.error('Error al llamar a VapiAI:', error);
        res.status(500).json({ error: 'Error en la API de VapiAI' });
    }
});

// 🚀 Nueva ruta para reconocimiento de voz (STT) con Deepgram (por ejemplo)
router.post('/stt', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo de audio' });
        }
        // `req.file.path` es la ruta temporal del archivo subido
        const text = await transcribirDeepgram(req.file.path);
        res.json({ text });
    } catch (error) {
        console.error('Error al procesar el audio:', error);
        res.status(500).json({ error: 'Error al procesar el audio' });
    }
});

module.exports = router;