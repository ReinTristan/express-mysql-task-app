const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const pool = require('../database')
const helpers = require('./helpers')


passport.use('local-signin', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: 'true'
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    if(rows.length > 0) {
        const user = rows[0]
        const validPassword = await helpers.matchPassword(password, user.password)
        if(validPassword) {
            
            done(null, user, req.flash('success',`welcome ${user.username}`))
        } else {
            done(null, false , req.flash('message', 'Incorrect password'))
        }
    } else {
        done(null, false, req.flash('message','User not found'))
    }
}))


passport.use('local-signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: 'true'
}, async (req, username, password, done) => {
    const { fullname } = req.body
    const newUser = {
        username,
        password,
        fullname,

    }
    newUser.password = await helpers.encryptPassword(password)
    const result = await pool.query('INSERT INTO users SET ?' , [newUser])
    newUser.id = result.insertId
    return done(null, newUser )
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
    const user = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    const bannedCheck = await pool.query('SELECT * FROM banned WHERE userId = ?', [id])
            let banned = false
            if(bannedCheck.length > 0) {
                banned = true
            } 
            // req.app.locals.banned = banned
            user[0].isBanned = banned
    done(null, user[0])
})