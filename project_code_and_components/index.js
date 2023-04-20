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
let username = '';

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

        username = req.body.username; // for later use
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

  // carbon score ?????
  let carbonScore = 50;

  // insert into db
  let query = 'INSERT INTO users (username, user_password) VALUES ($1, $2) RETURNING *;';
  db.any(query, [
    req.body.username,
    passwordHash
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

// log routines --------------------------------------------------
app.get('/log', (req,res) => {
  res.render('pages/log.ejs');
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