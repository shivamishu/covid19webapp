// Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);


describe('Get containment zone results', () => {
    it('it should get the containment zones  ', (done) => {
        let data = {
            city: "Bangalore"
        }
        chai.request('http://localhost:443/api').post('/containmentresults').send(data).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.cityResults.length.should.be.greaterThan(9);
            done();
        });
    });
});