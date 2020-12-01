// Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);


describe('Get the containment cities', () => {
    it('it should get the containment cities  ', (done) => {
        let data = {
            latitude: null,
            longitide: null
        }
       
        chai.request('https://covid19healthcare.cfapps.us10.hana.ondemand.com/api').post('/containmentcities').send(data).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.cities.length.should.be.eql(3);
            done();
        });
    });
});




