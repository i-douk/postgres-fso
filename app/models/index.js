const Blog = require('./blog')
const Readinglist = require('./readinglist')
const User = require('./user')
const ActiveSession = require('./active_session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany( Blog , { through : Readinglist, as : 'readings'})
Blog.belongsToMany( User , { through : Readinglist})

User.hasMany(ActiveSession)
ActiveSession.belongsTo(User)

module.exports = {
  Blog, User , Readinglist, ActiveSession
}