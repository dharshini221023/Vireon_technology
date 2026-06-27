/**
 * Input Validation Middleware
 * Uses express-validator
 */
const { validationResult } = require('express-validator');

/**
 * Run validators and return 422 if any fail.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
}

module.exports = { validate };
