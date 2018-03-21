var DoUpload = require("../envUtil/doUpload");
var _init = function (Nindex) {
    var _do_upload = DoUpload(Nindex); //初始化.
    _do_upload.single({
        url: "/uploadFile",
        field: "mine",
        uploaded: function (res, opts) {
            res.send("文件:File uploaded to: " + opts.target_path + ' - ' + opts.file.size + ' bytes');
        }
    });
    _do_upload.multipart({
        url: "/uploadMultiFile",
        field: "mineFile",
        uploaded: function (res, data) {
            res.send(data.map(i => JSON.stringify(i.file)).join("<br/>"));
        },
        every: function (opts) {

        }
    });
    _do_upload.single({
        url: "/uploadFile_formData",
        field: "mine_single",
        uploaded: function (res, opts) {
            res.send("文件:File formData to: " + opts.target_path + ' - ' + opts.file.size + ' bytes');
        }
    });
    _do_upload.multipart({
        url: "/uploadMultipart_formData",
        field: "mine_multipart",
        uploaded: function (res, data) {
            res.send(data.map(i => {
                var _i = i.file;
                return JSON.stringify({
                    name: _i.originalname,
                    mimetype: _i.mimetype,
                    // filename: _i.filename,
                    size: _i.size
                });
            }).join("<br/>"));
        },
        every: function (opts) {

        }
    });
    _do_upload.single({
        url: "/uploadFile_formData_data",
        field: "mine_single",
        uploaded: function (res, opts, req) {
            res.send("文件:File formData to: " + opts.target_path + ' - ' + opts.file.size + ' bytes' + "<br/>附加值 :" + req.body.fileRef);
        }
    });
};
module.exports = _init;
