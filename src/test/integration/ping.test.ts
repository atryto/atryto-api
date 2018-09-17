import App from "../../app";
import {expect} from "chai";
import "mocha";

describe("GET `/ping` route", function() {
  const server = new App();
  const fastify = server.getFastify();

  it("Should return Status code 200", function(done) {
    fastify.inject({
      method: "GET",
      url: "/ping",
    }, (err, res) => {
      expect(err).to.be.null;
      expect(res.statusCode).to.be.equal(200);
      expect(res.headers["content-type"]).to.be.equal("application/json");
      expect(JSON.parse(res.payload)).to.deep.equal({ ping: true });
      done();
    });
  });

});
