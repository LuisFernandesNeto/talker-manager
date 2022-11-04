const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const array = [];
const talkerPath = path.resolve(__dirname, './talker.json');

const readFile = async () => {
  try {
    const data = await fs.readFile(talkerPath);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Arquivo não pôde ser lido: ${error}`);
  }
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const talker = await readFile();
  if (talker === undefined) {
    return array;
  }
    return res.status(200).json(talker);
});

app.get('/talker/:id', async (req, res) => {
  const talker = await readFile();
  const talk = talker.find(({ id }) => id === Number(req.params.id));
  if (talk) return res.status(200).json(talk);
   
    return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
 });