import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {
  create,
  update,
  getAll,
  getOne,
  getPermissions,
  getRoles,
  deleteOne,
} from '../controller/userController.mjs';

/******************************************************
 * Create router
 ******************************************************/
const router = express.Router();

const handleError = (res, error) => {
  res
    .status(error.status ?? StatusCodes.INTERNAL_SERVER_ERROR)
    .json(error.body);
};

/******************************************************
 * Route
 ******************************************************/
router.get('/', (_req, res) => {
  getAll()
    .then((rows) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'data found',
        data: {
          users: rows,
        },
      });
    })
    .catch((error) => handleError(res, error));
});

router.get('/:id', (req, res) => {
  getOne(req.params.id)
    .then((row) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'data found',
        data: {
          user: row,
        },
      });
    })
    .catch((error) => handleError(res, error));
});

router.get('/:id/roles', (req, res) => {
  getRoles(req.params.id)
    .then((rows) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'data found',
        data: {
          roles: rows,
        },
      });
    })
    .catch((error) => handleError(res, error));
});

router.get('/:id/permissions', (req, res) => {
  getPermissions(req.params.id)
    .then((rows) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'data found',
        data: {
          permissions: rows,
        },
      });
    })
    .catch((error) => handleError(res, error));
});

router.post('/', (req, res) => {
  const userInfo = req.body;
  create(userInfo)
    .then((dbRes) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: `user ${dbRes.insertId} has been submitted successfully`,
        data: {
          user: userInfo,
        },
      });
    })
    .catch((error) => handleError(res, error));
});

router.put('/:id', (req, res) => {
  const userInfo = req.body;
  const id = req.params.id;
  update(id, userInfo)
    .then(() => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: `user ${id} has been updated successfully`,
        data: {
          user: userInfo,
        },
      });
    })
    .catch((error) => handleError(res, error));
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  deleteOne(id)
    .then(() => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: `user ${id} has been deleted successfully`,
        data: {},
      });
    })
    .catch((error) => handleError(res, error));
});

export default router;
