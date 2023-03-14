const { AuthorizationError, ReimbursementError } = require('./errors');
const { JsonWebTokenError } = require('jsonwebtoken');
const service = require('./service');
const {addReimbursement, addReimbursementImage} = require('./dao');



jest.mock('./dao.js', function () {
    return {
        addReimbursement: jest.fn(),
        addReimbursementImage: jest.fn()
    }
});

describe ('Add Reimbursements tests', () => {
    test ('Amount greater than 0', async() => {
        await expect(service.addReimbursement( "Victor", {"amount": 0, "description": "Food", "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQg"})
).rejects.toThrow(ReimbursementError);

    });

    test ('Desciption must be provided', async() => {
        await expect(service.addReimbursement( "Victor", {"amount": 100, "description": "", "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQg"})
).rejects.toThrow(ReimbursementError);

    });

    test ('Only png and jpeg images are supported', async() => {
        await expect(service.addReimbursement( "Victor", {"amount": 100, "description": "Food", "image": "data:image/webp;base64,UklGRuQaAABXRUJQVlA4WAoAAAASAAAA2wEAFwEAQU5JTQYAAAD"})
).rejects.toThrow(ReimbursementError);

    });

    test('Successfully add reimbursement', async() => {
        await expect(service.addReimbursement( "Victor", {"amount": 100, "description": "Food", "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYAB"}))
    });

})

describe ('Authorization tests', () => {
    test ('Token not provided', async() => {
        await expect(service.authorizeEmployee("")
).rejects.toThrow(JsonWebTokenError);

    });

     test ('Employee role required', async() => {
         await expect(service.authorizeEmployee("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWludXNlciIsInJvbGUiOiJmaW5hbmNlX21hbmFnZXIiLCJpYXQiOjE2Nzg3MzcxNjl9.FGQkVkKebOzRpLxFmR0ZADYa-Z_Fa6P3-B4dAyL_gvY")
 ).rejects.toThrow(AuthorizationError);

     });

     test('Successfully provided token with employee role', async() => {
        await expect(service.authorizeEmployee( "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ld1VzZXIxIiwicm9sZSI6ImVtcGxveWVlIiwiaWF0IjoxNjc4NzE5NDI5fQ.FHlfE71w7dcPbaZClrCt91hfXsdYhaJ4_EEwUMdJYb8" ))
    });
});
