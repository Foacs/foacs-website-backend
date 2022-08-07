import express from 'express';
import {
  create,
  update,
  getAll,
  getOne,
  deleteOne,
} from '../controller/permissionController.mjs';

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
          permissions: rows,
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
          permission: row,
        },
      });
    })
    .catch((error) => {
      res.status(error.status ?? 500).json(error.body);
    });
});

router.post('/', (req, res) => {
  const permissionInfo = req.body;
  create(permissionInfo)
    .then((dbRes) => {
      res.status(200).json({
        success: true,
        message: `permission ${dbRes.insertId} has been submitted successfully`,
        data: {
          permission: permissionInfo,
        },
      });
    })
    .catch((error) => {
      res.status(error.status ?? 500).json(error.body);
    });
});

router.put('/:id', (req, res) => {
  const permissionInfo = req.body;
  const id = req.params.id;
  update(id, permissionInfo)
    .then(() => {
      res.status(200).json({
        success: true,
        message: `permission ${id} has been updated successfully`,
        data: {
          permission: permissionInfo,
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
        message: `permission ${id} has been deleted successfully`,
        data: {},
      });
    })
    .catch((error) => {
      res.status(error.status ?? 500).json(error.body);
    });
});

export default router;
