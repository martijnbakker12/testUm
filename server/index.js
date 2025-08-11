import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

let logs = [];

app.post('/api/login', (req, res) => {
  const { username } = req.body;
  // accept any username/password
  res.json({ userId: username });
});

app.get('/api/policies', (req, res) => {
  res.json([]);
});

app.post('/api/log', (req, res) => {
  logs.push({ ...req.body, datetime: Date.now() });
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
