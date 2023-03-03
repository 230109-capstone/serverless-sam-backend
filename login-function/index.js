const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {retrieveUserByUsername} = require('./login-dao');
const LoginError = require('./login-errors')


exports.handler = async (event) => {
   
    try {
        const username = event.body.username;
        const password = event.body.password;

    
        if (!username || !password) {
          throw new Error('Username and/or password not provided');
        }
    
        const token = await login(username, password);
    
        return res.send({
          "message": "Login successful",
          "token": token
        });
      } catch(err) {
        if (err instanceof LoginError) {
          return res.status(400).send({
            "errors": err.errors
          })
        }
    
        return res.status(500).send({
          "errors": [ err.message ]
        });
      }
   

}

function createToken(username, role) {
  return jwt.sign({
    username: username,
    role: role
  }, process.env.JWT_SIGNING_SECRET)
}

async function login(username, password) {
    const data = await userDao.retrieveUserByUsername(username);
  
    const errors = [];
    if (!data.Item) {
      errors.push("Invalid username");
    } else if (!(await bcrypt.compare(password, data.Item.password))) {
      errors.push("Invalid password");
    }
  
    if (errors.length > 0) {
      throw new LoginError(errors);
    }
  
    return jwtUtil.createToken(data.Item.username, data.Item.role);
  }





module.exports= {retrieveUserByUsername,login}