require('newrelic');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const compression = require('compression');
const redis = require('redis');

let app = express();
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../public'));

let port = process.env.PORT || 3000;
const client = redis.createClient();

const redisMiddleware = (req, res, next) => {
  const key = `__express__${req.originalUrl}` || req.url;
  client.get(key, (err, reply) => {
    if (reply) {
      res.send(reply);
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        client.set(key, JSON.stringify(body));
        res.sendResponse(body);
      };
      next();
    }
  });
};


app.route('/rooms/:listingId')
  .get(redisMiddleware, (req, res) => {
    db.getRoom(req.params.listingId)
      .then(records => res.send(records))
      .catch(err => console.log(err));
  })
  .delete((req, res) => {
    db.deleteListing(req.params.listingId)
      .then(() => res.end())
      .catch(err => console.log(err));
  })
  .put((req, res) => {
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
  .get(redisMiddleware, (req, res) => {
    db.getBookings(req.params.listingId)
      .then(records => res.send(records))
      .catch(err => console.log(err));
  })
  .post((req, res) => {
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
  .put((req, res) => {
    db.updateBooking(req.params.bookingId, req.body)
      .then(() => res.end())
      .catch(err => console.log(err));
  });

var server = app.listen(port, function() {
  console.log(`listening on post ${port}`);
});

module.exports = server;
