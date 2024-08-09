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
          type: Sequelize.TEXT,
          allowNull: false
        },
        author: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        url: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        likes: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
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