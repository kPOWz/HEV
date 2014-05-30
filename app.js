var express = require('express')
  , http = require('http')
  , path = require('path')
  , morgan = require('morgan')
  , bodyParser = require('body-parser')
  , errorHandler = require('errorhandler');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser()); 
app.use(express.static(path.join(__dirname, 'dist/public')));
app.engine('.html', require('ejs').renderFile);

var port = process.env.PORT || 8080; 

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
   app.use(errorHandler());
}

//routes
//serve the map
app.route('/')
  .get(function(req, res, next) {
      res.render('index.html');
  });

app.listen(port);
console.log("Express server listening on port " + port);





