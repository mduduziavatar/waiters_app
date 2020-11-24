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

app.post('/waiters', async function(req, res) {
    const name = req.body.nameEntered;
    await waiters.addNameToDatabase(name);

    const string = "/waiters/" + name
    res.redirect(string)
        // res.render('waiters', {
        //     name: name
        // });
});



app.get('/waiters/:name', async function(req, res) {
    let name = req.params.name;
    var item = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

    console.log(name);
    const days = req.body.checkBox
        // const all = await waiters.getAllUsers(name)

    let staffId = await waiters.ids(item)
    console.log(staffId);

    // console.log(staffId);
    // all = all.map(function(allName) {
    //     allName = allName.id === staffId.staff_id
    //     return allName
    // })
    res.render('waiters');
});

// app.get('/waiters/', async function(req, res) {
//     let days = req.body.checkBox;
//     var name = req.body.name;
//     const each = await waiters.addNameToDatabase(name)
//     const all = waiters.getAllUsers(each)
//     console.log(all)

//     // // for (var dayOfWeek in req.body.checkBox) {
//     // //     if (req.body.checkBox) {

//     // //         dayOfTheWeek = JSON.stringify(items).replace(/]|[[]|"/g, '', )

//     // //         console.log(dayOfTheWeek)
//     // //     }
//     // // }

//     res.render('data', {
//         // name: 

//     })
// });

// // app.post('/waiters/:username', function(req, res) {
// //     res.render('index')
// // });

app.get('/days', function(req, res) {
    res.render('days')
})

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