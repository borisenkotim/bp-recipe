"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _crypto = _interopRequireDefault(require("crypto"));

var _passport = _interopRequireDefault(require("passport"));

var _passportGithub = _interopRequireDefault(require("passport-github"));

var _passportGoogleOauth = _interopRequireDefault(require("passport-google-oauth2"));

var _passportLocal = _interopRequireDefault(require("passport-local"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _runtime = _interopRequireDefault(require("regenerator-runtime/runtime.js"));

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _md = _interopRequireDefault(require("md5"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//const connectStr = "mongodb+srv://dbAdmin:matthews@localtest.km1f8.mongodb.net/newDB?retryWrites=true&w=majority";
var connectStr = "mongodb://localhost:27017";

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
var ingredientSchema = new Schema({
  calories: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  pictureURL: String,
  quantityString: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  expiration: {
    type: String,
    required: false
  }
});
var recipeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  pictureURL: String,
  ingredients: [ingredientSchema],
  directions: {
    type: Array,
    required: true
  },
  cookTime: {
    type: Number,
    required: true
  },
  favorited: {
    type: Boolean,
    required: true,
    "default": false
  },
  dateAdded: {
    type: String,
    required: true
  }
});
var grocerySchema = new Schema({
  associatedUserId: {
    type: String,
    required: true
  },
  ingredients: [ingredientSchema] //this shcema will support foods we need go get from the grocery store

});
var pantrySchema = new Schema({
  associatedUserId: {
    type: String,
    required: true
  },
  ingredients: [ingredientSchema]
});
var userSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  passhash: String,
  salt: String,
  displayName: {
    type: String,
    required: true
  },
  authStrategy: {
    type: String,
    required: true
  },
  profileImageURL: {
    type: String,
    required: true
  },
  securityQuestion: String,
  securityAnswer: {
    type: String,
    required: function required() {
      return this.securityQuestion ? true : false;
    }
  },
  recipes: [recipeSchema],
  pantry: [ingredientSchema],
  groceryList: [ingredientSchema]
});
// uses 1000 iterations, length of 64, and sha512 function
var hashOptions = [1000, 64, 'sha512']; // virtual property password

userSchema.virtual('password').get(function () {
  return this.passhash;
}).set(function (newPassword) {
  // create unique salt for the user
  this.salt = _crypto["default"].randomBytes(16).toString('hex'); // hashing user's password

  this.passhash = _crypto["default"].pbkdf2Sync.apply(_crypto["default"], [newPassword, this.salt].concat(hashOptions)).toString("hex");
}); // method for validating the hashed / salted password for users

userSchema.methods.validatePassword = function (password) {
  // hashes the password argument, checks against stored password
  var passhash = _crypto["default"].pbkdf2Sync.apply(_crypto["default"], [password, this.salt].concat(hashOptions)).toString("hex");

  return this.password === passhash;
};

var User = _mongoose["default"].model("User", userSchema); /////////////////
//PASSPORT SET-UP
/////////////////


var LOCAL_PORT = 8081;
var DEPLOY_URL = "http://localhost:8081";
var GithubStrategy = _passportGithub["default"].Strategy; //

