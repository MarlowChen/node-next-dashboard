
const landmark = (sequelize, DataTypes) => {
  const Landmark = sequelize.define(
    'Landmark',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      //如果有就會加入權限
      perm_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER)
      },
      lat: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lng: {
        type: DataTypes.STRING,
        allowNull: false
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true
      },
      maintain: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }
  )
  return Landmark
}

module.exports = landmark

