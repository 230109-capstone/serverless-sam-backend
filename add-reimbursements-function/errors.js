class AuthorizationError extends Error {
    constructor(errors) {
      super("Authorization Error");
      this.errors = errors;
    }
}

class ReimbursementError extends Error {
    constructor(errors) {
        super('Reimbursement Error');
        this.errors = errors;
    }
}

module.exports.AuthorizationError = AuthorizationError;
module.exports.ReimbursementError = ReimbursementError;