_passport["default"].use(new GithubStrategy({
  clientID: "a075012c4b08543f42a8",
  clientSecret: "8dde6978090028aee37c72df9ea7ce268678b6d3",
  callbackURL: DEPLOY_URL + "/auth/github/callback"
},
/*#__PURE__*/
//The following function is called after user authenticates with github
function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee(accessToken, refreshToken, profile, done) {
    var userId, currentUser;
    return _runtime["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("User authenticated through GitHub! In passport callback."); //Our convention is to build userId from displayName and provider

            userId = "".concat(profile.username, "@").concat(profile.provider); //See if document with this unique userId exists in database 

            _context.next = 4;
            return User.findOne({
              id: userId
            });

          case 4:
            currentUser = _context.sent;

            if (currentUser) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return new User({
              id: userId,
              displayName: profile.displayName,
              authStrategy: profile.provider,
              profileImageURL: profile.photos[0].value
            }).save();

          case 8:
            currentUser = _context.sent;

          case 9:
            return _context.abrupt("return", done(null, currentUser));

          case 10:
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

var GoogleStrategy = _passportGoogleOauth["default"].Strategy;

_passport["default"].use(new GoogleStrategy({
  clientID: "513700040808-lndjcubr19lm72bra49n3c7j2fooailu.apps.googleusercontent.com",
  clientSecret: "NevQ353WYtJ8g7re9grmsuQ-",
  callbackURL: DEPLOY_URL + "/auth/google/callback"
},
/*#__PURE__*/
//The following function is called after user authenticates with github
function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee2(accessToken, refreshToken, profile, done) {
    var userId, currentUser;
    return _runtime["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("User authenticated through Google! In passport callback."); //Our convention is to build userId from username and provider

            console.log("profile");
            console.log(JSON.stringify(profile));
            userId = "".concat(profile.id, "@").concat(profile.provider); //See if document with this unique userId exists in database

            _context2.next = 6;
            return User.findOne({
              id: userId
            });

          case 6:
            currentUser = _context2.sent;
            console.log(profile.photos[0].value);

            if (currentUser) {
              _context2.next = 12;
              break;
            }

            _context2.next = 11;
            return new User({
              id: userId,
              displayName: profile.displayName,
              authStrategy: profile.provider,
              profileImageURL: profile.photos[0].value
            }).save();

          case 11:
            currentUser = _context2.sent;

          case 12:
            return _context2.abrupt("return", done(null, currentUser));

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x5, _x6, _x7, _x8) {
    return _ref2.apply(this, arguments);
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
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee3(req, userId, password, done) {
    var thisUser;
    return _runtime["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log(userId);
            console.log(password);
            _context3.prev = 2;
            _context3.next = 5;
            return User.findOne({
              id: userId
            });

          case 5:
            thisUser = _context3.sent;

            if (!thisUser) {
              _context3.next = 15;
              break;
            }

            if (!thisUser.validatePassword(password)) {
              _context3.next = 11;
              break;
            }

            return _context3.abrupt("return", done(null, thisUser));

          case 11:
            req.authError = "The password is incorrect. Please try again" + " or reset your password.";
            return _context3.abrupt("return", done(null, false));

          case 13:
            _context3.next = 17;
            break;

          case 15:
            //userId not found in DB
            req.authError = "There is no account with email " + userId + ". Please try again.";
            return _context3.abrupt("return", done(null, false));

          case 17:
            _context3.next = 22;
            break;

          case 19:
            _context3.prev = 19;
            _context3.t0 = _context3["catch"](2);
            return _context3.abrupt("return", done(_context3.t0));

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 19]]);
  }));

  return function (_x9, _x10, _x11, _x12) {
    return _ref3.apply(this, arguments);
  };
}())); //Serialize the current user to the session


_passport["default"].serializeUser(function (user, done) {
  console.log("In serializeUser.");
  console.log("Contents of user param: " + JSON.stringify(user));
  done(null, user.id);
}); //Deserialize the current user from the session
//to persistent storage.


_passport["default"].deserializeUser( /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee4(userId, done) {
    var thisUser;
    return _runtime["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log("In deserializeUser.");
            console.log("Contents of user param: " + userId);
            _context4.prev = 2;
            _context4.next = 5;
            return User.findOne({
              id: userId
            });

          case 5:
            thisUser = _context4.sent;

            if (thisUser) {
              console.log("User with id " + userId + " found in DB. User object will be available in server routes as req.user.");
              done(null, thisUser);
            } else {
              done(new error("Error: Could not find user with id " + userId + " in DB, so user could not be deserialized to session."));
            }

            _context4.next = 12;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](2);
            done(_context4.t0);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 9]]);
  }));

  return function (_x13, _x14) {
    return _ref4.apply(this, arguments);
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
  scope: ["profile"]
})); //CALLBACK route: GitHub will call this route after the
//OAuth authentication process is complete.
//req.isAuthenticated() tells us whether authentication was successful.

