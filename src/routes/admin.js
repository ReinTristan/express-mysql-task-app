const { Router } = require('express')
const router = Router()
const pool = require('../database')
const { isLogedInAdmin, isNotLogedIn } = require('../lib/auth')

router.post('/ban/:id', isLogedInAdmin, async (req, res) => {
    const userId = req.params.id
    const banned ={
        userId
    }
    await pool.query('INSERT INTO banned SET ?', [banned])
    req.flash('success', 'User banned successfully')
    res.redirect('/profile')
})
router.post('/unban/:id', isLogedInAdmin, async (req, res) => {
    const userId = req.params.id
    const result = await pool.query('DELETE FROM banned WHERE userId = ?', [userId])
    console.log(result)
    req.flash('success', 'User unbanned successfully')
    res.redirect('/profile')
})
module.exports = router