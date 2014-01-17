//setup Dependencies
var express = require('express')
    , mongoose = require('mongoose')
    , port = (process.env.PORT || 8081);

//Setup Express
var server = express();
server.set('views', __dirname + '/views');
server.set('view options', { layout: false });
server.use(express.bodyParser());
server.use(express.cookieParser());
server.use(express.static(__dirname + '/static'));
server.listen(port);

//DB connection
//mongoose.connect('mongodb://mephasto:Floryudoka1@ds045027.mongolab.com:45027/vidrio-website');
//var models = require('./models');

server.locals = { 
                  title : 'ProSonus'
                  ,description: ''
                  ,author: ''
                  ,analyticssiteid: 'XXXXXXX'
                  ,blog: false
                  ,gallery: false
                  ,form: false
                  ,email: false
                }

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////
// HOME
server.get('/', function(req,res){
  res.render('index.jade', {
              activeNav : 'home',
              activeSubNav : 'none'
            }
  );
});

// STUDIO
server.get('/studio/', function(req,res){
  res.render('studio.jade', {
              activeNav : 'studio',
              activeSubNav : 'studio'
            }
  );
});
// VIVO/
server.get('/live/', function(req,res){
  res.render('live.jade', {
              activeNav : 'live',
              activeSubNav : 'live'
            }
  );
});
server.get('/live/presupuesto', function(req,res){
  res.render('presupuesto.jade', {
              activeNav : 'live',
              activeSubNav : 'presupuesto',
              form: true,
              email: true
            }
  );
});


//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

console.log('Listening on http://0.0.0.0:' + port );
