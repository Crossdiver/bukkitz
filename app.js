
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();
var http  = require('http');
var redis = require("redis"),
    client = redis.createClient();
var jsdom = require('jsdom');
var $ = require('jquery');
var bukkit_latest = [];
var bukkit_alphabetical = [];
var bukkit_changed = [];

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Bukkit Scraper Logic

// check if an element exists in array using a comparer function
// comparer : function(currentElement)
Array.prototype.inArray = function(comparer) { 
    for(var i=0; i < this.length; i++) { 
        if(comparer(this[i])) return true; 
    }
    return false; 
}; 

// adds an element to the array if it does not already exist using a comparer 
// function
Array.prototype.pushIfNotExist = function(element, comparer) { 
    if (!this.inArray(comparer)) {
        this.push(element);
    }
}; 

function sendUpdates(l) {
  console.log(l);
}


function checkUpdates() {

    // Get Latest list
    jsdom.env({
      html: 'http://bukk.it/',
      scripts: [
        'http://code.jquery.com/jquery-1.5.min.js'
      ],
      done: function(errors, window) {
        var g = client.incr('generation_count', function(err, g){
          l = [];
          var $ = window.$;
          $('td a').each(function() {
            client.zadd('bukkitz', g, $(this).text());
            console.log(g);
          });
          sendUpdates(client.zrange('bukkitz', g, g));
        });
      }
    });
}

checkUpdates();

// Routes

app.get('/', routes.index);

app.listen(5000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
