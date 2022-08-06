import express from 'express';
import {
  create,
  update,
  getAll,
  getOne,
  getPermissions,
  deleteOne,
} from '../controller/roleController.mjs';

/******************************************************
 * Create router
 ******************************************************/
const router = express.Router();

/******************************************************
 * Route
 ******************************************************/
router.get('/', (_req, res) => {
  getAll()
    .then((rows) => {
      res.status(200).json({
        success: true,
        message: 'data found',
        data: {
          roles: rows,
        },
      });
    })
    .catch((error) => {
      res.status(error.status ?? 500).json(error.body);
    });
});

router.get('/:id', (req, res) => {
  getOne(req.params.id)
    .then((row) => {
      res.status(200).json({
        success: true,
        message: 'data found',
        data: {
          role: row,
        },
      });
    })
    .catch((error) => {
      res.status(error.status ?? 500).json(error.body);
    });
});

router.get('/:id/permissions', (req, res) => {
  getPermissions(req.params.id)
    .then((rows) => {
      res.status(200).json({
        success: true,
        message: 'data found',
        data: {
          permissions: rows,
        },
      });
    })
    .catch((error) => {
      res.status(error.status ?? 500).json(error.body);
    });
});

router.post('/', (req, res) => {
  const roleInfo = req.body;
  create(roleInfo)
    .then((dbRes) => {
      res.status(200).json({
        success: true,
        message: `role ${dbRes.insertId} has been submitted successfully`,
        data: {
          role: roleInfo,
        },
      });
    })
    .catch((error) => {
      res.status(error.status ?? 500).json(error.body);
    });
});

router.put('/:id', (req, res) => {
  const roleInfo = req.body;
  const id = req.params.id;
  update(id, roleInfo)
    .then(() => {
      res.status(200).json({
        success: true,
        message: `role ${id} has been updated successfully`,
        data: {
          role: roleInfo,
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(error.status ?? 500).json(error.body);
    });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  deleteOne(id)
    .then(() => {
      res.status(200).json({
        success: true,
        message: `role ${id} has been deleted successfully`,
        data: {},
      });
    })
    .catch((error) => {
      res.status(error.status ?? 500).json(error.body);
    });
});

export default router;
