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
  addRole,
  removeRole,
} from '../controller/userController.mjs';
import userConverter from '../converter/userConverter.mjs';
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
router.get('/users/', (_req, res) => {
  getAll()
    .then((rows) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'data found',
        data: {
          users: rows.map(userConverter),
        },
        links: [
          {
            rel: 'self',
            method: 'GET',
            href: '/users/',
          },
          {
            rel: 'create',
            method: 'POST',
            href: '/users/',
          },
        ],
      });
    })
    .catch((error) => handleError(res, error));
});

router.get('/users/:id', (req, res) => {
  getOne(req.params.id)
    .then((row) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'data found',
        ...userConverter(row),
      });
    })
    .catch((error) => handleError(res, error));
});

router.get('/users/:id/roles', (req, res) => {
  const id = req.params.id;
  getRoles(id)
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
            href: `/users/${id}/roles`,
          },
          {
            rel: 'add role',
            method: 'POST',
            href: `/users/${id}/roles/:role_id`,
            templated: true,
          },
          {
            rel: 'remove role',
            method: 'DELETE',
            href: `/users/${id}/roles/:role_id`,
            templated: true,
          },
        ],
      });
    })
    .catch((error) => handleError(res, error));
});

router.post('/users/:id/roles/:role_id', (req, res) => {
  const id = req.params.id;
  const roleId = req.params.role_id;
  addRole(id, roleId)
    .then((_dbRes) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: `role ${roleId} has been added successfully to user with ID ${id}`,
        data: {},
        links: [
          {
            rel: 'self',
            method: 'POST',
            href: `/users/${id}/roles/${roleId}`,
          },
          {
            rel: 'remove role',
            method: 'DELETE',
            href: `/users/${id}/roles/${roleId}`,
          },
          {
            rel: 'roles',
            method: 'GET',
            href: `/users/${id}/roles`,
          },
        ],
      });
    })
    .catch((error) => handleError(res, error));
});

router.delete('/users/:id/roles/:role_id', (req, res) => {
  const id = req.params.id;
  const roleId = req.params.role_id;
  removeRole(id, roleId)
    .then((_dbRes) => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: `role ${roleId} has been removed successfully to user with ID ${id}`,
        data: {},
        links: [
          {
            rel: 'self',
            method: 'DELETE',
            href: `/users/${id}/roles/${roleId}`,
          },
          {
            rel: 'roles',
            method: 'GET',
            href: `/users/${id}/roles`,
          },
        ],
      });
    })
    .catch((error) => handleError(res, error));
});

router.get('/users/:id/permissions', (req, res) => {
  const id = req.params.id;
  getPermissions(id)
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
            href: `/users/${id}/permissions`,
          },
        ],
      });
    })
    .catch((error) => handleError(res, error));
});

router.post('/users/', (req, res) => {
  const userInfo = req.body;
  create(userInfo)
    .then((dbRes) => {
      userInfo.id = Number(dbRes.insertId);
      res.status(StatusCodes.OK).json({
        success: true,
        message: `user ${dbRes.insertId} has been submitted successfully`,
        ...userConverter(userInfo),
      });
    })
    .catch((error) => handleError(res, error));
});

router.put('/users/:id', (req, res) => {
  const userInfo = req.body;
  userInfo.id = req.params.id;
  update(userInfo.id, userInfo)
    .then(() => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: `user ${userInfo.id} has been updated successfully`,
        ...userConverter(userInfo),
      });
    })
    .catch((error) => handleError(res, error));
});

router.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  deleteOne(id)
    .then(() => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: `user ${id} has been deleted successfully`,
        data: {},
        links: [
          {
            rel: 'self',
            method: 'DELETE',
            href: `/users/${id}`,
          },
        ],
      });
    })
    .catch((error) => handleError(res, error));
});

export default router;
