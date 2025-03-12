import express from 'express';

const app = express();
const port = Number(process.env.port || 3000);
console.log(process.env.NODE_ENV);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
