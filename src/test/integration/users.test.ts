import App from "../../app";
import {expect} from "chai";
import IUser from "../../models/iUser";
import "mocha";
import UsersService from "../../services/users";
import ResetDb from "../resetDb";
import { inspect } from "util";

/*
CURL Commands:
CREATE USER: curl -H "Content-Type: application/json" -X POST --data '{"email": "test@test.com", "username":"test", "password":"test"}' http://localhost:3000/users
LOGIN: curl -H "Content-Type: application/json" -X POST --data '{"email": "test@test.com", "username":"test", "password":"test"}' http://localhost:3000/users/login
PUT Auth: curl -H "Content-Type: application/json" -X PUT --data '{"email": "test@test.com", "username":"test", "password":"test"}' --header "x-access-token: 123" http://localhost:3000/users

**/

describe("Users Endpoints", function() {
  const server = new App();
  const service = new UsersService();
  const fastify = server.getFastify();
  let user: IUser, token: String;

  before( async () => { await ResetDb.run() });

  it("POST /users Should create a user", (done) => {
    fastify.inject({
      method: "POST",
      url: "/users",
      payload: {
        email: 'user@test.com',
        username: 'user1',
        password: 'test'
      },
    }, async (err, res) => {
      expect(err).to.be.null;
      expect(res.statusCode).to.be.equal(200);
      expect(res.headers["content-type"]).to.be.equal("application/json");
      const users = await service.get({});
      expect(users).to.have.lengthOf(1);
      user = users[0];
      expect(user.email).to.be.equal('user@test.com');
      expect(user.username).to.be.equal('user1');
      expect(user.password).to.not.exist;
      done();
    });
  });

  it("POST /users Should not allow SQL Injection", (done) => {
    fastify.inject({
      method: "POST",
      url: "/users",
      payload: {
        email: 'user2@test.com',
        username: 'user2; DELETE FROM exchanges.users;',
        password: 'test'
      },
    }, async (err, res) => {
      expect(err).to.be.null;
      expect(res.statusCode).to.be.equal(200);
      expect(res.headers["content-type"]).to.be.equal("application/json");
      const users = await service.get({});
      expect(users).to.have.lengthOf(2);
      const notInjectionUser = users[1];
      expect(notInjectionUser.username).to.be.equal('user2; DELETE FROM exchanges.users;');
      done();
    });
  });

  it("POST /users/login Should login user and return token", (done) => {
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
  

  it("PUT /users Should fail without token", (done) => {
    fastify.inject({
      method: "PUT",
      url: "/users",
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

  it("PUT /users Should be authenticated with token", (done) => {
    fastify.inject({
      method: "PUT",
      url: "/users",
      headers: {
        'x-access-token': token
      }
    }, async (err, res) => {
      expect(err).to.be.null;
      expect(res.statusCode).to.be.equal(200);
      expect(res.headers["content-type"]).to.be.equal("application/json");
      done();
    });
  });

  it("GET /users Should return 2 users", (done) => {
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
