const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Readinglist extends Model {}

Readinglist.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  read : {
    type: DataTypes.BOOLEAN,
    allowNull : false,
    defaultValue: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id'},
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'blogs', key: 'id'},
  },

}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'Readinglist'
})

module.exports = Readinglist