const router = require('express').Router()
const { Blog, User } = require('../models')
const { sequelize } = require('../util/db')
const { Op } = require('sequelize')
const { tokenExtractor , blogFinder} = require('../util/middleware')

const main = async () => {
        await sequelize.authenticate()
        const blogs = await Blog.findAll()
        console.log(JSON.stringify(blogs))
        blogs.forEach(blog =>{console.log(`${blog.toJSON().author} : ${blog.toJSON().title}, ${blog.toJSON().likes} likes`)})
    }   
main()


router.get('/', async (req, res) => { 
  const where = {}
  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } }
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order : [
      [sequelize.literal('COALESCE("likes", 0)'), 'DESC']
    ]
  })
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
