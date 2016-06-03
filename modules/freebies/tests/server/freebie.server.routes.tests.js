'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Freebie = mongoose.model('Freebie'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, freebie;

/**
 * Freebie routes tests
 */
describe('Freebie CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Freebie
    user.save(function () {
      freebie = {
        name: 'Freebie name'
      };

      done();
    });
  });

  it('should be able to save a Freebie if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Freebie
        agent.post('/api/freebies')
          .send(freebie)
          .expect(200)
          .end(function (freebieSaveErr, freebieSaveRes) {
            // Handle Freebie save error
            if (freebieSaveErr) {
              return done(freebieSaveErr);
            }

            // Get a list of Freebies
            agent.get('/api/freebies')
              .end(function (freebiesGetErr, freebiesGetRes) {
                // Handle Freebie save error
                if (freebiesGetErr) {
                  return done(freebiesGetErr);
                }

                // Get Freebies list
                var freebies = freebiesGetRes.body;

                // Set assertions
                (freebies[0].user._id).should.equal(userId);
                (freebies[0].name).should.match('Freebie name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Freebie if not logged in', function (done) {
    agent.post('/api/freebies')
      .send(freebie)
      .expect(403)
      .end(function (freebieSaveErr, freebieSaveRes) {
        // Call the assertion callback
        done(freebieSaveErr);
      });
  });

  it('should not be able to save an Freebie if no name is provided', function (done) {
    // Invalidate name field
    freebie.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Freebie
        agent.post('/api/freebies')
          .send(freebie)
          .expect(400)
          .end(function (freebieSaveErr, freebieSaveRes) {
            // Set message assertion
            (freebieSaveRes.body.message).should.match('Please fill Freebie name');

            // Handle Freebie save error
            done(freebieSaveErr);
          });
      });
  });

  it('should be able to update an Freebie if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Freebie
        agent.post('/api/freebies')
          .send(freebie)
          .expect(200)
          .end(function (freebieSaveErr, freebieSaveRes) {
            // Handle Freebie save error
            if (freebieSaveErr) {
              return done(freebieSaveErr);
            }

            // Update Freebie name
            freebie.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Freebie
            agent.put('/api/freebies/' + freebieSaveRes.body._id)
              .send(freebie)
              .expect(200)
              .end(function (freebieUpdateErr, freebieUpdateRes) {
                // Handle Freebie update error
                if (freebieUpdateErr) {
                  return done(freebieUpdateErr);
                }

                // Set assertions
                (freebieUpdateRes.body._id).should.equal(freebieSaveRes.body._id);
                (freebieUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Freebies if not signed in', function (done) {
    // Create new Freebie model instance
    var freebieObj = new Freebie(freebie);

    // Save the freebie
    freebieObj.save(function () {
      // Request Freebies
      request(app).get('/api/freebies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Freebie if not signed in', function (done) {
    // Create new Freebie model instance
    var freebieObj = new Freebie(freebie);

    // Save the Freebie
    freebieObj.save(function () {
      request(app).get('/api/freebies/' + freebieObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', freebie.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Freebie with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/freebies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Freebie is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Freebie which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Freebie
    request(app).get('/api/freebies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Freebie with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Freebie if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Freebie
        agent.post('/api/freebies')
          .send(freebie)
          .expect(200)
          .end(function (freebieSaveErr, freebieSaveRes) {
            // Handle Freebie save error
            if (freebieSaveErr) {
              return done(freebieSaveErr);
            }

            // Delete an existing Freebie
            agent.delete('/api/freebies/' + freebieSaveRes.body._id)
              .send(freebie)
              .expect(200)
              .end(function (freebieDeleteErr, freebieDeleteRes) {
                // Handle freebie error error
                if (freebieDeleteErr) {
                  return done(freebieDeleteErr);
                }

                // Set assertions
                (freebieDeleteRes.body._id).should.equal(freebieSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Freebie if not signed in', function (done) {
    // Set Freebie user
    freebie.user = user;

    // Create new Freebie model instance
    var freebieObj = new Freebie(freebie);

    // Save the Freebie
    freebieObj.save(function () {
      // Try deleting Freebie
      request(app).delete('/api/freebies/' + freebieObj._id)
        .expect(403)
        .end(function (freebieDeleteErr, freebieDeleteRes) {
          // Set message assertion
          (freebieDeleteRes.body.message).should.match('User is not authorized');

          // Handle Freebie error error
          done(freebieDeleteErr);
        });

    });
  });

  it('should be able to get a single Freebie that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Freebie
          agent.post('/api/freebies')
            .send(freebie)
            .expect(200)
            .end(function (freebieSaveErr, freebieSaveRes) {
              // Handle Freebie save error
              if (freebieSaveErr) {
                return done(freebieSaveErr);
              }

              // Set assertions on new Freebie
              (freebieSaveRes.body.name).should.equal(freebie.name);
              should.exist(freebieSaveRes.body.user);
              should.equal(freebieSaveRes.body.user._id, orphanId);

              // force the Freebie to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Freebie
                    agent.get('/api/freebies/' + freebieSaveRes.body._id)
                      .expect(200)
                      .end(function (freebieInfoErr, freebieInfoRes) {
                        // Handle Freebie error
                        if (freebieInfoErr) {
                          return done(freebieInfoErr);
                        }

                        // Set assertions
                        (freebieInfoRes.body._id).should.equal(freebieSaveRes.body._id);
                        (freebieInfoRes.body.name).should.equal(freebie.name);
                        should.equal(freebieInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Freebie.remove().exec(done);
    });
  });
});
