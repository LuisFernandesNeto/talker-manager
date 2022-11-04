const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const generateToken = require('../utils/generateToken');
const validateEmail = require('../middlewares/validateEmail');
const validatePassword = require('../middlewares/validatePassword');
const authorization = require('../middlewares/auth');
const validateName = require('../middlewares/validateName');
const validateAge = require('../middlewares/validateAge');
const validateTalk = require('../middlewares/validateTalk');
const validateWatchedAt = require('../middlewares/validateWatchedAt');
const validateRate = require('../middlewares/validateRate');

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

 app.post('/login', validateEmail, validatePassword, (req, res) => {
  const { email, password } = req.body;

  if ([email, password].includes(undefined)) {
      return res.status(401).json({ message: 'Campos ausentes!' });
  }

  const token = generateToken();

  return res.status(200).json({ token });
});

app.post('/talker',
authorization,
validateName,
validateAge,
validateTalk,
validateWatchedAt,
validateRate,
async (req, res) => {
const talker = await readFile();
const { name, age, talk } = req.body;
  const newTalker = {
    id: talker[talker.length - 1].id + 1,
    name,
    age,
    talk,
  };
  const allTalkers = JSON.stringify([...talker, newTalker]);
    await fs.writeFile(talkerPath, allTalkers);
    res.status(201).json(newTalker);
});

app.put('/talker/:id',
authorization,
validateName,
validateAge,
validateTalk,
validateWatchedAt,
validateRate,
async (req, res) => {
const { id } = req.params;
const { name, age, talk } = req.body;
const talker = await readFile();
const index = talker.findIndex((element) => element.id === Number(id));
talker[index] = { id: Number(id), name, age, talk };
  const allTalkers = JSON.stringify([...talker]);
    await fs.writeFile(talkerPath, allTalkers);
    res.status(200).json(talker[index]);
});
