const { DataTypes, Sequelize } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('blogs', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        author: {
          type: DataTypes.STRING,
          allowNull: true
        },
        url: {
          type: DataTypes.STRING,
          allowNull: false
        },
        likes: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
    
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
        
      });
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    })
    await queryInterface.addColumn('blogs', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('blogs')
    await queryInterface.dropTable('users')
  },
}