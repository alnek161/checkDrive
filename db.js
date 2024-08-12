const mongoose = require('mongoose')

const db = 'mongodb+srv://alnek161:12345678910@cluster0.nxnr6pg.mongodb.net/test';

mongoose
  .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})//подключение к БД
  .then((res) => console.log('Connected to DB'))//вывод сообщения об успешном подключении
  .catch((error) => console.log(error));//улавливание ошибок