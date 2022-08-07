import {StatusCodes} from 'http-status-codes';
import pool from '../db.mjs';
import {validateUser} from '../rules/user/validation.mjs';
import * as ErrorCodes from '../error_codes.mjs';

export const getAll = async () => {
  try {
    const sqlQuery =
      'SELECT id, name, email, first_name, last_name, created_at, updated_at, deleted_at FROM users';
    return await pool.query(sqlQuery);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: 'unable to retrieve users',
        error_code: ErrorCodes.ERR_CDE_RETRIEVE,
        data: {},
      },
    };
  }
};

export const getOne = async (id) => {
  const sqlQuery =
    'SELECT id, name, email, first_name, last_name, created_at, updated_at, deleted_at FROM users WHERE id = ?';
  try {
    const rows = await pool.query(sqlQuery, id);
    if (0 >= rows) {
      throw {
        status: StatusCodes.NOT_FOUND,
        body: {
          success: false,
          message: `no user found wih ID ${id}`,
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
        message: `unable to retrieve user with id ${id}`,
        error_code: ErrorCodes.ERR_CDE_RETRIEVE,
        data: {},
      },
    };
  }
};

export const getRoles = async (id) => {
  const sqlQuery =
    'SELECT r.id, r.name, r.slug, r.created_at, r.updated_at, r.deleted_at FROM roles r JOIN users_roles ur ON ur.role_id = r.id WHERE ur.user_id = ?';
  try {
    return await pool.query(sqlQuery, id);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: `unable to retrieve roles for user with id ${id}`,
        error_code: ErrorCodes.ERR_CDE_RETRIEVE,
        data: {},
      },
    };
  }
};

export const getPermissions = async (id) => {
  const sqlQuery =
    'SELECT p.id, p.name, p.slug, p.created_at, p.updated_at, p.deleted_at' +
    ' FROM permissions p JOIN roles_permissions rp ON rp.permission_id = p.id JOIN roles r ON rp.role_id = r.id JOIN users_roles ur ON ur.role_id = r.id' +
    ' WHERE ur.user_id = ?';
  try {
    return await pool.query(sqlQuery, id);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: `unable to retrieve permissions for user with id ${id}`,
        error_code: ErrorCodes.ERR_CDE_RETRIEVE,
        data: {},
      },
    };
  }
};

export const create = async (user) => {
  const violations = validateUser(user);
  if (0 < violations.length) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      body: {
        success: false,
        message: 'rule violation while creating user',
        error_code: ErrorCodes.ERR_CDE_WRONG_BODY,
        data: {
          violations: violations,
        },
      },
    };
  }

  try {
    const sqlQuery =
      'INSERT INTO users(name, email, password, first_name, last_name) VALUE (?, ?, ?, ?, ?)';
    return await pool.query(sqlQuery, [
      user.name,
      user.email,
      user.password,
      user.first_name ?? '',
      user.last_name ?? '',
    ]);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: 'unable to create user',
        error_code: ErrorCodes.ERR_CDE_CREATE,
        data: {},
      },
    };
  }
};

export const update = async (id, user) => {
  const violations = validateUser(user);
  if (0 < violations.length) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      body: {
        success: false,
        message: 'rule violation while updating user',
        error_code: ErrorCodes.ERR_CDE_WRONG_BODY,
        data: {
          violations: violations,
        },
      },
    };
  }

  try {
    const sqlQuery =
      'UPDATE users SET name = ?, email = ?, password = ?, first_name = ?, last_name = ?, updated_at = NOW() WHERE id = ?';
    return await pool.query(sqlQuery, [
      user.name,
      user.email,
      user.password,
      user.first_name ?? '',
      user.last_name ?? '',
      id,
    ]);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: 'unable to update user',
        error_code: ErrorCodes.ERR_CDE_UPDATE,
        data: {},
      },
    };
  }
};

export const deleteOne = async (id) => {
  const sqlQuery = 'DELETE FROM users WHERE id = ?';
  try {
    return await pool.query(sqlQuery, id);
  } catch (error) {
    console.error(error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: 'unable to delete user',
        error_code: ErrorCodes.ERR_CDE_DELETE,
        data: {},
      },
    };
  }
};
