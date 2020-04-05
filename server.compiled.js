"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _passport = _interopRequireDefault(require("passport"));

var _passportLocal = _interopRequireDefault(require("passport-local"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _md = _interopRequireDefault(require("md5"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var connectStr = "mongodb+srv://AdminUser:TK3bTLCXqCaAeekB@cluster0-iik0u.mongodb.net/test?retryWrites=true&w=majority";

_mongoose["default"].set('useFindAndModify', false);

_mongoose["default"].connect(connectStr, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  console.log("Connected to ".concat(connectStr, "."));
}, function (err) {
  console.error("Error connecting to ".concat(connectStr, ": ").concat(err));
}); //Define schema that maps to a document in the Users collection in the appdb
//database.


var Schema = _mongoose["default"].Schema;
var userSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  //unique identifier for user
  password: String,
  //unencrypted password (for now!)
  displayName: {
    type: String,
    required: true
  },
  //Name to be displayed within app
  authStrategy: {
    type: String,
    required: true
  },
  //strategy used to authenticate, e.g., github, local
  profileImageUrl: {
    type: String,
    required: true
  },
  //link to profile image
  securityQuestion: String,
  securityAnswer: {
    type: String,
    required: function required() {
      return this.securityQuestion ? true : false;
    }
  }
});

var User = _mongoose["default"].model("User", userSchema); /////////////////
//PASSPORT SET-UP
/////////////////


var LOCAL_PORT = 4001;
var DEPLOY_URL = "http://localhost:4001";

var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

_passport["default"].use(new GoogleStrategy({
  clientID: "483643036081-ntt2vo7dg2aj3bgv2v5uv9v4gkked28c.apps.googleusercontent.com",
  clientSecret: "g1_qOlTvuWcHbcOwDtsLn53C",
  callbackURL: DEPLOY_URL + "/auth/google/callback"
},
/*#__PURE__*/
//The following function is called after user authenticates with github
function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(accessToken, refreshToken, profile, done) {
    var userId, currentUser;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("User authenticated through Google! In passport callback."); //Our convention is to build userId from username and provider

            console.log("profile");
            console.log(JSON.stringify(profile));
            userId = "".concat(profile.id, "@").concat(profile.provider); //See if document with this unique userId exists in database

            _context.next = 6;
            return User.findOne({
              id: userId
            });

          case 6:
            currentUser = _context.sent;

            if (currentUser) {
              _context.next = 11;
              break;
            }

            _context.next = 10;
            return new User({
              id: userId,
              displayName: profile.displayName,
              authStrategy: profile.provider,
              profileImageUrl: profile.photos[0].value
            }).save();

          case 10:
            currentUser = _context.sent;

          case 11:
            return _context.abrupt("return", done(null, currentUser));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}()));

var LocalStrategy = _passportLocal["default"].Strategy;

_passport["default"].use(new LocalStrategy({
  passReqToCallback: true
},
/*#__PURE__*/
//Called when user is attempting to log in with local username and password.
//userId contains the email address entered into the form and password
//contains the password entered into the form.
function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, userId, password, done) {
    var thisUser;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return User.findOne({
              id: userId
            });

          case 3:
            thisUser = _context2.sent;

            if (!thisUser) {
              _context2.next = 13;
              break;
            }

            if (!(thisUser.password === password)) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt("return", done(null, thisUser));

          case 9:
            req.authError = "The password is incorrect. Please try again" + " or reset your password.";
            return _context2.abrupt("return", done(null, false));

          case 11:
            _context2.next = 15;
            break;

          case 13:
            //userId not found in DB
            req.authError = "There is no account with email " + userId + ". Please try again.";
            return _context2.abrupt("return", done(null, false));

          case 15:
            _context2.next = 20;
            break;

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", done(_context2.t0));

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 17]]);
  }));

  return function (_x5, _x6, _x7, _x8) {
    return _ref2.apply(this, arguments);
  };
}())); //Serialize the current user to the session


_passport["default"].serializeUser(function (user, done) {
  console.log("In serializeUser.");
  console.log("Contents of user param: " + JSON.stringify(user));
  done(null, user.id);
}); //Deserialize the current user from the session
//to persistent storage.


