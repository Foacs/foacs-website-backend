const ERR_CDE_BASE = 1000;

// Bad request
export const ERR_CDE_UNKNOWN_ID = +ERR_CDE_BASE + 1;
export const ERR_CDE_WRONG_BODY = +ERR_CDE_BASE + 2;
export const ERR_CDE_INVALID_PAGE = +ERR_CDE_BASE + 3;
export const ERR_CDE_INVALID_LIMIT = +ERR_CDE_BASE + 4;

// DB issue
export const ERR_CDE_RETRIEVE = +ERR_CDE_BASE + 101;
export const ERR_CDE_CREATE = +ERR_CDE_BASE + 102;
export const ERR_CDE_UPDATE = +ERR_CDE_BASE + 103;
export const ERR_CDE_DELETE = +ERR_CDE_BASE + 104;
export const ERR_CDE_NON_UNQ = +ERR_CDE_BASE + 105;

// Authentication
export const ERR_UNAUTHORIZED = +ERR_CDE_BASE + 201;
export const ERR_FORBIDDEN = +ERR_CDE_BASE + 202;
