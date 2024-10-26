require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.PORT || 'postgres://postgres:secretpassword@localhost:5432/postgres',
  PORT: process.env.PORT || 3001,
  SECRET: process.env.PORT || 'secretpassword'
}