import express from "express";
const app = express();

// Odpověď pro kořenovou cestu
app.get('/', (req, res) => {
  res.send('Toto je root /');
});

// Odpověď pro ostatní cesty
app.get('*', (req, res) => {
  res.send('Toto není root, ale ostatní cesta');
});

// Spuštění serveru
const port = 3000;
app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});