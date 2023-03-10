'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename("database.js");
const db = {};
//const basicPath = `${process.cwd()}\\models`
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');


module.exports = (config, basicPath) => {

  if (!config.database) {
    throw "database not Empty!";
  }
  if (!config.username) {
    throw "username not Empty!";
  }
  if (!config.username) {
    throw "password not Empty!";
  }
  if (!config.username) {
    throw "host not Empty!";
  }
  if (!config.username) {
    throw "dialect not Empty!";
  }

  const sequelize = new Sequelize(config.database, config.username, config.password, {
    dialectModule: config.dialectModule,
    storage: "./back-test.db.sqlite",
    dialect: config.dialect,
    logging: false,
  });

  // const sequelize = new Sequelize(config.database, config.username, config.password, {
  //   host: config.host,
  //   dialectModule: config.dialectModule,
  //   dialect: config.dialect,
  //   dialectOptions: {
  //     statement_timeout: 60000,
  //     idle_in_transaction_session_timeout: 20000,
  //   },
  //   pool: {
  //     max: 5,
  //     min: 0,
  //     idle: 10000,
  //     acquire: 60000
  //   },
  //   logging: false,
  // });

  fs
    .readdirSync(basicPath)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {

      //const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);

      let model;
      if (file.indexOf("camera.js") >= 0) {
        model = require(path.join(basicPath, file))(sequelize, Sequelize.DataTypes, bcrypt, CryptoJS);
      } else if (file.indexOf("independentcredentials.js") >= 0) {
        model = require(path.join(basicPath, file))(sequelize, Sequelize.DataTypes, bcrypt);
      } else {
        model = require(path.join(basicPath, file))(sequelize, Sequelize.DataTypes);
      }
      db[model.name] = model;
    });

  // for (let i = 0; i < datas.length; i++) {  
  //   // console.log(process.cwd() + "\\models")
  //   // console.log(datas[i])
  //   const model = require(path.join(process.cwd() + "\\models", datas[i]))(sequelize, Sequelize.DataTypes);
  //   db[model.name] = model;
  // }

  Object.keys(db).forEach(modelName => {

    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
};


