import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import dotenv from 'dotenv';

import authenticateMiddleware from './middleware/authenticate.mjs';

import usersRouter from './route/users.mjs';
import rolesRouter from './route/roles.mjs';
import permissionsRouter from './route/permission.mjs';

/******************************************************
 * Initialize application
 * Set middleware
 ******************************************************/
dotenv.config();
const app = express();
app.use(logger(process.env.LOGGER));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// app.use(authenticateMiddleware);
app.use(cors());

/******************************************************
 * Set routers
 ******************************************************/
app.use('/users/', usersRouter);
app.use('/roles/', rolesRouter);
app.use('/permissions/', permissionsRouter);

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({message: err.message});
});

/******************************************************
 * Start server
 ******************************************************/
app.listen(process.env.PORT, () => {
  console.log(`🚀 Foacs backend ready at http://localhost:${process.env.PORT}`);
});
