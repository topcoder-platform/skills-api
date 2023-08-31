const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const TCSkill = sequelize.define('TCSkill', {
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
    }
  },
  {
    timestamps: true,
    indexes: [
      {
        name: "TCSkill_name_key",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
    ]
  })
  return TCSkill
}
