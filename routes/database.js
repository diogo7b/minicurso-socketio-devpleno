
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(__dirname + '/../data/db.json')
const database = low(adapter)

defaultData = require(__dirname + '/../data/default-data.json');
database.defaults(defaultData).write()

module.exports = database;

