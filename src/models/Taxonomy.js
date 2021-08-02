const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Taxonomy = sequelize.define('Taxonomy', {
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
    metadata: {
      type: DataTypes.JSONB
    }
  },
  {
    timestamps: true,
    updatedAt: 'updated',
    createdAt: 'created'
  })
  Taxonomy.associate = (models) => {
    Taxonomy.hasMany(models.Skill, { foreignKey: 'taxonomyId', type: DataTypes.UUID })
  }
  return Taxonomy
}
