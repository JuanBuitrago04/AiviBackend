require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { updateAssistantSystemPrompt } = require('./services/vapiService');

const app = express();
const port = process.env.PORT || 3000;

// ✅ Habilitar CORS para permitir solicitudes desde el frontend
app.use(cors());

// ✅ Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Configurar Multer para guardar PDFs en 'uploads/'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ✅ Verificar que la clave API de Vapi.ai esté configurada
if (!process.env.VAPI_API_KEY) {
  console.error('❌ ERROR: La clave API de Vapi.ai no está definida en el archivo .env');
  process.exit(1);
}

// ✅ Assistant ID de Vapi.ai
const ASSISTANT_ID = "a2aa525c-68ce-4ba4-ba9f-e55d280eac04";

// ✅ Ruta para subir el PDF
app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ningún archivo PDF.' });
    }

    console.log('📄 Archivo recibido:', req.file);

    // ✅ Leer y extraer texto del PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const pdfText = pdfData.text;

    // ✅ Enviar el texto extraído a Vapi.ai
    await updateAssistantSystemPrompt(ASSISTANT_ID, pdfText);

    // ✅ Responder al frontend
    return res.json({ success: true });

  } catch (error) {
    console.error('❌ Error en /upload-pdf:', error);
    return res.status(500).json({ error: 'Error procesando el PDF o actualizando asistente.' });
  }
});

// ✅ Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${port}`);
});
