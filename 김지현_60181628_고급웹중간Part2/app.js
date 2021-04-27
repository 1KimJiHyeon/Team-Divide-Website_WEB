const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var pug = require('pug');

const path = require('path');
const app = express();
// process.env.PORT가 없으면 3000으로 port 지정
app.set('port', process.env.PORT || 3000);

// Pug 사용을 위한 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', pug );

// morgan 사용을 위한 설정
app.use(morgan('dev'));
// static 사용을 위한 설정
app.use('/', express.static(path.join(__dirname, 'public')));
// body-parser 사용을 위한 설정
app.use(express.json());
// body-parser 사용을 위한 설정
app.use(express.urlencoded({ extended: false }));
// cookie-parser 사용을 위한 설정
app.use(cookieParser(process.env.COOKIE_SECRET));
// express-session 사용을 위한 설정
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 6000000,
  },
  name: 'session-cookie'
}));

// 학생 사용자의 정보를 담기위한 users 선언
const users = {};
// 조 인원 수 값을 담기위한 numbers 선언
const numbers = {};

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.sessionID);
  req.session.views = (req.session.views || 0) + 1;
  next();
});

// PATH가 '/'이고 METHOD가 get일 때 실행
app.get('/', (req, res) => {
  console.log(req.signedCookies)
  // req.signedCookies.admit일때
  if (req.signedCookies.admit)
  // '/user' PATH로 redirect
    res.redirect('/user');
  // '/login' PATH로 redirect
  else
    res.redirect('/login');
});

// PATH가 '/login'이고 METHOD가 get일 때 실행
app.get('/login', (req, res) => {
  // 'login.pug'을 render
  res.render('login.pug');
});

// PATH가 '/admit'이고 METHOD가 get일 때 실행
app.get('/admit', (req, res) => {
  console.log(req.query);
  console.log(req.body);
  //()안에 내용을 전송
  res.send(`username: ${req.query.login}<br>
            password: ${req.query.password}`);
});
// PATH가 '/user'이고 METHOD가 get일 때 실행
app.get('/user', (req, res) => {
  //()안에 내용을 전송
  res.sendFile(path.join(__dirname, './public/user.html'));
});
// PATH가 '/users'이고 METHOD가 get일 때 실행
app.get('/users', (req, res) => {
  //users의 내용을 전송
  res.send(users);
});
// PATH가 '/draw'이고 METHOD가 get일 때 실행
app.get('/draw', (req, res) => {
  //()안에 내용을 전송
  res.sendFile(path.join(__dirname, './public/draw.html'));
});
// PATH가 '/user_num'이고 METHOD가 get일 때 실행
app.get('/user_num', (req, res) => {
  //numbers의 내용을 전송
  res.send(numbers);
});

// PATH가 '/admit'이고 METHOD가 post일 때 실행
app.post('/admit', (req, res) => {
  // login, password를 req.body로 지정
  const { login, password } = req.body;
  // login이 'professor'이고 password가 '0000'일 때
  if (login == 'professor' && password == '0000') {
    // cookie 지정
    res.cookie('admit', true, {
      maxAge: 600000,
      httpOnly: true,
      path: '/',
      signed: true
    });
    // '/' PATH로 redirect
    res.redirect('/');
  } else {
    // '/login' PATH로 redirect
    res.redirect('/login')
  }
});

// PATH가 '/user'이고 METHOD가 post일 때 실행
app.post('/user', (req, res) => {
  // name, stNum을 req.body로 지정
  const { name, stNum } = req.body;
  // id를 Date.now 값으로 지정
  const id = Date.now();
  // 해당하는 id에 name, stNum 지정
  users[id] = { name, stNum };
  res.end();
});

// PATH가 '/user_num'이고 METHOD가 post일 때 실행
app.post('/user_num', (req, res) => {
  // number를 req.body로 지정
  const { number } = req.body;
  // numbers의 0번째 값을 number로 지정
  numbers[0] = { number };
  res.end();
});

// PATH가 '/user/:id'이고 METHOD가 put일 때 실행
app.put('/user/:id', (req, res) => {
  // name, stNum을 req.body로 지정
  const { name, stNum } = req.body;
  // req.params.id에 해당하는 users를 name, stNum으로 지정
  users[req.params.id] = { name, stNum };
  res.end();
});

// PATH가 '/user/:id'이고 METHOD가 delete일 때 실행
app.delete('/user/:id', (req, res) => {
  // req.params.id에 해당하는 users를 삭제
  delete users[req.params.id]
  res.end();
});

// 에러처리 미들웨어
app.use((err, req, res, next) => {
  res.status(401).send(err.message);
});

// 해당하는 port에 연결시작 
app.listen(app.get('port'), () => {
  console.log(`App listening at http://localhost:${app.get('port')}`);
});