_passport["default"].deserializeUser( /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(userId, done) {
    var thisUser;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log("In deserializeUser.");
            console.log("Contents of user param: " + userId);
            _context3.prev = 2;
            _context3.next = 5;
            return User.findOne({
              id: userId
            });

          case 5:
            thisUser = _context3.sent;

            if (thisUser) {
              console.log("User with id " + userId + " found in DB. User object will be available in server routes as req.user.");
              done(null, thisUser);
            } else {
              done(new error("Error: Could not find user with id " + userId + " in DB, so user could not be deserialized to session."));
            }

            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](2);
            done(_context3.t0);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 9]]);
  }));

  return function (_x9, _x10) {
    return _ref3.apply(this, arguments);
  };
}());

var PORT = process.env.HTTP_PORT || LOCAL_PORT;
var app = (0, _express["default"])();
app.use((0, _expressSession["default"])({
  secret: "yourLibrary",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60
  }
})).use(_express["default"]["static"](_path["default"].join(__dirname, "client/build"))).use(_passport["default"].initialize()).use(_passport["default"].session());
app.listen(PORT, function () {
  console.log("Server listening at port ".concat(PORT, "."));
}); /////////////////////
//EXPRESS APP ROUTES
/////////////////////
//AUTHENTICATE route: Uses passport to authenticate with GitHub.
//Should be accessed when user clicks on 'Login with GitHub' button on
//Log In page.

app.get("/auth/google", _passport["default"].authenticate("google", {
  scope: ["https://www.googleapis.com/auth/userinfo.profile"]
})); //CALLBACK route: GitHub will call this route after the
//OAuth authentication process is complete.
//req.isAuthenticated() tells us whether authentication was successful.

app.get("/auth/google/callback", _passport["default"].authenticate("google", {
  failureRedirect: "/"
}), function (req, res) {
  console.log("auth/google/callback reached.");
  res.redirect("/"); //sends user back to login screen;
  //req.isAuthenticated() indicates status
}); //LOGOUT route: Use passport's req.logout() method to log the user out and
//redirect the user to the main app page. req.isAuthenticated() is toggled to false.

app.get("/auth/logout", function (req, res) {
  console.log("/auth/logout reached. Logging out");
  req.logout();
  res.redirect("/");
}); //TEST route: Tests whether user was successfully authenticated.
//Should be called from the React.js client to set up app state.

app.get('/auth/test', function (req, res) {
  console.log("auth/test reached.");
  var isAuth = req.isAuthenticated();

  if (isAuth) {
    console.log("User is authenticated");
    console.log("User object in req.user: " + JSON.stringify(req.user));
  } else {
    //User is not authenticated.
    console.log("User is not authenticated");
  } //Return JSON object to client with results.


  res.json({
    isAuthenticated: isAuth,
    user: req.user
  });
}); //LOGIN route: Attempts to log in user using local strategy

app.post("/auth/login", _passport["default"].authenticate("local", {
  failWithError: true
}), function (req, res) {
  console.log("/login route reached: successful authentication."); //Redirect to app's main page; the /auth/test route should return true

  res.status(200).send("Login successful");
}, function (err, req, res, next) {
  console.log("/login route reached: unsuccessful authentication"); //res.sendStatus(401);

  if (req.authError) {
    console.log("req.authError: " + req.authError);
    res.status(401).send(req.authError);
  } else {
    res.status(401).send("Unexpected error occurred when attempting to authenticate. Please try again.");
  } //Note: Do NOT redirect! Client will take over.

});

var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); //LOGIN route: Attempts to log in user using local strategy

