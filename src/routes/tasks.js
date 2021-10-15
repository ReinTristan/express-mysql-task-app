const { Router } = require('express')
const router = Router()
const pool = require('../database') 
const { isLogedIn, isBanned } = require('../lib/auth')

router.get('/', isLogedIn, isBanned, async (req, res) => {
    const tasks = await pool.query('SELECT * FROM task WHERE userId = ? ', [req.user.id])

    res.render('tasks/list', {
        tasks
    })
})

router.get('/add', isLogedIn, isBanned, (req, res) => {
    res.render('tasks/add')
})
router.post('/add', isLogedIn, isBanned, async (req, res) => {
    const { task, beforeHour, description, priority} = req.body
    const newTask = {
        task,
        beforeHour,
        description,
        priority,
        userId: req.user.id
    }
    await pool.query('INSERT INTO task SET ?', [newTask])
    req.flash('success', 'Task saved successfully')
    res.redirect('/tasks')
})

router.get('/delete/:id', isLogedIn, isBanned, async (req, res) => {
    const { id } = req.params
    await pool.query('DELETE FROM task WHERE id = ?', [id])
    req.flash('success', 'Task deleted successfully')
    res.redirect('/tasks')
})
router.get('/edit/:id', isLogedIn, isBanned, async (req, res) => {
    const { id } = req.params
    const tasks = await pool.query('SELECT * FROM task WHERE id = ?', [id])
    res.render('tasks/edit', {
        task:tasks[0]
    })
})
router.post('/edit/:id', isLogedIn, isBanned, async (req, res) => {
    const { id } = req.params
    const { task, description, beforeHour, priority } = req.body
    const newTask = {
        task,
        beforeHour,
        description,
        priority,
    }
    await pool.query('UPDATE task set ? WHERE id = ?', [newTask, id])
    req.flash('success', 'Task updated successfully')
    res.redirect('/tasks')
})

module.exports = router