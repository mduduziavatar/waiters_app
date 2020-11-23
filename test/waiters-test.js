const assert = require("assert");
const WaitersFactory = require('../waiters');

const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://mdu:pg123@localhost:5432/waiters_test';
const pool = new Pool({
    connectionString
});

let waiters = WaitersFactory(pool);

describe("The waiters database functions tests", function() {
    beforeEach(async function() {
        await pool.query("delete from namedays");
    });

    it("should be able to add names to table staff", async function() {

    });
    it("should be able to delete all on table namedays", async function() {

    });
    it("should be able to add selected days from table weekday", async function() {

    });
    it("should be able to get name by id from table staff", async function() {

    });
    it("should be able to get day id from table weekday", async function() {

    });
});