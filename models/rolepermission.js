
const rolePermission = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    'RolePermission',
    {
      role_id: DataTypes.INTEGER,
      perm_id: DataTypes.INTEGER
    }
  )
  RolePermission.associate = (models) => {
    const { Permission } = models
    RolePermission.belongsTo(Permission, {
      foreignKey: 'perm_id',
      targetKey: "id"
    });
  }

  return RolePermission
}

module.exports = rolePermission