import express from 'express';
import {StatusCodes} from 'http-status-codes';

import {
  create,
  update,
  getAll,
  getOne,
  getPermissions,
  deleteOne,
  removePermission,
  addPermission,
} from '../controller/roleController.mjs';
import roleConverter from '../converter/roleConverter.mjs';
import permissionConverter from '../converter/permissionConverter.mjs';
import {handleError} from './utils/errorUtils.mjs';

/******************************************************
 * Create router
 ******************************************************/
const router = express.Router();

/******************************************************
 * Route
 ******************************************************/
router.get('/roles/', (_req, res) => {
  getAll()
    .then((rows) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'data found',
        data: {
          roles: rows.map(roleConverter),
        },
        links: [
          {
            rel: 'self',
            method: 'GET',
            href: '/roles/',
          },
          {
            rel: 'create',
            method: 'POST',
            href: '/roles/',
          },
        ],
      });
    })
    .catch((error) => handleError(res, error));
});

router.get('/roles/:id', (req, res) => {
  getOne(req.params.id)
    .then((row) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'data found',
        ...roleConverter(row),
      });
    })
    .catch((error) => handleError(res, error));
});

router.get('/roles/:id/permissions', (req, res) => {
  getPermissions(req.params.id)
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
            href: `/roles/${req.params.id}/permissions`,
          },
        ],
      });
    })
    .catch((error) => handleError(res, error));
});

router.post('/roles/:id/permissions/:permission_id', (req, res) => {
  const id = req.params.id;
  const permissionId = req.params.permission_id;
  addPermission(id, permissionId)
    .then((_dbRes) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: `permission ${permissionId} has been added successfully to role with ID ${id}`,
        data: {},
        links: [
          {
            rel: 'self',
            method: 'POST',
            href: `/roles/${id}/permissions/${permissionId}`,
          },
          {
            rel: 'remove role',
            method: 'DELETE',
            href: `/roles/${id}/permissions/${permissionId}`,
          },
          {
            rel: 'roles',
            method: 'GET',
            href: `/roles/${id}/permissions`,
          },
        ],
      });
    })
    .catch((error) => handleError(res, error));
});

router.delete('/roles/:id/permissions/:permission_id', (req, res) => {
  const id = req.params.id;
  const permissionId = req.params.permission_id;
  removePermission(id, permissionId)
    .then((_dbRes) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: `permission ${permissionId} has been removed successfully to role with ID ${id}`,
        data: {},
        links: [
          {
            rel: 'self',
            method: 'DELETE',
            href: `/roles/${id}/permissions/${permissionId}`,
          },
          {
            rel: 'roles',
            method: 'GET',
            href: `/roles/${id}/permissions`,
          },
        ],
      });
    })
    .catch((error) => handleError(res, error));
});

router.post('/roles/', (req, res) => {
  const roleInfo = req.body;
  create(roleInfo)
    .then((dbRes) => {
      roleInfo.id = Number(dbRes.insertId);
      res.status(StatusCodes.OK).json({
        success: true,
        message: `role ${dbRes.insertId} has been submitted successfully`,
        ...roleConverter(roleInfo),
      });
    })
    .catch((error) => handleError(res, error));
});

router.put('/roles/:id', (req, res) => {
  const roleInfo = req.body;
  roleInfo.id = req.params.id;
  update(roleInfo.id, roleInfo)
    .then(() => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: `role ${roleInfo.id} has been updated successfully`,
        ...roleConverter(roleInfo),
      });
    })
    .catch((error) => handleError(res, error));
});

router.delete('/roles/:id', (req, res) => {
  const id = req.params.id;
  deleteOne(id)
    .then(() => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: `role ${id} has been deleted successfully`,
        data: {},
        links: [
          {
            rel: 'self',
            method: 'DELETE',
            href: `/roles/${id}`,
          },
        ],
      });
    })
    .catch((error) => handleError(res, error));
});

export default router;
