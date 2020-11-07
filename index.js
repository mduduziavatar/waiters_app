const express = require('express');
const WaitersFactory = require('./waiters');
const Routes = require('./routes');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
// app flash setups 
const flash = require('express-flash');
const session = require('express-session')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

const pg = require('pg');
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://mdu:pg123@localhost:5432/registration_numbers';
const pool = new Pool({
    connectionString
});
const routes = Routes(WaitersFactory)

// console.log(pool);
const waiters = WaitersFactory(pool);
app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', routes.index);

app.post('/sendUsers', function(req, res) {
    console.log(req.body)
    res.redirect('/')
});

app.get('/waiters', function(req, res) {
    res.render('waiters')
});

app.get('/waiters:name', function(req, res) {
    res.redirect('/')
});

const PORT = process.env.PORT || 3008;

app.listen(PORT, function() {
    console.log('App starting on port', PORT);
});