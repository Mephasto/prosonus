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
mongoose.connect('mongodb://mephasto:Floryudoka1@ds045027.mongolab.com:45027/vidrio-website');
var models = require('./models');

server.locals = { 
                  title : 'VIDRIO Trip Instrumental'
                  ,description: ''
                  ,author: ''
                  ,analyticssiteid: 'XXXXXXX'
                  ,blog: false
                  ,gallery: false
                  ,message: null
                }

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

// SHOWS - ABM
server.get('/shows/new', function(req,res){
  res.render('newShow.jade');
});
server.post('/shows/new', function(req,res){
  var show = new models.Show(req.body);
  show.save(function(err){
    if(err === null){
      res.render('newShow.jade', {message : 'Nueva fecha creada!'});
    }
  });
});

server.get('/shows/delete', function(req,res){
  res.render('delShow.jade');
});
server.post('/shows/delete', function(req,res){
  return models.Show.findById(req.body.id, function (err, show) {
    if (!show){ return res.render('delShow.jade', {message : 'No existe la fecha!'}); }
    return show.remove(function (err) {
      if (!err) {
        // removed!
        return res.render('delShow.jade', {message : 'Fecha borrada!'});
        console.log("removed");
      } else {
        res.render('delShow.jade', {message : 'Error! - {id: ' + id + '}'});
        // NOT removed!
        console.log(err);
      }
    });
  });
});

server.get('/shows/list', function(req,res){
  models.Show.find({}, function (err, shows) {
    res.send(shows);
  });
});

// SHOWS
server.get('/shows', function(req,res){
  var query = models.Show.find();
  query.sort('date').execFind(function (err, shows) {
    if(err === null){
      res.render('shows.jade', { 
                  title : 'VIDRIO - Shows',
                  shows : shows,
                  activeNav : 'shows'
                }
      );
    }
  });
});

// HOME
server.get('/', function(req,res){
  models.Show.find({$query: {}, $orderby: { date : 1 } }, function (err, shows) {
    if(err === null){
      res.render('index.jade', {
                  title : 'VIDRIO Trip Instrumental',
                  activeNav : 'home',
                  shows : shows,
                  blog : true
                }
      );
    }
  });
});

// VIDEOS
server.get('/videos', function(req,res){
  res.render('videos.jade', {
              title : 'VIDRIO - Videos',
              activeNav : 'videos'
            }
  );
});

//ALBUMS
server.get('/albums', function(req,res){
  res.render('albums.jade', {
              title : 'VIDRIO - Albums',
              activeNav : 'albums'
            }
  );
});

//PHOTOS
server.get('/photos', function(req,res){
  res.render('photos.jade', {
              title : 'VIDRIO - Fotos',
              activeNav : 'fotos',
              gallery: true
            }
  );
});

//BIO
server.get('/bio', function(req,res){
  res.render('bio.jade', {
              title : 'VIDRIO - Bio',
              activeNav : 'bio'
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
