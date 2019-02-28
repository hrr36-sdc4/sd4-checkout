const faker = require('faker');

const createFakeData = () => ({
  price: faker.random.number({
    'min': 70,
    'max': 150
  }),
  // stars: faker.random.number({
  //   'min': 1,
  //   'max': 5,
  // }),
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
  address: faker.address.streetAddress(),
  highlights: faker.lorem.paragraph(nb_sentences=faker.random.number({'min': 1, 'max': 4})),
  introDesc: faker.lorem.paragraph(nb_sentences=5, variable_nb_sentences=true),
  spaceDesc: faker.lorem.paragraphs(nb=faker.random.number({'min': 1, 'max': 6})),
  guestDesc: faker.lorem.paragraphs(nb=faker.random.number({'min': 1, 'max': 3})),
  otherDesc: faker.lorem.paragraphs(nb=faker.random.number({'min': 1, 'max': 3}))
});

const fakeBookings = () => ({
  checkin: '2/' + faker.random.number({'min': 2, 'max': 5}).toString(),
  checkout: '2/' + faker.random.number({'min': 6, 'max': 10}).toString(),
  listing_id: 1
});


exports.seed = async function(knex, Promise) {
  const fakeBookings = [
    {
      checkin: '02-14-2019',
      checkout: '02-18-2019',
      numGuests: 2,
      total: 500,
      listing_id: 1
    },
    {
      checkin: '02-20-2019',
      checkout: '02-27-2019',
      numGuests: 3,
      total: 888,
      listing_id: 1
    },
    {
      checkin: '03-01-2019',
      checkout: '03-05-2019',
      numGuests: 2,
      total: 358,
      listing_id: 2
    }
  ];
  const fakeData = [];
  const desiredFakeData = 100;
  for (let i = 0; i < desiredFakeData; i++) {
    fakeData.push(createFakeData());
  }
  await knex('listings')
    .insert(fakeData);
  await knex('bookings')
    .insert(fakeBookings);
};

