const mongoose = require('mongoose');
const chai = require('chai');
const chaiHTTP = require('chai-http');

const { expect } = chai;
const sinon = require('sinon');
const server = require('./server');

const Game = require('./models');

chai.use(chaiHTTP);

describe('Games', () => {
  before(done => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/test');
    const db = mongoose.connection;
    db.on('error', () => console.error.bind(console, 'connection error'));
    db.once('open', () => {
      console.log('we are connected');
      done();
    });
  });

  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
      console.log('we are disconnected');
    });
  });
  let gameId;
  // hint - these wont be constants because you'll need to override them.
  beforeEach(done => {
    // write a beforeEach hook that will populate your test DB with data
    // each time this hook runs, you should save a document to your db
    // by saving the document you'll be able to use it in each of your `it` blocks
    let newGame = new Game({
      title: 'Super Mario Bros',
      releaseDate: 'September 1985',
      genre: 'Platformer'
    });
    newGame.save((err, savedGame) => {
      if (err) {
        console.log(err);
        done();
      }
      gameId = savedGame.id;
      done();
    });
  });
  afterEach(done => {
    // simply remove the collections from your DB.
    Game.remove({}, err => {
      if (err) console.log(err);
      done();
    });
  });

  // test the POST here
  describe(`[POST] /api/bands`, () => {
    let newGame = new Game({
      title: 'Super Mario Bros',
      releaseDate: 'September 1985',
      genre: 'Platformer'
    });
    it(`should save a new game document to the db`, done => {
      chai
        .request(server)
        .post('/api/game/create')
        .send(newGame)
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done();
          }
          expect(res.status).to.equal(201);
          expect(res.body.title).to.equal('Super Mario Bros');
          expect(typeof res.body.genre).to.equal('string');
          done();
        });
    });
    it(`should fail if the title, releaseDate and genre are not provided`, done => {
      chai
        .request(server)
        .post('/api/game/create')
        .send({ message: 'bad data' })
        .end(res => {
          expect(res.status).to.equal(422);
          done();
        });
    });
  });

  // test the GET here

  // Test the DELETE here

  // --- Stretch Problem ---
  // test the PUT here
});
