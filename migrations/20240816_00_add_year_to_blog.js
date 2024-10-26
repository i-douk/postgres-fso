const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
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
    })

  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year')
  },
}