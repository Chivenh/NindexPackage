var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.openId){
    res.render("loginView.html", req.session);
  }else{
    res.render('index', { title: 'Express Index' });
  }
});

module.exports = router;
