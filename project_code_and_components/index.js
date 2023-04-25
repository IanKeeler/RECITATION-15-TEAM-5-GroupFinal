// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part B.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(express.static('resources'))
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************
// INCLUDE EVERYTHING HERE ---------------------------------------------------------------------------------
// GLOBAL VARIABLES
let USERNAME = '';

// temporary default route, probably changing to home page later
app.get('/', (req,res)=>{
    res.redirect('/log');
});

// force hashes to forcibly add users thru create.sql: change variable 'password' and load api route; will show before proper stuff for login page
app.get('/force_hash', async(req,res)=>{
  let password = 'pass2';
  console.log(password);
  let hashed = await bcrypt.hash(password,10);

  res.render('pages/login.ejs', {message: hashed});
});

// lab 11 --------------------------------------------------
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

// login routines --------------------------------------------------
app.get('/login', (req,res)=>{
  res.render('pages/login.ejs');
});

app.post('/login', (req,res)=>{

  // ACTUAL db query
  const person = `SELECT * FROM users WHERE username = '${req.body.username}';`;
  
  db.any(person)
  .then(async data=>{
    // check if user has registered
    console.log('data retrieved from user fetch:::::', data);
    if(!data[0]){
      console.log('no user found; redirecting to register');
      res.redirect('/register');
      
    // user actually found
    } else {
      const match = await bcrypt.compare(req.body.password, data[0].user_password); // hash
      console.log('password check match::::', match);
      // create user session if match
      if(match){
        console.log('user found and passwords matched; redirecting to home; user:', req.body.username);

        USERNAME = req.body.username; // for later use
        req.session.user = data[0];
        req.session.save();
  
        // for test lab purposes
        // res.send({status: 200, message: "success"});

        // for actual implementation
        res.redirect('/home');
      }else{
        console.log('passwords didn\'t match');
        throw Error('Incorrect password');
      }
    }
  })
  // resend to login if incorrect data match
  .catch(err=>{
    console.log('error:::', err);
    // for test case implementation
    // res.send({status: 200, message: 'Error: Incorrect password'});

    // for actual implementation
    res.render('pages/login.ejs', {message: err});
  });
});

// registration routines --------------------------------------------------
app.get('/register', (req,res)=>{
  res.render('pages/register.ejs');
});

app.post('/register', async(req,res)=>{
  // add to user table
  const passwordHash = await bcrypt.hash(req.body.password, 10);

  // default carbonscore/weight factor
  let carbonScore = 50;
  let weightFactor = 1

  // insert into db
  let query = 'INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore) VALUES ($1, $2, $3, $4) RETURNING *;';
  db.any(query, [
    req.body.username,
    passwordHash,
    weightFactor,
    carbonScore
  ])
  .then(function(data){
    console.log('data::::', data);
    console.log('registration successful');
    res.status(200);
    res.redirect('/login');
  })
  .catch(err=>{
    console.log(err);
    res.status(400);
    res.redirect('/register');
  })
})

// search routines --------------------------------------------------
app.get('/search', (req,res) =>{
  res.render('pages/search.ejs');
});

app.post('/search', (req,res) =>{
  const query = `SELECT username, user_carbonscore FROM users WHERE (username LIKE '%' || '${req.body.search}' || '%');`;
  console.log('QUERY:::::', query);
  db.any(query)
    .then(async data=>{
      if(Object.keys(data).length != 0){
        console.log(data);
        res.render('pages/search.ejs', {results: data});
      }else{
        // set this to be an error
        console.log("NOT FOUND")
        res.render('pages/search.ejs');
      }
    })
    .catch(err=>{
      console.log('error:::', err);
    })
});

// !!!! IMPORTANT: THROW EVERYTHING REQUIRING USER AUTHETNTICATION UNDER HERE ------------------------------
// anything above this does not require user login
// everything after here requires user to be logged in
// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  } 
  next();
};

// Authentication Required
app.use(auth); 

// home routines --------------------------------------------------
app.get('/home', (req,res) => {
  res.render('pages/home');
});

