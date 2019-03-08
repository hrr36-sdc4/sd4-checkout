const faker = require('faker');
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
var csvWriter = require('csv-write-stream')
var writer = csvWriter()
var env = process.env.NODE_ENV || 'development';

const createFakeListings = (id) => ({
  id: id,
  price: faker.random.number({
    'min': 70,
    'max': 150
  }),
  stars: faker.finance.amount(3,5,2),
  reviews: faker.random.number({
    'min': 10,
    'max': 300
  }),
  cleaning_fee: faker.random.number({
    'min': 30,
    'max': 70
  }),
  service_fee: faker.random.number({
    'min': 50,
    'max': 100
  }),
  guests: faker.random.number({
    'min': 1,
    'max': 4
  }),
  min_nights: faker.random.number({
    'min': 1,
    'max': 3
  }),
  title: faker.name.firstName() + `'s ` + faker.company.catchPhraseAdjective() + ' Home',
  address: faker.address.city(),
  highlights: faker.random.words(1),
  intro_desc: faker.random.words(1),
  space_desc: faker.random.words(1),
  guest_desc: faker.random.words(1),
  other_desc: faker.random.words(1)
});

const createFakeBookings = (listingId, current) => {
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
    const id = current + bookings.length;
    bookings.push({
      id: id,
      checkin: `0${startMonth}-${startDay < 10 ? '0' + startDay : startDay}-2019`,
      checkout: `0${untilMonth}-${untilDay < 10 ? '0' + untilDay : untilDay}-2019`,
      num_guests: faker.random.number({'min': 1, 'max': 4}),
      total: faker.random.number({'min': 100, 'max': 3000}),
      listing_id: listingId,
    })
    start = until + 1;
  }
  return bookings;
};

const seed = async function() {
  let count = 0;
  const batchSize = 1000;
  const batchCount = 10000;
  const start = Date.now();
  var writer = csvWriter({ 
    headers: [
      "id", "price", "stars", "reviews", "cleaning_fee", "service_fee", "guests", "min_nights", "title", "address", "highlights", "intro_desc", "space_desc", "guest_desc", "other_desc"
    ]
  });
  writer.pipe(fs.createWriteStream('./db/cassandra/listings.csv'));
  while (count < batchCount) {
    let fakeListings = [];
    for (let i = 1; i <= batchSize; i++) {
      fakeListings.push(createFakeListings((batchSize * count) + i));
    }
    fakeListings.map(listing => writer.write(listing));
    count++;
    if (count % 1000 === 0) {
      console.log(`Added ${count*batchSize} listings`);
    }
  }
  writer.end();

  let end = Date.now();
  let min = (start - end) * -1.666e-5;
  let sec = Math.floor((min - Math.floor(min)) * 60);
  console.log(`Total Time to seed ${batchSize*batchCount} listings: ${Math.floor(min)} minutes ${sec} seconds`);

  writer = csvWriter({ 
    headers: [
      "id", "checkin", "checkout", "num_guests", "total", "listing_id"
    ]
  });
  writer.pipe(fs.createWriteStream('./db/cassandra/bookings.csv'));
  count = 0;
  let total = 0;
  while (count < batchCount) {
    let fakeBookings = [];
    for (let i = 1; i <= batchSize; i++) {
      fakeBookings = fakeBookings.concat(createFakeBookings((batchSize * count) + i, total + fakeBookings.length));
    }
    total += fakeBookings.length;
    fakeBookings.map(booking => writer.write(booking));
    count++;
    if (count % 1000 === 0) {
      console.log(`Added ${total} bookings`);
    }
  }
  writer.end();
  let oldEnd = end;
  end = Date.now();
  min = (oldEnd - end) * -1.666e-5;
  sec = Math.floor((min - Math.floor(min)) * 60);
  console.log(`Total Time to seed ${total} bookings: ${Math.floor(min)} minutes ${sec} seconds`);
  min = (start - end) * -1.666e-5;
  sec = Math.floor((min - Math.floor(min)) * 60);
  console.log(`Total Time: ${Math.floor(min)} minutes ${sec} seconds`);
};

seed();