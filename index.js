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

app.post('/waiters/:username', async function(req, res) {
    const name = req.body.nameEntered;
    const days = req.body.checkBox
    if (name) {
        await waiters.addNameToDatabase(name)
    }
    await waiters.addWeekDay(name, days)
    console.log(days)
        // console.log(name)
        // else {
        //     function validate(value, result) {
        //         if (!value) {
        //             return result;
        //         }
        //         return {};
        //     }
        //     const customersNameInvalid = validate(name, {
        //         style: "is-invalid",
        //         message: "Enter a valid name e.g Siphiwe"
        //     });

    // }
    res.render('index', {

    })
});

// app.get('/waiters/:username', async function(req, res) {
//     // let days = req.body.checkBox;
//     // var name = req.body.name;

//     // await waiters.create(items)

//     // // for (var dayOfWeek in req.body.checkBox) {
//     // //     if (req.body.checkBox) {

//     // //         dayOfTheWeek = JSON.stringify(items).replace(/]|[[]|"/g, '', )

//     // //         console.log(dayOfTheWeek)
//     // //     }
//     // // }

//     res.render('index', {
//         // name: await waiters.addNameToDatabase(name)

//     })
// });

// app.post('/waiters/:username', function(req, res) {
//     res.render('index')
// });

app.get('/data', async function(req, res) {
    let name = req.params.name;
    const names = await waiters.getAllUsers(name)

    res.render('data', {
        staffname: names
    });
});

app.get('/days', function(req, res) {
    res.render('days')
})

app.get('/waiters/:username', async function(req, res) {
    let names = req.params.staffname;
    // console.log(id)

    // let name = await waiters.get(id);

    // const names = await waiters.getAllUsers(name)
    // var person = await waiters.perPerson(names)
    // console.log(person)

    res.render('index', {

    })
});

const PORT = process.env.PORT || 3008;

app.listen(PORT, function() {
    console.log('App starting on port', PORT);
});