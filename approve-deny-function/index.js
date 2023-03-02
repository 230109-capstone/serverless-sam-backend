const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const jwtUtil = require('./jwtUtil');

exports.handler = async (event, context) => {
    const path = event.pathParameters;
    const body = JSON.parse(event.body);

    try {
        await authorizeFinanceManager(event.headers.authorization);

        await approveDenyReimbursements(path.id, body.status);

        return {
            statusCode: 200,
            body: JSON.stringify({
                "message": "Reimbursement status updated"
            })
        };
    } catch(err) {
        if (err instanceof JsonWebTokenError) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                "errors": [ err.message ]
                })
            };
        }

        if (err instanceof ReimbursementError) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                "errors": err.errors
                })
            };
        }

        if (err instanceof AuthorizationError) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                "errors": err.errors
                })
            };
        }

        return {
            statusCode: 500,
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

async function approveDenyReimbursements(id, status) {
    const data = await retrieveReimbursementById(id);

    const errors = [];
    if (!data.Item) {
        errors.push(`Reimbursement with id ${id} does not exist`);
    } else if (data.Item.status !== 'pending') {
        errors.push(`Reimbursement must be pending in order to be approved or denied`);
    }

    if (!(status === 'approved' || status === 'denied')) {
        errors.push('Updated status must be either approved or denied');
    }

    if (errors.length > 0) {
        throw new ReimbursementError(errors);
    }

    await updateReimbursementStatus(id, status);
}



// Database Query for current reimbursement by ID
function retrieveReimbursementById(id) {
    return documentClient.get({
        TableName: 'reimbursements',
        Key: {
            id: id
        }
    }).promise();
}

// Database Update for reimbursement
function updateReimbursementStatus(id, status) {
    return documentClient.update({
        TableName: 'reimbursements',
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