app.get("/auth/google/callback", _passport["default"].authenticate("google", {
  failureRedirect: "/"
}), function (req, res) {
  console.log("auth/google/callback reached.");
  res.redirect("/"); //sends user back to login screen;
  //req.isAuthenticated() indicates status
});
app.get("/auth/github", _passport["default"].authenticate("github")); //CALLBACK route: GitHub will call this route after the
//OAuth authentication process is complete.
//req.isAuthenticated() tells us whether authentication was successful.

app.get("/auth/github/callback", _passport["default"].authenticate("github", {
  failureRedirect: "/"
}), function (req, res) {
  console.log("auth/github/callback reached.");
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
  console.log("/auth/login route reached: successful authentication."); //Redirect to app's main page; the /auth/test route should return true

  res.status(200).send("Login successful");
}, function (err, req, res, next) {
  console.log("/auth/login route reached: unsuccessful authentication"); //res.sendStatus(401);

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
})); /////////////////////////////////////
//EXPRESS APP ROUTES FOR USER Docs //
/////////////////////////////////////
//USERS/userId route (GET): Attempts to return the data of a user 
//in users collection.
//GIVEN: 
//  id of the user is passed as route parameter.
//  Fields and values to be updated are passed as body as JSON object 
//RETURNS: 
//  Success: status = 200 with user data as JSON object
//  Failure: status = 400 with error message

app.get('/users/:userId', /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee5(req, res, next) {
    var thisUser;
    return _runtime["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log("in /users route (GET) with userId = " + JSON.stringify(req.params.userId));
            _context5.prev = 1;
            _context5.next = 4;
            return User.findOne({
              id: req.params.userId
            });

          case 4:
            thisUser = _context5.sent;

            if (thisUser) {
              _context5.next = 9;
              break;
            }

            return _context5.abrupt("return", res.status(400).message("No user account with specified userId was found in database."));

          case 9:
            return _context5.abrupt("return", res.status(200).json(JSON.stringify(thisUser)));

          case 10:
            _context5.next = 16;
            break;

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](1);
            console.log();
            return _context5.abrupt("return", res.status(400).message("Unexpected error occurred when looking up user in database: " + _context5.t0));

          case 16:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 12]]);
  }));

  return function (_x15, _x16, _x17) {
    return _ref5.apply(this, arguments);
  };
}()); //USERS/userId route (POST): Attempts to add a new user in the users 
//collection. 
//GIVEN: 
//  id of the user to add is passed as route parameter.
//  user data to be added are passed as body as JSON object.
//VALID DATA:
//  'password' field MUST be present
//  The following fields are optional: 
//  displayName', 'profileImageURL', 'securityQuestion', 'securityAnswer'
//RETURNS: 
//  Success: status = 200
//  Failure: status = 400 with an error message

app.post('/users/:userId', /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee6(req, res, next) {
    var thisUser;
    return _runtime["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log("in /users route (POST) with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));
            console.log(req.hasOwnProperty('body'));

            if (req.body.hasOwnProperty("password")) {
              _context6.next = 4;
              break;
            }

            return _context6.abrupt("return", res.status(400).send("/users POST request formulated incorrectly. " + "It must contain 'password' as field in message body."));

          case 4:
            _context6.prev = 4;
            _context6.next = 7;
            return User.findOne({
              id: req.params.userId
            });

          case 7:
            thisUser = _context6.sent;
            console.log("thisUser: " + JSON.stringify(thisUser));

            if (!thisUser) {
              _context6.next = 13;
              break;
            }

            //account already exists
            res.status(400).send("There is already an account with email '" + req.params.userId + "'.  Please choose a different email.");
            _context6.next = 17;
            break;

          case 13:
            _context6.next = 15;
            return new User({
              id: req.params.userId,
              password: req.body.password,
              displayName: req.params.userId,
              authStrategy: 'local',
              profileImageURL: req.body.hasOwnProperty("profileImageURL") ? req.body.profileImageURL : "https://www.gravatar.com/avatar/".concat((0, _md["default"])(req.params.userId)),
              securityQuestion: req.body.hasOwnProperty("securityQuestion") ? req.body.securityQuestion : "",
              securityAnswer: req.body.hasOwnProperty("securityAnswer") ? req.body.securityAnswer : "",
              recipes: []
            }).save();

          case 15:
            thisUser = _context6.sent;
            return _context6.abrupt("return", res.status(200).send("New account for '" + req.params.userId + "' successfully created."));

          case 17:
            _context6.next = 23;
            break;

          case 19:
            _context6.prev = 19;
            _context6.t0 = _context6["catch"](4);
            console.log(_context6.t0);
            return _context6.abrupt("return", res.status(400).send("Unexpected error occurred when adding or looking up user in database. " + _context6.t0));

          case 23:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[4, 19]]);
  }));

  return function (_x18, _x19, _x20) {
    return _ref6.apply(this, arguments);
  };
}()); //USERS/userId route (PUT): Attempts to update a user in the users collection. 
//GIVEN: 
//  id of the user to update is passed as route parameter.
//  Fields and values to be updated are passed as body as JSON object.  
//VALID DATA:
//  Only the following fields may be included in the message body:
//  password, displayName, profileImageURL, securityQuestion, securityAnswer
//RETURNS: 
//  Success: status = 200
//  Failure: status = 400 with an error message

