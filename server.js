const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '/client')));

const messages = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.listen(8000, () => {
  console.log('server running on port 8000');
});
