const fs=require('fs');
let crypto;
try {
    crypto=require('crypto');
} catch (error) {
    console.error("No crypto!");
}

const args=process.argv.slice(2);
let path=args[0];

function getKey(){
    let seed=37;
    const array="J9h4j5eNds+aq1==".split("");
    let array2=new ArrayBuffer(16);
    for (let i = 0; i < array.length; i++) {
        array2[i]=array[i].charCodeAt()^seed;
        seed+=13;
    }
    return array2;
}
let key=getKey();
let IV;
fs.stat(path,function(err,stats){
    const fe=fs.openSync(path,'r');
    if (err) {
        console.log("file open error!");
    }
    if (!err&&stats.isFile()){    //无错且为文件
        let bh=Buffer.alloc(7);
        fs.read(fe,bh,0,7,0,function(err,bytesRead,buffer){
            if(err){
                console.error(err);
            }
            let header=String(buffer);
            if (header!="t7s-enc") {
                console.error("not a enc file!");
            }
        });
        let biv=Buffer.alloc(16);
        fs.read(fe,biv,0,16,7,function(err,bytesRead,buffer){
            if(err){
                console.error(err);
            }
            IV=buffer;
        })
        let encData=fs.readFileSync(path).slice(7+16);
        const algorithm="aes-128-cbc";
    }
});

