var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.openId){
    res.render("loginView.html", req.sessio);
  }else{
    res.render('index', { title: 'Express' });
  }
});

module.exports = router;
