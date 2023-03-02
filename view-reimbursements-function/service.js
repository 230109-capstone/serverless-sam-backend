const { JsonWebTokenError } = require('jsonwebtoken');
const AuthorizationError = require('./errors');

const { retrieveAllReimbursements, retrieveAllReimbursementsByUsername } = require('./dao');
const { verifyTokenAndReturnPayload } = require('./util');

// helper function to retrieve the appropriate reimbursements for each user role
async function retrieveReimbursements(payload) {
  if (payload.role === 'finance_manager') {
    const data = await retrieveAllReimbursements();
    return data.Items;
  } else if (payload.role === 'employee') {
    const data = await retrieveAllReimbursementsByUsername(payload.username);
    return data.Items;
  }
}

// check user's JWT and verify their role
async function authorizeEmployeeOrFinanceManager(authorizationHeader) {
  if (!authorizationHeader) {
    throw new JsonWebTokenError('Token not provided');
  }

  const token = authorizationHeader.split(' ')[1];
  const payload = await verifyTokenAndReturnPayload(token);

  if (!(payload.role == 'employee' || payload.role == 'finance_manager')) {
    throw new AuthorizationError(['Employee or Finance manager role required']);
  }

  return payload;
}

module.exports = {
  retrieveReimbursements,
  authorizeEmployeeOrFinanceManager,
};
