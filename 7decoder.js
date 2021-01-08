const fs = require('fs');
const path = require('path');
let crypto;
try {
    crypto = require('crypto');
} catch (error) {
    console.error("No crypto!");
}
let Duplex = require('stream').Duplex;
function bufferToStream(buffer) {
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

const args = process.argv.slice(2);
let encPath = args[0];
let outputPath = '';         //确定输出目录
if (path.extname(encPath) == '.enc') {
    outputPath = path.join(path.dirname(encPath), path.basename(encPath, '.enc'));
}
else {
    outputPath = path.join(path.dirname(encPath), (path.parse(encPath).name + '_decoded' + path.extname(encPath)));
}

let getKey = () => {
    let seed = 37;
    const array = "J9h4j5eNds+aq1==".split("");
    let array2 = Buffer.alloc(16);
    for (let i = 0; i < array.length; i++) {
        array2[i] = array[i].charCodeAt() ^ seed;
        seed += 13;
    }
    return array2;
}
fs.stat(encPath, function (err, stats) {
    if (err) {
        console.log("file open error!");
    }
    if (!err && stats.isFile()) {    //无错且为文件
        const fe = fs.openSync(encPath, 'r');
        let bh = Buffer.alloc(7);
        fs.read(fe, bh, 0, 7, 0, function (err, bytesRead, buffer) {
            if (err) {
                console.error(err);
            }
            let header = String(buffer);
            if (header != "t7s-enc") {
                console.error("not a enc file!");
            }
        });
        let IV = Buffer.alloc(16);
        fs.read(fe, IV, 0, 16, 7, function (err, bytesRead, buffer) {
            if (err) {
                console.error(err);
            }
            //console.log(IV.toString());
        });
        let encData = fs.readFileSync(encPath).slice(7 + 16);   //剩下的是需要解密的数据
        const algorithm = "aes-128-cbc";
        const key = getKey();
        const decipher = crypto.createDecipheriv(algorithm, key, IV);
        const output = fs.createWriteStream(outputPath);
        bufferToStream(encData).pipe(decipher).pipe(output);
        console.log('success!');
    }
});