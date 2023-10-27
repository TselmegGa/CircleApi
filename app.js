const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const jwtAuth = require('./middleware/jwt');
const encodingAuth = require('./middleware/sha256');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const forumRouter = require('./routes/forum');
const forumViewRouter = require('./routes/forum.view');
const historyRouter = require('./routes/history');
const db = require("./model/sequelize");

const app = express();
app.disable("x-powered-by");

// get config vars
dotenv.config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

db.sequelize.sync({ alter: true });

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/users', [jwtAuth, encodingAuth], usersRouter);
app.use('/post', [jwtAuth, encodingAuth], postRouter);
app.use('/forum', [jwtAuth, encodingAuth], forumRouter);
app.use('/view', forumViewRouter);
app.use('/history', historyRouter);

// catch 404 and forward to error handler
app.use(function(_req, _res, next) {
  next(createError(404));
});
module.exports = app;
