# Endpoints

## Register

Request
- HTTP Method
    - Post
- URL
    - /register
- Headers
    - Content-Type: application/json
- Body
    ```json
    {
        "username": "username1",
        "password": "password1!",
    }
    ```

Response Scenarios

1. Successful Registragion
- Status Code
    - 200 Successful
- Body
    ```json
    {
        "message": "User Successfully Registered"
    }
    ```
- Headers
    - Content-Type: application/json

2. Unsuccessful registration because username is too short
- Status Code
    - 400 Bad Request
- Body
    ```json
    {
        "errors": "Username must be between 8 and 20 (inclusive)"
    }
    ```
- Headers
    - Content-Type: application/json

3. Unsuccessful registration because password is too short
- Status Code
    - 400 Bad Request
- Body
    ```json
    {
        "errors": "Password must be between 8 and 20 (inclusive)"
    }
    ```
- Headers
    - Content-Type: application/json

4. Unsuccessful registration because password does not contain special character
- Status Code
    - 400 Bad Request
- Body
    ```json
    {
        "errors": "Password must contain a special character"
    }
    ```
- Headers
    - Content-Type: application/json

5. Unsuccessful registration no input for username
- Status Code
    - 500 Internal Server Error
- Body
    ```json
    {
        "errors": "Username and/or password not provided"
    }
    ```
- Headers
    - Content-Type: application/json

6. Unsuccessful registration no input for password
- Status Code
    - 500 Internal Server Error
- Body
    ```json
    {
        "errors": "Username and/or password not provided"
    }
    ```
- Headers
    - Content-Type: application/json

7. Unsuccessful registration due to unknown error
- Status Code
    - 500 Internal Server Error
- Body
    ```json
    {
        "errors": [err.message]
    }
    ```
- Headers
    - Content-Type: application/json

Exports.Handler

```javascript
    exports.handler = async (event) => {
    try{
        const parsedBody = JSON.parse(event.body);
        const username = parsedBody.username;
        const password = parsedBody.password;

        if (!username || !password) {
            throw new Error('Username and/or password not provided');
        }

        await register(username, password);

        return {
            statusCode: 200,
            body: JSON.stringify({
                "message": "User successfully registered"
            })
        };
    } catch(err){
        if (err instanceof RegistrationError) {
            return {
              statusCode: 400,
              body: JSON.stringify({
                "errors": [ err.message ]
              })
            }
        }

        return{
          statusCode: 500,
          body: JSON.stringify({
            "errors": [err.message]
          })
        }
      }
}
```

- Description
    - Takes in two prameters from the body that is parsed and checks for that the inputs are not empty and then passes them onto the register function. Then depending on the return it will provide a status code and message.

- Parameters
    - Takes an input body and breaks into a username and password variable.

- What the function returns
    - It will return one of the response scenarios above, with a 200 successful response, a 400 error response, or a 500 error response.

Register Function

```javascript
    async function register(username, password) {
    const pattern = /[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/g;
    const errorMessages = [];
    // Check if username meets validation requirements
    if (!(username.length >= 8 && username.length <= 20)) {
      errorMessages.push('Username must be between 8 and 20 (inclusive)');
    }
    // Check if password meets validation requirements
    if (!(password.length >= 8 && password.length <= 20)) {
      errorMessages.push('Password must be between 8 and 20 (inclusive)');
    }
    // check if password contains special character
    if (!(pattern.test(password))){
      errorMessages.push('Password must contain a special character');
    }
    // Check if username is already taken
    const data = await retrieveUserByUsername(username);
    if (data.Item) {
      errorMessages.push('Username is already taken');
    }
    if (errorMessages.length > 0) {
      throw new RegistrationError(errorMessages);
    }
    // Add user to DB
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await addUser({
      "username": username,
      "password": hash,
      "role": "employee"
    });
}
```

- Description
	- Takes in two parameters username and password, and proceeds to check the inputs against multiple conditions. If our username and password meet all the requirements, then we encrypt the password using bcrypt. Then for the addUser function we create an object to pass as a parameter containing username, the encrypted password, and a default role of ‘employee’ which adds that information to the database.

- Parameters
	- username: The first input the user provides.
	- password: The second input the user provides.

- What the function Returns 
	- The function will throw an error message that is a list of all the requirements either the username or password had failed. This function will not return anything if the user is added successfully.