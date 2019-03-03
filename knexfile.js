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
      directory: __dirname + '/db/mariadb/seeds/development'
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
      directory: '/db/mariadb/migrations'
    },
    seeds: {
      directory: '/db/mariadb/seeds/development'
    }
  }
}