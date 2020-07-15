const DataBase = require('./DataBase');
const db = new DataBase();
db.updateMany('demo', {
    name: 'satan'
},{
    age: 30
})