import App from "../../app";
import {expect} from "chai";
import IUser from "../../models/iUser";
import "mocha";
import UsersService from "../../services/users";
import ResetDb from "../resetDb";
import IOffer from "../../models/IOffer";
import OffersService from "../../services/offers";
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
      password: 'useroffer1password',
      citySlug: 'toronto',
    } as IUser);
    // create user 2
    await userService.insert({
      email: 'useroffer2@test.com',
      username: 'useroffer2',
      password: 'useroffer2password',
      citySlug: 'toronto',
    } as IUser);
    // store user1 and user2
    let users = await userService.get({email: 'useroffer1@test.com'} as IUser);
    user1 = users[0];
    users = await userService.get({email: 'useroffer2@test.com'} as IUser);
    user2 = users[0];
    // login to store token of user 1 
    token1 =  await userService.login({
      email: 'useroffer1@test.com',
      password: 'useroffer1password'
    } as IUser);
    // login to store token of user 2
    token2 =  await userService.login({
      email: 'useroffer2@test.com',
      password: 'useroffer2password'
    } as IUser);
  });
  // after( async () => { await ResetDb.run() });

  describe("Offers", function() {

    it("User1 wants to Buy 1500USD with CAD at a rate of 1.30CAD per USD", (done) => {
      const offer: IOffer = {
        userId: user1.id,
        citySlug: 'toronto',
        sourceCoinSymbol: 'CAD', // coin the user has
        destCoinSymbol: 'USD', // coin the user wanted
        wantedPricePerUnit: 1.30, // the value of the dest coin in source coin(1 USD  = 1.30 CAD)
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
        expect(offer.userId).to.be.equal(user1.id);
        expect(offer.citySlug).to.be.equal('toronto');
        expect(offer.sourceCoinSymbol).to.be.equal('CAD');
        expect(offer.destCoinSymbol).to.be.equal('USD');
        expect(offer.wantedPricePerUnit).to.be.equal(1.30);
        expect(offer.amount).to.be.equal(1500);
        done();
      });
    });

    it("User1 wants to Sell 500CAD for USD at a rate of 1.30 CAD per usd", (done) => {
      const offer: IOffer = {
        userId: user1.id,
        citySlug: 'toronto',
        sourceCoinSymbol: 'CAD', // coin the user has
        destCoinSymbol: 'USD', // coin the user wants
        wantedPricePerUnit: 1.30, // the value of the dest coin in source coin(1 USD  = 1.30 CAD)
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
        expect(offer.userId).to.be.equal(user1.id);
        expect(offer.citySlug).to.be.equal('toronto');
        expect(offer.sourceCoinSymbol).to.be.equal('CAD');
        expect(offer.destCoinSymbol).to.be.equal('USD');
        expect(offer.wantedPricePerUnit).to.be.equal(1.30);
        expect(offer.amount).to.be.equal(500);
        done();
      });
    });

    it("User1 wants to EXCHANGE 4BTC for ETH at a rate of 7.5ETH per BTC", (done) => {
      const offer: IOffer = {
        userId: user1.id,
        citySlug: 'toronto',
        sourceCoinSymbol: 'BTC', // coin the user has
        destCoinSymbol: 'ETH', // coin the user wants
        wantedPricePerUnit: 7.5, // the value of the dest coin in source coin(1 BTC = 7.5 ETH)
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
        expect(offer.userId).to.be.equal(user1.id);
        expect(offer.citySlug).to.be.equal('toronto');
        expect(offer.sourceCoinSymbol).to.be.equal('BTC');
        expect(offer.destCoinSymbol).to.be.equal('ETH');
        expect(offer.wantedPricePerUnit).to.be.equal(7.5);
        expect(offer.amount).to.be.equal(4);
        done();
      });
    });

  });

  describe("Testing offer lookups", function() {
    it("Whenever someone looks for a coin in the platform we add that lookup", (done) => {
      const clientRequestFields = {
        city: 'toronto',
        sourceCurrency: 'BTC', // coin the user has
        targetCurrency: 'ETH', // coin the user wants
      };
      const dbRequestFields = {
        citySlug: 'toronto',
        sourceCoinSymbol: 'BTC', // coin the user has
        destCoinSymbol: 'ETH', // coin the user wants
      };
      const queryOffer = encodeObject(clientRequestFields);
      fastify.inject({
        method: "GET",
        url: "/offers?"+queryOffer,
      }, async (err, res) => {
        console.log(0);
        expect(err).to.be.null;
        console.log(1);
        expect(res.statusCode).to.be.equal(200);
        console.log(2);
        expect(res.headers["content-type"]).to.be.equal("application/json");
        console.log(3);

        let offerLookups: IOfferLookup[] = [];
        // OfferLookup is executed asynchronously so we wait
        while (offerLookups.length == 0 ) {
          offerLookups = await offerLookupService.get(dbRequestFields as IOffer);
        }
        const offerLookup: IOfferLookup = offerLookups[0];
        expect(offerLookup.citySlug).to.be.equal(clientRequestFields.city);
        expect(offerLookup.sourceCoinSymbol).to.be.equal(clientRequestFields.sourceCurrency);
        expect(offerLookup.destCoinSymbol).to.be.equal(clientRequestFields.targetCurrency);
        done();
      });
    });
  });

});
