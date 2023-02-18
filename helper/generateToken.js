const jwt = require('jsonwebtoken');

module.exports = function (data) {
    return jwt.sign(data, 'private', {expiresIn: '1h'});
}