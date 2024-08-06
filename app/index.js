require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model {}
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    author: {
        type: DataTypes.TEXT,
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
    },
    
    date: {
        type: DataTypes.DATE
    }},
    {
        sequelize,
        underscored: true,
        timestamps: false,
        modelName: 'blog'})

Blog.sync()


const main = async () => {
    try {
        await sequelize.authenticate()
        const blogs = await Blog.findAll()
        console.log(JSON.stringify(blogs))
        blogs.forEach(blog =>{console.log(`${blog.toJSON().author} : ${blog.toJSON().title}, ${blog.toJSON().likes} likes`)})
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
    }
    
main()

app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
    try {
      const blog = await Blog.create(req.body)
      return res.json(blog)
    } catch(error) {
      return res.status(400).json({ error })
    }
  })

app.get('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      res.json(blog)
    } else {
      res.status(404).end()
    }
  })

app.delete('/api/blogs/:id', async (req, res) => {
try {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        await blog.destroy()
        res.status(204).end()
    } else {
        res.status(404).end()
    }
} catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
}
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)})