import express from 'express';
import {StatusCodes} from 'http-status-codes';

import {
  create,
  update,
  getAll,
  getOne,
  deleteOne,
} from '../controller/permissionController.mjs';
import permissionConverter from '../converter/permissionConverter.mjs';
import {handleError} from './utils/errorUtils.mjs';

/******************************************************
 * Create router
 ******************************************************/
const router = express.Router();

/******************************************************
 * Route
 ******************************************************/
router.get('/permissions/', (_req, res) => {
  getAll()
    .then((rows) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'data found',
        data: {
          permissions: rows.map(permissionConverter),
        },
        links: [
          {
            rel: 'self',
            method: 'GET',
            href: '/permissions/',
          },
          {
            rel: 'create',
            method: 'POST',
            href: '/permissions/',
          },
        ],
      });
    })
    .catch((error) => handleError(res, error));
});

router.get('/permissions/:id', (req, res) => {
  getOne(req.params.id)
    .then((row) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'data found',
        ...permissionConverter(row),
      });
    })
    .catch((error) => handleError(res, error));
});

router.post('/permissions/', (req, res) => {
  const permissionInfo = req.body;
  create(permissionInfo)
    .then((dbRes) => {
      permissionInfo.id = Number(dbRes.insertId);
      res.status(StatusCodes.OK).json({
        success: true,
        message: `permission ${permissionInfo.id} has been submitted successfully`,
        ...permissionConverter(permissionInfo),
      });
    })
    .catch((error) => handleError(res, error));
});

router.put('/permissions/:id', (req, res) => {
  const permissionInfo = req.body;
  permissionInfo.id = req.params.id;
  update(permissionInfo.id, permissionInfo)
    .then(() => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: `permission ${permissionInfo.id} has been updated successfully`,
        ...permissionConverter(permissionInfo),
      });
    })
    .catch((error) => handleError(res, error));
});

router.delete('/permissions/:id', (req, res) => {
  const id = req.params.id;
  deleteOne(id)
    .then(() => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: `permission ${id} has been deleted successfully`,
        data: {},
        links: [
          {
            rel: 'self',
            method: 'DELETE',
            href: `/permissions/${id}`,
          },
        ],
      });
    })
    .catch((error) => handleError(res, error));
});

export default router;
