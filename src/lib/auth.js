module.exports = {
    isLogedIn(req, res, next) {
        if(req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/signin')
        }
    },
    isNotLogedIn(req, res, next) {
        if(!req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/profile')
        }
    },
    isLogedInAdmin(req, res, next) {
        if(req.isAuthenticated() && req.user.type === "admin") {
            return next()
        } else {
            res.redirect('/signin')
        }
    },
    isBanned(req, res, next) {
        if(req.user.isBanned) {
            res.redirect('/profile')
        } else {
            return next()
        }
    }
}