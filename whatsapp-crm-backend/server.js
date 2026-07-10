const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de la base de datos
const db = new Pool({
  host: 'postgres://postgres:amcqvf2yknmih4kgfu70@prk_n8n-db:5432/prk?sslmode=disable',            
  port: 5432,                        
  user: 'postgres',                  
  password: 'amcqvf2yknmih4kgfu70',  
  database: 'chatbot_prk'             
});

// Probar conexión a la BD
db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a la Base de Datos:', err.stack);
  } else {
    console.log('✅ Conexión exitosa a la base de datos PostgreSQL (chatbot_prk)');
  }
});

// ==========================================
// ENDPOINTS PARA EL PANEL CRM
// ==========================================

// 1. Obtener lista de conversaciones (Mapeado exacto para el Frontend)
app.get('/api/conversaciones', async (req, res) => {
  const { filter } = req.query;
  
  // Usamos AS para transformar los nombres de las columnas a lo que espera Next.js
  let query = `
    SELECT 
      c.id,
      c.telefono_cliente AS numero_whatsapp,
      c.nombre_cliente,
      c.mode AS modo,
      c.estado,
      c.timestamp_ultimo_mensaje,
      (SELECT contenido FROM mensajes WHERE id_conversacion = c.id ORDER BY timestamp DESC LIMIT 1) as ultimo_mensaje
    FROM conversaciones c
  `;

  if (filter === 'bot') query += " WHERE c.mode = 'bot'";
  if (filter === 'human') query += " WHERE c.mode = 'human'";
  if (filter === 'escalado') query += " WHERE c.estado = 'escalado'";

  query += " ORDER BY c.timestamp_ultimo_mensaje DESC";

  try {
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error detallado en SQL de conversaciones:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 2. Obtener el historial de mensajes de un chat específico
app.get('/api/conversaciones/:id/mensajes', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT id, id_conversacion, emisor, contenido, timestamp AS created_at FROM mensajes WHERE id_conversacion = $1 ORDER BY timestamp ASC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Cambiar Modo / Interruptor (Tomar Control / Activar Bot)
app.patch('/api/conversaciones/:id/mode', async (req, res) => {
  const { id } = req.params;
  const { mode } = req.body; 

  if (!['bot', 'human'].includes(mode)) {
    return res.status(400).json({ error: "El modo debe ser 'bot' o 'human'" });
  }

  try {
    await db.query(
      `UPDATE conversaciones SET mode = $1, estado = 'activo' WHERE id = $2`,
      [mode, id]
    );
    res.json({ success: true, mode });
  } catch (error) {
    console.error('Error al actualizar el modo:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Enviar respuesta manual como "humano" desde el CRM
app.post('/api/conversaciones/:id/responder', async (req, res) => {
  const { id } = req.params; 
  const { texto } = req.body; 

  try {
    // A. Guardar el mensaje usando la estructura real
    const dbResult = await db.query(
      `INSERT INTO mensajes (id_conversacion, emisor, contenido) 
       VALUES ($1, 'humano', $2) RETURNING id, id_conversacion, emisor, contenido, timestamp AS created_at`,
      [id, texto]
    );

    // B. Actualizar la fecha del último mensaje
    await db.query(
      `UPDATE conversaciones SET timestamp_ultimo_mensaje = NOW() WHERE id = $1`,
      [id]
    );

    // C. Buscar usando la columna corregida: telefono_cliente
    const convResult = await db.query(
      `SELECT telefono_cliente, nombre_cliente FROM conversaciones WHERE id = $1`,
      [id]
    );
    const telefonoRaw = convResult.rows[0]?.telefono_cliente || id;
    const telefono = telefonoRaw.replace("whatsapp:", "").replace("+", "").trim();

    // D. DISPARAR EVENTO MANUAL HACIA N8N
    try {
      console.log(`📤 Enviando petición a n8n para el cliente: ${telefono}...`);
      
      // REEMPLAZA ESTA URL por tu webhook de n8n de PRODUCTION
      await axios.post("https://prk-n8n.7q5nan.easypanel.host/webhook-test/36948c3c-fe9f-4fda-b9ab-e0dad38e619a](https://prk-n8n.7q5nan.easypanel.host/webhook-test/36948c3c-fe9f-4fda-b9ab-e0dad38e619a", {
        chatInput: texto,
        sessionId: `${telefono}@s.whatsapp.net`,
        chat_id: `${telefono}@s.whatsapp.net`,
        name: convResult.rows[0]?.nombre_cliente || "Cliente CRM",
        url_server: "https://prk-n8n.7q5nan.easypanel.host/webhook/36948c3c-fe9f-4fda-b9ab-e0dad38e619a",
        apikey: "F0AA03CCA58E-422C-BF70-23E504A58E84",
        instance_name: "prk_bot"
      });

      console.log("🚀 Notificación enviada con éxito a n8n.");
    } catch (n8nError) {
      console.error("⚠️ El mensaje se guardó en DB, pero n8n no respondió:", n8nError.message);
    }

    res.json({ success: true, mensaje: dbResult.rows[0] });

  } catch (error) {
    console.error('Error al enviar respuesta manual:', error);
    res.status(500).json({ error: error.message });
  }
});

// Enciende el servidor en el puerto 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en el puerto ${PORT}`);
});