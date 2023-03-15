const { JsonWebTokenError } = require('jsonwebtoken');
const AuthorizationError = require('../errors');

const { retrieveAllReimbursements, retrieveAllReimbursementsByUsername } = require('../dao');
const { verifyTokenAndReturnPayload } = require('../util');
const { retrieveReimbursements, authorizeEmployeeOrFinanceManager } = require('../service');

jest.mock('../dao', function () {
  return {
    retrieveAllReimbursements: jest.fn(),
    retrieveAllReimbursementsByUsername: jest.fn(),
  };
});

jest.mock('../util', function () {
  return {
    verifyTokenAndReturnPayload: jest.fn(),
  };
});

describe('view reimbursements tests', () => {
  test('finance manager view', async () => {
    retrieveAllReimbursements.mockReturnValueOnce(
      Promise.resolve({
        Items: [
          { status: 'pending', amount: '20', submitter: 'username', desription: 'description' },
        ],
      })
    );
    const tickets = await retrieveReimbursements({ role: 'finance_manager' });
    expect(tickets).toMatchObject([
      { status: 'pending', amount: '20', submitter: 'username', desription: 'description' },
    ]);
  });

  test('employee view', async () => {
    retrieveAllReimbursementsByUsername.mockReturnValueOnce(
      Promise.resolve({
        Items: [
          { status: 'pending', amount: '50', submitter: 'employee1', desription: 'description' },
        ],
      })
    );
    const tickets = await retrieveReimbursements({ role: 'employee' });
    expect(tickets).toMatchObject([
      { status: 'pending', amount: '50', submitter: 'employee1', desription: 'description' },
    ]);
  });

  test('wrong role', async () => {
    await expect(retrieveReimbursements({ role: 'admin' })).toMatchObject({});
  });
});

describe('authorization tests', () => {
  test('no JWT provided', async () => {
    await expect(authorizeEmployeeOrFinanceManager(null)).rejects.toThrow(JsonWebTokenError);
  });

  test('role is not employee or finance manager', async () => {
    verifyTokenAndReturnPayload.mockReturnValueOnce(Promise.resolve({ role: 'admin' }));
    await expect(authorizeEmployeeOrFinanceManager('Bearer token123')).rejects.toThrow(
      AuthorizationError
    );
  });

  test('employee role', async () => {
    verifyTokenAndReturnPayload.mockReturnValueOnce(Promise.resolve({ role: 'employee' }));

    const payload = await authorizeEmployeeOrFinanceManager('Bearer token123');
    expect(payload).toMatchObject({ role: 'employee' });
  });

  test('finance manager role', async () => {
    verifyTokenAndReturnPayload.mockReturnValueOnce(Promise.resolve({ role: 'finance_manager' }));

    const payload = await authorizeEmployeeOrFinanceManager('Bearer token123');
    expect(payload).toMatchObject({ role: 'finance_manager' });
  });
});
