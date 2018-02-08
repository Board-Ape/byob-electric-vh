process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex.js');

chai.use(chaiHttp);

describe('Client Side Routes', () => {
  it('Should return the home page', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(error => {
        return error;
      });
  });

  it('should return a 404 if the route doesnt exist', () => {
    return chai.request(server)
      .get('/notgood')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(error => {
        return error;
      });
  });
});

describe('API Routes', () => {
  it('should get all of the companies', () => {
    return chai.request(server)
      .get('/api/v1/companies')
      .then(response => {
        response.status.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.res.should.be.a('object');
      })
      .catch(error => {
        return error;
      });
  });

  it('should get all the branches', () => {
    return chai.request(server)
      .get('/api/v1/branches')
      .then(response => {
        response.status.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.res.should.be.a('object');
      })
      .catch(error => {
        return error;
      });
  });
});
