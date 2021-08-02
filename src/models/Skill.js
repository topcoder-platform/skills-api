const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Skill = sequelize.define('Skill', {
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
    }
  },
  {
    timestamps: true,
    updatedAt: 'updated',
    createdAt: 'created'
  })
  Skill.associate = (models) => {
    Skill.belongsTo(models.Taxonomy, { foreignKey: 'taxonomyId', type: DataTypes.UUID })
  }
  return Skill
}
