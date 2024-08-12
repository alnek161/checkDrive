const express = require('express');
const { connectToDb, getDb } = require('./db');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

const shortid = require('shortid');
// const createPath = require('./helpers/createPath');
const User = require('./models/user');
const Test = require('./models/test');
const Answer = require('./models/answer');
const path = require('path');

const PORT = 3000

const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));


app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.set('views', path.join(__dirname, 'views'));

const createPath = (page) => path.resolve(__dirname, 'views', page);

app.get('/reg', (req, res) => {
  let role = 'reg';
  console.log(role);
  res.render(createPath('registration.ejs'), { role });
});

app.get('/tests', (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  console.log(role);
  res.render(createPath('tests.ejs'), { role });
});

app.get('/testsMenu', (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  console.log(role);
  res.render(createPath('testsMenu.ejs'), { role });
});

app.get('/topic2', (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  console.log(role);
  res.render(createPath('testsMenu2.ejs'), { role });
});

app.get('/topic3', (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  console.log(role);
  res.render(createPath('testsMenu3.ejs'), { role });
});

app.get('/topic4', (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  console.log(role);
  res.render(createPath('testsMenu4.ejs'), { role });
});

app.get('/topic5', (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  console.log(role);
  res.render(createPath('testsMenu5.ejs'), { role });
});

app.get('/topic6', (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  console.log(role);
  res.render(createPath('testsMenu6.ejs'), { role });
});

app.get('/topic7', (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  console.log(role);
  res.render(createPath('testsMenu7.ejs'), { role });
});

app.get('/topic8', (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  console.log(role);
  res.render(createPath('testsMenu8.ejs'), { role });
});
app.get('/pdd/:gl', (req, res) => {
  let gl = Number(req.params.gl);
  let user = req.session.user;
  let role = user ? user.role : null;
  console.log(role);
  res.render(createPath('pdd.ejs'), { role, gl });
});

app.get('/user', (req, res) => {
  res.render(createPath('login.ejs'));
});

app.post('/register', async (req, res) => {
  const { login, password, passwordConfirm, code } = req.body;
  console.log({ login, password, passwordConfirm });

  // Проверка, что пароль и его подтверждение совпадают
  if (password !== passwordConfirm) {
    return res.status(400).send('Пароли не совпадают');
  }

  try {
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res.status(400).send('Пользователь с таким логином уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ login, password: hashedPassword, role:"user" });
    const newAnswer = new Answer({ login });

    console.log(newUser);
    console.log(newAnswer);

    await newUser.save();
    await newAnswer.save();

    // Перенаправляем пользователя на страницу входа
    const role = null;
    // res.render(createPath('check.ejs'), { role });
    res.render(createPath('autorisation.ejs'), { role });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Произошла ошибка при регистрации пользователя'
    });
  }
});

app.get('/log', (req, res) => {
  let role = 'login';
  console.log(role);
  res.render(createPath('autorisation.ejs'), { role });
});

app.get('/index', (req, res) => {
  req.session.user = null;
  let user = req.session.user;
  let role = user ? user.role : null;
  console.log(role);
  res.render(createPath('index.ejs'), { role });
});

app.get('/', (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  console.log(role);
  res.render(createPath('index.ejs'), { role });
});

