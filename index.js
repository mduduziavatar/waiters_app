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

app.post('/sendUsers', async function(req, res) {
    const name = req.body.nameEntered;
    if (name) {
        await waiters.addNameToDatabase(name)
        console.log(name)

        res.redirect('waiters')
    } else {
        function validate(value, result) {
            if (!value) {
                return result;
            }
            return {};
        }
        const customersNameInvalid = validate(name, {
            style: "is-invalid",
            message: "Enter a valid name e.g Siphiwe"
        });
        res.render('index')
    }
});

app.post('/weekDays', async function(req, res) {
    for (var daysOfWeek in req.body.checkBox) {
        if (req.body.checkBox) {
            let items = req.body.checkBox;
            daysOfTheWeek = JSON.stringify(items).replace(/]|[[]|"/g, '', )
            console.log(items)
        }
    }
    // let weekDayObject = {
    //     staffname: staffname,
    //     daysOfWeek: daysOfWeek
    // }
    // var insertQuery = "INSERT INTO waiters (staffname, daysOfWeek) values (?,?)";

    res.redirect('/')
});

app.post('/waiters', function(req, res) {
    res.render('waiters')
});

app.get('/data', async function(req, res) {
    var name = req.params.name;
    console.log(name)
    const names = await waiters.getAllUsers(name)
    res.render('data', {
        name: names
    });
});

app.get('/days', function(req, res) {
    res.render('days')
})

app.get('/waiters', function(req, res) {
    res.render('waiters')
});

const PORT = process.env.PORT || 3008;

app.listen(PORT, function() {
    console.log('App starting on port', PORT);
});