const fs = require('fs');
const path = require('path');

const DesktopUrl = process.cwd().replace(/Desktop(.+)/g, '')+'Desktop';
const defaultVDpath = DesktopUrl + '/Virtual database';

function readDataBase(url, target) {
    const dirs = fs.readdirSync(url);
    for (let i=0, len=dirs.length; i<len; i++) {
        const curUrl = path.join(url, dirs[i]);
        try {
            // 判断是不是文件夹
            fs.statSync(curUrl);
            // 是文件夹
            const result = readDataBase(curUrl, target);
            if (result != null) {
                return result;
            }
        } catch(err) {
            // 不是文件夹，是文件
            if (dirs[i] === target+'.json') {
                return JSON.parse(fs.readFileSync(curUrl).toString());
            }
        }
    }
    return null;
}

const json = readDataBase(defaultVDpath, 'index')
console.log(json)