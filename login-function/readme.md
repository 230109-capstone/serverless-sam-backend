# Endpoints
## Login
***
### Request
* HTTP Mehtod
    * Post
* URL
    * /login
* Headers
    * Content-Type: application/json
* Body
```JSON
"username": "username1",
"password": "password1"
```
***
### Response Scenarios
1. Succuessful Login
* Status code
    * 200 Successful
* Body
```JSON
"message": "Login successful",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxMjM0Iiwicm9sZSI6ImVtcGxveWVlIiwiaWF0IjoxNjc4MzAzMjgyfQ.WAyc1nOM_-wrm3AXvXEbU0OqUamStxHzQXwjqEtgWBo"
```
* Headers
    * Content-Type: application/json

2. Unsuccessful login due to an invalid username
* Status code
    * 400 Bad Request
* Body
```JSON
"message": "Invalid username"
```
* Headers
    * Content-Type: application/json

3. Unsuccessful login due to an invalid password
* Status code
    * 400 Bad Request

* Body
```JSON
"message": "Invalid password"
```
* Headers
    * Content-Type: application/json
4. Unsuccessful login due to no input for username and/or password
* Status code
    * 500 Internal Server Error

* Body
```JSON
"errors": "Username and/or password not provided"
```
* Headers
    * Content-Type: application/json

5. Unsuccessful login due to unknown error
input for username and/or password
* Status code
    * 500 Internal Server Error

* Body
```JSON
"errors": [err.message]
```
* Headers
    * Content-Type: application/json
*** 
### Exports.handler
```JavaScript
exports.handler = async (event) => {

  try {
    const parsedBody = JSON.parse(event.body);
    const username = parsedBody.username;
    const password = parsedBody.password;

    if (!username || !password) {
      throw new Error('Username and/or password not provided');
    }

    const token = await login(username, password);

    return ({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-headers": "Content-Type", 
    },
      body: JSON.stringify({
        "message": "Login successful",
        "token": token
      }),
    });
  } catch (err) {
    if (err instanceof LoginError) {
      return ({
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST",
          "Access-Control-Allow-headers": "Content-Type", 
      },
        body: JSON.stringify({
          "errors": [err.message]
        })
      })
    }

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-headers": "Content-Type", 
    },
      body: JSON.stringify({
        "errors": [err.message]
      })
    }
  }

}
```
* Description
    * Takes in two parameters from the body that is parsed and checks that the inputs are not empty and then passes them onto the login function. Then depending on the return it will provide a status code and message.
* Parameters
    * Takes an input body and breaks into a username and password variable.
* What the function returns
    * It will return one of the response scenarios above, with a 200 successful response, a 400 error response, or a 500 error response.
*** 
### Login Function
```JavaScript
async function login(username, password) {
    const data = await retrieveUserByUsername(username);
  
    const errors = [];
    if (!data.Item) {
      errors.push("Invalid username");
    } else if (!(await bcrypt.compare(password, data.Item.password))) {
      errors.push("Invalid password");
    }
  
    if (errors.length > 0) {
      throw new LoginError(errors);
    }
  
    return createToken(data.Item.username, data.Item.role);
}
```
* Description
    * Takes in two parameters, username and password. Then proceeds to call the retrieveUserByUsername dao-layer function, passing in the username input as it's paramter, to retrieve the user object from the database. If the user object exists, then the login function will call the "bcrypt.compare" function to compare the input password against the bcrypted password from the user object. If the passwords match, the login function will then call the createToken utility function, passing in the user object items username and role as parameters. Finally, it will return the token it just created.
* Parameters
    * username: The first input the user provides.
    * password: The second input the user provides.
* What the function returns
    * Successful: 
        * The Login function will return the JWT token it created and a "successful login" message.
    * Unsuccessful:
        * The function will throw an error message that is a list of all the requirements either the username or password is invalid.
