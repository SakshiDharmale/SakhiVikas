const mysql = require('mysql2');
require('dotenv').config();

const config = {
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    user: process.env.user,
};

let connection = null;
let connectionError = null;

if (config.host && config.database && config.user) {
    connection = mysql.createConnection(config);
    connection.connect((error) => {
        if (error) {
            connectionError = error;
            console.log('database connection error:', error.message);
        }
    });
} else {
    connectionError = new Error('Database environment variables are missing');
    console.log('database connection error: missing database environment variables');
}

module.exports = {
    query(sql, params, callback) {
        const cb = typeof params === 'function' ? params : callback;
        const values = typeof params === 'function' ? [] : params;

        if (!connection || connectionError) {
            return cb(connectionError || new Error('Database unavailable'));
        }

        return connection.query(sql, values, cb);
    },
};