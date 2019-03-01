const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../public'));

let port = 3000;

app.route('/rooms/:listingId')
  .get((req, res) => {
    db.getRoom(req.params.listingId)
      .then(records => res.send(records))
      .catch(err => console.log(err));
  })
  .delete((req, res) => {
    db.deleteListing(req.params.listingId)
      .then(() => res.end())
      .catch(err => console.log(err));
  })
  .update((req, res) => {
    db.updateListing(req.params.listingId, req.body)
      .then(() => res.end())
      .catch(err => console.log(err));
  })

app.post('/rooms/', (req, res) => {
  db.addRoom(req.body)
    .then(() => res.end())
    .catch(err => console.log(err));
});

app.route('/rooms/bookings/:listingId')
  .get((req, res) => {
    db.getBookings(req.params.listingId)
      .then(records => res.send(records))
      .catch(err => console.log(err));
  })
  post((req, res) => {
    db.bookRoom(req.params.listingId, req.body)
      .then(() => res.end())
      .catch(err => console.log(err));
  });

app.route('/rooms/bookings/:bookingId')
  .delete((req, res) => {
    db.deleteBooking(req.params.bookingId)
      .then(() => res.end())
      .catch(err => console.log(err));
  })
  .update((req, res) => {
    db.updateBooking(req.params.bookingId, req.body)
      .then(() => res.end())
      .catch(err => console.log(err));
  });

var server = app.listen(port, function() {
  console.log(`listening on post ${port}`);
});

module.exports = server;
