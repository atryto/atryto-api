import App from "../../app";
import {expect} from "chai";
import IUser from "../../models/iUser";
import "mocha";
import UsersService from "../../services/users";
import ResetDb from "../resetDb";
import UserDAO from "../../daos/userDAO";

/*
CURL Commands:
CREATE USER: curl -H "Content-Type: application/json" -X POST --data '{"email": "test@test.com", "username":"test", "password":"test"}' http://localhost:3000/users
LOGIN: curl -H "Content-Type: application/json" -X POST --data '{"email": "test@test.com", "username":"test", "password":"test"}' http://localhost:3000/users/login
PUT Auth: curl -H "Content-Type: application/json" -X PUT --data '{"email": "test@test.com", "username":"test", "password":"test"}' --header "x-access-token: 123" http://localhost:3000/users

**/

describe("Users Endpoints", function() {
  const server = new App();
  const service = new UsersService();
  const dao = new UserDAO();
  const fastify = server.getFastify();
  let user: IUser, token: String;

  before( async () => { await ResetDb.run() });

  describe("POST /users", function() {
    it("Should fail because there is no cityslug defined for user", (done) => {
      fastify.inject({
        method: "POST",
        url: "/users",
        payload: {
          email: 'user@test.com',
          username: 'user1',
          password: 'test'
        },
      }, async (err, res) => {
        expect(res.statusCode).to.be.equal(500);
        expect(res.payload).to.exist;
        expect(JSON.parse(res.payload).message).to.exist;
        expect(JSON.parse(res.payload).message).to.contain('ER_NO_DEFAULT_FOR_FIELD: Field \'cityslug\'');
        done();
      });
    });
  
    it("Should create a user", (done) => {
      fastify.inject({
        method: "POST",
        url: "/users",
        payload: {
          email: 'user@test.com',
          username: 'user1',
          password: 'test',
          cityslug: 'toronto',
        },
      }, async (err, res) => {
        expect(err).to.be.null;
        expect(res.statusCode).to.be.equal(200);
        expect(res.headers["content-type"]).to.be.equal("application/json");
        const users = await service.get({} as IUser);
        expect(users).to.have.lengthOf(1);
        user = users[0];
        expect(user.email).to.be.equal('user@test.com');
        expect(user.username).to.be.equal('user1');
        expect(user.password).to.not.exist;
        done();
      });
    });
  
    it("Should not allow SQL Injection", (done) => {
      fastify.inject({
        method: "POST",
        url: "/users",
        payload: {
          email: 'user2@test.com',
          username: 'user2; DELETE FROM exchanges.users;',
          password: 'test',
          cityslug: 'toronto',
        },
      }, async (err, res) => {
        expect(err).to.be.null;
        expect(res.statusCode).to.be.equal(200);
        expect(res.headers["content-type"]).to.be.equal("application/json");
        const users = await service.get({} as IUser);
        expect(users).to.have.lengthOf(2);
        const notInjectionUser = users[1];
        expect(notInjectionUser.username).to.be.equal('user2; DELETE FROM exchanges.users;');
        done();
      });
    });
  });

  describe("POST /users/login", function() {
    it("Should login user and return token", (done) => {
      fastify.inject({
        method: "POST",
        url: "/users/login",
        payload: {
          email: 'user@test.com',
          password: 'test'
        },
      }, async (err, res) => {
        expect(err).to.be.null;
        expect(res.statusCode).to.be.equal(200);
        expect(res.headers["content-type"]).to.be.equal("application/json");
        const tokenData = JSON.parse(res.payload);
        expect(tokenData).to.have.property('token');
        token = tokenData.token;
        done();
      });
    });
  });  
  describe("PUT /users", function() {
    it("Should fail without token", (done) => {
      fastify.inject({
        method: "PUT",
        url: `/users/${user.id}`,
      }, async (err, res) => {
        expect(err).to.be.null;
        expect(res.statusCode).to.be.equal(401);
        expect(res.headers["content-type"]).to.be.equal("application/json");
        expect(res.payload).to.exist;
        expect(JSON.parse(res.payload).message).to.exist;
        expect(JSON.parse(res.payload).message).to.contain('token provided');
        done();
      });
    });
  
    it("Should should fail if try to modify email", (done) => {
      fastify.inject({
        method: "PUT",
        url: `/users/${user.id}`,
        headers: {
          'x-access-token': token
        },
        payload: {
          email: 'new_email@gmail.com',
        },
      }, async (err, res) => {
        expect(res.statusCode).to.be.equal(500);
        expect(res.payload).to.exist;
        expect(JSON.parse(res.payload).message).to.exist;
        expect(JSON.parse(res.payload).message).to.contain('email cannot be modified');
        done();
      });
    });
  
    it("Should should fail if try to modify username", (done) => {
      fastify.inject({
        method: "PUT",
        url: `/users/${user.id}`,
        headers: {
          'x-access-token': token
        },
        payload: {
          username: 'new_name',
        },
      }, async (err, res) => {
        expect(res.statusCode).to.be.equal(500);
        expect(res.payload).to.exist;
        expect(JSON.parse(res.payload).message).to.exist;
        expect(JSON.parse(res.payload).message).to.contain('username cannot be modified');
        done();
      });
    });
    
    it("Should be authenticated with token", (done) => {
      fastify.inject({
        method: "PUT",
        url: `/users/${user.id}`,
        headers: {
          'x-access-token': token
        },
        payload: {
          cityslug: 'vancouver',
        },
      }, async (err, res) => {
        expect(err).to.be.null;
        expect(res.statusCode).to.be.equal(200);
        const updatedUser = await dao.getById(user.id);
        expect(user.cityslug).to.not.equal(updatedUser.cityslug);
        expect(res.headers["content-type"]).to.be.equal("application/json");
        done();
      });
    });
  });


  describe("GET /users", function() {
    it("Should return 2 users", (done) => {
      fastify.inject({
        method: "GET",
        url: "/users"
      }, async (err, res) => {
        expect(err).to.be.null;
        expect(res.statusCode).to.be.equal(200);
        expect(res.headers["content-type"]).to.be.equal("application/json");
        expect(res.payload).to.exist;
        const users = JSON.parse(res.payload).result;
        expect(users).to.exist;
        expect(users).to.have.lengthOf(2);
        done();
      });
    });
  });

});