app.put('/users/:userId', /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee7(req, res, next) {
    var validProps, bodyProp, user;
    return _runtime["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            console.log("in /users PUT with userId = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));

            if (req.params.hasOwnProperty("userId")) {
              _context7.next = 3;
              break;
            }

            return _context7.abrupt("return", res.status(400).send("users/ PUT request formulated incorrectly." + "It must contain 'userId' as parameter."));

          case 3:
            validProps = ['password', 'displayName', 'profileImageURL', 'securityQuestion', 'securityAnswer'];
            _context7.t0 = _runtime["default"].keys(req.body);

          case 5:
            if ((_context7.t1 = _context7.t0()).done) {
              _context7.next = 11;
              break;
            }

            bodyProp = _context7.t1.value;

            if (validProps.includes(bodyProp)) {
              _context7.next = 9;
              break;
            }

            return _context7.abrupt("return", res.status(400).send("users/ PUT request formulated incorrectly." + "Only the following props are allowed in body: " + "'password', 'displayName', 'profileImageURL', 'securityQuestion', 'securityAnswer'"));

          case 9:
            _context7.next = 5;
            break;

          case 11:
            _context7.prev = 11;
            _context7.next = 14;
            return User.findOne({
              id: req.params.userId
            });

          case 14:
            user = _context7.sent;
            user.set(req.body);

            if (user) {
              _context7.next = 20;
              break;
            }

            //Should never happen!
            res.status(400).send("User account exists in database but data could not be updated. Password must be different");
            _context7.next = 23;
            break;

          case 20:
            _context7.next = 22;
            return user.save();

          case 22:
            res.status(200).send("User data successfully updated.");

          case 23:
            _context7.next = 28;
            break;

          case 25:
            _context7.prev = 25;
            _context7.t2 = _context7["catch"](11);
            res.status(400).send("Unexpected error occurred when updating user data in database: " + _context7.t2);

          case 28:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[11, 25]]);
  }));

  return function (_x21, _x22, _x23) {
    return _ref7.apply(this, arguments);
  };
}()); ///////////////////////////////////////
//EXPRESS APP ROUTES FOR Recipe Docs //
///////////////////////////////////////
//recipes/userId route (GET): Attempts to return all recipes associated with userId
//GIVEN: 
//  id of the user whose recipes are sought is passed as route parameter.
//RETURNS: 
//  Success: status = 200 with array of recipes as JSON object
//  Failure: status = 400 with error message

