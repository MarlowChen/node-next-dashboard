const email = (sequelize, DataTypes) => {
  const Email = sequelize.define(
    'Email',
    {
      user_id: { type: DataTypes.INTEGER, unique: true },
      address: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true
      },
      verify: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }
  )

  Email.associate = (models) => {
    const { User } = models
    Email.belongsTo(User, {
      foreignKey: 'user_id'
    });
  }

  return Email
}

module.exports = email

