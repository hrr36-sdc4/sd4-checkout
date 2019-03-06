const faker = require('faker');
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
var env = process.env.NODE_ENV || 'development';

const createFakeListings = () => ({
  price: faker.random.number({
    'min': 70,
    'max': 150
  }),
  stars: faker.finance.amount(3,5,2),
  reviews: faker.random.number({
    'min': 10,
    'max': 300
  }),
  cleaningFee: faker.random.number({
    'min': 30,
    'max': 70
  }),
  serviceFee: faker.random.number({
    'min': 50,
    'max': 100
  }),
  guests: faker.random.number({
    'min': 1,
    'max': 4
  }),
  minNights: faker.random.number({
    'min': 1,
    'max': 3
  }),
  title: faker.name.firstName() + `'s ` + faker.company.catchPhraseAdjective() + ' Home',
  address: faker.address.city(),
  highlights: faker.random.words(1),
  introDesc: faker.random.words(1),
  spaceDesc: faker.random.words(1),
  guestDesc: faker.random.words(1),
  otherDesc: faker.random.words(1)
});

const createFakeBookings = (listingId, total) => {
  let bookings = [];
  let start = 1;
  let end = 88;
  while (start < end) {
    start = faker.random.number({'min': start, 'max': end});
    const until = faker.random.number({'min': 3, 'max': 5}) + start;
    const startMonth = start < 32 ? 3 : start < 62 ? 4 : 5;
    const startDay = start < 32 ? start : start < 62 ? start - 31 : start - 61;
    const untilMonth = until < 32 ? 3 : until < 62 ? 4 : 5;
    const untilDay = until < 32 ? until : until < 62 ? until - 31 : until - 61;
    bookings.push({
      checkin: `0${startMonth}-${startDay < 10 ? '0' + startDay : startDay}-2019`,
      checkout: `0${untilMonth}-${untilDay < 10 ? '0' + untilDay : untilDay}-2019`,
      numGuests: faker.random.number({'min': 1, 'max': 4}),
      total: faker.random.number({'min': 100, 'max': 3000}),
      listing_id: listingId,
    })
    start = until + 1;
  }
  return bookings;
};

exports.seed = async function(knex, Promise) {
  let count = 0;
  const batchSize = 8000;
  const batchCount = 1250;
  const start = Date.now();
  const inc = () => count++;
  const deleteCsv = (name) => {
    fs.unlink(`./db/mariadb/development/${name}.csv`, err => {
      if(err) {console.log('ERROR: ', err)}
    });
  }
  fs.createWriteStream('./db/mariadb/development/listings.csv');
  while (count < batchCount) {
    let fakeListings = [];
    for (let i = 1; i <= batchSize; i++) {
      fakeListings.push(createFakeListings());
    }
    await new ObjectsToCsv(fakeListings).toDisk('./db/mariadb/development/listings.csv')
    await knex.raw(`LOAD DATA LOCAL INFILE './db/mariadb/development/listings.csv'
    INTO TABLE rooms.listings
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES
    (price, stars, reviews, cleaningFee, serviceFee, guests, minNights, title, address, highlights, introDesc, spaceDesc, guestDesc, otherDesc)
    `)
    await deleteCsv('listings');
    await inc();
  }

  let end = Date.now();
  let min = (start - end) * -1.666e-5;
  let sec = Math.floor((min - Math.floor(min)) * 60);
  console.log(`Total Time to seed ${batchSize*batchCount} listings: ${Math.floor(min)} minutes ${sec} seconds`);

  count = 0;
  let total = 0;
  fs.createWriteStream('./db/mariadb/development/bookings.csv');
  while (count < batchCount) {
    let fakeBookings = [];
    for (let i = 1; i <= batchSize; i++) {
      fakeBookings = fakeBookings.concat(createFakeBookings((batchSize * count) + i, total + fakeBookings.length));
    }
    total += fakeBookings.length;
    await new ObjectsToCsv(fakeBookings).toDisk('./db/mariadb/development/bookings.csv')
    await knex.raw(`LOAD DATA LOCAL INFILE './db/mariadb/development/bookings.csv'
    INTO TABLE rooms.bookings
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES
    (checkin, checkout, numGuests, total, listing_id)
    `)
    await deleteCsv('bookings');
    await inc();
  }
  let oldEnd = end;
  end = Date.now();
  min = (oldEnd - end) * -1.666e-5;
  sec = Math.floor((min - Math.floor(min)) * 60);
  console.log(`Total Time to seed ${total} bookings: ${Math.floor(min)} minutes ${sec} seconds`);
  min = (start - end) * -1.666e-5;
  sec = Math.floor((min - Math.floor(min)) * 60);
  console.log(`Total Time: ${Math.floor(min)} minutes ${sec} seconds`);
};
