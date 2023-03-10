const user = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      role_id: DataTypes.INTEGER,
      name: DataTypes.STRING
    }
  )

  User.associate = (models) => {
    const { User, Permission } = models
    User.belongsTo(models.Role, {
      foreignKey: 'role_id'
    });
    User.belongsTo(models.IndependentCredentials, {
      foreignKey: 'id', targetKey: 'user_id', constraints: false
    });
    User.belongsTo(models.Email, {
      foreignKey: 'id', targetKey: 'user_id', constraints: false
    });
  }

  return User
}

module.exports = user

