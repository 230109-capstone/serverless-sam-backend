# API Documentation for Add Reimbursements Function

# Startup

## DynamoDB Schema
Table
* process.env.REIMBURSEMENTS_TABLE_NAME
    * Primary Key
        * id (partition key) (S)
    * Attributes
        * amount (N)
        * description (S)
        * status: pending (S)
        
    * Global Secondary Indices
        * submitter-index
            * submitter (partition key) (S)

S3 Bucket
* process.env.RECEIPTS_BUCKET_NAME
   * reimbId
   * imageBuffer
   * extension


# Endpoints
* POST /reimbursements

* Request Body
{
   
    "amount" : 150,
    "desc" : "Dinner",
    "image" : " "
}
* Headers
 - Authorization: Bearer "token"
We need to include the JWT as part of the Authorization header so that we can authorize access to add a reimbursement ticket
 - Content-Type: application/json

## Response Scenarios

## Successfully added reimbursement ticket
* Status Code - 200 OK
* Body
{
    "message": "Successfully submitted Ticket"
}
* Headers - Content-Type: application/json

## Amount is not provided
* Status Code - 400 Bad Request
* Body
{
    "message": "Amount must be greater than 0"
}
* Headers - Content-Type: application/json

## Description is not provided
* Status Code - 400 Bad Request
* Body
{
    "message": "Description must be provided"
}
* Headers - Content-Type: application/json

## Invalid image file format
* Status Code - 400 Bad Request
* Body
{
    "message": "Only png and jpeg images are supported"
}
* Headers - Content-Type: application/json

## Token where role does not equal employee
* Status Code - 401 Unauthorized
* Body
{
    "message": "Employee role not required"
}
* Headers - Content-Type: application/json

## Authorization header is not provided
* Status Code - 400 Bad Request
* Body
{
    "message": "Token not provided"
}
* Headers - Content-Type: application/json



* aws configure
 - AWS_ACCESS_KEY_ID=...
 - AWS_SECRET_ACCESS_KEY=...

## Run Application
1. Locally
 - sam build
 - sam local start -api

2. Globally
 - sam build
 - sam deploy  


