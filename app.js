const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({ Movie: 'movies' });
});

app.post('/', (req, res) => {
  res.send('you added movie!');
});

const port = 5500;

app.listen(port, () => {
  console.log(`App running on port ${port}..`);
});
