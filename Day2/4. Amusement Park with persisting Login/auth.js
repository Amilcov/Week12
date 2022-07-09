const db = require('./db/models');


const loginUser = (req, res, user) => {
    req.session.auth = { userId: user.id};
    console.log('__loginUser', req.session);
};


const restoreUser = async(req, res, next) => {
        console.log(req.session);
    
    if (req.session.auth) {
        const userId = req.session.auth.userId;

        try {
            const user = await db.User.findByPk(userId);
             
            if(user) {
                 res.locals.authenticated = true;
                 res.locals.user = user;
                 next();
            } else {
                res.locals.authenticated = false;
                next();
            }
        
        } catch(err) {
                res.locals.authenticated = false;
                next();
        }
                
    } else {
        res.locals.authenticated = false;
        next();
    }

};


const authenticateUser = async(req, res, next) => {
    
      if(res.local.authenticated) {
        userId = res.locals.userId;
        const user = await db.User.findByPk();

        if (user.id === userId) {
           next(); 
        } else {
          res.local.authenticated = false;
        };

      };
};

const logoutUser = (req, res) => {
    delete req.session.auth;
}

module.exports = {
    loginUser,
    restoreUser,
    authenticateUser,
    logoutUser
}