var fs = require("fs")
var _path_ = require("path")
/*获取项目根目录,根据 启动主入口js 目录来获取*/
var root = _path_.dirname(require.main.filename)
//console.info(root);
module.exports = {
    readDirSync: function readDirSync(_path, _fc) {
        var _pt = root + "\\" + _path;
        try {
            fs.readdir(_pt, (err, pa) => {
                if (err) {
                    console.info(err);
                    return;
                }
                var files = pa.map(function (i) {
                    return _path + "\\" + i;
                });
                _fc(files);
            });
        } catch (err) {

        }
        //            pa.forEach(function (ele, index) {
        //                console.info(ele,index);
        ////                var info = fs.statSync(_pt + "\\" + ele);
        ////                if (info.isDirectory()) {
        ////                    console.log("dir: " + ele);
        ////                    readDirSync(_pt + "\\" + ele);
        ////                } else {
        ////                    console.log("file: " + ele);
        ////                }
        //            });
    },
    delFile(_path, _fc) {
        try {
            fs.unlink(root + "\\" + _path, (err) => {
                if (err) {
                    console.error(err);
                    _fc(err, {
                        success: false
                    });
                }
                _fc(err, {
                    msg: "删除成功!",
                    success: true
                });
            });
        } catch (err) {
            console.info("文件处理错误 !");
        }
    }
}
