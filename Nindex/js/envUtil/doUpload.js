var fs=require("fs");
/**express 上传模块支持,要单独 install*/
var multer  = require('multer');
//设置临时目录.
var upload = multer({ dest: 'uploads/' });
var UploadDeal=function(Nindex,path){
    this.Nindex=Nindex;
    this._uploadedFilePath=path;
};
var _single=function(req,res,next,_uploaded){
    // 获得文件的临时路径
         var tmp_path = req.file.path;
         var filename = req.file.originalname.split(".");
         var sufix = filename[filename.length - 1];
         // 指定文件上传后的目录 - 示例为"images"目录。 
         var target_path = NUploadDeal._uploadedFilePath+ req.file.filename + "." + sufix;
        // 移动文件
        fs.rename(tmp_path, target_path, (err) =>{
            if (err) {throw err;}
            // 删除临时文件夹文件, 
            try{
                fs.unlink(tmp_path,(err) =>{
                    if (err) {console.error(err);}
                    _uploaded(res,{
                        tmp_path:tmp_path,
                        target_path:target_path,
                        real_name:req.file.originalname,
                        file:req.file
                        },req);
                    });
                }catch(er){
                    res.send("文件解析错误!");
                }
             });
};

var _mltipart=function(req,res,next,_every,_uploaded){
    // 获得文件的临时路径
         var _files = req.files;
        var _res_data=[];
        _files.filter(i=>!!(i.filename)).forEach(i=>{
            var tmp_path = i.path;
            var filename=i.originalname.split(".");
            var sufix=filename[filename.length-1];
            // 指定文件上传后的目录 - 示例为"images"目录。 
            var target_path = NUploadDeal._uploadedFilePath + i.filename+"."+sufix;
            // 移动文件
            fs.renameSync(tmp_path, target_path);//同步保存!不能再用unlink.
            var _o_={
                    tmp_path:tmp_path,
                    target_path:target_path,
                    real_name:i.originalname,
                    file:i
                };
            _res_data.push(_o_);
            _every(_o_);
            });
            _uploaded(res, _res_data,req);
            res.end();
};
var SINGLE=function(Nindex,opts){
    this.link=Nindex.post(opts.url,upload.single(opts.field),(req,res,next)=>{
        _single(req,res,next,opts.uploaded);
    });
};
var MULTI=function(Nindex,opts){
    this.link=Nindex.post(opts.url,upload.array(opts.field, opts.max),(req, res,next)=>{
        _mltipart(req,res,next,opts.every||function(){},opts.uploaded);
    });
};
UploadDeal.prototype.single=function(opts){
    return new SINGLE(this.Nindex,opts);
};
UploadDeal.prototype.multipart=function(opts){
    return new MULTI(this.Nindex,opts);
};
var NUploadDeal=null;
module.exports=function(Nindex,path="./view/file/"){
    NUploadDeal=NUploadDeal||new UploadDeal(Nindex,path);
    return NUploadDeal;
};
