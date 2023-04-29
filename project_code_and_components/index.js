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
let travelID = '';

// prevents ' character from messing with strings
async function editString(string){
  string = string.replace(/'/g, '\'\'');
  console.log('EDITED STRING:::', string);

  return string;
}

// temporary default route, probably changing to home page later
app.get('/', (req,res)=>{
    res.redirect('/home');
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
  let processedUsername = await editString(req.body.username);

  // default carbonscore/weight factor
  let carbonScore = 50;
  let weightFactor = 1;

  let checkUser = 'SELECT username FROM users WHERE username = $1;';
  db.any(checkUser, [
    processedUsername
  ])
  .then(function(data){
    console.log('USERNAME RETRIEVE::::', data)
    if(Object.keys(data).length != 0){
      console.log('USERNAME CHECKED AS EXISTENT');
      throw Error('Username taken. Please choose another username.');

    }else{
      // insert into db
      let query = 'INSERT INTO users (username, user_password, user_weightfactor, user_carbonscore, user_description) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
      db.any(query, [
        processedUsername,
        passwordHash,
        weightFactor,
        carbonScore,
        ''
      ])
      .then(function(data){
        console.log('data::::', data);
        console.log('registration successful');
        res.redirect('/login');
      })
    }
  })
  .catch(err=>{
    console.log(err);
    res.render('pages/register.ejs', {message: err, hasError: true});
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
  
// home routines -------------------------------------------
// call this function to generate tips
async function getTip(){
  // TIPS ARRAY: change strings in these to represent tips that someone can recieve
  // NO OTHER code manipulation necessary to access tips
  const tips = [
    'Reduce your energy consumption by turning off lights and unplugging electronics when not in use.',
    'Use public transportation or carpool instead of driving alone.',
    'Switch to energy-efficient light bulbs.',
    'Buy products made from sustainable materials.',
    'Plant trees or support reforestation efforts.',
    'Reduce meat consumption, as livestock farming is a significant source of greenhouse gas emissions.',
    'Use reusable bags, water bottles, and containers instead of single-use plastic items.',
    'Buy locally grown and produced foods to reduce transportation emissions.',
    'Reduce water consumption by taking shorter showers and fixing leaks.',
    'Use a programmable thermostat to regulate heating and cooling.',
    'Choose products with minimal packaging to reduce waste.',
    'Use renewable energy sources like solar or wind power.',
    'Insulate your home to reduce heating and cooling needs.',
    'Support companies and politicians who prioritize environmental protection.',
    'Educate yourself and others about climate change and ways to reduce your carbon footprint.'
  ];

  let i = Math.floor(Math.random() * tips.length);
  return tips[i];
}
  
app.get('/home', async(req,res) => {
  // get tip to render on page
  let tip = await getTip();

  // get the currently logged in user's user_id
  let getUserID = `SELECT user_id FROM users WHERE username = '${USERNAME}';`;
  const userID = await db.any(getUserID);

  // queries to populate user stats
  let fetchEntriesTotal = `SELECT COUNT(*) AS total_entries FROM (SELECT user_id FROM travel WHERE user_id = $1 UNION ALL SELECT user_id FROM food WHERE user_id = $1 UNION ALL SELECT user_id FROM household WHERE user_id = $1) subquery;`;
  const entriesTotal = await db.one(fetchEntriesTotal, [userID[0].user_id]);

  let fetchEmissionsTotal = `SELECT ROUND(SUM(emissions)::numeric, 2) AS total_emissions FROM (SELECT emissions FROM travel WHERE user_id = $1 UNION ALL SELECT emissions FROM food WHERE user_id = $1 UNION ALL SELECT emissions FROM household WHERE user_id = $1) subquery;`;
  const emissionsTotal = await db.one(fetchEmissionsTotal, [userID[0].user_id]);

  let fetchCarbonScore = `SELECT ROUND(user_carbonscore::numeric, 2) AS user_carbonscore FROM users WHERE user_id = $1;`;
  const carbonScore = await db.one(fetchCarbonScore, [userID[0].user_id]);

  let fetchRank = `SELECT row_number FROM (SELECT row_number() OVER(ORDER BY user_carbonscore), user_id, user_carbonscore FROM users) subquery WHERE user_id = $1;`;
  const userRank = await db.one(fetchRank, [userID[0].user_id]);

  // queries to populate global stats
  let fetchPopGlobal = `SELECT COUNT(*) AS population FROM users;`;
  const popGlobal = await db.one(fetchPopGlobal);

  let fetchEntriesGlobal = `SELECT COUNT(*) AS global_entries FROM (SELECT travel_id AS entries FROM travel UNION ALL SELECT food_id AS entries FROM food UNION ALL SELECT household_id AS entries FROM household) subquery;`;
  const entriesGlobal = await db.one(fetchEntriesGlobal);

  let fetchEmissionsGlobal = `SELECT ROUND(SUM(emissions)::numeric, 2) AS global_emissions FROM (SELECT emissions FROM travel UNION ALL SELECT emissions FROM food UNION ALL SELECT emissions FROM household) subquery;`;
  const emissionsGlobal = await db.one(fetchEmissionsGlobal);

  let fetchAvgCarbonscoreGlobal = `SELECT ROUND(AVG(user_carbonscore)::numeric, 2) AS avg_carbonscore FROM users;`;
  const avgCarbonscoreGlobal = await db.one(fetchAvgCarbonscoreGlobal);

  res.render('pages/home', {tip: tip, user: USERNAME, entriesTotal: entriesTotal.total_entries, emissionsTotal: emissionsTotal.total_emissions, carbonScore: carbonScore.user_carbonscore, userRank: userRank.row_number, popGlobal: popGlobal.population, entriesGlobal: entriesGlobal.global_entries, emissionsGlobal: emissionsGlobal.global_emissions, avgCarbonscoreGlobal: avgCarbonscoreGlobal.avg_carbonscore});
});

// leaderboard routines -------------------------------------------
const leaderboard_all = 'SELECT row_number() OVER(ORDER BY user_carbonscore), username, ROUND(user_carbonscore::numeric, 2) AS user_carbonscore FROM users;';
app.get('/leaderboard', (req, res) => {
  db.any(leaderboard_all)
    .then((leaders) => {
      res.render('pages/leaderboard.ejs', {
        leaders,
        user: USERNAME
      });
    });
});

// user profile data routines ------------------------------------
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

app.get('/profile', (req,res) =>{
  let query = `SELECT user_id, username, ROUND(user_carbonscore::numeric, 2) AS user_carbonscore, user_description FROM users WHERE username = '${req.query.user}';`;
  
  // checks to see if this is the logged in user's profile
  let isUser = false;
  if(USERNAME === req.query.user){
    isUser = true;
  }
  console.log('::::EDITABLE:', isUser);

  db.task('get-everything', task=>{
    return task.batch([task.any(query)]);
  })
  .then(data =>{
    console.log('profile for user::::', data);
    let user = data[0][0];
    console.log('user::::', user);
    console.log('user id::::', user.user_id);

    let fetchTravelData = `SELECT travel_mode, travel_distance, ROUND(emissions::numeric, 2) AS emissions, TO_CHAR(date, 'Mon dd, yyyy') AS clean_date FROM travel WHERE user_id = ${user.user_id} ORDER BY date DESC LIMIT 5`;
    let fetchFoodData = `SELECT ROUND(beef_bought::numeric, 2) AS beef_bought, ROUND(dairy_bought::numeric, 2) AS dairy_bought, ROUND(fruits_bought::numeric, 2) AS fruits_bought, ROUND(emissions::numeric, 2) AS emissions, TO_CHAR(date, 'Mon dd, yyyy') AS clean_date FROM food WHERE user_id = ${user.user_id} ORDER BY date DESC LIMIT 5`;
    let fetchHouseholdData = `SELECT ROUND(electricity_used::numeric, 2) AS electricity_used, ROUND((water_used/0.009)::numeric, 2) AS water_used, ROUND(emissions::numeric, 2) AS emissions, TO_CHAR(date, 'Mon dd, yyyy') AS clean_date FROM household WHERE user_id = ${user.user_id} ORDER BY date DESC LIMIT 5`;
    let fetchEmissionTotal = `SELECT ROUND(SUM(emissions)::numeric, 2) AS total_emissions FROM travel WHERE user_id = ${user.user_id};`;
    db.task('get-everything', task=>{
      return task.batch([task.any(fetchTravelData),task.any(fetchFoodData),task.any(fetchHouseholdData),task.any(fetchEmissionTotal)]);
    })
    .then(data=>{
      let trips = data[0];
      let foods = data[1];
      let households = data[2];
      let total = data[3];
      console.log(trips);
      console.log(total);
      res.render('pages/profile.ejs', {user: user, userTrip: trips, foodData: foods ,householdData: households, emissionTotal: total, editing: isUser});
    })
  })
  .catch(err =>{
    console.log(err);
  })
});

app.post('/edit-description', async(req,res)=>{
  let description = await editString(req.body.description);
  console.log('DESCRIPTION::::', description);

  const query = `UPDATE users SET user_description = '${description}' WHERE username = '${USERNAME}' RETURNING *;`;
  console.log(query);
  db.any(query)
    .then(data=>{
      console.log(data);
      let reroute = '/profile?user=' + USERNAME;
      res.redirect(reroute);
    })
    .catch(err =>{
      console.log(err);
    });
});

// log routines --------------------------------------------------
app.get('/log', (req,res) => {
  res.render('pages/log', { 
    travelEmissions: null,
    householdEmissions: null,
    foodEmissions: null
  });
});

// Travel route
app.post('/travel_log', (req, res) => {
  travelActivityID = {
    "car": 'passenger_vehicle-vehicle_type_black_cab-fuel_source_na-distance_na-engine_size_na',
    "airplane": 'passenger_flight-route_type_domestic-aircraft_type_jet-distance_na-class_na-rf_included',
    "bus": 'passenger_vehicle-vehicle_type_bus-fuel_source_na-distance_na-engine_size_na',
    "train": 'passenger_train-route_type_commuter_rail-fuel_source_na'
  }
  axios({
    url: 'https://beta3.api.climatiq.io/estimate',
    method: 'POST',
    dataType: 'json',
    headers: {
      'Authorization': 'Bearer ' +  process.env.API_KEY,
    },
    data: {
      emission_factor: {
        'activity_id': travelActivityID[req.body.travel_mode],
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

      db.one(getUserID, [USERNAME])
        .then(user => {
          db.none(travelQuery, [req.body.travel_mode, req.body.distance, results.data.co2e, req.body.travel_date, user.user_id])
            .then(() => {
              const travelEmissions = {
                co2e: results.data.co2e,
                units: results.data.co2e_unit
              }
              res.render('pages/log', {travelEmissions, householdEmissions: null, foodEmissions: null});
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
      res.render('pages/log', {result: [], message: "One of the travel API calls have failed."});
    });
})

// Household route
app.post('/household_log', (req, res) => {

    // algorithm that factors in light, heat, and phone usage. Units of kWh
    const totalEnergyUsage = (1.23 * parseInt(req.body.light)) + (1.084 * parseInt(req.body.heat)) + (parseInt(req.body.phone) / 0.075);
  
    // algorithm that factors in shower and toile water usage. Units of $
    const totalWaterUsage = 0.009 * ((2.5 * parseInt(req.body.shower)) + (1.28 * parseInt(req.body.toilet)));
    
    (async () => {
      let householdEmissions = 0;
      for (let i = 0; i < 2; i++) {
        try {
          // Household API Call
          const householdAPI = await axios({
            url: 'https://beta3.api.climatiq.io/estimate',
            method: 'POST',
            dataType: 'json',
            headers: {
              'Authorization': 'Bearer ' + process.env.API_KEY,
            },
            data: {
              emission_factor: (() => {
                if (i === 0) {
                  return {
                    "activity_id": "electricity-energy_source_grid_mix",
                    "source": "EPA",
                    "region": "US",
                    "year": "2022",
                    "lca_activity": "electricity_generation"
                  };
                } else {
                  return {
                    "activity_id": "water-supply_wastewater_treatment",
                    "source": "EPA",
                    "region": "US",
                    "year": "2022",
                    "lca_activity": "cradle_to_shelf"
                  };
                }
              })(),
              parameters: (() => {
                if (i === 0) {
                  return {
                    'energy': totalEnergyUsage,
                    'energy_unit': "kWh"
                  };
                } else {
                  return {
                    'money': totalWaterUsage,
                    'money_unit': "usd"
                  };
                }
              })()
            },
          });
          householdEmissions += householdAPI.data.co2e;
        } catch(error) {
            console.log("There is an error processing the household API call", error);
        }
      }
      const getUserID = "SELECT user_id FROM users WHERE username = $1";
      const householdQuery = "INSERT INTO household (electricity_used, water_used, emissions, date, user_id) VALUES ($1, $2, $3, $4, $5)";

      db.one(getUserID, [USERNAME])
        .then(user => {
          db.none(householdQuery, [totalEnergyUsage, totalWaterUsage, householdEmissions, req.body.household_date, user.user_id])
            .then(() => {
              res.render('pages/log', {householdEmissions, travelEmissions: null, foodEmissions: null});
            })
            .catch(err => {
              console.log("There was an error entering data into the household table", err);
            });
        })
        .catch(err => {
          console.log("There was an error fetching the user_id", err);
        });
    })();
})

// Food route
app.post('/food_log', (req,res) => {
  let foodEmissions = 0;
  (async () => {
    for (let i = 0; i < 3; i++) {
      try {
        // Food API Call
        const foodAPI = await axios({
          url: 'https://beta3.api.climatiq.io/estimate',
          method: 'POST',
          dataType: 'json',
          headers: {
            'Authorization': 'Bearer ' + process.env.API_KEY,
          },
          data: {
            emission_factor: (() => {
              if (i === 0) {
                return {
                  "activity_id": "consumer_goods-type_meat_products_beef",
                  "source": "EXIOBASE",
                  "region": "US",
                  "year": "2021",
                  "lca_activity": "unknown"
                };
              } else if (i === 1) {
                return {
                  "activity_id": "consumer_goods-type_dairy_products",
                  "source": "EXIOBASE",
                  "region": "US",
                  "year": "2021",
                  "lca_activity": "unknown"
                };
              } else {
                return {
                  "activity_id": "arable_farming-type_fresh_vegetables_melons_potatoes",
                  "source": "EPA",
                  "region": "US",
                  "year": "2022",
                  "lca_activity": "cradle_to_shelf"
                };
              }
            })(),
            parameters: (() => {
              if (i === 0) {
                return {
                  'money': parseInt(req.body.beef),
                  'money_unit': "usd"
                };
              } else if (i === 1) {
                return {
                  'money': parseInt(req.body.dairy),
                  'money_unit': "usd"
                };
              } else {
                return {
                  'money': parseInt(req.body.fruits),
                  'money_unit': "usd"
                };
              }
            })()
          },
        });
        foodEmissions += foodAPI.data.co2e;
      } catch(error) {
          console.log("There is an error processing the household API call", error);
      }
    }
    const getUserID = "SELECT user_id FROM users WHERE username = $1";
    const foodQuery = "INSERT INTO food (beef_bought, dairy_bought, fruits_bought, emissions, date, user_id) VALUES ($1, $2, $3, $4, $5, $6)";

    db.one(getUserID, [USERNAME])
      .then(user => {
        db.none(foodQuery, [parseInt(req.body.beef), parseInt(req.body.dairy), parseInt(req.body.fruits), foodEmissions, req.body.food_date, user.user_id])
          .then(() => {
            res.render('pages/log', {foodEmissions, travelEmissions: null, householdEmissions: null});
          })
          .catch(err => {
            console.log("There was an error entering data into the food table", err);
          });
      })
      .catch(err => {
        console.log("There was an error fetching the user_id", err);
      });
  })();
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