const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('Skills', {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      createdBy: {
        type: DataTypes.STRING
      },
      updatedBy: {
        type: DataTypes.STRING
      },
      name: {
        type: DataTypes.STRING
      },
      externalId: {
        type: DataTypes.STRING
      },
      uri: {
        type: DataTypes.STRING
      },
      metadata: {
        type: DataTypes.JSONB
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated: {
        type: DataTypes.DATE
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('Skills')
  }
}
