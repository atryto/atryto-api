import App from "../../app";
import {expect} from "chai";
import IUser from "../../models/iUser";
import "mocha";
import UsersService from "../../services/users";
import ResetDb from "../resetDb";
import { inspect } from "util";
import IOffer from "../../models/IOffer";
import OffersService from "../../services/offers";
import OfferType from "../../models/OfferTypeEnum";
import IOfferLookup from "../../models/IOfferLookup";
import OfferLookupsService from "../../services/offerLookups";

function encodeObject(obj) {
  const esc = encodeURIComponent;
  return Object.keys(obj)
      .map(k => esc(k) + '=' + esc(obj[k]))
      .join('&');
}

describe("Offers Endpoints", function() {
  const server = new App();
  const userService = new UsersService();
  const offerService = new OffersService();
  const offerLookupService = new OfferLookupsService();
  const fastify = server.getFastify();
  let user1: IUser, user2: IUser, token1: String, token2: String;

  before( async () => { 
    await ResetDb.run();
    // create user 1
    await userService.insert({
      email: 'useroffer1@test.com',
      username: 'useroffer1',
      password: 'useroffer1password'
    });
    // create user 2
    await userService.insert({
      email: 'useroffer2@test.com',
      username: 'useroffer2',
      password: 'useroffer2password'
    });
    // store user1 and user2
    let users = await userService.get({email: 'useroffer1@test.com'});
    user1 = users[0];
    users = await userService.get({email: 'useroffer2@test.com'});
    user2 = users[0];
    // login to store token of user 1 
    token1 =  await userService.login({
      email: 'useroffer1@test.com',
      password: 'useroffer1password'
    });
    // login to store token of user 2
    token2 =  await userService.login({
      email: 'useroffer2@test.com',
      password: 'useroffer2password'
    });
  });

  describe("Testing offer types", function() {

    it("Type BUY -> User1 wants to Buy 1500USD with CAD at a rate of 1.30CAD per USD", (done) => {
      const offer: IOffer = {
        userid: user1.id,
        type: OfferType.BUY,
        cityslug: 'toronto',
        sourcecoinsymbol: 'CAD', // coin the user has
        destcoinsymbol: 'USD', // coin the user wanted
        wantedpriceperunit: 1.30, // the value of the dest coin in source coin(1 USD  = 1.30 CAD)
        amount: 1500,
      };
      fastify.inject({
        method: "POST",
        url: "/offers",
        headers: {
          'x-access-token': token1
        },
        payload: offer
      }, async (err, res) => {
        expect(err).to.be.null;
        expect(res.statusCode).to.be.equal(200);
        expect(res.headers["content-type"]).to.be.equal("application/json");
        const offer: IOffer = await offerService.getById(JSON.parse(res.payload).insertId);
        expect(offer).to.exist;
        expect(offer.userid).to.be.equal(user1.id);
        expect(offer.type).to.be.equal(OfferType.BUY);
        expect(offer.cityslug).to.be.equal('toronto');
        expect(offer.sourcecoinsymbol).to.be.equal('CAD');
        expect(offer.destcoinsymbol).to.be.equal('USD');
        expect(offer.wantedpriceperunit).to.be.equal(1.30);
        expect(offer.amount).to.be.equal(1500);
        done();
      });
    });

    it("Type SELL -> User1 wants to Sell 500CAD for USD at a rate of 1.30 CAD per usd", (done) => {
      const offer: IOffer = {
        userid: user1.id,
        type: OfferType.SELL,
        cityslug: 'toronto',
        sourcecoinsymbol: 'CAD', // coin the user has
        destcoinsymbol: 'USD', // coin the user wants
        wantedpriceperunit: 1.30, // the value of the dest coin in source coin(1 USD  = 1.30 CAD)
        amount: 500,
      };
      fastify.inject({
        method: "POST",
        url: "/offers",
        headers: {
          'x-access-token': token1
        },
        payload: offer
      }, async (err, res) => {
        expect(err).to.be.null;
        expect(res.statusCode).to.be.equal(200);
        expect(res.headers["content-type"]).to.be.equal("application/json");
        const offer: IOffer = await offerService.getById(JSON.parse(res.payload).insertId);
        expect(offer).to.exist;
        expect(offer.userid).to.be.equal(user1.id);
        expect(offer.type).to.be.equal(OfferType.SELL);
        expect(offer.cityslug).to.be.equal('toronto');
        expect(offer.sourcecoinsymbol).to.be.equal('CAD');
        expect(offer.destcoinsymbol).to.be.equal('USD');
        expect(offer.wantedpriceperunit).to.be.equal(1.30);
        expect(offer.amount).to.be.equal(500);
        done();
      });
    });

    it("Type EXCHANGE -> User1 wants to EXCHANGE 4BTC for ETH at a rate of 7.5ETH per BTC", (done) => {
      const offer: IOffer = {
        userid: user1.id,
        type: OfferType.EXCHANGE,
        cityslug: 'toronto',
        sourcecoinsymbol: 'BTC', // coin the user has
        destcoinsymbol: 'ETH', // coin the user wants
        wantedpriceperunit: 7.5, // the value of the dest coin in source coin(1 BTC = 7.5 ETH)
        amount: 4,
      };
      fastify.inject({
        method: "POST",
        url: "/offers",
        headers: {
          'x-access-token': token1
        },
        payload: offer
      }, async (err, res) => {
        expect(err).to.be.null;
        expect(res.statusCode).to.be.equal(200);
        expect(res.headers["content-type"]).to.be.equal("application/json");
        const offer: IOffer = await offerService.getById(JSON.parse(res.payload).insertId);
        expect(offer).to.exist;
        expect(offer.userid).to.be.equal(user1.id);
        expect(offer.type).to.be.equal(OfferType.EXCHANGE);
        expect(offer.cityslug).to.be.equal('toronto');
        expect(offer.sourcecoinsymbol).to.be.equal('BTC');
        expect(offer.destcoinsymbol).to.be.equal('ETH');
        expect(offer.wantedpriceperunit).to.be.equal(7.5);
        expect(offer.amount).to.be.equal(4);
        done();
      });
    });

  });

  describe("Testing offer lookups", function() {
    it("Whenever someone looks for a coin in the platform we add that lookup", (done) => {
      const lookup: IOfferLookup = {
        type: OfferType.EXCHANGE,
        cityslug: 'toronto',
        sourcecoinsymbol: 'BTC', // coin the user has
        destcoinsymbol: 'ETH', // coin the user wants
      };
      const queryOffer = encodeObject(lookup);
      console.log(`queryOffer: ${queryOffer}`);
      fastify.inject({
        method: "GET",
        url: "/offers?"+queryOffer,
      }, async (err, res) => {
        expect(err).to.be.null;
        expect(res.statusCode).to.be.equal(200);
        expect(res.headers["content-type"]).to.be.equal("application/json");
        const offers = JSON.parse(res.payload).result;
        expect(offers).to.exist;
        console.log(`offers: ${JSON.stringify(offers, null, 2)}`);
        expect(offers).to.have.length.above(0);

        let offerLookups: IOfferLookup[] = [];
        // OfferLookup is executed asynchronously so we wait
        while (offerLookups.length == 0 ) {
          offerLookups = await offerLookupService.get(lookup);
        }
        console.log(`offerLookups: ${JSON.stringify(offerLookups, null, 2)}`);
        expect(offerLookups).to.not.be.empty;
        const offerLookup: IOfferLookup = offerLookups[0];
        console.log(`offerLookup: ${JSON.stringify(offerLookup, null, 2)}`);
        expect(offerLookup.type).to.be.equal(lookup.type);
        expect(offerLookup.cityslug).to.be.equal(lookup.cityslug);
        expect(offerLookup.sourcecoinsymbol).to.be.equal(lookup.sourcecoinsymbol);
        expect(offerLookup.destcoinsymbol).to.be.equal(lookup.destcoinsymbol);
        done();
      });
    });
  });

});
