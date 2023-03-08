const {login} = require('./login-service')
const {createToken} = require('./login-util')
const {retrieveUserByUsername} = require('./login-dao')
const LoginError = require('./login-errors');



//login tests
jest.mock('./login-dao',function(){
    return{
        retrieveUserByUsername: jest.fn(),
    }
})

jest.mock('./login-util', function(){
    return{
        createToken: jest.fn()
    }
})

describe('testing login function', () =>{
    test("login should throw error if user object does not exist", async ()=> {
        retrieveUserByUsername.mockReturnValueOnce(Promise.resolve({undefined}))
        
      
       await expect(login("username", "password")).rejects.toThrow(LoginError)
    })

    test("login should throw error if bcrypt function returns false", async ()=> {
        retrieveUserByUsername.mockReturnValueOnce(Promise.resolve({Item:{username: "username", password: "password", role: "employee"}}))
        
       await expect(login("username", "password")).rejects.toThrow(LoginError)
    })

    test("successful login should return token", async () => {
        retrieveUserByUsername.mockReturnValueOnce(Promise.resolve({Item:{username: "username", password: "$2a$05$Mjs/9Lfif0XRQfdVTVnux.nktvJ036s.QwBYa8eV2DH5G0kkIlTyi", role: "employee"}}))
        
        await login("username", "password")
        
        
        expect(createToken).toHaveBeenCalledWith("username", "employee")
    })

})


