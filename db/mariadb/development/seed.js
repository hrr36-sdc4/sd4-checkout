const faker = require('faker');

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
  highlights: faker.lorem.paragraph(nb_sentences=faker.random.number({'min': 1, 'max': 4})),
  introDesc: faker.lorem.paragraph(nb_sentences=5, variable_nb_sentences=true),
  spaceDesc: faker.lorem.paragraphs(nb=faker.random.number({'min': 1, 'max': 6})),
  guestDesc: faker.lorem.paragraphs(nb=faker.random.number({'min': 1, 'max': 3})),
  otherDesc: faker.lorem.paragraphs(nb=faker.random.number({'min': 1, 'max': 3}))
});

const createFakeBookings = (listingId) => {
  let bookings = [];
  let start = 1;
  let end = 90;
  while (start < end) {
    start = faker.random.number({'min': start, 'max': end});
    let until = Math.min(faker.random.number({'min': 3, 'max': 5}) + start, end);
    let startMonth = start < 32 ? 3 : start < 62 ? 4 : 5;
    let startDay = start < 32 ? start : start < 62 ? start - 31 : start - 61;
    let untilMonth = until < 32 ? 3 : until < 62 ? 4 : 5;
    let untilDay = until < 32 ? until : until < 62 ? until - 31 : until - 61;
    bookings.push({
      checkin: `0${startMonth}-${startDay < 10 ? '0' + startDay : startDay}-2019`,
      checkout: `0${untilMonth}-${untilDay < 10 ? '0' + untilDay : untilDay}-2019`,
      numGuests: faker.random.number({'min': 1, 'max': 4}),
      total: faker.random.number({'min': 100, 'max': 3000}),
      listing_id: listingId,
    })
  }
  return bookings;
};

exports.seed = async function(knex, Promise) {
  let fakeListings = [];
  let fakeBookings = [];
  const desiredfakeListings = 100;
  let start = Date.now();
  for (let i = 0; i < desiredfakeListings; i++) {
    fakeListings.push(createFakeListings());
    fakeBookings.concat(createFakeBookings());
  }
  await knex('listings')
    .insert(fakeListings);
  await knex('bookings')
    .insert(fakeBookings);

  let end = Date.now();
  let min = (start - end) * -1.666e-5;
  let sec = Math.floor((min - Math.floor(min)) * 60);
  console.log(`Total Time to seed db: ${Math.floor(min)} minutes ${sec} seconds`);
};

