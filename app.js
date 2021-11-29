import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { resolveSoa } from 'dns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ONE_DAY = 1000 * 60 * 60 * 24;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessions({
  secret: "supersecret",
  saveUnintialized: true,
  cookie: { maxAge: ONE_DAY },
  resave: false,
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
