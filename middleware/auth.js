const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    let accessToken = req.headers['authorization']?.split(' ')[1]; // remove he word "Bearer" from token string (if exist).
    const refreshToken = req.headers['refresh']?.split(' ')[1]; // remove he word "Bearer" from token string (if exist).

    if (!accessToken) {
        return res.status(401).send({success:false, message:'Access Denied. No access token provided.'});
    }

    if (!refreshToken) {
        return res.status(401).send({success:false, message:'Access Denied. No refresh token provided.'});
    }

    try {
        let decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY);
        next();
    }
    catch (error) {
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
            accessToken = jwt.sign({ user: decoded }, process.env.JWT_ACCESS_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_TIME});
            res.setHeader('x-access-token', accessToken);
            req.user = decoded;
            next();
        }
        catch (e) {
            return res.status(400).send({success:false, message:'Invalid Token.'});
        }
    }
};

module.exports = authenticate;
