var http  = require('http');
var redis = require("redis"),
    client = redis.createClient();
var jsdom = require('jsdom');
var $ = require('jquery');
var bukkit_latest = [];
var bukkit_alphabetical = [];
var bukkit_changed = [];

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

function checkUpdates() {
    var l, a;

    // Get Latest list
    jsdom.env({
      html: 'http://bukk.it/?C=M;O=D',
      scripts: [
        'http://code.jquery.com/jquery-1.5.min.js'
      ],
      done: function(errors, window) {
        l = [];
        var $ = window.$;
        console.log('HN Links');
        $('td a').each(function() {
          l.push('http://bukk.it/' + $(this).text());
        });
        $.grep(bukkit_latest, function(el){
            bukkit_changed = $.inArray(el, l) == -1;
        });
        console.log(l);
        console.log('new items: ' + bukkit_changed);
      }
    });

    // Get Alphabetical list
    jsdom.env({
      html: 'http://bukk.it/',
      scripts: [
        'http://code.jquery.com/jquery-1.5.min.js'
      ],
      done: function(errors, window) {
        a = [];
        var $ = window.$;
        console.log('HN Links');
        $('td a').each(function() {
          a.push('http://bukk.it/' + $(this).text());
        });
      }
    });
}

checkUpdates();

