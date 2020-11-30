module.exports = function waitersFactory(pool) {

    async function addNameToDatabase(name) {
        var regularExpression = /[^A-Za-z]/g;
        var lettersOnly = name.replace(regularExpression, "")
        var item = lettersOnly.charAt(0).toUpperCase() + lettersOnly.slice(1).toLowerCase()
        if (item === "") {
            return ""
        }
        const checker = await pool.query(`select name from staff where name = $1`, [item])
        if (checker.rowCount === 0) {
            const row = await pool.query(`insert into staff (name) values ($1)`, [item]);
            return row.rows
        }
    }

    async function ids(names) {
        const name = await pool.query(`select id from staff where name = $1`, [names])
        if (name.rows.length > 0) {
            return name.rows[0].id;
        }
        // console.log(name);
        return null;
    }

    async function dayIds(names) {
        const name = await pool.query(`select * from totaldays where id = $1`, [names])
            // console.log(name)
        if (name.rows.length > 0) {
            return name.rows[0].id;
        }
        return null;
    }

    async function get(days) {

        const names = await pool.query(`select totaldays_name from namedays where staff_name = $1`, [days])
        const name = names.rows

        const allDays = await pool.query(`select * from totaldays`)
        const day = allDays.rows
            // console.log(day);
        day.forEach(function(all) {
            name.forEach(function(week) {
                if (week.totaldays_name === all.totaldays) {
                    all.state = "checked"
                }
            })
        })
        return day
    }

    async function admin() {
        var daysCount = await pool.query(`select count(*) from totaldays`)
        const daysId = daysCount.rows[0].count

        var day = await pool.query(`select * from totaldays`)
        var allRows = day.rows

        let list = []

        for (var i = 0; i < daysId; i++) {
            var days = allRows[i].day

            var lists = await pool.query(`select staff_name from namedays where totaldays_name = $1`, [day])
                // console.log(lists.rows);

            let names = []
            let colors = ""
            for (var x = 0; x < lists.rows.length; x++) {

                name = lists.rows[x]
                names.push(name)
            }

            if (names.length > 3) {
                colors = 'red'
            } else if (names.length === 3) {
                colors = 'green'
            } else {
                colors = 'orange'
            }

            list.push({
                weekday: allRows,
                name: names,
                color: colors,
            })
        }
        return list
    }

    async function getAllUsers() {
        // this is for db 
        const names = await pool.query(`
                    select * from staff `);
        return names.rows;
    }

    async function addData(name, days) {
        //this is for the admin
        await pool.query(`delete from namedays where staff_name = $1 `, [name])
            //loop through the days and after get the individual days using
        for (var i = 0; i < days.length; i++) {
            var weekDay = days[i];
            await pool.query(`
                    insert into namedays(totaldays_name, staff_name) values($1, $2)
                    `, [weekDay, name]);
        }
    }



    return {
        addNameToDatabase,
        getAllUsers,
        get,
        addData,
        ids,
        dayIds,
        admin
    }
}