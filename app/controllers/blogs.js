const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Blog, User } = require('../models')
const { sequelize } = require('../util/db')
const { SECRET } = require('../util/config')

const main = async () => {
        await sequelize.authenticate()
        const blogs = await Blog.findAll()
        console.log(JSON.stringify(blogs))
        blogs.forEach(blog =>{console.log(`${blog.toJSON().author} : ${blog.toJSON().title}, ${blog.toJSON().likes} likes`)})
    }   
main()


//MIDDLEWARE
const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
  }

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({
      error: 'token missing' })
    }
    next()
  }

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
          model: User,
          attributes: ['name']
        }
      }
    )
    res.json(blogs)
})

router.post('/', tokenExtractor ,async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
  res.json(blog)
  })

router.get('/:id', blogFinder, async (req, res) => {
if (req.blog) {
    res.json(req.blog)
} else {
    res.status(404).end()
}
})

router.delete('/:id', blogFinder, tokenExtractor , async (req, res) => {
    if (req.blog) {
       const user = await User.findByPk(req.decodedToken.id)
        if( user.id == req.blog.userId) {
          await req.blog.destroy()
          res.status(204).end()
        }
    } else {
        res.status(404).end()
    }
})

router.put('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
      req.blog.likes = req.body.likes
      await req.likes.save()
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
  })

module.exports = router
