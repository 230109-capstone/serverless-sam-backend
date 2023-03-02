// customer error class that is thrown if user's role is invalid
module.exports = class AuthorizationError extends Error {
  constructor(errors) {
    super('Authorization Error');
    this.errors = errors;
  }
};
