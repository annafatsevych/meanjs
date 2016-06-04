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
var app,
  agent,
  credentials,
  user,
  freebie;

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

    // Save a user to the test db and create new freebie
    user.save(function () {
      freebie = {
        title: 'Freebie Title',
        content: 'Freebie Content'
      };

      done();
    });
  });

  it('should be able to save an freebie if logged in', function (done) {
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

        // Save a new freebie
        agent.post('/api/freebies')
          .send(freebie)
          .expect(200)
          .end(function (freebieSaveErr, freebieSaveRes) {
            // Handle freebie save error
            if (freebieSaveErr) {
              return done(freebieSaveErr);
            }

            // Get a list of freebies
            agent.get('/api/freebies')
              .end(function (freebiesGetErr, freebiesGetRes) {
                // Handle freebie save error
                if (freebiesGetErr) {
                  return done(freebiesGetErr);
                }

                // Get freebies list
                var freebies = freebiesGetRes.body;

                // Set assertions
                (freebies[0].user._id).should.equal(userId);
                (freebies[0].title).should.match('Freebie Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an freebie if not logged in', function (done) {
    agent.post('/api/freebies')
      .send(freebie)
      .expect(403)
      .end(function (freebieSaveErr, freebieSaveRes) {
        // Call the assertion callback
        done(freebieSaveErr);
      });
  });

  it('should not be able to save an freebie if no title is provided', function (done) {
    // Invalidate title field
    freebie.title = '';

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

        // Save a new freebie
        agent.post('/api/freebies')
          .send(freebie)
          .expect(400)
          .end(function (freebieSaveErr, freebieSaveRes) {
            // Set message assertion
            (freebieSaveRes.body.message).should.match('Title cannot be blank');

            // Handle freebie save error
            done(freebieSaveErr);
          });
      });
  });

  it('should be able to update an freebie if signed in', function (done) {
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

        // Save a new freebie
        agent.post('/api/freebies')
          .send(freebie)
          .expect(200)
          .end(function (freebieSaveErr, freebieSaveRes) {
            // Handle freebie save error
            if (freebieSaveErr) {
              return done(freebieSaveErr);
            }

            // Update freebie title
            freebie.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing freebie
            agent.put('/api/freebies/' + freebieSaveRes.body._id)
              .send(freebie)
              .expect(200)
              .end(function (freebieUpdateErr, freebieUpdateRes) {
                // Handle freebie update error
                if (freebieUpdateErr) {
                  return done(freebieUpdateErr);
                }

                // Set assertions
                (freebieUpdateRes.body._id).should.equal(freebieSaveRes.body._id);
                (freebieUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of freebies if not signed in', function (done) {
    // Create new freebie model instance
    var freebieObj = new Freebie(freebie);

    // Save the freebie
    freebieObj.save(function () {
      // Request freebies
      request(app).get('/api/freebies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single freebie if not signed in', function (done) {
    // Create new freebie model instance
    var freebieObj = new Freebie(freebie);

    // Save the freebie
    freebieObj.save(function () {
      request(app).get('/api/freebies/' + freebieObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', freebie.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single freebie with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/freebies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Freebie is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single freebie which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent freebie
    request(app).get('/api/freebies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No freebie with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an freebie if signed in', function (done) {
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

        // Save a new freebie
        agent.post('/api/freebies')
          .send(freebie)
          .expect(200)
          .end(function (freebieSaveErr, freebieSaveRes) {
            // Handle freebie save error
            if (freebieSaveErr) {
              return done(freebieSaveErr);
            }

            // Delete an existing freebie
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

  it('should not be able to delete an freebie if not signed in', function (done) {
    // Set freebie user
    freebie.user = user;

    // Create new freebie model instance
    var freebieObj = new Freebie(freebie);

    // Save the freebie
    freebieObj.save(function () {
      // Try deleting freebie
      request(app).delete('/api/freebies/' + freebieObj._id)
        .expect(403)
        .end(function (freebieDeleteErr, freebieDeleteRes) {
          // Set message assertion
          (freebieDeleteRes.body.message).should.match('User is not authorized');

          // Handle freebie error error
          done(freebieDeleteErr);
        });

    });
  });

  it('should be able to get a single freebie that has an orphaned user reference', function (done) {
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

          // Save a new freebie
          agent.post('/api/freebies')
            .send(freebie)
            .expect(200)
            .end(function (freebieSaveErr, freebieSaveRes) {
              // Handle freebie save error
              if (freebieSaveErr) {
                return done(freebieSaveErr);
              }

              // Set assertions on new freebie
              (freebieSaveRes.body.title).should.equal(freebie.title);
              should.exist(freebieSaveRes.body.user);
              should.equal(freebieSaveRes.body.user._id, orphanId);

              // force the freebie to have an orphaned user reference
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

                    // Get the freebie
                    agent.get('/api/freebies/' + freebieSaveRes.body._id)
                      .expect(200)
                      .end(function (freebieInfoErr, freebieInfoRes) {
                        // Handle freebie error
                        if (freebieInfoErr) {
                          return done(freebieInfoErr);
                        }

                        // Set assertions
                        (freebieInfoRes.body._id).should.equal(freebieSaveRes.body._id);
                        (freebieInfoRes.body.title).should.equal(freebie.title);
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

  it('should be able to get a single freebie if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new freebie model instance
    freebie.user = user;
    var freebieObj = new Freebie(freebie);

    // Save the freebie
    freebieObj.save(function () {
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

          // Save a new freebie
          agent.post('/api/freebies')
            .send(freebie)
            .expect(200)
            .end(function (freebieSaveErr, freebieSaveRes) {
              // Handle freebie save error
              if (freebieSaveErr) {
                return done(freebieSaveErr);
              }

              // Get the freebie
              agent.get('/api/freebies/' + freebieSaveRes.body._id)
                .expect(200)
                .end(function (freebieInfoErr, freebieInfoRes) {
                  // Handle freebie error
                  if (freebieInfoErr) {
                    return done(freebieInfoErr);
                  }

                  // Set assertions
                  (freebieInfoRes.body._id).should.equal(freebieSaveRes.body._id);
                  (freebieInfoRes.body.title).should.equal(freebie.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (freebieInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single freebie if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new freebie model instance
    var freebieObj = new Freebie(freebie);

    // Save the freebie
    freebieObj.save(function () {
      request(app).get('/api/freebies/' + freebieObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', freebie.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single freebie, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Freebie
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new freebie
          agent.post('/api/freebies')
            .send(freebie)
            .expect(200)
            .end(function (freebieSaveErr, freebieSaveRes) {
              // Handle freebie save error
              if (freebieSaveErr) {
                return done(freebieSaveErr);
              }

              // Set assertions on new freebie
              (freebieSaveRes.body.title).should.equal(freebie.title);
              should.exist(freebieSaveRes.body.user);
              should.equal(freebieSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the freebie
                  agent.get('/api/freebies/' + freebieSaveRes.body._id)
                    .expect(200)
                    .end(function (freebieInfoErr, freebieInfoRes) {
                      // Handle freebie error
                      if (freebieInfoErr) {
                        return done(freebieInfoErr);
                      }

                      // Set assertions
                      (freebieInfoRes.body._id).should.equal(freebieSaveRes.body._id);
                      (freebieInfoRes.body.title).should.equal(freebie.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (freebieInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
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
