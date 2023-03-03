const {login} = require('./login-service')
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
