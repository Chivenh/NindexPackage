/**使用formidable模块*/
var ndir = require('ndir');
var mod = require('express/node_modules/connect/node_modules/formidable');
var upload_path = path.join(path.dirname(__dirname), 'public/user_data/images');
ndir.mkdir(upload_path, function (err) {
  if (err) {
    throw err;
  }
  mod.IncomingForm.UPLOAD_DIR = upload_path;
});
app.post('/file-upload', function(req, res) {
 // 获得文件的临时路径
 var tmp_path = req.files.thumbnail.path;
// 指定文件上传后的目录 - 示例为"images"目录。 
var target_path = './public/images/' + req.files.thumbnail.name;
// 移动文件
fs.rename(tmp_path, target_path, function(err) {
  if (err) throw err;
  // 删除临时文件夹文件, 
  fs.unlink(tmp_path, function() {
     if (err) throw err;
     res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
  });
});
    
   /**使用multer模块*/ 
    var express = require('express')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var app = express()
    
app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})

app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
})

var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
})
    /**or like here*/
    var upload = multer({dest:"uploads/"}).single('avatar');

app.post('/profile', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
        console.log(req.body);   //打印请求体
        console.log(req.file);   
      // An error occurred when uploading
      return
    }

    // Everything went fine
  })
})
