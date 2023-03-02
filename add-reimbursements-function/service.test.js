const AuthorizationError= require('./errors');
const ReimbursementError= require('./errors');
const { JsonWebTokenError } = require('jsonwebtoken');
// const {addReimbursement, authorizeEmployee} = require('./service');
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
})

describe ('Authorization tests', () => {
    test ('Token not provided', async() => {
        await expect(service.authorizeEmployee("")
).rejects.toThrow(JsonWebTokenError);

    });

//     test ('Employee role required', async() => {
//         await expect(service.authorizeEmployee("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbmFnZXIxIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjc2NzQwMTk3LCJleHAiOjE2Nzc2MDQxOTd9.iqn2YJm_CMzJugiHdg2mFLUlY2DaplmLLAR0ULSf7Qg")
// ).rejects.toThrow(AuthorizationError);

//     });

    
});
