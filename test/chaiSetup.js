process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');

chai.use(chaiHttp);
chai.use(dirtyChai);

module.exports = chai;
