## Endpoints

### View Reimbursement

Request

    - HTTP Method
        - GET
    - URL
        - /reimbursements
    - Headers  
        - Authorization: "Bearer someRandomToken123"
    - Body:
        - None

Response Scenarios

1. Successful view of reimbursements
    - Status Code
        - 200 OK
    - Headers
        - Content-Type: application/json
    - Body 
        ```json
            {
                "message": "Reimbursements successfully retrieved",
                "data": {
                    "id": "someId",
                    "amount": "someAmount",
                    "description": "someDescription",
                    "status": "someStatue",
                    "submitter": "someSubmitter"
                },
            }
        ```
2. No JWT provided
    - Status Code
        - 401 Unauthorized
    - Headers
        - Content-Type: application/json
    - Body
        ```json
        {
            "errors": "Json Erorr message"
        }
        ```

3. Invalid role
    - Status Code
        - 401 Unauthorized
    - Headers
        - Content-Type: application/json
    - Body
        ```json
        {
            "errors": "Authorization Error"
        }
        ```

4. Internal Error
    - Status Code
        - 500 Internal Server Error
    - Headers
        - Content-Type: application/json
    - Body
        ```json
        {
            "errors": "Error message"
        }
        ```

Exports.Handler

```javascript
exports.handler = async (event) => {
  try {
    console.log(event.headers.Authorization);
    const payload = await authorizeEmployeeOrFinanceManager(event.headers.Authorization);
    const reimbursements = await retrieveReimbursements(payload);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
      },
      body: JSON.stringify({
        message: 'Reimbursements successfully retrieved',
        data: reimbursements,
      }),
    };
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, GET',
        },
        body: JSON.stringify({
          message: error.message,
        }),
      };
    }

    if (error instanceof AuthorizationError) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, GET',
        },
        body: JSON.stringify({
          message: error.message,
        }),
      };
    }

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
      },
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};
```

- Description
    - Checks for the Authorization token, depending on the role payload of JWT token the handler, the appropriate reimbursements are sent to the client

Authorize Employee or Finance Manager Function

```javascript
async function authorizeEmployeeOrFinanceManager(authorizationHeader) {
  if (!authorizationHeader) {
    throw new JsonWebTokenError('Token not provided');
  }

  const token = authorizationHeader.split(' ')[1];
  const payload = await verifyTokenAndReturnPayload(token);

  if (!(payload.role == 'employee' || payload.role == 'finance_manager')) {
    throw new AuthorizationError(['Employee or Finance manager role required']);
  }

  return payload;
}
```
- Description
    - Checks for the Authorization token and returns the payload for that token, if token does not exist throws an error
    
 Retrieve Reimbursements Function
 
 ```javascript
async function retrieveReimbursements(payload) {
  if (payload.role === 'finance_manager') {
    const data = await retrieveAllReimbursements();
    return data.Items;
  } else if (payload.role === 'employee') {
    const data = await retrieveAllReimbursementsByUsername(payload.username);
    return data.Items;
  }
}
```
- Description
    - Takes the payload as the parameter and checks the role attribute of the payload, depending on the role returns the appropriate reimbursements 
    
