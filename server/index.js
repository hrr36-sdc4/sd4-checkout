const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
// const postgres = require('../db/query.js');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../public'));

let port = 3000;

// calls getUsers to query the db with a variable listingId and returns the entry that matchs the params
app.get('/rooms/:listingId', (req, res) => {
  db.getRoom(req.params.listingId).then(records => {
    console.log('server get listings: ', records);
    res.send(records);
  });
});

app.get('/rooms/bookings/:listingId', (req, res) => {
  db.getBookings(req.params.listingId).then(records => {
    console.log('server get bookings: ', records);
    res.send(records);
  });
});

app.post('/rooms/:listingId', (req, res) => {
  console.log(req.body);
  db.bookRoom(req.params.listingId, req.body)
    .then(() => {
      res.end();
    });
});

var server = app.listen(port, function() {
  console.log(`listening on post ${port}`);
});

module.exports = server;