app.get('/recipes/:userId', /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee8(req, res) {
    var thisUser;
    return _runtime["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            console.log("in /recipes route (GET) with userId = " + JSON.stringify(req.params.userId));
            _context8.prev = 1;
            _context8.next = 4;
            return User.findOne({
              id: req.params.userId
            });

          case 4:
            thisUser = _context8.sent;

            if (thisUser) {
              _context8.next = 9;
              break;
            }

            return _context8.abrupt("return", res.status(400).message("No user account with specified userId was found in database."));

          case 9:
            return _context8.abrupt("return", res.status(200).json(JSON.stringify(thisUser.recipes)));

          case 10:
            _context8.next = 16;
            break;

          case 12:
            _context8.prev = 12;
            _context8.t0 = _context8["catch"](1);
            console.log();
            return _context8.abrupt("return", res.status(400).message("Unexpected error occurred when looking up user in database: " + _context8.t0));

          case 16:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[1, 12]]);
  }));

  return function (_x24, _x25) {
    return _ref8.apply(this, arguments);
  };
}());
app.get('/pantry/:userId', /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee9(req, res) {
    var thisUser;
    return _runtime["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            console.log("in /pantry route (GET) with userId = " + JSON.stringify(req.params.userId));
            _context9.prev = 1;
            _context9.next = 4;
            return User.findOne({
              id: req.params.userId
            });

          case 4:
            thisUser = _context9.sent;

            if (thisUser) {
              _context9.next = 9;
              break;
            }

            return _context9.abrupt("return", res.status(400).message("How did you get here"));

          case 9:
            if (!thisUser.pantry) {
              _context9.next = 13;
              break;
            }

            return _context9.abrupt("return", res.status(200).json(JSON.stringify(thisUser.pantry)));

          case 13:
            return _context9.abrupt("return", res.status(400).message("User doesn't have a pantry list yet, please intilize for them (even if it's empty)"));

          case 14:
            _context9.next = 20;
            break;

          case 16:
            _context9.prev = 16;
            _context9.t0 = _context9["catch"](1);
            console.log();
            return _context9.abrupt("return", res.status(400).message("Unexpected error occured when looking up user in database for pantry: " + _context9.t0));

          case 20:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[1, 16]]);
  }));

  return function (_x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}());
app.get('/groceryList/:userId', /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee10(req, res) {
    var thisUser;
    return _runtime["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            console.log("in /groceryList route (GET) with userId = " + JSON.stringify(req.params.userId));
            _context10.prev = 1;
            _context10.next = 4;
            return User.findOne({
              id: req.params.userId
            });

          case 4:
            thisUser = _context10.sent;

            if (thisUser) {
              _context10.next = 9;
              break;
            }

            return _context10.abrupt("return", res.status(400).message("How did you get here"));

          case 9:
            if (!thisUser.groceryList) {
              _context10.next = 13;
              break;
            }

            return _context10.abrupt("return", res.status(200).json(JSON.stringify(thisUser.groceryList)));

          case 13:
            return _context10.abrupt("return", res.status(400).message("User doesn't have a grocery list yet, please intilize for them (even if it's empty)"));

          case 14:
            _context10.next = 20;
            break;

          case 16:
            _context10.prev = 16;
            _context10.t0 = _context10["catch"](1);
            console.log();
            return _context10.abrupt("return", res.status(400).message("Unexpected error occured when looking up user in database for grocery list: " + _context10.t0));

          case 20:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[1, 16]]);
  }));

  return function (_x28, _x29) {
    return _ref10.apply(this, arguments);
  };
}()); //we will need the same thing but for the funciton below so that we can update/post pantry/grocery list for a userID

