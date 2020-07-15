const fs = require('fs');
const path = require('path');
// 引入utils.js里面的工具函数
const { isObject, isArray } = require('./utils');

const DesktopUrl = process.cwd().replace(/Desktop(.+)/g, '')+'Desktop';
const defaultVDpath = DesktopUrl + '/Virtual database';

// 创建一个虚拟的数据库
/**
 * 这个数据库有一下特点：
 * 1.外界不可以直接获取内部的数据，数据不外露
 * 2.只能够通过接口从数据库获取数据
 */



 // 创建表格类，用来创建表格
function Collection(collName) {
    if (!(this instanceof Collection)) {
        return new Collection(collName);
    }
    this.collName = collName; // 表格名称
    // 初始化虚拟数据库路径
    this.VDpath = defaultVDpath;
    // 表格路径
    this.collpath = path.join(this.VDpath, this.collName + '.json');
    this.initCollection();
}

// 初始化数据
Collection.prototype.initCollection = function () {
    try {
        const data = fs.readFileSync(this.collpath).toString();
        this.colls = JSON.parse(data);
    } catch (error) {
        this.colls = []; // 用来存储数据
    }
}

// 设置虚拟数据库路径
Collection.prototype.setVDpath = function (url) {
    this.VDpath = url;
    // 更新表格路径
    this.collpath = path.join(this.VDpath, this.collName + '.json');
    return this;
}

// 初始化表格
Collection.prototype.UpdateCollection = function () {
    fs.writeFileSync(this.collpath, JSON.stringify(this.colls, null, 2));
    // return this;
}

// 插入数据
Collection.prototype.insertOne = function (coll) {
    if (!isObject(coll)) {
        throw new Error('插入的数据并不是一个对象');
    }
    // 为了明确标识数据的唯一性
    const __id = this.collName + '-' + Date.now() + Math.random();
    coll.__id = __id.replace('.', '');
    this.colls.push(coll);
    // 有新的数据插入立马更新数据哭
    this.UpdateCollection();
    return this;
}

// 插入很多数据
Collection.prototype.insertMany = function (colls) {
    if (!isArray(colls)) {
        throw new Error('插入的数据并不是一个数组');
    }
    for (let i=0, len=colls.length; i<len; i++) {
        const coll = colls[i];
        const __id = this.collName + '-' + Date.now() + Math.random();
        coll.__id = __id.replace('.', '');
        this.colls.push(coll);
    }
    // 有新的数据插入立马更新数据哭
    this.UpdateCollection();
    return this;
}

Collection.prototype.insert = function (coll) {
    if (isArray(coll)) {
        this.insertMany(coll);
    } else {
        this.insertOne(coll);
    }
    return this;
}

// 查询数据
Collection.prototype.findOne = function (prop) {
    if (prop == null) return null; // 没有查询条件
    // 存在查询条件
    for (let i=0, len=this.colls.length; i<len; i++) {
        const coll = this.colls[i];
        let flag = true; // 默认是合格的
        for (let key in prop) {
            if (prop[key] !== coll[key]) {
                // 说明不合格
                flag = false;
                break;
            };
        }
        if (flag) {
            // 说明合格
            return coll;
        }
    }
    return null;
}

// 查询更多数据
Collection.prototype.findMany = function (prop) {
    if (prop == null) return this.colls; // 没有查询条件
    const colls = [];
    // 存在查询条件
    for (let i=0, len=this.colls.length; i<len; i++) {
        const coll = this.colls[i];
        let flag = true; // 默认是合格的
        for (let key in prop) {
            if (prop[key] !== coll[key]) {
                // 说明不合格
                flag = false;
                break;
            };
        }
        if (flag) {
            // 说明合格
            colls.push(coll);
        }
    }
    return colls;
}

Collection.prototype.find = function (prop) {
    return this.findMany(prop);
}

// 更新数据
Collection.prototype.updateOne = function (condition, update) {
    const coll = this.findOne(condition);
    for (let p in update) {
        coll[p] = update[p];
    }
    this.UpdateCollection();
    return this;
}

Collection.prototype.updateMany = function (condition, update) {
    const colls = this.findMany(condition);
    for (let p in update) {
        for (let i=0,len=colls.length; i<len; i++) {
            colls[i][p] = update[p]
        }
    }
    this.UpdateCollection();
    return this;
}

// 删除数据
Collection.prototype.deleteOne = function (condition) {
    const coll = this.findOne(condition);
    if (coll) {
        const idx = this.colls.indexOf(coll);
        this.colls.splice(idx, 1);
    }
    this.UpdateCollection();
    return this;
}

Collection.prototype.deleteMany = function (condition) {
    const colls = this.findMany(condition);
    if (colls.length) {
        for (let i=0, len=colls.length; i<len; i++) {
            const coll = colls[i];
            const idx = this.colls.indexOf(coll);
            this.colls.splice(idx, 1);
        }
    }
    this.UpdateCollection();
    return this;
}

// 清空表格
Collection.prototype.clear = function () {
    this.colls = []
    this.UpdateCollection();
    return this;
}

module.exports = Collection;