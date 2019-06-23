const config = require('../config/config');
const util = require('util');

const mysql = require('mysql');


const pool = mysql.createPool(config.db);

pool.query = util.promisify(pool.query);
pool.getConnection = util.promisify(pool.getConnection);

module.exports = pool;