app.post('/login', _passport["default"].authenticate('local', {
  failWithError: true
}), function (req, res) {
  console.log("/login route reached: successful authentication.");
  res.status(200).send("Login successful"); //Assume client will redirect to '/' route to deserialize session
}, function (err, req, res, next) {
  console.log("/login route reached: unsuccessful authentication"); //res.sendStatus(401);

  if (req.authError) {
    console.log("req.authError: " + req.authError);
    res.status(401).send(req.authError);
  } else {
    res.status(401).send("Unexpected error occurred when attempting to authenticate. Please try again.");
  }
});
app.post("/newaccount", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var thisUser;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log("in /newaccont route with body = " + JSON.stringify(req.body));
            console.log(JSON.stringify(req.body));

            if (!(!req.body || !req.body.userId || !req.body.password)) {
              _context4.next = 4;
              break;
            }

            return _context4.abrupt("return", res.status(401).send("POST request for new account formulated incorrectly. Please contact app developer."));

          case 4:
            _context4.prev = 4;
            _context4.next = 7;
            return User.findOne({
              id: req.body.userId
            });

          case 7:
            thisUser = _context4.sent;

            if (!thisUser) {
              _context4.next = 12;
              break;
            }

            //account already exists
            res.status(401).send("There is already an account with email '" + req.body.userId + "'.  Please choose a different email.");
            _context4.next = 16;
            break;

          case 12:
            _context4.next = 14;
            return new User({
              id: req.body.userId,
              password: req.body.password,
              displayName: req.body.userId,
              authStrategy: "local",
              profileImageUrl: "https://www.gravatar.com/avatar/".concat((0, _md["default"])(req.body.userId)),
              securityQuestion: req.body.securityQuestion,
              securityAnswer: req.body.securityAnswer,
              books: []
            }).save();

          case 14:
            thisUser = _context4.sent;
            return _context4.abrupt("return", res.status(200).send("New account for '" + req.body.userId + "' successfully created."));

          case 16:
            _context4.next = 22;
            break;

          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4["catch"](4);
            console.log("Error occurred when looking up user in database.");
            return _context4.abrupt("return", next(_context4.t0));

          case 22:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[4, 18]]);
  }));

  return function (_x11, _x12, _x13) {
    return _ref4.apply(this, arguments);
  };
}()); //ACCOUNTEXISTS route: Checks whether account with value of query param userId
//exists, returning true if so, false otherwise. Note that we pass the
//result as the 'result' property of a JSON object.

app.get('/accountexists', /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
    var thisUser;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log("in /accountexists route with query params = " + JSON.stringify(req.query));

            if (req.query.hasOwnProperty("userId")) {
              _context5.next = 3;
              break;
            }

            return _context5.abrupt("return", res.status(401).send("GET request for accountexists route is improperly formatted." + " It needs a 'userId' query parameter."));

          case 3:
            _context5.prev = 3;
            _context5.next = 6;
            return User.findOne({
              id: req.query.userId
            });

          case 6:
            thisUser = _context5.sent;
            res.status(200).json({
              result: thisUser != null
            });
            _context5.next = 14;
            break;

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](3);
            console.log("Error occurred when looking up or accessing user in database.");
            return _context5.abrupt("return", next(_context5.t0));

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 10]]);
  }));

  return function (_x14, _x15, _x16) {
    return _ref5.apply(this, arguments);
  };
}()); //SECURITYQUESTION route: Returns security question associated with user
//account with id === req.body.userId, if account exists. Otherwise returns
//message.

app.get('/securityquestion', /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
    var thisUser;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log("in /securityquestion route with query params = " + JSON.stringify(req.query));

            if (req.query.hasOwnProperty("userId")) {
              _context6.next = 3;
              break;
            }

            return _context6.abrupt("return", res.status(401).send("GET request for security question is improperly formatted." + " It needs a 'userId' query parameter."));

          case 3:
            _context6.prev = 3;
            _context6.next = 6;
            return User.findOne({
              id: req.query.userId
            });

          case 6:
            thisUser = _context6.sent;

            if (thisUser) {
              _context6.next = 11;
              break;
            }

            //now such account exists
            res.status(401).send("There is no account associated with email '" + req.query.userId + "'.");
            _context6.next = 12;
            break;

          case 11:
            return _context6.abrupt("return", res.status(200).send(thisUser.securityQuestion));

          case 12:
            _context6.next = 18;
            break;

          case 14:
            _context6.prev = 14;
            _context6.t0 = _context6["catch"](3);
            console.log("Error occurred when looking up or accessing user in database.");
            return _context6.abrupt("return", next(_context6.t0));

          case 18:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[3, 14]]);
  }));

  return function (_x17, _x18, _x19) {
    return _ref6.apply(this, arguments);
  };
}()); //VERIFYSECURITYANSWER route: Returns true if the answer provided as a
//query param is the correct answer to the security question of the acount
//associated with userId, false otherwise. Note that result is returned within
//JSON object

