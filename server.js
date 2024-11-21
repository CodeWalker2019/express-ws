const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const app = express();
const PORT = 3000;

app.use(cors());

// WebSocket сервер
const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('Клієнт підключений до WebSocket');

  ws.on('close', () => {
    console.log('Клієнт відключився');
  });
});

app.post('/start-video', (req, res) => {
  console.log('Запит отримано: Відео має запуститися');
  // Повідомляємо всіх підключених клієнтів через WebSocket
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ action: 'startVideo' }));
    }
  });
  res.status(200).send({ message: 'Відео запущено' });
});

app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
