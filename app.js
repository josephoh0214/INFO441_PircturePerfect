import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';
import MsIdExpress from 'microsoft-identity-express';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import apiRouter from './routes/api/v1/apiv1.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { resolveSoa } from 'dns';

/**
 * Directory ID: f6b6dd5b-f02f-441a-99a0-162ac5060bd2
 * Client ID: a25cf608-e2ca-4093-b0e6-314bee1d8321
 * Value: ZH17Q~mcYy1RhFjE5AYNvyAtH3SQUa_yADrrg
 * Secret ID: a709ab32-a178-4953-a62b-9853da60bcf5
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ONE_DAY = 1000 * 60 * 60 * 24;

const appSettings = {
  appCredentials: {
    tenantId: "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    clientId: "a25cf608-e2ca-4093-b0e6-314bee1d8321",
    clientSecret: "ZH17Q~mcYy1RhFjE5AYNvyAtH3SQUa_yADrrg",
  },
  authRoutes: {
    redirect: "https://picture-perfect.bta167.me/", // deployed redirect url
    // redirect: "/redirect", // localhost redirect url
    error: "/error",
    unauthorized: "/unauthorized",
  }
}


var app = express();

const MS_ID = new MsIdExpress.WebAppAuthClientBuilder(appSettings).build();

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
app.use(MS_ID.initialize());

app.use('/', indexRouter);
app.use('/api/v1', apiRouter);
app.use('/users', usersRouter);

app.get('/signin',
  MS_ID.signIn({
    postLoginRedirect: "/",
  })
);

app.get('/signout',
  MS_ID.signOut({
    postLogoutRedirect: "/",
  })
);

app.get('/error', (req, res) => {
  res.status("500").send("Server Error");
});

app.get('unauthorized', (req, res) => {
  res.status("401").send("Permission Denied");
});

export default app;