app.post('/pantry/:userId', /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee11(req, res, next) {
    var status;
    return _runtime["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            console.log("in /pantry (POST) route with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));
            /*if(!req.body.hasOwnProperty("list")){
              return res.status(400).message("POST request on /pantry was not formulated correctly. Body must contain property: list");
            }*/

            _context11.prev = 1;
            _context11.next = 4;
            return User.updateOne({
              id: req.params.userId
            }, {
              $set: {
                pantry: req.body
              }
            });

          case 4:
            status = _context11.sent;

            if (status.nModified != 1) {
              //Should never happen!
              res.status(400).send("Unexpected error occurred when updating pantry in database. Pantry was not uodated.");
            } else {
              res.status(200).send("pantry successfully updated in database.");
            }

            _context11.next = 12;
            break;

          case 8:
            _context11.prev = 8;
            _context11.t0 = _context11["catch"](1);
            console.log(_context11.t0);
            return _context11.abrupt("return", res.status(400).send("Unexpected error occurred when updating pantry in database: " + _context11.t0));

          case 12:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[1, 8]]);
  }));

  return function (_x30, _x31, _x32) {
    return _ref11.apply(this, arguments);
  };
}());
app.post('/groceryList/:userId', /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee12(req, res, next) {
    var status;
    return _runtime["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            console.log("in /groceryList (POST) route with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));
            /*if(!req.body.hasOwnProperty("list")){
              return res.status(400).message("POST request on /groceryList was not formulated correctly. Body must contain property: list");
            }*/

            _context12.prev = 1;
            _context12.next = 4;
            return User.updateOne({
              id: req.params.userId
            }, {
              $set: {
                groceryList: req.body
              }
            });

          case 4:
            status = _context12.sent;

            if (status.nModified != 1) {
              //Should never happen!
              res.status(400).send("Unexpected error occurred when adding groceries to database. Grocery List was not uodated.");
            } else {
              res.status(200).send("pantry successfully updated in database.");
            }

            _context12.next = 12;
            break;

          case 8:
            _context12.prev = 8;
            _context12.t0 = _context12["catch"](1);
            console.log(_context12.t0);
            return _context12.abrupt("return", res.status(400).send("Unexpected error occurred when updating grocery list in database: " + _context12.t0));

          case 12:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[1, 8]]);
  }));

  return function (_x33, _x34, _x35) {
    return _ref12.apply(this, arguments);
  };
}()); //recipes/userId/ (POST): Attempts to add new recipe to database
//GIVEN:
//  id of the user whose recipe is to be added is passed as 
//  route parameter
//  JSON object containing recipe to be added is passed in request body
//VALID DATA:
//  user id must correspond to user in Users collection
//  Body object MUST contain only the following fields:
//  name, pictureURL, ingredients, directions, dateAdded, favorited
//RETURNS:
//  Success: status = 200
//  Failure: status = 400 with error message

app.post('/recipes/:userId', /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee13(req, res, next) {
    var status;
    return _runtime["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            console.log("in /recipes (POST) route with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));

            if (!(!req.body.hasOwnProperty("name") || !req.body.hasOwnProperty("pictureURL") || !req.body.hasOwnProperty("favorited") || !req.body.hasOwnProperty("dateAdded") || !req.body.hasOwnProperty("ingredients") || !req.body.hasOwnProperty("cookTime") || !req.body.hasOwnProperty("directions"))) {
              _context13.next = 3;
              break;
            }

            return _context13.abrupt("return", res.status(400).send("POST request on /recipes formulated incorrectly." + "Body must contain all 6 required fields: name, pictureURL, ingredients, directions, dateAdded, favorited."));

          case 3:
            _context13.prev = 3;
            _context13.next = 6;
            return User.updateOne({
              id: req.params.userId
            }, {
              $push: {
                recipes: req.body
              }
            });

          case 6:
            status = _context13.sent;

            if (status.nModified != 1) {
              //Should never happen!
              res.status(400).send("Unexpected error occurred when adding recipe to database. recipe was not added.");
            } else {
              res.status(200).send("recipe successfully added to database.");
            }

            _context13.next = 14;
            break;

          case 10:
            _context13.prev = 10;
            _context13.t0 = _context13["catch"](3);
            console.log(_context13.t0);
            return _context13.abrupt("return", res.status(400).send("Unexpected error occurred when adding recipe to database: " + _context13.t0));

          case 14:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[3, 10]]);
  }));

  return function (_x36, _x37, _x38) {
    return _ref13.apply(this, arguments);
  };
}()); //recipes/userId/recipeId (PUT): Attempts to update data for an existing recipe
//GIVEN:
//  id of the user whose recipe is to be updated is passed as first 
//  route parameter
//  id of recipe to be updated is passed as second route parameter
//  JSON object containing data to be updated is passed in request body
//VALID DATA:
//  user id must correspond to user in Users collection
//  recipe id must correspond to a user's recipe. (Use recipes/ GET route to obtain a
//  list of all of user's recipes, including their unique ids)
//  Body object may contain only the following 6 fields:
//  name, pictureURL, ingredients, directions, dateAdded, favorited
//RETURNS:
//  Success: status = 200
//  Failure: status = 400 with error message

