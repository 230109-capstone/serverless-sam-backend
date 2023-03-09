module.exports = class RegistrationError extends Error {
    constructor(errors) {
      super('Registration Error');
      this.errors = errors;
    }
}