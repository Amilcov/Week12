const  db = require('./db/models');

const loginUser = (req, res, user) => {
    req.session.auth = {userId: user.id};
};

const restoreUser =  async (req, res, next) => {
    console.log(req.session);

    if (req.session.auth) {

        const { userId } = req.session.auth;
        //const userId = req.session.auth.userId;
        try {
            const user = await db.User.findByPk(userId);
          
            if (user) {
                res.locals.authenticated = true;
                res.locals.user = user;
                next();
            };
        } catch (err) {
            res.locals.authenticated = false;
            next();
        };
        
    } else {
        res.locals.authenticated = false;
        next();
    };

};

const requireAuth = (req, res, next) => {
     if (!res.locals.authenticated) {
        return res.redirect('/user/login');
     };  
     return next();
};



const logoutUser = (req, res) => {
     delete req.session.auth;
};



module.exports = { loginUser, 
                   restoreUser,
                   requireAuth,
                   logoutUser                 
};
