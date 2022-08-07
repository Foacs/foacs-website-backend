import {StatusCodes} from 'http-status-codes';
import jwt from 'jsonwebtoken';
import * as ErrorCodes from '../error_codes.mjs';

const authenticateMiddleware = (req, res, next) => {
  const {authorization} = req.headers;
  const token = authorization && authorization.split(' ')[1];

  if (null == token || undefined == token) {
    res.status(StatusCodes.UNAUTHORIZED);
    res.json({
      success: false,
      message: 'unauthorized',
      error_code: ErrorCodes.ERR_UNAUTHORIZED,
      data: {},
    });
    return res;
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      res.status(StatusCodes.FORBIDDEN);
      res.json({
        success: false,
        message: 'forbidden',
        error_code: ErrorCodes.ERR_FORBIDDEN,
        data: {},
      });
      return res;
    }

    req.user = user;
    next();
  });
};

export default authenticateMiddleware;
