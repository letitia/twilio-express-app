const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const config = require('../config/config').development;
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const basename = path.basename(module.filename);

const db = {};

fs.readdir(__dirname, (err, files) => {
  files
    .filter(file => file !== basename)
    .forEach(file => {
      const model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    });
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
