const fs = require('fs');
const path = require('path');
const Collection = require('./Collection');
// 引入utils.js里面的工具函数
const { isObject, isArray } = require('./utils');

const DesktopUrl = process.cwd().replace(/Desktop(.+)/g, '')+'Desktop';
// 数据库
function DataBase (dbName) {
    if (!(this instanceof DataBase)) {
        return new DataBase(dbName);
    }
    this.dbName = dbName || 'Virtual DataBase';
    // 收集全部的表格
    this.Table = {};
    this.initDataBase();
}

// 创建虚拟数据库的文件夹
DataBase.prototype.initDataBase = function () {
    this.dbPath = path.join(DesktopUrl, this.dbName);
    try {
        // 如果不存在就创建文件夹
        fs.mkdirSync(this.dbPath);
    } catch (error) {
        // error
    }
    // this.connectFn();
}

DataBase.prototype.connect = function (fn) {
    this.connectFn = fn;
    return this;
}

// 创建表格
DataBase.prototype.createCollection = function (collName) {
    if (!this.Table[collName]) {
        this.Table[collName] = new Collection(collName);
    }
    return this;
}

DataBase.prototype.insertOne = function (collName, data) {
    this.createCollection(collName);
    this.Table[collName].insertOne(data);
    return this;
}

DataBase.prototype.insertMany = function (collName, data) {
    this.createCollection(collName);
    this.Table[collName].insertMany(data);
    return this;
}

DataBase.prototype.insert = function (collName, data) {
    if (isArray(data)) {
        this.insertMany(collName, data);
    } else {
        this.insertOne(collName, data);
    }
    return this;
}

DataBase.prototype.findOne = function (collName, cond) {
    this.createCollection(collName);
    return this.Table[collName].findOne(cond);
}

DataBase.prototype.findMany = function (collName, cond) {
    this.createCollection(collName);
    return this.Table[collName].findMany(cond);
}

DataBase.prototype.find = function (collName, cond) {
    this.createCollection(collName);
    return this.Table[collName].find(cond);
}

DataBase.prototype.updateOne = function (collName, cond, upd) {
    this.createCollection(collName);
    this.Table[collName].updateOne(cond, upd);
    return this;
}

DataBase.prototype.updateMany = function (collName, cond, upd) {
    this.createCollection(collName);
    this.Table[collName].updateMany(cond, upd);
    return this;
}

DataBase.prototype.deleteOne = function (collName, cond) {
    this.createCollection(collName);
    this.Table[collName].deleteOne(cond);
    return this;
}

DataBase.prototype.deleteMany = function (collName, cond) {
    this.createCollection(collName);
    this.Table[collName].deleteMany(cond);
    return this;
}

DataBase.prototype.clear = function (collName) {
    this.createCollection(collName);
    this.Table[collName].clear();
    return this;
}

module.exports = DataBase;