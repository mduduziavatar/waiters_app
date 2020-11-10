module.exports = function waitersFactory(pool) {
    async function addNameToDatabase(name) {
        var regularExpression = /[^A-Za-z]/g;
        var lettersOnly = name.replace(regularExpression, "")
        var item = lettersOnly.charAt(0).toUpperCase() + lettersOnly.slice(1).toLowerCase()
        if (item === "") {
            return ""
        }
        const checker = await pool.query(`select id from staff where staffname = $1`, [item])
        if (checker.rowCount === 0) {
            await pool.query(`insert into staff (staffname) values ($1)`, [item]);
        }
    }
    async function getAllUsers() {
        // this is for db 
        const names = await pool.query(`select staffname from staff`);
        return names.rows;
    }
    return {
        addNameToDatabase,
        getAllUsers
    }
}