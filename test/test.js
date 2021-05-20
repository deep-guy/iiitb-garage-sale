const express = require('express');
const chai = require('chai');
const request = require('supertest');


const app = express();
describe('POST Login user', () => {
    it('should login a valid user', () => {
        request(app)
        .post('123456/wallet')
        .send({})
        .expect(201)
        .then((res) => {
        expect(res.headers.location).to.be.eql('123456/wallet');
         // more validations can be added here as required
});
});