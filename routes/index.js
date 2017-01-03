//Dependencies
var express = require('express');
var router = express.Router();

//Routes

//homepage
router.get('/', function(req, res){
	res.render('index');
});

//return router
module.exports = router;