const router = require('express').Router()

const { Blog, User } = require('../models')
const { sequelize } = require('../util/db')

const main = async () => {
        await sequelize.authenticate()
        const blogs = await Blog.findAll()
        console.log(JSON.stringify(blogs))
        blogs.forEach(blog =>{console.log(`${blog.toJSON().author} : ${blog.toJSON().title}, ${blog.toJSON().likes} likes`)})
   
    }
    
main()

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
  }

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})

router.post('/', async (req, res) => {
  const user = await User.findOne()
  const blog = await Blog.create({...req.body, userId: user.id})
  res.json(blog)
  })

router.get('/:id', blogFinder, async (req, res) => {
if (req.blog) {
    res.json(req.blog)
} else {
    res.status(404).end()
}
})

router.delete('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        await req.blog.destroy()
        res.status(204).end()
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
