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

  it('should have a five hundred error status code if unssuccessful', () => {
    return chai.request(server)
    .get('/api/v1/corgisaregreat')
    .then(response => {
    })
    .catch(response => {
      response.status.have.status(500)  
      
    })
  })

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

  it('should post a new company', () => {
    return chai.request(server)
    .post('/api/v1/companies')
    .send({
      companyName: 'Stark Industries',
      industry: 'weapons',
      location: 'New York',
      revenueGrowth: '12300000'
    })
    .then(response => {
      response.should.have.status(201)
      response.body.should.be.a('object')
      response.body.should.have.property('companyName')
      response.body.should.have.property('industry')
      response.body.should.have.property('location')
      response.body.should.have.property('revenueGrowth')
    })
    .catch(error => {
      return error;
    })
  })
});
