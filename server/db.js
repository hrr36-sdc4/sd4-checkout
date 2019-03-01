var config = require('../knexfile.js');
var env = process.env.NODE_ENV || 'development';
var knex = require('knex')(config[env]);

const getRoom = (listingId) => {
  return knex('listings')
    .where({id: listingId})
    .limit(1)
    .then(records => {
      return records;
    });
}

const addRoom = (room) => {
  return knex('listings')
    .insert({
      price: room.price,
      stars: room.stars,
      reviews: room.reviews,
      cleaningFee: room.cleaningFee,
      serviceFee: room.serviceFee,
      guests: room.guests,
      minNights: room.minNights,
      title: room.title,
      address: room.address,
      highlights: room.highlights,
      introDesc: room.introDesc,
      spaceDesc: room.spaceDesc,
      guestDesc: room.guestDesc,
      otherDesc: room.otherDesc,
    });
}

const deleteListing = (listingId) => {
  return knex('listings')
    .where({id: listingId})
    .del();
}

const updateListing = (listingId, updated) => {
  return knex('listings')
    .where({id: listingId})
    .update(updated);
}

const getBookings = (listingId) => {
  return knex('bookings')
    .where ({listing_id: listingId})
    .then(records => {
      return records;
    });
}

const bookRoom = (listingId, reservation) => {
  return knex('bookings')
    .insert({checkin: reservation.checkIn, checkout: reservation.checkOut, numGuests: reservation.numGuests, total: reservation.total, listing_id: listingId});
}

const deleteBooking = (bookingId) => {
  return knex('bookings')
    .where('id', bookingId)
    .del();
}

const updateBooking = (bookingId, data) => {
  return knex('bookings')
    .where('id', bookingId)
    .update(data);
}


module.exports = knex;
module.exports.getRoom = getRoom;
module.exports.addRoom = addRoom;
module.exports.updateListing = updateListing;
module.exports.deleteListing = deleteListing;
module.exports.getBookings = getBookings;
module.exports.bookRoom = bookRoom;
module.exports.deleteBooking = deleteBooking;
module.exports.updateBooking = updateBooking;
knex.migrate.latest([config]);