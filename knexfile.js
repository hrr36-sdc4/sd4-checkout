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
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/development'
    }
  },
  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      user: user,
      password: password,
      database: 'rooms'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/development'
    }
  }
}