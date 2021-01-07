const fs=require('fs');

const args=process.argv.slice(2);
console.log(args[0]);
function getkey(){
    const seed=37;
    
}
const IV;
fs.stat(args[0],function(err,stats){
    const fe=fs.openSync(args[0],'r');
    if (err) {
        console.log("file open error!");
    }
    if (!err&&stats.isFile()){    //无错且为文件
        let b=Buffer.alloc(7);
        fs.read(fe,b,0,7,0,function(err,bytesRead,buffer){
            if(err){
                console.error(err);
            }
            let header=String(buffer);
            if (header!="t7s-enc") {
                console.error("not a enc file!");
            }
        });
        
    }
});

