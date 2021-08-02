const { DataTypes } = require('sequelize')

module.exports = {
  up: async (query) => {
    await query.addColumn('Skills', 'taxonomyId', {
      type: DataTypes.UUID,
      references: {
        model: 'Taxonomies',
        key: 'id'
      },
      onUpdate: 'CASCADE'
    })
  },
  down: async (query) => {
    await query.removeColumn('Skills', 'taxonomyId')
  }
}
