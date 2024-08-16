const Blog = require('./blog')
const Readinglist = require('./readinglist')
const User = require('./user')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany( Blog , { through : Readinglist, as : 'readings'})
Blog.belongsToMany( User , { through : Readinglist})

module.exports = {
  Blog, User , Readinglist
}