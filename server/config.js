const config = {
  development: {
    database: 'sps',
    username: 'root',
    password: 'Rashmitha@09',
    host: 'localhost',  // This is for local development
    dialect: 'mysql'
  },
  test: {
    database: 'test_db',
    username: 'root',
    password: 'Rashmitha@09',
    host: 'localhost',
    dialect: "mysql",
    storage: ":memory:"
  },
  production: {
    database: 'sps_prod',
    username: 'root',
    password: 'Rashmitha@09',
    host: process.env.DB_HOST || 'host.docker.internal', // Use 'host.docker.internal' or Docker service name for production
    dialect: 'mysql'
  }
};

export default config[process.env.NODE_ENV || 'development'];
