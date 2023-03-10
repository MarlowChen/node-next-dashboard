const permission = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    'Permission',
    {
      perm_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      perm_code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      perm_description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      parent_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      group_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      //排序，沒有預設
      index: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }
  )

  Permission.associate = (models) => {
    const { Role } = models
    Permission.belongsToMany(Role, {
      through: 'RolePermission',
      as: 'roles',
      foreignKey: 'perm_id'
    });
  }

  return Permission
}

module.exports = permission

