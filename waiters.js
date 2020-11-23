module.exports = function waitersFactory(pool) {


    // async function allStaff(day) {
    //     if (day === 'Monday') {
    //         const allMonday = await pool.query(`select monday from daysofweek`);
    //         return allRegistrations.rows
    //     } else if (day === 'Monday') {
    //         const filtered = await pool.query(`select * from registrations where towns_id = $1;`, [town]);
    //         return filtered.rows

    //     }
    // }

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
            console.log(row.rows)

        }
    }

    // async function staffId(name) {
    //     console.log('test2')

    //     var linkingId = await pool.query(`select id from staff where name = $1`, [name]);
    //     console.log(linkingId.rows + " id")        return linkingId.rows[0].id;

    //}
    async function ids(names) {
        const name = await pool.query(`select * from staff where id = $1`, [names])
        if (name.rows.length > 0) {
            return name.rows[0];
        }
        return null;
    }



    async function get(days) {
        for (const id of days) {
            const joined = await pool.query(`select staff.name
             from staff
             inner join namedays
             on staff.id = shift.staff_id
             inner join totaldays
             on namedays.totaldays_id = totaldays.id where totaldays_id=$1`, [days]);
            return joined.rows;
        }
    }

    async function getAllUsers() {
        // this is for db 
        const names = await pool.query(`select * from staff`);
        return names.rows;
    }

    async function addData(day, names) {
        if (!names == "") {

            // const name = await pool.query(`select id from staff where name = $1`, [names])
            // console.log(name.rows)

            // this is for db 
            let linkingId = await ids(name)
                //loop through the days and after get the individual days using the [i] 
            const checker = await pool.query(`select id from totaldays where weekday = $1 `, [day])
            console.log(checker.rows[0].id)
            if (checker.rowCount === 0) {
                const weekDay = await pool.query(`insert into namedays(staff_id, totaldays_id) values($1, $2)`, [checker, linkingId]);
                // console.log(weekDay.rows)
            }
        }
    }

    return {
        addNameToDatabase,
        getAllUsers,
        get,
        addData
    }
}