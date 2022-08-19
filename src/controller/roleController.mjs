import {StatusCodes} from 'http-status-codes';
import pool from '../db.mjs';
import {validateRole} from '../rules/role/validation.mjs';
import * as ErrorCodes from '../error_codes.mjs';

export const getAll = async () => {
  try {
    const sqlQuery =
      'SELECT id, name, slug, created_at, updated_at, deleted_at FROM roles';
    return await pool.query(sqlQuery);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: 'unable to retrieve roles',
        error_code: ErrorCodes.ERR_CDE_RETRIEVE,
        data: {},
      },
    };
  }
};

export const getOne = async (id) => {
  const sqlQuery =
    'SELECT id, name, slug, created_at, updated_at, deleted_at FROM roles WHERE id = ?';
  try {
    const rows = await pool.query(sqlQuery, id);
    if (0 >= rows) {
      throw {
        status: StatusCodes.NOT_FOUND,
        body: {
          success: false,
          message: `no role found wih ID ${id}`,
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
        message: `unable to retrieve roles with id ${id}`,
        error_code: ErrorCodes.ERR_CDE_RETRIEVE,
        data: {},
      },
    };
  }
};

export const getPermissions = async (id) => {
  const sqlQuery =
    'SELECT p.id, p.name, p.slug, p.created_at, p.updated_at, p.deleted_at' +
    ' FROM permissions p JOIN roles_permissions rp ON rp.permission_id = p.id' +
    ' WHERE rp.role_id = ?';
  try {
    return await pool.query(sqlQuery, id);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: 'unable to retrieve permissions for role with id ${id}',
        error_code: ErrorCodes.ERR_CDE_RETRIEVE,
        data: {},
      },
    };
  }
};

export const create = async (role) => {
  const violations = validateRole(role);
  if (0 < violations.length) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      body: {
        success: false,
        message: 'rule violation while creating role',
        error_code: ErrorCodes.ERR_CDE_WRONG_BODY,
        data: {
          violations: violations,
        },
      },
    };
  }

  try {
    const sqlQuery = 'INSERT INTO roles(name, slug) VALUE (?, ?)';
    return await pool.query(sqlQuery, [role.name, role.slug]);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: 'unable to create role',
        error_code: ErrorCodes.ERR_CDE_CREATE,
        data: {},
      },
    };
  }
};

export const update = async (id, role) => {
  const violations = validateRole(role);
  if (0 < violations.length) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      body: {
        success: false,
        message: 'rule violation while updating role',
        error_code: ErrorCodes.ERR_CDE_WRONG_BODY,
        data: {
          violations: violations,
        },
      },
    };
  }

  try {
    const sqlQuery =
      'UPDATE roles SET name = ?, slug = ?, updated_at = NOW() WHERE id = ?';
    return await pool.query(sqlQuery, [role.name, role.slug, id]);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: 'unable to update role',
        error_code: ErrorCodes.ERR_CDE_UPDATE,
        data: {},
      },
    };
  }
};

export const addPermission = async (id, permissionId) => {
  const sqlQuery =
    'INSERT INTO roles_permissions(role_id, permission_id) VALUE (?, ?)';
  try {
    return await pool.query(sqlQuery, [id, permissionId]);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: 'unable to add permission to role',
        error_code: ErrorCodes.ERR_CDE_UPDATE,
        data: {},
      },
    };
  }
};

export const removePermission = async (id, permissionId) => {
  const sqlQuery =
    'DELETE FROM roles_permissions WHERE role_id = ? AND permission_id = ?';
  try {
    return await pool.query(sqlQuery, [id, permissionId]);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: 'unable to delete permission from role',
        error_code: ErrorCodes.ERR_CDE_UPDATE,
        data: {},
      },
    };
  }
};

export const deleteOne = async (id) => {
  const sqlQuery = 'DELETE FROM roles WHERE id = ?';
  try {
    return await pool.query(sqlQuery, id);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: 'unable to delete role',
        error_code: ErrorCodes.ERR_CDE_DELETE,
        data: {},
      },
    };
  }
};
