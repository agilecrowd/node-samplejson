var io = require('socket.io')();
// var moment = require('moment');
// var logger = require('intel');
var _ = require('lodash');
var r = require('rethinkdb');
var config = require('./config.json')

var connection;

r.connect({host: config.rethinkdb.host, port: config.rethinkdb.port}, function(err, conn) {
  if(err) throw err;
  connection = conn;

  r.db(config.rethinkdb.db).table('materials')
    .orderBy({index: r.desc('id')})
    .changes()
    .run(connection, function(err, cursor){
      if (err) throw err;
      io.sockets.on('connection', function(socket){
        cursor.each(function(err, row){
          if(err) throw err;
          io.sockets.emit('materials_updated', row);
        });
      });
  });
});

module.exports = io;
