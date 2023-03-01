module.exports = class AuthorizationError extends Error {
    constructor(errors) {
      super("Authorization Error");
      this.errors = errors;
    }
}

module.exports = class ReimbursementError extends Error {
    constructor(errors) {
        super('Reimbursement Error');
        this.errors = errors;
    }
}
