const user = require('./config.js').user;
const password = require('./config.js').password;

module.exports = {
  test: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: user,
      password: password,
      database: 'rooms'
    },
    migrations: {
      directory: __dirname + '/db/mariadb/migrations'
    },
    seeds: {
      directory: __dirname + '/db/mariadb/development'
    }
  },
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: user,
      password: password,
      database: 'rooms'
    },
    migrations: {
      directory: __dirname + '/db/mariadb/migrations'
    },
    seeds: {
      directory: __dirname + '/db/mariadb/development'
    }
  },
  production: {
    client: 'mysql',
    connection: {
      host: '18.144.26.136',
      user: user,
      password: password,
      database: 'rooms'
    },
    migrations: {
      directory: __dirname + '/db/mariadb/migrations'
    },
    seeds: {
      directory: __dirname + '/db/mariadb/development'
    }
  },
}