const express = require('express')
const app = express()
require('express-async-errors')
const { PORT } = require('./util/config')
const { connectToDatabase, sequelize } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const logoutRouter = require('./controllers/logout')
const readinglistsRouter = require('./controllers/readinglists')
app.use(express.json())

app.get('/favicon.ico', (req, res) => res.status(204));
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readinglistsRouter)
app.use('/api/logout', logoutRouter)
// Sync Sequelize models with the database
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Unable to sync database:', error);
  });
// const start = async () => {
//   await connectToDatabase()
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
//   })
// }

// start()