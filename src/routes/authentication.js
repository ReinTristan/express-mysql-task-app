const { Router } = require('express')
const router = Router()
const passport = require('passport')
const pool = require('../database')
const { isLogedIn, isNotLogedIn } = require('../lib/auth')
router.get('/signup', isNotLogedIn, (req, res) => {
    res.render('auth/signup')
})
router.post('/signup', passport.authenticate('local-signup', { 
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}))

router.get('/signin', isNotLogedIn, (req, res) => {
    res.render('auth/signin')
})
router.post('/signin', (req, res, next) => {
    passport.authenticate('local-signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next)
})
router.get('/profile' , isLogedIn, async (req, res) => {
    const user = req.user
    if(user.type === "admin") {
        const users = await pool.query('SELECT * FROM users')
        for(let i = 0; i < users.length; i++) {
            const banned = await pool.query('SELECT * FROM banned WHERE userId = ?', [users[i].id])
            console.log(banned)
            if(banned.length > 0) {
                users[i].isBanned = true
            }
        }
        console.log(users[1])
        res.render('profileAdmin',{
            users,
        })
    } else {
        console.log(user)
        res.render('profile')
    }
    
})
router.get('/logout', isLogedIn, (req, res) => {
    req.logOut()
    res.redirect('/signin')
})
module.exports = router