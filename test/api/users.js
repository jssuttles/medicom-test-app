const chai = require('../chaiSetup');
const models = require('../../models');
const server = require('../../app');

const { expect } = chai;

describe('Users', () => {
  before(() => models.sequelize.sync({ force: true }));
  beforeEach(() => models.User.destroy({ where: { id: { $gte: 1 } } }));

  describe('/GET users', () => {
    it('it should return an empty array when no users', async () => {
      const res = await chai.request(server).get('/users');

      expect(res).to.have.status(200);
      expect(res).to.have.property('body').that.is.a('array').that.is.empty('No users');
    });

    it.skip('it should return an array of users when users exist');
  });

  describe('/POST users', () => {
    it.skip('it should create a new user');
  });
});
