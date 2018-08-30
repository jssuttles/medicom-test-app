const moment = require('moment');

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    firstName: 'Alice',
    lastName: 'Dean',
    email: 'alicedean@email.com',
    profilePic: '2.jpg',
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  }, {
    firstName: 'Jack',
    lastName: 'Smitty',
    profilePic: '1.jpg',
    email: 'jacksmitty@email.com',
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  }]),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {}),
};