app.get('/verifysecurityanswer', /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res, next) {
    var thisUser;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            console.log("in /verifysecurityanswer route with query params = " + JSON.stringify(req.query));

            if (!(!req.query.hasOwnProperty("userId") || !req.query.hasOwnProperty("answer"))) {
              _context7.next = 3;
              break;
            }

            return _context7.abrupt("return", res.status(401).send("GET request for verifysecurityanswer is improperly formatted." + " It needs 'userId' and 'answer' query parameters."));

          case 3:
            _context7.prev = 3;
            _context7.next = 6;
            return User.findOne({
              id: req.query.userId
            });

          case 6:
            thisUser = _context7.sent;

            if (thisUser) {
              _context7.next = 11;
              break;
            }

            //now such account exists
            res.status(401).send("There is no account associated with email '" + req.query.userId + "'.");
            _context7.next = 12;
            break;

          case 11:
            return _context7.abrupt("return", res.status(200).json({
              result: req.query.answer === thisUser.securityAnswer
            }));

          case 12:
            _context7.next = 18;
            break;

          case 14:
            _context7.prev = 14;
            _context7.t0 = _context7["catch"](3);
            console.log("Error occurred when looking up or accessing user in database.");
            return _context7.abrupt("return", next(_context7.t0));

          case 18:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[3, 14]]);
  }));

  return function (_x20, _x21, _x22) {
    return _ref7.apply(this, arguments);
  };
}()); //RESETPASSWORD route: POST request to change the user's password. The message
//body is a JSON object containing three fields: userId, securityAnswer and
//newPassword. If securityAnswer does not match the one on file for userId,
//the request fails. Otherwise, the password is updated.

app.post('/resetpassword', /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res, next) {
    var thisUser, status;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            console.log("in /resetpassword route with body = " + JSON.stringify(req.body));

            if (!(!req.body.hasOwnProperty("userId") || !req.body.hasOwnProperty("answer") || !req.body.hasOwnProperty("newPassword"))) {
              _context8.next = 3;
              break;
            }

            return _context8.abrupt("return", res.status(401).send("POST request for /resetpassword formulated incorrectly." + "Its body must contain 'userId', 'answer', and 'newPassword' fields."));

          case 3:
            _context8.prev = 3;
            _context8.next = 6;
            return User.findOne({
              id: req.body.userId
            });

          case 6:
            thisUser = _context8.sent;

            if (thisUser) {
              _context8.next = 11;
              break;
            }

            //account already exists
            res.status(401).send("There is no account with email '" + req.body.userId + "'.");
            _context8.next = 30;
            break;

          case 11:
            if (!(thisUser.authStrategy != "local")) {
              _context8.next = 15;
              break;
            }

            res.status(401).send("Cannot reset password on account with userId " + req.body.userId + ". The user does not have a local account. ");
            _context8.next = 30;
            break;

          case 15:
            if (!(thisUser.securityAnswer != req.body.answer)) {
              _context8.next = 19;
              break;
            }

            //security answer incorrect 
            res.status(401).send("Password not reset because security answer does not match answer on file.");
            _context8.next = 30;
            break;

          case 19:
            _context8.prev = 19;
            _context8.next = 22;
            return User.updateOne({
              id: req.body.userId
            }, {
              password: req.body.newPassword
            });

          case 22:
            status = _context8.sent;

            if (status.nModified != 1) {
              //Should never happen!
              res.status(401).send("User account exists in database but password could not be updated.");
            } else {
              res.status(200).send("User password successfully updated.");
            }

            _context8.next = 30;
            break;

          case 26:
            _context8.prev = 26;
            _context8.t0 = _context8["catch"](19);
            console.log("Error occurred when updating user password in database.");
            return _context8.abrupt("return", next(_context8.t0));

          case 30:
            _context8.next = 36;
            break;

          case 32:
            _context8.prev = 32;
            _context8.t1 = _context8["catch"](3);
            console.log("Error occurred when looking up user in database.");
            return _context8.abrupt("return", next(_context8.t1));

          case 36:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[3, 32], [19, 26]]);
  }));

  return function (_x23, _x24, _x25) {
    return _ref8.apply(this, arguments);
  };
}()); /////////////////////////////////////
//EXPRESS APP ROUTES FOR USER Docs //
/////////////////////////////////////
///////////////////////////////////////
//EXPRESS APP ROUTES FOR Recipe Docs //
///////////////////////////////////////
