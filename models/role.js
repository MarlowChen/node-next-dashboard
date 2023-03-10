const role = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      role_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      role_description: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }
  )

  Role.associate = (models) => {
    const { User, Permission } = models
    Role.hasMany(User, {
      foreignKey: 'role_id',
      as: 'users'
    });
    Role.belongsToMany(Permission, {
      through: 'RolePermission',
      as: 'permissions',
      foreignKey: 'role_id'
    });
  }

  return Role
}

module.exports = role

