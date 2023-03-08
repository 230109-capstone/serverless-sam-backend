# Startup
## Accessing API Gateway
- Link to 
    [API Gateway](http://bdx5a9kkg3.execute-api.us-east-1.amazonaws.com/Prod/)
## Data Access Layer
- Users Table Functions
1. retrieveUserByUsername

    ```javascript
    function retrieveUserByUsername(username) {
    return documentClient.get({
      TableName: table,
      Key: {
        username: username
      }
    }).promise();
    }
    ```
- Description
    - Takes in a username parameter and uses documentClient to specify tablename and which key to use when searching the database for an existing username.
- Parameters
    - username: string input passed down by handlers.
- What the function returns
    - Returns the results of the get with the input, if it is successful it returns information relating to that username, if not it returns an empty object.

2. addUsers

    ```javascript
    function addUser(userObj) {
    return documentClient.put({
      TableName: table,
      Item: userObj
    }).promise();
    }
    ```
- Description
    - Takes in userObj object that is passed in by register function. Then uses documentClient to put that new information in the table specifying the tablename and the object.
- Parameters
    - userObj: userObj is {'username': username, 'password' password, 'role': 'employee'} to pass in all the necessary info about a new user to the table.
- What the function returns
    - This function does not return any information just if the put was successful or not.