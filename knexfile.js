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
      directory: __dirname + '/db/maria/migrations'
    },
    seeds: {
      directory: __dirname + '/db/maria/seeds/development'
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
      directory: __dirname + '/db/maria/migrations'
    },
    seeds: {
      directory: __dirname + '/db/maria/seeds/development'
    }
  }
}