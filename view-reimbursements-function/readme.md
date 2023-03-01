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


    