// leaderboard routines -------------------------------------------
const leaderboard_all = 'SELECT username, user_carbonscore FROM users ORDER BY user_carbonscore;';
app.get('/leaderboard', (req, res) => {
  db.any(leaderboard_all)
    .then((leaders) => {
      res.render('pages/leaderboard.ejs', {
        leaders,
      });
    });
});

// user profile data routines ------------------------------------
// TODO~~~~
const recent_trips = 'SELECT travel_mode, travel_distance, emissions, date FROM travel WHERE user_id = TODO;';
app.get('/user_trips', (req, res) => {
  db.any(recent_trips)
    .then((user_trip) => {
      res.render('pages/')
    })
})

app.get('/my-profile', (req, res) =>{
  let reroute = '/profile?user=' + USERNAME;
  console.log(reroute);
  res.redirect(reroute);
});

// res.render('pages/login.ejs', {message: err});
app.get('/profile', (req,res) =>{
  let query = `SELECT user_id, username, user_carbonscore FROM users WHERE username = '${req.query.user}';`;

  db.task('get-everything', task=>{
    return task.batch([task.any(query)]);
  })
  .then(data =>{
    console.log('profile for user::::', data);
    let user = data[0][0];
    console.log('user::::', user);
    console.log('user id::::', user.user_id);

    let fetchTravelData = `SELECT * FROM travel WHERE user_id = ${user.user_id}`;
    db.task('get-everything', task=>{
      return task.batch([task.any(fetchTravelData)]);
    })
    .then(data=>{
      let trips = data[0];
      console.log(trips);
      res.render('pages/profile.ejs', {user: user, userTrip: trips});
    })
  })
  .catch(err =>{
    console.log(err);
  })
});

// log routines --------------------------------------------------
app.get('/log', (req,res) => {
  res.render('pages/log', { APIresults: null});
});

app.post('/log', (req, res) => {

  // Dictionary that contains all different activity API calls for different travel modes
  emissionActivityId = {
    "car": 'passenger_vehicle-vehicle_type_black_cab-fuel_source_na-distance_na-engine_size_na',
    "airplane": 'passenger_flight-route_type_domestic-aircraft_type_jet-distance_na-class_na-rf_included',
    "bus": 'passenger_vehicle-vehicle_type_bus-fuel_source_na-distance_na-engine_size_na',
    "train": 'passenger_train-route_type_commuter_rail-fuel_source_na'
  }

  // Travel API call
  axios({
    url: 'https://beta3.api.climatiq.io/estimate',
    method: 'POST',
    dataType: 'json',
    headers: {
      'Authorization': 'Bearer 2NETAQ30MA49W3HN99VP6SCZT6DC',
    },
    data: {
      emission_factor: {
        'activity_id': emissionActivityId[req.body.travel_mode],
      },
      parameters: {
        'passengers': 1,
        'distance': parseInt(req.body.distance),
        'distance_unit': "mi"
      },
    },
  })
    .then(results => {
      const getUserID = "SELECT user_id FROM users WHERE username = $1";
      const travelQuery = "INSERT INTO travel (travel_mode, travel_distance, emissions, date, user_id) VALUES ($1, $2, $3, $4, $5)";

      // First, get the user_id
      db.one(getUserID, [USERNAME])
        .then(user => {
          // Now use the user_id to insert into the travel table
          db.none(travelQuery, [req.body.travel_mode, req.body.distance, results.data.co2e, req.body.travel_date, user.user_id])
            .then(() => {
              const APIresults = {
                co2e: results.data.co2e,
                units: results.data.co2e_unit
              }
              res.render('pages/log', {APIresults});
            })
            .catch(err => {
              console.log("There was an error entering data into the travel table", err);
            });
        })
        .catch(err => {
          console.log("There was an error fetching the user_id", err);
        });   
    })
    .catch(error => {
      res.render('pages/log', {result: [], message: "The API call has failed."});
    });
});

// logout routines --------------------------------------------------
app.get('/logout', (req, res) => {
  // Destroys the session.
  console.log('session destroyed.')
  req.session.destroy();
  res.render("pages/login");
  USERNAME = '';
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests

// app.listen alone: for actual server function
// app.listen(3000);

// module.exports: for testing
module.exports = app.listen(3000);

console.log('Server is listening on port 3000');