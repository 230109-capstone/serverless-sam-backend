
module.exports = class LoginError extends Error {
    constructor(errors) {
      super("Login Error");
      this.errors = errors;
    }
  }