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
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.NUMBER,
    },
    
    date: {
        type: DataTypes.DATE
    }},
    {
        sequelize,
        underscored: true,
        timestamps: false,
        modelName: 'note'})

app.get('/api/notes', async (req, res) => {
    const notes = await Note.findAll()
    res.json(notes)
})

app.post('/api/notes', async (req, res) => {
    try {
      const note = await Note.create(req.body)
      return res.json(note)
    } catch(error) {
      return res.status(400).json({ error })
    }
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)})