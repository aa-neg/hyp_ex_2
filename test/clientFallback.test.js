"use strict";

const chai = require('chai');
const expect = chai.expect;

const api = require('../server/api.js');

let backUpTrigger = false;

let mockMainClient = function(testBody) {
    return new Promise(function(resolve, reject) {
        if (testBody.failOnce) {
            reject({errors:'sendgrid error', client: 'mainClient'})
        } else {
            resolve({message: 'success'})
        }
    })
} 

let mockBackupClient = function(testBody) {
    return new Promise(function(resolve, reject) {
        if (testBody.failTwice) {
            reject({errors:'mailgun error', client: 'backupClient'})
            return
        } 

        backUpTrigger = true;

        resolve({message: 'success'})
       
    })
} 

describe("sendEmail", function() {
    it("Should return true if first client successfull", function(done) {
        api.sendEmail({}, mockMainClient, mockBackupClient)
        .then((result)=> {
            expect(result.success).to.eql(true);
            done();
        })
    })

    it("Should fallback to back-up client ", function(done) {
        backUpTrigger = false;
        api.sendEmail({failOnce: true},  mockMainClient, mockBackupClient)
        .then((result)=> {
            expect(result.success).to.eql(true);
            expect(backUpTrigger).to.eql(true);
            done()
        })
    });

    it("Should not succeed if both clients fail", function(done) {
        backUpTrigger = false;
        api.sendEmail({failOnce: true, failTwice: true},  mockMainClient, mockBackupClient)
        .then((result)=> {
        })
        .catch((error)=> {
            expect(error.errors.length).to.eql(2);
            expect(error.success).to.eql(false);
            done()
        })
    })
})