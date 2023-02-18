'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const {Umzug, SequelizeStorage} = require("umzug");
const basename = path.basename(__filename);
const config = require(__dirname + '/../config/config.json')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

const migrate = function () {
    return new Promise(function (resolve, reject) {
        const umzug = new Umzug({
            migrations: {
                glob: 'migrations/*.js',
                resolve: ({name, path, context}) => {
                    const migration = require(path || '');
                    return {
                        name,
                        up: async () => migration.up(context, Sequelize),
                        down: async () => migration.down(context, Sequelize)
                    }
                }
            },
            context: sequelize.getQueryInterface(),
            storage: new SequelizeStorage({sequelize}),
            logger: console,
        });

        umzug.up().then(function (migrations) {
            resolve(migrations);
        }).catch(function (e) {
            reject(e);
        });
    });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.sequelize.migrate = migrate;

module.exports = db;
