const {
    approveDenyReimbursements, 
    retrieveReimbursementById, 
    updateReimbursementStatus,
    verifyTokenAndReturnPayload,
    authorizeFinanceManager,
} = require('../index')
const { AuthorizationError, ReimbursementError } = require('../errors')

jest.mock('../index', function() {
    return {
        retrieveReimbursementById: jest.fn(),
        approveDenyReimbursements: jest.fn(),
        authorizeFinanceManager: jest.fn(),
    }
})

describe('Approve/Deny reimbursement tests', () => {
    test('Reimbursement must exist', async () => {
        retrieveReimbursementById.mockReturnValueOnce(Promise.resolve("Victor", {"amount": 0, "description": "Food", "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQg"}))
    })
    test('Only finance_managers approve/deny reimbursements', async () => {
        expect(authorizeFinanceManager.mockReturnValueOnce(Promise.resolve("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWludXNlciIsInJvbGUiOiJmaW5hbmNlX21hbmFnZXIiLCJpYXQiOjE2Nzg3MzcxNjl9.FGQkVkKebOzRpLxFmR0ZADYa-Z_Fa6P3-B4dAyL_gvY")))
    })
    test('Employees cannot approve/deny reimbursements', async () => {
        expect(authorizeFinanceManager.mockReturnValueOnce(Promise.resolve("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ld1VzZXIxIiwicm9sZSI6ImVtcGxveWVlIiwiaWF0IjoxNjc4NzE5NDI5fQ.FHlfE71w7dcPbaZClrCt91hfXsdYhaJ4_EEwUMdJYb8")))
    })
})