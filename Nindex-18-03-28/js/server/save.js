/**操作数据库*/
let pg = require("../envUtil/pgDatabase-v1");
pg.getConnection({
    name: "myNode-1"
});
let uuid = require("../envUtil/FlyTigerUUID");

let _init = (Nindex) => {
    /**保存canvas中的数据(同名记录已存在则修改!)*/
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
};

module.exports = _init;
