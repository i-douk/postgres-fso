const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

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
        defaultValue: 0, 
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id'},
    },
    year: {
        type: DataTypes.INTEGER,
        validate: {
          min: {
            args: 1991,
            msg: 'Year should be between 1991 and the current year.',
          },
          max: {
            args: new Date().getFullYear(),
            msg: 'Year should be between 1991 and the current year.',
          },
        },
      },
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'blog'
    })

module.exports = Blog