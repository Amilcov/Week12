const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const db = require('../db/models');
const { secret, expiresIn } = require('../config').jwtConfig;


const getUserToken = (user) => {

    const userDataForToken = {
        id: user.id,
        email: user.email
    };

    const token = jwt.sign(
        {data: userDataForToken},
        secret,
        {expiresIn: parseInt(expiresIn, 10)}
        );

    return token;
}

 const restoreUser = (req, res, next) => {
   
    const token = req.token;
    if (!token) res.set('WWW-Authenticate', 'Bearer').status(401).end();

     return jwt.verify(token, secret, null, async(err, jwtPayload) => {

        if (err) {
          const err = new Error('Unauthorized');
          err.tittle = 'Unauthorized';
          err.status = '401';
          return next(err);
        };

        const userId  = jwtPayload.data.id;
        try {
            req.user = await db.User.findByPk(userId);   
        } catch (e) {
            return next(e)
        }

        if(!req.user) return res.set('WWW-Authenticate', 'Bearer').status(401).end();

        return next();
    });

 }

const requireAuth = [bearerToken(), restoreUser];
module.exports = {
    getUserToken,
    requireAuth

};