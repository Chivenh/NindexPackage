var DoDeal = require("../envUtil/fileDeal");
var _init = function (Nindex) {
    Nindex.get("/getFileList", (req, res) => {
        DoDeal.readDirSync("\\view\\file", (files) => {
            res.send(files);
            res.end();
        });
    });

    Nindex.post("/delFile", (req, res) => {
        var _url = req.body.delPath;
        DoDeal.delFile(_url, (err, data) => {
            var _data = {
                success: data.success,
                err: err,
                body: req.body,
                msg: data.msg
            };
            res.send(_data);
        });
    });
};

module.exports = _init;
