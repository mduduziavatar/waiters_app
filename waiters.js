module.exports = function waitersFactory(pool) {


    async function allStaff(day) {
        if (day === 'Monday') {
            const allMonday = await pool.query(`select monday from daysofweek`);
            return allRegistrations.rows
        } else if (day === 'Monday') {
            const filtered = await pool.query(`select * from registrations where towns_id = $1;`, [town]);
            return filtered.rows

        }
    }

    async function addNameToDatabase(name) {
        var regularExpression = /[^A-Za-z]/g;
        var lettersOnly = name.replace(regularExpression, "")
        var item = lettersOnly.charAt(0).toUpperCase() + lettersOnly.slice(1).toLowerCase()
        if (item === "") {
            return ""
        }
        const checker = await pool.query(`select staffname from staff where staffname = $1`, [item])
        if (checker.rowCount === 0) {
            await pool.query(`insert into staff (staffname) values ($1)`, [item]);
        }
    }

    // async function staffId(name) {
    //     console.log('test2')

    //     var linkingId = await pool.query(`select id from staff where staffname = $1`, [name]);
    //     console.log(linkingId.rows + " id")        return linkingId.rows[0].id;

    // }
    async function ids(names) {
        const name = await pool.query(`select id from staff where staffname = $1`, [names])
        return name.rows[0].id
    }



    async function get(days) {
        for (const id of days) {
            const joined = await pool.query(`select staff.staffname
             from staff
             inner join nameDays
             on staff.id = shift.staff_id
             inner join totalDays
             on nameDays.totalDays_id = totalDays.id where totalDays_id=$1`, [days]);
            return joined.rows;
        }
    }

    async function getAllUsers() {
        // this is for db 
        const names = await pool.query(`select * from staff`);
        return names.rows;
    }

    async function addData(day, staffname) {
        // this is for db 
        let linkingId = await staffId(staffname)
        const checker = await pool.query(`select id from totalDays where staffname = $1 `, [day])
        if (checker.rowCount === 0) {
            const weekDay = await pool.query(`insert into nameDays(staff_id, totalDays_id) values($1, $2)`, [day, linkingId]);
        }
    }
    async function getWeekDay(getDay) {
        // this is for db 
        const weekDay = await pool.query(`select id from totalDays where weekday =$1`, [getDay]);
        return weekDay.rows;
    }
    return {
        addNameToDatabase,
        getAllUsers,
        getWeekDay,
        get,
        ids,
        allStaff,
        addData
    }
}