const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const mysqlStore = require('express-mysql-session')
const { database, secretDb } = require('./keys')
const passport = require('passport')
//initialization
const app = express()
require('./lib/passport')
//settings
app.set('port', process.env.PORT || 5000)
app.set('views', path.join(__dirname, 'views'))
app.engine(
	'.hbs',
	exphbs({
		defaultLayout: 'main',
		layoutsDir: path.join(app.get('views'), 'layouts'),
		partialsDir: path.join(app.get('views'), 'partials'),
		extname: '.hbs',
		helpers: require('./lib/handlebars'),
	})
)
app.set('view engine', '.hbs')

//middlewares
app.use(
	session({
		secret: secretDb,
		resave: false,
		saveUninitialized: false,
		store: new mysqlStore(database),
	})
)
app.use(flash())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

//global variables
app.use((req, res, next) => {
	app.locals.success = req.flash('success')
	app.locals.message = req.flash('message')
	app.locals.user = req.user
	next()
})
//routes
app.use(require('./routes/routes'))
app.use(require('./routes/authentication'))
app.use('/tasks', require('./routes/tasks'))
app.use(require('./routes/admin'))

//public
app.use(express.static(path.join(__dirname, 'public')))
//start
app.listen(app.get('port'), () =>
	console.log(`Server running on port ${app.get('port')}`)
)
