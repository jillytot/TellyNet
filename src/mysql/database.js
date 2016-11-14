const mysql = require('mysql');
const logger = require('../../logs/log');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'tellynet',
  password : 'secret',
  database : 'tellynet'
});

connection.connect(function (err) {

  logger.error('MySql error', err);

  console.log('MySql connected');
});
