const independentCredentials = (sequelize, DataTypes, bcrypt) => {
  const IndependentCredentials = sequelize.define(
    'IndependentCredentials',
    {
      user_id: { type: DataTypes.INTEGER, unique: true },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }
  )

  IndependentCredentials.associate = (models) => {
    const { User } = models
    IndependentCredentials.belongsTo(User, {
      foreignKey: 'user_id'
    });
  }

  IndependentCredentials.beforeSave(async (independentcredentials, options) => {
    if (independentcredentials.password) {
      independentcredentials.password = bcrypt.hashSync(independentcredentials.password, bcrypt.genSaltSync(10), null);
    }
  });
  IndependentCredentials.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  };

  return IndependentCredentials
}

module.exports = independentCredentials

