const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const User = require('../models/user.js')
const Blog = require('../models/blog.js')
const ActiveSession = require('../models/active_session.js')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)

    const activeSession = await ActiveSession.findOne({ where: { token } })
    if (!activeSession) {
      return res
        .status(401)
        .json({ error: 'Session expired: please log back in.' })
    }

    const decodedToken = jwt.verify(token, SECRET)

    const user = await User.findByPk(decodedToken.id)
    if (user.disabled) {
      return res.status(401).json({ error: 'Account is banned' })
    }

    req.token = token
    req.decodedToken = decodedToken
  } else {
    return res
      .status(401)
      .json({ error: 'Authorization token missing: you are not logged in.' })
  }
  next()
}

//Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    if (!user.admin) {
      return res.status(401).json({ error: 'Operation not allowed' });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

//Middleware to find blog by id
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}


module.exports = { tokenExtractor , isAdmin , blogFinder }