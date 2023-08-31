const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('Skills', 'taxonomyId', {
      type: DataTypes.UUID,
      references: {
        model: 'Taxonomies',
        key: 'id'
      },
      onUpdate: 'CASCADE'
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('Skills', 'taxonomyId')
  }
}
