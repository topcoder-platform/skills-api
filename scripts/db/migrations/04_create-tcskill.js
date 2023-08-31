const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('TCSkills', {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    })

    await queryInterface.addIndex('TCSkills', ['name'], {
      name: 'TCSkill_name_key',
      unique: true
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('TCSkills')
  }
}
