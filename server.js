const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/get-video', (req, res) => {
  const videoPath = path.join(__dirname, 'public', 'video.mp4');
  res.download(videoPath, 'video.mp4', (err) => {
    if (err) {
      console.log(err);
      console.error('Помилка при завантаженні відео:', err);
      res.status(500).send('Помилка при завантаженні відео');
    }
  });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  ws.on('close', () => console.log('WebSocket client disconnected'));
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
