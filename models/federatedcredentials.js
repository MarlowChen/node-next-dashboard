const federatedCredentials = (sequelize, DataTypes) => {
  const FederatedCredentials = sequelize.define(
    'FederatedCredentials',
    {
      user_id: DataTypes.INTEGER,
      provider: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      subject: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
    }
  )

  return FederatedCredentials
}

module.exports = federatedCredentials

