// server.js -- A simple Express.js web server for serving a React.js app
//Uses ES6 syntax! We transpile it using Babel. Please see this tutorial:
//https://medium.com/@wlto/how-to-deploy-an-express-application-with-react-front-end-on-aws-elastic-beanstalk-880ff7245008

///////////////////
//MONGOOSE SET-UP//
///////////////////
import mongoose from "mongoose";
const connectStr = "mongodb+srv://AdminUser:TK3bTLCXqCaAeekB@cluster0-iik0u.mongodb.net/test?retryWrites=true&w=majority";
mongoose.set('useFindAndModify', false);

mongoose
  .connect(connectStr, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    () => {
      console.log(`Connected to ${connectStr}.`);
    },
    err => {
      console.error(`Error connecting to ${connectStr}: ${err}`);
    }
  );

//Define schema that maps to a document in the Users collection in the appdb
//database.
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {type: String, required: true}, //unique identifier for user
  password: String, //unencrypted password (for now!)
  displayName: {type: String, required: true}, //Name to be displayed within app
  authStrategy: {type: String, required: true}, //strategy used to authenticate, e.g., github, local
  profileImageUrl: {type: String, required: true}, //link to profile image
  securityQuestion: String,
  securityAnswer: {type: String, required: function() {return this.securityQuestion ? true: false}},
});

const User = mongoose.model("User", userSchema);

/////////////////
//PASSPORT SET-UP
/////////////////

const LOCAL_PORT = 4001;
const DEPLOY_URL = "http://localhost:4001";
import passport from "passport";

var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: "483643036081-ntt2vo7dg2aj3bgv2v5uv9v4gkked28c.apps.googleusercontent.com",
      clientSecret: "g1_qOlTvuWcHbcOwDtsLn53C",
      callbackURL: DEPLOY_URL + "/auth/google/callback"
    },

    //The following function is called after user authenticates with github
    async (accessToken, refreshToken, profile, done) => {
      console.log("User authenticated through Google! In passport callback.");
      //Our convention is to build userId from username and provider
      console.log("profile");
      console.log(JSON.stringify(profile));
      const userId = `${profile.id}@${profile.provider}`;
      //See if document with this unique userId exists in database
      let currentUser = await User.findOne({ id: userId });
      if (!currentUser) {
        //Add this user to the database
        currentUser = await new User({
          id: userId,
          displayName: profile.displayName,
          authStrategy: profile.provider,
          profileImageUrl: profile.photos[0].value
        }).save();
      }
      return done(null, currentUser);
    }
  )
);

import passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;
passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    //Called when user is attempting to log in with local username and password.
    //userId contains the email address entered into the form and password
    //contains the password entered into the form.
    async (req, userId, password, done) => {
      let thisUser;
      try {
        thisUser = await User.findOne({ id: userId });
        if (thisUser) {
          if (thisUser.password === password) {
            return done(null, thisUser);
          } else {
            req.authError =
              "The password is incorrect. Please try again" +
              " or reset your password.";

            return done(null, false);
          }
        } else {
          //userId not found in DB
          req.authError =
            "There is no account with email " + userId + ". Please try again.";
          return done(null, false);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

//Serialize the current user to the session
passport.serializeUser((user, done) => {
  console.log("In serializeUser.");
  console.log("Contents of user param: " + JSON.stringify(user));
  done(null, user.id);
});

//Deserialize the current user from the session
//to persistent storage.
passport.deserializeUser(async (userId, done) => {
  console.log("In deserializeUser.");
  console.log("Contents of user param: " + userId);
  let thisUser;
  try {
    thisUser = await User.findOne({id: userId});
    if (thisUser) {
      console.log("User with id " + userId + " found in DB. User object will be available in server routes as req.user.")
      done(null,thisUser);
    } else {
      done(new error("Error: Could not find user with id " + userId + " in DB, so user could not be deserialized to session."));
    }
  } catch (err) {
    done(err);
  }
});

import session from "express-session";
import path from "path";
import express from "express";
import md5 from "md5";
const PORT = process.env.HTTP_PORT || LOCAL_PORT;
const app = express();

app
  .use(
    session({
      secret: "yourLibrary",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 }
    })
  )
  .use(express.static(path.join(__dirname, "client/build")))
  .use(passport.initialize())
  .use(passport.session());

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}.`);
});

/////////////////////
//EXPRESS APP ROUTES
/////////////////////

//AUTHENTICATE route: Uses passport to authenticate with GitHub.
//Should be accessed when user clicks on 'Login with GitHub' button on
//Log In page.

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.profile"]
  })
);

//CALLBACK route: GitHub will call this route after the
//OAuth authentication process is complete.
//req.isAuthenticated() tells us whether authentication was successful.

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log("auth/google/callback reached.");
    res.redirect("/"); //sends user back to login screen;
    //req.isAuthenticated() indicates status
  }
);

//LOGOUT route: Use passport's req.logout() method to log the user out and
//redirect the user to the main app page. req.isAuthenticated() is toggled to false.

app.get("/auth/logout", (req, res) => {
  console.log("/auth/logout reached. Logging out");
  req.logout();
  res.redirect("/");
});

//TEST route: Tests whether user was successfully authenticated.
//Should be called from the React.js client to set up app state.

app.get('/auth/test', (req, res) => {
  console.log("auth/test reached.");
  const isAuth = req.isAuthenticated();
  if (isAuth) {
      console.log("User is authenticated");
      console.log("User object in req.user: " + JSON.stringify(req.user));
  } else {
      //User is not authenticated.
      console.log("User is not authenticated");
  }
  //Return JSON object to client with results.
  res.json({isAuthenticated: isAuth, user: req.user});
});

//LOGIN route: Attempts to log in user using local strategy
app.post(
  "/auth/login",
  passport.authenticate("local", { failWithError: true }),
  (req, res) => {
    console.log("/login route reached: successful authentication.");
    //Redirect to app's main page; the /auth/test route should return true
    res.status(200).send("Login successful");
  },
  (err, req, res, next) => {
    console.log("/login route reached: unsuccessful authentication");
    //res.sendStatus(401);
    if (req.authError) {
      console.log("req.authError: " + req.authError);
      res.status(401).send(req.authError);
    } else {
      res
        .status(401)
        .send(
          "Unexpected error occurred when attempting to authenticate. Please try again."
        );
    }
    //Note: Do NOT redirect! Client will take over.
  }
);

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//LOGIN route: Attempts to log in user using local strategy
app.post('/login', 
  passport.authenticate('local', { failWithError: true }),
  (req, res) => {
    console.log("/login route reached: successful authentication.");
    res.status(200).send("Login successful");
    //Assume client will redirect to '/' route to deserialize session
  },
  (err, req, res, next) => {
    console.log("/login route reached: unsuccessful authentication");
    //res.sendStatus(401);
    if (req.authError) {
      console.log("req.authError: " + req.authError);
      res.status(401).send(req.authError);
    } else {
      res.status(401).send("Unexpected error occurred when attempting to authenticate. Please try again.");
    }
  });

app.post("/newaccount", async (req, res, next) => {
  console.log("in /newaccont route with body = " + JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));
  if (!req.body || !req.body.userId || !req.body.password) {
    //Body does not contain correct properties
    return res
      .status(401)
      .send(
        "POST request for new account formulated incorrectly. Please contact app developer."
      );
  }
  let thisUser;
  try {
    thisUser = await User.findOne({ id: req.body.userId });
    if (thisUser) {
      //account already exists
      res
        .status(401)
        .send(
          "There is already an account with email '" +
            req.body.userId +
            "'.  Please choose a different email."
        );
    } else {
      //account available -- add to database
      thisUser = await new User({
        id: req.body.userId,
        password: req.body.password,
        displayName: req.body.userId,
        authStrategy: "local",
        profileImageUrl: `https://www.gravatar.com/avatar/${md5(
          req.body.userId
        )}`,
        securityQuestion: req.body.securityQuestion,
        securityAnswer: req.body.securityAnswer,
        books: []
      }).save();
      return res
        .status(200)
        .send(
          "New account for '" + req.body.userId + "' successfully created."
        );
    }
  } catch (err) {
    console.log("Error occurred when looking up user in database.");
    return next(err);
  }
});

//ACCOUNTEXISTS route: Checks whether account with value of query param userId
  //exists, returning true if so, false otherwise. Note that we pass the
  //result as the 'result' property of a JSON object.
  app.get('/accountexists', async(req, res, next) => {
    console.log("in /accountexists route with query params = " + JSON.stringify(req.query));
    if (!req.query.hasOwnProperty("userId")) {
      //Request does not contain correct query parameters
      return res.status(401).send("GET request for accountexists route is improperly formatted." +
                                  " It needs a 'userId' query parameter.")
    }
    let thisUser;
    try {
      thisUser = await User.findOne({id: req.query.userId});
      res.status(200).json({result: thisUser != null});
    } catch (err) {
      console.log("Error occurred when looking up or accessing user in database.")
      return next(err);
    }
  });

  //SECURITYQUESTION route: Returns security question associated with user
  //account with id === req.body.userId, if account exists. Otherwise returns
  //message.
  app.get('/securityquestion', async(req, res, next) => {
    console.log("in /securityquestion route with query params = " + JSON.stringify(req.query));
    if (!req.query.hasOwnProperty("userId")) {
      //Request does not contain correct query parameters
      return res.status(401).send("GET request for security question is improperly formatted." +
                                  " It needs a 'userId' query parameter.")
    }
    let thisUser;
    try {
      thisUser = await User.findOne({id: req.query.userId});
      if (!thisUser) { //now such account exists
        res.status(401).send("There is no account associated with email '" + req.query.userId + "'.");
      } else { //account exists -- fetch securityQuestion
        return res.status(200).send(thisUser.securityQuestion);
      }
    } catch (err) {
      console.log("Error occurred when looking up or accessing user in database.")
      return next(err);
    }
  });

  //VERIFYSECURITYANSWER route: Returns true if the answer provided as a
  //query param is the correct answer to the security question of the acount
  //associated with userId, false otherwise. Note that result is returned within
  //JSON object
  app.get('/verifysecurityanswer', async(req, res, next) => {
    console.log("in /verifysecurityanswer route with query params = " + JSON.stringify(req.query));
    if (!req.query.hasOwnProperty("userId") || !req.query.hasOwnProperty("answer")) {
      //Request does not contain correct query parameters
      return res.status(401).send("GET request for verifysecurityanswer is improperly formatted." +
                                  " It needs 'userId' and 'answer' query parameters.")
    }
    let thisUser;
    try {
      thisUser = await User.findOne({id: req.query.userId});
      if (!thisUser) { //now such account exists
        res.status(401).send("There is no account associated with email '" + req.query.userId + "'.");
      } else { //account exists -- return whether answer matches answer on file
        return res.status(200).json({result: req.query.answer === thisUser.securityAnswer});
      }
    } catch (err) {
      console.log("Error occurred when looking up or accessing user in database.")
      return next(err);
    }
  });

  //RESETPASSWORD route: POST request to change the user's password. The message
  //body is a JSON object containing three fields: userId, securityAnswer and
  //newPassword. If securityAnswer does not match the one on file for userId,
  //the request fails. Otherwise, the password is updated.
  app.post('/resetpassword',  async (req, res, next) => {
    console.log("in /resetpassword route with body = " + JSON.stringify(req.body));
    if (!req.body.hasOwnProperty("userId") || 
        !req.body.hasOwnProperty("answer") || 
        !req.body.hasOwnProperty("newPassword")) {
      //Body does not contain correct properties
      return res.status(401).send("POST request for /resetpassword formulated incorrectly." +
        "Its body must contain 'userId', 'answer', and 'newPassword' fields.")
    }
    let thisUser;
    try {
      thisUser = await User.findOne({id: req.body.userId});
      if (!thisUser) { //account already exists
        res.status(401).send("There is no account with email '" + req.body.userId + "'.");
      } else if (thisUser.authStrategy != "local") {
        res.status(401).send("Cannot reset password on account with userId " + req.body.userId +
          ". The user does not have a local account. ");
      } else if (thisUser.securityAnswer != req.body.answer) { //security answer incorrect 
        res.status(401).send("Password not reset because security answer does not match answer on file.");
      } else { //Can try to update password
        try {
          let status = await User.updateOne({id: req.body.userId},{password: req.body.newPassword});
          if (status.nModified != 1) { //Should never happen!
            res.status(401).send("User account exists in database but password could not be updated.");
          } else {
            res.status(200).send("User password successfully updated.")
          }
        } catch (err) {
          console.log("Error occurred when updating user password in database.")
          return next(err);
        }
      }
    } catch (err) {
      console.log("Error occurred when looking up user in database.")
      return next(err);
    }
  });

  /////////////////////////////////////
//EXPRESS APP ROUTES FOR USER Docs //
/////////////////////////////////////


///////////////////////////////////////
//EXPRESS APP ROUTES FOR Recipe Docs //
///////////////////////////////////////