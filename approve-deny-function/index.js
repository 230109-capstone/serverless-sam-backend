const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
const documentClient = new AWS.DynamoDB.DocumentClient();
const {ReimbursementError, AuthorizationError} = require('./errors');

exports.handler = async (event, context) => {
    const path = event.pathParameters;
    const body = JSON.parse(event.body);

    try {
        await authorizeFinanceManager(event.headers.Authorization);

        await approveDenyReimbursements(body);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, PATCH",
                "Access-Control-Allow-headers": "Content-Type, X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token", 
            },
            body: JSON.stringify({
                "message": "Reimbursement status updated"
            })
        };
    } catch(err) {
        if (err instanceof JsonWebTokenError) {
            return {
                statusCode: 401,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS, PATCH",
                    "Access-Control-Allow-headers": "Content-Type, X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token", 
                },
                body: JSON.stringify({
                "errors": [ err.message ]
                })
            };
        }

        if (err instanceof ReimbursementError) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS, PATCH",
                    "Access-Control-Allow-headers": "Content-Type, X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token", 
                },
                body: JSON.stringify({
                "errors": err.errors
                })
            };
        }

        if (err instanceof AuthorizationError) {
            return {
                statusCode: 401,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS, PATCH",
                    "Access-Control-Allow-headers": "Content-Type, X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token", 
                },
                body: JSON.stringify({
                "errors": err.errors
                })
            };
        }

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, PATCH",
                "Access-Control-Allow-headers": "Content-Type, X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token", 
            },
            body: JSON.stringify({
                "errors": [ err.message ]
            })
        };
    }
};


// Check if user is Authorized to make update
async function authorizeFinanceManager(authorizationHeader) {
    if(!authorizationHeader) {
        throw new JsonWebTokenError("Token not provided");
    }

    const token = authorizationHeader.split(" ")[1];
    const payload = await verifyTokenAndReturnPayload(token);

    if (payload.role !== 'finance_manager') {
        throw new AuthorizationError(["Finance manager role required"]);
    }

    return payload;
}

function verifyTokenAndReturnPayload(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SIGNING_SECRET, (err, data) => {
            if(err) {
            reject(err);
            } else {
            resolve(data);
            }
        })
    });
}

async function approveDenyReimbursements(reimbursement) {
    const data = await retrieveReimbursementById(reimbursement.id);

    const errors = [];
    if (!data.Item) {
        errors.push(`Reimbursement with id ${reimbursement.id} does not exist`);
    } else if (data.Item.status !== 'PENDING') {
        errors.push(`Reimbursement must be pending in order to be approved or denied`);
    }

    if (!(reimbursement.status === 'APPROVED' || reimbursement.status === 'DENIED')) {
        errors.push('Updated status must be either approved or denied');
    }

    if (errors.length > 0) {
        throw new ReimbursementError(errors);
    }

    await updateReimbursementStatus(reimbursement.id, reimbursement.status);
}



// Database Query for current reimbursement by ID
function retrieveReimbursementById(id) {
    return documentClient.get({
        TableName: process.env.REIMBURSEMENTS_TABLE_NAME,
        Key: {
            id: id
        }
    }).promise();
}

// Database Update for reimbursement
function updateReimbursementStatus(id, status) {
    return documentClient.update({
        TableName: process.env.REIMBURSEMENTS_TABLE_NAME,
        Key: {
            id: id
        },
        UpdateExpression: 'set #s = :val',
        ExpressionAttributeNames: {
            '#s': 'status'
        },
        ExpressionAttributeValues: {
            ':val': status
        }
    }).promise();
}
