/**操作数据库*/
let pg = require("../envUtil/pgDatabase-v1");
pg.getConnection({
    name: "myNode-1"
});
let uuid = require("../envUtil/FlyTigerUUID");
let fs=require("fs");
/**图像信息保存根目录*/
let baseImgdataPath="view/imgData/";
/**将图像信息写入文件*/
let saveData=({name,data,flag})=>{
    /**appendFile 第3个参数 
     *@see flag 有值:
     * a append
     * w write
     * */
    fs.appendFile(`${baseImgdataPath}${name}.txt`, data,{flag:flag}, (err) => {
          if (err) {throw err;}
          console.log('The imgData was appended to file!');
        });
};
let _init = (Nindex) => {
    /**保存canvas中的基本数据(同名记录已存在则修改!)*/
    Nindex.post("/canvas.do", (req, res) => {
        let _body = req.body;
        let _content = {
            content: _body.content,
            description: "1",
            name: _body.name
        };
        pg.update("t_canvas", {
            name: _body.name
        }, _content, (data) => {
            data.err && console.info(data.err);
            if (data.rows != null && data.count > 0) {
                res.send(true);
            } else {
                _content.id = uuid.getID();
                pg.save("t_canvas", _content, (data) => {
                    data.err && console.info(data.err);
                    if (data.rows != null && data.count > 0) {
                        res.send(true);
                    } else {
                        res.send(false);
                    }
                });
            }
        });

    });
    Nindex.post("/canvas-img.do",(req,res)=>{
        let _body = req.body;
        saveData(_body);
        res.send(true);
    });
};

module.exports = _init;
