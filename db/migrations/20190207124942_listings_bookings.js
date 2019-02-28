
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('listings', function(table) {
      table.increments('id').primary();
      table.integer('price');
      table.decimal('stars');
      table.integer('reviews');
      table.integer('cleaningFee');
      table.integer('serviceFee');
      table.integer('guests');
      table.integer('minNights');
      table.text('title');
      table.text('address');
      table.text('highlights');
      table.text('introDesc');
      table.text('spaceDesc');
      table.text('guestDesc');
      table.text('otherDesc');
    }),

    knex.schema.createTable('bookings', function(table) {
      table.increments('id').primary();
      table.string('checkin');
      table.string('checkout');
      table.integer('numGuests');
      table.integer('total');
      table.integer('listing_id').unsigned()
        .references('listings.id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('bookings'),
    knex.schema.dropTable('listings')
  ]);
};