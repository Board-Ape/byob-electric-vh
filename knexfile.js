
module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/DATABASE-NAME',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
