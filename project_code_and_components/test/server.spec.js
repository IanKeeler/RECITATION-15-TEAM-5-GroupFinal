// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });

  // ===========================================================================
  // TO-DO: Part A Login unit test case
  // test cases tested against test database; should fix later when real db functions
  it('positive : /login', done =>{
    chai 
      .request(server)
      .post('/login')
      .send({username: 'testuser1', password: 'pass123'})
      .end((err, res)=>{
        expect(res).to.have.status(200);
        done();
      });
  });

  // login: invalid password
  it('negative : /login. Checking invalid password', done => {
    chai
      .request(server)
      .post('/login')
      .send({username: 'testuser1', password: 'wrongpass'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Error: Incorrect password');
        done();
      });
  });

  // PART B: POSITIVE/NEGATIVE TEST ON REGISTER

  // register: successful registration
  it('positive: /register.  Checking for successful user registration', done =>{
    chai
      .request(server)
      .post('/register')
      .send({username: 'userx', password: 'passxyz'})
      .end((err, res)=>{
        expect(res).to.have.status(200);
        done();
      });
  });

  // register: duplicate user
  it('negative: /register.  Checks for duplicate username', done=>{
    chai
      .request(server)
      .post('/register')
      .send({username: 'user1', password: 'whatever'})
      .end((err, res=>{
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Error: Username taken');
        done();
      }))
  })
});