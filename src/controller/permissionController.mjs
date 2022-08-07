import {StatusCodes} from 'http-status-codes';
import pool from '../db.mjs';
import {validatePermission} from '../rules/permission/validation.mjs';
import * as ErrorCodes from '../error_codes.mjs';

export const getAll = async () => {
  try {
    const sqlQuery =
      'SELECT id, name, slug, created_at, updated_at, deleted_at FROM permissions';
    return await pool.query(sqlQuery);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: `unable to retrieve permissions`,
        error_code: ErrorCodes.ERR_CDE_RETRIEVE,
        data: {},
      },
    };
  }
};

export const getOne = async (id) => {
  const sqlQuery =
    'SELECT id, name, slug, created_at, updated_at, deleted_at FROM permissions WHERE id = ?';
  try {
    const rows = await pool.query(sqlQuery, id);
    if (0 >= rows) {
      throw {
        status: StatusCodes.NOT_FOUND,
        body: {
          success: false,
          message: `no permission found wih ID ${id}`,
          error_code: ErrorCodes.ERR_CDE_UNKNOWN_ID,
          data: {},
        },
      };
    }
    if (1 < rows) {
      throw {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          success: false,
          message: `more than once result with ID ${id}`,
          error_code: ErrorCodes.ERR_CDE_NON_UNQ,
          data: {},
        },
      };
    }
    return rows[0];
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: `unable to retrieve permission with id ${id}`,
        error_code: ErrorCodes.ERR_CDE_RETRIEVE,
        data: {},
      },
    };
  }
};

export const create = async (permission) => {
  const violations = validatePermission(permission);
  if (0 < violations.length) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      body: {
        success: false,
        message: 'rule violation while creating permission',
        error_code: ErrorCodes.ERR_CDE_WRONG_BODY,
        data: {
          violations: violations,
        },
      },
    };
  }

  try {
    const sqlQuery = 'INSERT INTO permissions(name, slug) VALUE (?, ?)';
    return await pool.query(sqlQuery, [permission.name, permission.slug]);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: `unable to create permission`,
        error_code: ErrorCodes.ERR_CDE_CREATE,
        data: {},
      },
    };
  }
};

export const update = async (id, permission) => {
  const violations = validatePermission(permission);
  if (0 < violations.length) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      body: {
        success: false,
        message: 'rule violation while updating permission',
        error_code: ErrorCodes.ERR_CDE_WRONG_BODY,
        data: {
          violations: violations,
        },
      },
    };
  }

  try {
    const sqlQuery =
      'UPDATE permissions SET name = ?, slug = ?, updated_at = NOW() WHERE id = ?';
    return await pool.query(sqlQuery, [permission.name, permission.slug, id]);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: `unable to update permission`,
        error_code: ErrorCodes.ERR_CDE_UPDATE,
      },
    };
  }
};

export const deleteOne = async (id) => {
  const sqlQuery = 'DELETE FROM permissions WHERE id = ?';
  try {
    return await pool.query(sqlQuery, id);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: `unable to delete permission`,
        error_code: ErrorCodes.ERR_CDE_DELETE,
      },
    };
  }
};
