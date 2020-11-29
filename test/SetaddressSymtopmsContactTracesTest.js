// Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);
let token;

describe('Set address', () => {
    it('it should set address ', (done) => {
        let data = {
            mobile_no: "9028747566",
            age: 22,
            sex: 0,
            street: "Test street",
            city: "Bangalore",
            fname: "Test123",
            lname: "test123",
            state_id: "KA",
            country: "India",
            latitude: null,
            longitude: null,
            location_updated_on: new Date().toString(),
            address_updated_on: new Date().toString(),
            updated_on: new Date().toString()


        }
        chai.request('http://localhost:443/api').post('/setaddress').send(data).end((err, res) => {
            res.should.have.status(200);
           	token = res.body.token;
            done();
        });
    });
});




describe('Get symptoms', () => {
    it('it Get symptoms ', (done) => {
        let data = {
           fever:true,
           sneeze:true,
           breathless:true,
           contact:true,
           hbp:true,
           worse:true,
           status:"",
           mobile_no:9028747566
            
        }
        chai.request('http://localhost:443/api').post('/symptoms').set("Authorization", "Bearer " + token).send(data).end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});

describe('Contact traces ', () => {
    it('contact traces  ', (done) => {
        let data = {
           contact_id: 1,
           contact_name:"xyz",
           contact_number:2222222229,
           contact_address:"delhi"         
        }
        chai.request('http://localhost:443/api').post('/contacttraces').set("Authorization", "Bearer " + token).send(data).end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});


