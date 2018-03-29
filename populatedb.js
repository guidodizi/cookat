#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Chef = require('./models/chef')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;

var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var chefs = []


function chefsCreate(name, cb) {  
  var chef = new Chef({
      name: name
  });
       
  chef.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Chef: ' + chef);
    chefs.push(chef)
    cb(null, chef)
  }  );
}

function createChefs(cb) {
    async.parallel([
        function(callback) {
            chefsCreate('Marco Balerio', callback);
        },
        function(callback) {
            chefsCreate('Rodrigo Nessi', callback);
        },
        function(callback) {
            chefsCreate('Sofía Molini', callback);
        }
    ],
    // optional callback
    cb);
}

async.series([
    createChefs,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




