const Pool = require('pg').Pool

const pool = new Pool({
    user: 'visitante',
    host: 'localhost',
    database: 'T1-visitante',
    password: 'h',
    port: 5432,
})

module.exports = {
    pool
}
