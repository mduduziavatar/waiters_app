'use strict';

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
const connectionString = process.env.DATABASE_URL || 'postgresql://mdu:pg123@localhost:5432/waiters';
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

app.post('/', async function(req, res) {
    const name = req.body.nameEntered;
    const adding = await waiters.addNameToDatabase(name)
        // console.log(adding);

    const string = "/waiters/" + name
    res.redirect(string)
});

app.get('/waiters/:name', async function(req, res) {
    let name = req.params.name;
    // const days = req.body.day
    var item = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

    const nameEntered = await waiters.ids(item)
        // console.log(nameEntered);

    // console.log(item);
    // console.log(nameEntered);

    const allDays = await waiters.get(name)
        // await waiters.addData(allDays, name)

    res.render('waiters', {
        name: name,
        allDays
    });
});

app.post('/waiters/:name', async function(req, res) {
    const days = req.body.day
    let name = req.params.name;
    const allDays = await waiters.get(name)
        //console.log(name);
    await waiters.ids(name)
    var item = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    await waiters.addData(name, days)
    res.render('index', {
        // name: name,
        // allDays
    });
});

app.get('/days', async function(req, res) {
    const weekly = await waiters.admin()
        // console.log(weekly);
    res.render('days', {
        list: weekly

    })
});



// app.get('/waiters/:username', async function(req, res) {
//     let names = req.params.staffname;
//     // console.log(id)

//     // let name = await waiters.get(id);

//     // const names = await waiters.getAllUsers(name)
//     // var person = await waiters.perPerson(names)
//     // console.log(person)

//     res.render('index', {

//     })
// });

const PORT = process.env.PORT || 5700;

app.listen(PORT, function() {
    console.log('App starting on port', PORT);
});