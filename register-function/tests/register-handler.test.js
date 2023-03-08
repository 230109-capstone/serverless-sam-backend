const { register } = require('../register-handler-service');
const { addUser, retrieveUserByUsername } = require('../register-handler-dao');
const RegistrationError = require('../errors/registration-error');
const bcrypt = require('bcryptjs');

jest.mock('../register-handler-dao', function () {
    return {
        addUser: jest.fn(),
        retrieveUserByUsername: jest.fn(),
    };
});

describe('Registration Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Username Provided is not proper length', async() => {
        retrieveUserByUsername.mockReturnValueOnce(
            Promise.resolve({})
        );
        await expect(register('iam', 'thisissufficient!')).rejects.toThrow(RegistrationError);
    });

    test('Password Provided is not proper length', async() => {
        retrieveUserByUsername.mockReturnValueOnce(
            Promise.resolve({})
        );
        await expect(register('iam8characters', 'this')).rejects.toThrow(RegistrationError);
    });

    test('Password does not contain special character', async() => {
        retrieveUserByUsername.mockReturnValueOnce(
            Promise.resolve({})
        );
        await expect(register('iam8characters', 'thisissufficient')).rejects.toThrow(RegistrationError);
    });

    test('Username exists', async() => {
        retrieveUserByUsername.mockReturnValueOnce(
            Promise.resolve({
                Item: {
                    username: 'iam8characters',
                    password: 'thisissufficient!',
                }
            })
        );
        await expect(register('iam8characters', 'thisissufficient!')).rejects.toThrow(RegistrationError);
    });

    test('bcrypt should hash and compare passwords', async () => {
        const password = 'myPassword!';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
      
        expect(hashedPassword).toBeDefined();
        expect(hashedPassword.length).toBeGreaterThan(0);
      
        const isValidPassword = await bcrypt.compare(password, hashedPassword);
      
        expect(isValidPassword).toBe(true);
      });

    test('Successful Registration', async() => {
        retrieveUserByUsername.mockReturnValueOnce(
            Promise.resolve({})
        );
        const username = 'validusername';
        const password = 'Validpassword1!';


        await register(username, password);

    
        expect(addUser).toHaveBeenCalledWith({
            username,
            password: expect.any(String),
            role: 'employee'
        });
    });
});