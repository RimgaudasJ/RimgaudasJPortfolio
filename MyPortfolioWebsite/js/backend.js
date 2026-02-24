const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const port = 5500;

app.get('/', (req, res) => {
  res.send('We got a visitor!');
});
app.get('/button', (req, res) => {
  res.send('button pressed!');
});
app.get('/blogs/', (req, res) => {
  res.send('Accessing blogs');
});
app.get('/css/', (req, res) => {
  res.send('Accessing css');
});
app.get('/js/', (req, res) => {
  res.send('Accessing js');
});

app.listen(port, () => {
  console.log('Server running on http://localhost:'+port);
});
