var config = require('../knexfile.js');
var env = process.env.NODE_ENV || 'development';
var knex = require('knex')(config[env]);

const getRoom = (listingId) => {
  return knex('listings')
    // .select('*')
    // .join('bookings', (builder) => {
    //   builder.on('listings.id', 'bookings.listing_id').on('bookings.listing_id', knex.raw('?', [listingId]))
    // })
    // .join('bookings', {'listings.id': 'bookings.listing_id'})
    // .from('listings')
    .where({id: listingId})
    .limit(1)
    .then(records => {
      return records;
    });
}


const getBookings = (listingId) => {
  return knex('bookings')
    .where ({listing_id: listingId})
    .then(records => {
      return records;
    });
}

const bookRoom = (listingId, reservation) => {
  console.log(listingId, reservation.checkIn, reservation.checkOut);
  return knex('bookings')
    .insert({checkin: reservation.checkIn, checkout: reservation.checkOut, numGuests: reservation.numGuests, total: reservation.total, listing_id: listingId});
}

module.exports = knex;
module.exports.getRoom = getRoom;
module.exports.bookRoom = bookRoom;
module.exports.getBookings = getBookings
knex.migrate.latest([config]);