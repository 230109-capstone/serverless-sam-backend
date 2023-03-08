const uuid = require('uuid');
const { fromBuffer } = require('file-type-cjs');

const reimbDao = require('./dao');
const s3Dao = require('./dao');

const ReimbursementError = require('./errors');

const jwtUtil = require('./utility');

const AuthorizationError = require('./errors');
const { JsonWebTokenError } = require('jsonwebtoken');

async function addReimbursement(reimbursement) {
    const errors = [];
    // Make sure reimbursement amount > 0
    if (reimbursement.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }
  
    if (reimbursement.description.trim().length === 0) {
      errors.push("Description must be provided");
    }
  
    const base64String = reimbursement.image;
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const { ext } = await fromBuffer(imageBuffer);
  
    if (ext !== 'png' && ext !== 'jpg') {
      errors.push('Only png and jpeg images are supported');
    }
  
    if (errors.length > 0) {
      throw new ReimbursementError(errors);
    }
  
    const reimbId = uuid.v4();
    await reimbDao.addReimbursement(reimbId, reimbursement.amount, reimbursement.description, "pending", "username2");
    await s3Dao.addReimbursementImage(reimbId, imageBuffer, ext)
  }

  async function authorizeEmployee(authorizationHeader) {
    if(!authorizationHeader) {
      throw new JsonWebTokenError("Token not provided");
    }
  
    const token = authorizationHeader.split(" ")[1];
    const payload = await jwtUtil.verifyTokenAndReturnPayload(token);
  
    if (payload.role !== 'employee') {
      throw new AuthorizationError(["Employee role required"]);
    }
  
    return payload;
  }

module.exports = {
    authorizeEmployee,
    addReimbursement
}