app.post('/answerLoad', async (req, res) => {
  try {
    console.log("В post");
    const userAnswer = req.body.userAnswer;
    await Answer.updateOne({ login: userAnswer.login }, { $set: { text: userAnswer.text } });
    console.log("Вроде норм2: " + userAnswer.text);
    console.log("Вроде норм3: " + userAnswer.text[0].answer);
    res.status(200).json({ message: 'Данные успешно обновлены' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении данных' });
  }
});

app.get('/testGlav/:glavNum', async (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  let login = user ? user.login : null;
  let glav = Number(req.params.glavNum);
  let userAnswer = null;
  if (login !== null) {
    userAnswer = await Answer.findOne({ login });
  }
  // console.log("glav: " + glav);
  const questions = await Test.find({ glav });
  if (questions.length > 0) {
    console.log("sdasdsd", questions[0].rightOrtion);
  } else {
    console.log("Вопросы не найдены");
  }
  res.render(createPath('tests.ejs'), { role, questions, userAnswer });
});

app.get('/questsAdmin/:glavNum', async (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  let glav = Number(req.params.glavNum);
  let userAnswer = null;
  const questions = await Test.find({ glav });
  if (questions.length > 0) {
    console.log("sdasdsd", questions[0].rightOrtion);
  } else {
    console.log("Вопросы не найдены");
  }
  res.render(createPath('questsAdmin.ejs'), { role, questions });
});

app.get('/addQuest/:glavNum', async (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  let glav = Number(req.params.glavNum);
  res.render(createPath('addQuest.ejs'), { role, glav });
});

app.get('/edit/:ques', async (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  let question = req.params.ques;
  question = question +"}";
  console.log(question);
  res.render(createPath('edit.ejs'), { role, question });
});

app.get('/record/:topic', async (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  let login = user ? user.login : null;
  let topicNum = Number(req.params.topic);
  let userAnswer = null;
  if (login !== null) {
    userAnswer = await Answer.findOne({ login });
  }


  
  const questions = await Test.find({ topic: topicNum });

  let selectedQuestions = [];
  const numQuestionsToSelect = 10;
  if (questions.length > 0) {
    // Проверяем, достаточное ли количество вопросов для выбора
    if (questions.length <= numQuestionsToSelect) {
      selectedQuestions = questions;
    } else {
      // Выбираем случайные неповторяющиеся вопросы
      const questionIndices = new Set();
      while (questionIndices.size < numQuestionsToSelect) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        questionIndices.add(randomIndex);
      }
      selectedQuestions = Array.from(questionIndices).map(index => questions[index]);
    }
    console.log(selectedQuestions[0].rightOrtion);
  } else {
    console.log("Вопросы не найдены");
  }

  res.render(createPath('record.ejs'), { role, questions: selectedQuestions });
});

app.post('/records', async (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : null;
  let login = user ? user.login : null;
  // let topicNum = Number(req.params.topic);
  let topicNum = 1;
  const questions = await Test.find({ topic: topicNum });

  let selectedQuestions = [];
  const numQuestionsToSelect = 10;
  if (questions.length > 0) {
    // Проверяем, достаточное ли количество вопросов для выбора
    if (questions.length <= numQuestionsToSelect) {
      selectedQuestions = questions;
    } else {
      // Выбираем случайные неповторяющиеся вопросы
      const questionIndices = new Set();
      while (questionIndices.size < numQuestionsToSelect) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        questionIndices.add(randomIndex);
      }
      selectedQuestions = Array.from(questionIndices).map(index => questions[index]);
    }
    console.log(selectedQuestions[0].rightOrtion);
  } else {
    console.log("Вопросы не найдены");
  }

  res.render(createPath('record.ejs'), { role, questions: selectedQuestions });
});

app.post('/login', async (req, res) => {
  const { login, password } = req.body;
  console.log(login);
  try {
    const existingUser = await User.findOne({ login });
    console.log(existingUser);
    let role = null;
    if (existingUser) {
      role = existingUser.role;
      const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
      console.log(isPasswordMatch);
      console.log(existingUser.password);

      if (isPasswordMatch) {
        console.log("Render");
        req.session.user = { login: existingUser.login, role: existingUser.role };
        let user = req.session.user;
        let role = user ? user.role : null;
        console.log(role);
        res.render(createPath('index.ejs'), { role });
      } else {
        res.status(401).json({
          message: 'Неверный пароль'
        })
        // res.status(401).send('Неверный пароль');
      }
    } else {
      res.status(404).json({
        message: 'Нет пользователя с такой почтой'
      })
      // res.status(404).send('Пользователь не найден');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Произошла ошибка при авторизации пользователя'
    })
    // res.status(500).send('Произошла ошибка при авторизации пользователя');
  }
});

app.post('/addQ', async (req, res) => {
  const data = req.body;
  console.log("data " + data);
  let glav = Number(data.glav);
  let id = glav + ".1";
  const questions = await Test.find({ glav });
  if (questions.length > 0) {
    for(let i = 0; i < questions.length; i++)
    if(questions[i].testId > id){
      let j = questions[i].testId.length - 1;
      let num = Number(questions[i].testId[j]) + 1;
      id = glav + "." + num;
    }
  } 
  data.testId = id;
  console.log(typeof(data.testId));
  console.log(typeof(data.topic));
  console.log(typeof(data.glav));
  console.log(typeof(data.question));
  console.log(typeof(data.image));
  console.log(typeof(data.option));
  console.log(typeof(data.rightOption));
  try {
    
    const newQuestion = new Test({
      testId: data.testId,
      topic: data.topic,
      glav: data.glav,
      question: data.question,
      image: data.image,
      options: data.option,
      rightOrtion: data.rightOption
    });
    console.log("ques :" + newQuestion);

    await newQuestion.save();

    let user = req.session.user;
   let role = user ? user.role : null;
   res.render(createPath('testsMenu.ejs'), { role });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Произошла ошибка при добавлении вопроса'
    });
  }
});

app.post('/deleteQuestion', async (req, res) => {

  const id = String(req.body.id);
  console.log("id:" + typeof(id)+ id);
  // let questionDel = await Test.findOne({ testId:id });
  let questionDel = await Test.deleteOne({ testId: id });
  console.log("idd:" + questionDel);
  if (questionDel) {
    console.log("Запись успешно удалена");
    // Ваш код обработки удаления записи
  } else {
    console.log("Запись не найдена");
    // Ваш код для случая, если запись не найдена
  }
});
app.listen(PORT, (error) => {
  error ? console.log(error) : console.log('Server listening on : http://localhost:' + PORT);
});