const jwt = require('jsonwebtoken');

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

module.exports = {
  verifyTokenAndReturnPayload
};