app.put('/recipes/:userId/:recipeId', /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee14(req, res, next) {
    var validProps, bodyObj, bodyProp, status;
    return _runtime["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            console.log("in /recipes (PUT) route with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));
            validProps = ['name', 'ingredients', 'directions', 'cookTime', 'pictureURL', 'favorited', 'dateAdded'];
            bodyObj = _objectSpread({}, req.body);
            delete bodyObj._id;
            console.log(bodyObj);
            _context14.t0 = _runtime["default"].keys(bodyObj);

          case 6:
            if ((_context14.t1 = _context14.t0()).done) {
              _context14.next = 16;
              break;
            }

            bodyProp = _context14.t1.value;

            if (validProps.includes(bodyProp)) {
              _context14.next = 12;
              break;
            }

            return _context14.abrupt("return", res.status(400).send("recipes/ PUT request formulated incorrectly." + "Only the following props are allowed in body: " + "'name', 'dateAdded', 'pictureURL', 'favorited', 'expiration', 'ingredients', 'directions', *" + bodyProp + "* is not an allowed prop."));

          case 12:
            bodyObj["recipes.$." + bodyProp] = bodyObj[bodyProp];
            delete bodyObj[bodyProp];

          case 14:
            _context14.next = 6;
            break;

          case 16:
            _context14.prev = 16;
            _context14.next = 19;
            return User.updateOne({
              "id": req.params.userId,
              "recipes._id": _mongoose["default"].Types.ObjectId(req.params.recipeId)
            }, {
              "$set": bodyObj
            });

          case 19:
            status = _context14.sent;
            res.status(200).send("recipe successfully updated in database.");
            _context14.next = 27;
            break;

          case 23:
            _context14.prev = 23;
            _context14.t2 = _context14["catch"](16);
            console.log(_context14.t2);
            return _context14.abrupt("return", res.status(400).send("Unexpected error occurred when updating recipe in database: " + _context14.t2));

          case 27:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[16, 23]]);
  }));

  return function (_x39, _x40, _x41) {
    return _ref14.apply(this, arguments);
  };
}());
app.put('/pantry/:userId/:pantryId', /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee15(req, res, next) {
    var validProps, bodyObj, bodyProp, status;
    return _runtime["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            console.log("in /pantry (PUT) route with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));
            validProps = ['name', 'calories', 'pictureURL', 'quantity', 'unit', 'expiration'];
            bodyObj = _objectSpread({}, req.body);
            delete bodyObj._id;
            console.log(bodyObj);
            _context15.t0 = _runtime["default"].keys(bodyObj);

          case 6:
            if ((_context15.t1 = _context15.t0()).done) {
              _context15.next = 16;
              break;
            }

            bodyProp = _context15.t1.value;

            if (validProps.includes(bodyProp)) {
              _context15.next = 12;
              break;
            }

            return _context15.abrupt("return", res.status(400).send("pantry/ PUT request formulated incorrectly." + "Only the following props are allowed in body: " + "'name', 'calories', 'pictureURL', 'quantity', 'unit', 'expiration', *" + bodyProp + "* is not an allowed prop."));

          case 12:
            bodyObj["pantry.$." + bodyProp] = bodyObj[bodyProp];
            delete bodyObj[bodyProp];

          case 14:
            _context15.next = 6;
            break;

          case 16:
            _context15.prev = 16;
            _context15.next = 19;
            return User.updateOne({
              "id": req.params.userId,
              "pantry._id": _mongoose["default"].Types.ObjectId(req.params.pantryId)
            }, {
              "$set": bodyObj
            });

          case 19:
            status = _context15.sent;
            res.status(200).send("recipe successfully updated in database.");
            _context15.next = 27;
            break;

          case 23:
            _context15.prev = 23;
            _context15.t2 = _context15["catch"](16);
            console.log(_context15.t2);
            return _context15.abrupt("return", res.status(400).send("Unexpected error occurred when updating recipe in database: " + _context15.t2));

          case 27:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[16, 23]]);
  }));

  return function (_x42, _x43, _x44) {
    return _ref15.apply(this, arguments);
  };
}()); //recipes/userId/recipeId (DELETE): Attempts to delete an existing recipe
//GIVEN:
//  id of the user whose recipe is to be deleted is passed as first 
//  route parameter
//  id of recipe to be deleted is passed as second route parameter
//VALID DATA:
//  user id must correspond to user in Users collection
//  recipe id must correspond to a unique id of a user's recipe. 
//  (Use recipes/ GET route to obtain a list of all of user's 
//  recipes, including their unique ids)
//RETURNS:
//  Success: status = 200
//  Failure: status = 400 with error message

