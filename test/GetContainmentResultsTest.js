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
        chai.request('https://covid19healthcare.cfapps.us10.hana.ondemand.com/api').post('/containmentresults').send(data).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.cityResults.length.should.be.greaterThan(9);
            done();
        });
    });
});