app["delete"]('/recipes/:userId/:recipeId', /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee16(req, res, next) {
    var status;
    return _runtime["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            console.log("in /recipes (DELETE) route with params = " + JSON.stringify(req.params));
            _context16.prev = 1;
            _context16.next = 4;
            return User.updateOne({
              id: req.params.userId
            }, {
              $pull: {
                recipes: {
                  _id: _mongoose["default"].Types.ObjectId(req.params.recipeId)
                }
              }
            });

          case 4:
            status = _context16.sent;

            if (status.nModified != 1) {
              //Should never happen!
              res.status(400).send("Unexpected error occurred when deleting recipe from database. recipe was not deleted.");
            } else {
              res.status(200).send("recipe successfully deleted from database.");
            }

            _context16.next = 12;
            break;

          case 8:
            _context16.prev = 8;
            _context16.t0 = _context16["catch"](1);
            console.log(_context16.t0);
            return _context16.abrupt("return", res.status(400).send("Unexpected error occurred when deleting recipe from database: " + _context16.t0));

          case 12:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[1, 8]]);
  }));

  return function (_x45, _x46, _x47) {
    return _ref16.apply(this, arguments);
  };
}());
app["delete"]('/pantry/:userId/:pantryId', /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee17(req, res, next) {
    var status;
    return _runtime["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            console.log("in /recipes (DELETE) route with params = " + JSON.stringify(req.params));
            _context17.prev = 1;
            _context17.next = 4;
            return User.updateOne({
              id: req.params.userId
            }, {
              $pull: {
                pantry: {
                  _id: _mongoose["default"].Types.ObjectId(req.params.pantryId)
                }
              }
            });

          case 4:
            status = _context17.sent;

            if (status.nModified != 1) {
              //Should never happen!
              res.status(400).send("Unexpected error occurred when deleting recipe from database. recipe was not deleted.");
            } else {
              res.status(200).send("recipe successfully deleted from database.");
            }

            _context17.next = 12;
            break;

          case 8:
            _context17.prev = 8;
            _context17.t0 = _context17["catch"](1);
            console.log(_context17.t0);
            return _context17.abrupt("return", res.status(400).send("Unexpected error occurred when deleting recipe from database: " + _context17.t0));

          case 12:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, null, [[1, 8]]);
  }));

  return function (_x48, _x49, _x50) {
    return _ref17.apply(this, arguments);
  };
}());
app["delete"]('/groceryList/:userId/:groceryId', /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/_runtime["default"].mark(function _callee18(req, res, next) {
    var status;
    return _runtime["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            console.log("in /recipes (DELETE) route with params = " + JSON.stringify(req.params));
            _context18.prev = 1;
            _context18.next = 4;
            return User.updateOne({
              id: req.params.userId
            }, {
              $pull: {
                groceryList: {
                  _id: _mongoose["default"].Types.ObjectId(req.params.groceryId)
                }
              }
            });

          case 4:
            status = _context18.sent;

            if (status.nModified != 1) {
              //Should never happen!
              res.status(400).send("Unexpected error occurred when deleting recipe from database. recipe was not deleted.");
            } else {
              res.status(200).send("recipe successfully deleted from database.");
            }

            _context18.next = 12;
            break;

          case 8:
            _context18.prev = 8;
            _context18.t0 = _context18["catch"](1);
            console.log(_context18.t0);
            return _context18.abrupt("return", res.status(400).send("Unexpected error occurred when deleting recipe from database: " + _context18.t0));

          case 12:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[1, 8]]);
  }));

  return function (_x51, _x52, _x53) {
    return _ref18.apply(this, arguments);
  };
}());
